import React from "react";
import * as s from "./PostCard.styles";
import { translations } from "../../translations";

const PostContent = ({
  currentLang,
  title,
  content,
  authorName,
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
      {/* שם המשתמש, כותרת, ותוכן רציף */}
      <div style={s.contentTextStyle} dir="auto">
        <span style={{ fontWeight: "600", marginInlineEnd: "6px" }}>
          {authorName}
        </span>
        {title && <span style={{ fontWeight: "500" }}>{title} - </span>}
        <span>{content}</span>
      </div>

      {/* כלים - כתגיות מעוצבות ונקיות */}
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

      {/* חומרים - כתגיות מעוצבות ונקיות */}
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
