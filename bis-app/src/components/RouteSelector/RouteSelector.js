import React from "react";
import { useNavigate } from "react-router-dom";
import "./RouteSelector.css";

const RouteSelector = () => {
  const navigate = useNavigate();

  const handleSelectRoute = (routeNumber) => {
    navigate(`/route-details/${routeNumber}`);
  };

  return (
    <div className="route-selector">
      <h3>노선</h3>
      {Array.from({ length: 10 }, (_, i) => (
        <button key={i} onClick={() => handleSelectRoute(i + 1)}>
          {i + 1}번 노선
        </button>
      ))}
    </div>
  );
};

export default RouteSelector;
