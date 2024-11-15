import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import RouteSelector from "../../components/RouteSelector/RouteSelector";
import Header from "../../components/Header/Header";
import "./RouteDetails.css";

const routeIds = {
  1: "307000010",
  // 다른 노선 ID 추가 가능
};

async function fetchRouteStops(route_id) {
  const url = `${process.env.REACT_APP_BACKEND_URL}/api/simulator/route/${route_id}/stops`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();

    // 필요한 데이터만 추출 (bstpNm과 pointSqno만)
    const filteredData = data.map((stop) => ({
      name: stop.bstpNm,
      sequence: stop.pointSqno,
    }));

    return filteredData;
  } catch (error) {
    console.error("Failed to fetch route stops:", error);
    return [];
  }
}

const RouteDetails = () => {
  const { routeNumber } = useParams();
  const [stops, setStops] = useState([]);
  const [routeInfo, setRouteInfo] = useState({
    start: "",
    middle: "",
    end: "",
  });

  useEffect(() => {
    const routeId = routeIds[routeNumber];
    if (routeId) {
      fetchRouteStops(routeId).then((stopsData) => {
        // pointSqno 순서대로 정렬
        const sortedStops = stopsData.sort((a, b) => a.sequence - b.sequence);
        setStops(sortedStops);

        // 시작, 중간, 끝 정류장 정보 설정
        const start = sortedStops[0]?.name || "";
        const end = sortedStops[sortedStops.length - 1]?.name || "";
        const middle =
          sortedStops[Math.floor(sortedStops.length / 2)]?.name || "";
        setRouteInfo({ start, middle, end });
      });
    }
  }, [routeNumber]);

  // stops 배열을 8개씩 나누어 그룹화하고, 홀수 번째 그룹은 역순으로 정렬
  const chunkedStops = [];
  for (let i = 0; i < stops.length; i += 8) {
    const stopGroup = stops.slice(i, i + 8);
    chunkedStops.push((i / 8) % 2 === 1 ? stopGroup.reverse() : stopGroup);
  }

  return (
    <div className="route-details">
      <RouteSelector />
      <div className="route-content">
        <Header />
        <h2>{routeNumber}번 노선</h2>

        {/* 노선 정보 표시 */}
        <div className="route-path-info">
          <span>{routeInfo.start}</span> &gt; <span>{routeInfo.middle}</span>{" "}
          &gt; <span>{routeInfo.end}</span>
        </div>

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
                    {/* 마지막 정류장 이후에는 회색 선을 추가하지 않음 */}
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
  );
};

export default RouteDetails;
