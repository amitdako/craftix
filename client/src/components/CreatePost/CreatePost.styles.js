// CreatePost.styles.js
export const containerStyle = {
  maxWidth: "600px",
  margin: "40px auto",
  padding: "30px",
  backgroundColor: "#fff",
  borderRadius: "15px",
  boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
};

export const titleStyle = { textAlign: "center", marginBottom: "30px" };

export const typeSelectorStyle = {
  display: "flex",
  gap: "15px",
  marginBottom: "25px",
};

export const typeButtonStyle = (isActive) => ({
  flex: 1,
  padding: "12px",
  borderRadius: "8px",
  border: "none",
  cursor: "pointer",
  fontWeight: "bold",
  backgroundColor: isActive ? "#007bff" : "#f0f2f5",
  color: isActive ? "#fff" : "#444",
  transition: "all 0.2s ease",
});

export const labelStyle = {
  fontWeight: "bold",
  display: "block",
  marginTop: "15px",
  marginBottom: "5px",
  color: "#333",
};

export const inputStyle = {
  width: "100%",
  padding: "12px",
  borderRadius: "8px",
  border: "1px solid #ddd",
  fontSize: "14px",
  boxSizing: "border-box",
};

export const submitButtonStyle = (isSubmitting) => ({
  width: "100%",
  padding: "15px",
  borderRadius: "8px",
  border: "none",
  backgroundColor: "#28a745",
  color: "#fff",
  fontSize: "16px",
  fontWeight: "bold",
  marginTop: "20px",
  cursor: isSubmitting ? "not-allowed" : "pointer",
  opacity: isSubmitting ? 0.7 : 1,
});

export const previewContainerStyle = {
  marginTop: "15px",
  borderRadius: "10px",
  overflow: "hidden",
  border: "1px solid #eee",
  backgroundColor: "#f9f9f9",
  display: "flex",
  justifyContent: "center",
};

export const previewMediaStyle = {
  maxWidth: "100%",
  maxHeight: "300px",
  display: "block",
};
