/* eslint-disable react-hooks/exhaustive-deps */
import { Route, Routes, useNavigate } from "react-router-dom";
import Signin from "./pages/Login/signin";
import "./App.css";
import { useEffect } from "react";
import Layout from "./component/layout/Layout";
import ListRooms from "./pages/Rooms";
import Users from "./pages/Users";
import ListService from "./pages/Service";
import CreateOrEditRoom from "./pages/Rooms/create-or-edit-room/create-or-edit-room";
import RoomOrdersList from "./pages/RoomOrders";
import RestaurantOrdersList from "./pages/RestaurantOrders";

function App() {
  const getAccessToken = () => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("accessToken");
    }
  };
  const token = getAccessToken();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/signin");
    }
  }, []);
  return location.pathname === "/signin" ? (
    <Routes>
      <Route path="/signin" element={<Signin />} />
    </Routes>
  ) : (
    <Layout>
      <Routes>
        {/* Thêm phòng */}
        <Route path="/rooms" element={<ListRooms />} />
        <Route path="/rooms/create-room" element={<CreateOrEditRoom />} />
        <Route path="/rooms/edit-room/:id" element={<CreateOrEditRoom />} />

        {/* Users */}
        <Route path="/users" element={<Users />} />

        {/* Services */}
        <Route path="/services" element={<ListService />} />

        {/* Rooms Order */}
        <Route path="/room-orders" element={<RoomOrdersList />} />

        {/* Thống kê */}
        <Route path="/analytics" element={<RestaurantOrdersList />} />
      </Routes>
    </Layout>
  );
}

export default App;
