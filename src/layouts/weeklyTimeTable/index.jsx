import { Card } from "@mui/material";
import MDBox from "components/MDBox";
import TableRegisterBookComponent from "components/TableRegisterBookComponent";
import Footer from "examples/Footer";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import React from "react";
import { studentWeeklyTimeTableDates } from "../../mock/weeklyTimeTable";
import TableWeeklyTimeTableComponent from "components/TableWeeklyTimeTable";

export default function WeeklyTimeTable() {
  const handleViewSlotDetail = ([slotDetails, date]) => {
    console.log("slot details: ", slotDetails);
    console.log("date: ", date);
  };
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Card className="max-h-max">
        <MDBox p={5}>
          <TableWeeklyTimeTableComponent
            data={studentWeeklyTimeTableDates.data.details}
            onDetails={handleViewSlotDetail}
            className="mt-8"
          />
        </MDBox>
      </Card>
      <Footer />
    </DashboardLayout>
  );
}
