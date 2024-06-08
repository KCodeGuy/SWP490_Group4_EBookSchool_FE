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
import Icon from "@mui/material/Icon";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";

// Material Dashboard 2 React base styles
import breakpoints from "assets/theme/base/breakpoints";

// Images
import burceMars from "assets/images/bruce-mars.jpg";
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

const accessToken = localStorage.getItem("authToken");

function Header({ children, currentUser, permissions }) {
  const [tabsOrientation, setTabsOrientation] = useState("horizontal");
  const [tabValue, setTabValue] = useState(0);
  const [modalEditOpen, setModalEditOpen] = useState(false);
  const [avatar, setAvatar] = useState(null);

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
      setValue("id", currentUser.id);
      setValue("fullName", currentUser.fullname);
      setValue("birthday", currentUser.birthday.split("T")[0]);
      setValue("gender", currentUser.gender);
      setValue("nation", currentUser.nation);
      setValue("email", currentUser.email);
      setValue("phone", currentUser.phone);
      setValue("isBachelor", currentUser.isBachelor);
      setValue("isMaster", currentUser.isMaster);
      setValue("isDoctor", currentUser.isDoctor);
      setValue("isProfessor", currentUser.isProfessor);
      setValue("address", currentUser.address);
      setValue("avatar", currentUser.avatar);
      setAvatar(currentUser.avatar);
    }
  }, [currentUser, setValue]);

  // const handleEdit = (data) => {
  //   // Handle form submission for editing user data
  //   console.log("Form Data:", data);
  // };

  const updateTeacherMutation = useMutation(
    (teacherData) => updateTeacher(accessToken, teacherData),
    {
      onSuccess: (response) => {
        queryClient.invalidateQueries("teacherState");
        if (response && response.success) {
          toast.success("Cập nhật giáo viên thành công!");
        } else {
          toast.error(`${response.data}!`);
        }
        resetEditAction();
        setModalEditOpen(false);
      },
      onError: (error) => {
        console.error("Error updating teacher:", error);
        toast.error("Cập nhật giáo viên thất bại!");
      },
    }
  );

  const handleEdit = (data) => {
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
                {/* {permissions || "No permission"} | {currentUser.id} */}
                Giáo viên | {currentUser ? currentUser.id : "Chưa có thông tin!"} |{" "}
                {currentUser ? currentUser.email : "Chưa có thông tin!"}
              </MDTypography>
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={4} sx={{ ml: "auto" }}>
            <AppBar position="static">
              <div className="flex items-center justify-end">
                <ButtonComponent
                  type="success"
                  onClick={() => {
                    navigate("/authentication/reset-password");
                  }}
                >
                  ĐỔI MẬT KHẨU
                </ButtonComponent>
                <ButtonComponent onClick={() => setModalEditOpen(true)}>CẬP NHẬT</ButtonComponent>
                <PopupComponent
                  title="CẬP NHẬT"
                  description="Cập nhật tài khoản"
                  icon={<EditNotifications />}
                  isOpen={modalEditOpen}
                  onClose={() => setModalEditOpen(false)}
                >
                  <form onSubmit={handleSubmitEditAction(handleEdit)}>
                    <div className="flex">
                      <InputBaseComponent
                        type="text"
                        className="w-1/2 mr-2"
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
                        className="w-1/2 mr-2"
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
                        type="text"
                        className="w-1/2"
                        control={controlEditAction}
                        setValue={setValue}
                        name="gender"
                        placeholder="Nam"
                        label="Giới tính"
                        errors={errorsEditAction}
                        validationRules={{
                          required: "Không được bỏ trống!",
                        }}
                      />
                    </div>
                    <div className="flex">
                      <InputBaseComponent
                        type="text"
                        label="Dân tộc"
                        className="w-1/2 mr-2"
                        control={controlEditAction}
                        setValue={setValue}
                        name="nation"
                        placeholder="Kinh"
                        errors={errorsEditAction}
                        validationRules={{
                          required: "Không được bỏ trống!",
                        }}
                      />
                      <InputBaseComponent
                        type="email"
                        className="w-1/2 mr-2"
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
                        className="w-1/2"
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
                    <div className="flex">
                      {/* <InputBaseComponent
                        type="checkbox"
                        label="Cử nhân"
                        className="w-1/2 mr-2"
                        control={controlEditAction}
                        setValue={setValue}
                        name="isBachelor"
                        placeholder="Có"
                        errors={errorsEditAction}
                        validationRules={{
                          required: "Không được bỏ trống!",
                        }}
                      /> */}
                      <InputBaseComponent
                        type="checkbox"
                        horizontalLabel={true}
                        control={controlEditAction}
                        setValue={setValue}
                        name="isBachelor"
                        label="Cử nhân"
                        errors={errorsEditAction}
                      />

                      {/* <InputBaseComponent
                        type="checkbox"
                        label="Thạc sĩ"
                        className="w-1/2"
                        control={controlEditAction}
                        setValue={setValue}
                        name="isMaster"
                        placeholder="Có"
                        errors={errorsEditAction}
                        validationRules={{
                          required: "Không được bỏ trống!",
                        }}
                      /> */}
                      <InputBaseComponent
                        type="checkbox"
                        horizontalLabel={true}
                        control={controlEditAction}
                        setValue={setValue}
                        name="isMaster"
                        label="Thạc sĩ"
                        errors={errorsEditAction}
                      />
                    </div>
                    <div className="flex">
                      {/* <InputBaseComponent
                        type="checkbox"
                        label="Tiến sĩ"
                        className="w-1/2 mr-2"
                        control={controlEditAction}
                        setValue={setValue}
                        name="isDoctor"
                        placeholder="Có"
                        errors={errorsEditAction}
                        validationRules={{
                          required: "Không được bỏ trống!",
                        }}
                      /> */}
                      <InputBaseComponent
                        type="checkbox"
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
                    {/* <div className="flex justify-between">
                      <InputBaseComponent
                        type="text"
                        className="w-1/2 mr-2"
                        control={controlEditAction}
                        setValue={setValue}
                        name="parent"
                        placeholder="Nguyen Van B"
                        label="Họ tên cha"
                        errors={errorsEditAction}
                        validationRules={{
                          required: "Không được bỏ trống!",
                        }}
                      />
                      <InputBaseComponent
                        type="text"
                        className="w-1/2 mr-2"
                        control={controlEditAction}
                        setValue={setValue}
                        name="parents"
                        placeholder="0234123471"
                        label="SDT cha"
                        errors={errorsEditAction}
                        validationRules={{
                          required: "Không được bỏ trống!",
                        }}
                      />
                      <InputBaseComponent
                        type="text"
                        className="w-1/2"
                        control={controlEditAction}
                        setValue={setValue}
                        placeholder="Làm nông"
                        name="jobdad"
                        label="Nghe nghiệp cha"
                        errors={errorsEditAction}
                        validationRules={{
                          required: "Không được bỏ trống!",
                        }}
                      />
                    </div> */}
                    {/* <div className="flex justify-between">
                      <InputBaseComponent
                        type="text"
                        className="w-1/2 mr-2"
                        control={controlEditAction}
                        setValue={setValue}
                        name="mom"
                        label="Họ tên mẹ"
                        placeholder="Lê thị B"
                        errors={errorsEditAction}
                        validationRules={{
                          required: "Không được bỏ trống!",
                        }}
                      />
                      <InputBaseComponent
                        type="text"
                        className="w-1/2 mr-2"
                        control={controlEditAction}
                        setValue={setValue}
                        name="momsd"
                        label="SDT mẹ"
                        placeholder="0234123472"
                        errors={errorsEditAction}
                        validationRules={{
                          required: "Không được bỏ trống!",
                        }}
                      />
                      <InputBaseComponent
                        type="text"
                        className="w-1/2"
                        control={controlEditAction}
                        setValue={setValue}
                        name="jobmom"
                        placeholder="Giáo viên"
                        label="Nghe nghiệp mẹ"
                        errors={errorsEditAction}
                        validationRules={{
                          required: "Không được bỏ trống!",
                        }}
                      />
                    </div> */}
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
                    <div className="mt-4 flex justify-end">
                      <ButtonComponent
                        type="error"
                        action="reset"
                        onClick={() => resetEditAction()}
                      >
                        CLEAR
                      </ButtonComponent>
                      <ButtonComponent action="submit">CẬP NHẬT</ButtonComponent>
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
