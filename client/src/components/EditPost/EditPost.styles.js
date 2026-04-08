export const containerStyle = {
  maxWidth: "600px",
  margin: "40px auto",
  padding: "30px 40px",
  backgroundColor: "#ffffff",
  borderRadius: "12px",
  border: "1px solid #dbdbdb",
  boxSizing: "border-box",
};

export const titleStyle = {
  textAlign: "center",
  marginBottom: "30px",
  color: "#262626",
  fontSize: "22px",
  fontWeight: "600",
};

export const typeSelectorStyle = {
  display: "flex",
  gap: "4px",
  marginBottom: "25px",
  backgroundColor: "#efefef",
  padding: "4px",
  borderRadius: "10px",
};

export const typeButtonStyle = (isActive) => ({
  flex: 1,
  padding: "10px",
  borderRadius: "8px",
  border: "none",
  cursor: "pointer",
  fontWeight: "600",
  fontSize: "14px",
  backgroundColor: isActive ? "#ffffff" : "transparent",
  color: isActive ? "#262626" : "#8e8e8e",
  boxShadow: isActive ? "0 2px 5px rgba(0,0,0,0.05)" : "none",
  transition: "all 0.2s ease",
});

export const labelStyle = {
  fontWeight: "600",
  display: "block",
  marginTop: "20px",
  marginBottom: "8px",
  color: "#262626",
  fontSize: "14px",
};

export const inputStyle = {
  width: "100%",
  padding: "12px 16px",
  borderRadius: "8px",
  border: "1px solid #dbdbdb",
  fontSize: "14px",
  boxSizing: "border-box",
  backgroundColor: "#fafafa",
  color: "#262626",
  outline: "none",
  transition: "border-color 0.2s",
};

export const fileUploadLabelStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: "30px",
  border: "1px dashed #dbdbdb",
  borderRadius: "8px",
  backgroundColor: "#fafafa",
  cursor: "pointer",
  gap: "10px",
  color: "#262626",
};

export const submitButtonStyle = (isSubmitting) => ({
  width: "100%",
  padding: "12px",
  borderRadius: "8px",
  border: "none",
  backgroundColor: "#0095f6",
  color: "#ffffff",
  fontSize: "14px",
  fontWeight: "600",
  marginTop: "30px",
  cursor: isSubmitting ? "default" : "pointer",
  opacity: isSubmitting ? 0.6 : 1,
  transition: "opacity 0.2s",
});

export const previewContainerStyle = {
  marginTop: "15px",
  borderRadius: "8px",
  overflow: "hidden",
  border: "1px solid #dbdbdb",
  backgroundColor: "#fafafa",
  display: "flex",
  justifyContent: "center",
  position: "relative",
};

export const previewMediaStyle = {
  maxWidth: "100%",
  maxHeight: "400px",
  display: "block",
  objectFit: "cover",
};
