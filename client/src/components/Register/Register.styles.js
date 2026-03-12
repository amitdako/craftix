// Register.styles.js
export const containerStyle = {
  maxWidth: "450px", // מעט רחב יותר מהלוגין בגלל כמות השדות
  margin: "50px auto",
  padding: "30px",
  backgroundColor: "#fff",
  borderRadius: "15px",
  boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
};

export const titleStyle = {
  textAlign: "center",
  marginBottom: "25px",
  color: "#1c1e21",
  fontSize: "22px",
  fontWeight: "bold",
};

export const formStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "12px", // רווח קבוע בין השדות
};

export const inputStyle = {
  width: "100%",
  padding: "12px",
  borderRadius: "8px",
  border: "1px solid #ddd",
  fontSize: "14px",
  boxSizing: "border-box",
  outline: "none",
};

export const labelStyle = {
  display: "block",
  marginTop: "5px",
  fontSize: "13px",
  fontWeight: "bold",
  color: "#65676b",
};

export const buttonStyle = (isSubmitting) => ({
  width: "100%",
  padding: "14px",
  borderRadius: "8px",
  border: "none",
  backgroundColor: "#28a745", // ירוק מסמל "יצירה" ורישום
  color: "#fff",
  fontSize: "16px",
  fontWeight: "bold",
  cursor: isSubmitting ? "not-allowed" : "pointer",
  opacity: isSubmitting ? 0.7 : 1,
  marginTop: "15px",
  transition: "all 0.2s ease",
});

export const messageStyle = (isSuccess) => ({
  marginTop: "20px",
  textAlign: "center",
  padding: "10px",
  borderRadius: "8px",
  fontSize: "14px",
  backgroundColor: isSuccess ? "#e7f3ff" : "#ffebe9",
  color: isSuccess ? "#007bff" : "#dc3545",
});
