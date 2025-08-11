import '../styles/Settings.css';

function Settings() {
  return (
    <div className="settings-page">
      <div className="profile-header">
        <div className="profile-img-placeholder"></div>
        <div className="profile-name">홍길동님</div>
      </div>

      <div className="settings-section">
        <div className="settings-item">
          <div className="label">닉네임</div>
          <div className="value">복숭아 당도 최고</div>
        </div>
        <div className="settings-item">
          <div className="label">계정</div>
          <div className="value email">abcd@kakao.com</div>
        </div>
        <div className="settings-item">
          <div className="label">로그아웃</div>
          <div className="arrow">➔</div>
        </div>
      </div>
    </div>
  );
}

export default Settings;
