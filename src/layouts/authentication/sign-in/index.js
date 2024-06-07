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
import { Link, useNavigate } from "react-router-dom";

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
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Images
import bgImage from "assets/images/slider2.png";
import ButtonComponent from "components/ButtonComponent/ButtonComponent";
import InputBaseComponent from "components/InputBaseComponent/InputBaseComponent";
import { useForm, Controller } from "react-hook-form";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import { loginUser } from "../../../services/AuthService";
import { useMutation, useQuery } from "react-query";
import { CircularProgress } from "@mui/material";
import { getTeacherByID } from "services/TeacherService";
import { getStudentByID } from "services/StudentService";
import { getUserRole } from "utils/handleUser";
import { getAllClasses } from "services/ClassService";

function Basic() {
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState({});

  const {
    control,
    handleSubmit,
    setValue: noSetValue,
    formState: { errors },
  } = useForm();

  const mutation = useMutation(loginUser, {
    onSuccess: (data) => {
      if (data.success) {
        localStorage.setItem("authToken", data.data.accessToken); // Example: saving a token
        localStorage.setItem("refreshToken", data.data.refreshToken); // Example: saving a token
        localStorage.setItem("permissions", data.data.permissions); // Example: saving a token
        localStorage.setItem("user", JSON.stringify(data.data.user)); // Example: saving use
        const userRole = getUserRole(
          data.data.user.id.toString(),
          data.data.permissions.toString()
        );
        localStorage.setItem("userRole", userRole); // Example: saving use
        navigate("/dashboard");
        // toast.success("Đăng nhập thành công!");
      } else {
        toast.error(data.data);
      }
      setCurrentUser(data);
    },
  });

  const handleSubmitLogin = (data) => {
    const username = data.username;
    const password = data.password;
    mutation.mutate({ username, password });
  };
  return (
    <BasicLayout image={bgImage}>
      <ToastContainer autoClose={3000} />
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
        </MDBox>
        <MDBox pt={2} pb={3} px={3}>
          {/* <span className="error-color text-base">
            {!currentUser.success ? currentUser.data : ""}
          </span> */}
          <form onSubmit={handleSubmit(handleSubmitLogin)} className="w-full">
            <InputBaseComponent
              placeholder="Tên đăng nhập..."
              type="text"
              control={control}
              setValue={noSetValue}
              name="username"
              label="Tên đăng nhập"
              errors={errors}
              validationRules={{
                required: "Không được bỏ trống!",
                minLength: {
                  value: 4,
                  message: "Tên đăng nhập ít nhất 4 kí tự!",
                },
              }}
            />
            <InputBaseComponent
              placeholder="Mật khẩu..."
              type="password"
              control={control}
              setValue={noSetValue}
              name="password"
              label="Mật khẩu"
              errors={errors}
              validationRules={{
                required: "Không được bỏ trống!",
                minLength: {
                  value: 6,
                  message: "Mật khẩu ít nhất 8 kí tự!",
                },
                maxLength: {
                  value: 20,
                  message: "Mật khẩu dài nhất 20 kí tự!",
                },
              }}
            />
            <MDBox mt={1} mb={1} textAlign="center">
              <MDTypography variant="button" color="text">
                Bạn đã{" "}
                <MDTypography
                  component={Link}
                  to="/authentication/reset-password"
                  variant="button"
                  color="info"
                  fontWeight="medium"
                  textGradient
                >
                  quên mật khẩu?
                </MDTypography>
                , cập nhật ngay!
              </MDTypography>
            </MDBox>
            <ButtonComponent style={{ marginTop: "12px", width: "100%" }} action="submit">
              {mutation?.isLoading ? <CircularProgress size={20} color="inherit" /> : "ĐĂNG NHẬP"}
            </ButtonComponent>
          </form>
        </MDBox>
      </Card>
    </BasicLayout>
  );
}

export default Basic;
