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
import Switch from "@mui/material/Switch";
import PropTypes from "prop-types";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

function DetailsInfo({ currentUser, permissions }) {
  console.log(currentUser);
  return (
    <Card sx={{ boxShadow: "none", width: "100%" }}>
      <MDBox p={2}>
        <MDTypography variant="h6" fontWeight="medium" textTransform="capitalize">
          THÔNG TIN CHI TIẾT
        </MDTypography>
      </MDBox>
      <MDBox pt={1} pb={2} px={2} lineHeight={1.25}>
        <div className="flex items-center">
          <MarkunreadIcon />
          <span className="text-base font-bold mx-2">Họ và tên: </span>
          <span className="text-sm text-color">
            {currentUser.fullname ? currentUser.fullname : "Chưa có thông tin!"}
          </span>
        </div>
        <div className="flex items-center mt-4">
          <MarkunreadIcon />
          <span className="text-base font-bold mx-2">Ngày sinh: </span>
          <span className="text-sm text-color">
            {currentUser.birthday ? currentUser.birthday : "Chưa có thông tin!"}
          </span>
        </div>
        <div className="flex items-center mt-4">
          <MarkunreadIcon />
          <span className="text-base font-bold mx-2">giới tính: </span>
          <span className="text-sm text-color">
            {currentUser.gender ? currentUser.gender : "Chưa có thông tin!"}
          </span>
        </div>
        <div className="flex items-center mt-4">
          <MarkunreadIcon />
          <span className="text-base font-bold mx-2">Dân tộc: </span>
          {}
          <span className="text-sm text-color">
            {currentUser.nation ? currentUser.nation : "Chưa có thông tin!"}
          </span>
        </div>
        <div className="flex items-center mt-4">
          <MarkunreadIcon />
          <span className="text-base font-bold mx-2">Số điện thoại: </span>
          <span className="text-sm text-color">
            {currentUser.phone ? currentUser.phone : "Chưa có thông tin!"}
          </span>
        </div>
        <div className="flex items-center mt-4">
          <MarkunreadIcon />
          <span className="text-base font-bold mx-2">Email: </span>
          <span className="text-sm text-color">
            {currentUser.email ? currentUser.email : "Chưa có thông tin!"}
          </span>
        </div>
        <div className="flex items-center mt-4">
          <MarkunreadIcon />
          <span className="text-base font-bold mx-2">Địa chỉ: </span>
          <span className="text-sm text-color">
            {currentUser.address ? currentUser.address : "Chưa có thông tin!"}
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
