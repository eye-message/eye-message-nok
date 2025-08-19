import { useNavigate, useLocation } from "react-router-dom";
import { FiPlusCircle, FiArrowLeft } from "react-icons/fi";
import "../styles/Header.css";

function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  const isDiaryPage = location.pathname.startsWith("/calendar/diary");

  const handleBackClick = () => navigate(-1);

  return (
    <header className="header">
      <div className="header-left">
        {isDiaryPage && (
          <button className="header-back-button" onClick={handleBackClick}>
            <FiArrowLeft size={24} />
          </button>
        )}
      </div>
      <div className="header-right">{/* 추가 버튼 제거! */}</div>
    </header>
  );
}

export default Header;
