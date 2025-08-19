import React, { useState, useEffect } from "react";
import DesktopError from "./DesktopError";

// 모바일 감지 및 데스크톱 차단 컴포넌트
const MobileWrapper = ({ children }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      // 모바일 감지 조건들
      const isMobileWidth = width <= 768;
      const isTouchDevice =
        "ontouchstart" in window || navigator.maxTouchPoints > 0;
      const isMobileUserAgent =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        );
      const isDeviceEmulation = width <= 768 && height <= 1024;

      const mobile =
        isMobileWidth ||
        (isTouchDevice && isMobileUserAgent) ||
        isDeviceEmulation;

      setIsMobile(mobile);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return !isMobile ? <DesktopError /> : children;
};

export default MobileWrapper;
