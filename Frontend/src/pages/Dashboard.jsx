import React, {  useEffect, useState } from "react";
import { useLocation } from "react-router";
import DashSidebar from "../components/DashSidebar";
import DashProfile from "../components/DashProfile";
import DashPosts from "../components/DashPosts";

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
      {tab === "profile" && <DashProfile />}
      {tab === 'posts' && <DashPosts/>}
    </div>
  );
};

export default Dashboard;
