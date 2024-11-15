// 전역 변수 선언
let map;
let busMarkers = new Map();
let updateInterval;

// 모든 함수 선언을 먼저 해줍니다
function stopMonitoring() {
    if (updateInterval) {
        clearInterval(updateInterval);
    }
}

function resetMonitoring() {
    stopMonitoring();
    if (busMarkers) {
        busMarkers.forEach(marker => marker.setMap(null));
        busMarkers.clear();
    }
    document.getElementById('obuId').value = '';
    const radioButtons = document.querySelectorAll('input[name="routeNumber"]');
    radioButtons.forEach(radio => {
        radio.checked = false;
    });
}

function createBusMarker(position, obuId) {
    const content = document.createElement('div');
    content.className = 'bus-marker';
    content.textContent = obuId;

    return new kakao.maps.CustomOverlay({
        position: position,
        content: content,
        map: map
    });
}

async function getBusLocation(obuId) {
    try {
        const response = await fetch(`/api/simulator/bus-location?obuId=${obuId}&routeId=307000010`);
        if (!response.ok) {
            throw new Error('버스 위치 정보를 가져오는데 실패했습니다.');
        }
        const data = await response.json();
        console.log('API 응답:', data);
        return data;
    } catch (error) {
        console.error('버스 위치 조회 실패:', error);
        throw error;
    }
}

async function updateBusLocation(obuId) {
    try {
        const busInfo = await getBusLocation(obuId);
        console.log('받은 버스 정보:', busInfo);

        // 기존 마커 제거
        busMarkers.forEach(marker => marker.setMap(null));
        busMarkers.clear();

        // 좌표값 처리 수정
        const ycord = parseFloat(busInfo.ycord); // 소문자로 수정
        const xcord = parseFloat(busInfo.xcord); // 소문자로 수정

        console.log('파싱된 좌표:', { ycord, xcord });

        if (isNaN(ycord) || isNaN(xcord)) {
            throw new Error('유효하지 않은 좌표값입니다.');
        }

        const position = new kakao.maps.LatLng(ycord, xcord);
        console.log('생성된 위치 객체:', position);

        const marker = createBusMarker(position, busInfo.obuId);
        busMarkers.set(busInfo.obuId, marker);

        // 지도 중심 이동
        map.setCenter(position);

        // 지도 범위 조정
        const bounds = new kakao.maps.LatLngBounds();
        bounds.extend(position);
        map.setBounds(bounds);

    } catch (error) {
        console.error('버스 위치 업데이트 실패:', error);
        stopMonitoring();
        alert('버스 위치 정보를 가져오는데 실패했습니다: ' + error.message);
    }
}

function startMonitoring() {
    const obuId = document.getElementById('obuId').value;
    const routeRadio = document.querySelector('input[name="routeNumber"]:checked');

    if (!obuId || !routeRadio) {
        alert('버스 ID와 노선을 선택해주세요.');
        return;
    }

    stopMonitoring();
    updateBusLocation(obuId);
    updateInterval = setInterval(() => {
        updateBusLocation(obuId);
    }, 3000);
}

// 카카오맵 초기화
async function initMap() {
    return new Promise((resolve, reject) => {
        kakao.maps.load(() => {
            try {
                const container = document.getElementById('map');
                const options = {
                    center: new kakao.maps.LatLng(35.967, 126.736),
                    level: 5
                };
                map = new kakao.maps.Map(container, options);
                resolve();
            } catch (error) {
                console.error('지도 초기화 실패:', error);
                reject(error);
            }
        });
    });
}

// 이벤트 리스너 설정
window.addEventListener('load', async () => {
    try {
        await initMap();
        document.getElementById('startMonitoring').addEventListener('click', startMonitoring);
        document.getElementById('reset').addEventListener('click', resetMonitoring);
    } catch (error) {
        console.error('초기화 실패:', error);
        alert('지도를 초기화하는데 실패했습니다.');
    }
});
