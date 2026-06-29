import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CartDrawer from "../components/CartDrawer";

const ClientLayout = () => {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />

      {/* Content */}
      <main className="flex-grow-1">
        <Outlet />
      </main>

      <Footer />

      {/* Carrito lateral (drawer) global */}
      <CartDrawer />
    </div>
  );
};

export default ClientLayout;
