import React, { useState, useEffect, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../../api/axios";
import PostCard from "../PostCard/PostCard";
import { translations } from "../../translations";
import * as S from "./Profile.styles";
import Swal from "sweetalert2";

const Profile = ({ currentLang, currentUser, onUpdateUser }) => {
  const t = translations[currentLang];
  const { id } = useParams(); //taking the id from the url.
  const [profileUser, setProfileUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [postsLoading, setPostsLoading] = useState(false);
  const [profileSearch, setProfileSearch] = useState("");
  const fileInputRef = useRef(null); //make direct contact to Dom element.

  const targetId = id || currentUser?.id;
  const isMyProfile = !id || id === currentUser?.id;

  //Fetch User Profile Info
  useEffect(() => {
    const fetchUserInfo = async () => {
      if (!targetId) return; //if there is no user.
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

  // Fetch User Posts with Debounce Search
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
  //changing profile picture
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
    } catch (err) {
      alert("Failed to upload image.");
    }
  };
  //deleting post.
  const handleDelete = async (postId) => {
    const result = await Swal.fire({
      title: "Are you sure you want to continue?",
      text: "Deleting this post is permanent and cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ff4757",
      cancelButtonColor: "#65676b",
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    });
    //If he decided to delete
    if (result.isConfirmed) {
      try {
        await api.delete(`/posts/${postId}`);
        setPosts(posts.filter((p) => p._id !== postId));
      } catch (err) {
        Swal.fire("Error in deleting", "error");
      }
    }
  };
  //saving post.
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
              src={profileUser.profileImage}
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
                ➕ {t.newProject}
              </Link>
              <button
                onClick={() => fileInputRef.current.click()}
                style={S.editButtonStyle}
              >
                📷 {t.changePhoto}
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
          placeholder={`🔍 ${t.searchPrefix} ${profileUser?.displayName || "user"}${t.searchSuffix}`}
          value={profileSearch}
          onChange={(e) => setProfileSearch(e.target.value)}
          style={S.profileSearchInputStyle}
        />
      </div>
      <h3
        style={{
          ...S.sectionTitleStyle,
          display: "flex",
          alignItems: "center",
          gap: "5px",
        }}
      >
        {isMyProfile
          ? `${t.myprojPrefix}${profileUser?.displayName || "User"}${t.myprojSuffix}`
          : `${profileUser?.displayName || "User"}${currentLang === "en" ? "'s Projects" : " - פרויקטים"}`}

        <span dir="ltr">({posts.length})</span>

        {postsLoading && (
          <span
            style={{
              fontSize: "12px",
              marginInlineStart: "10px",
              color: "#999",
            }}
          >
            {currentLang === "en" ? "Updating..." : "מעדכן..."}
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
