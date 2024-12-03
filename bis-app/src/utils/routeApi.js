export async function fetchRouteStops(route_id) {
  const url = `${process.env.REACT_APP_BACKEND_URL}/api/route/busstops/${route_id}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();

    return data.map((stop) => ({
      name: stop.bstpNm,
      id: stop.bstpId,
      sqno: stop.pointSqno,
    }));
  } catch (error) {
    console.error("Failed to fetch route stops:", error);
    return [];
  }
}
