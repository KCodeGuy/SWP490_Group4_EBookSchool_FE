/* eslint-disable react/jsx-no-undef */
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

/** 
  All of the routes for the Material Dashboard 2 React are added here,
  You can add a new route, customize the routes and delete the routes here.

  Once you add a new route on this file it will be visible automatically on
  the Sidenav.

  For adding a new route you can follow the existing routes in the routes array.
  1. The `type` key with the `collapse` value is used for a route.
  2. The `type` key with the `title` value is used for a title inside the Sidenav. 
  3. The `type` key with the `divider` value is used for a divider between Sidenav items.
  4. The `name` key is used for the name of the route on the Sidenav.
  5. The `key` key is used for the key of the route (It will help you with the key prop inside a loop).
  6. The `icon` key is used for the icon of the route on the Sidenav, you have to add a node.
  7. The `collapse` key is used for making a collapsible item on the Sidenav that has other routes
  inside (nested routes), you need to pass the nested routes inside an array as a value for the `collapse` key.
  8. The `route` key is used to store the route location which is used for the react router.
  9. The `href` key is used to store the external links location.
  10. The `title` key is only for the item with the type of `title` and its used for the title text on the Sidenav.
  10. The `component` key is used to store the component of its route.
*/

// Material Dashboard 2 React layouts
import Dashboard from "layouts/dashboard";
import Profile from "layouts/profile";
import SignIn from "layouts/authentication/sign-in";
import ResetPassword from "layouts/authentication/reset-password";

// @mui icons
import Icon from "@mui/material/Icon";
import SchoolBook from "./layouts/shoolBook";
import Wiki from "./layouts/wiki/Wiki";
import MarkManagement from "./layouts/markManagement";
import RoomManagement from "./layouts/roomManagement/RoomManagement";
import ClassManagement from "./layouts/classManagement/ClassManagement";
import NotificationManagement from "./layouts/notificationManagement/NotificationManagement";
import SubjectManagement from "./layouts/subjectManagement/SubjectManagement";
import AccountManagement from "./layouts/accountManagement/AccountManagement";
import Demo from "./layouts/demo/Demo";
import WeeklyTimeTable from "./layouts/weeklyTimeTable";
import MarkStatistics from "./layouts/markStatistics/MarkStatistics";
import TakeAttendance from "layouts/takeAttendance";
import AcademicPerformanceStatistics from "./layouts/academicPerformanceStatistics/AcademicPerformanceStatistics";
import ConductStatistics from "./layouts/conductStatistics/ConductStatistics";
import NotificationDetails from "layouts/notificationDetails/NotificationDetails";
import LogManagement from "layouts/logManagement/LogManagement";
import SystemSetting from "layouts/systemSetting";
import RegisterNotebookStatistics from "layouts/registerNotebookStatistics/RegisterNotebookStatistics";

const routes = [
  {
    type: "collapse",
    name: "Dashboard",
    key: "dashboard",
    icon: <Icon fontSize="small">home</Icon>,
    route: "/dashboard",
    component: <Dashboard />,
  },
  {
    type: "collapse",
    name: "Thống kê điểm",
    key: "markStatistics",
    icon: <Icon fontSize="small">assignment</Icon>,
    route: "/markStatistics",
    component: <MarkStatistics />,
  },
  {
    type: "collapse",
    name: "Thống kê học lực",
    key: "academicPerformanceStatistics",
    icon: <Icon fontSize="small">assignment</Icon>,
    route: "/academicPerformanceStatistics",
    component: <AcademicPerformanceStatistics />,
  },
  {
    type: "collapse",
    name: "Thống kê hạnh kiểm",
    key: "conductStatistics",
    icon: <Icon fontSize="small">assignment</Icon>,
    route: "/conductStatistics",
    component: <ConductStatistics />,
  },
  {
    type: "collapse",
    name: "Thống kê sổ đầu bài",
    key: "registerNotebookStatistics",
    icon: <Icon fontSize="small">assignment</Icon>,
    route: "/registerNotebookStatistics",
    component: <RegisterNotebookStatistics />,
  },
  {
    type: "collapse",
    name: "Quản lí điểm",
    key: "markManagement",
    icon: <Icon fontSize="small">assignment</Icon>,
    route: "/markManagement",
    component: <MarkManagement />,
  },
  {
    type: "collapse",
    name: "Quản lí lớp",
    key: "classManagement",
    icon: <Icon fontSize="small">house</Icon>,
    route: "/classManagement",
    component: <ClassManagement />,
  },
  {
    type: "collapse",
    name: "Quản lí môn",
    key: "subjectManagement",
    icon: <Icon fontSize="small">house</Icon>,
    route: "/subjectManagement",
    component: <SubjectManagement />,
  },
  {
    type: "collapse",
    name: "Quản lí thông báo",
    key: "notificationManagement",
    icon: <Icon fontSize="small">house</Icon>,
    route: "/notificationManagement",
    component: <NotificationManagement />,
  },

  {
    type: "collapse",
    name: "Quản lí tài khoản",
    key: "accountManagement",
    icon: <Icon fontSize="small">house</Icon>,
    route: "/accountManagement",
    component: <AccountManagement />,
  },

  {
    type: "collapse",
    name: "Sổ đầu bài",
    key: "schoolBook",
    icon: <Icon fontSize="small">table</Icon>,
    route: "/schoolBook",
    component: <SchoolBook />,
  },
  {
    type: "collapse",
    name: "Thông báo",
    key: "notificationDetails",
    icon: <Icon fontSize="small">table</Icon>,
    route: "/notificationDetails",
    component: <NotificationDetails />,
  },
  {
    type: "collapse",
    name: "Thời khóa biểu",
    key: "weeklyTimeTable",
    icon: <Icon fontSize="small">assignment</Icon>,
    route: "/weeklyTimeTable",
    component: <WeeklyTimeTable />,
  },
  {
    type: "collapse",
    name: "Điểm danh",
    key: "takeAttendance",
    icon: <Icon fontSize="small">assignment</Icon>,
    route: "/takeAttendance",
    component: <TakeAttendance />,
  },

  {
    type: "collapse",
    name: "Đăng nhập",
    key: "sign-in",
    icon: <Icon fontSize="small">login</Icon>,
    route: "/authentication/sign-in",
    component: <SignIn />,
  },
  {
    type: "collapse",
    name: "Thông tin tài khoản",
    key: "profile",
    icon: <Icon fontSize="small">person</Icon>,
    route: "/profile",
    component: <Profile />,
  },

  {
    type: "collapse",
    name: "Wiki",
    key: "wiki",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/wiki",
    component: <Wiki />,
  },

  {
    type: "collapse",
    name: "Demo",
    key: "demo",
    icon: <Icon fontSize="small">assignment</Icon>,
    route: "/demo",
    component: <Demo />,
  },

  {
    type: "collapse",
    name: "Quên mật khẩu",
    key: "reset-password",
    icon: <Icon fontSize="small">assignment</Icon>,
    route: "/authentication/reset-password",
    component: <ResetPassword />,
  },

  {
    type: "collapse",
    name: "Ghi log",
    key: "logHistory",
    icon: <Icon fontSize="small">house</Icon>,
    route: "/logHistory",
    component: <LogManagement />,
  },
  {
    type: "collapse",
    name: "Cài đặt hệ thống",
    key: "systemSetting",
    icon: <Icon fontSize="small">house</Icon>,
    route: "/systemSetting",
    component: <SystemSetting />,
  },
];

export default routes;
