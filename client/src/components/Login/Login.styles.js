// Login.styles.js
export const containerStyle = {
  maxWidth: "400px",
  margin: "80px auto",
  padding: "40px",
  backgroundColor: "#fff",
  borderRadius: "15px",
  boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
  textAlign: "center",
};

export const titleStyle = {
  marginBottom: "30px",
  color: "#1c1e21",
  fontSize: "24px",
  fontWeight: "bold",
};

export const formStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "15px",
};

export const inputStyle = {
  width: "100%",
  padding: "12px 15px",
  borderRadius: "8px",
  border: "1px solid #ddd",
  fontSize: "15px",
  boxSizing: "border-box",
  outline: "none",
  transition: "border-color 0.2s",
};

export const buttonStyle = (isSubmitting) => ({
  width: "100%",
  padding: "12px",
  borderRadius: "8px",
  border: "none",
  backgroundColor: "#007bff",
  color: "#fff",
  fontSize: "16px",
  fontWeight: "bold",
  cursor: isSubmitting ? "not-allowed" : "pointer",
  opacity: isSubmitting ? 0.7 : 1,
  marginTop: "10px",
  transition: "background-color 0.2s",
});

export const messageStyle = {
  marginTop: "20px",
  color: "#dc3545",
  fontSize: "14px",
  backgroundColor: "#ffebe9",
  padding: "10px",
  borderRadius: "6px",
};
