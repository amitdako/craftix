export const containerStyle = {
  maxWidth: "350px",
  margin: "80px auto",
  padding: "40px 30px",
  backgroundColor: "#ffffff",
  border: "1px solid #dbdbdb",
  borderRadius: "8px",
  textAlign: "center",
  boxSizing: "border-box",
};

export const titleStyle = {
  marginBottom: "30px",
  color: "#262626",
  fontSize: "24px",
  fontWeight: "600",
};

export const formStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "10px",
};

export const inputStyle = {
  width: "100%",
  padding: "10px 12px",
  borderRadius: "6px",
  border: "1px solid #dbdbdb",
  backgroundColor: "#fafafa",
  fontSize: "14px",
  color: "#262626",
  boxSizing: "border-box",
  outline: "none",
  transition: "border-color 0.2s",
};

export const buttonStyle = (isSubmitting) => ({
  width: "100%",
  padding: "10px",
  borderRadius: "8px",
  border: "none",
  backgroundColor: "#0095f6",
  color: "#ffffff",
  fontSize: "14px",
  fontWeight: "600",
  cursor: isSubmitting ? "default" : "pointer",
  opacity: isSubmitting ? 0.6 : 1,
  marginTop: "16px",
  transition: "opacity 0.2s",
});

export const messageStyle = {
  marginTop: "20px",
  color: "#ed4956",
  fontSize: "14px",
  fontWeight: "500",
  textAlign: "center",
};
