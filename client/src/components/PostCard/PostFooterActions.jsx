import * as s from "./PostCard.styles";
//Reciving from postcard.
const PostFooterActions = ({
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
}) => (
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
          }}
        >
          🛠️ {showMadeThisForm ? "Close" : "I Made This!"}
        </button>
      )}
    </div>

    <div style={s.rightFooterActions}>
      <button onClick={onSave} style={s.secondaryBtnStyle} title="Save post.">
        {isSaved ? "📂" : "💾"}
      </button>
      {isOwner && (
        <button
          onClick={onDelete}
          style={s.deleteBtnStyle}
          title="Delete post. "
        >
          🗑️
        </button>
      )}
    </div>
  </div>
);
export default PostFooterActions;
