import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import PostCard from "../PostCard/PostCard";
import * as S from "./SavedPosts.styles";
import { translations } from "../../translations";

const SavedPosts = ({ currentLang, currentUser }) => {
  const [savedPosts, setSavedPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const t = translations[currentLang] || translations.en;
  const isHe = currentLang === "he";

  useEffect(() => {
    const fetchSaved = async () => {
      try {
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

  // unsave post
  const handleUnsave = async (postId) => {
    try {
      await api.post(`/posts/save/${postId}`);
      // deleting the unsave post without refreshing the page.
      setSavedPosts((prev) => prev.filter((post) => post._id !== postId));
    } catch (err) {
      alert(t.unsaveError);
    }
  };

  if (loading) {
    return (
      <div style={{ ...S.containerStyle, direction: isHe ? "rtl" : "ltr" }}>
        <p style={S.loadingStyle}>{t.gatheringCollection}</p>
      </div>
    );
  }

  return (
    <div style={{ ...S.containerStyle, direction: isHe ? "rtl" : "ltr" }}>
      <h2 style={S.titleStyle}>{t.savedTitle}</h2>

      {savedPosts.length === 0 ? (
        <div style={S.messageStyle}>
          {/* כותרת קטנה וטקסט משני כמו ב-Empty States מודרניים */}
          <p
            style={{
              margin: "0 0 8px 0",
              color: "#262626",
              fontWeight: "600",
              fontSize: "16px",
            }}
          >
            {t.noSavedPosts}
          </p>
          <p style={{ margin: "0" }}>{t.exploreInspiration}</p>
        </div>
      ) : (
        <div style={S.gridStyle}>
          {savedPosts.map((post) => (
            <PostCard
              key={post._id}
              currentLang={currentLang}
              post={post}
              currentUser={currentUser}
              onSave={handleUnsave} // if we want to unsave.
              onDelete={() => {}} // we dont delete in this page.
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedPosts;
