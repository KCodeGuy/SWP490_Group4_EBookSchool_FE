import { Card } from "@mui/material";
import MDBox from "components/MDBox";
import Footer from "examples/Footer";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import React from "react";

export default function WeeklyTimeTable() {
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Card className="h-screen">
        <MDBox p={5}></MDBox>
      </Card>
      <Footer />
    </DashboardLayout>
  );
}
