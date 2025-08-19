import React, { useState, useRef, useEffect } from "react";
import "../styles/messageList.css";

const MessageList = () => {
  // 샘플 메세지 데이터
  const [messages, setMessages] = useState([
    {
      id: 1,
      content: "오늘 약 드셨나요? 건강이 최우선이에요!",
      isEditing: false,
    },
    {
      id: 2,
      content: "물을 충분히 마시고 있는지 확인해주세요.",
      isEditing: false,
    },
    {
      id: 3,
      content: "운동은 가볍게 산책부터 시작해보세요.",
      isEditing: false,
    },
    {
      id: 4,
      content: "식사는 거르지 마시고 규칙적으로 해주세요.",
      isEditing: false,
    },
    {
      id: 5,
      content: "혈압 측정하셨나요? 기록도 잊지 마세요.",
      isEditing: false,
    },
  ]);

  const [selectedItems, setSelectedItems] = useState(new Set());
  const [activeItemId, setActiveItemId] = useState(null);
  const [draggedItem, setDraggedItem] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);
  const [editingContent, setEditingContent] = useState("");

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedItems(new Set(messages.map((m) => m.id)));
    } else {
      setSelectedItems(new Set());
    }
  };

  const handleSelectItem = (id, checked) => {
    const newSelected = new Set(selectedItems);
    if (checked) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
    }
    setSelectedItems(newSelected);
  };

  const handleDeleteSelected = () => {
    if (selectedItems.size === 0) return;

    if (
      confirm(`선택한 ${selectedItems.size}개의 메세지를 삭제하시겠습니까?`)
    ) {
      setMessages(messages.filter((m) => !selectedItems.has(m.id)));
      setSelectedItems(new Set());
    }
  };

  const handleDeleteItem = (id) => {
    if (confirm("이 메세지를 삭제하시겠습니까?")) {
      setMessages(messages.filter((m) => m.id !== id));
      setActiveItemId(null);
    }
  };

  const handleEditStart = (id, content) => {
    setMessages(
      messages.map((m) =>
        m.id === id ? { ...m, isEditing: true } : { ...m, isEditing: false }
      )
    );
    setEditingContent(content);
    setActiveItemId(null);
  };

  const handleEditSave = (id) => {
    if (editingContent.trim() === "") {
      alert("메세지 내용을 입력해주세요.");
      return;
    }

    setMessages(
      messages.map((m) =>
        m.id === id
          ? { ...m, content: editingContent.trim(), isEditing: false }
          : m
      )
    );
    setEditingContent("");
  };

  const handleEditCancel = (id) => {
    setMessages(
      messages.map((m) => (m.id === id ? { ...m, isEditing: false } : m))
    );
    setEditingContent("");
  };

  const handleDragStart = (e, index) => {
    setDraggedItem({ index, item: messages[index] });
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverIndex(index);
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();

    if (draggedItem && draggedItem.index !== dropIndex) {
      const newMessages = [...messages];
      const draggedMessage = newMessages.splice(draggedItem.index, 1)[0];
      newMessages.splice(dropIndex, 0, draggedMessage);
      setMessages(newMessages);
    }

    setDraggedItem(null);
    setDragOverIndex(null);
  };

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
    messages.length > 0 && selectedItems.size === messages.length;
  const hasSelection = selectedItems.size > 0;

  return (
    <>
      <div className="message-management-container">
        <div className="header-section">
          <div className="header-content">
            <h1 className="page-title">메세지 관리</h1>
            <button
              className="add-btn"
              onClick={() => alert("메세지 추가 페이지로 이동")}
            >
              + 메세지 추가
            </button>
          </div>

          {messages.length > 0 && (
            <div className="bulk-actions">
              <label className="select-all-wrapper">
                <input
                  type="checkbox"
                  className="checkbox"
                  checked={isAllSelected}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                />
                전체 선택
              </label>

              <button
                className={`delete-selected-btn ${
                  hasSelection ? "active" : ""
                }`}
                onClick={handleDeleteSelected}
                disabled={!hasSelection}
              >
                선택 삭제 ({selectedItems.size})
              </button>

              <span className="message-count">{messages.length}/20</span>
            </div>
          )}
        </div>

        <div className="messages-container">
          {messages.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">💬</div>
              <div className="empty-title">메세지가 없습니다</div>
              <div className="empty-description">
                환자에게 보여줄 메세지를
                <br />
                추가해보세요!
              </div>
            </div>
          ) : (
            messages.map((message, index) => (
              <div
                key={message.id}
                className={`message-item ${
                  draggedItem?.index === index ? "dragging" : ""
                } ${dragOverIndex === index ? "drag-over" : ""}`}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDrop={(e) => handleDrop(e, index)}
                onDragEnd={() => {
                  setDraggedItem(null);
                  setDragOverIndex(null);
                }}
              >
                <div className="message-content">
                  <div className="drag-handle">⋮⋮</div>

                  <input
                    type="checkbox"
                    className="message-checkbox"
                    checked={selectedItems.has(message.id)}
                    onChange={(e) =>
                      handleSelectItem(message.id, e.target.checked)
                    }
                  />

                  {message.isEditing ? (
                    <>
                      <input
                        type="text"
                        className="message-input"
                        value={editingContent}
                        onChange={(e) => setEditingContent(e.target.value)}
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleEditSave(message.id);
                          if (e.key === "Escape") handleEditCancel(message.id);
                        }}
                      />
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
                    </>
                  ) : (
                    <>
                      <div
                        className="message-text"
                        onClick={() =>
                          setActiveItemId(
                            activeItemId === message.id ? null : message.id
                          )
                        }
                      >
                        {message.content}
                      </div>

                      <div
                        className={`item-actions ${
                          activeItemId === message.id ? "active" : ""
                        }`}
                      >
                        <button
                          className="action-btn edit-action-btn"
                          onClick={() =>
                            handleEditStart(message.id, message.content)
                          }
                        >
                          수정
                        </button>
                        <button
                          className="action-btn delete-action-btn"
                          onClick={() => handleDeleteItem(message.id)}
                        >
                          삭제
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default MessageList;
