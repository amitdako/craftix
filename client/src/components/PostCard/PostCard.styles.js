// PostCard.styles.js

export const cardStyle = {
  border: "1px solid #eee",
  padding: "20px",
  borderRadius: "15px",
  backgroundColor: "#fff",
  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
  position: "relative",
  marginBottom: "20px",
};

export const topActionsWrapper = {
  position: "absolute",
  top: "15px",
  right: "15px",
  display: "flex",
  alignItems: "center",
  gap: "10px",
};

export const categoryBadgeStyle = {
  fontSize: "12px",
  backgroundColor: "#f0f2f5",
  color: "#65676b",
  padding: "4px 12px",
  borderRadius: "15px",
  fontWeight: "600",
};

export const ellipsisBtnStyle = {
  background: "none",
  border: "none",
  fontSize: "22px",
  cursor: "pointer",
  color: "#65676b",
};

export const dropdownMenuStyle = {
  position: "absolute",
  right: "0",
  top: "35px",
  backgroundColor: "#fff",
  boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
  borderRadius: "8px",
  zIndex: "10",
  width: "160px",
  border: "1px solid #eee",
  overflow: "hidden",
};

export const menuItemStyle = {
  width: "100%",
  padding: "12px 15px",
  textAlign: "left",
  background: "none",
  border: "none",
  cursor: "pointer",
  fontSize: "14px",
  borderBottom: "1px solid #f0f2f5",
};

export const authorHeaderStyle = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  marginBottom: "15px",
  textDecoration: "none",
  color: "inherit",
};

export const avatarStyle = {
  width: "35px",
  height: "35px",
  borderRadius: "50%",
  backgroundColor: "#007bff",
  color: "white",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: "bold",
  overflow: "hidden",
  border: "1px solid #eee",
};

export const avatarImgStyle = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
};
export const authorNameStyle = { fontWeight: "bold", fontSize: "14px" };

export const mediaWrapperStyle = {
  marginBottom: "15px",
  borderRadius: "10px",
  overflow: "hidden",
  backgroundColor: "#f0f2f5",
};

export const mediaContentStyle = {
  width: "100%",
  maxHeight: "450px",
  objectFit: "cover",
  display: "block",
};

export const contentTextStyle = {
  whiteSpace: "pre-wrap",
  color: "#444",
  margin: "0 0 15px 0",
};

export const projectDetailsBoxStyle = {
  backgroundColor: "#f8f9fa",
  padding: "15px",
  borderRadius: "10px",
  borderLeft: "4px solid #007bff",
};

export const detailItemStyle = { margin: "5px 0" };

export const footerContainerStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginTop: "15px",
  paddingTop: "15px",
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

export const commentToggleBtnStyle = { ...likeButtonStyle, marginLeft: "0px" };
export const likeCountLabel = {
  fontWeight: "bold",
  color: "#65676b",
  fontSize: "14px",
};

export const secondaryBtnStyle = {
  background: "none",
  border: "none",
  cursor: "pointer",
  fontSize: "18px",
};

export const deleteBtnStyle = { ...secondaryBtnStyle, opacity: 0.7 };
