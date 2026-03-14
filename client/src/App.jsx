import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
  useNavigate,
} from "react-router-dom";
import Register from "./components/Register/Register";
import Login from "./components/Login/Login";
import Feed from "./components/Feed/Feed";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import CreatePost from "./components/CreatePost/CreatePost";
import SavedPosts from "./components/SavedPosts/SavedPosts";
import Profile from "./components/Profile/Profile";
import PostDetails from "./components/PostDetails/PostDetails"; // הייבוא החדש
import Navbar from "./components/Navbar/Navbar";
import logo from "./assets/logo.png";

function AppContent() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    try {
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (e) {
      return null;
    }
  });
  const [language, setLanguage] = useState(
    localStorage.getItem("appLang") || "en",
  );
  useEffect(() => {
    const dir = language === "he" ? "rtl" : "ltr";
    document.documentElement.dir = dir;
    document.documentElement.lang = language;
    //saving the choice
    localStorage.setItem("appLang", language);
  }, [language]);
  //function that will change the languages.
  const toggleLanguage = () => {
    setLanguage((prevLang) => (prevLang === "en" ? "he" : "en"));
  };
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  /**
   * Functional Update: מבטיח מיזוג תקין של הנתונים
   */
  const updateUser = (newUserData) => {
    setUser((prevUser) => {
      // אם אין משתמש, אין מה לעדכן
      if (!prevUser) return null;

      // יצירת האובייקט המעודכן על בסיס הגרסה האחרונה ב-State
      const updatedUser = { ...prevUser, ...newUserData };

      // עדכון ה-LocalStorage מיד לאחר העדכון הלוגי
      localStorage.setItem("user", JSON.stringify(updatedUser));

      return updatedUser;
    });
  };

  return (
    <div className="App" style={{ fontFamily: "Arial", padding: "20px" }}>
      <Navbar
        user={user}
        handleLogout={handleLogout}
        logo={logo}
        toggleLanguage={toggleLanguage}
        currentLang={language}
      />

      <Routes>
        <Route
          path="/login"
          element={<Login currentLang={language} setUser={setUser} />}
        />
        <Route path="/register" element={<Register currentLang={language} />} />

        <Route
          path="/saved-posts"
          element={
            <ProtectedRoute>
              <SavedPosts currentUser={user} currentLang={language} />
            </ProtectedRoute>
          }
        />

        {/* שימוש עקבי ב-updateUser */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile
                currentUser={user}
                currentLang={language}
                onUpdateUser={updateUser}
              />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/:id"
          element={
            <ProtectedRoute>
              <Profile
                currentUser={user}
                currentLang={language}
                onUpdateUser={updateUser}
              />
            </ProtectedRoute>
          }
        />

        <Route
          path="/post/:id"
          element={
            <ProtectedRoute>
              <PostDetails
                currentUser={user}
                currentLang={language}
                onUserUpdate={updateUser}
              />
            </ProtectedRoute>
          }
        />

        <Route
          path="/feed"
          element={
            <Feed
              currentLang={language}
              currentUser={user}
              onUserUpdate={updateUser}
            />
          }
        />

        <Route
          path="/create-post"
          element={
            <ProtectedRoute>
              <CreatePost currentLang={language} />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to="/feed" />} />
      </Routes>
    </div>
  );
}

// Styles - נשמרו בדיוק כפי שהיו
const avatarStyle = {
  width: "35px",
  height: "35px",
  borderRadius: "50%",
  backgroundColor: "#007bff",
  color: "white",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "14px",
  overflow: "hidden",
  fontWeight: "bold",
  border: "1px solid #ddd",
};
const imgStyle = { width: "100%", height: "100%", objectFit: "cover" };
const logoutButtonStyle = {
  backgroundColor: "#ff4d4d",
  color: "white",
  border: "none",
  padding: "6px 12px",
  borderRadius: "6px",
  cursor: "pointer",
  fontSize: "12px",
  fontWeight: "bold",
};
const linkStyle = {
  textDecoration: "none",
  color: "#007bff",
  fontWeight: "600",
  fontSize: "14px",
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
