import React, { useEffect, useState } from "react";
import {
  fetchRouteStops,
  fetchRouteBusesWithStops,
} from "../../utils/routeApi";
import "./RouteDetailModal.css";
import busIcon from "../../images/bus_icon.png";

const RouteDetailModal = ({ routeId, routeNumber, onClose }) => {
  const [stops, setStops] = useState([]);
  const [routeInfo, setRouteInfo] = useState({
    start: "",
    middle: "",
    end: "",
  });
  const [lastStopSqno, setLastStopSqno] = useState(null); // 마지막 정류장의 sqno

  // 시뮬레이터가 구현되면 사용할 배열
  //const [buses, setBuses] = useState([]);

  // 시뮬레이터가 구현되기 전 사용할 mock data(현재는 sqno를 갱신하지 않는데 여기서 sqno가 필요해서 사용)
  const buses = [
    { obuId: "125711004", sqno: 41 },
    { obuId: "125712052", sqno: 345 },
    { obuId: "125712002", sqno: 209 },
    { obuId: "125712011", sqno: 201 },
  ];

  useEffect(() => {
    if (routeId) {
      fetchRouteStops(routeId).then((stopsData) => {
        const start = stopsData[0]?.name || "";
        const end = stopsData[stopsData.length - 1]?.name || "";
        const middle = stopsData[Math.floor(stopsData.length / 2)]?.name || "";
        setRouteInfo({ start, middle, end });
        setStops(stopsData);

        const lastSqno = stopsData[stopsData.length - 1]?.sqno; // 마지막 정류장의 sqno 설정
        setLastStopSqno(lastSqno);

        /* 이 부분은 시뮬레이터가 구현되어 sqno를 불러올 수 있을 때 사용
        // 마지막 정류장의 sqno가 설정된 후, fetchRouteBusesWithStops 실행
        fetchRouteBusesWithStops(routeId).then((busesData) => {
          const updatedBusesData = busesData.map((bus) => ({
            ...bus,
            sqno: bus.sqno ?? lastSqno, // null인 경우 lastStopSqno로 대체
          }));
          setBuses(updatedBusesData);
        });
        */
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

                        {/* 버스가 해당 정류장에 있을 경우 버스 아이콘 표시 */}
                        {buses.some((bus) => bus.sqno === stop.sqno) && (
                          <div className="bus-icon">
                            {/* 이미지 크기를 원과 일치시키기 위한 스타일 추가 */}
                            <img
                              src={busIcon}
                              alt="Bus"
                              className="bus-image"
                            />
                          </div>
                        )}
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
