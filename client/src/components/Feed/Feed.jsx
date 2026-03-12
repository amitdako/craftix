import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import PostCard from "../PostCard/PostCard"; // שים לב לנתיב המעודכן
import * as S from "./Feed.styles";

const Feed = ({ currentUser, onUserUpdate }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userResults, setUserResults] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [searchParams] = useSearchParams();
  const searchTerm = searchParams.get("search") || "";
  const navigate = useNavigate();

  const categories = [
    "All",
    "Cooking",
    "Woodworking",
    "Painting",
    "Knitting",
    "Plumbing",
    "Electronics",
    "Other",
  ];

  const clearFilters = () => {
    setSelectedCategory("All");
    navigate("/feed");
  };

  const handleDelete = async (postId) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      try {
        await api.delete(`/posts/${postId}`);
        setPosts(posts.filter((p) => p._id !== postId));
      } catch (err) {
        alert("Delete failed.");
      }
    }
  };

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

  // Logic: Fetch Posts & Users with Debounce
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
    <div style={S.feedContainerStyle}>
      {/* Category Selection */}
      <div style={S.dropdownWrapperStyle}>
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          style={S.dropdownToggleStyle}
        >
          <span>
            {selectedCategory === "All"
              ? "🌐 Explore Categories"
              : `📁 ${selectedCategory}`}
          </span>
          <span>{isDropdownOpen ? "▲" : "▼"}</span>
        </button>

        {isDropdownOpen && (
          <div style={S.dropdownMenuStyle}>
            {categories.map((cat) => (
              <div
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  setIsDropdownOpen(false);
                }}
                style={S.categoryItemStyle}
              >
                {cat}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Search Header */}
      {searchTerm && (
        <div style={{ marginBottom: "20px" }}>
          <h3 style={{ fontSize: "16px", color: "#444" }}>
            Results for:{" "}
            <span style={{ color: "#007bff" }}>"{searchTerm}"</span>
          </h3>
        </div>
      )}

      {/* User Search Results (Horizontal) */}
      {searchTerm && userResults.length > 0 && (
        <div style={S.userResultsSectionStyle}>
          <h4 style={{ fontSize: "14px", color: "#666", marginBottom: "10px" }}>
            People
          </h4>
          <div style={S.userListHorizontalStyle}>
            {userResults.map((user) => (
              <div
                key={user._id}
                style={S.userCardStyle}
                onClick={() => navigate(`/profile/${user._id}`)}
              >
                <img
                  src={
                    user.profileImage
                      ? `http://localhost:5000${user.profileImage}`
                      : "https://via.placeholder.com/150"
                  }
                  alt={user.displayName}
                  style={S.userAvatarStyle}
                />
                <span style={S.userNameStyle}>{user.displayName}</span>
              </div>
            ))}
          </div>
          <hr style={{ border: "0.5px solid #eee", margin: "20px 0" }} />
        </div>
      )}

      {/* Feed Main Content */}
      <main style={{ position: "relative", zIndex: 1 }}>
        {loading ? (
          <p style={{ textAlign: "center", color: "#666" }}>
            Searching Craftix...
          </p>
        ) : posts.length > 0 ? (
          <div style={S.postsListStyle}>
            {posts.map((post) => (
              <PostCard
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
              No projects found for "<strong>{searchTerm}</strong>"
            </p>
            <button onClick={clearFilters} style={S.clearFilterButtonStyle}>
              Clear all filters
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default Feed;
