import React from "react";
import * as s from "./PostCard.styles";
import { translations } from "../../translations";

const PostContent = ({
  currentLang,
  title,
  content,
  onNavigate,
  tools,
  materials,
}) => {
  const t = translations[currentLang] || translations.en;

  return (
    <div
      onClick={onNavigate}
      style={{ cursor: "pointer", padding: "0 14px 14px 14px" }}
    >
      {title && (
        <div style={{ marginBottom: "6px" }} dir="auto">
          <span
            style={{ fontWeight: "600", color: "#262626", fontSize: "15px" }}
          >
            {title}
          </span>
        </div>
      )}

      <div
        style={{
          ...s.contentTextStyle,
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
        }}
        dir="auto"
      >
        {content}
      </div>

      {tools && tools.length > 0 && (
        <div style={{ marginTop: "12px" }} dir="auto">
          <span style={s.sectionTitleStyle}>{t.tools}:</span>
          <div style={s.badgeContainerStyle}>
            {tools.map((tool, index) => (
              <span key={index} style={s.badgeStyle}>
                {tool}
              </span>
            ))}
          </div>
        </div>
      )}

      {materials && materials.length > 0 && (
        <div style={{ marginTop: "12px" }} dir="auto">
          <span style={s.sectionTitleStyle}>{t.materials}:</span>
          <div style={s.badgeContainerStyle}>
            {materials.map((item, index) => (
              <span key={index} style={s.badgeStyle}>
                {item}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PostContent;
