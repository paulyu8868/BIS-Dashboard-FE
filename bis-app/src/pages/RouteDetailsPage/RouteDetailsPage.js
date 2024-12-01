import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header/Header";
import RouteMap from "../../components/RouteMap/RouteMap";
import "./RouteDetailsPage.css";

const RouteDetailsPage = () => {
    const routeMapping = {
        1: "307000010",
        2: "307000020",
        3: "307000030",
        4: "307000070",
        5: "307000080",
        6: "307000090",
        7: "307000100",
        8: "307000110",
        9: "307000120",
        10: "307000130"
    };

   const [selectedRoutes, setSelectedRoutes] = useState([]);
   const [isLoading, setIsLoading] = useState(false);
   const routeCache = useRef({});
   const navigate = useNavigate();

   const fetchRouteData = async (routeId) => {
       if (routeCache.current[routeId]) {
           console.log(`Using cached data for route ${routeId}`);
           return routeCache.current[routeId];
       }

       const [busStopsResponse, verticesResponse] = await Promise.all([
           fetch(`${process.env.REACT_APP_BACKEND_URL}/api/route/busstops/${routeId}`),
           fetch(`${process.env.REACT_APP_BACKEND_URL}/api/route/vertices/${routeId}`)
       ]);

       if (!busStopsResponse.ok || !verticesResponse.ok) {
           throw new Error("Failed to fetch route data");
       }

       const [busStopsData, verticesData] = await Promise.all([
           busStopsResponse.json(),
           verticesResponse.json()
       ]);

       const routeData = {
           busStops: busStopsData,
           vertices: verticesData
       };
       routeCache.current[routeId] = routeData;
       
       return routeData;
   };

   const handleRouteClick = async (routeNumber) => {
       try {
           const routeId = routeMapping[routeNumber];
           
           if (selectedRoutes.some((r) => r.routeId === routeId)) {
               setSelectedRoutes((prev) =>
                   prev.filter((r) => r.routeId !== routeId)
               );
               return;
           }

           setIsLoading(true);
           
           const routeData = await fetchRouteData(routeId);

           const formattedRouteData = {
               routeId,
               routeNumber,
               busStops: routeData.busStops,
               vertices: routeData.vertices
           };

           setSelectedRoutes((prev) => [...prev, formattedRouteData]);

       } catch (error) {
           console.error("Error fetching route data:", error);
       } finally {
           setIsLoading(false);
       }
   };

   const handleSimulatorStart = () => {
       navigate("/simulator");
   };

   return (
       <div className="route-details-page">
           <Header />
           <div className="sidebar">
               <h2>노선</h2>
               {Array.from({ length: 10 }, (_, i) => i + 1).map((routeNumber) => (
                   <button
                       key={routeNumber}
                       className={`route-button ${
                           selectedRoutes.some((r) => r.routeId === routeMapping[routeNumber])
                               ? "selected"
                               : ""
                       } ${isLoading ? "disabled" : ""}`}
                       onClick={() => handleRouteClick(routeNumber)}
                       disabled={isLoading}
                   >
                       {routeNumber}번 노선
                       {routeCache.current[routeMapping[routeNumber]] && 
                        !selectedRoutes.some((r) => r.routeId === routeMapping[routeNumber]) && 
                        ""}
                   </button>
               ))}
               <button 
                   className="simulator-button" 
                   onClick={handleSimulatorStart}
                   disabled={isLoading}
               >
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