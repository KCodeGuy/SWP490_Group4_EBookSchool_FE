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

import { useEffect, useState } from "react";

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
import bgImage from "assets/images/slider1.png";
import ButtonComponent from "components/ButtonComponent/ButtonComponent";
import InputBaseComponent from "components/InputBaseComponent/InputBaseComponent";
import { useForm, Controller } from "react-hook-form";
import { loginUser } from "../../../services/AuthService";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { CircularProgress } from "@mui/material";
import { getUserRole } from "utils/handleUser";
import { getSetting } from "services/SettingService";
import { useToasts } from "react-toast-notifications";

function Basic() {
  const { addToast } = useToasts();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [currentUser, setCurrentUser] = useState({});

  const {
    control,
    handleSubmit,
    setValue: noSetValue,
    formState: { errors },
  } = useForm();

  const {
    data: schoolSetting,
    error,
    isLoading,
  } = useQuery(["settingState"], () => getSetting(), { staleTime: Infinity });

  const mutation = useMutation((loginData) => loginUser(loginData), {
    onSuccess: (data) => {
      if (data && data?.status == 200) {
        if (schoolSetting) {
          localStorage.setItem("schoolSetting", JSON.stringify(schoolSetting));
        }
        localStorage.setItem("authToken", data?.data?.accessToken);
        if (data?.data?.permissions) {
          localStorage.setItem("permissions", data?.data?.permissions);
        }
        localStorage.setItem("user", JSON.stringify(data?.data?.user));
        localStorage.setItem("schoolYears", JSON.stringify(data?.data?.schoolYears));
        const formattedArray = Object.keys(data?.data?.classes).map((schoolYear) => ({
          schoolYear,
          details: data?.data?.classes[schoolYear],
        }));
        localStorage.setItem("currentClasses", JSON.stringify(formattedArray));
        if (data?.data?.roles) {
          if (data?.data?.roles.includes("Supervisor")) {
            localStorage.setItem("userRole", "Headteacher");
          } else {
            localStorage.setItem("userRole", data?.data?.roles?.toString());
          }
        }
        console.clear();
        navigate("/dashboard");
      } else {
        addToast("Tên đăng nhập hoặc tài khoản không chính xác!", {
          appearance: "error",
        });
        setCurrentUser(data?.data);
      }
    },
    onError: () => {
      addToast("Tên đăng nhập hoặc tài khoản không chính xác!", {
        appearance: "error",
      });
    },
  });

  useEffect(() => {
    queryClient.prefetchQuery("settingState", getSetting);
  }, [queryClient]);

  const handleSubmitLogin = (data) => {
    if (data) {
      mutation.mutate(data);
    }
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
              {schoolSetting?.schoolName || "Online-Register-Notebook"}
            </MDTypography>
          </MDBox>
        </MDBox>
        <MDBox pt={2} pb={3} px={3}>
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
                  message: "Mật khẩu ít nhất 6 kí tự!",
                },
                maxLength: {
                  value: 20,
                  message: "Mật khẩu dài nhất 20 kí tự!",
                },
              }}
            />
            <MDBox mt={1} mb={1} textAlign="center">
              <MDTypography variant="button" color="text">
                Hãy đăng nhập tài khoản của bạn!
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
