import "../styles/desktopError.css";

const DesktopError = () => {
  return (
    <div className="desktop-error">
      <div className="desktop-error__card">
        <div className="desktop-error__icon">📱</div>

        <h1 className="desktop-error__title">모바일 전용 서비스</h1>

        <p className="desktop-error__desc">
          이 서비스는 모바일 환경에 최적화되어 있습니다.
          <br />
          스마트폰이나 태블릿으로 접속해주세요.
        </p>

        <div className="devtips">
          <h3 className="devtips__title">🛠️ 개발자 도구 사용법</h3>
          <p className="devtips__text">
            <strong>F12</strong> 키를 눌러 개발자 도구를 열고
            <br />
            <strong>모바일 아이콘</strong>을 클릭한 후
            <br />
            원하는 기기를 선택하세요
          </p>
        </div>

        <div className="chips">
          <span className="chip chip--ios">iPhone</span>
          <span className="chip chip--galaxy">Galaxy</span>
          <span className="chip chip--ipad">iPad</span>
        </div>
      </div>
    </div>
  );
};

export default DesktopError;
