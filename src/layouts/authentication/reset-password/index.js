import { Link, useNavigate } from "react-router-dom";

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
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { getStudentByID } from "services/StudentService";
import { getTeacherByID } from "services/TeacherService";
import { toast, ToastContainer } from "react-toastify";
import { updateStudent } from "services/StudentService";
import { updateTeacher } from "services/TeacherService";
import { CircularProgress } from "@mui/material";
import { logoutUser } from "services/AuthService";
import { useToasts } from "react-toast-notifications";

function Cover() {
  const { addToast } = useToasts();
  const navigate = useNavigate();
  const {
    control,
    handleSubmit,
    setValue: noSetValue,
    formState: { errors },
  } = useForm();

  const [isMatchedPassword, setIsMatchedPassword] = useState(true);
  const [currentAccount, setCurrentAccount] = useState({});

  const userRole = localStorage.getItem("userRole");
  const accessToken = localStorage.getItem("authToken");
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const userID = currentUser?.id;
  const queryClient = useQueryClient();

  const {
    data: studentData,
    isLoading: isLoading,
    refetch: refetchStudent,
  } = useQuery(
    ["studentState", { accessToken, userID }],
    () => getStudentByID(accessToken, userID),
    { enabled: false }
  );

  const {
    data: teacherData,
    isLoading: isLoadingTeacher,
    refetch: refetchTeacher,
  } = useQuery(
    ["teacherState", { accessToken, userID }],
    () => getTeacherByID(accessToken, userID),
    { enabled: false }
  );

  useEffect(() => {
    if (userRole) {
      if (userRole?.includes("Student")) {
        refetchStudent().then((result) => {
          if (result.data) {
            setCurrentAccount(result.data);
          }
        });
      } else if (!userRole?.includes("Student")) {
        refetchTeacher().then((result) => {
          if (result.data) {
            setCurrentAccount(result.data);
          }
        });
      }
    }
  }, [userRole, studentData, teacherData]);

  // ANHLHS0001
  const updateStudentMutation = useMutation(
    (studentData) => updateStudent(accessToken, studentData),
    {
      onSuccess: (response) => {
        queryClient.invalidateQueries("studentState");
        if (response && response.status == 200)
          addToast("Cập nhật mật khẩu thành công!", {
            appearance: "success",
          });
        logoutUser();
        navigate("/authentication/sign-in");
      },
      onError: (error) => {
        addToast("Cập nhật mật khẩu thất bại!", {
          appearance: "error",
        });
      },
    }
  );

  // ANHLHS0001
  const updateTeacherMutation = useMutation(
    (teacherData) => updateTeacher(accessToken, teacherData),
    {
      onSuccess: (response) => {
        queryClient.invalidateQueries("teacherState");
        addToast("Cập nhật mật khẩu thành công!", {
          appearance: "success",
        });
        logoutUser();
        navigate("/authentication/sign-in");
      },
      onError: (error) => {
        addToast("Cập nhật mật khẩu thất bại!", {
          appearance: "error",
        });
      },
    }
  );

  const handleSubmitLogin = (data) => {
    const isCorrectPassword = data.password === data.passwordReset;
    setIsMatchedPassword(isCorrectPassword);
    if (isCorrectPassword) {
      if (userRole) {
        if (userRole?.includes("Student")) {
          if (studentData) {
            const studentData = {
              id: currentAccount?.id || "Chưa có dữ liệu",
              username: currentAccount?.username || "Chưa có dữ liệu",
              fullname: currentAccount?.fullname || "Chưa có dữ liệu",
              address: currentAccount?.address || "Chưa có dữ liệu",
              email: currentAccount?.email || "Chưa có dữ liệu",
              phone: currentAccount?.phone || "Chưa có dữ liệu",
              gender: currentAccount?.gender || "Chưa có dữ liệu",
              birthday: currentAccount?.birthday || "Chưa có dữ liệu",
              nation: currentAccount?.nation || "Chưa có dữ liệu",
              birthplace: currentAccount?.birthplace || "Chưa có dữ liệu",
              homeTown: currentAccount?.homeTown || "Chưa có dữ liệu",
              fatherFullName: currentAccount?.fatherFullName || "Chưa có dữ liệu",
              fatherProfession: currentAccount?.fatherProfession || "Chưa có dữ liệu",
              fatherPhone: currentAccount?.fatherPhone || "Chưa có dữ liệu",
              motherFullName: currentAccount?.motherFullName || "Chưa có dữ liệu",
              motherProfession: currentAccount?.motherProfession || "Chưa có dữ liệu",
              motherPhone: currentAccount?.motherPhone || "Chưa có dữ liệu",
              avatar: currentAccount?.avatar || "Chưa có dữ liệu",
              isMartyrs: currentAccount?.isMartyrs || false,
              password: data.passwordReset || "aA@123",
            };
            updateStudentMutation.mutate(studentData);
          }
        } else {
          if (teacherData) {
            const teacherData = {
              id: currentAccount?.id || "Chưa có dữ liệu",
              username: currentAccount?.username || "Chưa có dữ liệu",
              fullname: currentAccount?.fullname || "Chưa có dữ liệu",
              address: currentAccount?.address || "Chưa có dữ liệu",
              email: currentAccount?.email || "Chưa có dữ liệu",
              phone: currentAccount?.phone || "Chưa có dữ liệu",
              gender: currentAccount?.gender || "Chưa có dữ liệu",
              birthday: currentAccount?.birthday || "Chưa có dữ liệu",
              nation: currentAccount?.nation || "Chưa có dữ liệu",
              isBachelor: currentAccount?.isBachelor || false,
              isMaster: currentAccount?.isMaster || false,
              isDoctor: currentAccount?.isDoctor || false,
              isProfessor: currentAccount?.isProfessor || false,
              avatar: currentAccount?.avatar || "Chưa có dữ liệu",
              roles: currentAccount?.roles,
              permissions: currentAccount?.permissions,
              password: data.passwordReset || "aA@123",
            };
            updateTeacherMutation.mutate(teacherData);
          }
        }
      }
    } else {
      addToast("Mật khẩu nhập lại không khớp!", {
        appearance: "error",
      });
    }
  };

  return (
    <CoverLayout image={bgImage}>
      {/* <ToastContainer autoClose={3000} /> */}
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
          <form onSubmit={handleSubmit(handleSubmitLogin)} className="w-full">
            {userRole ? (
              <div className="text-base ">
                <label className={`mr-2 font-medium min-w-28`}>
                  Mã tài khoản <span className="text-red-500">*</span>
                </label>
                <input
                  readOnly
                  className={`outline-none px-3 border py-2 rounded w-full
               border-blue-500}`}
                  type="text"
                  value={currentUser?.username}
                />
              </div>
            ) : (
              <InputBaseComponent
                placeholder="Mã tài khoản..."
                type="text"
                control={control}
                setValue={noSetValue}
                name="id"
                label="Mã tài khoản"
                errors={errors}
                validationRules={{
                  required: "Không được bỏ trống!",
                  minLength: {
                    value: 4,
                    message: "Mã tài khoản ít nhất 4 kí tự!",
                  },
                }}
              />
            )}

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
                  value: 6,
                  message: "Mật khẩu ít nhất 6 kí tự!",
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
                  value: 6,
                  message: "Mật khẩu ít nhât 6 kí tự!",
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
              {updateStudentMutation?.isLoading || updateTeacherMutation?.isLoading ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                "CẬP NHẬT"
              )}
            </ButtonComponent>
          </form>
        </MDBox>
      </Card>
    </CoverLayout>
  );
}

export default Cover;
