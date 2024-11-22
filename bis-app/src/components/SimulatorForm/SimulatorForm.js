import React, { useEffect, useState } from "react";
import "./SimulatorForm.css";

const SimulatorForm = ({ map, routes, setRoutes }) => {
    const [buses, setBuses] = useState([]); // 버스 데이터
    const [selectedBus, setSelectedBus] = useState("");
    const [selectedRoute, setSelectedRoute] = useState("");
    const [activeRoute, setActiveRoute] = useState(null); // 현재 지도에 표시된 노선

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

        if (map && selectedRouteData.links) {
            if (activeRoute) {
                activeRoute.setMap(null);
            }

            const paths = selectedRouteData.links.map((link) =>
                link.vertices.map(
                    (vertex) =>
                        new window.kakao.maps.LatLng(vertex.ycord, vertex.xcord)
                )
            );

            const polyline = new window.kakao.maps.Polyline({
                path: paths.flat(),
                strokeWeight: 5,
                strokeColor: "#FF0000", // 노선 색상 (빨강)
                strokeOpacity: 0.8,
                strokeStyle: "solid",
            });

            polyline.setMap(map);
            setActiveRoute(polyline);
        }

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
                alert("시뮬레이터가 시작되었습니다.");
            })
            .catch((error) =>
                console.error("Error starting simulation:", error)
            );
    };

    const stopSimulation = () => {
        if (activeRoute) {
            activeRoute.setMap(null);
            setActiveRoute(null);
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
