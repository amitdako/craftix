import React, { useState, useEffect, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../../api/axios";
import PostCard from "../PostCard/PostCard";
import { translations } from "../../translations";
import * as S from "./Profile.styles";
import Swal from "sweetalert2";

const Profile = ({ currentLang, currentUser, onUpdateUser }) => {
  const t = translations[currentLang] || translations.en;
  const isHe = currentLang === "he";
  const { id } = useParams();
  const [profileUser, setProfileUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [postsLoading, setPostsLoading] = useState(false);
  const [profileSearch, setProfileSearch] = useState("");
  const fileInputRef = useRef(null);

  const targetId = id || currentUser?.id || currentUser?._id;
  const isMyProfile = !id || id === (currentUser?.id || currentUser?._id);

  // פונקציית העזר לתמונות שהייתה חסרה בפרופיל
  const getImageUrl = (imagePath) => {
    if (!imagePath) return "";
    if (imagePath.startsWith("http")) return imagePath;
    const baseUrl = "http://localhost:5000";
    return `${baseUrl}${imagePath.startsWith("/") ? imagePath : `/${imagePath}`}`;
  };

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

      if (onUpdateUser)
        onUpdateUser({ profileImage: response.data.profileImage });
      setProfileUser((prev) => ({
        ...prev,
        profileImage: response.data.profileImage,
      }));
    } catch (err) {
      alert("Failed to upload image.");
    }
  };

  const handleDelete = async (postId) => {
    const result = await Swal.fire({
      title: t.deleteConfirmTitle || "Are you sure?",
      text: t.deleteConfirmText || "Deleting this post is permanent.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ed4956",
      cancelButtonColor: "#dbdbdb",
      confirmButtonText: t.deleteBtn || "Delete",
      cancelButtonText: t.cancelBtn || "Cancel",
      reverseButtons: isHe,
    });

    if (result.isConfirmed) {
      try {
        await api.delete(`/posts/${postId}`);
        setPosts(posts.filter((p) => p._id !== postId));
      } catch (err) {
        Swal.fire(t.errorDeleting || "Error", "", "error");
      }
    }
  };

  const handleSave = async (postId) => {
    try {
      const response = await api.post(`/posts/save/${postId}`);
      if (response.data?.savedPosts && onUpdateUser) {
        onUpdateUser({ savedPosts: response.data.savedPosts });
      }
    } catch (err) {
      console.error("Save error:", err);
    }
  };

  if (loading)
    return (
      <p style={{ textAlign: "center", marginTop: "50px", color: "#8e8e8e" }}>
        {isHe ? "טוען פרופיל..." : "Loading profile..."}
      </p>
    );

  return (
    <div style={{ ...S.containerStyle, direction: isHe ? "rtl" : "ltr" }}>
      {/* Header - Instagram Style */}
      <div style={S.headerStyle}>
        <div style={S.avatarRingStyle}>
          <div style={S.avatarContainerStyle}>
            {profileUser?.profileImage ? (
              <img
                src={getImageUrl(profileUser.profileImage)}
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
        </div>

        <div style={{ flex: 1 }}>
          <h2 style={S.profileNameStyle}>
            {profileUser?.displayName || profileUser?.fullName}
          </h2>
          <p style={S.profileEmailStyle}>{profileUser?.email}</p>

          {isMyProfile && (
            <div style={S.actionButtonsWrapper}>
              <Link to="/create-post" style={S.actionButtonStyle}>
                {t.newProject}
              </Link>
              <button
                onClick={() => fileInputRef.current.click()}
                style={S.editButtonStyle}
              >
                {t.changePhoto}
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
      <div style={S.searchWrapperStyle}>
        <input
          type="text"
          placeholder={`${t.searchPrefix} ${profileUser?.displayName || "user"}${t.searchSuffix}`}
          value={profileSearch}
          onChange={(e) => setProfileSearch(e.target.value)}
          style={S.profileSearchInputStyle}
        />
      </div>

      {/* Section Title */}
      <h3 style={S.sectionTitleStyle}>
        {isMyProfile
          ? `${t.myprojPrefix}${profileUser?.displayName || "User"}${t.myprojSuffix}`
          : `${profileUser?.displayName || "User"}${isHe ? " - פרויקטים" : "'s Projects"}`}
        <span
          style={{
            color: "#8e8e8e",
            marginInlineStart: "6px",
            fontSize: "14px",
            fontWeight: "400",
          }}
        >
          ({posts.length})
        </span>

        {postsLoading && (
          <span style={S.loadingTextStyle}>
            {isHe ? "מעדכן..." : "Updating..."}
          </span>
        )}
      </h3>

      {/* Posts List / Empty State */}
      {posts.length === 0 ? (
        <div style={S.emptyStateStyle}>
          <p>
            {profileSearch
              ? isHe
                ? "לא נמצאו פרויקטים תואמים לחיפוש."
                : "No results match your search."
              : isHe
                ? "טרם שותפו פרויקטים."
                : "No projects shared yet."}
          </p>
          {isMyProfile && !profileSearch && (
            <Link to="/create-post" style={S.emptyStateLinkStyle}>
              {isHe ? "פרסם את הפרויקט הראשון שלך" : "Post your first project"}
            </Link>
          )}
        </div>
      ) : (
        <div style={S.postsGridStyle}>
          {posts.map((post) => (
            <PostCard
              key={post._id}
              currentLang={currentLang} // הוסף כדי שהתרגומים יעבדו!
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
