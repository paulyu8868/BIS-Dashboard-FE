import React from "react";
import { useNavigate } from "react-router-dom";
import "./WelcomePage.css"; // 스타일링을 위한 CSS 파일

const WelcomePage = () => {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className="welcome-page">
      <header className="header">
        <div className="home-icon">
          {/* 여기에 실제 아이콘을 추가할 수도 있습니다 */}
          <span>🏠</span>
        </div>
        <h1>군산시 버스정보시스템</h1>
      </header>
      <div className="button-container">
        <button onClick={() => handleNavigation("/bis-status")}>
          BIS 현황판
        </button>
        <button onClick={() => handleNavigation("/simulator")}>
          시뮬레이터
        </button>
        <button onClick={() => handleNavigation("/route-details")}>
          노선 상세
        </button>
      </div>
    </div>
  );
};

export default WelcomePage;
