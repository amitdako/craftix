import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/axios";
import * as S from "./EditPost.styles";
import Taginput from "../Taginput/Taginput";
import { translations } from "../../translations";

const EditPost = ({ currentLang }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [postType, setPostType] = useState("general");
  const [previewUrl, setPreviewUrl] = useState(null);
  const [mediaRemoved, setMediaRemoved] = useState(false); // לדעת אם המשתמש מחק את התמונה הקיימת

  const t = translations[currentLang] || translations.en;
  const isHe = currentLang === "he";

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
    { id: "Cooking", label: t.cooking || "Cooking" },
    { id: "Woodworking", label: t.woodworking || "Woodworking" },
    { id: "Painting", label: t.painting || "Painting" },
    { id: "Knitting", label: t.knitting || "Knitting" },
    { id: "Plumbing", label: t.plumbing || "Plumbing" },
    { id: "Electronics", label: t.electronics || "Electronics" },
    { id: "Other", label: t.other || "Other" },
  ];

  const getImageUrl = (path) => {
    if (!path) return "";
    if (path.startsWith("http")) return path;
    const baseUrl = "http://localhost:5000";
    return `${baseUrl}${path.startsWith("/") ? path : `/${path}`}`;
  };

  // שאיבת נתוני הפוסט הקיים בעת טעינת העמוד
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await api.get(`/posts/${id}`);
        const post = res.data;

        setPostType(post.postType || "general");
        setFormData({
          title: post.title || "",
          content: post.content || "",
          category: post.category || "Cooking",
          tools: post.projectDetails?.tools || [],
          materials: post.projectDetails?.materials || [],
          difficulty: post.projectDetails?.difficulty || 1,
          media: null, // מדיה חדשה תהיה כאן רק אם הועלתה
        });

        if (post.mediaUrl) {
          setPreviewUrl(getImageUrl(post.mediaUrl));
        }
      } catch (err) {
        setError(t.errorConnection || "Failed to load post data.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchPost();
  }, [id, t.errorConnection]);

  // ניקוי זיכרון של התצוגה המקדימה
  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith("blob:"))
        URL.revokeObjectURL(previewUrl);
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
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setMediaRemoved(false);
    }
  };

  const handleRemoveMedia = () => {
    setFormData({ ...formData, media: null });
    setMediaRemoved(true); // סימון לשרת למחוק את התמונה
    if (previewUrl && previewUrl.startsWith("blob:"))
      URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    const fileInput = document.getElementById("media-upload");
    if (fileInput) fileInput.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    const data = new FormData();
    data.append("postType", postType);
    data.append("category", formData.category);
    data.append("content", formData.content);

    // סימון לשרת אם התמונה נמחקה
    if (mediaRemoved) {
      data.append("removeMedia", "true");
    }

    if (formData.media) {
      data.append("media", formData.media);
    }

    if (postType === "project") {
      data.append("title", formData.title);
      const details = {
        difficulty: formData.difficulty,
        tools: formData.tools,
        materials: formData.materials,
      };
      data.append("projectDetails", JSON.stringify(details));
    }

    try {
      // שליחת בקשת עדכון (PUT)
      await api.put(`/posts/${id}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      navigate(-1); // חזרה לעמוד הקודם (לפוסט המורחב או לפיד) אחרי עריכה מוצלחת
    } catch (err) {
      setError(t.errorConnection || "An error occurred while saving.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div style={{ textAlign: "center", marginTop: "60px", color: "#8e8e8e" }}>
        {isHe ? "טוען..." : "Loading..."}
      </div>
    );
  }

  return (
    <div style={{ ...S.containerStyle, direction: isHe ? "rtl" : "ltr" }}>
      <h2 style={S.titleStyle}>{t.editPost || "Edit Post"}</h2>

      <div style={S.typeSelectorStyle}>
        <button
          type="button"
          onClick={() => setPostType("general")}
          style={S.typeButtonStyle(postType === "general")}
        >
          {t.general}
        </button>
        <button
          type="button"
          onClick={() => setPostType("project")}
          style={S.typeButtonStyle(postType === "project")}
        >
          {t.project}
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        {postType === "project" && (
          <>
            <label style={S.labelStyle}>{t.projectTitle}</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              placeholder={t.productPlaceholder}
              style={S.inputStyle}
              onChange={handleChange}
              required
            />
          </>
        )}

        <label style={S.labelStyle}>{t.category}</label>
        <select
          name="category"
          value={formData.category}
          style={S.inputStyle}
          onChange={handleChange}
        >
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.label}
            </option>
          ))}
        </select>

        {postType === "project" && (
          <>
            <label style={S.labelStyle}>{t.tools}</label>
            <Taginput
              tags={formData.tools}
              setTags={(newTags) =>
                setFormData({ ...formData, tools: newTags })
              }
              placeholder={t.toolsPlaceholder}
            />
            <label style={S.labelStyle}>{t.materials}</label>
            <Taginput
              tags={formData.materials}
              setTags={(newTags) =>
                setFormData({ ...formData, materials: newTags })
              }
              placeholder={t.materialsPlaceholder}
            />
            <label style={S.labelStyle}>{t.difficulty}</label>
            <select
              name="difficulty"
              value={formData.difficulty}
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
          {postType === "project" ? t.instructions : t.content}
        </label>
        <textarea
          name="content"
          value={formData.content}
          placeholder={t.storyPlaceholder}
          style={{ ...S.inputStyle, height: "120px", resize: "none" }}
          onChange={handleChange}
          required
        />

        <label style={S.labelStyle}>{t.uploadMedia}</label>

        {!previewUrl && (
          <label style={S.fileUploadLabelStyle}>
            <svg
              aria-label="Upload"
              fill="currentColor"
              height="24"
              width="24"
              viewBox="0 0 24 24"
            >
              <path d="M12 17.5a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11Zm0-1.5a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm9-12h-2.8l-1.5-1.5a1.5 1.5 0 0 0-1.1-.5h-3.2a1.5 1.5 0 0 0-1.1.5L9.8 4H7A3 3 0 0 0 4 7v10a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3ZM21 17a1.5 1.5 0 0 1-1.5 1.5H7A1.5 1.5 0 0 1 5.5 17V7A1.5 1.5 0 0 1 7 5.5h3.5l1.5-1.5h4l1.5 1.5H21A1.5 1.5 0 0 1 22.5 7v10A1.5 1.5 0 0 1 21 17Z"></path>
            </svg>
            <span
              style={{ color: "#0095f6", fontWeight: "600", fontSize: "14px" }}
            >
              {t.addImageVideo || "Change Image/Video"}
            </span>
            <input
              id="media-upload"
              type="file"
              accept="image/*,video/*"
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
          </label>
        )}

        {previewUrl && (
          <div style={S.previewContainerStyle}>
            <button
              type="button"
              onClick={handleRemoveMedia}
              style={{
                position: "absolute",
                top: "10px",
                insetInlineEnd: "10px",
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
                fontWeight: "600",
                fontSize: "12px",
                backdropFilter: "blur(4px)",
              }}
              title="Remove media"
            >
              ✕
            </button>
            <img src={previewUrl} alt="Preview" style={S.previewMediaStyle} />
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          style={S.submitButtonStyle(isSubmitting)}
        >
          {isSubmitting
            ? t.saving || "Saving..."
            : t.saveChanges || "Save Changes"}
        </button>
      </form>

      {error && (
        <p
          style={{
            color: "#ed4956",
            textAlign: "center",
            marginTop: "15px",
            fontSize: "14px",
          }}
        >
          {error}
        </p>
      )}
    </div>
  );
};

export default EditPost;
