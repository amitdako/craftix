import React from "react";
import { translations } from "../../translations";

const PostImplementationBox = ({
  currentLang,
  parentPost,
  getImageUrl,
  onNavigate,
}) => {
  if (!parentPost) return null;

  const t = translations[currentLang] || translations.en;
  const isHe = currentLang === "he";

  return (
    <div
      style={{
        margin: "10px 14px 15px 14px",
        border: "1px solid #dbdbdb",
        borderRadius: "8px",
        backgroundColor: "#ffffff",
        cursor: "pointer",
        display: "flex",
        alignItems: "stretch",
        overflow: "hidden",
        direction: isHe ? "rtl" : "ltr",
      }}
      onClick={onNavigate}
    >
      {parentPost.mediaUrl && ( //the picture of the original post
        <div
          style={{
            width: "85px",
            flexShrink: 0,
            borderInlineEnd: "1px solid #dbdbdb",
            backgroundColor: "#fafafa",
          }}
        >
          <img
            src={getImageUrl(parentPost.mediaUrl)}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
            alt=""
          />
        </div>
      )}

      <div // title and creator
        style={{
          padding: "12px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          flex: 1,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            marginBottom: "4px",
          }}
        >
          <div
            style={{
              width: "16px",
              height: "16px",
              borderRadius: "50%",
              backgroundColor: "#efefef",
              overflow: "hidden",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "8px",
              fontWeight: "bold",
              color: "#8e8e8e",
              border: "1px solid #dbdbdb",
            }}
          >
            {parentPost.author?.profileImage ? (
              <img
                src={getImageUrl(parentPost.author.profileImage)}
                alt=""
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              parentPost.author?.displayName?.[0] || "U"
            )}
          </div>
          <span
            style={{ fontSize: "12px", color: "#8e8e8e", fontWeight: "500" }}
          >
            {t.originalCreator}: {parentPost.author?.displayName || "User"}
          </span>
        </div>

        <h4
          style={{
            margin: "0",
            fontSize: "14px",
            color: "#262626",
            fontWeight: "600",
            lineHeight: "1.3",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {parentPost.title}
        </h4>
      </div>
    </div>
  );
};

export default PostImplementationBox;
