export const feedContainer = {
  height: "calc(100vh - 60px)",
  width: "100%",
  maxWidth: "450px",
  margin: "0 auto",
  backgroundColor: "#000000",
  overflowY: "scroll",
  scrollSnapType: "y mandatory",
  scrollbarWidth: "none",
  MsOverflowStyle: "none",
  position: "relative",
};

export const shortCardContainer = {
  height: "100%",
  width: "100%",
  scrollSnapAlign: "start",
  position: "relative",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "#000000",
};

export const videoElement = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
};

export const infoOverlay = {
  position: "absolute",
  bottom: "20px",
  left: "15px",
  right: "70px",
  color: "#ffffff",
  zIndex: 10,
  textShadow: "0 1px 3px rgba(0,0,0,0.6)",
};

export const authorRow = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  marginBottom: "10px",
};

export const authorAvatar = {
  width: "36px",
  height: "36px",
  borderRadius: "50%",
  border: "1px solid #ffffff",
  objectFit: "cover",
};

export const authorName = {
  fontWeight: "600",
  fontSize: "15px",
};

export const description = {
  fontSize: "14px",
  lineHeight: "1.4",
  display: "-webkit-box",
  WebkitLineClamp: 2,
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
};

export const actionsOverlay = {
  position: "absolute",
  bottom: "20px",
  right: "15px",
  display: "flex",
  flexDirection: "column",
  gap: "20px",
  alignItems: "center",
  zIndex: 10,
  color: "#ffffff",
};

export const actionBtn = {
  background: "none",
  border: "none",
  color: "inherit",
  cursor: "pointer",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "4px",
  filter: "drop-shadow(0 1px 3px rgba(0,0,0,0.6))",
};

export const actionText = {
  fontSize: "12px",
  fontWeight: "600",
};
