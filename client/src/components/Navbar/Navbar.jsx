import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as S from "./Navbar.styles";
import { translations } from "../../translations";

const Navbar = ({ user, handleLogout, logo, toggleLanguage, currentLang }) => {
  const [navSearch, setNavSearch] = useState("");
  const navigate = useNavigate();

  const t = translations[currentLang];

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
                {/* Hey מתחלף להיי */}
                {t.hey}, <strong>{user.displayName}</strong>
              </span>
              <button onClick={handleLogout} style={S.logoutButtonStyle}>
                {/* Logout מתחלף להתנתקות */}
                {t.logout}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Center: Global Search */}
      {user && (
        <form onSubmit={handleFormSubmit} style={S.searchFormStyle}>
          <input
            type="text"
            // הפלייסהולדר נשלף מהמילון
            placeholder={t.searchPlaceholder}
            value={navSearch}
            onChange={handleInputChange}
            style={S.searchInputStyle}
          />
        </form>
      )}

      {/* Right: Navigation */}
      <div style={S.rightLinksWrapper}>
        {/* כפתור החלפת שפה */}
        <button
          onClick={toggleLanguage}
          style={{
            background: "none",
            border: "1px solid #ccc",
            borderRadius: "20px",
            padding: "4px 12px",
            cursor: "pointer",
            fontWeight: "bold",
            color: "#1c1e21",
            marginRight: "15px",
          }}
        >
          {currentLang === "en" ? "עברית" : "English"}
        </button>

        {user ? (
          <>
            <Link to="/feed" style={S.linkStyle}>
              {t.feed}
            </Link>
            <Link to="/saved-posts" style={S.linkStyle}>
              {t.saved}
            </Link>
            <Link to="/profile" style={S.linkStyle}>
              {t.profile}
            </Link>
            <Link to="/create-post" style={S.newProjectBtnStyle}>
              {t.newProject}
            </Link>
          </>
        ) : (
          <>
            <Link to="/login" style={S.linkStyle}>
              {t.login}
            </Link>
            <Link to="/register" style={S.linkStyle}>
              {t.register}
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
