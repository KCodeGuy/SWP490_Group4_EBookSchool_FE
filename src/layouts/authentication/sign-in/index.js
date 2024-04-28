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

// react-router-dom components
import { Link } from "react-router-dom";

// @mui material components
import Card from "@mui/material/Card";
import Switch from "@mui/material/Switch";
import Grid from "@mui/material/Grid";
import MuiLink from "@mui/material/Link";

// @mui icons
import FacebookIcon from "@mui/icons-material/Facebook";
import GitHubIcon from "@mui/icons-material/GitHub";
import GoogleIcon from "@mui/icons-material/Google";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";

// Authentication layout components
import BasicLayout from "layouts/authentication/components/BasicLayout";

// Images
import bgImage from "assets/images/bg-sign-in-basic.jpeg";
import ButtonComponent from "components/ButtonComponent/ButtonComponent";
import InputBaseComponent from "components/InputBaseComponent/InputBaseComponent";
import { useForm, Controller } from "react-hook-form";
import VpnKeyIcon from "@mui/icons-material/VpnKey";

function Basic() {
  const [rememberMe, setRememberMe] = useState(false);

  const handleSetRememberMe = () => setRememberMe(!rememberMe);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleSubmitLogin = (data) => {
    console.log(data); // You can do something with the form data here
  };
  return (
    <BasicLayout image={bgImage}>
      <Card>
        <MDBox
          variant="gradient"
          bgColor="info"
          borderRadius="lg"
          coloredShadow="info"
          mx={2}
          mt={-3}
          p={2}
          mb={1}
          textAlign="center"
        >
          <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
            Đăng nhập
          </MDTypography>
          <MDBox mt={1} mb={1} textAlign="center">
            <MDTypography variant="button" color="white" fontWeight="medium">
              Trường THSC&THPT Nguyen Van A
            </MDTypography>
          </MDBox>
          {/* <Grid container spacing={3} justifyContent="center" sx={{ mb: 2 }}>
            <Grid item xs={2}>
              <MDTypography component={MuiLink} href="#" variant="body1" color="white">
                <FacebookIcon color="inherit" />
              </MDTypography>
            </Grid>
            <Grid item xs={2}>
              <MDTypography component={MuiLink} href="#" variant="body1" color="white">
                <GitHubIcon color="inherit" />
              </MDTypography>
            </Grid>
            <Grid item xs={2}>
              <MDTypography component={MuiLink} href="#" variant="body1" color="white">
                <GoogleIcon color="inherit" />
              </MDTypography>
            </Grid>
          </Grid> */}
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          {/* <MDBox component="form" role="form">
            <MDBox mb={2}>
              <MDInput type="email" label="Email" fullWidth />
            </MDBox>
            <MDBox mb={2}>
              <MDInput type="password" label="Password" fullWidth />
            </MDBox>
            <MDBox display="flex" alignItems="center" ml={-1}>
              <Switch checked={rememberMe} onChange={handleSetRememberMe} />
              <MDTypography
                variant="button"
                fontWeight="regular"
                color="text"
                onClick={handleSetRememberMe}
                sx={{ cursor: "pointer", userSelect: "none", ml: -1 }}
              >
                &nbsp;&nbsp;Remember me
              </MDTypography>
            </MDBox>
            <MDBox mt={4} mb={1}>
              <MDButton variant="gradient" color="info" fullWidth>
                sign in
              </MDButton>
            </MDBox>
            <MDBox mt={3} mb={1} textAlign="center">
              <MDTypography variant="button" color="text">
                Don&apos;t have an account?{" "}
                <MDTypography
                  component={Link}
                  to="/authentication/sign-up"
                  variant="button"
                  color="info"
                  fontWeight="medium"
                  textGradient
                >
                  Sign up
                </MDTypography>
              </MDTypography>
            </MDBox>
          </MDBox> */}
          <form onSubmit={handleSubmit(handleSubmitLogin)} className="w-full">
            <InputBaseComponent
              placeholder="Nhập địa chỉ email"
              type="email"
              control={control}
              name="email"
              label="Email"
              errors={errors}
              validationRules={{
                required: "Email không được bỏ trống!",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Email không đúng định dạng!",
                },
              }}
            />
            <InputBaseComponent
              placeholder="Nhập mật khẩu"
              type="password"
              control={control}
              name="password"
              label="Mật khẩu"
              errors={errors}
              validationRules={{
                required: "Mật khẩu không được bỏ trống",
                minLength: {
                  value: 8,
                  message: "Mật khẩu ít nhât 8 kí tự!",
                },
                maxLength: {
                  value: 20,
                  message: "Mật khẩu dài nhất 20 kí tự",
                },
              }}
            />
            <MDBox mt={3} mb={1} textAlign="center">
              <MDTypography variant="button" color="text">
                Bạn đã quên mật khẩu?{" "}
                <MDTypography
                  component={Link}
                  to="/authentication/reset-password"
                  variant="button"
                  color="info"
                  fontWeight="medium"
                  textGradient
                >
                  Nhấn vào đây!
                </MDTypography>
              </MDTypography>
            </MDBox>
            <ButtonComponent style={{ marginTop: "12px", width: "100%" }} action="submit">
              ĐĂNG NHẬP
            </ButtonComponent>
          </form>
        </MDBox>
      </Card>
    </BasicLayout>
  );
}

export default Basic;
