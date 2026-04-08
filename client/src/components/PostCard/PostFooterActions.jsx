import React from "react";
import * as s from "./PostCard.styles";
import { translations } from "../../translations";

// אייקונים נקיים במידות שוות (24x24)
const HeartOutline = () => (
  <svg fill="currentColor" height="24" viewBox="0 0 24 24" width="24">
    <path
      d="M16.792 3.904A4.989 4.989 0 0 1 21.5 9.122c0 3.072-2.652 4.959-5.197 7.222-2.512 2.243-3.865 3.469-4.303 3.752-.477-.309-2.143-1.823-4.303-3.752C5.141 14.072 2.5 12.167 2.5 9.122a4.989 4.989 0 0 1 4.708-5.218 4.21 4.21 0 0 1 3.675 1.941c.84 1.174 1.8 1.174 2.634 0a4.212 4.212 0 0 1 3.675-1.941z"
      fill="none"
      stroke="currentColor"
      strokeLinejoin="round"
      strokeWidth="2"
    ></path>
  </svg>
);
const HeartFilled = () => (
  <svg fill="#ff3040" height="24" viewBox="0 0 48 48" width="24">
    <path d="M34.6 3.1c-4.5 0-7.9 1.8-10.6 5.6-2.7-3.7-6.1-5.5-10.6-5.5C6 3.1 0 9.6 0 17.6c0 7.3 5.4 12 10.6 16.5.6.5 1.3 1.1 1.9 1.7l2.3 2c4.4 3.9 6.6 5.9 7.6 6.5.5.3 1.1.5 1.6.5s1.1-.2 1.6-.5c1-.6 2.8-2.2 7.8-6.8l2-1.8c.7-.6 1.3-1.2 2-1.7C42.7 29.6 48 25 48 17.6c0-8-6-14.5-13.4-14.5z"></path>
  </svg>
);
const CommentIcon = () => (
  <svg fill="currentColor" height="24" viewBox="0 0 24 24" width="24">
    <path
      d="M20.656 17.008a9.993 9.993 0 1 0-3.59 3.615L22 22Z"
      fill="none"
      stroke="currentColor"
      strokeLinejoin="round"
      strokeWidth="2"
    ></path>
  </svg>
);
const SaveOutline = () => (
  <svg fill="currentColor" height="24" viewBox="0 0 24 24" width="24">
    <polygon
      fill="none"
      points="20 21 12 13.44 4 21 4 3 20 3 20 21"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    ></polygon>
  </svg>
);
const SaveFilled = () => (
  <svg fill="currentColor" height="24" viewBox="0 0 24 24" width="24">
    <path d="M20 22a.999.999 0 0 1-.687-.273L12 14.815l-7.313 6.912A1 1 0 0 1 3 21V3a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1Z"></path>
  </svg>
);
const TrashIcon = () => (
  <svg fill="currentColor" height="24" viewBox="0 0 24 24" width="24">
    <path
      d="M19 4h-3.5l-1-1h-5l-1 1H5v2h14M6 19a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7H6v12Z"
      fill="none"
      stroke="currentColor"
      strokeLinejoin="round"
      strokeWidth="2"
    ></path>
  </svg>
);
// הוספתי אייקון עריכה נקי
const EditIcon = () => (
  <svg
    fill="none"
    height="24"
    viewBox="0 0 24 24"
    width="24"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
  >
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
  </svg>
);

const PostFooterActions = ({
  currentLang,
  isLiked,
  isSaved,
  isOwner,
  postType,
  showMadeThisForm,
  onLike,
  onCommentToggle,
  onMadeThisClick,
  onSave,
  onDelete,
  onEdit,
  commentsCount,
}) => {
  const t = translations[currentLang] || translations.en;

  return (
    <div style={s.footerContainerStyle}>
      <div style={s.leftFooterActions}>
        <button onClick={onLike} style={s.iconBtnStyle}>
          {isLiked ? <HeartFilled /> : <HeartOutline />}
        </button>

        <button onClick={onCommentToggle} style={s.iconBtnStyle}>
          <CommentIcon />
          {commentsCount > 0 && (
            <span
              style={{
                fontSize: "14px",
                fontWeight: "600",
                marginInlineStart: "6px",
              }}
            >
              {commentsCount}
            </span>
          )}
        </button>

        {postType === "project" && (
          <button
            onClick={onMadeThisClick}
            style={{
              ...s.iconBtnStyle,
              border: "1px solid #dbdbdb",
              padding: "4px 10px",
              borderRadius: "4px",
              fontSize: "12px",
              fontWeight: "600",
              backgroundColor: showMadeThisForm ? "#efefef" : "transparent",
            }}
          >
            {showMadeThisForm ? t.cancel : t.iMadeThis}
          </button>
        )}
      </div>

      <div style={s.rightFooterActions}>
        <button onClick={onSave} style={s.iconBtnStyle} title={t.saveTitle}>
          {isSaved ? <SaveFilled /> : <SaveOutline />}
        </button>

        {isOwner && ( //delete and edit buttons will be show just for the post's owner.
          <>
            <button
              onClick={onEdit}
              style={s.iconBtnStyle}
              title={t.edit || "Edit"}
            >
              <EditIcon />
            </button>
            <button
              onClick={onDelete}
              style={{ ...s.iconBtnStyle, color: "#ed4956" }}
              title={t.deleteTitle}
            >
              <TrashIcon />
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default PostFooterActions;
