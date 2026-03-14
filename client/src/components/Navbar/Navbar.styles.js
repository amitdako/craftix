// Navbar.styles.js

export const navContainerStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "30px",
  borderBottom: "1px solid #eee",
  padding: "10px 20px",
  backgroundColor: "#fff",
  position: "sticky",
  top: 0,
  zIndex: 1000,
  boxShadow: "0 2px 10px rgba(0,0,0,0.02)",
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
  borderLeft: "1px solid #eee",
  paddingLeft: "20px",
};

export const avatarContainerStyle = {
  width: "40px",
  height: "40px",
  borderRadius: "50%",
  backgroundColor: "#007bff",
  color: "white",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  overflow: "hidden",
  fontSize: "16px",
  fontWeight: "bold",
  border: "1px solid #f0f2f5",
};

export const avatarImgStyle = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
};

export const userActionsStyle = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
  fontSize: "14px",
  color: "#1c1e21",
};

export const logoutButtonStyle = {
  padding: "6px 12px",
  backgroundColor: "#f0f2f5",
  color: "#ff4d4d",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  fontSize: "12px",
  fontWeight: "bold",
  transition: "background 0.2s",
};

export const searchFormStyle = {
  flex: 1,
  maxWidth: "400px",
  margin: "0 40px",
};

export const searchInputStyle = {
  width: "100%",
  padding: "10px 20px",
  borderRadius: "25px",
  border: "1px solid #ddd",
  backgroundColor: "#f9f9f9",
  outline: "none",
  fontSize: "14px",
  transition: "all 0.2s ease",
};

export const rightLinksWrapper = {
  display: "flex",
  gap: "15px",
  alignItems: "center",
  gap: "25px",
  marginLeft: "30px",
};

export const linkStyle = {
  textDecoration: "none",
  color: "#65676b",
  fontWeight: "600",
  fontSize: "14px",
  transition: "color 0.2s",
};

export const activeLinkStyle = {
  ...linkStyle,
  color: "#007bff",
};

export const logoStyle = {
  height: "45px",
  width: "auto",
};

export const newProjectBtnStyle = {
  ...linkStyle,
  backgroundColor: "#28a745",
  color: "white",
  padding: "8px 18px",
  borderRadius: "20px",
  boxShadow: "0 2px 6px rgba(40, 167, 69, 0.2)",
};
