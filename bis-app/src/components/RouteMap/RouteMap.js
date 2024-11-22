import React, { useEffect } from "react";
import "./RouteMap.css";

const RouteMap = ({ routes }) => {
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
                    console.error("Map container (div with id 'map') not found.");
                    return;
                }

                const options = {
                    center: new window.kakao.maps.LatLng(35.9259206, 126.6156607),
                    level: 7,
                };

                const map = new window.kakao.maps.Map(container, options);

                // 노선 색상 배열 (순환 가능)
                const colors = [
                    "#FF0000", // 빨강
                    "#0000FF", // 파랑
                    "#008000", // 초록
                    "#FFA500", // 주황
                    "#800080", // 보라
                    "#00FFFF", // 청록
                    "#FFC0CB", // 분홍
                    "#808080", // 회색
                    "#FFFF00", // 노랑
                    "#8B4513", // 갈색
                ];

                // 여러 노선을 지도에 표시
                routes.forEach((route, index) => {
                    const color = colors[index % colors.length]; // 노선마다 고유 색상 지정

                    // 폴리라인 그리기
                    if (route.links) {
                        route.links.forEach((link) => {
                            const path = link.vertices.map(
                                (vertex) =>
                                    new window.kakao.maps.LatLng(vertex.ycord, vertex.xcord)
                            );

                            const polyline = new window.kakao.maps.Polyline({
                                path,
                                strokeWeight: 5,
                                strokeColor: color, // 각 노선의 고유 색상
                                strokeOpacity: 0.7,
                                strokeStyle: "solid",
                            });

                            polyline.setMap(map);
                        });
                    }

                    // 마커 추가
                    if (route.busStops) {
                        route.busStops.forEach((stop) => {
                            const position = new window.kakao.maps.LatLng(
                                stop.ycord,
                                stop.xcord
                            );

                            const marker = new window.kakao.maps.Marker({
                                position,
                                map,
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
                        });
                    }
                });
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
    }, [routes]);

    return <div id="map" className="route-map"></div>;
};

export default RouteMap;