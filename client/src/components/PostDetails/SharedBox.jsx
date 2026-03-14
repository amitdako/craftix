import React from "react";
import { useNavigate } from "react-router-dom";
import * as S from "./PostDetails.styles";

const SharedBox = ({ parentPost, getImageUrl }) => {
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
        textAlign: "right",
        cursor: "pointer",
      }}
      onClick={() => navigate(`/post/${parentPost._id || parentPost}`)}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          marginBottom: "10px",
          justifyContent: "flex-start",
          flexDirection: "row-reverse",
        }}
      >
        <span style={{ fontWeight: "bold", fontSize: "0.85rem" }}>
          {parentPost.author?.displayName}
        </span>
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
          }}
        >
          {parentPost.author?.profileImage ? (
            <img
              src={getImageUrl(parentPost.author.profileImage)}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
              alt=""
            />
          ) : (
            parentPost.author?.displayName?.[0]
          )}
        </div>
      </div>
      <div
        style={{ display: "flex", gap: "12px", flexDirection: "row-reverse" }}
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
          <h4 style={{ margin: "0 0 5px 0", fontSize: "0.95rem" }}>
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
