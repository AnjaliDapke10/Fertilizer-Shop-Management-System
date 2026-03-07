import { useAuth } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { useState, useRef, useEffect } from "react";

const AppLayout = ({ children }) => {

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const dropdownRef = useRef();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  /* CLOSE DROPDOWN WHEN CLICK OUTSIDE */

  useEffect(() => {

    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () =>
      document.removeEventListener("mousedown", handleClickOutside);

  }, []);

  return (
    <div className="app-layout">

      {/* SIDEBAR */}

      <aside className="sidebar">
        <h2 className="logo">FertilizerShop</h2>

        <nav>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/products">Products</Link>
          <Link to="/suppliers">Suppliers</Link>
          <Link to="/customers">Customers</Link>
          <Link to="/inventory">Inventory</Link>
          <Link to="/sales">Sales</Link>
          <Link to="/purchases">Purchases</Link>
          <Link to="/reports">Reports</Link>
        </nav>
      </aside>

      {/* MAIN AREA */}

      <div className="main">

        <header className="header">

          <div className="title">
            Fertilizer Shop Management System
          </div>

          {user && (

            <div
              className="profile-container"
              ref={dropdownRef}
            >

              {/* PROFILE BUTTON */}

              <div
                className="profile-btn"
                onClick={() => setOpen(!open)}
              >

                <div className="avatar">
                  {user.username.charAt(0).toUpperCase()}
                </div>

                <span className="profile-name">
                  {user.username}
                </span>

              </div>

              {/* DROPDOWN */}

              {open && (

                <div className="profile-dropdown">

                  <div className="profile-role">
                    {user.role === "admin" ? "Admin" : "Staff"}
                  </div>

                  <div
                    className="profile-logout"
                    onClick={handleLogout}
                  >
                    Logout
                  </div>

                </div>

              )}

            </div>

          )}

        </header>

        <main className="content">
          {children}
        </main>

      </div>

    </div>
  );
};

export default AppLayout;