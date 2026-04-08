import React, { useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";
import * as S from "./Register.styles";
import { translations } from "../../translations";

const Register = ({ currentLang }) => {
  const t = translations[currentLang] || translations.en;
  const isHe = currentLang === "he";

  const countries = [
    { id: "Israel", label: t.israel },
    { id: "Lithuania", label: t.lithuania },
    { id: "Uruguay", label: t.uruguay },
    { id: "United States", label: t.usa },
    { id: "Spain", label: t.spain },
    { id: "Italy", label: t.italy },
    { id: "Argentina", label: t.argentina },
    { id: "Other", label: t.other },
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
  //submiting the form.
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ text: "", isSuccess: false });

    try {
      const response = await api.post("/users/register", formData);
      setMessage({
        text: `${t.regSuccess}${response.data.user.displayName}${t.regSuccessSuffix}`,
        isSuccess: true,
      });
    } catch (err) {
      setMessage({
        text: err.response?.data?.message || t.regFailed,
        isSuccess: false,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ ...S.containerStyle, direction: isHe ? "rtl" : "ltr" }}>
      <h2 style={S.titleStyle}>{t.joinTitle}</h2>

      <form onSubmit={handleSubmit} style={S.formStyle}>
        <input
          type="text"
          name="fullName"
          placeholder={t.fullName}
          onChange={handleChange}
          style={S.inputStyle}
          required
        />

        <input
          type="text"
          name="displayName"
          placeholder={t.displayName}
          onChange={handleChange}
          style={S.inputStyle}
        />

        <input
          type="email"
          name="email"
          placeholder={t.emailPlaceholder}
          onChange={handleChange}
          style={S.inputStyle}
          required
        />

        <div>
          <label style={S.labelStyle}>{t.birthDate}</label>
          <input
            type="date"
            name="birthDate"
            onChange={handleChange}
            style={S.inputStyle}
            required
          />
        </div>

        <div>
          <label style={S.labelStyle}>{t.country}</label>
          <select
            name="country"
            value={formData.country}
            onChange={handleChange}
            style={S.inputStyle}
            required
          >
            <option value="" disabled>
              {t.selectCountry}
            </option>
            {countries.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
        </div>

        <input
          type="password"
          name="password"
          placeholder={t.createPassword}
          onChange={handleChange}
          style={S.inputStyle}
          required
        />

        <button
          type="submit"
          disabled={isSubmitting}
          style={S.buttonStyle(isSubmitting)}
        >
          {isSubmitting ? t.creatingAccount : t.signUpBtn}
        </button>
      </form>

      {message.text && (
        <div style={S.messageStyle(message.isSuccess)}>{message.text}</div>
      )}

      <div
        style={{
          marginTop: "24px",
          textAlign: "center",
          fontSize: "14px",
          color: "#262626",
        }}
      >
        {t.alreadyMember}{" "}
        <Link
          to="/login"
          style={{
            color: "#0095f6",
            fontWeight: "600",
            textDecoration: "none",
          }}
        >
          {t.logIn}
        </Link>
      </div>
    </div>
  );
};

export default Register;
