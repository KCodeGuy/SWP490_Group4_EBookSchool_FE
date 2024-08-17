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

import { useState, useEffect, useMemo } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
// react-router components
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

// @mui material components
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Icon from "@mui/material/Icon";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";

// Material Dashboard 2 React example components
import Sidenav from "examples/Sidenav";
import Configurator from "examples/Configurator";

// Material Dashboard 2 React themes
import theme from "assets/theme";
import themeRTL from "assets/theme/theme-rtl";

// Material Dashboard 2 React Dark Mode themes
import themeDark from "assets/theme-dark";
import themeDarkRTL from "assets/theme-dark/theme-rtl";

// RTL plugins
import rtlPlugin from "stylis-plugin-rtl";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import Profile from "layouts/profile";
import StudentProfile from "./layouts/studentProfile";
import SignIn from "layouts/authentication/sign-in";
import ResetPassword from "layouts/authentication/reset-password";

// Material Dashboard 2 React routes
import {
  guestRoutes,
  headTeacherRoutes,
  homeRoomTeacherRoutes,
  routes,
  studentRoutes,
  subjectTeacherRoutes,
} from "./routes";

// Material Dashboard 2 React contexts
import { useMaterialUIController, setMiniSidenav, setOpenConfigurator } from "context";

// Images
import brandWhite from "assets/images/logo1.png";
import brandDark from "assets/images/logo1.png";
import { PRINCIPAL_ROLE } from "services/APIConfig";
import { SUBJECT_ROLE } from "services/APIConfig";
import { HOMEROOM_ROLE } from "services/APIConfig";
import { STUDENT_ROLE } from "services/APIConfig";
import { HEADTEACHER_ROLE } from "services/APIConfig";
import { ToastProvider } from "react-toast-notifications";
const queryClient = new QueryClient();

export default function App() {
  let userRole = localStorage.getItem("userRole");
  let schoolSetting = JSON.parse(localStorage.getItem("schoolSetting"));

  const [currentRoutes, setCurrentRoutes] = useState([]);
  useEffect(() => {
    if (userRole) {
      if (userRole.includes(PRINCIPAL_ROLE)) {
        setCurrentRoutes(routes);
      } else if (userRole.includes(HEADTEACHER_ROLE) || userRole.includes("Supervisor")) {
        setCurrentRoutes(headTeacherRoutes);
      } else if (userRole.includes(SUBJECT_ROLE)) {
        setCurrentRoutes(subjectTeacherRoutes);
      } else if (userRole.includes(HOMEROOM_ROLE)) {
        setCurrentRoutes(homeRoomTeacherRoutes);
      } else if (userRole.includes(STUDENT_ROLE)) {
        setCurrentRoutes(studentRoutes);
      } else {
        setCurrentRoutes(guestRoutes);
      }
    } else {
      setCurrentRoutes(guestRoutes);
    }
  }, [userRole]);
  const [controller, dispatch] = useMaterialUIController();
  const {
    miniSidenav,
    direction,
    layout,
    openConfigurator,
    sidenavColor,
    transparentSidenav,
    whiteSidenav,
    darkMode,
  } = controller;
  const [onMouseEnter, setOnMouseEnter] = useState(false);
  const [rtlCache, setRtlCache] = useState(null);
  const { pathname } = useLocation();

  // Cache for the rtl
  useMemo(() => {
    const cacheRtl = createCache({
      key: "rtl",
      stylisPlugins: [rtlPlugin],
    });

    setRtlCache(cacheRtl);
  }, []);

  // Open sidenav when mouse enter on mini sidenav
  const handleOnMouseEnter = () => {
    if (miniSidenav && !onMouseEnter) {
      setMiniSidenav(dispatch, false);
      setOnMouseEnter(true);
    }
  };

  // Close sidenav when mouse leave mini sidenav
  const handleOnMouseLeave = () => {
    if (onMouseEnter) {
      setMiniSidenav(dispatch, true);
      setOnMouseEnter(false);
    }
  };

  // Change the openConfigurator state
  const handleConfiguratorOpen = () => setOpenConfigurator(dispatch, !openConfigurator);

  // Setting the dir attribute for the body element
  // useEffect(() => {
  //   document.body.setAttribute("dir", direction);
  // }, [direction]);

  // Setting page scroll to 0 when changing the route
  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
  }, [pathname]);

  const getRoutes = (allRoutes) =>
    allRoutes.map((route) => {
      if (route.collapse) {
        return getRoutes(route.collapse);
      }

      if (route.route) {
        return <Route exact path={route.route} element={route.component} key={route.key} />;
      }

      return null;
    });

  const configsButton = (
    <MDBox
      display="none"
      justifyContent="center"
      alignItems="center"
      width="3.25rem"
      height="3.25rem"
      bgColor="white"
      shadow="sm"
      borderRadius="50%"
      position="fixed"
      right="2rem"
      bottom="2rem"
      zIndex={99}
      color="dark"
      sx={{ cursor: "pointer" }}
      onClick={handleConfiguratorOpen}
    >
      <Icon fontSize="small" color="inherit">
        settings
      </Icon>
    </MDBox>
  );

  return (
    <ToastProvider autoDismiss autoDismissTimeout={3000} placement="top-right">
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={darkMode ? themeDark : theme}>
          <CssBaseline />
          {layout === "dashboard" && (
            <>
              <Sidenav
                color={sidenavColor}
                brand={whiteSidenav ? brandWhite : brandWhite}
                brandName={schoolSetting?.schoolName || "ORB"}
                routes={currentRoutes}
                onMouseEnter={handleOnMouseEnter}
                onMouseLeave={handleOnMouseLeave}
              />
              <Configurator />
              {configsButton}
            </>
          )}
          {layout === "vr" && <Configurator />}
          <Routes>
            {getRoutes(currentRoutes)}
            {userRole ? (
              pathname === "/" ? (
                <Route path="*" element={<Navigate to="/dashboard" />} />
              ) : (
                <Route path="*" element={<Navigate to={pathname} />} />
              )
            ) : (
              <Route path="*" element={<Navigate to="/authentication/sign-in" />} />
            )}
          </Routes>
        </ThemeProvider>
      </QueryClientProvider>
    </ToastProvider>
  );
}
