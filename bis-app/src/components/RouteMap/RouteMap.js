import React, { useEffect, useRef } from "react";
import "./RouteMap.css";

export default function RouteMap({ routes }) {
  const mapRef = useRef(null);
  const mapObjectsRef = useRef({
    polylines: [],
    markers: [],
    infoWindows: [],
  });

  const clearMapObjects = React.useCallback(() => {
    mapObjectsRef.current.polylines.forEach((polyline) =>
      polyline.setMap(null)
    );
    mapObjectsRef.current.markers.forEach((marker) => marker.setMap(null));
    mapObjectsRef.current.infoWindows.forEach((infoWindow) =>
      infoWindow.close()
    );

    mapObjectsRef.current = {
      polylines: [],
      markers: [],
      infoWindows: [],
    };
  }, []);

  const updateRoutes = React.useCallback(() => {
    if (!mapRef.current) return;

    clearMapObjects();

    const colors = [
      "#FF0000",
      "#0000FF",
      "#008000",
      "#FFA500",
      "#800080",
      "#00FFFF",
      "#FFC0CB",
      "#808080",
      "#FFFF00",
      "#8B4513",
    ];

    routes.forEach((route, index) => {
      const color = colors[index % colors.length];

      if (route.vertices && route.vertices.length > 0) {
        const path = route.vertices.map(
          (vertex) => new window.kakao.maps.LatLng(vertex.ycord, vertex.xcord)
        );

        const polyline = new window.kakao.maps.Polyline({
          path,
          strokeWeight: 5,
          strokeColor: color,
          strokeOpacity: 0.7,
          strokeStyle: "solid",
        });

        polyline.setMap(mapRef.current);
        mapObjectsRef.current.polylines.push(polyline);
      }

      if (route.busStops && route.busStops.length > 0) {
        route.busStops.forEach((stop) => {
          const position = new window.kakao.maps.LatLng(stop.ycord, stop.xcord);

          const marker = new window.kakao.maps.Marker({
            position,
            map: mapRef.current,
          });

          const infowindow = new window.kakao.maps.InfoWindow({
            content: `<div style="padding:5px;">${stop.bstpNm}</div>`,
            removable: false,
          });

          window.kakao.maps.event.addListener(marker, "mouseover", () =>
            infowindow.open(mapRef.current, marker)
          );
          window.kakao.maps.event.addListener(marker, "mouseout", () =>
            infowindow.close()
          );

          mapObjectsRef.current.markers.push(marker);
          mapObjectsRef.current.infoWindows.push(infowindow);
        });
      }
    });
  }, [routes, clearMapObjects]);

  const initializeMap = React.useCallback(() => {
    window.kakao.maps.load(() => {
      if (!mapRef.current) {
        const container = document.getElementById("map");
        const options = {
          center: new window.kakao.maps.LatLng(35.9259206, 126.6156607),
          level: 7,
        };
        mapRef.current = new window.kakao.maps.Map(container, options);
      }
      updateRoutes();
    });
  }, [updateRoutes]);

  useEffect(() => {
    if (!window.kakao) {
      const script = document.createElement("script");
      script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.REACT_APP_KAKAO_API_KEY}&autoload=false`;
      script.async = true;
      document.head.appendChild(script);

      script.onload = () => initializeMap();
    } else {
      initializeMap();
    }

    return () => {
      clearMapObjects();
    };
  }, [initializeMap, clearMapObjects]);

  useEffect(() => {
    if (!mapRef.current) return;
    updateRoutes();
  }, [updateRoutes]);

  return <div id="map" className="route-map"></div>;
}
