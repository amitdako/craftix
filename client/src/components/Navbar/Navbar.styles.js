// Navbar.styles.js

export const navContainerStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  borderBottom: "1px solid #dbdbdb", // קו נקי ודק במקום הצללית
  padding: "10px 20px",
  backgroundColor: "#ffffff",
  position: "sticky",
  top: 0,
  zIndex: 1000,
  height: "60px", // מקבע גובה אחיד כמו בניווט עליון קלאסי
  boxSizing: "border-box",
};

export const leftSectionStyle = {
  display: "flex",
  alignItems: "center",
  gap: "20px",
};

export const userSectionStyle = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
  borderInlineStart: "1px solid #efefef", // קו הפרדה שמתהפך לפי השפה
  paddingInlineStart: "20px",
};

export const avatarContainerStyle = {
  width: "36px",
  height: "36px",
  borderRadius: "50%",
  backgroundColor: "#efefef",
  color: "#8e8e8e",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  overflow: "hidden",
  fontSize: "14px",
  fontWeight: "600",
  border: "1px solid #dbdbdb",
  flexShrink: 0,
};

export const avatarImgStyle = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
};

export const userActionsStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  justifyContent: "center",
  fontSize: "13px",
  color: "#262626",
};

export const logoutButtonStyle = {
  padding: "0",
  marginTop: "2px",
  backgroundColor: "transparent",
  color: "#ed4956", // אדום נקי של אינסטגרם
  border: "none",
  cursor: "pointer",
  fontSize: "12px",
  fontWeight: "600",
};

export const searchFormStyle = {
  flex: 1,
  maxWidth: "350px",
  margin: "0 20px",
};

export const searchInputStyle = {
  width: "100%",
  padding: "8px 16px",
  borderRadius: "8px", // מלבן מעוגל קלות, כמו באינסטגרם 웹
  border: "none",
  backgroundColor: "#efefef",
  outline: "none",
  fontSize: "14px",
  color: "#262626",
  boxSizing: "border-box",
};

export const rightLinksWrapper = {
  display: "flex",
  alignItems: "center",
  gap: "20px",
};

export const linkStyle = {
  textDecoration: "none",
  color: "#262626",
  fontWeight: "600",
  fontSize: "14px",
  transition: "opacity 0.2s",
};

export const logoStyle = {
  height: "35px", // שמרתי על פרופורציה אלגנטית
  width: "auto",
};

export const newProjectBtnStyle = {
  textDecoration: "none",
  backgroundColor: "#0095f6", // כחול מרכזי
  color: "#ffffff",
  padding: "6px 16px",
  borderRadius: "8px", // שטוח ונקי
  fontWeight: "600",
  fontSize: "14px",
  transition: "opacity 0.2s",
};
