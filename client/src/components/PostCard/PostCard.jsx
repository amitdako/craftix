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

  const getImageUrl = (imagePath) => {
    if (!imagePath) return ""; // אם אין תמונה, אל תחזיר כלום

    // אם זו תמונה מ-AWS (מתחילה ב-http), תחזיר אותה כמו שהיא
    if (imagePath.startsWith("http")) {
      return imagePath;
    }

    // אם זו תמונה מקומית, תוסיף את הכתובת של שרת ה-Node.js שלך
    // וודא שיש קו נטוי (/) בין הכתובת לנתיב הקובץ
    const baseUrl = "http://localhost:5000";
    const formattedPath = imagePath.startsWith("/")
      ? imagePath
      : `/${imagePath}`;

    return `${baseUrl}${formattedPath}`;
  };
  // date and time of post.
  const formatDateTime = (date) =>
    new Date(date).toLocaleString(currentLang === "he" ? "he-IL" : "en-US", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  // Adding file.
  const handleMadeThisFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMadeThisMedia(file);
      setMadeThisPreview(URL.createObjectURL(file));
    }
  };

  // remove picture that i added before posting.
  const handleRemoveImage = () => {
    setMadeThisMedia(null);
    if (madeThisPreview) URL.revokeObjectURL(madeThisPreview); // cleaning memory
    setMadeThisPreview(null);
  };

  // Make like.
  const handleLike = async (e) => {
    e.stopPropagation();
    try {
      const response = await api.post(`/posts/like/${post._id}`);
      setLikes(response.data.likes);
    } catch (err) {
      console.error("Error liking post:", err);
    }
  };

  // Submit i made it.
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

      if (madeThisMedia) {
        data.append("media", madeThisMedia);
      }
      await api.post("/posts", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      window.location.reload();
    } catch (err) {
      console.error("Error submitting implementation:", err);
    }
  };

  // add comment
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

  // make like to comment.
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

  // delete comment.
  const handleDeleteComment = async (commentId) => {
    const result = await Swal.fire({
      title: t.commentDeleteConfirmTitle,
      text: t.commentDeleteConfirmText,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ff4757",
      cancelButtonColor: "#65676b",
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
        console.error("Error deleting comment:", err);
        Swal.fire({
          icon: "error",
          title: t.oops,
          text: t.tryAgainLater,
        });
      }
    }
  };

  return (
    <div className="post-card" style={s.cardStyle}>
      <PostHeader
        currentLang={currentLang}
        author={post.author}
        createdAt={post.createdAt}
        category={post.category}
        getImageUrl={getImageUrl}
        formatDateTime={formatDateTime}
      />

      <PostContent
        currentLang={currentLang}
        title={post.title}
        content={post.content}
        mediaUrl={post.mediaUrl}
        mediaType={post.mediaType}
        getImageUrl={getImageUrl}
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
        />
      )}

      <PostFooterActions
        currentLang={currentLang}
        likesCount={likes.length}
        isLiked={isLiked}
        commentsCount={allComments.length}
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
        <div style={{ padding: "15px" }} onClick={(e) => e.stopPropagation()}>
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
