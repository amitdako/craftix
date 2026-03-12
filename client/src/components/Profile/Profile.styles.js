// Profile.styles.js

export const containerStyle = {
  padding: "20px",
  maxWidth: "800px",
  margin: "auto",
};

export const headerStyle = {
  display: "flex",
  alignItems: "center",
  gap: "30px",
  backgroundColor: "#fff",
  padding: "30px",
  borderRadius: "15px",
  boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
  marginBottom: "40px",
  border: "1px solid #eee",
};

export const avatarContainerStyle = {
  width: "110px",
  height: "110px",
  borderRadius: "50%",
  backgroundColor: "#007bff",
  overflow: "hidden",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  border: "3px solid #f0f2f5",
};

export const profileSearchInputStyle = {
  width: "100%",
  padding: "12px 20px",
  borderRadius: "10px",
  border: "1px solid #ddd",
  fontSize: "15px",
  outline: "none",
  boxSizing: "border-box",
  boxShadow: "0 2px 5px rgba(0,0,0,0.02)",
};

export const fallbackAvatarStyle = {
  fontSize: "45px",
  fontWeight: "bold",
  color: "white",
};

export const imgStyle = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
};

export const actionButtonStyle = {
  padding: "10px 20px",
  borderRadius: "8px",
  border: "none",
  backgroundColor: "#007bff",
  color: "white",
  textDecoration: "none",
  fontSize: "14px",
  fontWeight: "bold",
  cursor: "pointer",
};

export const editButtonStyle = {
  ...actionButtonStyle,
  backgroundColor: "#f0f2f5",
  color: "#1c1e21",
};

export const sectionTitleStyle = {
  borderBottom: "2px solid #f0f2f5",
  paddingBottom: "15px",
  marginBottom: "25px",
  color: "#1c1e21",
};

export const emptyStateStyle = {
  textAlign: "center",
  padding: "50px",
  backgroundColor: "#f8f9fa",
  borderRadius: "15px",
  color: "#65676b",
  border: "1px dashed #ccc",
};
