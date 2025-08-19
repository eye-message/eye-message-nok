import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/messageList.css';

const MessageList = () => {
  const [messages, setMessages] = useState([]);
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [activeItemId, setActiveItemId] = useState(null);
  const [editingContent, setEditingContent] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/dev/session/getUserInfo`, {
        withCredentials: true,
      })
      .then((res) => {
        return axios.get(
          `${import.meta.env.VITE_API_URL}/api/v1/template/guardian/list`,
          { withCredentials: true }
        );
      })
      .then((res) => {
        const templates = res.data.data || [];
        const mapped = templates.map((item) => ({
          id: item.templateId,
          content: item.message,
          status: item.status,
          isEditing: false,
        }));
        setMessages(mapped);
      })
      .catch((err) => {
        console.error('메시지 불러오기 실패', err);
      });
  }, []);

  /** 전체 선택 */
  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedItems(new Set(messages.map((m) => m.id)));
    } else {
      setSelectedItems(new Set());
    }
  };

  /** 개별 선택 */
  const handleSelectItem = (id, checked) => {
    const newSelected = new Set(selectedItems);
    checked ? newSelected.add(id) : newSelected.delete(id);
    setSelectedItems(newSelected);
  };

  /** 선택 삭제 */
  const handleDeleteSelected = async () => {
    if (selectedItems.size === 0) return;
    if (!confirm(`선택한 ${selectedItems.size}개 삭제할까요?`)) return;

    try {
      for (let id of selectedItems) {
        await axios.delete(
          `${import.meta.env.VITE_API_URL}/api/v1/template/delete`,
          {
            data: { templateId: id },
            withCredentials: true,
          }
        );
      }
      setMessages(messages.filter((m) => !selectedItems.has(m.id)));
      setSelectedItems(new Set());
      alert('선택된 메시지가 삭제되었습니다.');
    } catch (err) {
      console.error(err);
    }
  };

  /** 단일 삭제 */
  const handleDeleteItem = async (id) => {
    if (!confirm('삭제할까요?')) return;

    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/v1/template/delete`,
        {
          data: { templateId: id },
          withCredentials: true,
        }
      );
      setMessages(messages.filter((m) => m.id !== id));
      setActiveItemId(null);
    } catch (err) {
      console.error(err);
    }
  };

  /** 수정 시작 */
  const handleEditStart = (id, content) => {
    setMessages(
      messages.map((m) =>
        m.id === id ? { ...m, isEditing: true } : { ...m, isEditing: false }
      )
    );
    setEditingContent(content);
    setActiveItemId(null);
  };

  /** 수정 저장 (PUT 요청) */
  const handleEditSave = async (id) => {
    if (!editingContent.trim()) {
      alert('내용 입력 필요!');
      return;
    }

    const target = messages.find((m) => m.id === id);
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/v1/template/guardian`,
        {
          templateId: id,
          status: target.status,
          alertCycle: target.alertCycle,
          message: editingContent.trim(),
        },
        { withCredentials: true }
      );

      setMessages(
        messages.map((m) =>
          m.id === id
            ? { ...m, content: editingContent.trim(), isEditing: false }
            : m
        )
      );
      setEditingContent('');
    } catch (err) {
      console.error(err);
    }
  };

  /** 수정 취소 */
  const handleEditCancel = (id) => {
    setMessages(
      messages.map((m) => (m.id === id ? { ...m, isEditing: false } : m))
    );
    setEditingContent('');
  };

  const isAllSelected =
    messages.length > 0 && selectedItems.size === messages.length;
  const hasSelection = selectedItems.size > 0;

  return (
    <div className="message-management-container">
      <div className="header-section">
        <div className="header-content">
          <h1 className="page-title">메세지 관리</h1>
          <button className="add-btn" onClick={() => navigate('/add')}>
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
              className={`delete-selected-btn ${hasSelection ? 'active' : ''}`}
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
              환자에게 보여줄 메세지를 <br /> 추가해보세요!
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <div key={message.id} className="message-item">
              <div className="message-content">
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
                        if (e.key === 'Enter') handleEditSave(message.id);
                        if (e.key === 'Escape') handleEditCancel(message.id);
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
                        activeItemId === message.id ? 'active' : ''
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
  );
};

export default MessageList;
