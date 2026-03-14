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
          {/* שימוש בסטייל המאובטח */}
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
            marginBottom: "10px",
            borderRadius: "8px",
            overflow: "hidden",
          }}
        >
          <img
            src={previewUrl}
            alt="Preview"
            style={{ width: "100%", maxHeight: "250px", objectFit: "cover" }}
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
