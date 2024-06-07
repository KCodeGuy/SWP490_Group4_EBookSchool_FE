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
import MarkunreadIcon from "@mui/icons-material/Markunread";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CakeIcon from "@mui/icons-material/Cake";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";
import GroupIcon from "@mui/icons-material/Group";
import BoyIcon from "@mui/icons-material/Boy";
import DomainIcon from "@mui/icons-material/Domain";
import MilitaryTechIcon from "@mui/icons-material/MilitaryTech";
import Switch from "@mui/material/Switch";
import PropTypes from "prop-types";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

function DetailsInfo({ currentUser, permissions }) {
  return (
    <Card sx={{ boxShadow: "none", width: "100%" }}>
      <MDBox p={2}>
        <MDTypography variant="h6" fontWeight="medium" textTransform="capitalize">
          THÔNG TIN CHI TIẾT
        </MDTypography>
      </MDBox>
      <MDBox pt={1} pb={2} px={2} lineHeight={1.25}>
        {/* <div className="flex items-center">
          <AccountCircleIcon />
          <span className="text-base font-bold mx-2">Họ và tên: </span>
          <span className="text-sm text-color">
            {currentUser.fullname ? currentUser.fullname : "Chưa có thông tin!"}
          </span>
        </div> */}
        <div className="flex items-center">
          <CakeIcon />
          <span className="text-base font-bold mx-2">Ngày sinh: </span>
          <span className="text-sm text-color">
            {currentUser
              ? new Date(currentUser.birthday).toLocaleDateString("vi-VN", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })
              : "Chưa có thông tin!"}
          </span>
        </div>
        <div className="flex items-center mt-4">
          <DomainIcon />
          <span className="text-base font-bold mx-2">Nơi sinh: </span>
          <span className="text-sm text-color">
            {/* Chỗ này phải là nơi sinh */}
            {currentUser ? currentUser.birthplace : "Chưa có thông tin!"}
          </span>
        </div>
        <div className="flex items-center mt-4">
          <BoyIcon />
          <span className="text-base font-bold mx-2">Giới tính: </span>
          <span className="text-sm text-color">
            {currentUser ? currentUser.gender : "Chưa có thông tin!"}
          </span>
        </div>
        <div className="flex items-center mt-4">
          <GroupIcon />
          <span className="text-base font-bold mx-2">Dân tộc: </span>
          {}
          <span className="text-sm text-color">
            {currentUser ? currentUser.nation : "Chưa có thông tin!"}
          </span>
        </div>
        <div className="flex items-center mt-4">
          <MilitaryTechIcon />
          <span className="text-base font-bold mx-2">Con liệt sĩ, thương binh: </span>
          {}
          <span className="text-sm text-color">
            {currentUser ? (currentUser.isMartyrs ? "Có" : "Không") : "Chưa có thông tin!"}
          </span>
        </div>
        <div className="flex items-center mt-4">
          <PhoneIphoneIcon />
          <span className="text-base font-bold mx-2">Số điện thoại: </span>
          <span className="text-sm text-color">
            {currentUser ? currentUser.phone : "Chưa có thông tin!"}
          </span>
        </div>
        <div className="flex items-center mt-4">
          <LocationOnIcon />
          <span className="text-base font-bold mx-2">Địa chỉ: </span>
          <span className="text-sm text-color">
            {currentUser ? currentUser.address : "Chưa có thông tin!"}
          </span>
        </div>
      </MDBox>
    </Card>
  );
}
DetailsInfo.propTypes = {
  currentUser: PropTypes.object,
  permissions: PropTypes.any,
};

export default DetailsInfo;
