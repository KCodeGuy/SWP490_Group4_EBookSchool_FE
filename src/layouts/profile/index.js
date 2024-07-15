/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// @mui material components
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";

// @mui icons
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import ProfileInfoCard from "examples/Cards/InfoCards/ProfileInfoCard";
// Overview page components
import Header from "layouts/profile/components/Header";
import AcademicInfo from "./components/AcademicInfo";
import CommonInfo from "./components/CommonInfo";
import { Card, Switch } from "@mui/material";
import DetailsInfo from "./components/DetailsInfo";
import { getTeacherByID } from "services/TeacherService";
import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import PropTypes from "prop-types";

const accessToken = localStorage.getItem("authToken");

function Overview() {
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const permissions = localStorage.getItem("permissions");
  const [currentData, setCurrentData] = useState();
  const teacherID = currentUser.id;

  const { data, error, isLoading } = useQuery(["teacherState", { accessToken, teacherID }], () =>
    getTeacherByID(accessToken, teacherID)
  );

  useEffect(() => {
    setCurrentData(data);
  }, [data]);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox mb={2} />
      <Header currentUser={currentData} permissions={permissions}>
        <MDBox mt={5} mb={3}>
          <Grid container spacing={1}>
            <Grid item xs={12} md={4}>
              <CommonInfo currentUser={currentData} permissions={permissions} />
            </Grid>
            <Grid item xs={12} md={4} sx={{ display: "flex" }}>
              <Divider orientation="vertical" sx={{ ml: -2, mr: 1 }} />
              <DetailsInfo currentUser={currentData} permissions={permissions} />
              <Divider orientation="vertical" sx={{ mx: 0 }} />
            </Grid>
            <Grid item xs={12} md={4}>
              <AcademicInfo currentUser={currentData} permissions={permissions} />
            </Grid>
          </Grid>
        </MDBox>
      </Header>
      <Footer />
    </DashboardLayout>
  );
}

export default Overview;
