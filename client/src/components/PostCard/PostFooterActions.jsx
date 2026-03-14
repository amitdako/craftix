import React from "react";
import * as s from "./PostCard.styles";
import { translations } from "../../translations";

const PostFooterActions = ({
  currentLang,
  isLiked,
  likesCount,
  commentsCount,
  isSaved,
  isOwner,
  postType,
  showMadeThisForm,
  onLike,
  onCommentToggle,
  onMadeThisClick,
  onSave,
  onDelete,
}) => {
  const t = translations[currentLang] || translations.en;

  return (
    <div style={s.footerContainerStyle}>
      <div style={s.leftFooterActions}>
        <button onClick={onLike} style={s.likeButtonStyle}>
          <span>{isLiked ? "❤️" : "🤍"}</span>
          <span style={s.likeCountLabel}>{likesCount}</span>
        </button>

        <button onClick={onCommentToggle} style={s.commentToggleBtnStyle}>
          <span>💬</span>
          <span style={s.likeCountLabel}>{commentsCount}</span>
        </button>

        {postType === "project" && (
          <button
            onClick={onMadeThisClick}
            style={{
              backgroundColor: showMadeThisForm ? "#65676b" : "#ff4757",
              color: "white",
              border: "none",
              padding: "5px 15px",
              borderRadius: "20px",
              fontWeight: "bold",
              cursor: "pointer",
              fontSize: "0.8rem",
              display: "flex",
              alignItems: "center",
              gap: "5px",
            }}
          >
            🛠️ {showMadeThisForm ? t.close : t.iMadeThis}
          </button>
        )}
      </div>

      <div style={s.rightFooterActions}>
        <button
          onClick={onSave}
          style={s.secondaryBtnStyle}
          title={t.saveTitle}
        >
          {isSaved ? "📂" : "💾"}
        </button>
        {isOwner && (
          <button
            onClick={onDelete}
            style={s.deleteBtnStyle}
            title={t.deleteTitle}
          >
            🗑️
          </button>
        )}
      </div>
    </div>
  );
};

export default PostFooterActions;
