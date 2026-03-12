import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as S from "./Navbar.styles";

const Navbar = ({ user, handleLogout, logo }) => {
  const [navSearch, setNavSearch] = useState("");
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const value = e.target.value;
    setNavSearch(value);

    if (value.trim() !== "") {
      navigate(`/feed?search=${encodeURIComponent(value)}`);
    } else {
      navigate("/feed");
    }
  };

  const handleFormSubmit = (e) => e.preventDefault();

  return (
    <nav style={S.navContainerStyle}>
      {/* Left: Logo & User Status */}
      <div style={S.leftSectionStyle}>
        <Link to="/feed" style={{ display: "flex", alignItems: "center" }}>
          <img src={logo} alt="Craftix Logo" style={S.logoStyle} />
        </Link>

        {user && (
          <div style={S.userSectionStyle}>
            <div style={S.avatarContainerStyle}>
              {user.profileImage ? (
                <img
                  src={`http://localhost:5000${user.profileImage}`}
                  alt="Me"
                  style={S.avatarImgStyle}
                />
              ) : (
                user.displayName?.[0] || "U"
              )}
            </div>
            <div style={S.userActionsStyle}>
              <span>
                Hey, <strong>{user.displayName}</strong>
              </span>
              <button onClick={handleLogout} style={S.logoutButtonStyle}>
                Logout
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Center: Global Search (Only if logged in) */}
      {user && (
        <form onSubmit={handleFormSubmit} style={S.searchFormStyle}>
          <input
            type="text"
            placeholder="🔍 Search projects or makers..."
            value={navSearch}
            onChange={handleInputChange}
            style={S.searchInputStyle}
          />
        </form>
      )}

      {/* Right: Navigation */}
      <div style={S.rightLinksWrapper}>
        {user ? (
          <>
            <Link to="/feed" style={S.linkStyle}>
              Feed
            </Link>
            <Link to="/saved-posts" style={S.linkStyle}>
              Saved
            </Link>
            <Link to="/profile" style={S.linkStyle}>
              My Profile
            </Link>
            <Link to="/create-post" style={S.newProjectBtnStyle}>
              + New Project
            </Link>
          </>
        ) : (
          <>
            <Link to="/login" style={S.linkStyle}>
              Login
            </Link>
            <Link to="/register" style={S.linkStyle}>
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
