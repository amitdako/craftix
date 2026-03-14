export const styles = {
  container: {
    maxWidth: "600px", // הקטנה מ-800 ל-600 (כמו בפיד)
    margin: "20px auto",
    padding: "0px", // ביטול ה-padding הפנימי כדי שהמדיה תיצמד לקצוות כמו בכרטיס
    backgroundColor: "#fff",
    borderRadius: "15px",
    boxShadow: "0 2px 12px rgba(0,0,0,0.1)",
    fontFamily: "Arial, sans-serif",
    overflow: "hidden",
    border: "1px solid #eee",
  },
  image: {
    width: "100%",
    maxHeight: "500px", // שינוי מ-400 קבוע ל-max כדי שלא ימתח תמונות קטנות
    objectFit: "cover",
    display: "block",
  },
  header: {
    padding: "15px",
    borderBottom: "1px solid #f0f2f5",
  },
  title: {
    fontSize: "1.25rem", // הקטנה מ-2.5 ל-1.25
    color: "#1c1e21",
    margin: "0 0 10px 0",
    fontWeight: "800",
    padding: "0 15px",
  },
  description: {
    lineHeight: "1.5",
    color: "#444",
    fontSize: "1rem",
    whiteSpace: "pre-wrap",
    padding: "0 15px 15px 15px",
  },
  madeThisButton: {
    backgroundColor: "#ff4757",
    color: "white",
    border: "none",
    padding: "6px 15px",
    fontSize: "0.85rem",
    fontWeight: "bold",
    borderRadius: "20px",
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    gap: "5px",
  },
  loading: {
    textAlign: "center",
    marginTop: "100px",
    fontSize: "1.1rem",
    color: "#666",
  },
};
