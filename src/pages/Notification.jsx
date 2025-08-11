import React, { useRef, useState } from "react";
import "../styles/notification.css";

const Notification = () => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "emergency",
      message: "즉시 확인이 필요합니다. 안전을 위해 연락주세요!",
      timestamp: "2024-08-04T14:30:00",
      isRead: false,
      isConfirmed: false,
    },
    {
      id: 2,
      type: "normal",
      message: "약 복용 시간입니다. 물과 함께 드세요.",
      timestamp: "2024-08-04T13:15:00",
      isRead: true,
      isConfirmed: true,
    },
    {
      id: 3,
      type: "good",
      message: "오늘 하루도 건강하게 보내세요! 항상 응원하고 있어요.",
      timestamp: "2024-08-04T10:45:00",
      isRead: true,
      isConfirmed: false,
    },
    {
      id: 4,
      type: "normal",
      message: "건강 체크 시간이에요. 혈압을 측정해주세요.",
      timestamp: "2024-08-04T09:20:00",
      isRead: false,
      isConfirmed: false,
    },
    {
      id: 5,
      type: "good",
      message: "컨디션이 좋아 보여서 기뻐요. 계속 잘 지내세요!",
      timestamp: "2024-08-04T08:00:00",
      isRead: true,
      isConfirmed: true,
    },
  ]);

  const [swipedItemId, setSwipedItemId] = useState(null);
  const [touchStart, setTouchStart] = useState(0);
  const [touchCurrent, setTouchCurrent] = useState(0);

  const getTypeIcon = (type) => {
    const icons = {
      emergency: "🚨",
      normal: "⚠️",
      good: "✅",
    };
    return icons[type] || "📱";
  };

  const [longPressId, setLongPressId] = useState(null);
  const longPressTimer = useRef(null);

  const handleTouchStart = (e, id) => {
    setTouchStart(e.touches[0].clientX);
    setSwipedItemId(null);
    // 롱프레스 500ms
    longPressTimer.current = window.setTimeout(() => {
      setLongPressId(id);
    }, 500);
  };

  const handleTouchMove = (e, id) => {
    if (!touchStart) return;
    setTouchCurrent(e.touches[0].clientX);
    // 움직이면 롱프레스 취소
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };

  const handleTouchEnd = (e, id) => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
    if (!touchStart || !touchCurrent) {
      setTouchStart(0);
      setTouchCurrent(0);
      return;
    }
    const diffX = touchStart - touchCurrent;
    if (diffX > 50) setSwipedItemId(id); // 왼쪽 스와이프 → 삭제 노출
    if (diffX < -50) setSwipedItemId(null); // 오른쪽 스와이프 → 원복
    setTouchStart(0);
    setTouchCurrent(0);
    // 스와이프 끝나면 힌트 숨김
    setLongPressId(null);
  };

  const handleConfirmToggle = (id) => {
    setNotifications((prev) =>
      prev.map((n) =>
        n.id === id ? { ...n, isConfirmed: !n.isConfirmed, isRead: true } : n
      )
    );
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const posted = new Date(timestamp);
    const diffInMinutes = Math.floor((now - posted) / (1000 * 60));

    if (diffInMinutes < 1) return "방금 전";
    if (diffInMinutes < 60) return `${diffInMinutes}분 전`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}시간 전`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}일 전`;

    return posted.toLocaleDateString("ko-KR");
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const handleDeleteNotification = (id) => {
    setNotifications(notifications.filter((notif) => notif.id !== id));
    setSwipedItemId(null);
  };

  const handleDeleteConfirmed = () => {
    const confirmedCount = notifications.filter(
      (notif) => notif.isConfirmed
    ).length;
    if (confirmedCount === 0) {
      alert("삭제할 확인된 메세지가 없습니다.");
      return;
    }

    if (confirm(`확인된 메세지 ${confirmedCount}개를 삭제하시겠습니까?`)) {
      setNotifications(notifications.filter((notif) => !notif.isConfirmed));
    }
  };

  const unreadCount = notifications.filter((notif) => !notif.isRead).length;
  const confirmedCount = notifications.filter(
    (notif) => notif.isConfirmed
  ).length;

  return (
    <div className="notification-container">
      <div className="notification-header">
        <div className="header-content">
          <h1 className="header-title">알림</h1>
          {unreadCount > 0 && (
            <span className="unread-badge">{unreadCount}</span>
          )}
        </div>
      </div>

      {notifications.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🔔</div>
          <div className="empty-title">알림이 없습니다</div>
          <div className="empty-description">
            새로운 메세지가 오면
            <br />
            여기에 표시됩니다
          </div>
        </div>
      ) : (
        <>
          <div className="notifications-list">
            {notifications.map((n) => (
              <div
                key={n.id}
                className="notification-item"
                onTouchStart={(e) => handleTouchStart(e, n.id)}
                onTouchMove={(e) => handleTouchMove(e, n.id)}
                onTouchEnd={(e) => handleTouchEnd(e, n.id)}
              >
                <div
                  className={`notification-row ${n.type} ${
                    !n.isRead ? "unread" : ""
                  } ${swipedItemId === n.id ? "swiped" : ""}`}
                >
                  {/* 왼쪽: 타입 태그 */}
                  <div className="type-pill" aria-label={n.type}>
                    {getTypeIcon(n.type)}
                  </div>

                  {/* 가운데: 메시지 + 시간(오른쪽 하단) */}
                  <div className="message-wrap">
                    <div className="message-text">{n.message}</div>
                  </div>

                  {/* 오른쪽: 버튼 + 시간 (여기에 시간 이동) */}
                  <div className="right-rail">
                    <button
                      className={`confirm-toggle ${n.isConfirmed ? "on" : ""}`}
                      onClick={() => handleConfirmToggle(n.id)}
                    >
                      {n.isConfirmed ? "확인함" : "확인"}
                    </button>

                    <div className="time">
                      <span>{formatTime(n.timestamp)}</span>
                      <span className="dot">•</span>
                      <span>{formatTimeAgo(n.timestamp)}</span>
                    </div>
                  </div>

                  {/* 롱프레스 힌트 (해당 아이템에만) */}
                  {longPressId === n.id && swipedItemId !== n.id && (
                    <div className="swipe-hint">← 밀어서 삭제</div>
                  )}
                </div>

                {swipedItemId === n.id && (
                  <button
                    className="swipe-delete-btn"
                    onClick={() => handleDeleteNotification(n.id)}
                  >
                    삭제
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="bottom-actions">
            <button
              className="delete-confirmed-btn"
              onClick={handleDeleteConfirmed}
              disabled={confirmedCount === 0}
            >
              확인한 메세지 삭제 ({confirmedCount}개)
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Notification;
