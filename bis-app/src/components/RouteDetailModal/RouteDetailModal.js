import React, { useEffect, useState } from "react";
import {
  fetchRouteStops,
  fetchRouteBusesWithStops,
  fetchRouteBuses,
} from "../../utils/routeApi";
import BstpBusInfo from "../BstpBusinfo/BstpBusInfo"; // 정류장 및 버스 정보 컴포넌트 import
import BusInfo from "../BusInfo/BusInfo"; // 정류장 및 버스 정보 컴포넌트 import
import ArrivalInfo from "../ArrivalInfo/ArrivalInfo"; // 정류장 및 버스 정보 컴포넌트 import
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
  const [stationInfo, setStationInfo] = useState(null); // 정류장 및 버스 정보 Mock 데이터
  const [busInfo, setBusInfo] = useState(null); //
  const [arrivalInfo, setArrivalInfo] = useState(null); //
  const [selectedStop, setSelectedStop] = useState(null); // 선택된 정류장 정보
  const [buses, setBuses] = useState([]); // 노선의 버스 정보들

  // 정류장 및 버스 정보 mock date도 임시로 추가했습니다. 시뮬레이터 구현 완료되면 지우고 BstpBusInfo에서 데이터 받아오게 해서 쓸 예정

  const mockBusInfo = {
    busNumber: "101",
    checkDate: "2024-01-10",
    capacity: "40명",
    company: "서울교통공사",
  };

  const mockArrivalInfo = {
    arrivals: [
      { busNumber: "101", eta: "5분" },
      { busNumber: "201", eta: "12분" },
    ],
  };

  useEffect(() => {
    let intervalId;

    if (routeId) {
      const fetchData = () => {
        fetchRouteStops(routeId).then((stopsData) => {
          const start = stopsData[0]?.name || "";
          const end = stopsData[stopsData.length - 1]?.name || "";
          const middle =
            stopsData[Math.floor(stopsData.length / 2)]?.name || "";
          setRouteInfo({ start, middle, end });
          console.log(stopsData);
          setStops(stopsData);

          const lastSqno = stopsData[stopsData.length - 1]?.sqno; // 마지막 정류장의 sqno 설정
          setLastStopSqno(lastSqno);

          // 첫 번째 정류장을 기본 선택
          if (stopsData.length > 0) {
            setSelectedStop(stopsData[0]);
            setBusInfo(mockBusInfo);
            setArrivalInfo(mockArrivalInfo);
          }

          fetchRouteBuses(routeId).then((busesData) => {
            console.log(busesData);

            // 각 버스에 대해 가장 가까운 정류장의 sqno를 매칭
            const updatedBuses = busesData.map((bus) => {
              // stops 배열에서 가장 가까운 sqno 찾기
              const closestStop = stopsData.reduce((prev, curr) =>
                Math.abs(curr.sqno - bus.sqno) < Math.abs(prev.sqno - bus.sqno)
                  ? curr
                  : prev
              );
              return {
                ...bus, // 기존 버스 데이터 복사
                sqno: closestStop.sqno, // 가장 가까운 정류장 sqno로 덮어쓰기
              };
            });

            setBuses(updatedBuses);
          });
        });
      };

      // 최초 데이터 가져오기
      fetchData();

      // 5초마다 데이터 가져오기
      intervalId = setInterval(fetchData, 5000);
    }

    // cleanup 함수
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [routeId]);

  const chunkedStops = [];
  for (let i = 0; i < stops.length; i += 8) {
    const stopGroup = stops.slice(i, i + 8);
    chunkedStops.push((i / 8) % 2 === 1 ? stopGroup.reverse() : stopGroup);
  }

  const handleStopClick = (stop) => {
    setSelectedStop(stop);

    // 현재 정류장의 sqno를 기준으로 정류장 정보 업데이트
    const currentStopIndex = stops.findIndex((s) => s.sqno === stop.sqno);

    // 현재 정류장
    const currentStop = stops[currentStopIndex];

    // 다음 정류장 (있다면)
    const nextStop = stops[currentStopIndex + 1] || null;

    // stationInfo 업데이트
    setStationInfo({
      stopName: currentStop.name,
      bitType: currentStop.bitType || "LCD", // bitType이 없을 경우 기본값 설정
      nextStop: nextStop ? nextStop.name : "없음", // 다음 정류장이 없으면 "없음"으로 표시
    });

    // BusInfo 업데이트
    setBusInfo(mockBusInfo); // 필요에 따라 수정 가능
    setArrivalInfo(mockArrivalInfo); // 필요에 따라 수정 가능
  };

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

          <div className="content-container">
            {/* 노선 정보 및 정류장 리스트 */}
            <div className="route-map">
              <div className="route-path-info">
                <span>{routeInfo.start}</span> &gt;{" "}
                <span>{routeInfo.middle}</span> &gt;{" "}
                <span>{routeInfo.end}</span>
              </div>
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
                      <div
                        className="stop-group"
                        onClick={() => handleStopClick(stop)} // 클릭 이벤트 수정
                        style={{ cursor: "pointer" }}>
                        <div className="stop">
                          <div className="stop-circle"></div>
                          <span className="stop-name">{stop.name}</span>

                          {/* 버스가 해당 정류장에 있을 경우 버스 아이콘 표시 */}
                          {buses.some((bus) => bus.sqno === stop.sqno) && (
                            <div className="bus-icon">
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

            {/* 정류장 및 버스 정보 패널 */}
            <div className="station-info-panel">
              <BstpBusInfo stationInfo={stationInfo} />
              <BusInfo busInfo={busInfo} />
              <ArrivalInfo arrivalInfo={arrivalInfo} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RouteDetailModal;
