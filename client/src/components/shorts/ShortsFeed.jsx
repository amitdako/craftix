import React, { useState, useEffect } from "react";
import api from "../../api/axios";
import ShortCard from "./ShortCard";
import * as S from "./Shorts.styles";
import { translations } from "../../translations";

const ShortsFeed = ({ currentLang, currentUser }) => {
  const [makes, setMakes] = useState([]);
  const [loading, setLoading] = useState(true);
  const t = translations[currentLang] || translations.en;

  const resolveUrl = (path) => {
    if (!path) return "";
    if (path.startsWith("http")) return path;
    return `http://localhost:5000${path.startsWith("/") ? path : `/${path}`}`;
  };

  useEffect(() => {
    const fetchMakes = async () => {
      try {
        setLoading(true);
        //searching the video
        const res = await api.get("/makes");
        setMakes(res.data);
      } catch (err) {
        console.error("Error fetching makes:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMakes();
  }, []);

  if (loading) {
    return (
      <div
        style={{
          ...S.feedContainer,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
        }}
      >
        {t.loading || "Loading Makes..."}
      </div>
    );
  }

  if (makes.length === 0) {
    return (
      <div
        style={{
          ...S.feedContainer,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#8e8e8e",
        }}
      >
        {t.noProjectsFound || "No Makes found yet."}
      </div>
    );
  }

  return (
    <div style={S.feedContainer} className="hide-scroll">
      <style>{`
        .hide-scroll::-webkit-scrollbar {
          display: none;
        }
      `}</style>

      {makes.map((make) => (
        <ShortCard
          key={make._id}
          makeId={make._id}
          videoUrl={resolveUrl(make.videoUrl)}
          authorName={make.author?.displayName || "User"}
          avatarUrl={resolveUrl(make.author?.profileImage)}
          description={make.description}
          likesCount={make.likes?.length || 0}
          commentsCount={make.comments?.length || 0}
          initialIsLiked={make.likes?.includes(
            currentUser?.id || currentUser?._id,
          )}
          currentUser={currentUser}
        />
      ))}
    </div>
  );
};

export default ShortsFeed;
