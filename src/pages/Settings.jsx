import { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/Settings.css';

function Settings() {
  const [userName, setUserName] = useState('');

  useEffect(() => {
    axios
      .post(
        'http://localhost:8080/dev/session/login?kakaoId=4396066259&name=kakao_user',
        null,
        { withCredentials: true }
      )
      .then(() => {
        console.log('세션 로그인 완료');
        return axios.get('http://localhost:8080/dev/session/getUserInfo', {
          withCredentials: true,
        });
      })
      .then((res) => {
        console.log('세션 정보', res.data);
        setUserName(res.data.user?.name || '');
      })
      .catch((err) => {
        console.error('오류 발생:', err);
      });
  }, []);

  return (
    <div className="settings-wrapper">
      {/* 상단 고정 헤더 */}
      <div className="settings-header">
        <div className="header-top">
          <div className="header-title">회원정보</div>
        </div>
      </div>

      {/* 본문 */}
      <div className="settings-page">
        <div className="profile-header">
          <div className="profile-img-placeholder" aria-hidden="true"></div>
          <div className="profile-name">
            {userName ? `${userName}님` : 'Loading...'}
          </div>
        </div>

        <div className="settings-section">
          <div className="settings-item">
            <div className="label">환자 정보</div>
            <div className="arrow" aria-hidden="true">
              ➔
            </div>
          </div>

          <div className="settings-item">
            <div className="label">로그아웃</div>
            <div className="arrow" aria-hidden="true">
              ➔
            </div>
          </div>

          <div className="settings-item">
            <div className="label">회원탈퇴</div>
            <div className="arrow" aria-hidden="true">
              ➔
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;
