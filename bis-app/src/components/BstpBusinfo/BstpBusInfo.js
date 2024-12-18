import React from "react";
import "./BstpBusInfo.css";

const BstpBusInfo = ({ stationInfo }) => {
    if (!stationInfo) {
        return <p className="loading-text">정보를 불러오는 중...</p>;
    }

    return (
        <div className="station-info-container">
            {/* 정류장 정보 */}
            <div className="info-section">
                <h3>정류장 정보</h3>
                <div className="info-row">
                    <span>정류장 명</span>
                    <span>{stationInfo.stopName}</span>
                </div>
                <div className="info-row">
                    <span>BIT 유형</span>
                    <span>{stationInfo.bitType}</span>
                </div>
                <div className="info-row">
                    <span>다음 정류장</span>
                    <span>{stationInfo.nextStop}</span>
                </div>
            </div>

            {/* 버스 정보 */}
            <div className="info-section">
                <h3>버스 정보</h3>
                <div className="info-row">
                    <span>버스 번호</span>
                    <span>{stationInfo.busNumber}</span>
                </div>
                <div className="info-row">
                    <span>점검 일자</span>
                    <span>{stationInfo.checkDate}</span>
                </div>
                <div className="info-row">
                    <span>승차 정원</span>
                    <span>{stationInfo.capacity}</span>
                </div>
                <div className="info-row">
                    <span>버스 회사</span>
                    <span>{stationInfo.company}</span>
                </div>
            </div>

            {/* 도착 예정 정보 */}
            <div className="info-section">
                <h3>도착예정정보</h3>
                {stationInfo.arrivals.map((arrival, index) => (
                    <div className="info-row" key={index}>
                        <span>{arrival.busNumber}번</span>
                        <span>{arrival.eta}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BstpBusInfo;
