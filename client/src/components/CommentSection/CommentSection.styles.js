export const commentSectionContainer = {
  padding: "10px 0",
  display: "flex",
  flexDirection: "column",
};

export const titleStyle = {
  display: "none",
};
export const formStyle = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  marginBottom: "20px",
  borderTop: "1px solid #efefef",
  borderBottom: "1px solid #efefef",
  padding: "10px 0",
};

export const inputStyle = {
  flex: 1,
  border: "none",
  outline: "none",
  fontSize: "14px",
  color: "#262626",
  backgroundColor: "transparent",
  padding: "4px 0",
};

export const sendBtnStyle = (hasText) => ({
  backgroundColor: "transparent",
  color: "#0095f6",
  border: "none",
  fontWeight: "600",
  fontSize: "14px",
  cursor: hasText ? "pointer" : "default",
  opacity: hasText ? 1 : 0.5,
  padding: "0 8px",
  transition: "opacity 0.2s",
});

export const commentListWrapper = {
  display: "flex",
  flexDirection: "column",
  gap: "16px",
};

export const commentItemRow = {
  display: "flex",
  gap: "12px",
  alignItems: "flex-start",
};

export const avatarContainer = {
  width: "32px",
  height: "32px",
  borderRadius: "50%",
  backgroundColor: "#fafafa",
  flexShrink: 0,
  overflow: "hidden",
  border: "1px solid #dbdbdb",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

export const avatarPlaceholder = {
  color: "#8e8e8e",
  fontSize: "12px",
  fontWeight: "600",
};

export const authorName = {
  fontWeight: "600",
  fontSize: "14px",
  color: "#262626",
  marginInlineEnd: "6px",
};

export const commentTextBody = {
  fontSize: "14px",
  color: "#262626",
  lineHeight: "1.4",
  wordBreak: "break-word",
  display: "inline",
};

export const actionButtonsWrapper = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
  marginTop: "6px",
};

export const dateLabel = {
  fontSize: "12px",
  color: "#8e8e8e",
};

export const actionBtnBase = {
  background: "none",
  border: "none",
  cursor: "pointer",
  fontSize: "12px",
  fontWeight: "600",
  color: "#8e8e8e",
  padding: "0",
};
