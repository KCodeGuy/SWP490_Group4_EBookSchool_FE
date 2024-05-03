import { Card } from "@mui/material";
import { BarChart } from "@mui/x-charts";
import MDBox from "components/MDBox";
import Footer from "examples/Footer";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import React from "react";

export default function Demo() {
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Card className="h-screen">
        <MDBox p={5}>
          <BarChart
            xAxis={[{ scaleType: "band", data: ["group A", "group B", "group C"] }]}
            series={[{ data: [4, 3, 5] }, { data: [1, 6, 3] }, { data: [2, 5, 6] }]}
            width={500}
            height={300}
          />
        </MDBox>
      </Card>
      <Footer />
    </DashboardLayout>
  );
}
