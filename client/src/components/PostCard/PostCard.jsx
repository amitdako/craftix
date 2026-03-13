import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import CommentSection from "../CommentSection/CommentSection";
import * as S from "./PostCard.styles";

const PostCard = ({ post, currentUser, onDelete, onSave }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [likes, setLikes] = useState(post.likes || []);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [allComments, setAllComments] = useState(post.comments || []);

  const navigate = useNavigate();

  const postId = post?._id || post?.id;
  const currentUserId = currentUser?.id || currentUser?._id;
  const isLiked = likes.includes(currentUserId);

  // ניווט לפוסט המלא בלחיצה על הכרטיס
  const handleCardClick = () => {
    if (postId) navigate(`/post/${postId}`);
  };

  const handleLike = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const response = await api.post(`/posts/like/${postId}`);
      setLikes(response.data.likes);
    } catch (err) {
      console.error("Error liking post:", err);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!commentText.trim()) return;
    try {
      const response = await api.post(`/posts/${postId}/comment`, {
        text: commentText,
      });
      setAllComments(response.data);
      setCommentText("");
    } catch (err) {
      console.error("Error adding comment:", err);
    }
  };

  // תיקון: הסרת ה-e מהפרמטרים כדי לפשט את הקריאה מהתגובות
  const handleLikeComment = async (commentId) => {
    try {
      const response = await api.post(
        `/posts/${postId}/comment/${commentId}/like`,
      );
      setAllComments(response.data);
    } catch (err) {
      console.error("Error liking comment:", err);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      try {
        const response = await api.delete(
          `/posts/${postId}/comment/${commentId}`,
        );
        setAllComments(response.data);
      } catch (err) {
        console.error("Error deleting comment:", err);
      }
    }
  };

  const handleAction = (actionFn, e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!postId) return;
    actionFn(postId);
    setShowMenu(false);
  };

  const isSaved = Array.isArray(currentUser?.savedPosts)
    ? currentUser.savedPosts.some((savedItem) => {
        const savedId =
          typeof savedItem === "object" ? savedItem._id : savedItem;
        return String(savedId) === String(postId);
      })
    : false;

  const isOwner =
    currentUser &&
    post?.author &&
    (post.author._id || post.author)?.toString() === currentUserId?.toString();

  return (
    <div
      style={{ ...S.cardStyle, cursor: "pointer" }}
      onClick={handleCardClick}
    >
      {/* Top Actions */}
      <div style={S.topActionsWrapper}>
        {post.category && (
          <span style={S.categoryBadgeStyle}>{post.category}</span>
        )}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowMenu(!showMenu);
          }}
          style={S.ellipsisBtnStyle}
        >
          ⋮
        </button>
        {showMenu && (
          <div style={S.dropdownMenuStyle} onClick={(e) => e.stopPropagation()}>
            <button
              onClick={(e) => handleAction(onSave, e)}
              style={S.menuItemStyle}
            >
              {isSaved ? "📂 Unsave Project" : "💾 Save Project"}
            </button>
            {isOwner && (
              <button
                onClick={(e) => handleAction(onDelete, e)}
                style={{
                  ...S.menuItemStyle,
                  color: "#dc3545",
                  borderBottom: "none",
                }}
              >
                🗑️ Delete Post
              </button>
            )}
          </div>
        )}
      </div>

      {/* Header */}
      <div
        style={S.authorHeaderStyle}
        onClick={(e) => {
          e.stopPropagation();
          navigate(`/profile/${post.author?._id || post.author}`);
        }}
      >
        <div style={S.avatarStyle}>
          {post.author?.profileImage ? (
            <img
              src={`http://localhost:5000${post.author.profileImage}`}
              alt="Avatar"
              style={S.avatarImgStyle}
            />
          ) : (
            <span>{post.author?.displayName?.[0] || "U"}</span>
          )}
        </div>
        <span style={S.authorNameStyle}>
          {post.author?.displayName || post.author?.fullName || "User"}
        </span>
      </div>

      {/* Media */}
      {post.mediaUrl && (
        <div style={S.mediaWrapperStyle}>
          {post.mediaType === "video" ? (
            <video
              src={`http://localhost:5000${post.mediaUrl}`}
              controls
              style={S.mediaContentStyle}
            />
          ) : (
            <img
              src={`http://localhost:5000${post.mediaUrl}`}
              alt="Media"
              style={S.mediaContentStyle}
            />
          )}
        </div>
      )}

      {/* Content */}
      <div style={{ padding: "0 15px 15px" }}>
        {post.postType === "project" && post.title && (
          <h3 style={{ margin: "10px 0" }}>{post.title}</h3>
        )}
        <p style={S.contentTextStyle}>{post.content}</p>
      </div>

      {/* Footer */}
      <div style={S.footerContainerStyle} onClick={(e) => e.stopPropagation()}>
        <div style={S.leftFooterActions}>
          <button onClick={handleLike} style={S.likeButtonStyle}>
            <span
              style={{ fontSize: "22px", color: isLiked ? "#ff4d4d" : "#ccc" }}
            >
              {isLiked ? "❤️" : "🤍"}
            </span>
            {likes.length > 0 && (
              <span style={S.likeCountLabel}>{likes.length}</span>
            )}
          </button>
          <button
            onClick={() => setShowComments(!showComments)}
            style={S.commentToggleBtnStyle}
          >
            <span style={{ fontSize: "20px" }}>💬</span>
            <span style={S.likeCountLabel}>{allComments.length}</span>
          </button>
        </div>
        <div style={S.rightFooterActions}>
          <button onClick={() => onSave(postId)} style={S.secondaryBtnStyle}>
            {isSaved ? "📂" : "💾"}
          </button>
          {isOwner && (
            <button onClick={() => onDelete(postId)} style={S.deleteBtnStyle}>
              🗑️
            </button>
          )}
        </div>
      </div>

      {/* Comments */}
      {showComments && (
        <CommentSection
          allComments={allComments}
          currentUserId={currentUserId}
          handleDeleteComment={handleDeleteComment}
          handleLikeComment={handleLikeComment}
          handleAddComment={handleAddComment}
          commentText={commentText}
          setCommentText={setCommentText}
        />
      )}
    </div>
  );
};

export default PostCard;
