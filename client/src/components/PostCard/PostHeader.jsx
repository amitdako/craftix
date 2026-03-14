import React from "react";
import { Link } from "react-router-dom";
import * as s from "./PostCard.styles";

const PostHeader = ({
  author,
  createdAt,
  category,
  getImageUrl,
  formatDateTime,
}) => (
  <div style={s.headerWrapper}>
    {/* left:profile*/}
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

      {/* name above the date.*/}
      <div style={s.textStack}>
        <Link
          to={`/profile/${author?._id || author}`}
          onClick={(e) => e.stopPropagation()}
          style={s.authorNameStyle}
        >
          {author?.displayName}
        </Link>
        <div style={s.dateStyle}>{formatDateTime(createdAt)}</div>
      </div>
    </div>

    {/* right:catagory*/}
    {category && <span style={s.categoryBadgeStyle}>{category}</span>}
  </div>
);

export default PostHeader;
