import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import axios from 'axios';
import '../styles/DiaryDetail.css';
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

  const [status, setStatus] = useState('');
  const [content, setContent] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (diaryId) {
      axios
        .get(`http://localhost:8080/api/diaries/${diaryId}`, {
          withCredentials: true,
        })
        .then((res) => {
          const entry = res.data.data || res.data;
          setStatus(entry.status || '');
          setContent(entry.textBody || '');
        })
        .catch((err) => {
          console.error('다이어리 불러오기 실패:', err);
        });
    }
  }, [diaryId]);

  const handleDelete = () => {
    axios
      .delete(`http://localhost:8080/api/diaries/${diaryId}`, {
        withCredentials: true,
      })
      .then(() => {
        alert('일지가 삭제되었습니다.');
        navigate('/diary');
      })
      .catch((err) => console.error('일지 삭제 실패:', err));
  };

  return (
    <div className="diary-detail-wrapper">
      {/* 헤더 */}
      <div className="detail-header">
        <button className="back-button" onClick={() => navigate('/diary')}>
          <FiArrowLeft />
        </button>
        <div className="diary-detail-date">{formatLocalDate(diaryDate)}</div>
      </div>

      {/* 본문 */}
      <main className="detail-wrapper">
        <div
          className={`diary-detail-status ${
            status === '좋음' ? 'good' : status === '보통' ? 'normal' : 'bad'
          }`}
        >
          {status}
        </div>

        <div className="diary-detail-content">{content}</div>

        <div className="diary-detail-buttons">
          <button
            className="btn-edit"
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
      </main>

      {/* 모달 */}
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
