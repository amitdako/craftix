import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
// ייבוא הסטיילים
import * as s from "./PostCard.styles";
import ImplementationForm from "./ImplementationForm";
import PostContent from "./PostContent";
import PostFooterActions from "./PostFooterActions";
import PostHeader from "./PostHeader";
import PostImplementationBox from "./PostImplementationBox";

// ייבוא רכיבים חיצוניים קיימים
import CommentSection from "../CommentSection/CommentSection";
const PostCard = ({ post, currentUser, onSave, onDelete, onUserUpdate }) => {
  const [likes, setLikes] = useState(post.likes || []);
  const [showComments, setShowComments] = useState(false);
  const [showMadeThisForm, setShowMadeThisForm] = useState(false);
  const [allComments, setAllComments] = useState(post.comments || []);
  const [madeThisText, setMadeThisText] = useState("");
  const navigate = useNavigate();

  // לוגיקה
  const currentUserId = currentUser?.id || currentUser?._id;
  const isLiked = likes.includes(currentUserId);
  const isOwner =
    currentUser &&
    post.author &&
    (post.author._id || post.author) === currentUserId;
  const isSaved =
    Array.isArray(currentUser?.savedPosts) &&
    currentUser.savedPosts.some((item) => (item._id || item) === post._id);

  // עזרי עיצוב (כמו getImageUrl ו-formatDateTime נשארים כאן או עוברים ל-Utils)
  const getImageUrl = (path) =>
    path?.startsWith("http") ? path : `http://localhost:5000${path}`;
  const formatDateTime = (date) =>
    new Date(date).toLocaleString("he-IL", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const handleLike = async (e) => {
    e.stopPropagation();
    try {
      const response = await api.post(`/posts/like/${post._id}`);
      setLikes(response.data.likes);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmitMadeThis = async (e) => {
    if (e) e.stopPropagation();
    if (!madeThisText.trim()) return;
    try {
      await api.post("/posts", {
        title: `ביצוע ל-${post.title || "פרויקט"}`,
        content: madeThisText,
        postType: "implementation",
        parentPost: post._id,
        category: post.category || "General",
      });
      alert("הביצוע פורסם בהצלחה!");
      window.location.reload();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="post-card" style={s.cardStyle}>
      <PostHeader
        author={post.author}
        createdAt={post.createdAt}
        category={post.category}
        getImageUrl={getImageUrl}
        formatDateTime={formatDateTime}
      />

      <PostContent
        title={post.title}
        content={post.content}
        mediaUrl={post.mediaUrl}
        mediaType={post.mediaType}
        getImageUrl={getImageUrl}
        onNavigate={() => navigate(`/post/${post._id}`)}
      />

      {post.postType === "implementation" && (
        <PostImplementationBox
          parentPost={post.parentPost}
          getImageUrl={getImageUrl}
          onNavigate={(e) => {
            e.stopPropagation();
            navigate(`/post/${post.parentPost._id || post.parentPost}`);
          }}
        />
      )}

      <PostFooterActions
        isLiked={isLiked}
        likesCount={likes.length}
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
          currentUser={currentUser}
          text={madeThisText}
          setText={setMadeThisText}
          onSubmit={handleSubmitMadeThis}
          onCancel={() => setShowMadeThisForm(false)}
          getImageUrl={getImageUrl}
        />
      )}

      {showComments && (
        <div style={{ padding: "15px" }} onClick={(e) => e.stopPropagation()}>
          <CommentSection
            allComments={allComments}
            currentUserId={currentUserId}
          />
        </div>
      )}
    </div>
  );
};
export default PostCard;
