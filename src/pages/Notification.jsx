import React, { useEffect, useRef, useState } from "react";
import "../styles/notification.css";
import { MESSAGE_DATA } from "../constants/MOCK_DATA";

const Notification = () => {
  const [notifications, setNotifications] = useState([]);
  const [swipedItemId, setSwipedItemId] = useState(null);
  const [touchStart, setTouchStart] = useState(0);
  const [touchCurrent, setTouchCurrent] = useState(0);

  const [loading, setLoading] = useState(true);
  const [longPressId, setLongPressId] = useState(null);
  const longPressTimer = useRef(null);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      // 실제 API 호출로 교체
      // const response = await fetch('/api/notifications');
      // const data = await response.json();
      // setNotifications(data);

      // Mock 데이터 (서버 응답 시뮬레이션)
      setTimeout(() => {
        setNotifications(MESSAGE_DATA);
        setLoading(false);
      }, 800);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
      setLoading(false);
    }
  };

  const getTypeIcon = (type) => {
    const icons = {
      emergency: "🚨",
      normal: "⚠️",
      good: "✅",
    };
    return icons[type] || "📱";
  };

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
    setLongPressId(null);
  };

  const handleConfirmToggle = async (id) => {
    // API 호출
    // await fetch(`/api/notifications/${id}/confirm`, { method: 'PUT' });

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

  const handleDeleteConfirmed = async () => {
    const confirmedIds = notifications
      .filter((notif) => notif.isConfirmed)
      .map((n) => n.id);

    if (confirmedIds.length === 0) return;

    if (confirm(`확인된 메시지 ${confirmedIds.length}개를 삭제하시겠습니까?`)) {
      // API 호출
      // await fetch('/api/notifications/bulk-delete', {
      //   method: 'DELETE',
      //   body: JSON.stringify({ ids: confirmedIds })
      // });

      setNotifications(notifications.filter((notif) => !notif.isConfirmed));
    }
  };

  const unreadCount = notifications.filter((notif) => !notif.isRead).length;
  const confirmedCount = notifications.filter(
    (notif) => notif.isConfirmed
  ).length;

  return (
    <div className="notification-container">
      {/* 헤더 */}
      <div className="notification-header">
        <div className="header-top">
          <h1 className="header-title">알림</h1>
          {unreadCount > 0 && (
            <span className="unread-badge">{unreadCount}</span>
          )}
        </div>
        <p className="header-subtitle">오늘의 소식을 확인하세요</p>
      </div>

      {/* 메시지 영역 - 스크롤 가능 */}
      <div className="notification-content">
        {loading ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p className="loading-text">알림을 불러오는 중...</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🔔</div>
            <h3 className="empty-title">알림이 없습니다</h3>
            <p className="empty-description">
              새로운 소식이 도착하면
              <br />
              여기에 표시됩니다
            </p>
          </div>
        ) : (
          <div className="notifications-list">
            {notifications.map((n) => (
              <div
                key={n.id}
                className="notification-item-wrapper"
                onTouchStart={(e) => handleTouchStart(e, n.id)}
                onTouchMove={(e) => handleTouchMove(e, n.id)}
                onTouchEnd={(e) => handleTouchEnd(e, n.id)}
              >
                <div
                  className={`notification-item ${n.type} ${
                    !n.isRead ? "unread" : ""
                  } ${swipedItemId === n.id ? "swiped" : ""}`}
                >
                  <div className="notification-body">
                    {/* 아이콘 */}
                    <div className={"type-icon"}>{getTypeIcon(n.type)}</div>

                    {/* 컨텐츠 */}
                    <div className="notification-content-area">
                      <p className="notification-message">{n.message}</p>
                      <p className="notification-time">
                        {formatTimeAgo(n.timestamp)}
                      </p>
                    </div>

                    {/* 확인 버튼 */}
                    <button
                      onClick={() => handleConfirmToggle(n.id)}
                      className={`confirm-btn ${
                        n.isConfirmed ? "confirmed" : ""
                      }`}
                    >
                      {n.isConfirmed ? "확인됨" : "확인"}
                    </button>
                  </div>

                  {/* 롱프레스 힌트 */}
                  {longPressId === n.id && swipedItemId !== n.id && (
                    <div className="swipe-hint">← 밀어서 삭제</div>
                  )}
                </div>

                {/* 삭제 버튼 */}
                {swipedItemId === n.id && (
                  <button
                    onClick={() => handleDeleteNotification(n.id)}
                    className="delete-btn"
                  >
                    삭제
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 하단 고정 영역 */}
      <div className="notification-footer">
        <button
          onClick={handleDeleteConfirmed}
          disabled={confirmedCount === 0}
          className={`bulk-delete-btn ${
            confirmedCount === 0 ? "disabled" : ""
          }`}
        >
          확인한 메시지 {confirmedCount > 0 && `${confirmedCount}개`} 삭제
        </button>
      </div>
    </div>
  );
};

export default Notification;
