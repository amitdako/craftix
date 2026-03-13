import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api/axios";
import { styles } from "./PostDetails.styles";

const PostDetails = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await api.get(`/posts/${id}`);
        setPost(res.data);
      } catch (err) {
        console.error("Error fetching post details:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  // פונקציית עזר לכתובות תמונה מהשרת
  const getImageUrl = (path) => {
    if (!path) return "";
    return path.startsWith("http") ? path : `http://localhost:5000${path}`;
  };

  // 1. מצב טעינה - מונע קריסה בזמן שהנתונים בדרך מהשרת
  if (loading) {
    return (
      <div
        style={{
          textAlign: "center",
          marginTop: "50px",
          fontSize: "1.2rem",
          color: "#666",
        }}
      >
        Loading Craftix project details... 🛠️
      </div>
    );
  }

  // 2. מקרה של שגיאה או פוסט שלא נמצא
  if (!post) {
    return (
      <div
        style={{
          textAlign: "center",
          marginTop: "50px",
          fontSize: "1.2rem",
          color: "#dc3545",
        }}
      >
        Post not found. 😕
      </div>
    );
  }

  // בדיקה אם מדובר בפוסט שיתוף ביצוע
  const isImplementation = post.postType === "implementation";

  return (
    <div style={styles.container}>
      {/* 3. Header: פרטי כותב וקטגוריה (מסודר ב-Flexbox) */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "15px",
          marginBottom: "25px",
          width: "100%",
        }}
      >
        {/* תמונת פרופיל / Avatar */}
        <div
          style={{
            width: "55px",
            height: "55px",
            borderRadius: "50%",
            backgroundColor: "#007bff",
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            fontWeight: "bold",
            border: "2px solid #eee",
            flexShrink: 0,
          }}
        >
          {post.author?.profileImage ? (
            <img
              src={getImageUrl(post.author.profileImage)}
              alt="Avatar"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            <span>{post.author?.displayName?.[0] || "U"}</span>
          )}
        </div>

        {/* שם ותאריך (שמאל) + קטגוריה (ימין) */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flex: 1,
          }}
        >
          <div>
            <div
              style={{ fontWeight: "bold", fontSize: "1.3rem", color: "#333" }}
            >
              {post.author?.displayName || "User"}
            </div>
            <div style={{ fontSize: "0.85rem", color: "#aaa" }}>
              {new Date(post.createdAt).toLocaleDateString()}
            </div>
          </div>

          {/* קטגוריה - Badge בצד ימין (מושך גם מ-parentPost אם זה שיתוף) */}
          {(post.category || post.parentPost?.category) && (
            <div
              style={{
                fontSize: "0.85rem",
                backgroundColor: "#f0f2f5",
                color: "#65676b",
                padding: "6px 14px",
                borderRadius: "20px",
                fontWeight: "600",
              }}
            >
              {post.category || post.parentPost?.category}
            </div>
          )}
        </div>
      </div>

      {/* 4. כותרת הפרויקט (גודל מותאם לסוג הפוסט) */}
      <h1
        style={{
          fontSize: isImplementation ? "1.8rem" : "2.8rem",
          color: "#222",
          marginTop: "0",
          marginBottom: "20px",
          lineHeight: "1.1",
          fontWeight: "800",
        }}
      >
        {isImplementation
          ? `Review: ${post.parentPost?.title || "Build Completion"}`
          : post.title}
      </h1>

      {/* 5. תמונה ראשית */}
      {post.mediaUrl && (
        <img
          src={getImageUrl(post.mediaUrl)}
          alt={post.title || "Post media"}
          style={{
            ...styles.image,
            borderRadius: "15px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          }}
        />
      )}

      {/* 6. פרטי פרויקט (כלים, מצרכים, קושי) - מוצג רק בפרויקטים */}
      {!isImplementation && post.projectDetails && (
        <div
          style={{
            backgroundColor: "#f4f7f6",
            padding: "20px",
            borderRadius: "12px",
            margin: "25px 0",
            borderLeft: "5px solid #ff4757",
          }}
        >
          <h3 style={{ marginTop: 0, color: "#2d3436", fontSize: "1.2rem" }}>
            Project Details
          </h3>
          <p style={{ margin: "8px 0", color: "#444" }}>
            <strong>🛠️ Tools:</strong>{" "}
            {post.projectDetails.tools?.join(", ") || "None"}
          </p>
          <p style={{ margin: "8px 0", color: "#444" }}>
            <strong>📦 Materials:</strong>{" "}
            {post.projectDetails.materials?.join(", ") || "None"}
          </p>
          <p style={{ margin: "8px 0", color: "#444" }}>
            <strong>⭐ Difficulty:</strong> {post.projectDetails.difficulty}/5
          </p>
        </div>
      )}

      {/* 7. תוכן הפוסט (הוראות / תיאור הביצוע) */}
      <div style={{ marginTop: "30px" }}>
        <h3
          style={{
            color: "#2d3436",
            fontSize: "1.5rem",
            borderBottom: "2px solid #eee",
            paddingBottom: "10px",
          }}
        >
          {isImplementation ? "Build Notes" : "Instructions & Description"}
        </h3>
        <p
          style={{
            ...styles.description,
            whiteSpace: "pre-wrap",
            fontSize: "1.1rem",
            lineHeight: "1.6",
            color: "#333",
          }}
        >
          {post.content}
        </p>
      </div>

      {/* 8. Community Section - מוצג רק בדף של פרויקט מקורי */}
      {!isImplementation && (
        <div
          style={{
            ...styles.communitySection,
            backgroundColor: "#fff",
            border: "2px dashed #ddd",
            borderRadius: "15px",
            padding: "30px",
            marginTop: "40px",
            textAlign: "center",
          }}
        >
          <h2 style={{ margin: "0 0 10px 0" }}>Community Showcase</h2>
          <p style={{ color: "#666", marginBottom: "20px" }}>
            Built this yourself? Show the community your version!
          </p>
          <button
            onClick={() => alert("Opening build form...")}
            style={{
              ...styles.madeThisButton,
              padding: "12px 30px",
              fontSize: "1.1rem",
            }}
            onMouseOver={(e) => (e.target.style.transform = "scale(1.05)")}
            onMouseOut={(e) => (e.target.style.transform = "scale(1)")}
          >
            🛠️ I Made This!
          </button>
        </div>
      )}
    </div>
  );
};

export default PostDetails;
