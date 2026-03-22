import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import emailjs from "@emailjs/browser";
import { auth, db, firestoreEnabled } from "../lib/firebase";

const USER_COLLECTION_PRIMARY = "Users";
const USER_COLLECTION_FALLBACK = "users";
const EMAIL_SERVICE_ID =
  import.meta.env.VITE_MARKETPLACE_EMAIL_SERVICE ||
  import.meta.env.VITE_EMAIL_SERVICE;
const EMAIL_PUBLIC_KEY = import.meta.env.VITE_EMAIL_KEY;
const LOAD_TEMPLATE_ID =
  import.meta.env.VITE_MARKETPLACE_LOAD_TEMPLATE ||
  import.meta.env.VITE_EMAIL_TEMPLATE;
const TRUCK_TEMPLATE_ID =
  import.meta.env.VITE_MARKETPLACE_TRUCK_TEMPLATE ||
  import.meta.env.VITE_EMAIL_TEMPLATE;
const REPORT_THRESHOLD = 3;

async function sendOwnerEmail(templateId, params) {
  if (!EMAIL_SERVICE_ID || !templateId || !EMAIL_PUBLIC_KEY) {
    throw new Error("EmailJS is not configured for marketplace notifications.");
  }
  await emailjs.send(EMAIL_SERVICE_ID, templateId, params, EMAIL_PUBLIC_KEY);
}

function normalize(value) {
  return String(value || "").trim().toLowerCase();
}

function formatDate(value) {
  if (!value) return "Flexible";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Flexible";
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function MarketplacePage() {
  const [activeRole, setActiveRole] = useState("business");
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState("");
  const [authReady, setAuthReady] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [moderation, setModeration] = useState({
    banned: false,
    reportCount: 0,
    warningCount: 0,
    lastWarning: "",
  });
  const [reportingPostId, setReportingPostId] = useState("");

  const [loadPosts, setLoadPosts] = useState([]);
  const [truckPosts, setTruckPosts] = useState([]);

  const [businessForm, setBusinessForm] = useState({
    companyName: "",
    contactName: "",
    phone: "",
    email: "",
    pickupCity: "",
    dropCity: "",
    materialType: "",
    loadWeight: "",
    expectedDate: "",
    notes: "",
  });

  const [truckForm, setTruckForm] = useState({
    ownerName: "",
    phone: "",
    email: "",
    truckType: "Open Truck",
    capacityTons: "",
    currentCity: "",
    preferredRoutes: "",
    availableFrom: "",
    notes: "",
  });

  async function fetchMarketplaceData() {
    if (!firestoreEnabled || !db) {
      setLoadingData(false);
      return;
    }

    setLoadingData(true);
    try {
      const [loadSnap, truckSnap] = await Promise.all([
        getDocs(query(collection(db, "loadAvailability"))),
        getDocs(query(collection(db, "truckAvailability"))),
      ]);

      const nextLoadPosts = loadSnap.docs
        .map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }))
        .sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));

      const nextTruckPosts = truckSnap.docs
        .map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }))
        .sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));

      setLoadPosts(nextLoadPosts);
      setTruckPosts(nextTruckPosts);
    } catch (loadError) {
      console.error("Failed to load marketplace data:", loadError);
      setError("Could not fetch latest postings. Please refresh in a moment.");
    } finally {
      setLoadingData(false);
    }
  }

  useEffect(() => {
    fetchMarketplaceData();
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser || null);
      if (!currentUser || !db || !firestoreEnabled) {
        setUserRole("");
        setModeration({ banned: false, reportCount: 0, warningCount: 0, lastWarning: "" });
        setAuthReady(true);
        return;
      }

      try {
        const primarySnap = await getDoc(doc(db, USER_COLLECTION_PRIMARY, currentUser.uid));
        if (primarySnap.exists()) {
          const data = primarySnap.data() || {};
          const role = String(data.role || "business");
          setUserRole(role);
          setActiveRole(role === "truck-owner" ? "truck" : "business");
          setModeration({
            banned: Boolean(data.banned || data.deletedByAdmin),
            reportCount: Number(data.reportCount || 0),
            warningCount: Number(data.warningCount || 0),
            lastWarning: String(data.lastWarning || ""),
          });
          setAuthReady(true);
          return;
        }

        const fallbackSnap = await getDoc(doc(db, USER_COLLECTION_FALLBACK, currentUser.uid));
        if (fallbackSnap.exists()) {
          const data = fallbackSnap.data() || {};
          const role = String(data.role || "business");
          setUserRole(role);
          setActiveRole(role === "truck-owner" ? "truck" : "business");
          setModeration({
            banned: Boolean(data.banned || data.deletedByAdmin),
            reportCount: Number(data.reportCount || 0),
            warningCount: Number(data.warningCount || 0),
            lastWarning: String(data.lastWarning || ""),
          });
          setAuthReady(true);
          return;
        }

        setUserRole("business");
        setActiveRole("business");
        setModeration({ banned: false, reportCount: 0, warningCount: 0, lastWarning: "" });
      } catch (roleError) {
        console.warn("Could not load account role:", roleError);
        setUserRole("business");
        setActiveRole("business");
        setModeration({ banned: false, reportCount: 0, warningCount: 0, lastWarning: "" });
      } finally {
        setAuthReady(true);
      }
    });

    return () => unsubscribe();
  }, []);

  const loadMatchCounts = useMemo(() => {
    return loadPosts.reduce((acc, loadPost) => {
      const pickupCity = normalize(loadPost.pickupCity);
      const dropCity = normalize(loadPost.dropCity);

      const count = truckPosts.filter((truckPost) => {
        const truckCity = normalize(truckPost.currentCity);
        const routes = normalize(truckPost.preferredRoutes);
        return (
          truckCity.includes(pickupCity) ||
          routes.includes(pickupCity) ||
          routes.includes(dropCity)
        );
      }).length;

      acc[loadPost.id] = count;
      return acc;
    }, {});
  }, [loadPosts, truckPosts]);

  function handleBusinessInput(event) {
    const { name, value } = event.target;
    setBusinessForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleTruckInput(event) {
    const { name, value } = event.target;
    setTruckForm((prev) => ({ ...prev, [name]: value }));
  }

  async function submitBusinessPost(event) {
    event.preventDefault();
    if (!user) {
      setError("Please login as Business to post load availability.");
      return;
    }
    if (moderation.banned) {
      setError("Your account is blocked due to policy violations. You cannot post new availability.");
      return;
    }
    setSubmitting(true);
    setError("");
    setNotice("");

    const payload = {
      ...businessForm,
      userId: user.uid,
      ownerEmail: user.email || businessForm.email || "",
      role: "business",
      status: "open",
      createdAt: serverTimestamp(),
    };

    try {
      await sendOwnerEmail(LOAD_TEMPLATE_ID, {
        listing_type: "Load Availability",
        company_name: businessForm.companyName,
        contact_name: businessForm.contactName,
        phone: businessForm.phone,
        email: businessForm.email,
        pickup_city: businessForm.pickupCity,
        drop_city: businessForm.dropCity,
        material_type: businessForm.materialType,
        load_weight: businessForm.loadWeight,
        expected_date: businessForm.expectedDate || "Not specified",
        notes: businessForm.notes || "N/A",
        admin_email: import.meta.env.VITE_ADMIN_EMAIL,
      });

      if (firestoreEnabled && db) {
        await addDoc(collection(db, "loadAvailability"), payload);
      } else {
        setLoadPosts((prev) => [
          {
            id: `local-${Date.now()}`,
            ...businessForm,
            userId: user.uid,
            ownerEmail: user.email || businessForm.email || "",
            role: "business",
            status: "open",
            createdAt: { seconds: Math.floor(Date.now() / 1000) },
          },
          ...prev,
        ]);
      }

      setBusinessForm({
        companyName: "",
        contactName: "",
        phone: "",
        email: "",
        pickupCity: "",
        dropCity: "",
        materialType: "",
        loadWeight: "",
        expectedDate: "",
        notes: "",
      });

      setNotice("Load availability posted successfully.");
      await fetchMarketplaceData();
    } catch (submitError) {
      console.error("Failed to submit load post:", submitError);
      setError("Failed to post load availability. Please verify EmailJS and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  async function submitTruckPost(event) {
    event.preventDefault();
    if (!user) {
      setError("Please login as Truck Owner to post truck availability.");
      return;
    }
    if (moderation.banned) {
      setError("Your account is blocked due to policy violations. You cannot post new availability.");
      return;
    }
    setSubmitting(true);
    setError("");
    setNotice("");

    const payload = {
      ...truckForm,
      userId: user.uid,
      ownerEmail: user.email || truckForm.email || "",
      role: "truck-owner",
      status: "open",
      createdAt: serverTimestamp(),
    };

    try {
      await sendOwnerEmail(TRUCK_TEMPLATE_ID, {
        listing_type: "Truck Availability",
        owner_name: truckForm.ownerName,
        phone: truckForm.phone,
        email: truckForm.email,
        truck_type: truckForm.truckType,
        capacity_tons: truckForm.capacityTons,
        current_city: truckForm.currentCity,
        preferred_routes: truckForm.preferredRoutes || "Flexible",
        available_from: truckForm.availableFrom || "Not specified",
        notes: truckForm.notes || "N/A",
        admin_email: import.meta.env.VITE_ADMIN_EMAIL,
      });

      if (firestoreEnabled && db) {
        await addDoc(collection(db, "truckAvailability"), payload);
      } else {
        setTruckPosts((prev) => [
          {
            id: `local-${Date.now()}`,
            ...truckForm,
            userId: user.uid,
            ownerEmail: user.email || truckForm.email || "",
            role: "truck-owner",
            status: "open",
            createdAt: { seconds: Math.floor(Date.now() / 1000) },
          },
          ...prev,
        ]);
      }

      setTruckForm({
        ownerName: "",
        phone: "",
        email: "",
        truckType: "Open Truck",
        capacityTons: "",
        currentCity: "",
        preferredRoutes: "",
        availableFrom: "",
        notes: "",
      });

      setNotice("Truck availability posted successfully.");
      await fetchMarketplaceData();
    } catch (submitError) {
      console.error("Failed to submit truck post:", submitError);
      setError("Failed to post truck availability. Please verify EmailJS and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleReportFakeLoad(post) {
    if (!db || !firestoreEnabled) {
      setError("Reporting is unavailable right now.");
      return;
    }
    if (!user) {
      setError("Please login to report fake load posts.");
      return;
    }
    if (!post.userId) {
      setError("This legacy post cannot be reported automatically. Contact support.");
      return;
    }
    if (post.userId === user.uid) {
      setError("You cannot report your own load post.");
      return;
    }

    setReportingPostId(post.id);
    setError("");
    setNotice("");

    try {
      const reportId = `${post.id}_${user.uid}`;
      const reportRef = doc(db, "loadPostReports", reportId);
      const existing = await getDoc(reportRef);
      if (existing.exists()) {
        setError("You already reported this load post.");
        return;
      }

      const [ownerPrimarySnap, ownerFallbackSnap] = await Promise.all([
        getDoc(doc(db, USER_COLLECTION_PRIMARY, post.userId)),
        getDoc(doc(db, USER_COLLECTION_FALLBACK, post.userId)),
      ]);

      const ownerData = ownerPrimarySnap.exists()
        ? ownerPrimarySnap.data()
        : ownerFallbackSnap.exists()
          ? ownerFallbackSnap.data()
          : null;

      if (!ownerData) {
        setError("Unable to locate post owner profile for reporting.");
        return;
      }

      const nextCount = Number(ownerData.reportCount || 0) + 1;
      const shouldBan = nextCount >= REPORT_THRESHOLD;
      const warning = shouldBan
        ? "Account banned: received 3 or more fake-load reports."
        : `Warning ${nextCount}/${REPORT_THRESHOLD}: fake-load report received.`;

      await setDoc(reportRef, {
        postId: post.id,
        reportedUserId: post.userId,
        reporterUserId: user.uid,
        reporterEmail: user.email || "",
        ownerEmail: post.ownerEmail || "",
        reason: "fake-load",
        createdAt: serverTimestamp(),
      });

      const moderationPayload = {
        reportCount: nextCount,
        warningCount: Math.min(nextCount, REPORT_THRESHOLD),
        banned: shouldBan,
        lastWarning: warning,
        banReason: shouldBan ? "3 fake-load reports" : "",
        updatedAt: serverTimestamp(),
      };

      await Promise.all([
        setDoc(doc(db, USER_COLLECTION_PRIMARY, post.userId), moderationPayload, { merge: true }),
        setDoc(doc(db, USER_COLLECTION_FALLBACK, post.userId), moderationPayload, { merge: true }),
      ]);

      setNotice("Report submitted. Our system has warned this user and applied moderation policy.");
    } catch (reportErr) {
      console.error("Failed to report fake load:", reportErr);
      setError("Could not submit report right now. Try again.");
    } finally {
      setReportingPostId("");
    }
  }

  return (
    <div className="soft-enter">
      <section className="brand-gradient overflow-hidden text-white">
        <div className="section-shell py-14">
          <h1 className="text-4xl font-bold sm:text-5xl">Load & Truck Marketplace</h1>
          <p className="mt-3 max-w-2xl text-slate-100/90">
            Act as the middle platform: businesses publish load availability and truck owners publish truck availability.
            You can quickly connect both sides for faster dispatch.
          </p>
          <p className="mt-3 text-sm text-slate-100/80">
            <Link to="/" className="hover:text-white">Home</Link>
            {" » "}
            <span>Marketplace</span>
          </p>
        </div>
      </section>

      <section className="section-shell py-12">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr]">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
            {!authReady ? (
              <p className="text-sm text-slate-500">Checking account role...</p>
            ) : !user ? (
              <div className="mb-5 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                Login to post availability.
                <Link to="/login" className="ml-1 font-semibold underline">Go to Login</Link>
              </div>
            ) : (
              <div className="mb-5 rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
                Signed in as: <span className="font-semibold">{userRole === "truck-owner" ? "Truck Owner" : "Business"}</span>
              </div>
            )}

            {user && moderation.reportCount > 0 && moderation.lastWarning && (
              <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
                {moderation.lastWarning}
              </div>
            )}
            {user && moderation.banned && (
              <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                Your account is currently banned due to repeated fake-load reports. Contact support/admin.
              </div>
            )}

            {activeRole === "business" ? (
              <form onSubmit={submitBusinessPost} className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm text-slate-600">Company name</label>
                  <input required name="companyName" value={businessForm.companyName} onChange={handleBusinessInput} className="mt-1 w-full rounded-lg border border-slate-300 p-3" placeholder="ABC Industries" />
                </div>
                <div>
                  <label className="text-sm text-slate-600">Contact person</label>
                  <input required name="contactName" value={businessForm.contactName} onChange={handleBusinessInput} className="mt-1 w-full rounded-lg border border-slate-300 p-3" placeholder="Ravi Kumar" />
                </div>
                <div>
                  <label className="text-sm text-slate-600">Phone</label>
                  <input required name="phone" value={businessForm.phone} onChange={handleBusinessInput} className="mt-1 w-full rounded-lg border border-slate-300 p-3" placeholder="+91 98xxxx" />
                </div>
                <div>
                  <label className="text-sm text-slate-600">Email</label>
                  <input name="email" value={businessForm.email} onChange={handleBusinessInput} className="mt-1 w-full rounded-lg border border-slate-300 p-3" placeholder="ops@company.com" />
                </div>
                <div>
                  <label className="text-sm text-slate-600">Pickup city</label>
                  <input required name="pickupCity" value={businessForm.pickupCity} onChange={handleBusinessInput} className="mt-1 w-full rounded-lg border border-slate-300 p-3" placeholder="Delhi" />
                </div>
                <div>
                  <label className="text-sm text-slate-600">Drop city</label>
                  <input required name="dropCity" value={businessForm.dropCity} onChange={handleBusinessInput} className="mt-1 w-full rounded-lg border border-slate-300 p-3" placeholder="Mumbai" />
                </div>
                <div>
                  <label className="text-sm text-slate-600">Material type</label>
                  <input required name="materialType" value={businessForm.materialType} onChange={handleBusinessInput} className="mt-1 w-full rounded-lg border border-slate-300 p-3" placeholder="Type your material (e.g. FMCG, Cement, Steel)" />
                </div>
                <div>
                  <label className="text-sm text-slate-600">Load weight (tons)</label>
                  <input required type="number" min="1" step="0.1" name="loadWeight" value={businessForm.loadWeight} onChange={handleBusinessInput} className="mt-1 w-full rounded-lg border border-slate-300 p-3" placeholder="8" />
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm text-slate-600">Expected loading date</label>
                  <input type="date" name="expectedDate" value={businessForm.expectedDate} onChange={handleBusinessInput} className="mt-1 w-full rounded-lg border border-slate-300 p-3" />
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm text-slate-600">Notes</label>
                  <textarea name="notes" value={businessForm.notes} onChange={handleBusinessInput} className="mt-1 min-h-24 w-full rounded-lg border border-slate-300 p-3" placeholder="Loading point timing, handling instructions, etc." />
                </div>
                <div className="md:col-span-2">
                  <button disabled={submitting || !user || userRole === "truck-owner"} className="rounded-lg bg-[var(--brand-700)] px-5 py-3 font-medium text-white disabled:opacity-60">
                    {submitting ? "Posting..." : "Post Load Availability"}
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={submitTruckPost} className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm text-slate-600">Owner / fleet name</label>
                  <input required name="ownerName" value={truckForm.ownerName} onChange={handleTruckInput} className="mt-1 w-full rounded-lg border border-slate-300 p-3" placeholder="Singh Transport" />
                </div>
                <div>
                  <label className="text-sm text-slate-600">Phone</label>
                  <input required name="phone" value={truckForm.phone} onChange={handleTruckInput} className="mt-1 w-full rounded-lg border border-slate-300 p-3" placeholder="+91 97xxxx" />
                </div>
                <div>
                  <label className="text-sm text-slate-600">Email</label>
                  <input name="email" value={truckForm.email} onChange={handleTruckInput} className="mt-1 w-full rounded-lg border border-slate-300 p-3" placeholder="fleet@company.com" />
                </div>
                <div>
                  <label className="text-sm text-slate-600">Truck type</label>
                  <select name="truckType" value={truckForm.truckType} onChange={handleTruckInput} className="mt-1 w-full rounded-lg border border-slate-300 p-3">
                    <option>Open Truck</option>
                    <option>Container</option>
                    <option>Trailer</option>
                    <option>LCV</option>
                    <option>Reefer</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-slate-600">Capacity (tons)</label>
                  <input required type="number" min="1" step="0.1" name="capacityTons" value={truckForm.capacityTons} onChange={handleTruckInput} className="mt-1 w-full rounded-lg border border-slate-300 p-3" placeholder="12" />
                </div>
                <div>
                  <label className="text-sm text-slate-600">Current city</label>
                  <input required name="currentCity" value={truckForm.currentCity} onChange={handleTruckInput} className="mt-1 w-full rounded-lg border border-slate-300 p-3" placeholder="Jaipur" />
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm text-slate-600">Preferred routes</label>
                  <input name="preferredRoutes" value={truckForm.preferredRoutes} onChange={handleTruckInput} className="mt-1 w-full rounded-lg border border-slate-300 p-3" placeholder="Jaipur-Delhi, Delhi-Lucknow" />
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm text-slate-600">Available from date</label>
                  <input type="date" name="availableFrom" value={truckForm.availableFrom} onChange={handleTruckInput} className="mt-1 w-full rounded-lg border border-slate-300 p-3" />
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm text-slate-600">Notes</label>
                  <textarea name="notes" value={truckForm.notes} onChange={handleTruckInput} className="mt-1 min-h-24 w-full rounded-lg border border-slate-300 p-3" placeholder="Driver details, preferred goods, route constraints, etc." />
                </div>
                <div className="md:col-span-2">
                  <button disabled={submitting || !user || userRole === "business"} className="rounded-lg bg-[var(--brand-700)] px-5 py-3 font-medium text-white disabled:opacity-60">
                    {submitting ? "Posting..." : "Post Truck Availability"}
                  </button>
                </div>
              </form>
            )}

            {user && userRole === "truck-owner" && activeRole !== "truck" && (
              <p className="mt-3 text-sm text-amber-700">Your account is Truck Owner. Please use the truck availability form.</p>
            )}
            {user && userRole === "business" && activeRole !== "business" && (
              <p className="mt-3 text-sm text-amber-700">Your account is Business. Please use the load availability form.</p>
            )}

            {notice && <p className="mt-4 text-sm text-emerald-700">{notice}</p>}
            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
            {!firestoreEnabled && (
              <p className="mt-2 text-sm text-amber-700">
                Firestore is disabled. Posts will stay visible only during this browser session.
              </p>
            )}
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="text-xl font-bold">Open Load Posts</h3>
              <p className="mt-1 text-sm text-slate-600">Latest demand posted by businesses.</p>
              <div className="mt-4 space-y-3">
                {loadingData ? (
                  <p className="text-sm text-slate-500">Loading listings...</p>
                ) : loadPosts.length === 0 ? (
                  <p className="text-sm text-slate-500">No load posts yet.</p>
                ) : (
                  loadPosts.slice(0, 6).map((post) => (
                    <div key={post.id} className="rounded-lg border border-slate-200 p-3">
                      <p className="font-semibold text-slate-900">{post.pickupCity} to {post.dropCity}</p>
                      <p className="text-sm text-slate-600">{post.materialType} | {post.loadWeight} tons</p>
                      <p className="text-xs text-slate-500">Loading: {formatDate(post.expectedDate)}</p>
                      <p className="mt-1 text-xs font-medium text-[var(--brand-700)]">
                        {loadMatchCounts[post.id] || 0} matching truck posts
                      </p>
                      <div className="mt-2">
                        <button
                          onClick={() => handleReportFakeLoad(post)}
                          disabled={!user || reportingPostId === post.id || post.userId === user?.uid}
                          className="rounded border border-red-300 px-3 py-1 text-xs font-medium text-red-700 disabled:opacity-60"
                        >
                          {reportingPostId === post.id ? "Reporting..." : "Report Fake Load"}
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="text-xl font-bold">Open Truck Posts</h3>
              <p className="mt-1 text-sm text-slate-600">Available vehicles published by truck owners.</p>
              <div className="mt-4 space-y-3">
                {loadingData ? (
                  <p className="text-sm text-slate-500">Loading listings...</p>
                ) : truckPosts.length === 0 ? (
                  <p className="text-sm text-slate-500">No truck posts yet.</p>
                ) : (
                  truckPosts.slice(0, 6).map((post) => (
                    <div key={post.id} className="rounded-lg border border-slate-200 p-3">
                      <p className="font-semibold text-slate-900">{post.truckType} | {post.capacityTons} tons</p>
                      <p className="text-sm text-slate-600">Current: {post.currentCity}</p>
                      <p className="text-sm text-slate-600">Routes: {post.preferredRoutes || "Flexible"}</p>
                      <p className="text-xs text-slate-500">Available: {formatDate(post.availableFrom)}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
