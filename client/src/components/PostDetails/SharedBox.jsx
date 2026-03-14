import React from "react";
import { useNavigate } from "react-router-dom";
import * as S from "./PostDetails.styles";

const SharedBox = ({ currentLang, parentPost, getImageUrl }) => {
  const navigate = useNavigate();
  if (!parentPost) return null;

  return (
    <div
      style={{
        margin: "0 20px 20px",
        padding: "15px",
        border: "1px solid #e0e0e0",
        borderRadius: "12px",
        backgroundColor: "#fcfcfc",
        textAlign: "inherit",
        cursor: "pointer",
      }}
      onClick={() => navigate(`/post/${parentPost._id || parentPost}`)}
    >
      {/* Header Section: Author info */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          marginBottom: "10px",
        }}
      >
        {/* Profile Avatar */}
        <div
          style={{
            width: "24px",
            height: "24px",
            borderRadius: "50%",
            backgroundColor: "#7b8a97",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontSize: "10px",
            overflow: "hidden",
            flexShrink: 0,
          }}
        >
          {parentPost.author?.profileImage ? (
            <img
              src={getImageUrl(parentPost.author.profileImage)}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
              alt=""
            />
          ) : (
            parentPost.author?.displayName?.[0] || "U"
          )}
        </div>

        <span
          style={{ fontWeight: "bold", fontSize: "0.85rem", color: "#555" }}
        >
          {parentPost.author?.displayName}
        </span>
      </div>

      {/* Content Section: Image and Text */}
      <div
        style={{
          display: "flex",
          gap: "12px",
          alignItems: "center",
        }}
      >
        {parentPost.mediaUrl && (
          <img
            src={getImageUrl(parentPost.mediaUrl)}
            style={{
              width: "80px",
              height: "60px",
              objectFit: "cover",
              borderRadius: "8px",
            }}
            alt=""
          />
        )}
        <div style={{ flex: 1 }}>
          <h4
            style={{ margin: "0 0 5px 0", fontSize: "0.95rem", color: "#333" }}
          >
            {parentPost.title}
          </h4>
          <p
            style={{
              margin: 0,
              fontSize: "0.8rem",
              color: "#666",
              display: "-webkit-box",
              WebkitLineClamp: "2",
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {parentPost.content}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SharedBox;
