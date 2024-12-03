import React, { useEffect, useState } from "react";
import { fetchRouteStops } from "../../utils/routeApi"; // Fetch 함수 분리
import "./RouteDetailModal.css";

const RouteDetailModal = ({ routeId, routeNumber, onClose }) => {
  const [stops, setStops] = useState([]);
  const [routeInfo, setRouteInfo] = useState({
    start: "",
    middle: "",
    end: "",
  });

  useEffect(() => {
    if (routeId) {
      fetchRouteStops(routeId).then((stopsData) => {
        console.log("soptsData:", stopsData);

        const start = stopsData[0]?.name || "";
        const end = stopsData[stopsData.length - 1]?.name || "";
        const middle = stopsData[Math.floor(stopsData.length / 2)]?.name || "";
        setRouteInfo({ start, middle, end });
        setStops(stopsData);
      });
    }
  }, [routeId]);

  const chunkedStops = [];
  for (let i = 0; i < stops.length; i += 8) {
    const stopGroup = stops.slice(i, i + 8);
    chunkedStops.push((i / 8) % 2 === 1 ? stopGroup.reverse() : stopGroup);
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-body">
          <div className="modal-header">
            {routeNumber}번 노선
            <button className="close-button" onClick={onClose}>
              닫기
            </button>
          </div>

          {/* 노선 정보 */}
          <div className="route-path-info">
            <span>{routeInfo.start}</span> &gt; <span>{routeInfo.middle}</span>{" "}
            &gt; <span>{routeInfo.end}</span>
          </div>

          {/* 정류장 리스트 */}
          <div className="route-map">
            {chunkedStops.map((stopGroup, groupIndex) => (
              <div
                key={groupIndex}
                className="route-line"
                style={{
                  justifyContent:
                    groupIndex % 2 === 0 ? "flex-start" : "flex-end",
                }}>
                {stopGroup.map((stop, index) => (
                  <React.Fragment key={index}>
                    <div className="stop-group">
                      <div className="stop">
                        <div className="stop-circle"></div>
                        <span className="stop-name">{stop.name}</span>
                      </div>
                      {index < stopGroup.length - 1 && (
                        <div className="route-line-connector"></div>
                      )}
                    </div>
                  </React.Fragment>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RouteDetailModal;
