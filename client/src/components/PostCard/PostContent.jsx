import React from "react";
import * as s from "./PostCard.styles";

const PostContent = ({
  currentLang,
  title,
  content,
  mediaUrl,
  mediaType,
  getImageUrl,
  onNavigate,
  tools,
  materials,
}) => (
  <div onClick={onNavigate} style={{ cursor: "pointer" }}>
    {mediaUrl && (
      <div style={s.mediaWrapperStyle}>
        {mediaType === "video" ? (
          <video
            src={getImageUrl(mediaUrl)}
            controls
            style={s.mediaContentStyle}
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <img src={getImageUrl(mediaUrl)} style={s.mediaContentStyle} alt="" />
        )}
      </div>
    )}

    <div style={{ padding: "0 15px 15px 15px" }}>
      {title && (
        <h3
          style={{ margin: "10px 0", fontSize: "1.2rem", textAlign: "start" }}
          dir="auto"
        >
          {title}
        </h3>
      )}
      {tools && tools.length > 0 && (
        <div style={{ marginTop: "15px" }}>
          <span style={s.sectionTitleStyle} dir="auto">
            ⚒️ Tools:
          </span>
          <div style={s.badgeContainerStyle} dir="auto">
            {tools.map((tool, index) => (
              <span key={index} style={s.badgeStyle}>
                {tool}
              </span>
            ))}
          </div>
        </div>
      )}
      {materials && materials.length > 0 && (
        <div style={{ marginTop: "15px", marginBottom: "20px" }}>
          <span style={s.sectionTitleStyle} dir="auto">
            📦 Materials:
          </span>
          <div style={s.badgeContainerStyle} dir="auto">
            {materials.map((item, index) => (
              <span key={index} style={s.badgeStyle}>
                {item}
              </span>
            ))}
          </div>
        </div>
      )}
      <p style={s.contentTextStyle} dir="auto">
        {content}
      </p>
    </div>
  </div>
);

export default PostContent;
