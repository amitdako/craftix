import * as s from "./PostCard.styles";

const ImplementationForm = ({
  currentUser,
  text,
  setText,
  onSubmit,
  onCancel,
  getImageUrl,
}) => (
  <div
    style={{
      padding: "15px",
      backgroundColor: "#fff5f6",
      borderTop: "1px solid #ff4757",
      textAlign: "right",
    }}
    onClick={(e) => e.stopPropagation()}
  >
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        marginBottom: "12px",
      }}
    >
      <div style={s.avatarStyle}>
        {currentUser?.profileImage ? (
          <img
            src={getImageUrl(currentUser.profileImage)}
            style={s.avatarImgStyle}
            alt=""
          />
        ) : (
          currentUser?.displayName?.[0] || "U"
        )}
      </div>
      <div>
        <div style={s.authorNameStyle}>{currentUser?.displayName}</div>
        <div style={{ fontSize: "0.7rem", color: "#65676b" }}>
          משתף ביצוע...
        </div>
      </div>
    </div>
    <textarea
      value={text}
      onChange={(e) => setText(e.target.value)}
      placeholder="איך היה לכם? יש לכם טיפים?"
      style={{
        width: "100%",
        minHeight: "80px",
        borderRadius: "10px",
        padding: "10px",
        border: "1px solid #ddd",
        marginBottom: "10px",
        resize: "none",
      }}
    />
    <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
      <button
        onClick={onSubmit}
        style={{
          backgroundColor: "#ff4757",
          color: "white",
          border: "none",
          padding: "8px 20px",
          borderRadius: "10px",
          fontWeight: "bold",
          cursor: "pointer",
        }}
      >
        פרסם עכשיו
      </button>
      <button
        onClick={onCancel}
        style={{
          background: "none",
          border: "1px solid #ccc",
          padding: "8px 20px",
          borderRadius: "10px",
          cursor: "pointer",
        }}
      >
        ביטול
      </button>
    </div>
  </div>
);
export default ImplementationForm;
