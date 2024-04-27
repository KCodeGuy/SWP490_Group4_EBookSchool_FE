import { Card } from "@mui/material";
import MDBox from "components/MDBox";
import Footer from "examples/Footer";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import React from "react";
export default function MenuComponent() {
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Card>
        <MDBox p={5}>
          {/* DO NOT DELETE CODE AS ABOVE*/}
          <h4>Mark Management (HieuTTN)</h4>
        </MDBox>
      </Card>
      <Footer />
    </DashboardLayout>
  );
}
