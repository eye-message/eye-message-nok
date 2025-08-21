import React, { useState, useRef, useEffect } from "react";
import "../styles/messageList.css";
import axios from "axios";
import { API_URL } from "../constants/config";
import { useNavigate } from "react-router-dom";
import { MESSAGES_DATA } from "../constants/MOCK_DATA";

const MessageList = () => {
  const [messages, setMessages] = useState([]);
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [activeItemId, setActiveItemId] = useState(null);
  const [editingContent, setEditingContent] = useState("");
  const [editingStatus, setEditingStatus] = useState("");
  const [editingCycle, setEditingCycle] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${API_URL}/api/v1/template/guardian/list`, {
        withCredentials: true,
      })
      .then((res) => {
        const templates = res.data.data || [];
        const mapped = templates.map((item) => ({
          id: item.templateId,
          status: item.status,
          content: item.message,
          alertCycle: item.alertCycle,
          isEditing: false,
        }));
        setMessages([...MESSAGES_DATA, ...mapped]);
      })
      .catch((err) => {
        console.error("메시지 불러오기 실패", err);
      });
  }, []);

  const getStatusInfo = (status) => {
    const statusMap = {
      HIGH: { icon: "🚨", label: "긴급", color: "high" },
      MEDIUM: { icon: "⚠️", label: "보통", color: "medium" },
      LOW: { icon: "💬", label: "일반", color: "low" },
    };
    return statusMap[status] || statusMap.LOW;
  };

  const formatCycle = (seconds) => {
    if (seconds < 60) return `${seconds}초`;

    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;

    if (mins < 60) {
      return secs > 0 ? `${mins}분 ${secs}초` : `${mins}분`;
    }

    const hours = Math.floor(mins / 60);
    const remMins = mins % 60;

    let result = `${hours}시간`;
    if (remMins > 0) result += ` ${remMins}분`;
    if (secs > 0) result += ` ${secs}초`;
    return result;
  };

  const filteredMessages = messages.filter(
    (m) => filterStatus === "ALL" || m.status === filterStatus
  );

  // 전체 선택/해제
  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedItems(new Set(messages.map((m) => m.id)));
    } else {
      setSelectedItems(new Set());
    }
  };

  // 개별 선택/해제
  const handleSelectItem = (id, checked) => {
    const newSelected = new Set(selectedItems);
    checked ? newSelected.add(id) : newSelected.delete(id);
    setSelectedItems(newSelected);
  };

  const handleDeleteSelected = async () => {
    if (selectedItems.size === 0) return;
    if (!confirm(`선택한 ${selectedItems.size}개 삭제할까요?`)) return;

    try {
      for (let id of selectedItems) {
        await axios.delete(`${API_URL}/api/v1/template/delete`, {
          data: { templateId: id },
          withCredentials: true,
        });
      }
      setMessages(messages.filter((m) => !selectedItems.has(m.id)));
      setSelectedItems(new Set());
      alert("선택된 메시지가 삭제되었습니다.");
    } catch (err) {
      console.error(err);
      alert("삭제 중 오류가 발생했습니다.");
    }
  };

  // 개별 삭제
  const handleDeleteItem = async (id) => {
    if (!confirm("삭제할까요?")) return;

    try {
      await axios.delete(`${API_URL}/api/v1/template/delete`, {
        data: { templateId: id },
        withCredentials: true,
      });
      setMessages(messages.filter((m) => m.id !== id));
      setActiveItemId(null);
    } catch (err) {
      console.error(err);
      alert("삭제 중 오류가 발생했습니다.");
    }
  };
  const handleEditStart = (message) => {
    setMessages(
      messages.map((m) =>
        m.id === message.id
          ? { ...m, isEditing: true }
          : { ...m, isEditing: false }
      )
    );
    setEditingContent(message.content);
    setEditingStatus(message.status);
    setEditingCycle(message.alertCycle);
    setActiveItemId(null);
  };

  // 편집 저장
  const handleEditSave = async (id) => {
    if (!editingContent.trim()) {
      alert("메시지 내용을 입력해주세요!");
      return;
    }

    try {
      const res = await axios.put(
        `${API_URL}/api/v1/template/guardian`,
        {
          templateId: id,
          status: editingStatus,
          alertCycle: parseInt(editingCycle),
          message: editingContent.trim(),
        },
        { withCredentials: true }
      );

      setMessages(
        messages.map((m) =>
          m.id === id
            ? {
                ...m,
                content: editingContent.trim(),
                status: editingStatus,
                alertCycle: parseInt(editingCycle),
                isEditing: false,
              }
            : m
        )
      );
      setEditingContent("");
      setEditingStatus("");
      setEditingCycle("");
    } catch (err) {
      console.error(err);
      alert("수정 중 오류가 발생했습니다.");
    }
  };

  const handleEditCancel = (id) => {
    setMessages(
      messages.map((m) => (m.id === id ? { ...m, isEditing: false } : m))
    );
    setEditingContent("");
    setEditingStatus("");
    setEditingCycle("");
  };

  // 외부 클릭 시 액션 버튼 숨김
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".message-item")) {
        setActiveItemId(null);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const isAllSelected =
    filteredMessages.length > 0 &&
    filteredMessages.every((m) => selectedItems.has(m.id));
  const hasSelection = selectedItems.size > 0;

  // 상태별 메시지 개수
  const statusCounts = {
    ALL: messages.length,
    HIGH: messages.filter((m) => m.status === "HIGH").length,
    MEDIUM: messages.filter((m) => m.status === "MEDIUM").length,
    LOW: messages.filter((m) => m.status === "LOW").length,
  };

  return (
    <div className="message-management-container">
      {/* 헤더 */}
      <div className="header-section">
        <div className="header-top">
          <h1 className="page-title">메시지 관리</h1>
          <button className="add-btn" onClick={() => navigate("/add")}>
            <span className="add-icon">+</span>
            <span>메시지 추가</span>
          </button>
        </div>

        {/* 필터 탭 */}
        <div className="filter-tags">
          {["ALL", "HIGH", "MEDIUM", "LOW"].map((status) => (
            <button
              key={status}
              className={`filter-tag ${
                filterStatus === status ? "active" : ""
              }`}
              onClick={() => setFilterStatus(status)}
            >
              {status === "ALL" ? (
                <>
                  전체 <span className="count">{statusCounts[status]}</span>
                </>
              ) : (
                <>
                  <span className="tab-icon">{getStatusInfo(status).icon}</span>
                  {getStatusInfo(status).label}
                  <span className="count">{statusCounts[status]}</span>
                </>
              )}
            </button>
          ))}
        </div>

        {/* 선택 액션 */}
        {filteredMessages.length > 0 && (
          <div className="bulk-actions">
            <label className="select-all-wrapper">
              <input
                type="checkbox"
                className="checkbox"
                checked={isAllSelected}
                onChange={(e) => handleSelectAll(e.target.checked)}
              />
              <span>전체 선택</span>
            </label>

            {hasSelection && (
              <button
                className="delete-selected-btn active"
                onClick={handleDeleteSelected}
              >
                <span className="delete-icon">🗑️</span>
                선택 삭제 ({selectedItems.size})
              </button>
            )}

            <span className="message-quota">
              <span className="current">{messages.length}</span>
              <span className="divider">/</span>
              <span className="max">20</span>
            </span>
          </div>
        )}
      </div>

      {/* 메시지 리스트 */}
      <div className="messages-container">
        {filteredMessages.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">💬</div>
            <div className="empty-title">
              {filterStatus === "ALL"
                ? "메시지가 없습니다"
                : `${getStatusInfo(filterStatus).label} 메시지가 없습니다`}
            </div>
            <div className="empty-description">
              환자에게 보여줄 메시지를
              <br />
              추가해보세요!
            </div>
            <button className="empty-add-btn" onClick={() => navigate("/add")}>
              메시지 추가하기
            </button>
          </div>
        ) : (
          <div className="messages-list">
            {filteredMessages.map((message) => {
              const statusInfo = getStatusInfo(message.status);
              return (
                <div
                  key={message.id}
                  className={`message-item ${
                    message.isEditing ? "editing" : ""
                  }`}
                >
                  {message.isEditing ? (
                    // 편집 모드
                    <div className="edit-mode">
                      <div className="edit-header">
                        <span className="edit-label">메시지 수정</span>
                      </div>

                      <textarea
                        className="message-edit-input"
                        value={editingContent}
                        onChange={(e) => setEditingContent(e.target.value)}
                        placeholder="메시지를 입력하세요"
                        autoFocus
                      />

                      <div className="edit-options">
                        <div className="option-group">
                          <label className="option-label">중요도</label>
                          <div className="status-select-group">
                            {["HIGH", "MEDIUM", "LOW"].map((status) => (
                              <button
                                key={status}
                                className={`status-option ${
                                  editingStatus === status ? "selected" : ""
                                }`}
                                onClick={() => setEditingStatus(status)}
                              >
                                <span>{getStatusInfo(status).icon}</span>
                                <span>{getStatusInfo(status).label}</span>
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="option-group">
                          <label className="option-label">알림 주기</label>
                          <div className="cycle-input-wrapper">
                            <input
                              type="number"
                              className="cycle-input"
                              value={editingCycle}
                              onChange={(e) => setEditingCycle(e.target.value)}
                              min="1"
                              max="1440"
                            />
                            <span className="cycle-unit">초</span>
                          </div>
                        </div>
                      </div>

                      <div className="edit-actions">
                        <button
                          className="edit-btn save-btn"
                          onClick={() => handleEditSave(message.id)}
                        >
                          저장
                        </button>
                        <button
                          className="edit-btn cancel-btn"
                          onClick={() => handleEditCancel(message.id)}
                        >
                          취소
                        </button>
                      </div>
                    </div>
                  ) : (
                    // 일반 모드
                    <div className="message-content">
                      <input
                        type="checkbox"
                        className="message-checkbox"
                        checked={selectedItems.has(message.id)}
                        onChange={(e) =>
                          handleSelectItem(message.id, e.target.checked)
                        }
                        onClick={(e) => e.stopPropagation()}
                      />

                      <div
                        className="message-body"
                        onClick={() =>
                          setActiveItemId(
                            activeItemId === message.id ? null : message.id
                          )
                        }
                      >
                        <div className="message-header">
                          <span
                            className={`status-badge compact ${statusInfo.color}`}
                          >
                            <span className="status-icon">
                              {statusInfo.icon}
                            </span>
                            <span className="status-label">
                              {statusInfo.label}
                            </span>
                          </span>
                          <span className="alert-cycle">
                            <span className="cycle-icon">🔔</span>
                            {formatCycle(message.alertCycle)}
                          </span>
                        </div>

                        <p className="message-text">{message.content}</p>
                      </div>

                      <div
                        className={`item-actions ${
                          activeItemId === message.id ? "active" : ""
                        }`}
                      >
                        <button
                          className="action-btn edit-action"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditStart(message);
                          }}
                        >
                          <span>✏️</span> 수정
                        </button>
                        <button
                          className="action-btn delete-action"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteItem(message.id);
                          }}
                        >
                          <span>🗑️</span> 삭제
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageList;
