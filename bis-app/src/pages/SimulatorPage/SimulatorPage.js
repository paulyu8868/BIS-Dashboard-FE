import React, { useState, useEffect } from "react";
import Header from "../../components/Header/Header";
import SimulatorForm from "../../components/SimulatorForm/SimulatorForm"; // 새로운 컴포넌트 임포트
import "./SimulatorPage.css";

const SimulatorPage = () => {
    const [routes, setRoutes] = useState([]); // 노선 데이터
    const [map, setMap] = useState(null); // 카카오 맵 객체

    // 카카오 맵 초기화
    useEffect(() => {
        const script = document.createElement("script");
        script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.REACT_APP_KAKAO_API_KEY}&autoload=false`;
        script.async = true;
        document.head.appendChild(script);

        script.onload = () => {
            if (!window.kakao || !window.kakao.maps) {
                console.error("Kakao Maps API failed to load.");
                return;
            }

            window.kakao.maps.load(() => {
                const container = document.getElementById("map");
                if (!container) {
                    console.error("Map container not found.");
                    return;
                }

                const options = {
                    center: new window.kakao.maps.LatLng(35.9259206, 126.6156607),
                    level: 7,
                };

                const mapInstance = new window.kakao.maps.Map(container, options);
                setMap(mapInstance);
            });
        };

        return () => {
            const scriptTags = Array.from(document.head.getElementsByTagName("script"));
            scriptTags.forEach((tag) => {
                if (tag.src.includes("kakao.com")) {
                    document.head.removeChild(tag);
                }
            });
        };
    }, []);

    return (
        <div className="simulator-page">
            <Header />
            <div id="map" className="full-map"></div>
            {/* SimulatorForm 컴포넌트 추가 */}
            <SimulatorForm map={map} routes={routes} setRoutes={setRoutes} />
        </div>
    );
};

export default SimulatorPage;
