import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../lib/firebase";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const adminEmail = String(import.meta.env.VITE_ADMIN_EMAIL || "").trim().toLowerCase();
  const isAdmin = Boolean(user?.email && adminEmail && user.email.toLowerCase() === adminEmail);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const navStyle = ({ isActive }) =>
    isActive
      ? "text-[var(--accent)] font-semibold"
      : "text-slate-100/90 hover:text-white";

  const closeMenu = () => setMenuOpen(false);

  const handleSignOut = async () => {
    await signOut(auth);
    setMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 shadow-lg">
      <nav className="brand-gradient">
        <div className="section-shell">
          <div className="flex min-h-18 items-center justify-between py-2">
            <Link to="/" className="flex items-center gap-3" onClick={closeMenu}>
              <div className="grid h-10 w-10 place-items-center rounded-full bg-[var(--accent)] text-sm font-extrabold text-slate-900">
                PA
              </div>
              <span className="text-lg font-bold tracking-wide text-white">PickAll Movers</span>
            </Link>

            <div className="hidden items-center gap-7 md:flex">
              <NavLink to="/" className={navStyle}>
                Home
              </NavLink>
              <NavLink to="/about" className={navStyle}>
                About Us
              </NavLink>
              <NavLink to="/services" className={navStyle}>
                Services
              </NavLink>
              <NavLink to="/marketplace" className={navStyle}>
                Marketplace
              </NavLink>
              <NavLink to="/get-a-quote" className={navStyle}>
                Get Quote
              </NavLink>
              <NavLink to="/track" className={navStyle}>
                Track
              </NavLink>
              <NavLink to="/contact" className={navStyle}>
                Contact
              </NavLink>
            </div>

            <div className="hidden items-center gap-3 md:flex">
              {user ? (
                <>
                  {isAdmin && (
                    <Link to="/admin" className="text-sm text-slate-100/90 hover:text-white">
                      Admin
                    </Link>
                  )}
                  <Link to="/my-account" className="text-sm text-slate-100/90 hover:text-white">
                    My Account
                  </Link>
                  <span className="max-w-42 truncate text-sm text-slate-100/80">{user.email}</span>
                  <button
                    onClick={handleSignOut}
                    className="rounded-lg border border-white/25 px-3 py-2 text-sm text-white hover:bg-white/10"
                  >
                    Sign out
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-sm text-slate-100/90 hover:text-white">
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-slate-900 transition hover:brightness-95"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>

            <button
              onClick={() => setMenuOpen((prev) => !prev)}
              className="rounded border border-white/30 px-3 py-2 text-white md:hidden"
              aria-label="Open navigation menu"
            >
              ☰
            </button>
          </div>
        </div>
        {menuOpen && (
          <div className="section-shell pb-4 md:hidden">
            <div className="glass-card space-y-3 rounded-xl p-4 text-slate-900">
              <NavLink to="/" className="block" onClick={closeMenu}>
                Home
              </NavLink>
              <NavLink to="/about" className="block" onClick={closeMenu}>
                About Us
              </NavLink>
              <NavLink to="/services" className="block" onClick={closeMenu}>
                Services
              </NavLink>
              <NavLink to="/marketplace" className="block" onClick={closeMenu}>
                Marketplace
              </NavLink>
              <NavLink to="/get-a-quote" className="block" onClick={closeMenu}>
                Get Quote
              </NavLink>
              <NavLink to="/track" className="block" onClick={closeMenu}>
                Track
              </NavLink>
              <NavLink to="/contact" className="block" onClick={closeMenu}>
                Contact
              </NavLink>
              <NavLink to="/faqs" className="block" onClick={closeMenu}>
                FAQs
              </NavLink>
              <hr className="border-slate-300" />
              {user ? (
                <>
                  {isAdmin && (
                    <Link to="/admin" onClick={closeMenu} className="block">
                      Admin Panel
                    </Link>
                  )}
                  <Link to="/my-account" onClick={closeMenu} className="block">
                    My Account
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="w-full rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white"
                  >
                    Sign out
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={closeMenu} className="block">
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={closeMenu}
                    className="block rounded-lg bg-[var(--accent)] px-4 py-2 text-center text-sm font-semibold text-slate-900"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}

export default Navbar;