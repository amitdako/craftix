// Feed.styles.js

export const feedContainerStyle = {
  maxWidth: "700px",
  margin: "auto",
  padding: "20px",
};

export const dropdownWrapperStyle = {
  position: "relative",
  marginBottom: "30px",
  zIndex: 20,
};

export const dropdownToggleStyle = {
  width: "100%",
  padding: "12px 20px",
  backgroundColor: "#fff",
  border: "1px solid #ddd",
  borderRadius: "10px",
  display: "flex",
  justifyContent: "space-between",
  cursor: "pointer",
  fontSize: "15px",
  fontWeight: "600",
};

export const dropdownMenuStyle = {
  position: "absolute",
  top: "100%",
  left: "0",
  right: "0",
  backgroundColor: "#fff",
  border: "1px solid #eee",
  borderRadius: "10px",
  boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
  zIndex: 100,
  marginTop: "5px",
  maxHeight: "250px",
  overflowY: "auto",
};

export const categoryItemStyle = {
  padding: "12px 20px",
  cursor: "pointer",
  borderBottom: "1px solid #f9f9f9",
  transition: "background 0.2s",
};

export const userResultsSectionStyle = {
  backgroundColor: "#fff",
  padding: "15px",
  borderRadius: "12px",
  marginBottom: "20px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
};

export const userListHorizontalStyle = {
  display: "flex",
  gap: "20px",
  overflowX: "auto",
  paddingBottom: "10px",
  scrollbarWidth: "none", // For Firefox
};

export const userCardStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  cursor: "pointer",
  minWidth: "70px",
};

export const userAvatarStyle = {
  width: "55px",
  height: "55px",
  borderRadius: "50%",
  objectFit: "cover",
  border: "2px solid #007bff",
  padding: "2px",
  marginBottom: "5px",
};

export const userNameStyle = {
  fontSize: "12px",
  fontWeight: "600",
  color: "#333",
  textAlign: "center",
  maxWidth: "80px",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
};

export const postsListStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "10px",
};

export const emptyStateStyle = {
  textAlign: "center",
  padding: "50px",
  color: "#666",
};

export const clearFilterButtonStyle = {
  color: "#007bff",
  border: "none",
  background: "none",
  cursor: "pointer",
  fontWeight: "bold",
  textDecoration: "underline",
};
