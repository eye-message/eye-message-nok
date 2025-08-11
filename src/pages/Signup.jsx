import { useState } from "react";
import "../styles/signup.css";
import "../styles/signup.css";

const Signup = () => {
  const [formData, setFormData] = useState({
    guardianName: "",
    guardianPhone: "",
    phoneVerified: false,
    patientPassword: "",
    confirmPassword: "",
    patientName: "",
  });

  const [validationErrors, setValidationErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
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
    setFormData((prev) => ({ ...prev, phoneVerified: true }));
    setValidationErrors((prev) => {
      const copy = { ...prev };
      delete copy.guardianPhone;
      return copy;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.phoneVerified) {
      setValidationErrors((prev) => ({
        ...prev,
        guardianPhone: "휴대폰 인증이 완료되지 않았습니다",
      }));
      return;
    }

    if (formData.patientPassword !== formData.confirmPassword) {
      setValidationErrors((prev) => ({
        ...prev,
        confirmPassword: "비밀번호가 일치하지 않습니다",
      }));
      return;
    }

    const phoneSuffix = formData.guardianPhone.slice(-4);
    const randomLetters = Math.random()
      .toString(36)
      .substring(2, 4)
      .toUpperCase();
    const generatedPatientId = `${phoneSuffix}${randomLetters}`;

    console.log("회원가입 데이터:", {
      ...formData,
      patientId: generatedPatientId,
    });
  };

  return (
    <div className="signup-container">
      <div className="mobile-container">
        <form className="form-container" onSubmit={handleSubmit}>
          {/* 보호자 정보 */}
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

          {/* 환자 정보 */}
          <div className="patient-section">
            <h2 className="section-title">환자 계정 정보</h2>

            {/* 자동 생성 환자 ID (표시만) */}
            <div className="form-group">
              <label htmlFor="patientId">환자 ID</label>
              <input
                type="text"
                id="patientId"
                value={
                  formData.guardianPhone.length >= 4
                    ? formData.guardianPhone.slice(-4) + "AA"
                    : ""
                }
                readOnly
              />
              <div className="input-helper">휴대폰 인증 후 자동 생성됩니다</div>
            </div>

            <div className="form-group">
              <label htmlFor="patientPassword">비밀번호</label>
              <input
                type="password"
                id="patientPassword"
                name="patientPassword"
                value={formData.patientPassword}
                onChange={handleInputChange}
                placeholder="비밀번호"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">비밀번호 확인</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="비밀번호 재입력"
                required
              />
              {validationErrors.confirmPassword && (
                <div className="input-error">
                  {validationErrors.confirmPassword}
                </div>
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
