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
import MarkunreadIcon from "@mui/icons-material/Markunread";

// @mui material components
import Card from "@mui/material/Card";
import Switch from "@mui/material/Switch";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import ProfileInfoCard from "examples/Cards/InfoCards/ProfileInfoCard";

function CommonInfo() {
  const [followsMe, setFollowsMe] = useState(true);
  const [answersPost, setAnswersPost] = useState(false);
  const [mentionsMe, setMentionsMe] = useState(true);
  const [newLaunches, setNewLaunches] = useState(false);
  const [productUpdate, setProductUpdate] = useState(true);
  const [newsletter, setNewsletter] = useState(false);

  return (
    <Card sx={{ boxShadow: "none", width: "100%" }}>
      <MDBox p={2}>
        <MDTypography variant="h6" fontWeight="medium" textTransform="capitalize">
          THÔNG TIN CHUNG
        </MDTypography>
      </MDBox>
      <MDBox pt={1} pb={2} px={2} lineHeight={1.25}>
        <div className="flex items-center">
          <MarkunreadIcon />
          <span className="text-base font-bold mx-2">Tên đăng nhập: </span>
          <span className="text-sm text-color">KhoaTD</span>
        </div>
        <div className="flex items-center mt-4">
          <MarkunreadIcon />
          <span className="text-base font-bold mx-2">Mã số: </span>
          <span className="text-sm text-color">GV0001</span>
        </div>
        <div className="flex items-center mt-4">
          <MarkunreadIcon />
          <span className="text-base font-bold mx-2">Mật khẩu: </span>
          <span className="text-sm text-color">*******</span>
        </div>
        <div className="flex items-center mt-4">
          <MarkunreadIcon />
          <span className="text-base font-bold mx-2">Chức vụ: </span>
          <span className="text-sm text-color">Giáo viên</span>
        </div>
        <div className="flex items-center mt-4">
          <MarkunreadIcon />
          <span className="text-base font-bold mx-2">Ảnh đại diện: </span>
          <span className="text-sm text-color">Giáo viên</span>
        </div>
      </MDBox>
    </Card>
  );
}

export default CommonInfo;