import { useState } from "react";
import { Link, NavLink } from "react-router-dom";

function Navbar() {

  const [menuOpen,setMenuOpen] = useState(false);

  const navStyle = ({isActive}) =>
    isActive
      ? "text-blue-600 font-semibold"
      : "text-gray-700 hover:text-blue-600";

  return (

    <nav className="bg-white shadow-md">

      <div className="max-w-7xl mx-auto px-4">

        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-blue-600 text-white w-9 h-9 flex items-center justify-center rounded-full font-bold">
              MT
            </div>
            <span className="font-bold text-lg">
              MyTransport
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8 items-center">

            <NavLink to="/" className={navStyle}>
              Home
            </NavLink>

            <NavLink to="/services" className={navStyle}>
              Services
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

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">

            <Link
              to="/login"
              className="text-gray-700 hover:text-blue-600"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Register
            </Link>

          </div>

          {/* Mobile Button */}
          <button
            onClick={()=>setMenuOpen(!menuOpen)}
            className="md:hidden text-gray-700"
          >
            ☰
          </button>

        </div>

      </div>

      {/* Mobile Menu */}

      {menuOpen && (

        <div className="md:hidden bg-white border-t">

          <div className="flex flex-col space-y-3 p-4">

            <NavLink to="/" className={navStyle}>
              Home
            </NavLink>

            <NavLink to="/services" className={navStyle}>
              Services
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

            <hr />

            <Link
              to="/login"
              className="text-gray-700"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="bg-blue-600 text-white px-4 py-2 rounded text-center"
            >
              Register
            </Link>

          </div>

        </div>

      )}

    </nav>

  );
}

export default Navbar;