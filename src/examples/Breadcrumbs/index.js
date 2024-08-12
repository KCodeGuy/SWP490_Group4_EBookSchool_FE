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

// react-router-dom components
import { Link } from "react-router-dom";

// prop-types is a library for typechecking of props.
import PropTypes from "prop-types";

// @mui material components
import { Breadcrumbs as MuiBreadcrumbs } from "@mui/material";
import Icon from "@mui/material/Icon";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import { grey } from "@mui/material/colors";

function Breadcrumbs({ icon, title, route, light }) {
  const routes = route.slice(0, -1);
  return (
    <MDBox mr={{ xs: 0, xl: 8 }}>
      <MuiBreadcrumbs
        sx={{
          "& .MuiBreadcrumbs-separator": {
            color: ({ palette: { white, grey } }) => (light ? white.main : grey[600]),
          },
        }}
      >
        <Link to="/">
          <MDTypography
            component="span"
            variant="body2"
            color="dark"
            opacity={light ? 0.8 : 0.5}
            sx={{ lineHeight: 0 }}
          >
            <Icon>{icon}</Icon>
          </MDTypography>
        </Link>
        <Link
          to={`/${
            route[0] == "takeAttendance"
              ? "Điểm danh"
              : route[0] == "notificationDetails"
              ? "Chi tiết thông báo"
              : route[0] == "studentProfile"
              ? "Tài khoản"
              : route[0] == "logHistory" && route[1]
              ? "Ghi log"
              : route
          }`}
          key={
            route[0] == "takeAttendance"
              ? "Điểm danh"
              : route[0] == "notificationDetails"
              ? "Chi tiết thông báo"
              : route[0] == "studentProfile"
              ? "Tài khoản"
              : route[0] == "logHistory" && route[1]
              ? "Ghi log"
              : route
          }
        >
          <MDTypography
            component="span"
            variant="button"
            fontWeight="regular"
            textTransform="capitalize"
            color="dark"
            opacity={light ? 0.8 : 0.5}
            sx={{ lineHeight: 0 }}
          >
            {route[0] == "takeAttendance"
              ? "Điểm danh"
              : route[0] == "notificationDetails"
              ? "Chi tiết thông báo"
              : route[0] == "studentProfile"
              ? "Tài khoản"
              : route[0] == "logHistory" && route[1]
              ? "Ghi log"
              : title.replace("-", " ")}
          </MDTypography>
        </Link>
      </MuiBreadcrumbs>
      <MDTypography fontWeight="bold" textTransform="capitalize" variant="h6" color="dark" noWrap>
        {route[0] == "takeAttendance"
          ? "Điểm danh"
          : route[0] == "notificationDetails"
          ? "Chi tiết thông báo"
          : route[0] == "studentProfile"
          ? "Tài khoản"
          : route[0] == "logHistory" && route[1]
          ? "Ghi log"
          : title.replace("-", " ")}
      </MDTypography>
    </MDBox>
  );
}

// Setting default values for the props of Breadcrumbs
Breadcrumbs.defaultProps = {
  light: false,
};

// Typechecking props for the Breadcrumbs
Breadcrumbs.propTypes = {
  icon: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  route: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  light: PropTypes.bool,
};

export default Breadcrumbs;
