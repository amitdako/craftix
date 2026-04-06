// PostDetails.styles.js

export const container = {
  maxWidth: "600px",
  margin: "0 auto", // יושב בול באמצע כמו בפיד
  padding: "0",
  backgroundColor: "#ffffff",
  borderBottom: "1px solid #dbdbdb", // רק קו תחתון, בלי מסגרת מלאה או צל
  fontFamily: "inherit",
  display: "flex",
  flexDirection: "column",
};

export const image = {
  width: "100%",
  maxHeight: "600px", // תמונה גדולה ומרשימה
  objectFit: "cover",
  display: "block",
};

export const title = {
  fontSize: "16px",
  color: "#262626",
  margin: "0 0 8px 0",
  fontWeight: "600",
  lineHeight: "1.3",
};

export const description = {
  lineHeight: "1.5",
  color: "#262626",
  fontSize: "14px",
  whiteSpace: "pre-wrap",
  margin: "0",
};

export const loading = {
  textAlign: "center",
  marginTop: "60px",
  fontSize: "14px",
  color: "#8e8e8e",
};

export const sectionTitleStyle = {
  display: "block",
  fontSize: "13px",
  fontWeight: "600",
  color: "#262626",
  marginBottom: "6px",
};

export const badgeContainerStyle = {
  display: "flex",
  flexWrap: "wrap",
  gap: "6px",
  marginBottom: "12px",
};

export const badgeStyle = {
  backgroundColor: "#fafafa",
  color: "#262626",
  border: "1px solid #dbdbdb",
  padding: "4px 10px",
  borderRadius: "6px",
  fontSize: "13px",
};

// כפתורים תחתונים
export const actionBtnStyle = {
  background: "none",
  border: "none",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  gap: "6px",
  color: "#262626",
  padding: "0",
};

export const actionCountStyle = {
  fontSize: "14px",
  fontWeight: "600",
};

export const madeThisButtonStyle = (isOpen) => ({
  backgroundColor: isOpen ? "#efefef" : "transparent",
  color: "#262626",
  border: "1px solid #dbdbdb",
  padding: "4px 12px",
  borderRadius: "6px",
  fontWeight: "600",
  cursor: "pointer",
  fontSize: "12px",
  display: "flex",
  alignItems: "center",
});
