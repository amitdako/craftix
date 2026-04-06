// Register.styles.js

export const containerStyle = {
  maxWidth: "350px", // שמרנו על רוחב זהה לעמוד ה-Login למראה אחיד
  margin: "50px auto",
  padding: "40px 30px",
  backgroundColor: "#ffffff",
  borderRadius: "8px",
  border: "1px solid #dbdbdb", // מסגרת עדינה במקום צללית
  boxSizing: "border-box",
};

export const titleStyle = {
  textAlign: "center",
  marginBottom: "30px",
  color: "#262626", // שחור נקי
  fontSize: "24px",
  fontWeight: "600",
};

export const formStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "10px", // מרווח צפוף ונקי בין השדות
};

export const inputStyle = {
  width: "100%",
  padding: "10px 12px",
  borderRadius: "6px",
  border: "1px solid #dbdbdb",
  backgroundColor: "#fafafa", // רקע אפרפר לשדות
  fontSize: "14px",
  color: "#262626",
  boxSizing: "border-box",
  outline: "none",
  transition: "border-color 0.2s",
};

export const labelStyle = {
  display: "block",
  marginBottom: "4px",
  fontSize: "12px",
  fontWeight: "600",
  color: "#8e8e8e", // אפור עדין לתוויות של תאריך ומדינה
};

export const buttonStyle = (isSubmitting) => ({
  width: "100%",
  padding: "10px",
  borderRadius: "8px",
  border: "none",
  backgroundColor: "#0095f6", // כחול אינסטגרם
  color: "#ffffff",
  fontSize: "14px",
  fontWeight: "600",
  cursor: isSubmitting ? "default" : "pointer",
  opacity: isSubmitting ? 0.6 : 1,
  marginTop: "16px",
  transition: "opacity 0.2s",
});

export const messageStyle = (isSuccess) => ({
  marginTop: "20px",
  textAlign: "center",
  fontSize: "14px",
  fontWeight: "500",
  color: isSuccess ? "#0095f6" : "#ed4956", // צבע טקסט נקי במקום קופסת התראה גסה
});
