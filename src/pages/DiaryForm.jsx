import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/DiaryForm.css';

function DiaryForm() {
  const location = useLocation();
  const navigate = useNavigate();

  const diaryDate = location.state?.selectedDate
    ? new Date(location.state.selectedDate)
    : new Date();
  const mode = location.state?.mode || 'create';
  const diaryId = location.state?.diaryId || null;
  const dateKey = diaryDate.toISOString().split('T')[0];

  const STATUS_OPTIONS = ['좋음', '보통', '나쁨'];

  const [status, setStatus] = useState('');
  const [content, setContent] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showStatusWarning, setShowStatusWarning] = useState(false);

  // edit 모드일 때 기존 데이터 불러오기
  useEffect(() => {
    if (mode === 'edit' && diaryId) {
      axios
        .get(`http://localhost:8080/api/diaries`)
        .then((res) => {
          console.log('다이어리 목록 응답:', res.data);

          const list = Array.isArray(res.data)
            ? res.data
            : Array.isArray(res.data.data)
            ? res.data.data
            : [];

          const entry = list.find((d) => d.diaryId === diaryId);
          if (entry) {
            setStatus(entry.status || '');
            setContent(entry.textBody || '');
          }
        })
        .catch((err) => console.error('기존 다이어리 불러오기 실패:', err));
    }
  }, [mode, diaryId]);

  const formatDate = (date) => {
    const options = { month: '2-digit', day: '2-digit', weekday: 'short' };
    return date.toLocaleDateString('ko-KR', options).replace(/\./g, '');
  };

  // 등록/수정
  const handleRegister = () => {
    if (!STATUS_OPTIONS.includes(status)) {
      setShowStatusWarning(true);
      return;
    }

    const payload = {
      diaryDate: dateKey,
      status,
      textBody: content,
    };

    if (mode === 'create') {
      axios
        .post('http://localhost:8080/api/diaries', payload)
        .then(() => {
          alert('일지가 저장되었습니다.');
          navigate('/diary');
        })
        .catch((err) => console.error('일지 등록 실패:', err));
    } else {
      axios
        .put(`http://localhost:8080/api/diaries/${diaryId}`, payload)
        .then(() => {
          alert('일지가 수정되었습니다.');
          navigate('/diary');
        })
        .catch((err) => console.error('일지 수정 실패:', err));
    }
  };

  // 삭제
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
      {/* 날짜 표시 */}
      <div className="diary-date">{formatDate(diaryDate)}</div>

      <div className="diary-section">
        {/* 상태 선택 */}
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
            {mode === 'edit' ? '수정' : '등록'}
          </button>
          {mode === 'edit' && (
            <button
              className="btn-delete"
              onClick={() => setShowDeleteConfirm(true)}
            >
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

export default DiaryForm;
