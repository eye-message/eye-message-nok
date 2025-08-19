import { useState } from "react";
import "../styles/messageAddForm.css";
import axios from "axios";
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
      // 긴급도 태그 옵션 → 백엔드 status 값으로 매핑
      const urgencyMap = {
        emergency: "HIGH",
        normal: "MEDIUM",
        good: "LOW",
      };

      const payload = {
        status: urgencyMap[formData.urgency], // 상태
        alertCycle: formData.repeatInterval, // 반복 주기
        message: formData.content, // 메세지 내용
        displayOrder: Date.now(),
      };

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/template/guardian`,
        payload,
        { withCredentials: true }
      );

      alert("메세지가 성공적으로 추가되었습니다!");
      navigate("/list");
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
                <div className="tag-label">{type.label}</div>
                <div className="tag-description">{type.description}</div>
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
            />

            <div className="current-interval">
              <div className="current-interval-value">
                {formatTime(formData.repeatInterval)}
              </div>
              <div className="current-interval-label">반복 간격</div>
            </div>
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

          {selectedType && (
            <div className="template-suggestions">
              <div className="template-title">💡 추천 템플릿</div>
              {selectedType.id === "emergency" && (
                <>
                  <div
                    className="template-item"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        content:
                          "🚨 즉시 확인이 필요합니다. 안전을 위해 연락주세요!",
                      })
                    }
                  >
                    🚨 즉시 확인이 필요합니다. 안전을 위해 연락주세요!
                  </div>
                  <div
                    className="template-item"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        content: "⚠️ 긴급 상황입니다. 즉시 대응해주세요.",
                      })
                    }
                  >
                    ⚠️ 긴급 상황입니다. 즉시 대응해주세요.
                  </div>
                </>
              )}
              {selectedType.id === "normal" && (
                <>
                  <div
                    className="template-item"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        content: "💊 약 복용 시간입니다. 물과 함께 드세요.",
                      })
                    }
                  >
                    💊 약 복용 시간입니다. 물과 함께 드세요.
                  </div>
                  <div
                    className="template-item"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        content:
                          "🏥 건강 체크 시간이에요. 혈압을 측정해주세요.",
                      })
                    }
                  >
                    🏥 건강 체크 시간이에요. 혈압을 측정해주세요.
                  </div>
                </>
              )}
              {selectedType.id === "good" && (
                <>
                  <div
                    className="template-item"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        content:
                          "😊 오늘 하루도 건강하게 보내세요! 항상 응원하고 있어요.",
                      })
                    }
                  >
                    😊 오늘 하루도 건강하게 보내세요! 항상 응원하고 있어요.
                  </div>
                  <div
                    className="template-item"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        content:
                          "💝 컨디션이 좋아 보여서 기뻐요. 계속 잘 지내세요!",
                      })
                    }
                  >
                    💝 컨디션이 좋아 보여서 기뻐요. 계속 잘 지내세요!
                  </div>
                </>
              )}
            </div>
          )}
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
