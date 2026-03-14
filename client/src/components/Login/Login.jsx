import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../api/axios";
import * as S from "./Login.styles";
import { translations } from "../../translations";

const Login = ({ setUser, currentLang }) => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const t = translations[currentLang] || translations.en;
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage("");

    try {
      const response = await api.post("/users/login", formData);
      const { token, user } = response.data;

      // updating this information in the system.
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      // Update global context
      setUser(user);

      navigate("/feed");
    } catch (err) {
      setMessage(err.response?.data?.message || t.loginFailed);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={S.containerStyle}>
      <h2 style={S.titleStyle}>{t.loginTitle}</h2>

      <form onSubmit={handleSubmit} style={S.formStyle}>
        <input
          type="email"
          name="email"
          placeholder={t.emailPlaceholder}
          onChange={handleChange}
          style={S.inputStyle}
          required
        />

        <input
          type="password"
          name="password"
          placeholder={t.passwordPlaceholder}
          onChange={handleChange}
          style={S.inputStyle}
          required
        />

        <button
          type="submit"
          disabled={isSubmitting}
          style={S.buttonStyle(isSubmitting)}
        >
          {isSubmitting ? t.loggingIn : t.loginBtn}
        </button>
      </form>

      {message && <div style={S.messageStyle}>{message}</div>}

      <p style={{ marginTop: "20px", fontSize: "14px", color: "#65676b" }}>
        {t.noAccount}{" "}
        <Link
          to="/register"
          style={{ color: "#007bff", textDecoration: "none" }}
        >
          {t.signUp}
        </Link>
      </p>
    </div>
  );
};

export default Login;
