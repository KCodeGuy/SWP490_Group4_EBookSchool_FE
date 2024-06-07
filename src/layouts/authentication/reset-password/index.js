import { Link } from "react-router-dom";

// @mui material components
import Card from "@mui/material/Card";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Authentication layout components
import CoverLayout from "layouts/authentication/components/CoverLayout";

// Images
import bgImage from "assets/images/bg-sign-up-cover.jpeg";
import InputBaseComponent from "components/InputBaseComponent/InputBaseComponent";
import { useForm, Controller } from "react-hook-form";
import ButtonComponent from "components/ButtonComponent/ButtonComponent";
import { useState } from "react";

function Cover() {
  const {
    control,
    handleSubmit,
    setValue: noSetValue,
    formState: { errors },
  } = useForm();

  const [isMatchedPassword, setIsMatchedPassword] = useState(true);

  const handleSubmitLogin = (data) => {
    console.log(data);
    const isCorrectPassword = data.password === data.passwordReset;
    setIsMatchedPassword(isCorrectPassword);
  };

  return (
    <CoverLayout image={bgImage}>
      <Card>
        <MDBox
          variant="gradient"
          bgColor="info"
          borderRadius="lg"
          coloredShadow="success"
          mx={2}
          mt={-3}
          p={3}
          mb={1}
          textAlign="center"
        >
          <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
            Đổi mật khẩu
          </MDTypography>
          <MDBox mt={1} mb={1} textAlign="center">
            <MDTypography variant="button" color="white" fontWeight="medium">
              Trường THSC&THPT Nguyen Van A
            </MDTypography>
          </MDBox>
        </MDBox>
        <MDBox pt={2} pb={3} px={3}>
          {!isMatchedPassword ? (
            <span className="text-base error-color mb-1">Mật khẩu nhập lại không khớp!</span>
          ) : (
            ""
          )}
          <form onSubmit={handleSubmit(handleSubmitLogin)} className="w-full">
            <InputBaseComponent
              placeholder="Tên đăng nhập..."
              type="text"
              control={control}
              name="username"
              setValue={noSetValue}
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
              placeholder="Nhập mật khẩu mới..."
              type="password"
              control={control}
              setValue={noSetValue}
              name="password"
              label="Mật khẩu"
              errors={errors}
              validationRules={{
                required: "không được bỏ trống!",
                minLength: {
                  value: 8,
                  message: "Mật khẩu ít nhất 8 kí tự!",
                },
                maxLength: {
                  value: 20,
                  message: "Mật khẩu dài nhất 20 kí tự!",
                },
              }}
            />
            <InputBaseComponent
              placeholder="Nhập lại mật khẩu mới..."
              type="password"
              control={control}
              name="passwordReset"
              setValue={noSetValue}
              label="Nhập lại"
              errors={errors}
              validationRules={{
                required: "Không được bỏ trống!",
                minLength: {
                  value: 8,
                  message: "Mật khẩu ít nhât 8 kí tự!",
                },
                maxLength: {
                  value: 20,
                  message: "Mật khẩu dài nhất 20 kí tự!",
                },
              }}
            />
            <MDBox mt={1} mb={1} textAlign="center">
              <MDTypography variant="button" color="text">
                Bạn đã có tài khoản?{" "}
                <MDTypography
                  component={Link}
                  to="/authentication/sign-in"
                  variant="button"
                  color="info"
                  fontWeight="medium"
                  textGradient
                >
                  Đăng nhập!
                </MDTypography>
              </MDTypography>
            </MDBox>
            <ButtonComponent style={{ marginTop: "12px", width: "100%" }} action="submit">
              CẬP NHẬT
            </ButtonComponent>
          </form>
        </MDBox>
      </Card>
    </CoverLayout>
  );
}

export default Cover;
