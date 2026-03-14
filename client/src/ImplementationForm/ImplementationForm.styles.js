// ImplementationForm.styles.js

export const formContainer = {
  padding: "15px",
  backgroundColor: "#fff5f5",
  borderTop: "1px solid #ffe3e3",
};

export const header = {
  display: "flex",
  alignItems: "center",
  marginBottom: "15px",
  gap: "12px",
  direction: "ltr",
};

export const avatar = {
  width: "40px",
  height: "40px",
  borderRadius: "50%",
  overflow: "hidden",
  flexShrink: 0,
  backgroundColor: "#007bff", // רקע ברירת מחדל לאות
  color: "white",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: "bold",
};

export const textarea = {
  width: "100%",
  padding: "15px",
  borderRadius: "15px",
  border: "1px solid #ddd",
  minHeight: "100px",
  outline: "none",
  fontSize: "1rem",
  resize: "none",
  fontFamily: "inherit",
  backgroundColor: "#fff",
  marginBottom: "10px",
};

export const footer = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginTop: "10px",
  direction: "ltr",
};

export const addMediaLabel = {
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  gap: "8px",
  color: "#65676b",
  fontWeight: "600",
  fontSize: "0.95rem",
};

export const buttonGroup = {
  display: "flex",
  gap: "10px",
};

export const cancelBtn = {
  backgroundColor: "white",
  color: "#1c1e21",
  border: "1px solid #ddd",
  padding: "8px 20px",
  borderRadius: "20px",
  cursor: "pointer",
  fontWeight: "600",
};

export const shareBtn = {
  backgroundColor: "#ff4757",
  color: "white",
  border: "none",
  padding: "8px 25px",
  borderRadius: "20px",
  cursor: "pointer",
  fontWeight: "bold",
};
