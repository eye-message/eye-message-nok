import { useState } from "react";
import "../styles/messageAddForm.css";
import { useNavigate } from "react-router-dom";

const MessageAddForm = () => {
  const [formData, setFormData] = useState({
    urgency: "",
    repeatInterval: 300,
    content: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  // 긴급도 태그 옵션
  const urgencyTypes = [
    {
      id: "emergency",
      label: "긴급",
      color: "#FF4444",
      bgColor: "#FFE6E6",
      description: "즉시 확인이 필요한 중요한 메세지",
      defaultInterval: 30,
    },
    {
      id: "normal",
      label: "보통",
      color: "#FF8C00",
      bgColor: "#FFF3E6",
      description: "일반적인 알림 메세지",
      defaultInterval: 180,
    },
    {
      id: "good",
      label: "양호",
      color: "#4CAF50",
      bgColor: "#E8F5E8",
      description: "격려와 안부를 위한 메세지",
      defaultInterval: 300,
    },
  ];

  const handleUrgencySelect = (urgency) => {
    const selectedType = urgencyTypes.find((type) => type.id === urgency);
    setFormData({
      ...formData,
      urgency,
      repeatInterval: selectedType.defaultInterval,
    });
  };

  const handleIntervalChange = (value) => {
    const interval = Math.max(30, Math.min(600, parseInt(value) || 30));
    setFormData({ ...formData, repeatInterval: interval });
  };

  const formatTime = (seconds) => {
    if (seconds < 60) return `${seconds}초`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    if (remainingSeconds === 0) return `${minutes}분`;
    return `${minutes}분 ${remainingSeconds}초`;
  };

  const getSelectedUrgencyInfo = () => {
    return urgencyTypes.find((type) => type.id === formData.urgency);
  };

  const handleSubmit = async () => {
    if (!formData.urgency) {
      alert("긴급도를 선택해주세요.");
      return;
    }

    if (!formData.content.trim()) {
      alert("메세지 내용을 입력해주세요.");
      return;
    }

    setIsSubmitting(true);

    try {
      // API 호출 시뮬레이션
      await new Promise((resolve) => setTimeout(resolve, 1500));

      alert("메세지가 성공적으로 추가되었습니다!");
      navigate("/list"); // 목록으로 돌아가기
    } catch (error) {
      alert("메세지 추가에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedType = getSelectedUrgencyInfo();

  return (
    <div className="add-form-container">
      <div className="form-header">
        <div className="header-content">
          <button className="back-btn" onClick={() => window.history.back()}>
            ←
          </button>
          <h1 className="form-title">메세지 추가</h1>
          <div></div>
        </div>
      </div>

      <div className="form-content">
        {/* 긴급도 선택 섹션 */}
        <div className="section">
          <h2 className="section-title">🏷️ 메세지 긴급도</h2>

          <div className="urgency-tags">
            {urgencyTypes.map((type) => (
              <div
                key={type.id}
                className={`urgency-tag ${type.id} ${
                  formData.urgency === type.id ? "selected" : ""
                }`}
                onClick={() => handleUrgencySelect(type.id)}
              >
                {type.label}
              </div>
            ))}
          </div>

          {selectedType && (
            <div className={`selected-urgency-info ${selectedType.id}`}>
              <strong>{selectedType.label}</strong> 메세지로 설정되었습니다.
              <br />
              <small>{selectedType.description}</small>
            </div>
          )}
        </div>

        {/* 알람 반복 시간 섹션 */}
        {formData.urgency && (
          <div className="section">
            <h2 className="section-title">⏰ 알람 반복 간격</h2>

            <div className="interval-input-group">
              <input
                type="number"
                className="interval-input"
                min="30"
                max="600"
                value={formData.repeatInterval}
                onChange={(e) => handleIntervalChange(e.target.value)}
              />
              <span className="interval-unit">초마다</span>
            </div>

            <div className="interval-info">
              <span>30초</span>
              <span>10분</span>
            </div>

            <input
              type="range"
              className="interval-slider"
              min="30"
              max="600"
              step="30"
              value={formData.repeatInterval}
              onChange={(e) => handleIntervalChange(e.target.value)}
              resize="none"
            />
          </div>
        )}

        {/* 메세지 내용 섹션 */}
        <div className="section">
          <h2 className="section-title">💬 메세지 내용</h2>

          <textarea
            className="message-textarea"
            placeholder="환자에게 전달할 메세지를 작성해주세요..."
            value={formData.content}
            onChange={(e) =>
              setFormData({ ...formData, content: e.target.value })
            }
            maxLength={200}
          />
          <div className="char-counter">{formData.content.length}/200</div>

          {formData.content && (
            <div className="preview-card">
              <div className="preview-title">📱 환자 화면 미리보기</div>
              <div className="preview-message">{formData.content}</div>
              <div className="preview-meta">
                {selectedType?.label} • {formatTime(formData.repeatInterval)}{" "}
                반복
              </div>
            </div>
          )}
        </div>

        <button
          className="submit-btn"
          onClick={handleSubmit}
          disabled={
            isSubmitting || !formData.urgency || !formData.content.trim()
          }
        >
          {isSubmitting ? "메세지 추가 중..." : "메세지 추가 완료"}
        </button>
      </div>
    </div>
  );
};

export default MessageAddForm;
