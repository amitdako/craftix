// ImplementationForm.styles.js

export const formContainer = (isHe) => ({
  padding: "16px 20px",
  backgroundColor: "#ffffff",
  borderTop: "1px solid #efefef",
  direction: isHe ? "rtl" : "ltr",
  display: "flex",
  flexDirection: "column",
  gap: "12px",
});

export const header = {
  display: "flex",
  alignItems: "flex-start",
  gap: "12px",
};

export const avatar = {
  width: "36px",
  height: "36px",
  borderRadius: "50%",
  overflow: "hidden",
  flexShrink: 0,
  backgroundColor: "#efefef",
  color: "#8e8e8e",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: "600",
  fontSize: "14px",
  border: "1px solid #dbdbdb",
};

export const inputArea = {
  flex: 1,
  display: "flex",
  flexDirection: "column",
  gap: "10px",
};

export const textarea = {
  width: "100%",
  padding: "12px 16px",
  borderRadius: "20px",
  border: "1px solid #dbdbdb",
  minHeight: "44px",
  outline: "none",
  fontSize: "14px",
  resize: "none",
  fontFamily: "inherit",
  backgroundColor: "#fafafa",
  color: "#262626",
  boxSizing: "border-box",
};

export const previewContainer = {
  position: "relative",
  borderRadius: "12px",
  overflow: "hidden",
  border: "1px solid #dbdbdb",
  width: "fit-content",
};

export const previewImage = {
  maxWidth: "100%",
  maxHeight: "150px",
  objectFit: "cover",
  display: "block",
};

export const removeBtn = {
  position: "absolute",
  top: "6px",
  insetInlineEnd: "6px",
  zIndex: 10,
  backgroundColor: "rgba(0, 0, 0, 0.6)",
  color: "white",
  border: "none",
  borderRadius: "50%",
  width: "26px",
  height: "26px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  fontSize: "12px",
  backdropFilter: "blur(4px)",
};

export const footer = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginTop: "4px",
  paddingInlineStart: "48px",
};

export const addMediaLabel = {
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  gap: "6px",
  color: "#0095f6",
  fontWeight: "600",
  fontSize: "14px",
};

export const buttonGroup = {
  display: "flex",
  gap: "8px",
};

export const cancelBtn = {
  backgroundColor: "transparent",
  color: "#262626",
  border: "none",
  padding: "6px 12px",
  cursor: "pointer",
  fontWeight: "600",
  fontSize: "14px",
};

export const shareBtn = (hasText) => ({
  backgroundColor: "#0095f6",
  color: "white",
  border: "none",
  padding: "6px 16px",
  borderRadius: "16px",
  cursor: hasText ? "pointer" : "default",
  fontWeight: "600",
  fontSize: "14px",
  opacity: hasText ? 1 : 0.5,
  transition: "opacity 0.2s",
});
