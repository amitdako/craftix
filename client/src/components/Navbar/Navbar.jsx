import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as S from "./Navbar.styles";
import { translations } from "../../translations";

const Navbar = ({ user, handleLogout, logo, toggleLanguage, currentLang }) => {
  const [navSearch, setNavSearch] = useState("");
  const navigate = useNavigate();

  const t = translations[currentLang] || translations.en;
  const isHe = currentLang === "he";

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
    <nav style={{ ...S.navContainerStyle, direction: isHe ? "rtl" : "ltr" }}>
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
                  src={user.profileImage}
                  alt="Me"
                  style={S.avatarImgStyle}
                />
              ) : (
                user.displayName?.[0] || "U"
              )}
            </div>
            <div style={S.userActionsStyle}>
              <span>
                {t.hey}, <strong>{user.displayName}</strong>
              </span>
              <button onClick={handleLogout} style={S.logoutButtonStyle}>
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
            placeholder={t.searchPlaceholder}
            value={navSearch}
            onChange={handleInputChange}
            style={S.searchInputStyle}
          />
        </form>
      )}

      {/* Right: Navigation */}
      <div style={S.rightLinksWrapper}>
        {/* כפתור החלפת שפה נקי */}
        <button
          onClick={toggleLanguage}
          style={{
            background: "transparent",
            border: "1px solid #dbdbdb",
            borderRadius: "6px",
            padding: "4px 10px",
            cursor: "pointer",
            fontWeight: "600",
            fontSize: "12px",
            color: "#262626",
            marginInlineEnd: "10px", // תומך RTL אוטומטית!
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
            <Link to="/register" style={S.newProjectBtnStyle}>
              {" "}
              {/* הרשמה מודגשת כמו כפתור */}
              {t.register}
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
