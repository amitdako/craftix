import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../api/axios";
import * as S from "./Login.styles";

const Login = ({ setUser }) => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

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

      // Persistence
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      // Update global context
      setUser(user);

      navigate("/feed");
    } catch (err) {
      setMessage(
        err.response?.data?.message ||
          "Login failed. Please check your credentials.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={S.containerStyle}>
      <h2 style={S.titleStyle}>Login to Craftix</h2>

      <form onSubmit={handleSubmit} style={S.formStyle}>
        <input
          type="email"
          name="email"
          placeholder="Email Address"
          onChange={handleChange}
          style={S.inputStyle}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          style={S.inputStyle}
          required
        />

        <button
          type="submit"
          disabled={isSubmitting}
          style={S.buttonStyle(isSubmitting)}
        >
          {isSubmitting ? "Logging in..." : "Login"}
        </button>
      </form>

      {message && <div style={S.messageStyle}>{message}</div>}

      <p style={{ marginTop: "20px", fontSize: "14px", color: "#65676b" }}>
        Don't have an account?{" "}
        <Link
          to="/register"
          style={{ color: "#007bff", textDecoration: "none" }}
        >
          Sign up
        </Link>
      </p>
    </div>
  );
};

export default Login;
