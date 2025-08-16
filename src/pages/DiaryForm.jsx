import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import axios from 'axios';
import '../styles/DiaryForm.css';
import { parseLocalDate, formatLocalDate } from '../utils/date';

function DiaryForm() {
  const location = useLocation();
  const navigate = useNavigate();

  const diaryDate = location.state?.selectedDate
    ? typeof location.state.selectedDate === 'string'
      ? parseLocalDate(location.state.selectedDate)
      : location.state.selectedDate
    : new Date();

  const mode = location.state?.mode || 'create';
  const diaryId = location.state?.diaryId || null;

  const STATUS_OPTIONS = ['좋음', '보통', '나쁨'];
  const [status, setStatus] = useState('');
  const [content, setContent] = useState('');
  const [initialStatus, setInitialStatus] = useState('');
  const [initialContent, setInitialContent] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (mode === 'edit' && diaryId) {
      axios
        .get(`http://localhost:8080/api/diaries/${diaryId}`)
        .then((res) => {
          const entry = res.data;
          setStatus(entry.status || '');
          setContent(entry.textBody || '');
          setInitialStatus(entry.status || '');
          setInitialContent(entry.textBody || '');
        })
        .catch((err) => console.error('일지 불러오기 실패:', err));
    }
  }, [mode, diaryId]);

  const handleSave = () => {
    const payload = {
      diaryId,
      diaryDate: formatLocalDate(diaryDate),
      status,
      textBody: content,
    };

    if (mode === 'edit') {
      axios
        .put(`http://localhost:8080/api/diaries/${diaryId}`, payload)
        .then(() => {
          alert('일지가 수정되었습니다.');
          navigate('/diary/detail', {
            state: { selectedDate: diaryDate, diaryId },
          });
        })
        .catch(() => alert('수정 실패'));
    } else {
      axios
        .post('http://localhost:8080/api/diaries', payload)
        .then(() => {
          alert('일지가 저장되었습니다.');
          navigate('/diary');
        })
        .catch(() => alert('저장 실패'));
    }
  };

  const handleCancel = () => {
    setStatus(initialStatus);
    setContent(initialContent);
  };

  return (
    <div className="diary-form-wrapper">
      {/* 헤더 */}
      <div className="form-header">
        <button className="back-button" onClick={() => navigate('/diary')}>
          <FiArrowLeft />
        </button>
        <div className="diary-date">{formatLocalDate(diaryDate)}</div>
      </div>

      {/* 본문 */}
      <div className="form-wrapper">
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
                  onChange={(e) => setStatus(e.target.value)}
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
          onChange={(e) => setContent(e.target.value)}
        />

        <div className="form-buttons">
          <button className="btn-save" onClick={handleSave}>
            {mode === 'edit' ? '수정 완료' : '등록'}
          </button>
          {mode === 'edit' && (
            <button className="btn-cancel" onClick={handleCancel}>
              취소
            </button>
          )}
        </div>
      </div>

      {/* 삭제 모달 */}
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

export default DiaryForm;
