import React from "react";
import * as S from "./ImplementationForm.styles";
import { translations } from "../../translations";

const ImplementationForm = ({
  currentLang,
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

  const t = translations[currentLang] || translations.en;
  const isHe = currentLang === "he";

  const safeValue = value || "";
  const hasText = safeValue.trim().length > 0;

  return (
    <div style={S.formContainer(isHe)}>
      <div style={S.header}>
        <div style={S.avatar}>
          {currentUser?.profileImage ? (
            <img
              src={getImageUrl(currentUser.profileImage)}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
              alt=""
            />
          ) : (
            currentUser?.displayName?.[0] || "U"
          )}
        </div>

        <div style={S.inputArea}>
          <textarea
            autoFocus
            placeholder={t.implementationPlaceholder}
            value={safeValue}
            onChange={(e) => onChange(e.target.value)}
            style={S.textarea}
          />

          {previewUrl && (
            <div style={S.previewContainer}>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  onRemoveImage();
                }}
                style={S.removeBtn}
                title={t.removeMedia}
              >
                ✕
              </button>
              <img src={previewUrl} alt="Preview" style={S.previewImage} />
            </div>
          )}
        </div>
      </div>

      <div style={S.footer}>
        <label style={S.addMediaLabel}>
          <input
            type="file"
            accept="image/*,video/*"
            onChange={onFileChange}
            style={{ display: "none" }}
          />
          <svg
            aria-label="Camera"
            fill="currentColor"
            height="20"
            width="20"
            viewBox="0 0 24 24"
          >
            <path d="M12 17.5a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11Zm0-1.5a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm9-12h-2.8l-1.5-1.5a1.5 1.5 0 0 0-1.1-.5h-3.2a1.5 1.5 0 0 0-1.1.5L9.8 4H7A3 3 0 0 0 4 7v10a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3ZM21 17a1.5 1.5 0 0 1-1.5 1.5H7A1.5 1.5 0 0 1 5.5 17V7A1.5 1.5 0 0 1 7 5.5h3.5l1.5-1.5h4l1.5 1.5H21A1.5 1.5 0 0 1 22.5 7v10A1.5 1.5 0 0 1 21 17Z"></path>
          </svg>
          {t.addImageVideo}
        </label>

        <div style={S.buttonGroup}>
          <button onClick={onCancel} style={S.cancelBtn}>
            {t.cancel}
          </button>
          <button
            onClick={onSubmit}
            disabled={!hasText}
            style={S.shareBtn(hasText)}
          >
            {t.share}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImplementationForm;
