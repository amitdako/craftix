import React, { useState, useEffect, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../../api/axios";
import PostCard from "../PostCard/PostCard";
import * as S from "./Profile.styles";

const Profile = ({ currentUser, onUpdateUser }) => {
  const { id } = useParams();
  const [profileUser, setProfileUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [postsLoading, setPostsLoading] = useState(false);
  const [profileSearch, setProfileSearch] = useState("");
  const fileInputRef = useRef(null);

  const targetId = id || currentUser?.id;
  const isMyProfile = !id || id === currentUser?.id;

  // 1. Fetch User Profile Info
  useEffect(() => {
    const fetchUserInfo = async () => {
      if (!targetId) return;
      try {
        setLoading(true);
        const userRes = await api.get(`/users/${targetId}`);
        setProfileUser(userRes.data);
      } catch (err) {
        console.error("Error loading user info:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUserInfo();
  }, [targetId]);

  // 2. Fetch User Posts with Debounce Search
  useEffect(() => {
    const fetchProfilePosts = async () => {
      if (!targetId) return;
      try {
        setPostsLoading(true);
        const postsRes = await api.get(
          `/posts/user/${targetId}?search=${profileSearch}`,
        );
        setPosts(postsRes.data);
      } catch (err) {
        console.error("Error loading profile posts:", err);
      } finally {
        setPostsLoading(false);
      }
    };

    const delayDebounceFn = setTimeout(() => {
      fetchProfilePosts();
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [targetId, profileSearch]);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("avatar", file);

    try {
      const response = await api.post("/users/upload-avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      onUpdateUser({ profileImage: response.data.profileImage });
      setProfileUser((prev) => ({
        ...prev,
        profileImage: response.data.profileImage,
      }));
      alert("Profile picture updated!");
    } catch (err) {
      alert("Failed to upload image.");
    }
  };

  const handleDelete = async (postId) => {
    if (window.confirm("Are you sure?")) {
      try {
        await api.delete(`/posts/${postId}`);
        setPosts(posts.filter((p) => p._id !== postId));
      } catch (err) {
        alert("Error deleting post.");
      }
    }
  };

  const handleSave = async (postId) => {
    try {
      const response = await api.post(`/posts/save/${postId}`);
      if (response.data?.savedPosts)
        onUpdateUser({ savedPosts: response.data.savedPosts });
    } catch (err) {
      console.error("Save error:", err);
    }
  };

  if (loading)
    return (
      <p style={{ textAlign: "center", marginTop: "50px" }}>
        Loading profile...
      </p>
    );

  return (
    <div style={S.containerStyle}>
      {/* Header */}
      <div style={S.headerStyle}>
        <div style={S.avatarContainerStyle}>
          {profileUser?.profileImage ? (
            <img
              src={`http://localhost:5000${profileUser.profileImage}`}
              alt="Profile"
              style={S.imgStyle}
              key={profileUser.profileImage}
            />
          ) : (
            <div style={S.fallbackAvatarStyle}>
              {profileUser?.displayName?.[0] || "U"}
            </div>
          )}
        </div>

        <div style={{ flex: 1 }}>
          <h2 style={{ margin: "0", color: "#1c1e21" }}>
            {profileUser?.displayName || profileUser?.fullName}
          </h2>
          <p style={{ color: "#65676b", margin: "5px 0" }}>
            {profileUser?.email}
          </p>

          {isMyProfile && (
            <div style={{ display: "flex", gap: "10px", marginTop: "15px" }}>
              <Link to="/create-post" style={S.actionButtonStyle}>
                ➕ New Project
              </Link>
              <button
                onClick={() => fileInputRef.current.click()}
                style={S.editButtonStyle}
              >
                📷 Change Photo
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                style={{ display: "none" }}
                accept="image/*"
              />
            </div>
          )}
        </div>
      </div>

      {/* Internal Search */}
      <div style={{ marginBottom: "30px" }}>
        <input
          type="text"
          placeholder={`🔍 Search in ${profileUser?.displayName || "this profile"}'s projects...`}
          value={profileSearch}
          onChange={(e) => setProfileSearch(e.target.value)}
          style={S.profileSearchInputStyle}
        />
      </div>

      <h3 style={S.sectionTitleStyle}>
        {isMyProfile
          ? "My Shared Projects"
          : `${profileUser?.displayName || "User"}'s Projects`}{" "}
        ({posts.length})
        {postsLoading && (
          <span style={{ fontSize: "12px", marginLeft: "10px", color: "#999" }}>
            Updating...
          </span>
        )}
      </h3>

      {posts.length === 0 ? (
        <div style={S.emptyStateStyle}>
          <p>
            {profileSearch
              ? "No results match your search."
              : "No projects shared yet."}
          </p>
          {isMyProfile && !profileSearch && (
            <Link
              to="/create-post"
              style={{ color: "#007bff", fontWeight: "bold" }}
            >
              Post your first project
            </Link>
          )}
        </div>
      ) : (
        <div style={{ display: "grid", gap: "25px" }}>
          {posts.map((post) => (
            <PostCard
              key={post._id}
              post={post}
              currentUser={currentUser}
              onDelete={handleDelete}
              onSave={handleSave}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Profile;
