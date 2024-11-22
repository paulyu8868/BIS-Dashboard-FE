import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // useNavigate 추가
import Header from "../../components/Header/Header";
import RouteMap from "../../components/RouteMap/RouteMap";
import "./RouteDetailsPage.css";

const RouteDetailsPage = () => {
    const [routes, setRoutes] = useState([]); // 노선 데이터
    const [selectedRoutes, setSelectedRoutes] = useState([]); // 선택된 노선
    const navigate = useNavigate(); // 페이지 이동을 위한 useNavigate 훅

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

    const handleSimulatorStart = () => {
        navigate("/simulator"); // 시뮬레이터 페이지로 이동
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
                <button className="simulator-button" onClick={handleSimulatorStart}>
                    시뮬레이터 작동
                </button>
            </div>

            <div className="map-container">
                <RouteMap routes={selectedRoutes} />
            </div>
        </div>
    );
};

export default RouteDetailsPage;
