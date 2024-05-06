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
      <Card className="max-h-max">
        <MDBox p={5}>
          <h2 className="text-xl font-bold mb-4">1. Grid layout responsive example</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="h-20 bg-primary-color rounded text-white">01</div>
            <div className="h-20 bg-primary-color rounded text-white">02</div>
            <div className="h-20 bg-primary-color rounded text-white">03</div>
            <div className="h-20 bg-primary-color rounded text-white">04</div>
            <div className="h-20 bg-primary-color rounded text-white">05</div>
            <div className="h-20 bg-primary-color rounded text-white">06</div>
            <div className="h-20 bg-primary-color rounded text-white">07</div>
            <div className="h-20 bg-primary-color rounded text-white">08</div>
          </div>
          {/* <BarChart
            xAxis={[{ scaleType: "band", data: ["group A", "group B", "group C"] }]}
            series={[{ data: [4, 3, 5] }, { data: [1, 6, 3] }, { data: [2, 5, 6] }]}
            width={500}
            height={300}
          /> */}
        </MDBox>
      </Card>
      <Footer />
    </DashboardLayout>
  );
}
