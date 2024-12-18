import React, { useState, useEffect } from "react";
import "./CarbonCalculator.css";

const CarbonCalculator = ({ markers }) => {
    const [startStation, setStartStation] = useState(null);
    const [endStation, setEndStation] = useState(null);
    const [distance, setDistance] = useState(0);
    const [carbonEmission, setCarbonEmission] = useState(0);

    // 거리 계산 함수 (하버사인 공식 사용)
    const calculateDistance = (coord1, coord2) => {
        const R = 6371; // 지구 반지름 (단위: km)
        const toRad = (value) => (value * Math.PI) / 180;

        const dLat = toRad(coord2.lat - coord1.lat);
        const dLon = toRad(coord2.lng - coord1.lng);

        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRad(coord1.lat)) *
            Math.cos(toRad(coord2.lat)) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return (R * c).toFixed(2); // 거리 반환 (단위: km)
    };

    // 출발 정류장과 도착 정류장이 변경될 때만 거리 및 탄소 배출량 계산
    useEffect(() => {
        if (startStation && endStation) {
            const coord1 = { lat: startStation.ycord, lng: startStation.xcord };
            const coord2 = { lat: endStation.ycord, lng: endStation.xcord };

            const calculatedDistance = calculateDistance(coord1, coord2);
            setDistance(calculatedDistance);
            setCarbonEmission((calculatedDistance * 0.2).toFixed(2)); // 탄소 배출량 = 거리 * 0.2kg/km
        }
    }, [startStation, endStation]);

    return (
        <div className="carbon-calculator">
            <h3>탄소 배출량 계산기</h3>
            <div className="station-selector">
                <label>출발 정류장:</label>
                <select
                    onChange={(e) =>
                        setStartStation(markers.find((m) => m.bstpNm === e.target.value))
                    }>
                    <option value="">출발 정류장 선택</option>
                    {markers.map((marker, index) => (
                        <option key={index} value={marker.bstpNm}>
                            {marker.bstpNm}
                        </option>
                    ))}
                </select>
            </div>

            <div className="station-selector">
                <label>도착 정류장:</label>
                <select
                    onChange={(e) =>
                        setEndStation(markers.find((m) => m.bstpNm === e.target.value))
                    }>
                    <option value="">도착 정류장 선택</option>
                    {markers.map((marker, index) => (
                        <option key={index} value={marker.bstpNm}>
                            {marker.bstpNm}
                        </option>
                    ))}
                </select>
            </div>

            <p>거리: {distance} km</p>
            <p>탄소 배출량: {carbonEmission} kg CO₂</p>
        </div>
    );
};

export default CarbonCalculator;
