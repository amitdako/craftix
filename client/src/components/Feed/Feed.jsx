import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import api from "../../api/axios";
import PostCard from "../PostCard/PostCard";
import * as S from "./Feed.styles";
import { translations } from "../../translations";

const Feed = ({ currentLang, currentUser, onUserUpdate }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userResults, setUserResults] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [searchParams] = useSearchParams();
  const searchTerm = searchParams.get("search") || "";
  const navigate = useNavigate();

  const t = translations[currentLang] || translations.en;
  const isHe = currentLang === "he";

  const categories = [
    { id: "All", label: t.all },
    { id: "Cooking", label: t.cooking },
    { id: "Woodworking", label: t.woodworking },
    { id: "Painting", label: t.painting },
    { id: "Knitting", label: t.knitting },
    { id: "Plumbing", label: t.plumbing },
    { id: "Electronics", label: t.electronics },
    { id: "Other", label: t.other },
  ];

  // return to the general feed.
  const clearFilters = () => {
    setSelectedCategory("All");
    navigate("/feed");
  };

  //deleting post.
  const handleDelete = async (postId) => {
    const result = await Swal.fire({
      title: t.deleteConfirmTitle,
      text: t.deleteConfirmText,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ed4956",
      cancelButtonColor: "#dbdbdb",
      confirmButtonText: t.deleteBtn,
      cancelButtonText: t.cancelBtn,
      reverseButtons: isHe,
    });
    //If he decided to delete
    if (result.isConfirmed) {
      try {
        await api.delete(`/posts/${postId}`);
        setPosts(posts.filter((p) => p._id !== postId));
      } catch (err) {
        Swal.fire(t.errorDeleting, "", "error");
      }
    }
  };

  //Saving post.
  const handleSave = async (postId) => {
    try {
      const response = await api.post(`/posts/save/${postId}`);
      if (response.data?.savedPosts) {
        onUserUpdate({ savedPosts: response.data.savedPosts });
      }
    } catch (err) {
      console.error("Save error:", err);
    }
  };

  //Showing posts in the feed. The feed refreshes whenever the category or search term changes.
  useEffect(() => {
    const fetchEverything = async () => {
      try {
        setLoading(true);
        const postsPromise = api.get(
          `/posts?category=${selectedCategory}&search=${searchTerm}`,
        );

        let usersPromise = Promise.resolve({ data: [] });
        if (searchTerm.trim() !== "") {
          usersPromise = api.get(`/users/search?q=${searchTerm}`);
        } else {
          setUserResults([]);
        }

        const [postsRes, usersRes] = await Promise.all([
          postsPromise,
          usersPromise,
        ]);

        setPosts(postsRes.data);
        if (searchTerm.trim() !== "") setUserResults(usersRes.data);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    const delayDebounceFn = setTimeout(() => fetchEverything(), 400);
    return () => clearTimeout(delayDebounceFn);
  }, [selectedCategory, searchTerm]);

  return (
    <div style={S.feedContainerStyle} dir={isHe ? "rtl" : "ltr"}>
      {/* Category Selection */}
      <div style={S.dropdownWrapperStyle}>
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          style={S.dropdownToggleStyle}
        >
          <span>
            {selectedCategory === "All"
              ? t.exploreCategories
              : categories.find((c) => c.id === selectedCategory)?.label ||
                selectedCategory}
          </span>
          <span style={{ fontSize: "10px" }}>{isDropdownOpen ? "▲" : "▼"}</span>
        </button>

        {isDropdownOpen && (
          <div style={S.dropdownMenuStyle}>
            {categories.map((cat) => (
              <div
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id);
                  setIsDropdownOpen(false);
                }}
                style={S.categoryItemStyle}
              >
                {cat.label}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Search Header */}
      {searchTerm && (
        <div style={{ marginBottom: "20px", padding: "0 15px" }}>
          <h3 style={{ fontSize: "16px", color: "#262626", margin: 0 }}>
            {t.resultsFor}{" "}
            <span style={{ color: "#0095f6" }}>"{searchTerm}"</span>
          </h3>
        </div>
      )}

      {/* User Search Results */}
      {searchTerm && userResults.length > 0 && (
        <div style={S.userResultsSectionStyle}>
          <h4
            style={{
              fontSize: "14px",
              color: "#8e8e8e",
              marginBottom: "12px",
              margin: "0 0 12px 0",
            }}
          >
            {t.people}
          </h4>
          <div style={S.userListHorizontalStyle}>
            {userResults.map((user) => (
              <div
                key={user._id}
                style={S.userCardStyle}
                onClick={() => navigate(`/profile/${user._id}`)}
              >
                <div style={S.avatarRingStyle}>
                  <img
                    src={
                      user.profileImage
                        ? user.profileImage
                        : "https://via.placeholder.com/150"
                    }
                    alt={user.displayName}
                    style={S.userAvatarStyle}
                  />
                </div>
                <span style={S.userNameStyle}>{user.displayName}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Feed Main Content */}
      <main style={{ position: "relative", zIndex: 1 }}>
        {loading ? (
          <p
            style={{ textAlign: "center", color: "#8e8e8e", marginTop: "20px" }}
          >
            {t.searching}
          </p>
        ) : posts.length > 0 ? (
          <div style={S.postsListStyle}>
            {posts?.map((post) => (
              <PostCard
                currentLang={currentLang}
                key={post._id}
                post={post}
                currentUser={currentUser}
                onSave={handleSave}
                onDelete={handleDelete}
              />
            ))}
          </div>
        ) : (
          <div style={S.emptyStateStyle}>
            <p>
              {t.noProjectsFound} "<strong>{searchTerm}</strong>"
            </p>
            <button onClick={clearFilters} style={S.clearFilterButtonStyle}>
              {t.clearFilters}
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default Feed;
