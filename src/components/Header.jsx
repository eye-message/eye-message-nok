import { useNavigate, useLocation } from "react-router-dom";
import { FiPlusCircle, FiArrowLeft } from "react-icons/fi";
import "../styles/Header.css";

function Header({ selectedDate }) {
  const navigate = useNavigate();
  const location = useLocation();

  const isDiaryPage = location.pathname.startsWith("/calendar/diary");

  const handleAddClick = () => {
    const baseDate = selectedDate || new Date();
    const dateKey = baseDate.toISOString().split("T")[0];
    // [임시] 로컬스토리지 사용 (추후 DB 연동 시 삭제 예정)
    const diaries = JSON.parse(localStorage.getItem("diaries") || "{}");
    const mode = diaries[dateKey] ? "edit" : "create";

    navigate("/calendar/diary", {
      state: { selectedDate: baseDate, mode },
    });
  };

  const handleBackClick = () => navigate(-1);

  return (
    <header className="header">
      {/* 좌측 영역 */}
      <div className="header-left">
        {isDiaryPage && (
          <button className="header-back-button" onClick={handleBackClick}>
            <FiArrowLeft size={24} />
          </button>
        )}
      </div>

      {/* 우측 영역 */}
      <div className="header-right">
        {!isDiaryPage && (
          <button className="header-add-button" onClick={handleAddClick}>
            <FiPlusCircle size={24} />
          </button>
        )}
      </div>
    </header>
  );
}

export default Header;
