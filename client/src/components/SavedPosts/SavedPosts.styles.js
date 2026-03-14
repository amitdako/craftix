// SavedPosts.styles.js

export const containerStyle = {
  padding: "20px",
  maxWidth: "800px",
  margin: "40px auto",
};

export const titleStyle = {
  textAlign: "center",
  marginBottom: "40px",
  color: "#1c1e21",
  fontSize: "26px",
  fontWeight: "bold",
};

export const gridStyle = {
  display: "grid",
  gap: "25px",
};

export const messageStyle = {
  textAlign: "center",
  marginTop: "50px",
  color: "#65676b",
  fontSize: "16px",
  lineHeight: "1.6",
};

export const loadingStyle = {
  ...messageStyle,
  color: "#007bff",
  fontWeight: "600",
};
