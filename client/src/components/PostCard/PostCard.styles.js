// PostCard.styles.js

export const cardStyle = {
  border: "1px solid #eee",
  borderRadius: "15px",
  backgroundColor: "#fff",
  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
  position: "relative",
  marginBottom: "20px",
  overflow: "hidden",
};

export const headerWrapper = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "15px",
  direction: "ltr",
  flexDirection: "row",
};

// קבוצת הפרופיל (תמונה + טקסט)
export const authorInfoGroup = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
  flexDirection: "row",
  direction: "ltr",
};

export const textStack = {
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  textAlign: "left",
};

export const avatarStyle = {
  width: "40px",
  height: "40px",
  borderRadius: "50%",
  backgroundColor: "#007bff",
  color: "white",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: "bold",
  overflow: "hidden",
  border: "1px solid #eee",
  flexShrink: 0,
};

export const avatarImgStyle = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
};

export const authorNameStyle = {
  fontWeight: "bold",
  fontSize: "15px",
  textDecoration: "none",
  color: "#1c1e21",
};

export const dateStyle = {
  fontSize: "12px",
  color: "#65676b",
  marginTop: "1px",
};

export const categoryBadgeStyle = {
  fontSize: "12px",
  backgroundColor: "#e7f3ff",
  color: "#1877f2",
  padding: "4px 12px",
  borderRadius: "20px",
  fontWeight: "bold",
  direction: "rtl",
};

export const contentTextStyle = {
  whiteSpace: "pre-wrap",
  color: "#444",
  margin: "0 15px 15px 15px",
  textAlign: "start",
  unicodeBidi: "plaintext",
};

export const mediaWrapperStyle = {
  marginBottom: "15px",
  overflow: "hidden",
  backgroundColor: "#f0f2f5",
};

export const mediaContentStyle = {
  width: "100%",
  maxHeight: "450px",
  objectFit: "cover",
  display: "block",
};

export const footerContainerStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "15px",
  borderTop: "1px solid #f0f2f5",
};

export const leftFooterActions = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
};

export const rightFooterActions = { display: "flex", gap: "15px" };

export const likeButtonStyle = {
  background: "none",
  border: "none",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  gap: "4px",
  outline: "none",
};

export const commentToggleBtnStyle = { ...likeButtonStyle };

export const likeCountLabel = {
  fontWeight: "bold",
  color: "#65676b",
  fontSize: "14px",
};

export const secondaryBtnStyle = {
  background: "none",
  border: "none",
  cursor: "pointer",
  fontSize: "1.3rem",
};

export const deleteBtnStyle = { ...secondaryBtnStyle, opacity: 0.7 };
