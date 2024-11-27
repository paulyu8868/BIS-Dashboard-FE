export async function fetchRouteStops(route_id) {
  const url = `${process.env.REACT_APP_BACKEND_URL}/api/route/${route_id}/stops`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();

    return data.map((stop) => ({
      name: stop.busStopName,
      id: stop.busStopId,
    }));
  } catch (error) {
    console.error("Failed to fetch route stops:", error);
    return [];
  }
}
