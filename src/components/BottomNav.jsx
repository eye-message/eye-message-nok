import { Link, useLocation } from 'react-router-dom';
import '../styles/BottomNav.css';
import {
  MdNotifications,
  MdForum,
  MdAddCircle,
  MdCalendarToday,
  MdSettings,
} from 'react-icons/md';

const BottomNav = () => {
  const location = useLocation();

  const tabs = [
    { to: '/notification', icon: <MdNotifications size={24} /> }, // 알림
    { to: '/board', icon: <MdForum size={24} /> }, // 게시판
    // { to: '/add', icon: <MdAddCircle size={32} /> },
    { to: '/list', icon: <MdAddCircle size={32} /> }, // 추가
    { to: '/diary', icon: <MdCalendarToday size={24} /> }, //캘린더
    { to: '/settings', icon: <MdSettings size={24} /> }, //설정
  ];

  return (
    <nav className="bottom-nav">
      {tabs.map((tab) => (
        <Link
          key={tab.to}
          to={tab.to}
          className={`tab-item ${location.pathname === tab.to ? 'active' : ''}`}
        >
          {tab.icon}
          <span>{tab.label}</span>
        </Link>
      ))}
    </nav>
  );
};

export default BottomNav;
