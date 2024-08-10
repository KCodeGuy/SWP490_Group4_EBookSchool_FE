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

import { useState, useEffect } from "react";

// react-router components
import { useLocation, Link, useNavigate } from "react-router-dom";

// prop-types is a library for typechecking of props.
import PropTypes from "prop-types";

// @material-ui core components
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import Icon from "@mui/material/Icon";
import LogoutIcon from "@mui/icons-material/Logout";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDInput from "components/MDInput";

// Material Dashboard 2 React example components
import Breadcrumbs from "examples/Breadcrumbs";
import NotificationItem from "examples/Items/NotificationItem";

// Custom styles for DashboardNavbar
import {
  navbar,
  navbarContainer,
  navbarRow,
  navbarIconButton,
  navbarMobileMenu,
} from "examples/Navbars/DashboardNavbar/styles";

// Material Dashboard 2 React context
import {
  useMaterialUIController,
  setTransparentNavbar,
  setMiniSidenav,
  setOpenConfigurator,
} from "context";
import CancelIcon from "@mui/icons-material/Cancel";
import { Grid, useMediaQuery } from "@mui/material";
import MDAvatar from "components/MDAvatar";
import { logoutUser } from "services/AuthService";
import PopupComponent from "components/PopupComponent/PopupComponent";
import ButtonComponent from "components/ButtonComponent/ButtonComponent";
import { getRouteName } from "utils/CommonFunctions";
import { logoutAPI } from "services/AuthService";
import { QueryClient, useMutation } from "react-query";
import { toast, ToastContainer } from "react-toastify";

function DashboardNavbar({ absolute, light, isMini }) {
  const navigate = useNavigate();
  const [navbarType, setNavbarType] = useState();
  const [controller, dispatch] = useMaterialUIController();
  const { miniSidenav, transparentNavbar, fixedNavbar, openConfigurator, darkMode } = controller;
  const [openMenu, setOpenMenu] = useState(false);
  const route = useLocation().pathname.split("/").slice(1);
  const [modalLogout, setModalLogout] = useState(false);
  let currentUser = JSON.parse(localStorage.getItem("user"));
  const userRole = localStorage.getItem("userRole");
  const queryClient = new QueryClient();
  const accessToken = localStorage.getItem("authToken");
  // Adding action
  const logoutAPIMutation = useMutation(() => logoutAPI(accessToken), {
    onSuccess: (response) => {
      queryClient.invalidateQueries("logoutAPI");
      if (response && response.status == 200) {
      } else {
        // addToast(`Đăng xuất thất bại!`);
      }
    },
    onError: (error) => {
      // addToast(`Đăng xuất thất bại!`);
    },
  });
  const handleLogoutUser = () => {
    logoutUser();
    setModalLogout(false);
    navigate("/authentication/sign-in");
    logoutAPIMutation.mutate();
    console.clear();
  };

  useEffect(() => {
    // Setting the navbar type
    if (fixedNavbar) {
      setNavbarType("sticky");
    } else {
      setNavbarType("sticky");
    }

    // A function that sets the transparent state of the navbar.
    function handleTransparentNavbar() {
      setTransparentNavbar(dispatch, (fixedNavbar && window.scrollY === 0) || !fixedNavbar);
    }

    /** 
     The event listener that's calling the handleTransparentNavbar function when 
     scrolling the window.
    */
    // window.addEventListener("scroll", handleTransparentNavbar);

    // Call the handleTransparentNavbar function to set the state with the initial value.
    // handleTransparentNavbar();

    // Remove event listener on cleanup
    // return () => window.removeEventListener("scroll", handleTransparentNavbar);
  }, [dispatch, fixedNavbar]);
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("lg"));
  const handleMiniSidenav = () => setMiniSidenav(dispatch, !miniSidenav);
  const handleConfiguratorOpen = () => setOpenConfigurator(dispatch, !openConfigurator);
  const handleOpenMenu = (event) => setOpenMenu(event.currentTarget);
  const handleCloseMenu = () => setOpenMenu(false);

  // Render the notifications menu
  const renderMenu = () => (
    <Menu
      anchorEl={openMenu}
      anchorReference={null}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
      open={Boolean(openMenu)}
      onClose={handleCloseMenu}
      sx={{ mt: 2 }}
    >
      <NotificationItem icon={<Icon>email</Icon>} title="Check new messages" />
      <NotificationItem icon={<Icon>podcasts</Icon>} title="Manage Podcast sessions" />
      <NotificationItem icon={<Icon>shopping_cart</Icon>} title="Payment successfully completed" />
    </Menu>
  );

  // Styles for the navbar icons
  const iconsStyle = ({ palette: { dark, white, text }, functions: { rgba } }) => ({
    color: () => {
      let colorValue = dark.main;
      return colorValue;
    },
  });

  return (
    <AppBar
      position={absolute ? "absolute" : navbarType}
      color="inherit"
      sx={
        ((theme) => navbar(theme, { transparentNavbar, absolute, light, darkMode }),
        { marginBottom: "12px", borderRadius: "10px", padding: "6px 0" })
      }
    >
      <ToastContainer autoClose={3000} />
      <Toolbar sx={(theme) => navbarContainer(theme)}>
        <MDBox color="inherit" mb={{ xs: 1, md: 0 }} sx={(theme) => navbarRow(theme, { isMini })}>
          <Breadcrumbs
            icon="home"
            route={route}
            title={getRouteName(route[route.length - 1])}
            light={light}
          />
        </MDBox>
        {isMini ? null : (
          <MDBox sx={(theme) => navbarRow(theme, { isMini })}>
            <div className="flex items-center">
              {/* <IconButton
                size="small"
                disableRipple
                color="inherit"
                sx={navbarIconButton}
                aria-controls="notification-menu"
                aria-haspopup="true"
                variant="contained"
                onClick={handleOpenMenu}
              >
                <Icon sx={iconsStyle}>notifications</Icon>
              </IconButton> */}
              {isSmallScreen && (
                <IconButton
                  size="small"
                  disableRipple
                  sx={{
                    color: "black", // Set the icon color to black
                    ...navbarMobileMenu, // Include your existing styles
                  }}
                  onClick={handleMiniSidenav}
                >
                  <Icon
                    sx={{
                      ...iconsStyle,
                      fontSize: "medium",
                    }}
                  >
                    {miniSidenav ? "menu_open" : "menu"}
                  </Icon>
                </IconButton>
              )}
              {/* <IconButton
                size="small"
                disableRipple
                color="inherit"
                sx={navbarIconButton}
                onClick={handleConfiguratorOpen}
              >
                <Icon sx={iconsStyle}>settings</Icon>
              </IconButton> */}
              {currentUser && (
                <div className="flex items-center text-base font-medium ml-2 ">
                  <Link to={userRole == "Student" ? "/studentProfile" : "/profile"}>
                    <div className="flex items-center">
                      <img
                        className="w-12 h-12 object-contain object-center shadow-md rounded-full"
                        src={currentUser?.avatar}
                        alt="user"
                      />
                      <span className=" ml-2 hover:text-blue-400 transition">
                        {currentUser?.fullname}
                      </span>
                    </div>
                  </Link>
                  <span className=" mx-2">|</span>
                  <div
                    className="cursor-pointer hover:text-blue-400 transition"
                    onClick={() => setModalLogout(true)}
                  >
                    Đăng xuất
                  </div>
                  <PopupComponent
                    title="ĐĂNG XUẤT"
                    icon={<LogoutIcon />}
                    isOpen={modalLogout}
                    onClose={() => setModalLogout(false)}
                  >
                    <p>Bạn có chắc chắn muốn đăng xuất?</p>
                    <div className="mt-4 flex justify-end">
                      <ButtonComponent
                        type="error"
                        action="button"
                        onClick={() => setModalLogout(false)}
                      >
                        <CancelIcon className="text-3xl mr-1 mb-0.5" />
                        HỦY BỎ
                      </ButtonComponent>
                      <ButtonComponent action="button" onClick={handleLogoutUser}>
                        <LogoutIcon className="mr-1" /> ĐĂNG XUẤT
                      </ButtonComponent>
                    </div>
                  </PopupComponent>
                </div>
              )}

              {renderMenu()}
            </div>
          </MDBox>
        )}
      </Toolbar>
    </AppBar>
  );
}

// Setting default values for the props of DashboardNavbar
DashboardNavbar.defaultProps = {
  absolute: false,
  light: true,
  isMini: false,
};

// Typechecking props for the DashboardNavbar
DashboardNavbar.propTypes = {
  absolute: PropTypes.bool,
  light: PropTypes.bool,
  isMini: PropTypes.bool,
};

export default DashboardNavbar;
