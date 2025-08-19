import "../styles/login.css";
import imageSrc from "../assets/image.png";
import { API_URL } from "../constants/config";

const Login = () => {
  const handleKakaoLogin = async () => {
    window.location.href = `${API_URL}/oauth2/authorization/kakao`;
  };

  return (
    <div className="login-container">
      <div className="mobile-container">
        <div className="login-header">
          <div className="logo-box">
            <div className="eye-img" />
            <div className="morse-img" />
          </div>

          <div className="slogan-box">
            <h1 className="welcome-text">Eye Message</h1>
            <span className="sub-text">
              와상환자와 보호자를 위한 의사소통 플랫폼
            </span>
          </div>
        </div>

        <div className="login-content">
          <button onClick={handleKakaoLogin} className="kakao-login-btn">
            <img className="kakao-icon" src={imageSrc} />
            {"카카오로 간편 시작하기"}
          </button>

          <div className="divider">
            <span>왜 Eye Message인가요?</span>
          </div>

          <div className="features">
            <div className="feature-item">보호자와 환자 간 실시간 소통</div>
            <div className="feature-item">간편한 회원가입 (30초 완료)</div>
            <div className="feature-item">24시간 언제든 이용 가능</div>
          </div>

          <div className="privacy-notice">
            계속 진행하시면{" "}
            <a href="#" onClick={(e) => e.preventDefault()}>
              서비스 이용약관
            </a>{" "}
            및<br />
            <a href="#" onClick={(e) => e.preventDefault()}>
              개인정보처리방침
            </a>
            에 동의하게 됩니다.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
