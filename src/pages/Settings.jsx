import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/Settings.css";
import { parseLocalDate, formatLocalDate } from "../utils/date";
import Login from "./Login";

function Settings() {
  const [guardian, setGuardian] = useState(null);
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);

  const [editMode, setEditMode] = useState(null); // 'guardian' | 'patient' | null
  const [formData, setFormData] = useState({});

  const formatPhone = (value) => {
    if (!value) return "";
    value = value.replace(/[^0-9]/g, ""); // 숫자만 남김
    if (value.length <= 3) {
      return value;
    } else if (value.length <= 7) {
      return value.replace(/(\d{3})(\d{1,4})/, "$1-$2");
    } else {
      return value.replace(/(\d{3})(\d{4})(\d{0,4})/, "$1-$2-$3");
    }
  };

  // 현재 로그인 정보 가져오기
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/v1/auth/check/currentinfo`, {
        withCredentials: true,
      })
      .then((res) => {
        console.log("세션 정보:", res.data);
        setGuardian(res.data.data?.guardian || null);
        setPatient(res.data.data?.patient || null);
        console.log("guardian:", res.data.data?.guardian);
        console.log("patient:", res.data.data?.patient);
      })
      .catch((err) => {
        console.error("유저 정보 불러오기 실패:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (guardian && editMode === "guardian") {
      setFormData({
        name: guardian.name || "",
        phone: formatPhone(guardian.phone || ""),
        profileImageUrl: guardian.profileImageUrl || "",
        guardianBirth: guardian.guardianBirth
          ? formatLocalDate(parseLocalDate(guardian.guardianBirth))
          : "",
        syncPatientLoginId: guardian.syncPatientLoginId || false,
      });
    }
  }, [guardian, editMode]);

  // 로그아웃
  const handleLogout = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/auth/logout`,
        null,
        { withCredentials: true }
      );
      alert("로그아웃 되었습니다.");
      window.location.href = "/";
    } catch (err) {
      console.error("로그아웃 실패:", err);
      alert("로그아웃에 실패했습니다.");
    }
  };

  // 회원 탈퇴

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm("정말 회원 탈퇴하시겠습니까?");
    if (!confirmed) return;

    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/v1/auth/guardian`,
        { withCredentials: true }
      );
      alert("회원 탈퇴 완료");
      window.location.href = "/";
    } catch (err) {
      alert(
        "회원 탈퇴 실패: " + (err.response?.data?.message || "알 수 없는 오류")
      );
      console.error(err);
    }
  };

  // 수정 모달 열기
  const openEditModal = (type) => {
    setEditMode(type);

    if (type === "guardian" && guardian) {
      setFormData({
        name: guardian.name || "",
        phone: formatPhone(guardian.phone || ""),
        profileImageUrl: guardian.profileImageUrl || "",
        guardianBirth: guardian.guardianBirth
          ? formatLocalDate(parseLocalDate(guardian.guardianBirth))
          : "",
        syncPatientLoginId: guardian.syncPatientLoginId || false,
      });
    }
    if (type === "patient" && patient) {
      setFormData({
        loginId: patient.loginId || "",
        name: patient.name || "",
        patientBirth: patient.patientBirth
          ? formatLocalDate(parseLocalDate(patient.patientBirth))
          : "",
        newPassword1: "",
        newPassword2: "",
      });
    }
  };

  // 입력 변경
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // 수정 저장
  const handleSave = async () => {
    try {
      let payload = { ...formData };

      // 날짜는 항상 YYYY-MM-DD 형식으로 변환
      if (editMode === "guardian" && formData.guardianBirth) {
        payload.guardianBirth = formatLocalDate(
          parseLocalDate(formData.guardianBirth)
        );
      }
      if (editMode === "patient" && formData.patientBirth) {
        payload.patientBirth = formatLocalDate(
          parseLocalDate(formData.patientBirth)
        );
      }

      if (editMode === "guardian") {
        await axios.put(
          `${import.meta.env.VITE_API_URL}/api/v1/auth/guardian`,
          payload,
          { withCredentials: true }
        );
        alert("보호자 정보가 수정되었습니다.");
      } else if (editMode === "patient") {
        await axios.put(
          `${import.meta.env.VITE_API_URL}/api/v1/auth/patientinfo`,
          payload,
          { withCredentials: true }
        );
        alert("환자 정보가 수정되었습니다.");
      }
      setEditMode(null);
      window.location.reload(); // 수정 후 새로고침
    } catch (err) {
      alert("수정 실패: " + (err.response?.data?.message || "알 수 없는 오류"));
      console.error(err);
    }
  };

  if (loading) return <div>로딩중...</div>;

  return (
    <div className="settings-wrapper">
      {/* 상단 고정 헤더 */}
      <div className="settings-header">
        <div className="header-top">
          <div className="header-title">회원정보</div>
        </div>
      </div>

      {/* 본문 */}
      <div className="settings-page">
        <div className="profile-header">
          {guardian?.profileImageUrl ? (
            <img
              src={guardian.profileImageUrl}
              alt="프로필"
              className="profile-img"
            />
          ) : (
            <div className="profile-img-placeholder" aria-hidden="true"></div>
          )}
          <div className="profile-name">
            {guardian?.name ? `${guardian.name}님` : "이름 없음"}
          </div>
        </div>

        <div className="settings-section">
          {/* 보호자 수정 */}
          <div className="settings-item">
            <div className="label">보호자 프로필 수정</div>
            <button
              className="action-btn"
              onClick={() => openEditModal("guardian")}
            >
              ➔
            </button>
          </div>

          {editMode === "guardian" && (
            <div className="dropdown-edit show">
              <label htmlFor="guardian-name">이름</label>
              <input
                type="text"
                id="guardian-name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                readOnly
              />

              <label htmlFor="guardian-phone">전화번호</label>
              <input
                type="text"
                id="guardian-phone"
                name="phone"
                value={formData.phone || ""}
                onChange={(e) => {
                  const value = formatPhone(e.target.value);
                  setFormData((prev) => ({ ...prev, phone: value }));
                }}
              />

              <div className="dropdown-actions">
                <button onClick={handleSave}>수정</button>
                <button onClick={() => setEditMode(null)}>취소</button>
              </div>
            </div>
          )}

          {/* 환자 수정 */}
          <div className="settings-item">
            <div className="label">환자 프로필 수정</div>
            <button
              className="action-btn"
              onClick={() => openEditModal("patient")}
            >
              ➔
            </button>
          </div>
          {editMode === "patient" && (
            <div className="dropdown-edit show">
              <label htmlFor="loginId">아이디</label>
              <input
                type="text"
                id="loginId"
                name="loginId"
                value={formData.loginId}
                readOnly
              />

              <label htmlFor="name">이름</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />

              <label htmlFor="newPassword1">새 비밀번호</label>
              <input
                type="password"
                id="newPassword1"
                name="newPassword1"
                value={formData.newPassword1}
                onChange={handleChange}
              />

              <label htmlFor="newPassword2">새 비밀번호 확인</label>
              <input
                type="password"
                id="newPassword2"
                name="newPassword2"
                value={formData.newPassword2}
                onChange={handleChange}
              />

              <div className="dropdown-actions">
                <button onClick={handleSave}>수정</button>
                <button onClick={() => setEditMode(null)}>취소</button>
              </div>
            </div>
          )}

          {/* 로그아웃 */}
          <div className="settings-item">
            <div className="label">로그아웃</div>
            <button className="action-btn" onClick={handleLogout}>
              ➔
            </button>
          </div>

          {/* 회원탈퇴 */}
          <div className="settings-item">
            <div className="label">회원탈퇴</div>
            <button className="action-btn" onClick={handleDeleteAccount}>
              ➔
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;
