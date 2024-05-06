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
import SchoolBook from "./layouts/shoolBook/SchoolBook";
import Wiki from "./layouts/wiki/Wiki";
import MarkManagement from "./layouts/markManagement/MarkManagement";
import RoomManagement from "./layouts/roomManagement/RoomManagement";
import ClassManagement from "./layouts/classManagement/ClassManagement";
import SubjectManagement from "./layouts/subjectManagement/SubjectManagement";
import Demo from "./layouts/demo/Demo";
import WeeklyTimeTable from "./layouts/weeklyTimeTable";
import MarkStatistics from "./layouts/markStatistics/MarkStatistics";

const routes = [
  {
    type: "collapse",
    name: "Mark Management(HieuTTN)",
    key: "markManagement",
    icon: <Icon fontSize="small">assignment</Icon>,
    route: "/markManagement",
    component: <MarkManagement />,
  },
  {
    type: "collapse",
    name: "Mark Statistics(HieuTTN)",
    key: "markStatistics",
    icon: <Icon fontSize="small">assignment</Icon>,
    route: "/markStatistics",
    component: <MarkStatistics />,
  },
  {
    type: "collapse",
    name: "Demo(KhoaTD)",
    key: "demo",
    icon: <Icon fontSize="small">assignment</Icon>,
    route: "/demo",
    component: <Demo />,
  },
  {
    type: "collapse",
    name: "Room Management(UolLT)",
    key: "roomManagement",
    icon: <Icon fontSize="small">house</Icon>,
    route: "/roomManagement",
    component: <RoomManagement />,
  },
  {
    type: "collapse",
    name: "Class Management(UolLT)",
    key: "classManagement",
    icon: <Icon fontSize="small">house</Icon>,
    route: "/classManagement",
    component: <ClassManagement />,
  },
  {
    type: "collapse",
    name: "Subject Management(UolLT)",
    key: "subjectManagement",
    icon: <Icon fontSize="small">house</Icon>,
    route: "/subjectManagement",
    component: <SubjectManagement />,
  },
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
    name: "School Book(KhoaTD)",
    key: "schoolBook",
    icon: <Icon fontSize="small">table</Icon>,
    route: "/schoolBook",
    component: <SchoolBook />,
  },
  {
    type: "collapse",
    name: "Weekly Time Table(KhoaTD)",
    key: "weeklyTimeTable",
    icon: <Icon fontSize="small">assignment</Icon>,
    route: "/weeklyTimeTable",
    component: <WeeklyTimeTable />,
  },
  {
    type: "collapse",
    name: "Wiki(KhoaTD)",
    key: "wiki",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/wiki",
    component: <Wiki />,
  },
  {
    type: "collapse",
    name: "Profile",
    key: "profile",
    icon: <Icon fontSize="small">person</Icon>,
    route: "/profile",
    component: <Profile />,
  },
  {
    type: "collapse",
    name: "Sign In",
    key: "sign-in",
    icon: <Icon fontSize="small">login</Icon>,
    route: "/authentication/sign-in",
    component: <SignIn />,
  },
  {
    type: "collapse",
    name: "Reset Password",
    key: "reset-password",
    icon: <Icon fontSize="small">assignment</Icon>,
    route: "/authentication/reset-password",
    component: <ResetPassword />,
  },
];

export default routes;
