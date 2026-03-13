// PostDetailsStyle.js
export const styles = {
  container: {
    maxWidth: "800px",
    margin: "40px auto",
    padding: "20px",
    backgroundColor: "#fff",
    borderRadius: "12px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
    fontFamily: "Arial, sans-serif",
  },
  image: {
    width: "100%",
    height: "400px",
    objectFit: "cover",
    borderRadius: "8px",
    marginBottom: "20px",
  },
  header: {
    borderBottom: "2px solid #f0f0f0",
    paddingBottom: "15px",
    marginBottom: "20px",
  },
  title: {
    fontSize: "2.5rem",
    color: "#333",
    margin: 0,
  },
  description: {
    lineHeight: "1.6",
    color: "#555",
    fontSize: "1.1rem",
    whiteSpace: "pre-wrap", // שומר על ירידות שורה מהטקסט המקורי
  },
  communitySection: {
    marginTop: "40px",
    paddingTop: "20px",
    borderTop: "2px dashed #e0e0e0",
    textAlign: "center",
  },
  madeThisButton: {
    backgroundColor: "#ff4757",
    color: "white",
    border: "none",
    padding: "12px 24px",
    fontSize: "1.1rem",
    fontWeight: "bold",
    borderRadius: "50px",
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    transition: "transform 0.2s",
    marginTop: "15px",
  },
  loading: {
    textAlign: "center",
    marginTop: "100px",
    fontSize: "1.2rem",
    color: "#666",
  },
};
