import React, { useState, useEffect } from "react";
import api from "../../api/axios";
import PostCard from "../PostCard/PostCard"; // נתיב מעודכן
import * as S from "./SavedPosts.styles";

const SavedPosts = ({ currentUser }) => {
  const [savedPosts, setSavedPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSaved = async () => {
      try {
        // וודא שהנתיב הזה תואם ל-Backend שלך
        const response = await api.get("/users/saved-posts");
        setSavedPosts(response.data);
      } catch (err) {
        console.error("Error fetching saved posts:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSaved();
  }, []);

  // טיפול בהסרה מהרשימה בזמן אמת (Optimistic UI)
  const handleUnsave = async (postId) => {
    try {
      await api.post(`/posts/save/${postId}`);
      // פילטר מקומי כדי שהפוסט "ייעלם" מהעין מיד בלי לחכות לריענון
      setSavedPosts((prev) => prev.filter((post) => post._id !== postId));
    } catch (err) {
      alert("Error removing post from saved.");
    }
  };

  if (loading) {
    return <p style={S.loadingStyle}>Gathering your collection...</p>;
  }

  return (
    <div style={S.containerStyle}>
      <h2 style={S.titleStyle}>My Saved Projects</h2>

      {savedPosts.length === 0 ? (
        <div style={S.messageStyle}>
          <p>You haven't saved any projects yet.</p>
          <p style={{ fontSize: "14px" }}>
            Go explore the feed and find your next DIY inspiration! 🛠️
          </p>
        </div>
      ) : (
        <div style={S.gridStyle}>
          {savedPosts.map((post) => (
            <PostCard
              key={post._id}
              post={post}
              currentUser={currentUser}
              onSave={handleUnsave} // כאן הכפתור פועל כ-Unsave
              onDelete={() => {}} // בדף שמורים בדרך כלל לא מוחקים פוסט מקורי
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedPosts;
