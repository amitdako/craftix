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
      <div style={s.authorInfoGroup}>
        <div style={s.avatarStyle}>
          {author?.profileImage ? (
            <img
              src={getImageUrl(author.profileImage)}
              style={s.avatarImgStyle}
              alt=""
            />
          ) : (
            <div
              style={{
                ...s.avatarImgStyle,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "12px",
                color: "#8e8e8e",
                fontWeight: "bold",
              }}
            >
              {author?.displayName?.[0] || "U"}
            </div>
          )}
        </div>

        <div style={s.textStack}>
          <Link
            to={`/profile/${author?._id || author}`}
            onClick={(e) => e.stopPropagation()}
            style={s.authorNameStyle}
          >
            {author?.displayName || "User"}
          </Link>
          <div style={s.dateStyle}>{formatDateTime(createdAt)}</div>
        </div>
      </div>

      {category && (
        <span style={s.categoryBadgeStyle}>{translatedCategory}</span>
      )}
    </div>
  );
};

export default PostHeader;
