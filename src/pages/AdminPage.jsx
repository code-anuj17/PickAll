import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { auth, db, firestoreEnabled } from "../lib/firebase";

const ADMIN_EMAIL = String(import.meta.env.VITE_ADMIN_EMAIL || "").trim().toLowerCase();
const USER_COLLECTION_PRIMARY = "Users";
const USER_COLLECTION_FALLBACK = "users";
const REPORT_COLLECTION = "loadPostReports";
const TRACKING_COLLECTION = "tracking";
const ORDER_COLLECTIONS = ["orders", "order"];
const MANAGED_COLLECTIONS = [
  { key: "quoteRequests", label: "Quote Requests" },
  { key: "contactLeads", label: "Contact Leads" },
  { key: "loadAvailability", label: "Load Availability" },
  { key: "truckAvailability", label: "Truck Availability" },
];
const ORDER_STATUS_OPTIONS = ["Pending Confirmation", "Confirmed", "Complete"];
const TRACKING_STATUS_OPTIONS = [
  "Quote Requested",
  "Pending Confirmation",
  "Confirmed",
  "Pickup Scheduled",
  "In Transit",
  "Out for Delivery",
  "Delivered",
  "Cancelled",
];

function normalizeDate(value) {
  if (!value) return "-";
  if (typeof value.toDate === "function") return value.toDate().toLocaleString();
  if (value.seconds) return new Date(value.seconds * 1000).toLocaleString();
  return "-";
}

function normalizeOrderStatus(status) {
  const normalized = String(status || "").trim().toLowerCase();
  if (!normalized) return "Pending Confirmation";
  if (normalized === "pending") return "Pending Confirmation";
  if (normalized === "pending confirmation") return "Pending Confirmation";
  if (normalized === "confirmed") return "Confirmed";
  if (normalized === "complete" || normalized === "completed") return "Complete";
  return status;
}

async function deleteCollectionDocuments(collectionName, batchSize = 200) {
  if (!db) return 0;
  let totalDeleted = 0;

  while (true) {
    const snapshot = await getDocs(query(collection(db, collectionName), limit(batchSize)));
    if (snapshot.empty) break;

    await Promise.all(snapshot.docs.map((item) => deleteDoc(doc(db, collectionName, item.id))));
    totalDeleted += snapshot.docs.length;

    if (snapshot.docs.length < batchSize) break;
  }

  return totalDeleted;
}

async function deleteDocsByField(collectionName, fieldName, fieldValue, batchSize = 200) {
  if (!db) return 0;
  let totalDeleted = 0;

  while (true) {
    const scopedQuery = query(
      collection(db, collectionName),
      where(fieldName, "==", fieldValue),
      limit(batchSize)
    );
    const snapshot = await getDocs(scopedQuery);
    if (snapshot.empty) break;

    await Promise.all(snapshot.docs.map((item) => deleteDoc(doc(db, collectionName, item.id))));
    totalDeleted += snapshot.docs.length;

    if (snapshot.docs.length < batchSize) break;
  }

  return totalDeleted;
}

export default function AdminPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  const [loadingStats, setLoadingStats] = useState(true);
  const [busyCollection, setBusyCollection] = useState("");
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [stats, setStats] = useState({});

  const [orders, setOrders] = useState([]);
  const [statusDrafts, setStatusDrafts] = useState({});
  const [busyOrderKey, setBusyOrderKey] = useState("");

  const [trackingRows, setTrackingRows] = useState([]);
  const [trackingDrafts, setTrackingDrafts] = useState({});
  const [busyTrackingKey, setBusyTrackingKey] = useState("");

  const [users, setUsers] = useState([]);
  const [busyUserKey, setBusyUserKey] = useState("");

  const totalRequests = useMemo(() => {
    return Object.values(stats).reduce((acc, row) => acc + (row?.count || 0), 0);
  }, [stats]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      const email = String(currentUser?.email || "").trim().toLowerCase();
      const allowed = Boolean(currentUser && ADMIN_EMAIL && email === ADMIN_EMAIL);

      setUser(currentUser || null);
      setIsAdmin(allowed);
      setCheckingAuth(false);

      if (!currentUser) {
        navigate("/login", { replace: true });
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  async function loadStats() {
    if (!db || !firestoreEnabled) {
      setError("Firestore is disabled. Admin panel actions are unavailable.");
      setLoadingStats(false);
      return;
    }

    setLoadingStats(true);
    setError("");
    try {
      const result = await Promise.all(
        MANAGED_COLLECTIONS.map(async (item) => {
          const snapshot = await getDocs(collection(db, item.key));
          return [item.key, { count: snapshot.size }];
        })
      );
      setStats(Object.fromEntries(result));
    } catch (statsErr) {
      console.error("Failed to load admin stats:", statsErr);
      setError("Could not load request data. Please refresh.");
    } finally {
      setLoadingStats(false);
    }
  }

  async function loadOrders() {
    if (!db || !firestoreEnabled) {
      setOrders([]);
      return;
    }

    try {
      const snapshots = await Promise.all(
        ORDER_COLLECTIONS.map(async (name) => {
          const snapshot = await getDocs(collection(db, name));
          return { name, docs: snapshot.docs };
        })
      );

      const rows = snapshots.flatMap((bucket) =>
        bucket.docs.map((item) => ({
          id: item.id,
          collectionName: bucket.name,
          ...item.data(),
        }))
      );

      rows.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
      setOrders(rows);

      const nextDrafts = {};
      rows.forEach((row) => {
        const key = `${row.collectionName}:${row.id}`;
        nextDrafts[key] = normalizeOrderStatus(row.status);
      });
      setStatusDrafts(nextDrafts);
    } catch (ordersErr) {
      console.error("Failed to load orders in admin:", ordersErr);
      setError("Could not load orders for admin management.");
    }
  }

  async function loadTracking() {
    if (!db || !firestoreEnabled) {
      setTrackingRows([]);
      return;
    }

    try {
      const snapshot = await getDocs(collection(db, TRACKING_COLLECTION));
      const rows = snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
      rows.sort((a, b) => (b.updatedAt?.seconds || 0) - (a.updatedAt?.seconds || 0));
      setTrackingRows(rows);

      const nextDrafts = {};
      rows.forEach((row) => {
        nextDrafts[row.id] = String(row.status || "Quote Requested");
      });
      setTrackingDrafts(nextDrafts);
    } catch (trackingErr) {
      console.error("Failed to load tracking records:", trackingErr);
      setError("Could not load tracking records.");
    }
  }

  async function loadUsers() {
    if (!db || !firestoreEnabled) {
      setUsers([]);
      return;
    }

    try {
      const [primary, fallback] = await Promise.all([
        getDocs(collection(db, USER_COLLECTION_PRIMARY)),
        getDocs(collection(db, USER_COLLECTION_FALLBACK)),
      ]);

      const merged = new Map();

      primary.docs.forEach((item) => {
        merged.set(item.id, {
          uid: item.id,
          source: USER_COLLECTION_PRIMARY,
          ...item.data(),
        });
      });

      fallback.docs.forEach((item) => {
        const existing = merged.get(item.id);
        const data = item.data();
        merged.set(item.id, {
          uid: item.id,
          source: existing?.source || USER_COLLECTION_FALLBACK,
          ...data,
          ...(existing || {}),
          ...data,
        });
      });

      const reportsSnap = await getDocs(collection(db, REPORT_COLLECTION));
      const reportCountByUserId = {};
      const reportCountByEmail = {};

      reportsSnap.docs.forEach((item) => {
        const data = item.data() || {};
        const uid = String(data.reportedUserId || "").trim();
        const ownerEmail = String(data.ownerEmail || "").trim().toLowerCase();
        if (uid) {
          reportCountByUserId[uid] = (reportCountByUserId[uid] || 0) + 1;
        }
        if (ownerEmail) {
          reportCountByEmail[ownerEmail] = (reportCountByEmail[ownerEmail] || 0) + 1;
        }
      });

      const rows = Array.from(merged.values()).map((row) => {
        const emailKey = String(row.email || "").trim().toLowerCase();
        const calculated = (reportCountByUserId[row.uid] || 0) + (reportCountByEmail[emailKey] || 0);
        const profileCount = Number(row.reportCount || 0);
        return {
          ...row,
          effectiveReportCount: Math.max(profileCount, calculated),
        };
      }).sort((a, b) => {
        const aCount = Number(a.effectiveReportCount || 0);
        const bCount = Number(b.effectiveReportCount || 0);
        return bCount - aCount;
      });

      setUsers(rows);
    } catch (usersErr) {
      console.error("Failed to load users:", usersErr);
      setError("Could not load users for moderation.");
    }
  }

  useEffect(() => {
    if (!checkingAuth && isAdmin) {
      Promise.all([loadStats(), loadOrders(), loadTracking(), loadUsers()]);
    }
  }, [checkingAuth, isAdmin]);

  async function refreshAll() {
    await Promise.all([loadStats(), loadOrders(), loadTracking(), loadUsers()]);
  }

  async function updateOrderStatus(order) {
    const key = `${order.collectionName}:${order.id}`;
    const nextStatus = statusDrafts[key] || "Pending Confirmation";

    setBusyOrderKey(key);
    setError("");
    setNotice("");

    try {
      await updateDoc(doc(db, order.collectionName, order.id), {
        status: nextStatus,
        updatedAt: serverTimestamp(),
      });
      setNotice(`Order ${order.id} moved to ${nextStatus}.`);
      await loadOrders();
    } catch (updateErr) {
      console.error("Failed to update order status:", updateErr);
      setError("Unable to update order status. Please check Firestore rules.");
    } finally {
      setBusyOrderKey("");
    }
  }

  async function updateTrackingStatus(row) {
    const nextStatus = trackingDrafts[row.id] || row.status || "Quote Requested";
    setBusyTrackingKey(row.id);
    setError("");
    setNotice("");

    try {
      await updateDoc(doc(db, TRACKING_COLLECTION, row.id), {
        status: nextStatus,
        updatedAt: serverTimestamp(),
      });
      setNotice(`Tracking ${row.id} updated to ${nextStatus}.`);
      await loadTracking();
    } catch (updateErr) {
      console.error("Failed to update tracking status:", updateErr);
      setError("Unable to update tracking status. Please check Firestore rules.");
    } finally {
      setBusyTrackingKey("");
    }
  }

  async function removeTrackingRow(row) {
    const ok = window.confirm(`Delete tracking entry ${row.id}?`);
    if (!ok) return;

    setBusyTrackingKey(row.id);
    setError("");
    setNotice("");

    try {
      await deleteDoc(doc(db, TRACKING_COLLECTION, row.id));
      setNotice(`Tracking ${row.id} deleted.`);
      await loadTracking();
      await loadStats();
    } catch (removeErr) {
      console.error("Failed to delete tracking row:", removeErr);
      setError("Unable to delete tracking entry. Please check Firestore rules.");
    } finally {
      setBusyTrackingKey("");
    }
  }

  async function setUserBanState(targetUser, nextBan) {
    const key = targetUser.uid;
    setBusyUserKey(key);
    setError("");
    setNotice("");

    try {
      const payload = {
        banned: nextBan,
        deletedByAdmin: false,
        banReason: nextBan ? "Banned by admin due to fraud reports" : "",
        lastWarning: nextBan
          ? "Account banned by admin due to repeated or serious policy violations."
          : String(targetUser.lastWarning || ""),
        updatedAt: serverTimestamp(),
      };

      await Promise.all([
        setDoc(doc(db, USER_COLLECTION_PRIMARY, targetUser.uid), payload, { merge: true }),
        setDoc(doc(db, USER_COLLECTION_FALLBACK, targetUser.uid), payload, { merge: true }),
      ]);

      setNotice(nextBan ? `User ${targetUser.uid} is banned.` : `User ${targetUser.uid} is unbanned.`);
      await loadUsers();
    } catch (banErr) {
      console.error("Failed to update user ban:", banErr);
      setError("Unable to update user status. Please check Firestore rules.");
    } finally {
      setBusyUserKey("");
    }
  }

  async function deleteUserAppData(targetUser) {
    const ok = window.confirm(
      `Permanently delete account for ${targetUser.email || targetUser.uid}? This will remove all profile data, marketplace posts, and reports. This cannot be undone.`
    );
    if (!ok) return;

    const key = targetUser.uid;
    setBusyUserKey(key);
    setError("");
    setNotice("");

    try {
      // Delete user profile from both collection variants
      await Promise.all([
        deleteDoc(doc(db, USER_COLLECTION_PRIMARY, targetUser.uid)),
        deleteDoc(doc(db, USER_COLLECTION_FALLBACK, targetUser.uid)),
      ]);

      const removedCounts = await Promise.all([
        deleteDocsByField("loadAvailability", "userId", targetUser.uid),
        deleteDocsByField("truckAvailability", "userId", targetUser.uid),
        deleteDocsByField(REPORT_COLLECTION, "reportedUserId", targetUser.uid),
        deleteDocsByField(REPORT_COLLECTION, "reporterUserId", targetUser.uid),
        deleteDocsByField("orders", "userId", targetUser.uid),
        deleteDocsByField("order", "userId", targetUser.uid),
      ]);

      setNotice(
        `User account permanently deleted for ${targetUser.uid}. Removed ${removedCounts.reduce((a, b) => a + b, 0)} associated records.`
      );
      await refreshAll();
    } catch (removeErr) {
      console.error("Failed to delete user account:", removeErr);
      setError("Unable to delete user account. Please check Firestore rules.");
    } finally {
      setBusyUserKey("");
    }
  }

  async function handleClearCollection(collectionName) {
    const ok = window.confirm(`Delete all records from ${collectionName}? This cannot be undone.`);
    if (!ok) return;

    setBusyCollection(collectionName);
    setError("");
    setNotice("");

    try {
      const removed = await deleteCollectionDocuments(collectionName);
      setNotice(`${removed} records removed from ${collectionName}.`);
      await loadStats();
    } catch (clearErr) {
      console.error(`Failed to clear ${collectionName}:`, clearErr);
      setError(`Unable to clear ${collectionName}. Please check Firestore rules.`);
    } finally {
      setBusyCollection("");
    }
  }

  async function handleClearAll() {
    const ok = window.confirm("Delete all request data from all managed collections? This cannot be undone.");
    if (!ok) return;

    setBusyCollection("__all__");
    setError("");
    setNotice("");

    try {
      const removedCounts = await Promise.all(
        MANAGED_COLLECTIONS.map(async (item) => {
          const removed = await deleteCollectionDocuments(item.key);
          return `${item.label}: ${removed}`;
        })
      );
      setNotice(`All request data removed. ${removedCounts.join(" | ")}`);
      await loadStats();
    } catch (clearErr) {
      console.error("Failed to clear all collections:", clearErr);
      setError("Unable to clear all collections. Please check Firestore rules.");
    } finally {
      setBusyCollection("");
    }
  }

  if (checkingAuth) {
    return (
      <section className="section-shell py-14">
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-slate-600">
          Checking admin access...
        </div>
      </section>
    );
  }

  if (!isAdmin) {
    return (
      <section className="section-shell py-14">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-10 text-center text-red-700">
          <h2 className="text-2xl font-bold">Access denied</h2>
          <p className="mt-2 text-sm">This page is available only for the website owner admin account.</p>
          <Link to="/" className="mt-5 inline-block rounded-lg bg-slate-900 px-4 py-2 text-sm text-white">
            Go Home
          </Link>
        </div>
      </section>
    );
  }

  return (
    <div className="soft-enter">
      <section className="brand-gradient overflow-hidden text-white">
        <div className="section-shell py-14">
          <h1 className="text-4xl font-bold sm:text-5xl">Admin Control Panel</h1>
          <p className="mt-3 max-w-2xl text-slate-100/90">
            Moderate users, manage order and tracking status, and remove fraudulent data.
          </p>
          <p className="mt-2 text-sm text-slate-100/80">Admin: {user?.email}</p>
        </div>
      </section>

      <section className="section-shell py-12">
        {error && <p className="mb-4 rounded bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        {notice && <p className="mb-4 rounded bg-emerald-50 p-3 text-sm text-emerald-700">{notice}</p>}

        <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4">
          <div>
            <p className="text-sm text-slate-600">Total managed requests</p>
            <p className="text-3xl font-bold text-[var(--brand-700)]">{loadingStats ? "..." : totalRequests}</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={refreshAll}
              disabled={busyCollection !== ""}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 disabled:opacity-60"
            >
              Refresh
            </button>
            <button
              onClick={handleClearAll}
              disabled={busyCollection !== "" || loadingStats}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
            >
              {busyCollection === "__all__" ? "Clearing..." : "Clear All Requests"}
            </button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {MANAGED_COLLECTIONS.map((item) => (
            <div key={item.key} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="text-lg font-bold">{item.label}</h3>
              <p className="mt-1 text-sm text-slate-600">Collection: {item.key}</p>
              <p className="mt-4 text-3xl font-bold text-[var(--brand-700)]">
                {loadingStats ? "..." : stats[item.key]?.count || 0}
              </p>
              <button
                onClick={() => handleClearCollection(item.key)}
                disabled={busyCollection !== "" || loadingStats || (stats[item.key]?.count || 0) === 0}
                className="mt-4 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
              >
                {busyCollection === item.key ? "Removing..." : "Remove All"}
              </button>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h3 className="text-xl font-bold">Orders Management</h3>
            <p className="text-sm text-slate-600">Pending Confirmation to Confirmed to Complete</p>
          </div>

          {orders.length === 0 ? (
            <p className="text-sm text-slate-500">No orders available right now.</p>
          ) : (
            <div className="overflow-auto">
              <table className="min-w-full border border-slate-200 text-left text-sm">
                <thead className="bg-slate-100">
                  <tr>
                    <th className="border-b p-3">Order ID</th>
                    <th className="border-b p-3">Collection</th>
                    <th className="border-b p-3">Pickup</th>
                    <th className="border-b p-3">Drop</th>
                    <th className="border-b p-3">Current Status</th>
                    <th className="border-b p-3">Created</th>
                    <th className="border-b p-3">Change Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.slice(0, 200).map((order) => {
                    const rowKey = `${order.collectionName}:${order.id}`;
                    const currentStatus = normalizeOrderStatus(order.status);

                    return (
                      <tr key={rowKey} className="border-b">
                        <td className="p-3 font-medium">{order.id}</td>
                        <td className="p-3">{order.collectionName}</td>
                        <td className="p-3">{order.pickupLocation || order.pickupCity || "-"}</td>
                        <td className="p-3">{order.deliveryLocation || order.dropCity || "-"}</td>
                        <td className="p-3">{currentStatus}</td>
                        <td className="p-3">{normalizeDate(order.createdAt)}</td>
                        <td className="p-3">
                          <div className="flex min-w-[230px] items-center gap-2">
                            <select
                              value={statusDrafts[rowKey] || currentStatus}
                              onChange={(event) =>
                                setStatusDrafts((prev) => ({
                                  ...prev,
                                  [rowKey]: event.target.value,
                                }))
                              }
                              className="rounded border border-slate-300 p-2"
                            >
                              {ORDER_STATUS_OPTIONS.map((option) => (
                                <option key={option} value={option}>
                                  {option}
                                </option>
                              ))}
                            </select>
                            <button
                              onClick={() => updateOrderStatus(order)}
                              disabled={busyOrderKey !== "" || (statusDrafts[rowKey] || currentStatus) === currentStatus}
                              className="rounded bg-[var(--brand-700)] px-3 py-2 text-white disabled:opacity-60"
                            >
                              {busyOrderKey === rowKey ? "Saving..." : "Save"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="mt-8 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h3 className="text-xl font-bold">Tracking Management</h3>
            <p className="text-sm text-slate-600">Update shipment status and remove invalid tracking rows.</p>
          </div>

          {trackingRows.length === 0 ? (
            <p className="text-sm text-slate-500">No tracking records available.</p>
          ) : (
            <div className="overflow-auto">
              <table className="min-w-full border border-slate-200 text-left text-sm">
                <thead className="bg-slate-100">
                  <tr>
                    <th className="border-b p-3">Tracking ID</th>
                    <th className="border-b p-3">From</th>
                    <th className="border-b p-3">To</th>
                    <th className="border-b p-3">Current Status</th>
                    <th className="border-b p-3">Updated</th>
                    <th className="border-b p-3">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {trackingRows.slice(0, 200).map((row) => {
                    const currentStatus = String(row.status || "Quote Requested");
                    return (
                      <tr key={row.id} className="border-b">
                        <td className="p-3 font-medium">{row.id}</td>
                        <td className="p-3">{row.fromCity || "-"}</td>
                        <td className="p-3">{row.toCity || "-"}</td>
                        <td className="p-3">{currentStatus}</td>
                        <td className="p-3">{normalizeDate(row.updatedAt)}</td>
                        <td className="p-3">
                          <div className="flex min-w-[280px] items-center gap-2">
                            <select
                              value={trackingDrafts[row.id] || currentStatus}
                              onChange={(event) =>
                                setTrackingDrafts((prev) => ({
                                  ...prev,
                                  [row.id]: event.target.value,
                                }))
                              }
                              className="rounded border border-slate-300 p-2"
                            >
                              {TRACKING_STATUS_OPTIONS.map((option) => (
                                <option key={option} value={option}>
                                  {option}
                                </option>
                              ))}
                            </select>
                            <button
                              onClick={() => updateTrackingStatus(row)}
                              disabled={busyTrackingKey !== "" || (trackingDrafts[row.id] || currentStatus) === currentStatus}
                              className="rounded bg-[var(--brand-700)] px-3 py-2 text-white disabled:opacity-60"
                            >
                              {busyTrackingKey === row.id ? "Saving..." : "Save"}
                            </button>
                            <button
                              onClick={() => removeTrackingRow(row)}
                              disabled={busyTrackingKey !== ""}
                              className="rounded border border-red-300 px-3 py-2 text-red-700 disabled:opacity-60"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="mt-8 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h3 className="text-xl font-bold">Users & Fraud Moderation</h3>
            <p className="text-sm text-slate-600">Warn, ban, unban, or remove user app data.</p>
          </div>

          <p className="mb-4 rounded bg-slate-50 p-3 text-xs text-slate-600">
            Note: Client-side admin can ban users and remove user app data. Permanent Firebase Authentication account deletion
            for other users requires Firebase Admin SDK on a secure backend/Cloud Function.
          </p>

          {users.length === 0 ? (
            <p className="text-sm text-slate-500">No user profiles found.</p>
          ) : (
            <div className="overflow-auto">
              <table className="min-w-full border border-slate-200 text-left text-sm">
                <thead className="bg-slate-100">
                  <tr>
                    <th className="border-b p-3">UID</th>
                    <th className="border-b p-3">Email</th>
                    <th className="border-b p-3">Role</th>
                    <th className="border-b p-3">Reports</th>
                    <th className="border-b p-3">Warning</th>
                    <th className="border-b p-3">Status</th>
                    <th className="border-b p-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.slice(0, 250).map((row) => {
                    const key = row.uid;
                    const banned = Boolean(row.banned || row.deletedByAdmin);
                    const isDeleted = Boolean(row.deletedByAdmin);
                    return (
                      <tr key={row.uid} className="border-b">
                        <td className="p-3 font-medium">{row.uid}</td>
                        <td className="p-3">{row.email || "-"}</td>
                        <td className="p-3">{row.role || "-"}</td>
                        <td className="p-3">{Number(row.effectiveReportCount || 0)}</td>
                        <td className="p-3">{row.lastWarning || "-"}</td>
                        <td className="p-3">
                          {isDeleted ? (
                            <span className="rounded bg-red-100 px-2 py-1 text-xs text-red-700">Deleted</span>
                          ) : banned ? (
                            <span className="rounded bg-amber-100 px-2 py-1 text-xs text-amber-700">Banned</span>
                          ) : (
                            <span className="rounded bg-emerald-100 px-2 py-1 text-xs text-emerald-700">Active</span>
                          )}
                        </td>
                        <td className="p-3">
                          <div className="flex min-w-[280px] items-center gap-2">
                            <button
                              onClick={() => setUserBanState(row, !banned)}
                              disabled={busyUserKey !== "" || isDeleted}
                              className="rounded bg-[var(--brand-700)] px-3 py-2 text-white disabled:opacity-60"
                            >
                              {busyUserKey === key ? "Working..." : banned ? "Unban" : "Ban"}
                            </button>
                            <button
                              onClick={() => deleteUserAppData(row)}
                              disabled={busyUserKey !== ""}
                              className="rounded border border-red-300 px-3 py-2 text-red-700 disabled:opacity-60"
                            >
                              Delete User Data
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
