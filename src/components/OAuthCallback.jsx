import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { API_URL } from "../constants/config";
import { useUserStore } from "../store/usUserStore";

function OAuthCallback() {
  const navigate = useNavigate();
  const location = useLocation();
  const setUser = useUserStore((state) => state.setUser);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const nextStep = params.get("nextstep");

    fetch(`${API_URL}/api/v1/auth/me`, {
      credentials: "include", // 세션 쿠키 포함
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setUser(data.data);
          console.log("oauth data", data);
          if (nextStep === "NEED_PATIENT_REGISTRATION") {
            navigate("/signup", { state: { user: data.data } });
          } else {
            navigate("/notification", { state: { user: data.data } });
          }
        } else {
          navigate("/login");
        }
      });
  }, [navigate]);

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f8f9fa",
      }}
    >
      <div
        style={{
          width: "40px",
          height: "40px",
          border: "4px solid #e3e3e3",
          borderTop: "4px solid #4285f4",
          borderRadius: "50%",
          animation: "spin 1s linear infinite",
        }}
      ></div>
      ~
      <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
    </div>
  );
}

export default OAuthCallback;
