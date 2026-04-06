// SavedPosts.styles.js

export const containerStyle = {
  padding: "20px 0",
  maxWidth: "600px", // הותאם בדיוק לרוחב של הפיד והפרופיל למראה אחיד
  margin: "0 auto",
  boxSizing: "border-box",
};

export const titleStyle = {
  textAlign: "center",
  marginBottom: "30px",
  color: "#262626", // שחור אינסטגרם נקי
  fontSize: "20px",
  fontWeight: "600",
};

export const gridStyle = {
  display: "flex",
  flexDirection: "column", // מציג אותם בטור (כמו בפיד) במקום כגריד מפוזר
};

export const messageStyle = {
  textAlign: "center",
  padding: "60px 20px",
  color: "#8e8e8e", // אפור עדין לטקסט משני
  fontSize: "14px",
  lineHeight: "1.5",
};

export const loadingStyle = {
  textAlign: "center",
  marginTop: "60px",
  color: "#8e8e8e",
  fontSize: "14px",
  fontWeight: "400",
};
