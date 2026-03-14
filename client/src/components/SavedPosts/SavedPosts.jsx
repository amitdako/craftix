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

  //unsave post.
  const handleUnsave = async (postId) => {
    try {
      await api.post(`/posts/save/${postId}`);
      //deleting the unsave post without refreshing the page.
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
              onSave={handleUnsave} // if we want to unsave.
              onDelete={() => {}} //we dont delete in this page.
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedPosts;
