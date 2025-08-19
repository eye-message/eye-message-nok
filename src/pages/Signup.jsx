import { useEffect, useState } from "react";
import "../styles/signup.css";
import "../styles/signup.css";
import { useLocation, useNavigate } from "react-router-dom";
import { API_URL } from "../constants/config";

const Signup = () => {
  const location = useLocation();
  const receivedData = location.state?.user;

  console.log("receivedData: ", receivedData);
  const [formData, setFormData] = useState({
    guardianName: receivedData.name,
    guardianPhone: "",
    phoneVerified: false,
    patientId: "",
    password1: "",
    password2: "",
    patientBirth: "",
    patientName: "",
  });

  const [validationErrors, setValidationErrors] = useState({});
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    let { name, value } = e.target;

    if (name === "guardianPhone") {
      let digits = value.replace(/\D/g, "");

      if (digits.length <= 3) {
        value = digits;
      } else if (digits.length <= 7) {
        value = digits.slice(0, 3) + "-" + digits.slice(3);
      } else {
        value =
          digits.slice(0, 3) +
          "-" +
          digits.slice(3, 7) +
          "-" +
          digits.slice(7, 11);
      }
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhoneVerify = () => {
    if (formData.guardianPhone.trim().length < 10) {
      setValidationErrors((prev) => ({
        ...prev,
        guardianPhone: "휴대폰 번호 형식이 올바르지 않습니다",
      }));
      return;
    }
    setFormData((prev) => ({
      ...prev,
      phoneVerified: true,
      patientId: prev.guardianPhone.replace(/-/g, ""),
    }));
    setValidationErrors((prev) => {
      const copy = { ...prev };
      delete copy.guardianPhone;
      return copy;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.phoneVerified) {
      setValidationErrors((prev) => ({
        ...prev,
        guardianPhone: "휴대폰 인증이 완료되지 않았습니다",
      }));
      return;
    }

    if (formData.password1 !== formData.password2) {
      setValidationErrors((prev) => ({
        ...prev,
        password2: "비밀번호가 일치하지 않습니다",
      }));
      return;
    }

    console.log("formData: ", formData);

    await fetch(`${API_URL}/api/v1/auth/patientinfo`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    setTimeout(() => {
      navigate("/notification"); // React Router 사용 시
      alert("회원가입 성공! 메세지 목록 페이지로 이동합니다.");
    }, 1000);
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/me`, {
          credentials: "include", // 세션 쿠키 포함
        });

        if (res.ok) {
          const data = await res.json();
        } else {
          alert("로그인이 필요합니다.");
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchUser();
  }, []);

  return (
    <div className="signup-container">
      <div className="mobile-container">
        <form className="form-container" onSubmit={handleSubmit}>
          <div className="guardian-section">
            <h2 className="section-title">보호자 정보</h2>

            <div className="form-group">
              <label htmlFor="guardianName">보호자 이름</label>
              <input
                type="text"
                id="guardianName"
                name="guardianName"
                value={formData.guardianName}
                onChange={handleInputChange}
                placeholder="보호자 성함 입력"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="guardianPhone">휴대폰 번호</label>
              <div className="phone-input-row">
                <input
                  type="tel"
                  maxLength={13}
                  id="guardianPhone"
                  name="guardianPhone"
                  value={formData.guardianPhone}
                  onChange={handleInputChange}
                  placeholder="숫자만 입력"
                  required
                />
                <button
                  type="button"
                  className="verify-btn"
                  onClick={handlePhoneVerify}
                >
                  인증하기
                </button>
              </div>
              {validationErrors.guardianPhone && (
                <div className="input-error">
                  {validationErrors.guardianPhone}
                </div>
              )}
              {formData.phoneVerified && (
                <div className="input-success">
                  휴대폰 인증이 완료되었습니다
                </div>
              )}
            </div>
          </div>

          <div className="patient-section">
            <h2 className="section-title">환자 계정 정보</h2>
            <div className="form-group">
              <label htmlFor="patientId">환자 ID</label>
              <input
                type="text"
                id="patientId"
                value={formData.patientId}
                readOnly
              />
              <div className="input-helper">휴대폰 인증 후 자동 생성됩니다</div>
            </div>

            <div className="form-group">
              <label htmlFor="password1">비밀번호</label>
              <input
                type="password"
                id="password1"
                name="password1"
                value={formData.password1}
                onChange={handleInputChange}
                placeholder="비밀번호"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password2">비밀번호 확인</label>
              <input
                type="password"
                id="password2"
                name="password2"
                value={formData.password2}
                onChange={handleInputChange}
                placeholder="비밀번호 재입력"
                required
              />
              {validationErrors.password2 && (
                <div className="input-error">{validationErrors.password2}</div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="patientName">환자 이름</label>
              <input
                type="text"
                id="patientName"
                name="patientName"
                value={formData.patientName}
                onChange={handleInputChange}
                placeholder="환자 성함 입력"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="patientBirth">환자 생년월일</label>
              <input
                type="date"
                id="patientBirth"
                name="patientBirth"
                value={formData.patientBirth}
                onChange={handleInputChange}
                placeholder="환자 생년월일 입력"
                required
              />
            </div>
          </div>

          <button type="submit" className="submit-btn">
            회원가입 완료하기
          </button>

          <div className="privacy-notice">
            회원가입 시{" "}
            <a href="#" onClick={(e) => e.preventDefault()}>
              개인정보처리방침
            </a>{" "}
            및{" "}
            <a href="#" onClick={(e) => e.preventDefault()}>
              서비스 이용약관
            </a>{" "}
            에 동의합니다.
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
