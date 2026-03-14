import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import * as s from "./PostCard.styles";
import PostHeader from "./PostHeader";
import PostContent from "./PostContent";
import PostImplementationBox from "./PostImplementationBox";
import PostFooterActions from "./PostFooterActions";
import ImplementationForm from "../../ImplementationForm/ImplementationForm";
import CommentSection from "../CommentSection/CommentSection";
import Swal from "sweetalert2";

const PostCard = ({ post, currentUser, onSave, onDelete }) => {
  const [likes, setLikes] = useState(post.likes || []);
  const [madeThisMedia, setMadeThisMedia] = useState(null);
  const [madeThisPreview, setMadeThisPreview] = useState(null);
  const [showComments, setShowComments] = useState(false);
  const [showMadeThisForm, setShowMadeThisForm] = useState(false);
  const [allComments, setAllComments] = useState(post.comments || []);
  const [commentText, setCommentText] = useState(""); // חזר למקומו
  const [madeThisText, setMadeThisText] = useState("");
  const navigate = useNavigate();

  const currentUserId = currentUser?.id || currentUser?._id;
  const isLiked = likes.includes(currentUserId);
  const isOwner =
    currentUser &&
    post.author &&
    (post.author._id || post.author) === currentUserId;
  const isSaved =
    Array.isArray(currentUser?.savedPosts) &&
    currentUser.savedPosts.some((item) => (item._id || item) === post._id);

  const getImageUrl = (path) =>
    path?.startsWith("http") ? path : `http://localhost:5000${path}`;
  //date and time of post.
  const formatDateTime = (date) =>
    new Date(date).toLocaleString("he-IL", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  //Adding file.
  const handleMadeThisFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMadeThisMedia(file);
      setMadeThisPreview(URL.createObjectURL(file));
    }
  };

  //Make like.
  const handleLike = async (e) => {
    e.stopPropagation();
    try {
      const response = await api.post(`/posts/like/${post._id}`);
      setLikes(response.data.likes);
    } catch (err) {
      console.error("Error liking post:", err);
    }
  };
  //Subimt i made it.
  const handleSubmitMadeThis = async (e) => {
    if (e) e.stopPropagation();
    if (!madeThisText.trim()) return;
    try {
      const data = new FormData();
      data.append("title", ` My version of ${post.title}`);
      data.append("content", madeThisText);
      data.append("postType", "implementation");
      data.append("parentPost", post._id);
      data.append("category", post.category || "General");

      // adding media if there is
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

  //add comment
  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    try {
      const response = await api.post(`/posts/${post._id}/comment`, {
        text: commentText,
      });
      setAllComments(response.data);
      setCommentText(""); //after we finish, the new comment area is empty.
    } catch (err) {
      console.error("Error adding comment:", err);
    }
  };
  //make like to comment.
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
  //delete comment.
  const handleDeleteComment = async (commentId) => {
    //asking if the user confirm the delete.
    const result = await Swal.fire({
      title: "Are you sure you want to continue?",
      text: "Deleting this comment is permanent and cannot be undone",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ff4757", // red for delete.
      cancelButtonColor: "#65676b", // gray for cancel.
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
      reverseButtons: false,
    });
    if (result.isConfirmed) {
      try {
        const response = await api.delete(
          `/posts/${post._id}/comment/${commentId}`,
        );
        //udpating the comments without the one he deleted.
        setAllComments(response.data);
      } catch (err) {
        console.error("Error deleting comment:", err);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Please try again later.",
        });
      }
    }
  };

  // --- Render ---
  return (
    <div className="post-card" style={s.cardStyle}>
      {/*title of post */}
      <PostHeader
        author={post.author}
        createdAt={post.createdAt}
        category={post.category}
        getImageUrl={getImageUrl}
        formatDateTime={formatDateTime}
      />

      {/* Content of post*/}
      <PostContent
        title={post.title}
        content={post.content}
        mediaUrl={post.mediaUrl}
        mediaType={post.mediaType}
        getImageUrl={getImageUrl}
        onNavigate={() => navigate(`/post/${post._id}`)}
      />

      {/* original post*/}
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

      {/* buttons*/}
      <PostFooterActions
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

      {/* "I Made This form" */}
      {showMadeThisForm && (
        <ImplementationForm
          isOpen={showMadeThisForm}
          currentUser={currentUser}
          value={madeThisText}
          onChange={setMadeThisText}
          onSubmit={handleSubmitMadeThis}
          onCancel={() => setShowMadeThisForm(false)}
          getImageUrl={getImageUrl}
          onFileChange={handleMadeThisFileChange}
          previewUrl={madeThisPreview}
        />
      )}

      {/* comments of post*/}
      {showComments && (
        <div style={{ padding: "15px" }} onClick={(e) => e.stopPropagation()}>
          <CommentSection
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
