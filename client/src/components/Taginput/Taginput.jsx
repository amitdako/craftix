import React, { useState } from "react";

const TagInput = ({ tags, setTags, placeholder, currentLang }) => {
  const [inputValue, setInputValue] = useState("");

  // if there is enter or , make it tag.
  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const value = inputValue.trim().replace(/,/g, "");
      if (value && !tags.includes(value)) {
        setTags([...tags, value]);
        setInputValue("");
      }
      // delete the last tag.
    } else if (e.key === "Backspace" && !inputValue && tags.length > 0) {
      setTags(tags.slice(0, -1));
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "8px",
        padding: "8px 12px",
        border: "1px solid #ddd",
        borderRadius: "8px",
        backgroundColor: "#fff",
        marginBottom: "15px",
        alignItems: "center",
        direction: currentLang === "he" ? "rtl" : "ltr",
      }}
    >
      {tags.map((tag, index) => (
        <span
          key={index}
          style={{
            backgroundColor: "#e7f3ff",
            color: "#1877f2",
            padding: "4px 10px",
            borderRadius: "15px",
            fontSize: "13px",
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
            gap: "5px",
          }}
        >
          {tag}
          <span
            onClick={() => setTags(tags.filter((_, i) => i !== index))}
            style={{ cursor: "pointer", color: "#666", fontSize: "16px" }}
          >
            ×
          </span>
        </span>
      ))}
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={tags.length === 0 ? placeholder : ""}
        style={{
          border: "none",
          outline: "none",
          flex: 1,
          minWidth: "120px",
          textAlign: "inherit",
        }}
      />
    </div>
  );
};

export default TagInput;
