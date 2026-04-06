import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import api from "../../api/axios";
import CommentSection from "../CommentSection/CommentSection";
import * as S from "./PostDetails.styles";
import PostHeader from "../PostCard/PostHeader"; // משתמשים ב-Header היפה של הפיד
import SharedBox from "./SharedBox";
import ImplementationForm from "../ImplementationForm/ImplementationForm";
import Swal from "sweetalert2";
import { translations } from "../../translations";

// אייקונים
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
  const isHe = currentLang === "he";

  const formatDateTime = (ds) =>
    ds
      ? new Date(ds).toLocaleString(isHe ? "he-IL" : "en-US", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      : "";

  const getImageUrl = (path) =>
    path?.startsWith("http")
      ? path
      : `http://localhost:5000${path?.startsWith("/") ? path : `/${path}`}`;

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
      reader.onloadend = () => setMadeThisPreview(reader.result);
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
      if (madeThisMedia) data.append("media", madeThisMedia);

      await api.post("/posts", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      handleCancelForm();
      navigate("/feed");
    } catch (err) {
      console.error(err);
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
      console.error(err);
    }
  };

  const handleLikeComment = async (commentId) => {
    try {
      const response = await api.post(
        `/posts/${post._id}/comment/${commentId}/like`,
      );
      setAllComments(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteComment = async (commentId) => {
    const result = await Swal.fire({
      title: t.deleteCommentTitle,
      text: t.deleteCommentText,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ed4956",
      cancelButtonColor: "#dbdbdb",
      confirmButtonText: t.deleteBtn,
      cancelButtonText: t.cancelBtn,
      reverseButtons: isHe,
    });
    if (result.isConfirmed) {
      try {
        const response = await api.delete(
          `/posts/${post._id}/comment/${commentId}`,
        );
        setAllComments(response.data);
      } catch (err) {
        console.error(err);
      }
    }
  };

  if (loading)
    return <div style={S.loading}>{isHe ? "טוען..." : "Loading..."}</div>;
  if (!post)
    return (
      <div style={{ ...S.loading, color: "#ed4956" }}>{t.postNotFound}</div>
    );

  const currentUserId = currentUser?.id || currentUser?._id;

  return (
    <div
      style={{
        maxWidth: "600px",
        margin: "0 auto",
        padding: "20px 0",
        direction: isHe ? "rtl" : "ltr",
      }}
    >
      {/* כפתור חזור */}
      <button
        onClick={() => navigate(-1)}
        style={{
          background: "none",
          border: "none",
          color: "#262626",
          cursor: "pointer",
          fontWeight: "600",
          fontSize: "14px",
          display: "flex",
          alignItems: "center",
          gap: "6px",
          marginBottom: "15px",
          padding: "0 14px",
        }}
      >
        <span
          style={{
            transform: isHe ? "rotate(180deg)" : "none",
            fontSize: "18px",
          }}
        >
          ←
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
          <div style={{ width: "100%", backgroundColor: "#fafafa" }}>
            <img src={getImageUrl(post.mediaUrl)} style={S.image} alt="" />
          </div>
        )}

        {/* פעולות ולייקים מתחת לתמונה */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "10px 14px",
          }}
        >
          <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
            <button onClick={handleLike} style={S.actionBtnStyle}>
              {likes.includes(currentUserId) ? (
                <HeartFilled />
              ) : (
                <HeartOutline />
              )}
            </button>
            <button
              onClick={() => setShowComments(!showComments)}
              style={S.actionBtnStyle}
            >
              <CommentIcon />
              {allComments.length > 0 && (
                <span
                  style={{
                    fontSize: "14px",
                    fontWeight: "600",
                    marginInlineStart: "6px",
                  }}
                >
                  {allComments.length}
                </span>
              )}
            </button>

            {post.postType !== "implementation" && (
              <button
                onClick={() => setIsFormOpen(!isFormOpen)}
                style={S.madeThisButtonStyle(isFormOpen)}
              >
                {isFormOpen ? t.cancel : t.iMadeThis}
              </button>
            )}
          </div>

          <button
            onClick={handleSave}
            style={S.actionBtnStyle}
            title={t.saveTitle}
          >
            {currentUser?.savedPosts?.some((s) => (s._id || s) === post._id) ? (
              <SaveFilled />
            ) : (
              <SaveOutline />
            )}
          </button>
        </div>

        {likes.length > 0 && (
          <div
            style={{
              padding: "0 14px",
              fontWeight: "600",
              fontSize: "14px",
              color: "#262626",
            }}
          >
            {likes.length} {t.likes}
          </div>
        )}

        <div style={{ padding: "8px 14px 16px 14px" }}>
          {post.title && (
            <h2 style={S.title} dir="auto">
              {post.title}
            </h2>
          )}
          <p style={S.description} dir="auto">
            {post.content}
          </p>

          {post.projectDetails?.tools?.length > 0 && (
            <div style={{ marginTop: "12px" }} dir="auto">
              <span style={S.sectionTitleStyle}>{t.tools}:</span>
              <div style={S.badgeContainerStyle}>
                {post.projectDetails.tools.map((tool, idx) => (
                  <span key={idx} style={S.badgeStyle}>
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          )}

          {post.projectDetails?.materials?.length > 0 && (
            <div style={{ marginTop: "12px" }} dir="auto">
              <span style={S.sectionTitleStyle}>{t.materials}:</span>
              <div style={S.badgeContainerStyle}>
                {post.projectDetails.materials.map((item, idx) => (
                  <span key={idx} style={S.badgeStyle}>
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <SharedBox
          parentPost={post.parentPost}
          getImageUrl={getImageUrl}
          currentLang={currentLang}
        />

        {isFormOpen && (
          <ImplementationForm
            currentLang={currentLang}
            isOpen={isFormOpen}
            currentUser={currentUser}
            value={shareComment}
            onChange={setShareComment}
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
        <div style={{ padding: "10px 0" }}>
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

export default PostDetails;
