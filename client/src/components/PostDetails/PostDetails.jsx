import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import api from "../../api/axios";
import CommentSection from "../CommentSection/CommentSection";
import * as S from "./PostDetails.styles";
import PostHeader from "./PostHeader";
import SharedBox from "./SharedBox";
import ImplementationForm from "../ImplementationForm/ImplementationForm";
import Swal from "sweetalert2";
import { translations } from "../../translations";

const PostDetails = ({ currentLang, currentUser, onUserUpdate }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [likes, setLikes] = useState([]);
  const [allComments, setAllComments] = useState([]);
  const [showComments, setShowComments] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(
    location.state?.openMadeThis || false,
  );
  const [shareComment, setShareComment] = useState("");
  const [madeThisMedia, setMadeThisMedia] = useState(null);
  const [madeThisPreview, setMadeThisPreview] = useState(null);
  const [commentText, setCommentText] = useState("");

  const t = translations[currentLang] || translations.en;

  const formatDateTime = (ds) =>
    ds
      ? new Date(ds).toLocaleString(currentLang === "he" ? "he-IL" : "en-US", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      : "";

  const getImageUrl = (path) => (path?.startsWith("http") ? path : path);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/posts/${id}`);
        if (res.data) {
          setPost(res.data);
          setLikes(res.data.likes || []);
          setAllComments(res.data.comments || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchPost();
  }, [id]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMadeThisMedia(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setMadeThisPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setMadeThisMedia(null);
    if (madeThisPreview) URL.revokeObjectURL(madeThisPreview);
    setMadeThisPreview(null);
  };

  const handleCancelForm = () => {
    setIsFormOpen(false);
    setShareComment("");
    setMadeThisMedia(null);
    setMadeThisPreview(null);
  };

  const handleLike = async (e) => {
    e.preventDefault();
    const res = await api.post(`/posts/like/${post._id}`);
    setLikes(res.data.likes || []);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const res = await api.post(`/posts/save/${post._id}`);
    if (onUserUpdate) onUserUpdate({ savedPosts: res.data.savedPosts });
  };

  const handleSubmitShare = async () => {
    if (!shareComment.trim()) return;
    try {
      const data = new FormData();
      data.append("content", shareComment);
      data.append("postType", "implementation");
      data.append("parentPost", post._id);
      data.append("category", post.category || "General");

      if (madeThisMedia) {
        data.append("media", madeThisMedia);
      }

      await api.post("/posts", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      handleCancelForm();
      navigate("/feed");
    } catch (err) {
      console.error("Error creating implementation:", err);
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
      title: t.deleteCommentTitle,
      text: t.deleteCommentText,
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
      }
    }
  };

  if (loading) return <div style={S.loading}>{t.loading} 🛠️</div>;
  if (!post)
    return (
      <div style={{ ...S.loading, color: "#dc3545" }}>{t.postNotFound}</div>
    );

  const currentUserId = currentUser?.id || currentUser?._id;

  return (
    <div style={{ padding: "20px", direction: "inherit" }}>
      <button
        onClick={() => navigate(-1)}
        style={{
          background: "none",
          border: "none",
          color: "#007bff",
          cursor: "pointer",
          fontWeight: "bold",
          marginBottom: "15px",
          display: "flex",
          alignItems: "center",
          gap: "5px",
        }}
      >
        <span
          style={{ transform: currentLang === "he" ? "none" : "scaleX(-1)" }}
        >
          →
        </span>{" "}
        {t.back}
      </button>

      <div style={S.container}>
        <PostHeader
          currentLang={currentLang}
          author={post.author}
          createdAt={post.createdAt}
          category={post.category || post.parentPost?.category}
          formatDateTime={formatDateTime}
          getImageUrl={getImageUrl}
        />

        {post.mediaUrl && (
          <div
            style={{
              width: "100%",
              maxHeight: "500px",
              overflow: "hidden",
              backgroundColor: "#f0f2f5",
            }}
          >
            <img src={getImageUrl(post.mediaUrl)} style={S.image} alt="" />
          </div>
        )}

        <div style={{ paddingTop: "15px", textAlign: "inherit" }}>
          {post.title && <h2 style={S.title}>{post.title}</h2>}
        </div>

        <div style={{ padding: "0 15px 20px 15px" }}>
          {post.projectDetails?.tools?.length > 0 && (
            <div style={{ marginTop: "15px" }}>
              <span style={S.sectionTitleStyle} dir="auto">
                ⚒️ Tools:
              </span>
              <div style={S.badgeContainerStyle} dir="auto">
                {post.projectDetails.tools.map((tool, index) => (
                  <span key={index} style={S.badgeStyle}>
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          )}

          {post.projectDetails?.materials?.length > 0 && (
            <div style={{ marginTop: "15px" }}>
              <span style={S.sectionTitleStyle} dir="auto">
                📦 Materials:
              </span>
              <div style={S.badgeContainerStyle} dir="auto">
                {post.projectDetails.materials.map((item, index) => (
                  <span key={index} style={S.badgeStyle}>
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}
          <p style={S.description}>{post.content}</p>
        </div>
        <SharedBox
          parentPost={post.parentPost}
          getImageUrl={getImageUrl}
          currentLang={currentLang}
        />

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "10px 15px",
            borderTop: "1px solid #eee",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
            <button
              onClick={handleLike}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "5px",
              }}
            >
              <span
                style={{
                  fontSize: "18px",
                  color: likes.includes(currentUserId) ? "#ff4d4d" : "#ccc",
                }}
              >
                {likes.includes(currentUserId) ? "❤️" : "🤍"}
              </span>
              <span
                style={{
                  fontSize: "14px",
                  fontWeight: "bold",
                  color: "#65676b",
                }}
              >
                {likes.length}
              </span>
            </button>
            <button
              onClick={() => setShowComments(!showComments)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "5px",
              }}
            >
              <span style={{ fontSize: "18px" }}>💬</span>
              <span
                style={{
                  fontSize: "14px",
                  fontWeight: "bold",
                  color: "#65676b",
                }}
              >
                {allComments.length}
              </span>
            </button>
            {post.postType !== "implementation" && (
              <button
                onClick={() => setIsFormOpen(!isFormOpen)}
                style={{
                  backgroundColor: isFormOpen ? "#65676b" : "#ff4757",
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
                🛠️ {isFormOpen ? t.close : t.iMadeThis}
              </button>
            )}
          </div>
          <button
            onClick={handleSave}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: "1.2rem",
            }}
            title={t.saveTitle}
          >
            {currentUser?.savedPosts?.some((s) => (s._id || s) === post._id)
              ? "📂"
              : "💾"}
          </button>
        </div>

        {isFormOpen && (
          <ImplementationForm
            currentLang={currentLang}
            isOpen={isFormOpen}
            currentUser={currentUser}
            value={shareComment}
            onChange={shareComment}
            onSubmit={handleSubmitShare}
            onCancel={handleCancelForm}
            getImageUrl={getImageUrl}
            onFileChange={handleFileChange}
            previewUrl={madeThisPreview}
            onRemoveImage={handleRemoveImage}
          />
        )}
      </div>

      {showComments && (
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
      )}
    </div>
  );
};

export default PostDetails;
