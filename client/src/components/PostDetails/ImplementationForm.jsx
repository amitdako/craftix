import React from "react";
import * as S from "./PostDetails.styles";

const ImplementationForm = ({ isOpen, value, onChange, onSubmit }) => {
  if (!isOpen) return null;

  return (
    <div
      style={{
        padding: "15px",
        backgroundColor: "#fff5f5",
        borderTop: "1px solid #ffe3e3",
        textAlign: "right",
      }}
    >
      <h4
        style={{
          margin: "0 0 10px 0",
          fontSize: "0.95rem",
          color: "#ff4757",
          fontWeight: "bold",
        }}
      >
        שתפו את הביצוע שלכם לפרויקט זה! 🛠️
      </h4>
      <textarea
        autoFocus
        placeholder="איך יצא לכם לבנות את זה? שתפו תובנות או קשיים..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: "100%",
          padding: "12px",
          borderRadius: "8px",
          border: "1px solid #ddd",
          marginBottom: "10px",
          minHeight: "80px",
          outline: "none",
          fontSize: "0.9rem",
        }}
      />
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button
          onClick={onSubmit}
          style={{
            backgroundColor: "#28a745",
            color: "white",
            border: "none",
            padding: "8px 20px",
            borderRadius: "5px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          פרסם שיתוף
        </button>
      </div>
    </div>
  );
};

export default ImplementationForm;
