import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/CalendarDiary.css";

function CalendarDiary() {
  const location = useLocation();
  const navigate = useNavigate();

  // 선택한 날짜
  const selectedDate = location.state?.selectedDate
    ? new Date(location.state.selectedDate)
    : new Date();
  const mode = location.state?.mode || "create";
  const dateKey = selectedDate.toISOString().split("T")[0];

  // 상태값 목록
  const STATUS_OPTIONS = ["좋음", "보통", "나쁨"];

  const [status, setStatus] = useState("");
  const [content, setContent] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const [showStatusWarning, setShowStatusWarning] = useState(false);

  // 수정 모드일 때 기존 데이터 불러오기
  // [임시] 로컬스토리지 사용 (추후 DB 연동 시 삭제 예정)
  useEffect(() => {
    if (mode === "edit") {
      const diaries = JSON.parse(localStorage.getItem("diaries") || "{}");
      const entry = diaries[dateKey];
      if (entry) {
        setStatus(entry.status || "");
        setContent(entry.content || "");
      }
    }
  }, [mode, dateKey]);

  // 날짜 포맷
  const formatDate = (date) => {
    const options = { month: "2-digit", day: "2-digit", weekday: "short" };
    return date.toLocaleDateString("ko-KR", options).replace(/\./g, "");
  };

  // 일지 등록/수정
  // [임시] 로컬스토리지 사용 (추후 DB 연동 시 삭제 예정)
  const handleRegister = () => {
    if (!STATUS_OPTIONS.includes(status)) {
      setShowStatusWarning(true);
      return;
    }

    const diaries = JSON.parse(localStorage.getItem("diaries") || "{}");
    diaries[dateKey] = {
      date: dateKey,
      status,
      content,
    };
    localStorage.setItem("diaries", JSON.stringify(diaries));
    alert("일지가 저장되었습니다.");
    navigate("/calendar");
  };

  // 삭제 확인창 열기
  const handleDeleteConfirm = () => {
    setShowDeleteConfirm(true);
  };

  // 일지 삭제
  // [임시] 로컬스토리지 사용 (추후 DB 연동 시 삭제 예정)
  const handleDelete = () => {
    const diaries = JSON.parse(localStorage.getItem("diaries") || "{}");
    delete diaries[dateKey];
    localStorage.setItem("diaries", JSON.stringify(diaries));
    alert("일지가 삭제되었습니다.");
    navigate("/calendar");
  };

  return (
    <div className="diary-wrapper">
      {/* 날짜 표시 */}
      <div className="diary-date">{formatDate(selectedDate)}</div>

      <div className="diary-section">
        {/* 상태 선택 */}
        <div className="diary-label">오늘 상태는</div>
        <div className="status-options">
          {STATUS_OPTIONS.map((label) => {
            const badgeClass =
              label === "좋음"
                ? "good"
                : label === "보통"
                ? "normal"
                : "danger";
            return (
              <label key={label} className="status-option">
                <input
                  type="radio"
                  name="status"
                  value={label}
                  checked={status === label}
                  onChange={(e) => {
                    setStatus(e.target.value);
                    if (showStatusWarning) setShowStatusWarning(false);
                  }}
                />
                <span className={`status-badge ${badgeClass}`}>{label}</span>
              </label>
            );
          })}
        </div>

        {showStatusWarning && !STATUS_OPTIONS.includes(status) && (
          <div className="status-warning">
            상태를 선택해주세요. (좋음 / 보통 / 나쁨)
          </div>
        )}

        {/* 일지 내용 작성 */}
        <div className="diary-label">내용</div>
        <textarea
          className="diary-textarea"
          placeholder="내용을 입력하세요"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        ></textarea>

        <div className="diary-buttons">
          <button className="btn-register" onClick={handleRegister}>
            {mode === "edit" ? "수정" : "등록"}
          </button>
          {mode === "edit" && (
            <button className="btn-delete" onClick={handleDeleteConfirm}>
              삭제
            </button>
          )}
        </div>
      </div>

      {showDeleteConfirm && (
        <div className="modal-backdrop">
          <div className="modal">
            <p>정말 삭제하시겠습니까?</p>
            <div className="modal-buttons">
              <button className="btn-yes" onClick={handleDelete}>
                예
              </button>
              <button
                className="btn-no"
                onClick={() => setShowDeleteConfirm(false)}
              >
                아니오
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CalendarDiary;
