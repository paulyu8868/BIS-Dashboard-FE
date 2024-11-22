import React, { useEffect, useState, useRef } from "react";
import "./SimulatorForm.css";

const SimulatorForm = ({ map, routes, setRoutes }) => {
    const [buses, setBuses] = useState([]); // 버스 데이터
    const [selectedBus, setSelectedBus] = useState("");
    const [selectedRoute, setSelectedRoute] = useState("");
    const [activeRoute, setActiveRoute] = useState(null); // 현재 지도에 표시된 노선
    const [activeMarkers, setActiveMarkers] = useState([]); // 현재 지도에 표시된 정류장 마커
    const busMarkerRef = useRef(null); // 버스 마커 참조
    const movementIntervalRef = useRef(null); // 마커 이동 interval 참조

    // 백엔드에서 노선 데이터를 가져옴
    useEffect(() => {
        fetch(`${process.env.REACT_APP_BACKEND_URL}/api/route/top10`)
            .then((response) => {
                if (!response.ok) throw new Error("Failed to fetch routes");
                return response.json();
            })
            .then(setRoutes)
            .catch((error) => console.error("Error fetching route data:", error));
    }, [setRoutes]);

    // 백엔드에서 버스 데이터를 가져옴
    useEffect(() => {
        fetch(`${process.env.REACT_APP_BACKEND_URL}/api/simulator/buses/top10`)
            .then((response) => {
                if (!response.ok) throw new Error("Failed to fetch buses");
                return response.json();
            })
            .then(setBuses)
            .catch((error) => console.error("Error fetching bus data:", error));
    }, []);

    const displayRouteAndStops = (routeData) => {
        if (!map || !routeData) return;

        // 지도에서 기존 노선과 마커 제거
        if (activeRoute) activeRoute.setMap(null);
        activeMarkers.forEach((marker) => marker.setMap(null));
        setActiveMarkers([]);

        // 경로 표시
        const paths = routeData.links.map((link) =>
            link.vertices.map(
                (vertex) =>
                    new window.kakao.maps.LatLng(vertex.ycord, vertex.xcord)
            )
        );

        const polyline = new window.kakao.maps.Polyline({
            path: paths.flat(),
            strokeWeight: 5,
            strokeColor: "#FF0000", // 노선 색상
            strokeOpacity: 0.8,
            strokeStyle: "solid",
        });

        polyline.setMap(map);
        setActiveRoute(polyline);

        // 정류장 표시
        const markers = routeData.busStops.map((stop) => {
            const markerPosition = new window.kakao.maps.LatLng(
                stop.ycord,
                stop.xcord
            );

            const marker = new window.kakao.maps.Marker({
                position: markerPosition,
                map: map,
            });

            const infowindow = new window.kakao.maps.InfoWindow({
                content: `<div style="padding:5px;">${stop.busStopName}</div>`,
            });

            window.kakao.maps.event.addListener(marker, "mouseover", () => {
                infowindow.open(map, marker);
            });

            window.kakao.maps.event.addListener(marker, "mouseout", () => {
                infowindow.close();
            });

            return marker;
        });

        setActiveMarkers(markers);
    };

    const startSimulation = () => {
        if (!selectedBus || !selectedRoute) {
            alert("버스와 노선을 선택해주세요.");
            return;
        }

        const selectedRouteData = routes.find((route) => route.routeId === selectedRoute);
        if (!selectedRouteData) {
            alert("선택한 노선을 찾을 수 없습니다.");
            return;
        }

        // 노선 및 정류장 표시
        displayRouteAndStops(selectedRouteData);

        // 백엔드에 시뮬레이션 시작 요청
        fetch(`${process.env.REACT_APP_BACKEND_URL}/api/simulator/start`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                busId: selectedBus,
                routeId: selectedRoute,
            }),
        })
            .then((response) => {
                if (!response.ok) throw new Error("Failed to start simulation");
                return response.json(); // BusSimulationResponse DTO 반환
            })
            .then((simulationData) => {
                // 버스 마커 초기 위치 설정
                const { xCord, yCord } = simulationData;
                createBusMarker(xCord, yCord);
            })
            .catch((error) =>
                console.error("Error starting simulation:", error)
            );
    };

    const createBusMarker = (x, y) => {
        if (!map) return;

        // 기존 마커 제거
        if (busMarkerRef.current) {
            busMarkerRef.current.setMap(null);
        }

        const markerPosition = new window.kakao.maps.LatLng(y, x);

        const marker = new window.kakao.maps.Marker({
            position: markerPosition,
            map: map,
            image: new window.kakao.maps.MarkerImage(
                "https://cdn-icons-png.flaticon.com/512/684/684908.png", // 버스 아이콘
                new window.kakao.maps.Size(40, 40), // 크기
                { offset: new window.kakao.maps.Point(20, 20) } // 중심점
            ),
        });

        busMarkerRef.current = marker;
    };

    const stopSimulation = () => {
        // 지도에서 노선과 마커 제거
        if (activeRoute) activeRoute.setMap(null);
        activeMarkers.forEach((marker) => marker.setMap(null));
        setActiveMarkers([]);

        // 버스 마커 제거
        if (busMarkerRef.current) {
            busMarkerRef.current.setMap(null);
            busMarkerRef.current = null;
        }

        // 마커 이동 중단
        if (movementIntervalRef.current) {
            clearInterval(movementIntervalRef.current);
            movementIntervalRef.current = null;
        }

        setSelectedBus("");
        setSelectedRoute("");
        alert("시뮬레이터가 종료되었습니다.");
    };

    return (
        <div className="bus-form-container">
            <h2 className="bus-form-title">버스 정보 입력</h2>
            <div className="bus-form-field">
                <label className="bus-form-label">버스 번호</label>
                <select
                    value={selectedBus}
                    onChange={(e) => setSelectedBus(e.target.value)}
                    className="bus-form-select"
                >
                    <option value="">버스를 선택하세요</option>
                    {buses.map((bus) => (
                        <option key={bus.busId} value={bus.busId}>
                            {bus.busNo}
                        </option>
                    ))}
                </select>
            </div>
            <div className="bus-form-field">
                <label className="bus-form-label">노선 번호</label>
                <select
                    value={selectedRoute}
                    onChange={(e) => setSelectedRoute(e.target.value)}
                    className="bus-form-select"
                >
                    <option value="">노선을 선택하세요</option>
                    {routes.map((route) => (
                        <option key={route.routeId} value={route.routeId}>
                            {route.routeName}
                        </option>
                    ))}
                </select>
            </div>
            <div className="bus-form-button-container">
                <button onClick={startSimulation} className="bus-form-button">
                    운행 시작
                </button>
                <button onClick={stopSimulation} className="bus-form-button">
                    종료
                </button>
            </div>
        </div>
    );
};

export default SimulatorForm;
