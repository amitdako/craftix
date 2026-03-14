import React from "react";
import * as S from "./PostDetails.styles";

const PostHeader = ({
  author,
  createdAt,
  category,
  formatDateTime,
  getImageUrl,
}) => (
  <div
    style={{
      ...S.header,
      display: "flex",
      alignItems: "center",
      gap: "12px",
      padding: "15px",
    }}
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
    <div style={{ flex: 1, textAlign: "right" }}>
      <div style={{ fontWeight: "bold", fontSize: "1rem" }}>
        {author?.displayName}
      </div>
      <div style={{ fontSize: "0.75rem", color: "#888" }}>
        {formatDateTime(createdAt)}
      </div>
    </div>
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
        {category}
      </span>
    )}
  </div>
);

export default PostHeader;
