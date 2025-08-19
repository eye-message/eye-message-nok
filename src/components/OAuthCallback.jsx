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

  return <p>로그인 처리 중입니다...</p>;
}

export default OAuthCallback;
