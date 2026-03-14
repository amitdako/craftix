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
      {/* Header in left*/}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          marginBottom: "12px",
          justifyContent: "flex-start",
          direction: "ltr",
        }}
      >
        {/* picture of the original user.*/}
        <div
          style={{
            width: "28px",
            height: "28px",
            borderRadius: "50%",
            backgroundColor: "#007bff",
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "bold",
            fontSize: "0.75rem",
            overflow: "hidden",
            border: "1px solid #eee",
            flexShrink: 0,
          }}
        >
          {parentPost.author?.profileImage ? (
            <img
              src={getImageUrl(parentPost.author.profileImage)}
              alt=""
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            parentPost.author?.displayName?.[0] || "U"
          )}
        </div>

        <span
          style={{
            fontSize: "0.85rem",
            fontWeight: "bold",
            color: "#555",
            direction: "rtl",
          }}
        >
          {parentPost.author?.displayName || "יוצר מקורי"}
        </span>
      </div>

      {/* picture and title of the project*/}
      <div
        style={{
          display: "flex",
          gap: "10px",
          flexDirection: "row-reverse",
          alignItems: "center",
        }}
      >
        {parentPost.mediaUrl && (
          <img
            src={getImageUrl(parentPost.mediaUrl)}
            style={{
              width: "70px",
              height: "50px",
              objectFit: "cover",
              borderRadius: "6px",
            }}
            alt=""
          />
        )}
        <div style={{ flex: 1 }}>
          <h4
            style={{
              margin: "0",
              fontSize: "0.9rem",
              color: "#333",
              fontWeight: "600",
            }}
          >
            {parentPost.title}
          </h4>
        </div>
      </div>
    </div>
  );
};

export default PostImplementationBox;
