import { useState } from "react";
import Auth from "./pages/Auth.jsx";
import Home from "./pages/Home.jsx";
import AddPage from "./pages/AddPage.jsx";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import ProductsPage from "./pages/ProductsPage.jsx";
import ReadMore from "./pages/ReadMore.jsx";
import EditPage from "./pages/EditPage.jsx";
import ProtectionRoute from "./components/ProtectionRoute.jsx";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Auth />} />

        {/* Protected Routes */}

        <Route
          path="/home"
          element={
            <>
              <ProtectionRoute /> <Home />
            </>
          }
        />
        <Route
          path="/add"
          element={
            <>
              <ProtectionRoute /> <AddPage />
            </>
          }
        />
        <Route
          path="/products"
          element={
            <>
              <ProtectionRoute />
              <ProductsPage />
            </>
          }
        />
        <Route
          path="/product/:productId"
          element={
            <>
              <ProtectionRoute />
              <ReadMore />
            </>
          }
        />
        <Route
          path="/edit/:productId"
          element={
            <>
              <ProtectionRoute />
              <EditPage />
            </>
          }
        />
      </Routes>
    </Router>
  );
}
