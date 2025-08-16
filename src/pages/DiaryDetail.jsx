import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/DiaryForm.css';
import { parseLocalDate, formatLocalDate } from '../utils/date';

function DiaryDetail() {
  const location = useLocation();
  const navigate = useNavigate();

  const diaryDate = location.state?.selectedDate
    ? typeof location.state.selectedDate === 'string'
      ? parseLocalDate(location.state.selectedDate)
      : location.state.selectedDate
    : new Date();

  const diaryId = location.state?.diaryId || null;

  const STATUS_OPTIONS = ['좋음', '보통', '나쁨'];
  const [status, setStatus] = useState('');
  const [content, setContent] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (diaryId) {
      axios
        .get(`http://localhost:8080/api/diaries/${diaryId}`)
        .then((res) => {
          const entry = res.data;
          setStatus(entry.status || '');
          setContent(entry.textBody || '');
        })
        .catch((err) => console.error('다이어리 불러오기 실패:', err));
    }
  }, [diaryId]);

  const handleDelete = () => {
    axios
      .delete(`http://localhost:8080/api/diaries/${diaryId}`)
      .then(() => {
        alert('일지가 삭제되었습니다.');
        navigate('/diary');
      })
      .catch((err) => console.error('일지 삭제 실패:', err));
  };

  return (
    <div className="diary-wrapper">
      <div className="diary-date">{formatLocalDate(diaryDate)}</div>

      <div className="diary-section">
        <div className="diary-label">오늘 상태는</div>
        <div className="status-options">
          {STATUS_OPTIONS.map((label) => {
            const badgeClass =
              label === '좋음'
                ? 'good'
                : label === '보통'
                ? 'normal'
                : 'danger';
            return (
              <label key={label} className="status-option">
                <input
                  type="radio"
                  name="status"
                  value={label}
                  checked={status === label}
                  readOnly
                />
                <span className={`status-badge ${badgeClass}`}>{label}</span>
              </label>
            );
          })}
        </div>

        <div className="diary-label">내용</div>
        <textarea
          className="diary-textarea"
          value={content}
          readOnly
        ></textarea>

        <div className="diary-buttons">
          <button
            className="btn-save"
            onClick={() =>
              navigate('/diary/form', {
                state: { selectedDate: diaryDate, mode: 'edit', diaryId },
              })
            }
          >
            수정
          </button>
          <button
            className="btn-delete"
            onClick={() => setShowDeleteConfirm(true)}
          >
            삭제
          </button>
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

export default DiaryDetail;
