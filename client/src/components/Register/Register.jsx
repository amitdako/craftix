import React, { useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";
import * as S from "./Register.styles";

const Register = () => {
  const countries = [
    "Israel",
    "Lithuania",
    "Uruguay",
    "United States",
    "Spain",
    "Italy",
    "Argentina",
    "Other",
  ];

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    displayName: "",
    country: "",
    birthDate: "",
  });

  const [message, setMessage] = useState({ text: "", isSuccess: false });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  //Submitting register form.
  const handleSubmit = async (e) => {
    e.preventDefault(); //don't refresh.
    setIsSubmitting(true);
    setMessage({ text: "", isSuccess: false });

    try {
      const response = await api.post("/users/register", formData);
      setMessage({
        text: `Welcome to Craftix, ${response.data.user.displayName}! You can now log in.`,
        isSuccess: true,
      });
    } catch (err) {
      setMessage({
        text: err.response?.data?.message || "Registration failed. Try again.",
        isSuccess: false,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={S.containerStyle}>
      <h2 style={S.titleStyle}>Join Craftix Community</h2>

      <form onSubmit={handleSubmit} style={S.formStyle}>
        <input
          type="text"
          name="fullName"
          placeholder="Full Name"
          onChange={handleChange}
          style={S.inputStyle}
          required
        />

        <input
          type="text"
          name="displayName"
          placeholder="Display Name (Profile Name)"
          onChange={handleChange}
          style={S.inputStyle}
        />

        <input
          type="email"
          name="email"
          placeholder="Email Address"
          onChange={handleChange}
          style={S.inputStyle}
          required
        />

        <div>
          <label style={S.labelStyle}>Date of Birth:</label>
          <input
            type="date"
            name="birthDate"
            onChange={handleChange}
            style={S.inputStyle}
            required
          />
        </div>

        <div>
          <label style={S.labelStyle}>Country:</label>
          <select
            name="country"
            value={formData.country}
            onChange={handleChange}
            style={S.inputStyle}
            required
          >
            <option value="" disabled>
              Select your country
            </option>
            {countries.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <input
          type="password"
          name="password"
          placeholder="Create Password"
          onChange={handleChange}
          style={S.inputStyle}
          required
        />

        <button
          type="submit"
          disabled={isSubmitting}
          style={S.buttonStyle(isSubmitting)}
        >
          {isSubmitting ? "Creating Account..." : "Sign Up"}
        </button>
      </form>

      {message.text && (
        <div style={S.messageStyle(message.isSuccess)}>{message.text}</div>
      )}

      <p
        style={{
          marginTop: "20px",
          textAlign: "center",
          fontSize: "14px",
          color: "#65676b",
        }}
      >
        Already a member?{" "}
        <Link to="/login" style={{ color: "#007bff", textDecoration: "none" }}>
          Log in
        </Link>
      </p>
    </div>
  );
};

export default Register;
