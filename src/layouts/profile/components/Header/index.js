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

// prop-types is a library for typechecking of props.
import PropTypes from "prop-types";

// @mui material components
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import CancelIcon from "@mui/icons-material/Cancel";
import Icon from "@mui/material/Icon";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";

// Material Dashboard 2 React base styles
import breakpoints from "assets/theme/base/breakpoints";
import BorderColorIcon from "@mui/icons-material/BorderColor";
// Images
import burceMars from "assets/images/bruce-mars.jpg";
import LockClockIcon from "@mui/icons-material/LockClock";
import backgroundImage from "assets/images/bg-profile.jpeg";
import ButtonComponent from "components/ButtonComponent/ButtonComponent";
import { useNavigate } from "react-router-dom";
import PopupComponent from "components/PopupComponent/PopupComponent";
import { EditNotifications } from "@mui/icons-material";
import InputBaseComponent from "components/InputBaseComponent/InputBaseComponent";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { updateTeacher } from "services/TeacherService";
import { ToastContainer, toast } from "react-toastify";
import NotifyCheckInfoForm from "components/NotifyCheckInfoForm";
import { nationOptions } from "mock/student";
import { PRINCIPAL_ROLE } from "services/APIConfig";
import { HEADTEACHER_ROLE } from "services/APIConfig";
import { SUBJECT_ROLE } from "services/APIConfig";
import { HOMEROOM_ROLE } from "services/APIConfig";
import { useToasts } from "react-toast-notifications";

const accessToken = localStorage.getItem("authToken");
const genderOptions = [
  { label: "Nam", value: "Nam" },
  { label: "Nữ", value: "Nữ" },
];
function Header({ children, currentUser, permissions }) {
  const [tabsOrientation, setTabsOrientation] = useState("horizontal");
  const [tabValue, setTabValue] = useState(0);
  const [modalEditOpen, setModalEditOpen] = useState(false);
  const [avatar, setAvatar] = useState(null);
  let userRole = localStorage.getItem("userRole");
  const { addToast } = useToasts();

  const queryClient = useQueryClient();

  // React-hook-form for editing action
  const {
    control: controlEditAction,
    handleSubmit: handleSubmitEditAction,
    reset: resetEditAction,
    setValue,
    formState: { errors: errorsEditAction },
  } = useForm();

  useEffect(() => {
    // Set form values with currentUser data
    if (currentUser) {
      setValue("id", currentUser?.id);
      setValue("fullName", currentUser?.fullname);
      setValue("birthday", currentUser?.birthday?.split("T")[0]);
      setValue("gender", currentUser?.gender);
      setValue("nation", currentUser?.nation);
      setValue("email", currentUser?.email);
      setValue("phone", currentUser?.phone);
      setValue("isBachelor", currentUser?.isBachelor);
      setValue("isMaster", currentUser?.isMaster);
      setValue("isDoctor", currentUser?.isDoctor);
      setValue("isProfessor", currentUser?.isProfessor);
      setValue("address", currentUser?.address);
      setValue("avatar", currentUser?.avatar);
      setAvatar(currentUser?.avatar);
    }
  }, [currentUser]);

  const updateTeacherMutation = useMutation(
    (teacherData) => updateTeacher(accessToken, teacherData),
    {
      onSuccess: (response) => {
        queryClient.invalidateQueries("teacherState");
        if (response && response.status == 200) {
          // localStorage.setItem("user", JSON.stringify(teacherData));
          addToast(`Cập nhật tài khoản thành công!`, {
            appearance: "success",
          });
        } else {
          addToast(`Cập nhật tài khoản thất bại!`, {
            appearance: "error",
          });
        }
        resetEditAction();
        setModalEditOpen(false);
      },
      onError: (error) => {
        addToast(`Cập nhật tài khoản thất bại!`, {
          appearance: "error",
        });
      },
    }
  );

  const handleEdit = (data) => {
    if (data) {
      if (!data.gender || data.gender == "") {
        data.gender = genderOptions[0].value;
      }
      if (!data.nation || data.nation == "") {
        data.nation = nationOptions[0].value;
      }
      const teacherData = {
        id: data.id,
        fullName: data.fullName,
        birthday: data.birthday,
        gender: data.gender,
        nation: data.nation,
        email: data.email,
        phone: data.phone,
        isBachelor: data.isBachelor,
        isMaster: data.isMaster,
        isDoctor: data.isDoctor,
        isProfessor: data.isProfessor,
        address: data.address,
        avatar: data.avatar, // Assuming the avatar input returns a FileList
      };
      updateTeacherMutation.mutate(teacherData);
    }
  };

  useEffect(() => {
    // A function that sets the orientation state of the tabs.
    function handleTabsOrientation() {
      return window.innerWidth < breakpoints.values.sm
        ? setTabsOrientation("vertical")
        : setTabsOrientation("horizontal");
    }

    /** 
     The event listener that's calling the handleTabsOrientation function when resizing the window.
    */
    window.addEventListener("resize", handleTabsOrientation);

    // Call the handleTabsOrientation function to set the state with the initial value.
    handleTabsOrientation();

    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleTabsOrientation);
  }, [tabsOrientation]);

  const handleSetTabValue = (event, newValue) => setTabValue(newValue);
  const navigate = useNavigate();

  return (
    <MDBox position="relative" mb={5}>
      <ToastContainer autoClose={3000} />
      <MDBox
        display="flex"
        alignItems="center"
        position="relative"
        minHeight="18.75rem"
        borderRadius="xl"
        sx={{
          backgroundImage: ({ functions: { rgba, linearGradient }, palette: { gradients } }) =>
            `${linearGradient(
              rgba(gradients.info.main, 0.6),
              rgba(gradients.info.state, 0.6)
            )}, url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "50%",
          overflow: "hidden",
        }}
      />
      <Card
        sx={{
          position: "relative",
          mt: -8,
          mx: 3,
          py: 2,
          px: 2,
        }}
      >
        <Grid container spacing={3} alignItems="center">
          <Grid item>
            <MDAvatar
              src={currentUser ? currentUser.avatar : ""}
              alt="profile-image"
              size="xl"
              shadow="sm"
            />
          </Grid>
          <Grid item>
            <MDBox height="100%" mt={0.5} lineHeight={1}>
              <MDTypography variant="h5" fontWeight="medium">
                {currentUser ? currentUser.fullname : "Chưa có thông tin!"}
              </MDTypography>
              <MDTypography variant="button" color="text" fontWeight="regular">
                {userRole?.includes(PRINCIPAL_ROLE)
                  ? "HIỆU TRƯỞNG/PHÓ HIỆU TRƯỞNG | "
                  : userRole?.includes(HEADTEACHER_ROLE)
                  ? "TỔNG PHỤ TRÁCH/GIÁM THỊ | "
                  : userRole?.includes(SUBJECT_ROLE)
                  ? "GIÁO VIÊN BỘ MÔN | "
                  : userRole?.includes(HOMEROOM_ROLE)
                  ? "GIÁO VIÊN CHỦ NHIỆM | "
                  : userRole?.includes(SUBJECT_ROLE) && userRole?.includes(HOMEROOM_ROLE)
                  ? "GIÁO VIÊN BỘ MÔN/CHỦ NHIỆM |"
                  : ""}
                {currentUser ? currentUser.email : "Chưa có thông tin!"}
              </MDTypography>
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={4} sx={{ ml: "auto" }}>
            <AppBar position="static">
              <div className="flex items-center justify-end max-[639px]:flex-wrap">
                <ButtonComponent
                  type="success"
                  className="max-[639px]:w-full"
                  onClick={() => {
                    navigate("/authentication/reset-password");
                  }}
                >
                  <LockClockIcon className="mr-2 max-[639px]:hidden-ipt" />
                  ĐỔI MẬT KHẨU
                </ButtonComponent>
                <div className="max-[639px]:w-full max-[639px]:mt-3 sm:ml-3">
                  <ButtonComponent
                    className="max-[639px]:w-full"
                    onClick={() => setModalEditOpen(true)}
                  >
                    <BorderColorIcon className="mr-2 max-[639px]:hidden-ipt" />
                    CẬP NHẬT
                  </ButtonComponent>
                </div>
                <PopupComponent
                  title="CẬP NHẬT"
                  description="Cập nhật tài khoản"
                  icon={<EditNotifications />}
                  isOpen={modalEditOpen}
                  onClose={() => setModalEditOpen(false)}
                >
                  <form onSubmit={handleSubmitEditAction(handleEdit)}>
                    <div className="sm:flex">
                      <InputBaseComponent
                        type="text"
                        className="sm:w-1/2 sm:mr-2 max-[639px]:w-full"
                        control={controlEditAction}
                        name="fullName"
                        placeholder="Nguyen Van A"
                        label="Họ và tên"
                        setValue={setValue}
                        errors={errorsEditAction}
                        validationRules={{
                          required: "Không được bỏ trống!",
                        }}
                      />
                      <InputBaseComponent
                        type="date"
                        className="sm:w-1/2 sm:mr-2 max-[639px]:w-full"
                        control={controlEditAction}
                        setValue={setValue}
                        name="birthday"
                        label="Ngày sinh"
                        errors={errorsEditAction}
                        validationRules={{
                          required: "Không được bỏ trống!",
                        }}
                      />
                      <InputBaseComponent
                        type="select"
                        className="sm:w-1/2 max-[639px]:w-full"
                        control={controlEditAction}
                        setValue={setValue}
                        name="gender"
                        label="Giới tính"
                        errors={errorsEditAction}
                        options={genderOptions}
                      />
                    </div>
                    <div className="sm:flex">
                      <InputBaseComponent
                        type="select"
                        label="Dân tộc"
                        className="sm:w-1/2 sm:mr-2 max-[639px]:w-full"
                        control={controlEditAction}
                        setValue={setValue}
                        name="nation"
                        errors={errorsEditAction}
                        options={nationOptions}
                      />
                      <InputBaseComponent
                        type="email"
                        className="sm:w-1/2 sm:mr-2 max-[639px]:w-full"
                        control={controlEditAction}
                        setValue={setValue}
                        name="email"
                        placeholder="gv@gmail.com"
                        label="Email"
                        errors={errorsEditAction}
                        validationRules={{
                          required: "Không được bỏ trống!",
                        }}
                      />
                      <InputBaseComponent
                        type="text"
                        label="Số điện thoại"
                        className="sm:w-1/2 max-[639px]:w-full"
                        control={controlEditAction}
                        setValue={setValue}
                        name="phone"
                        placeholder="0234123470"
                        errors={errorsEditAction}
                        validationRules={{
                          required: "Không được bỏ trống!",
                        }}
                      />
                    </div>
                    <div className="sm:flex">
                      <InputBaseComponent
                        type="checkbox"
                        className="mr-3"
                        horizontalLabel={true}
                        control={controlEditAction}
                        setValue={setValue}
                        name="isBachelor"
                        label="Cử nhân"
                        errors={errorsEditAction}
                      />
                      <InputBaseComponent
                        type="checkbox"
                        className="mr-3"
                        horizontalLabel={true}
                        control={controlEditAction}
                        setValue={setValue}
                        name="isMaster"
                        label="Thạc sĩ"
                        errors={errorsEditAction}
                      />
                      <InputBaseComponent
                        type="checkbox"
                        className="mr-3"
                        horizontalLabel={true}
                        control={controlEditAction}
                        setValue={setValue}
                        name="isDoctor"
                        label="Tiến sĩ"
                        errors={errorsEditAction}
                      />

                      <InputBaseComponent
                        type="checkbox"
                        horizontalLabel={true}
                        control={controlEditAction}
                        setValue={setValue}
                        name="isProfessor"
                        label="Giáo sư"
                        errors={errorsEditAction}
                      />
                    </div>
                    <div className="flex"></div>

                    <InputBaseComponent
                      type="text"
                      className=""
                      control={controlEditAction}
                      setValue={setValue}
                      name="address"
                      placeholder="600 Nguyen van cu"
                      label="Địa chỉ"
                      errors={errorsEditAction}
                      validationRules={{
                        required: "Không được bỏ trống!",
                      }}
                    />
                    <div className="flex">
                      <InputBaseComponent
                        type="file"
                        className="w-full"
                        control={controlEditAction}
                        setValue={setValue}
                        name="avatar"
                        label="Ảnh đại diện"
                        errors={errorsEditAction}
                        validationRules={{
                          required: "Không được bỏ trống!",
                        }}
                      />
                      {avatar && (
                        <img
                          className="w-24 ml-2 h-24 rounded-md object-cover object-center"
                          src={avatar}
                          alt="avatar"
                        />
                      )}
                    </div>
                    {/* <InputBaseComponent
                      type="textArea"
                      className="w-full"
                      control={controlEditAction}
                      setValue={setValue}
                      name="others"
                      label="Thông tin khác"
                      errors={errorsEditAction}
                      // validationRules={{
                      //   required: "Không được bỏ trống!",
                      // }}
                    /> */}
                    <NotifyCheckInfoForm actionText="Hãy kiểm tra kĩ thông tin trước khi cập nhật!" />
                    <div className="mt-4 flex justify-end">
                      <ButtonComponent
                        type="error"
                        action="reset"
                        onClick={() => {
                          resetEditAction();
                          setModalEditOpen(false);
                        }}
                      >
                        <CancelIcon className="mr-1" />
                        HỦY BỎ
                      </ButtonComponent>
                      <ButtonComponent action="submit">
                        <BorderColorIcon className="mr-1" />
                        CẬP NHẬT
                      </ButtonComponent>
                    </div>
                  </form>
                </PopupComponent>
              </div>
            </AppBar>
          </Grid>
        </Grid>
        {children}
      </Card>
    </MDBox>
  );
}

// Setting default props for the Header
Header.defaultProps = {
  children: "",
};

// Typechecking props for the Header
Header.propTypes = {
  children: PropTypes.node,
  currentUser: PropTypes.object,
  permissions: PropTypes.any,
};

export default Header;
