import React, { useState, useEffect } from 'react';
import './Simulator.css';

const SimulatorPage = () => {
  const [obuId, setObuId] = useState('');
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [map, setMap] = useState(null);
  const [busMarkers, setBusMarkers] = useState(new Map());
  const [updateInterval, setUpdateInterval] = useState(null);

  useEffect(() => {
    // Kakao 맵 API 로드 및 초기화
    window.kakao.maps.load(() => {
      const container = document.getElementById('map');
      const options = {
        center: new window.kakao.maps.LatLng(35.967, 126.736),
        level: 5,
      };
      const mapInstance = new window.kakao.maps.Map(container, options);
      setMap(mapInstance);
    });

    // Cleanup: component unmount 시 interval 정리
    return () => {
      if (updateInterval) {
        clearInterval(updateInterval);
      }
    };
  }, [updateInterval]);

  const startMonitoring = async () => {
    if (!obuId || !selectedRoute) {
      alert('버스 ID와 노선을 선택해주세요.');
      return;
    }

    // 기존 마커와 모니터링 중지
    if (updateInterval) {
      clearInterval(updateInterval);
    }

    await updateBusLocation(obuId);

    const interval = setInterval(() => {
      updateBusLocation(obuId);
    }, 3000);
    setUpdateInterval(interval);
  };

  const stopMonitoring = () => {
    if (updateInterval) {
      clearInterval(updateInterval);
    }
    busMarkers.forEach(marker => marker.setMap(null));
    setBusMarkers(new Map());
  };

  const updateBusLocation = async (obuId) => {
    try {
      const response = await fetch(`/api/simulator/bus-location?obuId=${obuId}&routeId=${selectedRoute}`);
      const data = await response.json();

      if (!response.ok) throw new Error('버스 위치 정보를 가져오는데 실패했습니다.');

      const { xcord, ycord } = data;
      if (isNaN(xcord) || isNaN(ycord)) {
        throw new Error('유효하지 않은 좌표값입니다.');
      }

      const position = new window.kakao.maps.LatLng(ycord, xcord);
      const marker = new window.kakao.maps.CustomOverlay({
        position: position,
        content: `<div class="bus-marker">${obuId}</div>`,
        map: map,
      });

      busMarkers.forEach(marker => marker.setMap(null));
      setBusMarkers(new Map([[obuId, marker]]));

      map.setCenter(position);
      const bounds = new window.kakao.maps.LatLngBounds();
      bounds.extend(position);
      map.setBounds(bounds);
    } catch (error) {
      console.error('버스 위치 업데이트 실패:', error);
      stopMonitoring();
      alert('버스 위치 정보를 가져오는데 실패했습니다: ' + error.message);
    }
  };

  return (
    <div>
      <div className="control-panel">
        <div className="input-section">
          <label htmlFor="obuId">버스 ID (OBU_ID)</label>
          <input
            type="text"
            id="obuId"
            placeholder="OBU_ID를 입력하세요"
            className="input-field"
            value={obuId}
            onChange={(e) => setObuId(e.target.value)}
          />
        </div>

        <div className="route-toggle">
          <div className="route-title">노선 선택</div>
          <div className="route-buttons">
            {[...Array(10).keys()].map((index) => (
              <label className="route-label" key={index}>
                <input
                  type="radio"
                  name="routeNumber"
                  value={index + 1}
                  onChange={() => setSelectedRoute(index + 1)}
                />
                <span className="route-btn">{index + 1}번</span>
              </label>
            ))}
          </div>
        </div>

        <div className="button-section">
          <button id="startOperation" className="primary-btn" onClick={startMonitoring}>운행시작</button>
          <button id="stopOperation" className="warning-btn" onClick={stopMonitoring}>운행종료</button>
        </div>
      </div>

      <div id="map"></div>
    </div>
  );
};

export default SimulatorPage;
