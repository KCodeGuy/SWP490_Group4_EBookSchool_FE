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

import { useState } from "react";

// @mui material components
import Card from "@mui/material/Card";
import Switch from "@mui/material/Switch";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import CardMembershipIcon from "@mui/icons-material/CardMembership";
import AnnouncementIcon from "@mui/icons-material/Announcement";
import PropTypes from "prop-types";

function AcademicInfo({ currentUser, permissions }) {
  return (
    <Card sx={{ boxShadow: "none" }}>
      <MDBox p={2}>
        <MDTypography variant="h6" fontWeight="medium" textTransform="capitalize">
          THÔNG TIN HỌC VẤN
        </MDTypography>
      </MDBox>
      <MDBox pt={1} pb={2} px={2} lineHeight={1.25}>
        {/* <div className="flex items-center">
          <MarkunreadIcon />
          <span className="text-base font-bold mx-2">Họ tên cha: </span>
          <span className="text-sm text-color">Nguyễn Văn B</span>
        </div>
        <div className="flex items-center mt-4">
          <MarkunreadIcon />
          <span className="text-base font-bold mx-2">Họ tên mẹ: </span>
          <span className="text-sm text-color">Nguyễn Thị C</span>
        </div>
        <div className="flex items-center mt-4">
          <MarkunreadIcon />
          <span className="text-base font-bold mx-2">Nghề nghiệp cha: </span>
          <span className="text-sm text-color">Làm nông</span>
        </div>
        <div className="flex items-center mt-4">
          <MarkunreadIcon />
          <span className="text-base font-bold mx-2">Nghề nghiệp cha: </span>
          <span className="text-sm text-color">Làm nông</span>
        </div>
        <div className="flex items-center mt-4">
          <MarkunreadIcon />
          <span className="text-base font-bold mx-2">Khác: </span>
          <span className="text-sm text-color">Không có thông tin</span>
        </div> */}
        <div className="flex items-center">
          <CardMembershipIcon />
          <span className="text-base font-bold mx-2">Cử nhân: </span>
          <span className="text-sm text-color">
            {currentUser ? (currentUser.isBachelor ? "Có" : "Không") : "Chưa có thông tin!"}
          </span>
        </div>
        <div className="flex items-center mt-4">
          <CardMembershipIcon />
          <span className="text-base font-bold mx-2">Thạc sĩ: </span>
          <span className="text-sm text-color">
            {currentUser ? (currentUser.isMaster ? "Có" : "Không") : "Chưa có thông tin!"}
          </span>
        </div>
        <div className="flex items-center mt-4">
          <CardMembershipIcon />
          <span className="text-base font-bold mx-2">Tiến sĩ: </span>
          <span className="text-sm text-color">
            {currentUser ? (currentUser.isDoctor ? "Có" : "Không") : "Chưa có thông tin!"}
          </span>
        </div>
        <div className="flex items-center mt-4">
          <CardMembershipIcon />
          <span className="text-base font-bold mx-2">Giáo sư: </span>
          <span className="text-sm text-color">
            {currentUser ? (currentUser.isProfessor ? "Có" : "Không") : "Chưa có thông tin!"}
          </span>
        </div>
        <div className="flex items-center mt-4">
          <AnnouncementIcon />
          <span className="text-base font-bold mx-2">Khác: </span>
          <span className="text-sm text-color">Không có thông tin</span>
        </div>
      </MDBox>
    </Card>
  );
}

AcademicInfo.propTypes = {
  currentUser: PropTypes.object,
  permissions: PropTypes.any,
};

export default AcademicInfo;
