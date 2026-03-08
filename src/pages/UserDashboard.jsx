import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  EmailAuthProvider,
  deleteUser,
  onAuthStateChanged,
  reauthenticateWithCredential,
  signOut,
  updatePassword,
  updateProfile,
} from "firebase/auth";
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
  where,
} from "firebase/firestore";
import { auth, db, firestoreEnabled } from "../lib/firebase";

const NAV_ITEMS = ["Dashboard", "Orders", "Addresses", "Account details", "Log out"];
const USER_COLLECTION_PRIMARY = "Users";
const USER_COLLECTION_FALLBACK = "users";
const ORDER_COLLECTIONS = ["order", "orders"];

const emptyShipping = {
  firstName: "",
  lastName: "",
  company: "",
  country: "India",
  streetAddress: "",
  apartment: "",
  city: "",
  state: "",
  pincode: "",
};

const emptyBilling = {
  firstName: "",
  lastName: "",
  company: "",
  country: "India",
  streetAddress: "",
  apartment: "",
  city: "",
  state: "",
  pincode: "",
  phone: "",
  email: "",
};

const emptyPasswordForm = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

const profileCacheKey = (uid) => `pickall:account-profile:${uid}`;

function readProfileCache(uid) {
  if (!uid) return null;
  try {
    const raw = localStorage.getItem(profileCacheKey(uid));
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return {
      firstName: String(parsed.firstName || ""),
      lastName: String(parsed.lastName || ""),
      displayName: String(parsed.displayName || ""),
      email: String(parsed.email || ""),
    };
  } catch {
    return null;
  }
}

function writeProfileCache(uid, data) {
  if (!uid) return;
  try {
    localStorage.setItem(
      profileCacheKey(uid),
      JSON.stringify({
        firstName: String(data.firstName || ""),
        lastName: String(data.lastName || ""),
        displayName: String(data.displayName || ""),
        email: String(data.email || ""),
      })
    );
  } catch {
    // Ignore cache failures silently.
  }
}

function clearProfileCache(uid) {
  if (!uid) return;
  try {
    localStorage.removeItem(profileCacheKey(uid));
  } catch {
    // Ignore cache cleanup failures.
  }
}

function withTimeout(promise, ms, timeoutMessage) {
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error(timeoutMessage)), ms)),
  ]);
}

function toFormAddress(address = {}, includeContact = false) {
  const next = {
    firstName: String(address.firstName || ""),
    lastName: String(address.lastName || ""),
    company: String(address.company || ""),
    country: String(address.country || "India"),
    streetAddress: String(address.streetAddress || ""),
    apartment: String(address.apartment || ""),
    city: String(address.city || ""),
    state: String(address.state || ""),
    pincode: address.pincode === undefined || address.pincode === null ? "" : String(address.pincode),
  };

  if (includeContact) {
    next.phone = String(address.phone || "");
    next.email = String(address.email || "");
  }

  return next;
}

function toFirestoreAddress(address = {}, includeContact = false) {
  const next = {
    firstName: String(address.firstName || "").trim(),
    lastName: String(address.lastName || "").trim(),
    company: String(address.company || "").trim(),
    country: String(address.country || "").trim(),
    streetAddress: String(address.streetAddress || "").trim(),
    apartment: String(address.apartment || "").trim(),
    city: String(address.city || "").trim(),
    state: String(address.state || "").trim(),
    pincode: Number(String(address.pincode || "").trim()),
  };

  if (includeContact) {
    next.phone = String(address.phone || "").trim();
    next.email = String(address.email || "").trim();
  }

  return next;
}

function normalizeDate(createdAt) {
  if (!createdAt) return "-";
  if (typeof createdAt.toDate === "function") return createdAt.toDate().toLocaleString();
  if (createdAt.seconds) return new Date(createdAt.seconds * 1000).toLocaleString();
  return "-";
}

function getRouteMeta(pathname) {
  const parts = pathname.split("/").filter(Boolean);
  const section = parts[1] || "dashboard";
  const addressType = parts[2] || "";
  return { section, addressType };
}

function isAddressFilled(address) {
  if (!address) return false;
  return Boolean(
    String(address.firstName || "").trim() ||
      String(address.lastName || "").trim() ||
      String(address.streetAddress || "").trim() ||
      String(address.city || "").trim()
  );
}

export default function UserDashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [userCollectionName, setUserCollectionName] = useState(USER_COLLECTION_PRIMARY);

  const [account, setAccount] = useState({
    firstName: "",
    lastName: "",
    displayName: "",
    email: "",
  });
  const [shippingAddress, setShippingAddress] = useState(emptyShipping);
  const [billingAddress, setBillingAddress] = useState(emptyBilling);
  const [passwordForm, setPasswordForm] = useState(emptyPasswordForm);
  const [deletePassword, setDeletePassword] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [savingAccount, setSavingAccount] = useState(false);
  const [savingAddress, setSavingAddress] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);
  const [showPassword, setShowPassword] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  const { section, addressType } = useMemo(() => getRouteMeta(location.pathname), [location.pathname]);

  const activeTab = useMemo(() => {
    if (section === "orders") return "Orders";
    if (section === "addresses" || section === "edit-address") return "Addresses";
    if (section === "account-details") return "Account details";
    return "Dashboard";
  }, [section]);

  const welcomeName = useMemo(() => {
    if (account.displayName?.trim()) return account.displayName;
    if (user?.displayName?.trim()) return user.displayName;
    return user?.email?.split("@")[0] || "user";
  }, [account.displayName, user]);

  useEffect(() => {
    const validSections = ["dashboard", "orders", "addresses", "account-details", "edit-address"];
    if (!validSections.includes(section)) {
      navigate("/my-account/dashboard", { replace: true });
      return;
    }
    if (section === "edit-address" && !["billing", "shipping"].includes(addressType)) {
      navigate("/my-account/addresses", { replace: true });
    }
  }, [section, addressType, navigate]);

  useEffect(() => {
    let mounted = true;

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!mounted) return;
      if (!currentUser) {
        navigate("/login");
        return;
      }

      setUser(currentUser);
      const cachedProfile = readProfileCache(currentUser.uid);
      setAccount((prev) => ({
        firstName: cachedProfile?.firstName || prev.firstName || "",
        lastName: cachedProfile?.lastName || prev.lastName || "",
        displayName: cachedProfile?.displayName || currentUser.displayName || prev.displayName || "",
        email: cachedProfile?.email || currentUser.email || prev.email || "",
      }));

      if (!firestoreEnabled || !db) {
        setNotice("Firebase Firestore is disabled. Dashboard will show local account info only.");
        setLoading(false);
        return;
      }

      try {
        const primaryRef = doc(db, USER_COLLECTION_PRIMARY, currentUser.uid);
        const primarySnap = await withTimeout(getDoc(primaryRef), 9000, "Timed out while loading profile");

        let profileSnap = primarySnap;
        if (primarySnap.exists()) {
          setUserCollectionName(USER_COLLECTION_PRIMARY);
        } else {
          const fallbackRef = doc(db, USER_COLLECTION_FALLBACK, currentUser.uid);
          const fallbackSnap = await withTimeout(getDoc(fallbackRef), 9000, "Timed out while loading profile");
          if (fallbackSnap.exists()) {
            profileSnap = fallbackSnap;
            setUserCollectionName(USER_COLLECTION_FALLBACK);
          }
        }

        if (profileSnap.exists()) {
          const data = profileSnap.data();
          const nextAccount = {
            firstName: String(data.firstName || ""),
            lastName: String(data.lastName || ""),
            displayName: String(data.displayName || currentUser.displayName || ""),
            email: String(data.email || currentUser.email || ""),
          };
          setAccount(nextAccount);
          writeProfileCache(currentUser.uid, nextAccount);
          setShippingAddress({ ...emptyShipping, ...toFormAddress(data.shippingAddress, false) });
          setBillingAddress({
            ...emptyBilling,
            ...toFormAddress(data.billingAddress, true),
            email: String(data.billingAddress?.email || data.email || currentUser.email || ""),
          });
        } else {
          setBillingAddress((prev) => ({ ...prev, email: currentUser.email || "" }));
        }

        const orderSnapshots = await Promise.all(
          ORDER_COLLECTIONS.map(async (name) => {
            try {
              const orderQuery = query(collection(db, name), where("userId", "==", currentUser.uid), limit(30));
              return await withTimeout(getDocs(orderQuery), 9000, `Timed out while loading ${name}`);
            } catch {
              return null;
            }
          })
        );

        const rows = orderSnapshots
          .filter(Boolean)
          .flatMap((snap) => snap.docs.map((d) => ({ id: d.id, ...d.data() })));
        rows.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
        setOrders(rows);
      } catch (err) {
        const text = String(err?.message || "").toLowerCase();
        if (text.includes("offline") || text.includes("timed out") || text.includes("network")) {
          setNotice("Dashboard data is temporarily unavailable due to connectivity. You can still navigate account pages.");
        } else {
          setError("Unable to load dashboard data right now.");
          console.error(err);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    });

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, [navigate]);

  const navigateTab = (tab) => {
    if (tab === "Dashboard") navigate("/my-account/dashboard");
    if (tab === "Orders") navigate("/my-account/orders");
    if (tab === "Addresses") navigate("/my-account/addresses");
    if (tab === "Account details") navigate("/my-account/account-details");
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  const saveAddresses = async (type) => {
    setError("");
    setNotice("");

    if (!user || !db) {
      setError("Please login again to continue.");
      return;
    }

    const address = type === "billing" ? billingAddress : shippingAddress;
    const required =
      type === "billing"
        ? [
            "firstName",
            "lastName",
            "country",
            "streetAddress",
            "apartment",
            "city",
            "state",
            "pincode",
            "phone",
            "email",
          ]
        : ["firstName", "lastName", "country", "streetAddress", "apartment", "city", "state", "pincode"];

    const hasMissing = required.some((key) => !String(address[key] || "").trim());
    const pincodeOk = /^\d+$/.test(String(address.pincode || "").trim());

    if (hasMissing) {
      setError("Please fill all required fields. Company is optional.");
      return;
    }

    if (!pincodeOk) {
      setError("PIN Code must contain only numbers.");
      return;
    }

    try {
      setSavingAddress(true);
      const payload = {
        updatedAt: serverTimestamp(),
      };

      if (type === "billing") {
        payload.billingAddress = toFirestoreAddress(billingAddress, true);
      } else {
        payload.shippingAddress = toFirestoreAddress(shippingAddress, false);
      }

      await setDoc(doc(db, userCollectionName, user.uid), payload, { merge: true });
      setNotice(`${type === "billing" ? "Billing" : "Shipping"} address saved.`);
      navigate("/my-account/addresses");
    } catch (err) {
      setError("Unable to save address right now.");
      console.error(err);
    } finally {
      setSavingAddress(false);
    }
  };

  const saveAccountDetails = async () => {
    setError("");
    setNotice("");

    if (!user) {
      setError("Please login again to continue.");
      return;
    }

    if (!account.firstName.trim() || !account.lastName.trim() || !account.displayName.trim()) {
      setError("First name, last name and display name are required.");
      return;
    }

    const wantsPasswordChange =
      passwordForm.currentPassword.trim() || passwordForm.newPassword.trim() || passwordForm.confirmPassword.trim();

    if (wantsPasswordChange) {
      if (!passwordForm.currentPassword.trim() || !passwordForm.newPassword.trim() || !passwordForm.confirmPassword.trim()) {
        setError("To change password, fill current, new, and confirm password fields.");
        return;
      }
      if (passwordForm.newPassword !== passwordForm.confirmPassword) {
        setError("New password and confirm password do not match.");
        return;
      }
      if (passwordForm.newPassword.length < 6) {
        setError("New password must be at least 6 characters.");
        return;
      }
    }

    try {
      setSavingAccount(true);

      if (wantsPasswordChange) {
        if (!user.email) {
          setError("Cannot change password for this account type.");
          return;
        }
        const credential = EmailAuthProvider.credential(user.email, passwordForm.currentPassword);
        await withTimeout(
          reauthenticateWithCredential(user, credential),
          10000,
          "Timed out while verifying current password"
        );
        await withTimeout(updatePassword(user, passwordForm.newPassword), 10000, "Timed out while updating password");
      }

      await withTimeout(updateProfile(user, { displayName: account.displayName.trim() }), 10000, "Timed out while updating profile");

      const updatedAccount = {
        firstName: account.firstName.trim(),
        lastName: account.lastName.trim(),
        displayName: account.displayName.trim(),
        email: account.email,
      };

      let cloudSyncDelayed = false;
      if (db && firestoreEnabled) {
        try {
          await withTimeout(
            setDoc(
              doc(db, userCollectionName, user.uid),
              {
                ...updatedAccount,
                updatedAt: serverTimestamp(),
              },
              { merge: true }
            ),
            10000,
            "Timed out while syncing account details"
          );
        } catch (syncErr) {
          const syncMsg = String(syncErr?.message || "").toLowerCase();
          if (
            syncMsg.includes("timed out") ||
            syncMsg.includes("offline") ||
            syncMsg.includes("network")
          ) {
            cloudSyncDelayed = true;
            console.warn("Firestore account sync delayed:", syncErr);
          } else {
            throw syncErr;
          }
        }
      }

      setAccount((prev) => ({ ...prev, ...updatedAccount }));
      writeProfileCache(user.uid, updatedAccount);
      setPasswordForm(emptyPasswordForm);
      setNotice(
        cloudSyncDelayed
          ? "Account updated successfully. Cloud sync is delayed due to connectivity and will retry automatically."
          : "Account details updated successfully."
      );
    } catch (err) {
      const code = err?.code || "";
      const msg = String(err?.message || "");

      if (code === "auth/invalid-credential" || code === "auth/wrong-password") {
        setError("Current password is incorrect. Enter the right current password and try again.");
      } else if (code === "auth/too-many-requests") {
        setError("Too many failed attempts. Please wait a few minutes and try again.");
      } else if (msg.toLowerCase().includes("timed out")) {
        setError("Request timed out. Please check your internet connection and try again.");
      } else {
        setError("Unable to update account details right now.");
      }
      console.error(err);
    } finally {
      setSavingAccount(false);
    }
  };

  const handleDeleteAccount = async () => {
    setError("");
    setNotice("");

    if (!user || !user.email) {
      setError("Please login again to delete your account.");
      return;
    }

    if (!deleteConfirm) {
      setError("Please confirm account deletion before continuing.");
      return;
    }

    if (!deletePassword.trim()) {
      setError("Enter your current password to delete your account.");
      return;
    }

    try {
      setDeletingAccount(true);

      const credential = EmailAuthProvider.credential(user.email, deletePassword);
      await withTimeout(
        reauthenticateWithCredential(user, credential),
        10000,
        "Timed out while verifying password"
      );

      if (db && firestoreEnabled) {
        // Best-effort cleanup for user profile docs in both collection variants.
        await Promise.allSettled([
          withTimeout(deleteDoc(doc(db, USER_COLLECTION_PRIMARY, user.uid)), 10000, "Timed out deleting Users profile"),
          withTimeout(deleteDoc(doc(db, USER_COLLECTION_FALLBACK, user.uid)), 10000, "Timed out deleting users profile"),
        ]);
      }

      await withTimeout(deleteUser(user), 10000, "Timed out while deleting account");
      clearProfileCache(user.uid);
      navigate("/register", { replace: true });
    } catch (err) {
      const code = err?.code || "";
      const msg = String(err?.message || "").toLowerCase();

      if (code === "auth/invalid-credential" || code === "auth/wrong-password") {
        setError("Current password is incorrect. Please try again.");
      } else if (code === "auth/too-many-requests") {
        setError("Too many attempts. Please wait a few minutes and try again.");
      } else if (code === "auth/requires-recent-login") {
        setError("Please sign in again, then retry deleting your account.");
      } else if (msg.includes("timed out") || msg.includes("network") || msg.includes("offline")) {
        setError("Request timed out. Check your internet connection and try again.");
      } else {
        setError("Unable to delete account right now. Please try again.");
      }
      console.error(err);
    } finally {
      setDeletingAccount(false);
    }
  };

  if (loading) {
    return (
      <section className="section-shell py-14">
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-slate-600">
          Loading dashboard...
        </div>
      </section>
    );
  }

  return (
    <section className="pb-16">
      <div className="brand-gradient py-12 text-white">
        <div className="section-shell">
          <h1 className="text-4xl font-extrabold uppercase tracking-wide">My Account</h1>
          <p className="mt-2 text-sm text-slate-100/85">Home » My account</p>
        </div>
      </div>

      <div className="section-shell mt-10 grid gap-8 lg:grid-cols-[300px_1fr]">
        <aside className="overflow-hidden rounded border border-slate-300 bg-white">
          {NAV_ITEMS.map((item) => (
            <button
              key={item}
              onClick={() => {
                if (item === "Log out") {
                  handleLogout();
                } else {
                  navigateTab(item);
                }
              }}
              className={`w-full border-b border-slate-300 px-4 py-5 text-left text-lg ${
                activeTab === item ? "bg-slate-100 font-semibold" : "bg-white"
              }`}
            >
              {item}
            </button>
          ))}
        </aside>

        <main className="rounded border border-slate-200 bg-white p-6 md:p-8">
          {error && <p className="mb-4 rounded bg-red-50 p-3 text-sm text-red-700">{error}</p>}
          {notice && <p className="mb-4 rounded bg-amber-50 p-3 text-sm text-amber-700">{notice}</p>}

          {section === "dashboard" && (
            <div>
              <p className="text-lg text-slate-700">
                Hello <span className="font-semibold">{welcomeName}</span> (
                <button onClick={handleLogout} className="font-semibold text-[var(--brand-700)]">
                  Log out
                </button>
                )
              </p>

              <p className="mt-4 text-lg text-slate-600 leading-relaxed">
                From your account dashboard you can view your{" "}
                <Link to="/my-account/orders" className="font-semibold text-slate-900 underline">
                  recent orders
                </Link>
                , manage your{" "}
                <Link to="/my-account/addresses" className="font-semibold text-slate-900 underline">
                  shipping and billing addresses
                </Link>
                , and edit your{" "}
                <Link to="/my-account/account-details" className="font-semibold text-slate-900 underline">
                  account details
                </Link>
                .
              </p>
            </div>
          )}

          {section === "orders" && (
            <div>
              <h2 className="text-2xl font-bold">Orders</h2>
              {orders.length === 0 ? (
                <div className="mt-5 flex items-center justify-between border-t border-slate-800 bg-slate-50 p-4">
                  <p className="text-slate-700">No order has been made yet.</p>
                  <Link to="/services" className="rounded bg-black px-4 py-2 text-white">
                    Browse services
                  </Link>
                </div>
              ) : (
                <div className="mt-5 overflow-auto">
                  <table className="min-w-full border border-slate-200 text-left text-sm">
                    <thead className="bg-slate-100">
                      <tr>
                        <th className="border-b p-3">Order ID</th>
                        <th className="border-b p-3">Pickup</th>
                        <th className="border-b p-3">Delivery</th>
                        <th className="border-b p-3">Status</th>
                        <th className="border-b p-3">Created</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order) => (
                        <tr key={order.id} className="border-b">
                          <td className="p-3 font-medium">{order.id}</td>
                          <td className="p-3">{order.pickupLocation || "-"}</td>
                          <td className="p-3">{order.deliveryLocation || "-"}</td>
                          <td className="p-3">{order.status || "Pending"}</td>
                          <td className="p-3">{normalizeDate(order.createdAt)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {section === "addresses" && (
            <div>
              <p className="mb-6 text-slate-600">The following addresses will be used on the checkout page by default.</p>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="border border-slate-300">
                  <div className="border-b border-slate-300 p-4 text-4xl font-bold leading-none text-slate-900">Billing address</div>
                  <div className="p-4">
                    {isAddressFilled(billingAddress) ? (
                      <div className="space-y-1 text-sm text-slate-700">
                        <p>{billingAddress.firstName} {billingAddress.lastName}</p>
                        <p>{billingAddress.streetAddress}</p>
                        <p>{billingAddress.apartment}</p>
                        <p>{billingAddress.city}, {billingAddress.state}</p>
                        <p>{billingAddress.country} - {billingAddress.pincode}</p>
                        <p>{billingAddress.phone}</p>
                        <p>{billingAddress.email}</p>
                      </div>
                    ) : (
                      <p className="text-sm italic text-slate-500">You have not set up this type of address yet.</p>
                    )}
                  </div>
                  <div className="border-t border-slate-300 p-4 text-right">
                    <Link to="/my-account/edit-address/billing" className="font-semibold text-slate-900">
                      {isAddressFilled(billingAddress) ? "Edit Billing address" : "Add Billing address"}
                    </Link>
                  </div>
                </div>

                <div className="border border-slate-300">
                  <div className="border-b border-slate-300 p-4 text-4xl font-bold leading-none text-slate-900">Shipping address</div>
                  <div className="p-4">
                    {isAddressFilled(shippingAddress) ? (
                      <div className="space-y-1 text-sm text-slate-700">
                        <p>{shippingAddress.firstName} {shippingAddress.lastName}</p>
                        <p>{shippingAddress.streetAddress}</p>
                        <p>{shippingAddress.apartment}</p>
                        <p>{shippingAddress.city}, {shippingAddress.state}</p>
                        <p>{shippingAddress.country} - {shippingAddress.pincode}</p>
                      </div>
                    ) : (
                      <p className="text-sm italic text-slate-500">You have not set up this type of address yet.</p>
                    )}
                  </div>
                  <div className="border-t border-slate-300 p-4 text-right">
                    <Link to="/my-account/edit-address/shipping" className="font-semibold text-slate-900">
                      {isAddressFilled(shippingAddress) ? "Edit Shipping address" : "Add Shipping address"}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}

          {section === "edit-address" && (
            <EditAddressSection
              type={addressType}
              billingAddress={billingAddress}
              shippingAddress={shippingAddress}
              setBillingAddress={setBillingAddress}
              setShippingAddress={setShippingAddress}
              onSave={saveAddresses}
              savingAddress={savingAddress}
            />
          )}

          {section === "account-details" && (
            <div className="space-y-5">
              <div className="grid gap-4 md:grid-cols-2">
                <FormField label="First name" required>
                  <input
                    value={account.firstName}
                    onChange={(e) => setAccount((prev) => ({ ...prev, firstName: e.target.value }))}
                    className="w-full rounded border border-slate-300 p-3"
                  />
                </FormField>
                <FormField label="Last name" required>
                  <input
                    value={account.lastName}
                    onChange={(e) => setAccount((prev) => ({ ...prev, lastName: e.target.value }))}
                    className="w-full rounded border border-slate-300 p-3"
                  />
                </FormField>
              </div>

              <FormField label="Display name" required>
                <input
                  value={account.displayName}
                  onChange={(e) => setAccount((prev) => ({ ...prev, displayName: e.target.value }))}
                  className="w-full rounded border border-slate-300 p-3"
                />
              </FormField>

              <p className="-mt-3 text-xs italic text-slate-600">
                This will be how your name will be displayed in the account section and in reviews.
              </p>

              <FormField label="Email address" required>
                <input
                  value={account.email}
                  disabled
                  className="w-full rounded border border-slate-300 bg-slate-100 p-3 text-slate-600"
                />
              </FormField>

              <h3 className="border-b border-slate-300 pb-2 text-lg">Password change</h3>

              <PasswordInput
                label="Current password (leave blank to leave unchanged)"
                name="currentPassword"
                value={passwordForm.currentPassword}
                showPassword={showPassword.currentPassword}
                setShowPassword={setShowPassword}
                setPasswordForm={setPasswordForm}
              />
              <PasswordInput
                label="New password (leave blank to leave unchanged)"
                name="newPassword"
                value={passwordForm.newPassword}
                showPassword={showPassword.newPassword}
                setShowPassword={setShowPassword}
                setPasswordForm={setPasswordForm}
              />
              <PasswordInput
                label="Confirm new password"
                name="confirmPassword"
                value={passwordForm.confirmPassword}
                showPassword={showPassword.confirmPassword}
                setShowPassword={setShowPassword}
                setPasswordForm={setPasswordForm}
              />

              <button
                type="button"
                onClick={saveAccountDetails}
                disabled={savingAccount}
                className="rounded bg-black px-5 py-2 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70"
              >
                {savingAccount ? "Saving..." : "Save changes"}
              </button>

              <div className="mt-8 rounded-lg border border-red-200 bg-red-50 p-4">
                <h3 className="text-lg font-semibold text-red-700">Delete account</h3>
                <p className="mt-1 text-sm text-red-700/90">
                  This action is permanent. Your login will be removed and cannot be undone.
                </p>

                <div className="mt-4">
                  <FormField label="Current password" required>
                    <input
                      type="password"
                      value={deletePassword}
                      onChange={(e) => setDeletePassword(e.target.value)}
                      className="w-full rounded border border-red-200 bg-white p-3"
                      placeholder="Enter current password"
                    />
                  </FormField>
                </div>

                <label className="mt-3 flex items-center gap-2 text-sm text-red-800">
                  <input
                    type="checkbox"
                    checked={deleteConfirm}
                    onChange={(e) => setDeleteConfirm(e.target.checked)}
                    className="h-4 w-4"
                  />
                  I understand this action cannot be undone.
                </label>

                <button
                  type="button"
                  onClick={handleDeleteAccount}
                  disabled={deletingAccount}
                  className="mt-4 rounded bg-red-600 px-5 py-2 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {deletingAccount ? "Deleting account..." : "Delete account"}
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </section>
  );
}

function FormField({ label, required = false, children }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-slate-700">
        {label} {required && <span className="text-red-600">*</span>}
      </span>
      {children}
    </label>
  );
}

function PasswordInput({ label, name, value, showPassword, setShowPassword, setPasswordForm }) {
  return (
    <FormField label={label}>
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={(e) => setPasswordForm((prev) => ({ ...prev, [name]: e.target.value }))}
          className="w-full rounded border border-slate-300 p-3 pr-16"
        />
        <button
          type="button"
          onClick={() => setShowPassword((prev) => ({ ...prev, [name]: !prev[name] }))}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-[var(--brand-700)]"
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? "Hide" : "Show"}
        </button>
      </div>
    </FormField>
  );
}

function EditAddressSection({
  type,
  billingAddress,
  shippingAddress,
  setBillingAddress,
  setShippingAddress,
  onSave,
  savingAddress,
}) {
  const isBilling = type === "billing";
  const value = isBilling ? billingAddress : shippingAddress;
  const setValue = isBilling ? setBillingAddress : setShippingAddress;

  const input = (name, label, required = true, inputType = "text", optional = false) => (
    <FormField key={name} label={label} required={required && !optional}>
      <input
        type={inputType}
        value={value[name] || ""}
        required={required && !optional}
        onChange={(e) => setValue((prev) => ({ ...prev, [name]: e.target.value }))}
        className="w-full rounded border border-slate-300 p-3"
        inputMode={name === "pincode" || name === "phone" ? "numeric" : undefined}
        pattern={name === "pincode" ? "[0-9]*" : undefined}
      />
    </FormField>
  );

  return (
    <div className="space-y-4">
      <h2 className="text-4xl font-bold text-slate-900">
        {isBilling ? "Billing address" : "Shipping address"}
      </h2>

      <div className="grid gap-4 md:grid-cols-2">
        {input("firstName", "First name")}
        {input("lastName", "Last name")}
      </div>

      {input("company", "Company name (optional)", false, "text", true)}
      {input("country", "Country / Region")}
      {input("streetAddress", "Street address")}
      {input("apartment", "Apartment, suite, unit")}

      <div className="grid gap-4 md:grid-cols-2">
        {input("city", "Town / City")}
        {input("state", "State")}
      </div>

      {input("pincode", "PIN Code")}
      {isBilling && input("phone", "Phone")}
      {isBilling && input("email", "Email address", true, "email")}

      <button
        type="button"
        onClick={() => onSave(isBilling ? "billing" : "shipping")}
        disabled={savingAddress}
        className="rounded bg-black px-5 py-2 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70"
      >
        {savingAddress ? "Saving..." : "Save address"}
      </button>
    </div>
  );
}
