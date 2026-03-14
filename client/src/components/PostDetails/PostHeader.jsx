import React from "react";
import { Link } from "react-router-dom";
import * as S from "./PostDetails.styles";
import { translations } from "../../translations";

const PostHeader = ({
  currentLang,
  author,
  createdAt,
  category,
  formatDateTime,
  getImageUrl,
}) => {
  const userId = author?._id || (typeof author === "string" ? author : null);
  const t = translations[currentLang] || translations.en;

  const translatedCategory = category
    ? t[category.toLowerCase()] || category
    : null;

  return (
    <div
      style={{
        ...S.header,
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: "15px",
      }}
    >
      {/* profile pic */}
      <Link
        to={`/profile/${userId}`}
        onClick={(e) => e.stopPropagation()}
        style={{ textDecoration: "none", display: "flex" }}
      >
        <div
          style={{
            width: "45px",
            height: "45px",
            borderRadius: "50%",
            backgroundColor: "#007bff",
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "bold",
            overflow: "hidden",
          }}
        >
          {author?.profileImage ? (
            <img
              src={getImageUrl(author.profileImage)}
              alt=""
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            <span>{author?.displayName?.[0] || "U"}</span>
          )}
        </div>
      </Link>

      {/* שינינו ל-inherit כדי שיתאים לשפה שנבחרה */}
      <div style={{ flex: 1, textAlign: "inherit" }}>
        {/* username*/}
        <Link
          to={`/profile/${userId}`}
          onClick={(e) => e.stopPropagation()}
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <div style={{ fontWeight: "bold", fontSize: "1rem" }}>
            {author?.displayName}
          </div>
        </Link>
        <div style={{ fontSize: "0.75rem", color: "#888" }}>
          {formatDateTime(createdAt)}
        </div>
      </div>

      {/* category badge */}
      {category && (
        <span
          style={{
            fontSize: "0.75rem",
            backgroundColor: "#e7f3ff",
            color: "#1877f2",
            padding: "4px 12px",
            borderRadius: "20px",
            fontWeight: "bold",
          }}
        >
          {translatedCategory}
        </span>
      )}
    </div>
  );
};

export default PostHeader;
