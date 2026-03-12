import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import * as S from "./CreatePost.styles";

const CreatePost = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [postType, setPostType] = useState("general");
  const [previewUrl, setPreviewUrl] = useState(null); // State לתצוגה מקדימה

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "Cooking",
    tools: "",
    materials: "",
    difficulty: 1,
    media: null,
  });

  const categories = [
    "Cooking",
    "Woodworking",
    "Painting",
    "Knitting",
    "Plumbing",
    "Electronics",
    "Other",
  ];

  // ניקוי ה-URL הזמני כדי למנוע Memory Leaks
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, media: file });
      // יצירת URL זמני לתצוגה מקדימה
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    const data = new FormData();
    data.append("postType", postType);
    data.append("category", formData.category);
    data.append("content", formData.content);

    if (formData.media) data.append("media", formData.media);

    if (postType === "project") {
      data.append("title", formData.title);
      const details = {
        difficulty: formData.difficulty,
        tools: formData.tools
          ? formData.tools.split(",").map((t) => t.trim())
          : [],
        materials: formData.materials
          ? formData.materials.split(",").map((m) => m.trim())
          : [],
      };
      data.append("projectDetails", JSON.stringify(details));
    }

    try {
      await api.post("/posts", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      navigate("/feed");
    } catch (err) {
      setError("Something went wrong. Please check your connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={S.containerStyle}>
      <h2 style={S.titleStyle}>Share on Craftix</h2>

      {/* Type Selector */}
      <div style={S.typeSelectorStyle}>
        <button
          onClick={() => setPostType("general")}
          style={S.typeButtonStyle(postType === "general")}
        >
          General
        </button>
        <button
          onClick={() => setPostType("project")}
          style={S.typeButtonStyle(postType === "project")}
        >
          Project
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        {postType === "project" && (
          <>
            <label style={S.labelStyle}>Project Title</label>
            <input
              type="text"
              name="title"
              placeholder="What did you build?"
              style={S.inputStyle}
              onChange={handleChange}
              required
            />
          </>
        )}

        <label style={S.labelStyle}>Category</label>
        <select name="category" style={S.inputStyle} onChange={handleChange}>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        {postType === "project" && (
          <>
            <label style={S.labelStyle}>Tools (Comma separated)</label>
            <textarea
              name="tools"
              placeholder="Hammer, Drill, Saw..."
              style={S.inputStyle}
              onChange={handleChange}
            />
            <label style={S.labelStyle}>Materials (Comma separated)</label>
            <textarea
              name="materials"
              placeholder="Wood glue, Screws..."
              style={S.inputStyle}
              onChange={handleChange}
            />
            <label style={S.labelStyle}>Difficulty (1-5)</label>
            <select
              name="difficulty"
              style={S.inputStyle}
              onChange={handleChange}
            >
              {[1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </>
        )}

        <label style={S.labelStyle}>
          {postType === "project" ? "Instructions" : "Content"}
        </label>
        <textarea
          name="content"
          placeholder="Share your story..."
          style={{ ...S.inputStyle, height: "120px", resize: "none" }}
          onChange={handleChange}
          required
        />

        <label style={S.labelStyle}>Upload Image or Video</label>
        <input
          type="file"
          accept="image/*,video/*"
          style={S.inputStyle}
          onChange={handleFileChange}
        />

        {/* --- IMAGE/VIDEO PREVIEW AREA --- */}
        {previewUrl && (
          <div style={S.previewContainerStyle}>
            {formData.media?.type.startsWith("video") ? (
              <video src={previewUrl} style={S.previewMediaStyle} controls />
            ) : (
              <img src={previewUrl} alt="Preview" style={S.previewMediaStyle} />
            )}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          style={S.submitButtonStyle(isSubmitting)}
        >
          {isSubmitting ? "Posting..." : "Publish to Feed"}
        </button>
      </form>

      {error && (
        <p style={{ color: "#dc3545", textAlign: "center", marginTop: "15px" }}>
          {error}
        </p>
      )}
    </div>
  );
};

export default CreatePost;
