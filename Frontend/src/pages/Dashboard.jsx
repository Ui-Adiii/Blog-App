import React, { use, useEffect, useState } from "react";
import { useLocation } from "react-router";
import DashSidebar from "../components/DashSidebar";
import DashProfile from "../components/DashProfile";

const Dashboard = () => {
  const location = useLocation();

  const [tab, settab] = useState("");
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    if (tabFromUrl) {
      settab(tabFromUrl);
    }
  }, [location.search]);

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <div className="md:w-56">
        <DashSidebar />
      </div>
      <div>{tab === "profile" && <DashProfile />}</div>
    </div>
  );
};

export default Dashboard;
