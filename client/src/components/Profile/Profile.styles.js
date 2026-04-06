// Profile.styles.js

export const containerStyle = {
  padding: "20px 0",
  maxWidth: "600px", // מיושר לרוחב של הפיד לשמירה על עקביות
  margin: "0 auto",
  boxSizing: "border-box",
};

export const headerStyle = {
  display: "flex",
  alignItems: "center",
  gap: "28px",
  backgroundColor: "transparent",
  padding: "0 16px 30px 16px",
  borderBottom: "1px solid #dbdbdb", // קו הפרדה נקי ועדין
  marginBottom: "20px",
};

export const avatarRingStyle = {
  width: "90px",
  height: "90px",
  borderRadius: "50%",
  background:
    "linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)", // גוון אינסטגרמי
  padding: "3px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
};

export const avatarContainerStyle = {
  width: "100%",
  height: "100%",
  borderRadius: "50%",
  backgroundColor: "#fafafa",
  overflow: "hidden",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  border: "3px solid #ffffff", // מרווח לבן שמפריד בין התמונה לטבעת הצבעונית
};

export const fallbackAvatarStyle = {
  fontSize: "28px",
  fontWeight: "600",
  color: "#8e8e8e",
};

export const imgStyle = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
};

export const profileNameStyle = {
  margin: "0 0 4px 0",
  color: "#262626",
  fontSize: "20px",
  fontWeight: "600",
};

export const profileEmailStyle = {
  color: "#8e8e8e",
  margin: "0 0 16px 0",
  fontSize: "14px",
};

export const actionButtonsWrapper = {
  display: "flex",
  gap: "8px",
};

export const actionButtonStyle = {
  padding: "6px 16px",
  borderRadius: "8px",
  border: "none",
  backgroundColor: "#0095f6", // כחול אינסטגרם מרכזי
  color: "#ffffff",
  textDecoration: "none",
  fontSize: "14px",
  fontWeight: "600",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

export const editButtonStyle = {
  ...actionButtonStyle,
  backgroundColor: "#efefef", // כפתור משני שטוח
  color: "#262626",
};

export const searchWrapperStyle = {
  marginBottom: "20px",
  padding: "0 16px",
};

export const profileSearchInputStyle = {
  width: "100%",
  padding: "8px 16px",
  borderRadius: "8px",
  border: "none",
  backgroundColor: "#efefef",
  fontSize: "14px",
  outline: "none",
  boxSizing: "border-box",
  color: "#262626",
};

export const sectionTitleStyle = {
  display: "flex",
  alignItems: "center",
  padding: "0 16px",
  marginBottom: "16px",
  color: "#262626",
  fontSize: "16px",
  fontWeight: "600",
};

export const loadingTextStyle = {
  fontSize: "12px",
  marginInlineStart: "auto",
  color: "#8e8e8e",
  fontWeight: "400",
};

export const postsGridStyle = {
  display: "flex",
  flexDirection: "column",
};

export const emptyStateStyle = {
  textAlign: "center",
  padding: "60px 20px",
  color: "#8e8e8e",
  fontSize: "14px",
};

export const emptyStateLinkStyle = {
  color: "#0095f6",
  fontWeight: "600",
  textDecoration: "none",
  marginTop: "8px",
  display: "inline-block",
};
