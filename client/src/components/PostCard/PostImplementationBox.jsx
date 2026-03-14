const PostImplementationBox = ({ parentPost, getImageUrl, onNavigate }) => {
  if (!parentPost) return null;
  return (
    <div
      style={{
        margin: "15px",
        padding: "12px",
        border: "1px solid #e0e0e0",
        borderRadius: "10px",
        backgroundColor: "#f9f9f9",
        textAlign: "right",
        cursor: "pointer",
      }}
      onClick={onNavigate}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          marginBottom: "8px",
          justifyContent: "flex-start",
          flexDirection: "row-reverse",
        }}
      >
        <span
          style={{ fontSize: "0.85rem", fontWeight: "bold", color: "#555" }}
        >
          {parentPost.author?.displayName || "יוצר מקורי"}
        </span>
      </div>
      <div
        style={{ display: "flex", gap: "10px", flexDirection: "row-reverse" }}
      >
        {parentPost.mediaUrl && (
          <img
            src={getImageUrl(parentPost.mediaUrl)}
            style={{
              width: "80px",
              height: "60px",
              objectFit: "cover",
              borderRadius: "6px",
            }}
            alt=""
          />
        )}
        <div style={{ flex: 1 }}>
          <h4
            style={{ margin: "0 0 4px 0", fontSize: "0.95rem", color: "#333" }}
          >
            {parentPost.title}
          </h4>
        </div>
      </div>
    </div>
  );
};
export default PostImplementationBox;
