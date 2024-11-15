import { BrowserRouter, Routes, Route } from "react-router-dom";
import WelcomePage from "./pages/WelcomePage/WelcomePage";
import RouteDetails from "./pages/RoutePage/RouteDetails";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/route-details/:routeNumber" element={<RouteDetails />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
