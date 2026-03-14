import React from "react";
import { Link } from "react-router-dom";
import * as s from "./PostCard.styles";
import { translations } from "../../translations";

const PostHeader = ({
  currentLang,
  author,
  createdAt,
  category,
  getImageUrl,
  formatDateTime,
}) => {
  const t = translations[currentLang] || translations.en;

  const translatedCategory = category
    ? t[category.toLowerCase()] || category
    : null;

  return (
    <div style={s.headerWrapper}>
      {/* left: profile and name group */}
      <div style={s.authorInfoGroup}>
        <div style={s.avatarStyle}>
          {author?.profileImage ? (
            <img
              src={getImageUrl(author.profileImage)}
              style={s.avatarImgStyle}
              alt=""
            />
          ) : (
            author?.displayName?.[0] || "U"
          )}
        </div>

        {/* name above the date */}
        <div style={{ ...s.textStack, textAlign: "inherit" }}>
          <Link
            to={`/profile/${author?._id || author}`}
            onClick={(e) => e.stopPropagation()}
            style={{
              textDecoration: "none",
              fontWeight: "bold",
              color: "#1c1e21",
            }}
          >
            {author?.displayName}
          </Link>
          <div style={s.dateStyle}>{formatDateTime(createdAt)}</div>
        </div>
      </div>

      {/* right: category badge */}
      {category && (
        <span style={s.categoryBadgeStyle}>{translatedCategory}</span>
      )}
    </div>
  );
};

export default PostHeader;
