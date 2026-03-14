import React from "react";
// שים לב לייבוא - אם הקובץ באותה תיקייה זה צריך להיות ./ImplementationForm.styles
import * as S from "./ImplementationForm.styles";

const ImplementationForm = ({
  isOpen,
  value,
  onChange,
  onSubmit,
  onCancel,
  currentUser,
  getImageUrl,
  onFileChange,
  previewUrl,
  onRemoveImage,
}) => {
  if (!isOpen) return null;

  // הגדרת סטייל מקומית לביטחון - כדי שלא יקפוץ בענק לעולם
  const avatarContainerStyle = {
    width: "45px",
    height: "45px",
    borderRadius: "50%",
    overflow: "hidden",
    flexShrink: 0,
    backgroundColor: "#007bff",
  };

  return (
    <div
      style={{
        padding: "15px",
        backgroundColor: "#fff5f5",
        borderTop: "1px solid #ffe3e3",
      }}
    >
      {/* Header: Profile and Name */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          marginBottom: "15px",
          direction: "ltr",
        }}
      >
        <div style={avatarContainerStyle}>
          {" "}
          {currentUser?.profileImage ? (
            <img
              src={getImageUrl(currentUser.profileImage)}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
              alt=""
            />
          ) : (
            <div
              style={{
                color: "white",
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "bold",
              }}
            >
              {currentUser?.displayName?.[0] || "U"}
            </div>
          )}
        </div>
        <span style={{ fontWeight: "bold", color: "#1c1e21" }}>
          {currentUser?.displayName}
        </span>
      </div>

      {/* Media Preview */}
      {previewUrl && (
        <div
          style={{
            position: "relative",
            marginBottom: "15px",
            borderRadius: "10px",
            overflow: "hidden",
            border: "1px solid #eee",
            backgroundColor: "#f0f0f0",
            maxWidth: "100%",
          }}
        >
          {/* כפתור האיקס - הוספתי zIndex ושיניתי מיקום */}
          <button
            type="button" // חשוב כדי שלא ישלח את הטופס בלחיצה
            onClick={(e) => {
              e.preventDefault();
              onRemoveImage();
            }}
            style={{
              position: "absolute",
              top: "10px",
              right: "10px",
              zIndex: 10, // מוודא שהוא מעל התמונה
              backgroundColor: "rgba(0, 0, 0, 0.7)", // כהה יותר כדי שיראו טוב
              color: "white",
              border: "none",
              borderRadius: "50%",
              width: "30px",
              height: "30px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              fontSize: "20px",
              fontWeight: "bold",
              lineHeight: "1",
            }}
            title="הסר תמונה"
          >
            ×
          </button>
          <img
            src={previewUrl}
            alt="Preview"
            style={{
              width: "100%",
              maxHeight: "300px",
              objectFit: "cover",
              display: "block",
            }}
          />
        </div>
      )}

      <textarea
        autoFocus
        placeholder="How was your process?"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: "100%",
          padding: "15px",
          borderRadius: "15px",
          border: "1px solid #ddd",
          minHeight: "100px",
          outline: "none",
          fontSize: "1rem",
          resize: "none",
          fontFamily: "inherit",
          backgroundColor: "#fff",
        }}
      />

      {/* Footer */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "10px",
          direction: "ltr",
        }}
      >
        <label
          style={{
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            color: "#65676b",
          }}
        >
          <input
            type="file"
            accept="image/*,video/*"
            onChange={onFileChange}
            style={{ display: "none" }}
          />
          <span style={{ fontSize: "1.2rem" }}>📷</span>
          Add image/video
        </label>

        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={onCancel}
            style={{
              backgroundColor: "white",
              color: "#1c1e21",
              border: "1px solid #ddd",
              padding: "8px 20px",
              borderRadius: "20px",
              cursor: "pointer",
              fontWeight: "600",
            }}
          >
            Cancel
          </button>
          <button
            onClick={onSubmit}
            style={{
              backgroundColor: "#ff4757",
              color: "white",
              border: "none",
              padding: "8px 25px",
              borderRadius: "20px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Share
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImplementationForm;
