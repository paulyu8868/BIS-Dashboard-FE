import React, { useState, useEffect } from "react";
import Header from "../../components/Header/Header";
import RouteMap from "../../components/RouteMap/RouteMap";
import "./RouteDetailsPage.css";

const RouteDetailsPage = () => {
    const [routes, setRoutes] = useState([]);
    const [selectedRoutes, setSelectedRoutes] = useState([]);
    const [showSimulator, setShowSimulator] = useState(false); // 시뮬레이터 창 표시 여부

    useEffect(() => {
        fetch(`${process.env.REACT_APP_BACKEND_URL}/api/route/top10`)
            .then((response) => {
                if (!response.ok) throw new Error("Failed to fetch routes");
                return response.json();
            })
            .then(setRoutes)
            .catch((error) => console.error("Error fetching route data:", error));
    }, []);

    const handleRouteClick = (route) => {
        if (selectedRoutes.some((r) => r.routeId === route.routeId)) {
            setSelectedRoutes((prev) =>
                prev.filter((r) => r.routeId !== route.routeId)
            );
        } else {
            setSelectedRoutes((prev) => [...prev, route]);
        }
    };

    const toggleSimulator = () => {
        setShowSimulator((prev) => !prev); // 시뮬레이터 창 표시 토글
    };

    return (
        <div className="route-details-page">
            <Header />
            <div className="sidebar">
                <h2>노선</h2>
                {routes.map((route, index) => (
                    <button
                        key={route.routeId}
                        className={`route-button ${
                            selectedRoutes.some((r) => r.routeId === route.routeId)
                                ? "selected"
                                : ""
                        }`}
                        onClick={() => handleRouteClick(route)}
                    >
                        {index + 1}번 노선
                    </button>
                ))}
                <button className="simulator-button" onClick={toggleSimulator}>
                    시뮬레이터 작동
                </button>
            </div>

            <div className="map-container">
                <RouteMap routes={selectedRoutes} />
            </div>

            {showSimulator && (
                <div className="simulator-container">
                    <div className="simulator-header">시뮬레이터</div>
                    <select className="simulator-input">
                        <option>울산71자2809</option>
                        <option>서울22가1234</option>
                    </select>
                    <select className="simulator-input">
                        <option>1번 노선</option>
                        <option>2번 노선</option>
                        <option>3번 노선</option>
                    </select>
                    <div className="simulator-buttons">
                        <button className="start-button">운행 시작</button>
                        <button
                            className="cancel-button"
                            onClick={() => setShowSimulator(false)}
                        >
                            취소
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RouteDetailsPage;
