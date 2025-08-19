import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import axios from "axios";
import "../styles/DiaryDetail.css";
import { parseLocalDate, formatLocalDate } from "../utils/date";
import { API_URL } from "../constants/config";

function DiaryDetail() {
  const location = useLocation();
  const navigate = useNavigate();

  const diaryDate = location.state?.selectedDate
    ? typeof location.state.selectedDate === "string"
      ? parseLocalDate(location.state.selectedDate)
      : location.state.selectedDate
    : new Date();

  const diaryId = location.state?.diaryId || null;

  const [status, setStatus] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    if (diaryId) {
      axios
        .get(`${API_URL}/api/diaries/${diaryId}`, {
          withCredentials: true,
        })
        .then((res) => {
          const entry = res.data.data || res.data;
          setStatus(entry.status || "");
          setContent(entry.textBody || "");
        })
        .catch((err) => {
          console.error("다이어리 불러오기 실패:", err);
        });
    }
  }, [diaryId]);

  const handleDelete = () => {
    axios
      .delete(`${API_URL}/api/diaries/${diaryId}`, {
        withCredentials: true,
      })
      .then(() => {
        alert("일지가 삭제되었습니다.");
        navigate("/diary");
      })
      .catch((err) => console.error("일지 삭제 실패:", err));
  };

  return (
    <div className="diary-detail-wrapper">
      {/* 헤더 */}
      <div className="detail-header">
        <button className="back-button" onClick={() => navigate("/diary")}>
          <FiArrowLeft />
        </button>
        <div className="diary-detail-date">{formatLocalDate(diaryDate)}</div>
      </div>

      {/* 본문 */}
      <main className="detail-wrapper">
        <div
          className={`diary-detail-status ${
            status === "좋음" ? "good" : status === "보통" ? "normal" : "bad"
          }`}
        >
          {status}
        </div>

        <div className="diary-detail-content">{content}</div>

        <div className="diary-detail-buttons">
          <button
            className="btn-edit"
            onClick={() =>
              navigate("/diary/form", {
                state: { selectedDate: diaryDate, mode: "edit", diaryId },
              })
            }
          >
            수정
          </button>
          <button
            className="btn-delete"
            onClick={() => {
              const confirmDelete = window.confirm("정말 삭제하시겠습니까?");
              if (confirmDelete) {
                handleDelete();
              }
            }}
          >
            삭제
          </button>
        </div>
      </main>
    </div>
  );
}

export default DiaryDetail;
