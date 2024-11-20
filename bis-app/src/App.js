import { BrowserRouter, Routes, Route } from "react-router-dom";
import WelcomePage from "./pages/WelcomePage/WelcomePage";
import RouteDetailsPage from "./pages/RouteDetailsPage/RouteDetailsPage"; // 노선 상세 페이지 추가
import "./App.css";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<WelcomePage />} />
                <Route path="/route-details" element={<RouteDetailsPage />} /> {/* 노선 선택 및 상세 경로 */}
            </Routes>
        </BrowserRouter>
    );
}

export default App;
