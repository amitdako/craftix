import React, { useRef, useState, useEffect } from "react";
import api from "../../api/axios";
import * as S from "./Shorts.styles";
import Swal from "sweetalert2";
import { translations } from "../../translations";
//symbols
const HeartOutline = () => (
  <svg fill="currentColor" height="28" viewBox="0 0 24 24" width="28">
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
  <svg fill="#ff3040" height="28" viewBox="0 0 48 48" width="28">
    <path d="M34.6 3.1c-4.5 0-7.9 1.8-10.6 5.6-2.7-3.7-6.1-5.5-10.6-5.5C6 3.1 0 9.6 0 17.6c0 7.3 5.4 12 10.6 16.5.6.5 1.3 1.1 1.9 1.7l2.3 2c4.4 3.9 6.6 5.9 7.6 6.5.5.3 1.1.5 1.6.5s1.1-.2 1.6-.5c1-.6 2.8-2.2 7.8-6.8l2-1.8c.7-.6 1.3-1.2 2-1.7C42.7 29.6 48 25 48 17.6c0-8-6-14.5-13.4-14.5z"></path>
  </svg>
);
const CommentIcon = () => (
  <svg fill="currentColor" height="28" viewBox="0 0 24 24" width="28">
    <path
      d="M20.656 17.008a9.993 9.993 0 1 0-3.59 3.615L22 22Z"
      fill="none"
      stroke="currentColor"
      strokeLinejoin="round"
      strokeWidth="2"
    ></path>
  </svg>
);
const SmallHeartOutline = () => (
  <svg fill="currentColor" height="14" viewBox="0 0 24 24" width="14">
    <path
      d="M16.792 3.904A4.989 4.989 0 0 1 21.5 9.122c0 3.072-2.652 4.959-5.197 7.222-2.512 2.243-3.865 3.469-4.303 3.752-.477-.309-2.143-1.823-4.303-3.752C5.141 14.072 2.5 12.167 2.5 9.122a4.989 4.989 0 0 1 4.708-5.218 4.21 4.21 0 0 1 3.675 1.941c.84 1.174 1.8 1.174 2.634 0a4.212 4.212 0 0 1 3.675-1.941z"
      fill="none"
      stroke="currentColor"
      strokeLinejoin="round"
      strokeWidth="2"
    ></path>
  </svg>
);
const SmallHeartFilled = () => (
  <svg fill="#ff3040" height="14" viewBox="0 0 48 48" width="14">
    <path d="M34.6 3.1c-4.5 0-7.9 1.8-10.6 5.6-2.7-3.7-6.1-5.5-10.6-5.5C6 3.1 0 9.6 0 17.6c0 7.3 5.4 12 10.6 16.5.6.5 1.3 1.1 1.9 1.7l2.3 2c4.4 3.9 6.6 5.9 7.6 6.5.5.3 1.1.5 1.6.5s1.1-.2 1.6-.5c1-.6 2.8-2.2 7.8-6.8l2-1.8c.7-.6 1.3-1.2 2-1.7C42.7 29.6 48 25 48 17.6c0-8-6-14.5-13.4-14.5z"></path>
  </svg>
);
const TrashIcon = () => (
  <svg fill="currentColor" height="14" viewBox="0 0 24 24" width="14">
    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
  </svg>
);

const ShortCard = ({
  makeId,
  videoUrl,
  authorName,
  avatarUrl,
  description,
  likesCount,
  commentsCount,
  initialIsLiked,
  currentUser,
  currentLang = "he",
}) => {
  const [isPlaying, setIsPlaying] = useState(false); //is need to be played
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [likes, setLikes] = useState(likesCount);
  const videoRef = useRef(null);

  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [newCommentText, setNewCommentText] = useState("");
  const [currentCommentsCount, setCurrentCommentsCount] =
    useState(commentsCount);

  const currentUserId = currentUser?.id || currentUser?._id;

  const t = translations[currentLang] || translations.en;
  const isHe = currentLang === "he";

  const getImageUrl = (path) => {
    if (!path) return "https://via.placeholder.com/150";
    if (path.startsWith("http")) return path;
    return `http://localhost:5000${path.startsWith("/") ? path : `/${path}`}`;
  };

  const formatTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return (
      date.toLocaleDateString("he-IL") +
      " " +
      date.toLocaleTimeString("he-IL", { hour: "2-digit", minute: "2-digit" })
    );
  };

  useEffect(() => {
    const options = { root: null, rootMargin: "0px", threshold: 0.6 };
    const observer = new IntersectionObserver((entries) => {
      const entry = entries[0];
      if (entry.isIntersecting) {
        videoRef.current?.play().catch(() => {});
        setIsPlaying(true);
      } else {
        videoRef.current?.pause();
        setIsPlaying(false);
        setShowComments(false);
      }
    }, options);

    if (videoRef.current) observer.observe(videoRef.current);
    return () => {
      if (videoRef.current) observer.unobserve(videoRef.current);
    };
  }, []);
  //play if we on the video
  const togglePlay = () => {
    if (isPlaying) videoRef.current.pause();
    else videoRef.current.play();
    setIsPlaying(!isPlaying);
  };
  //doing like
  const handleLike = async () => {
    if (!currentUser) return alert("יש להתחבר כדי לעשות לייק");
    setIsLiked(!isLiked);
    setLikes(isLiked ? likes - 1 : likes + 1);
    try {
      await api.post(`/makes/like/${makeId}`);
    } catch (err) {
      setIsLiked(!isLiked);
      setLikes(isLiked ? likes + 1 : likes - 1);
    }
  };

  const handleOpenComments = async () => {
    setShowComments(true);
    try {
      const res = await api.get(`/makes/${makeId}/comments`);
      setComments(res.data);
    } catch (err) {
      console.error("Error fetching comments", err);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;
    try {
      const res = await api.post(`/makes/${makeId}/comment`, {
        text: newCommentText,
      });
      setComments(res.data);
      setNewCommentText("");
      setCurrentCommentsCount(res.data.length);
    } catch (err) {
      console.error("Error adding comment", err);
    }
  };

  const handleLikeComment = async (commentId) => {
    if (!currentUser) return alert("יש להתחבר כדי לעשות לייק");
    try {
      const res = await api.post(`/makes/${makeId}/comment/${commentId}/like`);
      setComments(res.data);
    } catch (err) {
      console.error("Error liking comment", err);
    }
  };
  //delete comment
  const handleDeleteComment = async (commentId) => {
    const result = await Swal.fire({
      title: t.deleteCommentTitle || "מחק תגובה",
      text: t.deleteCommentText || "האם אתה בטוח שברצונך למחוק תגובה זו?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ed4956",
      cancelButtonColor: "#dbdbdb",
      confirmButtonText: t.deleteBtn || "מחק",
      cancelButtonText: t.cancelBtn || "ביטול",
      reverseButtons: isHe,
    });

    if (result.isConfirmed) {
      try {
        const res = await api.delete(`/makes/${makeId}/comment/${commentId}`);
        setComments(res.data);
        setCurrentCommentsCount(res.data.length);
      } catch (err) {
        console.error("Error deleting comment", err);
      }
    }
  };

  return (
    <div style={S.shortCardContainer}>
      <video
        ref={videoRef}
        src={videoUrl}
        style={S.videoElement}
        loop
        muted
        playsInline
        onClick={togglePlay}
      />

      <div style={S.infoOverlay} dir="auto">
        <div style={S.authorRow}>
          {avatarUrl ? (
            <img src={avatarUrl} alt={authorName} style={S.authorAvatar} />
          ) : (
            <div
              style={{
                ...S.authorAvatar,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#333",
                fontSize: "14px",
                color: "white",
              }}
            >
              {authorName?.[0] || "U"}
            </div>
          )}
          <span style={S.authorName}>{authorName}</span>
        </div>
        <p style={S.description}>{description}</p>
      </div>

      <div style={S.actionsOverlay}>
        <button style={S.actionBtn} onClick={handleLike}>
          {isLiked ? <HeartFilled /> : <HeartOutline />}
          <span style={S.actionText}>{likes}</span>
        </button>

        <button style={S.actionBtn} onClick={handleOpenComments}>
          <CommentIcon />
          <span style={S.actionText}>{currentCommentsCount}</span>
        </button>
      </div>

      {showComments && (
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "60%",
            backgroundColor: "#fff",
            borderTopLeftRadius: "20px",
            borderTopRightRadius: "20px",
            zIndex: 20,
            display: "flex",
            flexDirection: "column",
            animation: "slideUp 0.3s ease-out",
          }}
        >
          <style>{`@keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }`}</style>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "15px",
              borderBottom: "1px solid #efefef",
            }}
          >
            <span style={{ fontWeight: "600", color: "#262626" }}>תגובות</span>
            <button
              onClick={() => setShowComments(false)}
              style={{
                background: "none",
                border: "none",
                fontSize: "18px",
                cursor: "pointer",
                color: "#262626",
              }}
            >
              ✕
            </button>
          </div>

          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "15px",
              direction: "auto",
            }}
          >
            {comments.length === 0 ? (
              <p
                style={{
                  textAlign: "center",
                  color: "#8e8e8e",
                  marginTop: "20px",
                  fontSize: "14px",
                }}
              >
                אין תגובות עדיין. היה הראשון להגיב!
              </p>
            ) : (
              comments.map((comment, index) => (
                <div
                  key={comment._id || index}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "15px",
                    alignItems: "flex-start",
                  }}
                >
                  <div style={{ display: "flex", gap: "10px" }}>
                    <img
                      src={getImageUrl(comment.author?.profileImage)}
                      alt=""
                      style={{
                        width: "32px",
                        height: "32px",
                        borderRadius: "50%",
                        objectFit: "cover",
                      }}
                    />
                    <div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                        }}
                      >
                        <span
                          style={{
                            fontWeight: "600",
                            fontSize: "13px",
                            color: "#262626",
                          }}
                        >
                          {comment.author?.displayName || "משתמש"}
                        </span>
                        <span style={{ fontSize: "11px", color: "#8e8e8e" }}>
                          {formatTime(comment.createdAt)}
                        </span>
                      </div>
                      <span
                        style={{
                          fontSize: "14px",
                          color: "#262626",
                          display: "block",
                          marginTop: "2px",
                        }}
                      >
                        {comment.text}
                      </span>
                    </div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    {comment.author?._id === currentUserId && (
                      <button
                        onClick={() => handleDeleteComment(comment._id)}
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          color: "#ed4956",
                          padding: "4px",
                        }}
                        title="מחק תגובה"
                      >
                        <TrashIcon />
                      </button>
                    )}

                    <button
                      onClick={() => handleLikeComment(comment._id)}
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        color: "#8e8e8e",
                        gap: "2px",
                        marginTop: "4px",
                      }}
                    >
                      {comment.likes?.includes(currentUserId) ? (
                        <SmallHeartFilled />
                      ) : (
                        <SmallHeartOutline />
                      )}
                      {comment.likes?.length > 0 && (
                        <span style={{ fontSize: "11px" }}>
                          {comment.likes.length}
                        </span>
                      )}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <form
            onSubmit={handleAddComment}
            style={{
              padding: "15px",
              borderTop: "1px solid #efefef",
              display: "flex",
              gap: "10px",
              direction: "auto",
            }}
          >
            <input
              type="text"
              placeholder="הוסף תגובה..."
              value={newCommentText}
              onChange={(e) => setNewCommentText(e.target.value)}
              style={{
                flex: 1,
                padding: "10px 15px",
                borderRadius: "20px",
                border: "1px solid #dbdbdb",
                outline: "none",
                backgroundColor: "#fafafa",
              }}
            />
            <button
              type="submit"
              disabled={!newCommentText.trim()}
              style={{
                background: "none",
                border: "none",
                color: newCommentText.trim() ? "#0095f6" : "#8e8e8e",
                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              פרסם
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ShortCard;
