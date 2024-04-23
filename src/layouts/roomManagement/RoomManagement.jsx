import React from "react";
import "./style.scss";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { Card } from "@mui/material";
import MDBox from "components/MDBox";
import Footer from "examples/Footer";
// Room management (UolLT)

export default function RoomManagement() {
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Card>
        <MDBox p={5}>
          {/* DO NOT DELETE CODE AS ABOVE*/}
          <h4>Room Management (UolLT)</h4>
          {/* Your code here */}
        </MDBox>
      </Card>
      <Footer />
    </DashboardLayout>
  );
}
