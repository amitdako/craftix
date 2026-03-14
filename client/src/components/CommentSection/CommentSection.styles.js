// CommentSection.styles.js

export const commentSectionContainer = {
  direction: "ltr",
  textAlign: "left",
};

export const titleStyle = {
  fontSize: "1.1rem",
  marginBottom: "15px",
  color: "#65676b",
  fontWeight: "bold",
};

export const formStyle = {
  display: "flex",
  gap: "10px",
  marginBottom: "20px",
};

export const inputStyle = {
  flex: 1,
  padding: "10px 15px",
  borderRadius: "20px",
  border: "1px solid #ddd",
  outline: "none",
  fontSize: "0.9rem",
};

export const sendBtnStyle = {
  backgroundColor: "#007bff",
  color: "white",
  border: "none",
  padding: "8px 18px",
  borderRadius: "20px",
  fontWeight: "bold",
  cursor: "pointer",
};

export const commentListWrapper = {
  display: "flex",
  flexDirection: "column",
  gap: "12px",
};

export const commentItemRow = {
  display: "flex",
  gap: "10px",
  alignItems: "flex-start",
};

export const avatarContainer = {
  width: "35px",
  height: "35px",
  borderRadius: "50%",
  backgroundColor: "#eee",
  flexShrink: 0,
  overflow: "hidden",
};

export const avatarPlaceholder = {
  width: "100%",
  height: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "#ccc",
  color: "#fff",
  fontSize: "12px",
  fontWeight: "bold",
};

export const commentBubble = {
  backgroundColor: "#f0f2f5",
  padding: "10px 15px",
  borderRadius: "18px",
  position: "relative",
  maxWidth: "85%",
};

export const bubbleHeader = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "15px",
  marginBottom: "2px",
};

export const authorName = {
  fontWeight: "bold",
  fontSize: "0.9rem",
  color: "#333",
};

export const dateLabel = {
  fontSize: "0.7rem",
  color: "#888",
};

export const commentTextBody = {
  fontSize: "0.95rem",
  color: "#1c1e21",
  lineHeight: "1.4",
};

export const actionButtonsWrapper = {
  display: "flex",
  gap: "15px",
  marginTop: "5px",
};

export const actionBtnBase = {
  background: "none",
  border: "none",
  cursor: "pointer",
  fontSize: "0.75rem",
  fontWeight: "bold",
};
