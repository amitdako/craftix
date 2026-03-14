import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import * as S from "./CreatePost.styles";
import Taginput from "../Taginput/Taginput";

const CreatePost = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [postType, setPostType] = useState("general");
  const [previewUrl, setPreviewUrl] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "Cooking",
    tools: [],
    materials: [],
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

  //Deleting irelevnt date when we finish to use it.
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
      // url for showing the file.
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  //remove media from post before posting.
  const handleRemoveMedia = () => {
    setFormData({ ...formData, media: null });
    if (previewUrl) URL.revokeObjectURL(previewUrl); //cleaning memory.
    setPreviewUrl(null);
    const fileInput = document.querySelector('input[type="file"]'); //resting input button.
    if (fileInput) fileInput.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // don't refresh!
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
        tools: formData.tools,
        materials: formData.materials,
      };
      data.append("projectDetails", JSON.stringify(details));
    }
    //Saving the post information in the database.
    try {
      await api.post("/posts", data, {
        headers: { "Content-Type": "multipart/form-data" }, //format of sending information.
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
      <h2 style={S.titleStyle}>New post</h2>

      {/* Select type */}
      <div style={S.typeSelectorStyle}>
        <button
          type="button"
          onClick={() => setPostType("general")}
          style={S.typeButtonStyle(postType === "general")}
        >
          General
        </button>
        <button
          type="button"
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
              placeholder="What is your product?"
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
            <label style={S.labelStyle}>Tools</label>
            <Taginput
              tags={formData.tools}
              setTags={(newTags) =>
                setFormData({ ...formData, tools: newTags })
              }
              placeholder="Press Enter to add tools (Hammer, Drill...)"
            />
            <label style={S.labelStyle}>Materials</label>
            <Taginput
              tags={formData.materials}
              setTags={(newTags) =>
                setFormData({ ...formData, materials: newTags })
              }
              placeholder="Press Enter to add materials (Wood, Screws...)"
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

        {/*Image/video preview with remove button */}
        {previewUrl && (
          <div style={{ ...S.previewContainerStyle, position: "relative" }}>
            <button
              type="button"
              onClick={handleRemoveMedia}
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                zIndex: 10,
                backgroundColor: "rgba(0, 0, 0, 0.6)",
                color: "white",
                border: "none",
                borderRadius: "50%",
                width: "28px",
                height: "28px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "bold",
                fontSize: "18px",
              }}
              title="Remove media"
            >
              ×
            </button>
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
