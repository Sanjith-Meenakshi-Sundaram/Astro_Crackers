import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import BottomNavigation from "./BottomNavigation";
import ScrollToTop from "./ScrollToTop";

const Layout = () => {
  const location = useLocation();

  // pages where navbar/bottomNav should NOT show (example: auth pages)
  const hideLayoutPaths = ["/login", "/register"];

  const hideLayout = hideLayoutPaths.includes(location.pathname);

  return (
    <div className="flex flex-col min-h-screen">
      {!hideLayout && <Navbar />}
      <main className="flex-grow">
        <ScrollToTop />
        <Outlet />
      </main>
      {!hideLayout && <BottomNavigation />}
    </div>
  );
};

export default Layout;
