# 군산시 버스정보시스템(BIS) - Frontend

## 프로젝트 개요
군산시 대중교통 이용 활성화를 통한 탄소중립 기여를 목표로 하는 버스정보시스템 웹 애플리케이션입니다.
<img width="527" height="241" alt="image" src="https://github.com/user-attachments/assets/32d2648f-0aad-451c-9d03-a802057e6469" />


## 주요 기능
- 실시간 버스 위치 지도 표시
- 노선별 정류장 및 경로 시각화
- 버스 도착 정보 제공
- 탄소 배출량 계산기
- 버스 운행 시뮬레이터

## 기술 스택
- **Framework**: React
- **Language**: JavaScript
- **Map API**: Kakao Maps API
- **Styling**: CSS


## 주요 컴포넌트

### 페이지 컴포넌트
- **SimulatorPage**: 메인 지도 화면 및 시뮬레이터 컨트롤
- **RouteDetailsPage**: 노선 상세 정보 페이지

### UI 컴포넌트
- **Header**: 공통 헤더 컴포넌트
- **RouteDetailModal**: 노선 상세 정보 모달
  - 노선 경로 시각화
  - 정류장별 버스 위치 표시
  - 실시간 업데이트 (5초 주기)
- **SimulatorForm**: 시뮬레이터 제어 폼
  - 노선 선택
  - 버스 선택
  - 시뮬레이션 시작/중지

### 정보 표시 컴포넌트
- **BusInfo**: 버스 차량 정보 표시
- **BstpBusInfo**: 정류장 정보 표시
- **ArrivalInfo**: 버스 도착 예정 정보 표시

## 카카오맵 연동

### 지도 초기화
```javascript
const options = {
    center: new window.kakao.maps.LatLng(35.9259206, 126.6156607),
    level: 7,
};
const mapInstance = new window.kakao.maps.Map(container, options);
```

### 주요 기능 구현
1. **노선 경로 표시**
   - Polyline을 사용한 버스 노선 경로 시각화
   - 버텍스 데이터를 순서대로 연결하여 정확한 경로 표현

2. **정류장 마커 표시**
   - 커스텀 마커로 정류장 위치 표시
   - 클릭 이벤트로 정류장 정보 팝업

3. **실시간 버스 위치**
   - 버스 아이콘 마커로 현재 위치 표시
   - 5초마다 위치 업데이트

## API 연동

### API 함수 (utils/routeApi.js)
```javascript
// 노선의 정류장 정보 조회
fetchRouteStops(routeId)

// 노선의 버스 위치 정보 조회
fetchRouteBuses(routeId)

// 노선의 버텍스 정보 조회
fetchRouteVertices(routeId)

// 시뮬레이터 관련 API
startBusSimulation(obuId, routeId)
stopBusSimulation(obuId)
```


## 주요 화면

### 시뮬레이터 페이지
- 전체 지도 뷰
- 노선 선택 및 경로 표시
- 실시간 버스 위치 확인
- 시뮬레이터 제어 패널

### 노선 상세 페이지
- 노선별 정류장 목록
- 버스 위치 시각화
- 정류장 클릭 시 상세 정보 표시
- 탄소 배출량 계산기 연동

## UI/UX 특징

### 반응형 디자인
- 모바일 및 데스크톱 환경 지원
- 화면 크기에 따른 레이아웃 최적화

### 실시간 업데이트
- 5초 주기로 버스 위치 자동 갱신
- 부드러운 애니메이션 효과

### 직관적인 인터페이스
- 명확한 아이콘과 색상 구분
- 사용자 친화적인 정보 배치

## 성능 최적화

### 렌더링 최적화
- React.memo를 활용한 불필요한 리렌더링 방지
- 조건부 렌더링으로 성능 향상

### API 호출 최적화
- 필요한 데이터만 선택적으로 조회
- 중복 요청 방지 로직 구현


## 문제 해결

### 지도 로딩 문제
- **문제**: 카카오맵 API 스크립트 로딩 타이밍 이슈
- **해결**: 동적 스크립트 로딩 및 콜백 처리로 안정적인 지도 초기화

### 실시간 업데이트 성능
- **문제**: 잦은 업데이트로 인한 성능 저하
- **해결**: 5초 주기 업데이트 및 변경된 데이터만 선택적 렌더링
