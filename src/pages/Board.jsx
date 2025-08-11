import React, { useEffect, useState } from "react";
import "../styles/board.css";
import { BOARD_DATA } from "../constants/MOCK_DATA";

const Board = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("latest");
  const [showSearchBar, setShowSearchBar] = useState(false);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    setLoading(true);
    // API 호출 시뮬레이션
    setTimeout(() => {
      setPosts(BOARD_DATA);
      setLoading(false);
    }, 1000);
  };

  const formatTimeAgo = (dateString) => {
    const now = new Date();
    const posted = new Date(dateString);
    const diffInMinutes = Math.floor((now - posted) / (1000 * 60));

    if (diffInMinutes < 1) return "방금 전";
    if (diffInMinutes < 60) return `${diffInMinutes}분 전`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}시간 전`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}일 전`;

    return posted.toLocaleDateString("ko-KR", {
      month: "short",
      day: "numeric",
    });
  };

  const getCategoryColor = (category) => {
    const colors = {
      건강체크: "#FF6B6B",
      복약상담: "#4ECDC4",
      생활정보: "#45B7D1",
      이용문의: "#96CEB4",
      운동인증: "#FECA57",
      기타: "#DDA0DD",
    };
    return colors[category] || colors["기타"];
  };

  const filteredPosts = posts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedPosts = [...filteredPosts].sort((a, b) => {
    switch (sortBy) {
      case "latest":
        return new Date(b.createdAt) - new Date(a.createdAt);
      case "popular":
        return b.views + b.likes * 2 - (a.views + a.likes * 2);
      case "comments":
        return b.comments - a.comments;
      default:
        return 0;
    }
  });
  return (
    <div className="board-container">
      <div className="board-header">
        <div className="header-top">
          <h1 className="board-title">커뮤니티</h1>
          <div className="header-actions">
            <button
              className="header-btn"
              onClick={() => setShowSearchBar(!showSearchBar)}
            >
              🔍
            </button>
            <button
              className="write-btn"
              onClick={() => alert("글쓰기 페이지로 이동")}
            >
              글쓰기
            </button>
          </div>
        </div>

        <div className="search-section">
          <input
            type="text"
            className="search-input"
            placeholder="제목, 내용, 작성자로 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="filter-tabs">
          <button
            className={`filter-tab ${sortBy === "latest" ? "active" : ""}`}
            onClick={() => setSortBy("latest")}
          >
            최신순
          </button>
          <button
            className={`filter-tab ${sortBy === "popular" ? "active" : ""}`}
            onClick={() => setSortBy("popular")}
          >
            인기순
          </button>
          <button
            className={`filter-tab ${sortBy === "comments" ? "active" : ""}`}
            onClick={() => setSortBy("comments")}
          >
            댓글순
          </button>
        </div>
      </div>

      <div className="posts-container">
        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
          </div>
        ) : sortedPosts.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📝</div>
            <div className="empty-title">
              {searchQuery ? "검색 결과가 없습니다" : "게시글이 없습니다"}
            </div>
            <div className="empty-description">
              {searchQuery
                ? "다른 키워드로 검색해보세요"
                : "첫 번째 글을 작성해보세요!"}
            </div>
          </div>
        ) : (
          sortedPosts.map((post) => (
            <div
              key={post.id}
              className="post-item"
              onClick={() => alert(`게시글 ${post.id} 상세보기로 이동`)}
            >
              <div className="post-header">
                <span
                  className="category-tag"
                  style={{ backgroundColor: getCategoryColor(post.category) }}
                >
                  {post.category}
                </span>
                {post.isHot && <span className="hot-badge">HOT</span>}
              </div>

              <h3 className="post-title">{post.title}</h3>
              <p className="post-content">{post.content}</p>

              <div className="post-meta">
                <div className="post-author-time">
                  <span className="post-author">{post.author}</span>
                  <span>•</span>
                  <span>{formatTimeAgo(post.createdAt)}</span>
                </div>

                <div className="post-stats">
                  <div className="stat-item">👁️ {post.views}</div>
                  <div className="stat-item">💬 {post.comments}</div>
                  <div
                    className={`stat-item ${post.likes > 10 ? "active" : ""}`}
                  >
                    ❤️ {post.likes}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Board;
