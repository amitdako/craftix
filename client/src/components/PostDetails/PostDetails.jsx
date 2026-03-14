import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import api from "../../api/axios";
import CommentSection from "../CommentSection/CommentSection";
import * as S from "./PostDetails.styles";

// ייבוא רכיבי המשנה
import PostHeader from "./PostHeader";
import SharedBox from "./SharedBox";
import ImplementationForm from "./ImplementationForm";

const PostDetails = ({ currentUser, onUserUpdate }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [likes, setLikes] = useState([]);
  const [allComments, setAllComments] = useState([]);

  // תיקון 1: התגובות סגורות כברירת מחדל
  const [showComments, setShowComments] = useState(false);

  const [isFormOpen, setIsFormOpen] = useState(
    location.state?.openMadeThis || false,
  );
  const [shareComment, setShareComment] = useState("");

  const formatDateTime = (ds) =>
    ds
      ? new Date(ds).toLocaleString("he-IL", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      : "";
  const getImageUrl = (path) =>
    path?.startsWith("http") ? path : `http://localhost:5000${path}`;

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
      await api.post("/posts", {
        content: shareComment,
        postType: "implementation",
        parentPost: post._id,
        category: post.category,
      });

      setShareComment("");
      setIsFormOpen(false);
    } catch (err) {
      console.error("Error creating implementation:", err);
    }
  };

  if (loading) return <div style={S.styles.loading}>טוען... 🛠️</div>;
  if (!post)
    return (
      <div style={{ ...S.styles.loading, color: "#dc3545" }}>
        הפוסט לא נמצא.
      </div>
    );

  const currentUserId = currentUser?.id || currentUser?._id;

  return (
    <div style={{ padding: "20px", direction: "rtl" }}>
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
        <span>→</span> חזרה
      </button>

      <div style={S.styles.container}>
        <PostHeader
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
            <img
              src={getImageUrl(post.mediaUrl)}
              style={S.styles.image}
              alt=""
            />
          </div>
        )}

        <div style={{ paddingTop: "15px" }}>
          {post.title && <h2 style={S.styles.title}>{post.title}</h2>}
          <p style={S.styles.description}>{post.content}</p>
        </div>

        <SharedBox parentPost={post.parentPost} getImageUrl={getImageUrl} />

        {/* Actions Footer */}
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
                style={S.styles.madeThisButton}
              >
                🛠️ I Made This!
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
          >
            {currentUser?.savedPosts?.some((s) => (s._id || s) === post._id)
              ? "📂"
              : "💾"}
          </button>
        </div>

        <ImplementationForm
          isOpen={isFormOpen}
          value={shareComment}
          onChange={setShareComment}
          onSubmit={handleSubmitShare}
        />
      </div>

      {showComments && (
        <CommentSection
          allComments={allComments}
          currentUserId={currentUserId}
          formatDateTime={formatDateTime}
        />
      )}
    </div>
  );
};

export default PostDetails;
