import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import * as s from "./PostCard.styles";
import PostHeader from "./PostHeader";
import PostContent from "./PostContent";
import PostImplementationBox from "./PostImplementationBox";
import PostFooterActions from "./PostFooterActions";
import ImplementationForm from "../ImplementationForm/ImplementationForm";
import CommentSection from "../CommentSection/CommentSection";
import Swal from "sweetalert2";
import { translations } from "../../translations";

const PostCard = ({ currentLang, post, currentUser, onSave, onDelete }) => {
  const [likes, setLikes] = useState(post.likes || []);
  const [madeThisMedia, setMadeThisMedia] = useState(null);
  const [madeThisPreview, setMadeThisPreview] = useState(null);
  const [showComments, setShowComments] = useState(false);
  const [showMadeThisForm, setShowMadeThisForm] = useState(false);
  const [allComments, setAllComments] = useState(post.comments || []);
  const [commentText, setCommentText] = useState("");
  const [madeThisText, setMadeThisText] = useState("");
  const navigate = useNavigate();

  const t = translations[currentLang] || translations.en;

  const currentUserId = currentUser?.id || currentUser?._id;
  const isLiked = likes.includes(currentUserId);
  const isOwner =
    currentUser &&
    post.author &&
    (post.author._id || post.author) === currentUserId;
  const isSaved =
    Array.isArray(currentUser?.savedPosts) &&
    currentUser.savedPosts.some((item) => (item._id || item) === post._id);

  const isGeneralPost = post.postType === "general";

  const getImageUrl = (imagePath) => {
    if (!imagePath) return "";
    if (imagePath.startsWith("http")) return imagePath;
    const baseUrl = "http://localhost:5000";
    return `${baseUrl}${imagePath.startsWith("/") ? imagePath : `/${imagePath}`}`;
  };

  const formatDateTime = (date) =>
    new Date(date).toLocaleString(currentLang === "he" ? "he-IL" : "en-US", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const handleMadeThisFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMadeThisMedia(file);
      setMadeThisPreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setMadeThisMedia(null);
    if (madeThisPreview) URL.revokeObjectURL(madeThisPreview);
    setMadeThisPreview(null);
  };

  const handleLike = async (e) => {
    e.stopPropagation();
    try {
      const response = await api.post(`/posts/like/${post._id}`);
      setLikes(response.data.likes);
    } catch (err) {
      console.error("Error liking post:", err);
    }
  };

  const handleSubmitMadeThis = async (e) => {
    if (e) e.stopPropagation();
    if (!madeThisText.trim()) return;
    try {
      const data = new FormData();
      data.append("title", `${t.myVersionOf} ${post.title}`);
      data.append("content", madeThisText);
      data.append("postType", "implementation");
      data.append("parentPost", post._id);
      data.append("category", post.category || "General");

      if (madeThisMedia) data.append("media", madeThisMedia);

      await api.post("/posts", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      window.location.reload();
    } catch (err) {
      console.error("Error submitting implementation:", err);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    try {
      const response = await api.post(`/posts/${post._id}/comment`, {
        text: commentText,
      });
      setAllComments(response.data);
      setCommentText("");
    } catch (err) {
      console.error("Error adding comment:", err);
    }
  };

  const handleLikeComment = async (commentId) => {
    try {
      const response = await api.post(
        `/posts/${post._id}/comment/${commentId}/like`,
      );
      setAllComments(response.data);
    } catch (err) {
      console.error("Error liking comment:", err);
    }
  };

  const handleDeleteComment = async (commentId) => {
    const result = await Swal.fire({
      title: t.commentDeleteConfirmTitle,
      text: t.commentDeleteConfirmText,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ed4956",
      cancelButtonColor: "#dbdbdb",
      confirmButtonText: t.deleteBtn,
      cancelButtonText: t.cancelBtn,
      reverseButtons: currentLang === "he",
    });
    if (result.isConfirmed) {
      try {
        const response = await api.delete(
          `/posts/${post._id}/comment/${commentId}`,
        );
        setAllComments(response.data);
      } catch (err) {
        Swal.fire({ icon: "error", title: t.oops, text: t.tryAgainLater });
      }
    }
  };

  return (
    <div
      className="post-card"
      style={s.cardStyle}
      dir={currentLang === "he" ? "rtl" : "ltr"}
    >
      <PostHeader
        currentLang={currentLang}
        author={post.author}
        createdAt={post.createdAt}
        category={post.category}
        getImageUrl={getImageUrl}
        formatDateTime={formatDateTime}
      />

      {post.mediaUrl && (
        <div
          style={s.mediaWrapperStyle}
          onClick={() => navigate(`/post/${post._id}`)}
        >
          {post.mediaType === "video" ? (
            <video
              src={getImageUrl(post.mediaUrl)}
              controls
              style={s.mediaContentStyle}
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <img
              src={getImageUrl(post.mediaUrl)}
              style={s.mediaContentStyle}
              alt=""
            />
          )}
        </div>
      )}

      {/* סדר התצוגה משתנה לפי סוג הפוסט */}
      {isGeneralPost ? (
        <>
          <PostContent
            currentLang={currentLang}
            title={post.title}
            content={post.content}
            authorName={post.author?.displayName}
            onNavigate={() => navigate(`/post/${post._id}`)}
            tools={post.projectDetails?.tools}
            materials={post.projectDetails?.materials}
          />
          {likes.length > 0 && (
            <div style={s.likeCountLabel} dir="auto">
              {likes.length} {t.likes}
            </div>
          )}
          <PostFooterActions
            currentLang={currentLang}
            isLiked={isLiked}
            isSaved={isSaved}
            isOwner={isOwner}
            postType={post.postType}
            showMadeThisForm={showMadeThisForm}
            onLike={handleLike}
            onCommentToggle={(e) => {
              e.stopPropagation();
              setShowComments(!showComments);
            }}
            onMadeThisClick={(e) => {
              e.stopPropagation();
              setShowMadeThisForm(!showMadeThisForm);
            }}
            onSave={(e) => {
              e.stopPropagation();
              onSave(post._id);
            }}
            onDelete={(e) => {
              e.stopPropagation();
              onDelete(post._id);
            }}
            commentsCount={allComments.length}
          />
        </>
      ) : (
        <>
          <PostFooterActions
            currentLang={currentLang}
            isLiked={isLiked}
            isSaved={isSaved}
            isOwner={isOwner}
            postType={post.postType}
            showMadeThisForm={showMadeThisForm}
            onLike={handleLike}
            onCommentToggle={(e) => {
              e.stopPropagation();
              setShowComments(!showComments);
            }}
            onMadeThisClick={(e) => {
              e.stopPropagation();
              setShowMadeThisForm(!showMadeThisForm);
            }}
            onSave={(e) => {
              e.stopPropagation();
              onSave(post._id);
            }}
            onDelete={(e) => {
              e.stopPropagation();
              onDelete(post._id);
            }}
          />
          {likes.length > 0 && (
            <div style={s.likeCountLabel} dir="auto">
              {likes.length} {t.likes}
            </div>
          )}
          <PostContent
            currentLang={currentLang}
            title={post.title}
            content={post.content}
            authorName={post.author?.displayName}
            onNavigate={() => navigate(`/post/${post._id}`)}
            tools={post.projectDetails?.tools}
            materials={post.projectDetails?.materials}
          />
          {post.postType === "implementation" && (
            <PostImplementationBox
              currentLang={currentLang}
              parentPost={post.parentPost}
              getImageUrl={getImageUrl}
              onNavigate={(e) => {
                e.stopPropagation();
                navigate(`/post/${post.parentPost._id || post.parentPost}`);
              }}
              t={t}
            />
          )}
        </>
      )}

      {showMadeThisForm && (
        <ImplementationForm
          currentLang={currentLang}
          isOpen={showMadeThisForm}
          currentUser={currentUser}
          value={madeThisText}
          onChange={setMadeThisText}
          onSubmit={handleSubmitMadeThis}
          onCancel={() => setShowMadeThisForm(false)}
          getImageUrl={getImageUrl}
          onFileChange={handleMadeThisFileChange}
          previewUrl={madeThisPreview}
          onRemoveImage={handleRemoveImage}
        />
      )}

      {showComments && (
        <div
          style={{ padding: "0 14px 15px 14px" }}
          onClick={(e) => e.stopPropagation()}
        >
          <CommentSection
            currentLang={currentLang}
            allComments={allComments}
            currentUserId={currentUserId}
            handleDeleteComment={handleDeleteComment}
            handleLikeComment={handleLikeComment}
            handleAddComment={handleAddComment}
            commentText={commentText}
            setCommentText={setCommentText}
          />
        </div>
      )}
    </div>
  );
};

export default PostCard;
