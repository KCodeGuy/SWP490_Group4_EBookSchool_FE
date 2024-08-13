import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import AppBar from "@mui/material/AppBar";
import ButtonComponent from "components/ButtonComponent/ButtonComponent";
import PopupComponent from "components/PopupComponent/PopupComponent";
import { EditNotifications } from "@mui/icons-material";
import InputBaseComponent from "components/InputBaseComponent/InputBaseComponent";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";
import CancelIcon from "@mui/icons-material/Cancel";
import breakpoints from "assets/theme/base/breakpoints";
import backgroundImage from "assets/images/bg-profile.jpeg";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { ToastContainer, toast } from "react-toastify";
import { updateStudent } from "services/StudentService";
import LockClockIcon from "@mui/icons-material/LockClock";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import NotifyCheckInfoForm from "components/NotifyCheckInfoForm";
import { nationOptions } from "mock/student";
import { useToasts } from "react-toast-notifications";

const accessToken = localStorage.getItem("authToken");
const genderOptions = [
  { label: "Nam", value: "Nam" },
  { label: "Nữ", value: "Nữ" },
];

function Header({ children, currentUser, permissions }) {
  const { addToast } = useToasts();
  const [tabsOrientation, setTabsOrientation] = useState("horizontal");
  const [tabValue, setTabValue] = useState(0);
  const [modalEditOpen, setModalEditOpen] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const [currentStudent, setCurrentStudent] = useState({});

  const queryClient = useQueryClient();

  const {
    control: controlEditAction,
    handleSubmit: handleSubmitEditAction,
    reset: resetEditAction,
    setValue,
    formState: { errors: errorsEditAction },
  } = useForm();

  const updateStudentMutation = useMutation(
    (studentData) => updateStudent(accessToken, studentData),
    {
      onSuccess: (response) => {
        queryClient.invalidateQueries("studentState");
        if (response && response.status == 200) {
          // if (currentStudent) {
          //   localStorage.setItem("user", JSON.stringify(currentStudent));
          // }
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
    const studentData = {
      id: data?.id,
      fullName: data?.fullName,
      birthday: data?.birthday,
      birthplace: data?.birthplace,
      gender: data?.gender,
      nation: data?.nation,
      email: data?.email,
      phone: data?.phone,
      fatherFullName: data?.fatherFullName,
      fatherPhone: data?.fatherPhone,
      fatherProfession: data?.fatherProfession,
      motherFullName: data?.motherFullName,
      motherPhone: data?.motherPhone,
      motherProfession: data?.motherProfession,
      address: data?.address,
      avatar: data?.avatar, // Assuming the avatar input returns a FileList
    };

    const studentShowData = {
      id: data?.id,
      username: data?.id,
      fullname: data?.fullName,
      address: data?.address,
      email: data?.email,
      phone: data?.phone,
      avatar: data?.avatar,
    };
    setCurrentStudent(studentShowData);
    updateStudentMutation.mutate(studentData);
  };

  const openEditModal = () => {
    if (currentUser) {
      setValue("id", currentUser?.id);
      setValue("fullName", currentUser?.fullname);
      setValue("email", currentUser?.email);
      setValue("gender", currentUser?.gender);
      setValue("fatherFullName", currentUser?.fatherFullName);
      setValue("fatherPhone", currentUser?.fatherPhone);
      setValue("fatherProfession", currentUser?.fatherProfession);
      setValue("motherFullName", currentUser?.motherFullName);
      setValue("motherPhone", currentUser?.motherPhone);
      setValue("motherProfession", currentUser?.motherProfession);
      setValue("phone", currentUser?.phone);
      setValue("birthday", currentUser?.birthday?.split("T")[0]);
      setValue("birthplace", currentUser?.birthplace);
      setValue("nation", currentUser?.nation);
      setValue("avatar", currentUser?.avatar);
      setValue("address", currentUser?.address);
      // setValue("otherInfo", currentUser?.otherInfo);

      setAvatar(currentUser?.avatar);
    }
    setModalEditOpen(true);
  };

  useEffect(() => {
    function handleTabsOrientation() {
      return window.innerWidth < breakpoints.values.sm
        ? setTabsOrientation("vertical")
        : setTabsOrientation("horizontal");
    }

    window.addEventListener("resize", handleTabsOrientation);
    handleTabsOrientation();
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
                Học sinh | {currentUser ? currentUser.id : "Chưa có thông tin!"} |{" "}
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
                  <LockClockIcon className="mr-2" />
                  ĐỔI MẬT KHẨU
                </ButtonComponent>
                <div className="max-[639px]:w-full max-[639px]:mt-3  sm:ml-3">
                  <ButtonComponent className="max-[639px]:w-full " onClick={openEditModal}>
                    <BorderColorIcon className="mr-2" />
                    CẬP NHẬT
                  </ButtonComponent>
                </div>
                <PopupComponent
                  title="CẬP NHẬT"
                  description="Cập nhật tài khoản"
                  icon={<BorderColorIcon />}
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
                        type="email"
                        className="sm:w-1/2 sm:mr-2 max-[639px]:w-full"
                        control={controlEditAction}
                        setValue={setValue}
                        name="email"
                        placeholder="hs@gmail.com"
                        label="Email"
                        errors={errorsEditAction}
                        validationRules={{
                          required: "Không được bỏ trống!",
                        }}
                      />
                      <InputBaseComponent
                        type="select"
                        className="sm:w-1/2  max-[639px]:w-full"
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
                        label="Dân tộc"
                        className="sm:w-1/2 sm:mr-2 max-[639px]:w-full"
                        control={controlEditAction}
                        setValue={setValue}
                        name="nation"
                        errors={errorsEditAction}
                        options={nationOptions}
                      />
                      <InputBaseComponent
                        type="text"
                        label="Số điện thoại"
                        className="sm:w-1/2  max-[639px]:w-full"
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
                    <div className="sm:flex justify-between">
                      <InputBaseComponent
                        type="text"
                        className="sm:w-1/2 sm:mr-2 max-[639px]:w-full"
                        control={controlEditAction}
                        setValue={setValue}
                        name="fatherFullName"
                        placeholder="Nguyen Van B"
                        label="Họ tên cha"
                        errors={errorsEditAction}
                        validationRules={{
                          required: "Không được bỏ trống!",
                        }}
                      />
                      <InputBaseComponent
                        type="text"
                        className="sm:w-1/2 sm:mr-2 max-[639px]:w-full"
                        control={controlEditAction}
                        setValue={setValue}
                        placeholder="Làm nông"
                        name="fatherProfession"
                        label="Nghề nghiệp cha"
                        errors={errorsEditAction}
                        validationRules={{
                          required: "Không được bỏ trống!",
                        }}
                      />

                      <InputBaseComponent
                        type="text"
                        className="sm:w-1/2  max-[639px]:w-full"
                        control={controlEditAction}
                        setValue={setValue}
                        name="fatherPhone"
                        placeholder="0234123471"
                        label="SĐT cha"
                        errors={errorsEditAction}
                        validationRules={{
                          required: "Không được bỏ trống!",
                        }}
                      />
                    </div>

                    <div className="sm:flex justify-between">
                      <InputBaseComponent
                        type="text"
                        className="sm:w-1/2 sm:mr-2 max-[639px]:w-full"
                        control={controlEditAction}
                        setValue={setValue}
                        name="motherFullName"
                        label="Họ tên mẹ"
                        placeholder="Lê thị B"
                        errors={errorsEditAction}
                        validationRules={{
                          required: "Không được bỏ trống!",
                        }}
                      />
                      <InputBaseComponent
                        type="text"
                        className="sm:w-1/2 sm:mr-2 max-[639px]:w-full"
                        control={controlEditAction}
                        setValue={setValue}
                        name="motherProfession"
                        placeholder="Giáo viên"
                        label="Nghề nghiệp mẹ"
                        errors={errorsEditAction}
                        validationRules={{
                          required: "Không được bỏ trống!",
                        }}
                      />

                      <InputBaseComponent
                        type="text"
                        className="sm:w-1/2  max-[639px]:w-full"
                        control={controlEditAction}
                        setValue={setValue}
                        name="motherPhone"
                        label="SĐT mẹ"
                        placeholder="0234123472"
                        errors={errorsEditAction}
                        validationRules={{
                          required: "Không được bỏ trống!",
                        }}
                      />
                    </div>
                    <InputBaseComponent
                      type="text"
                      className=""
                      control={controlEditAction}
                      setValue={setValue}
                      name="birthplace"
                      placeholder="Cần Thơ"
                      label="Nơi sinh"
                      errors={errorsEditAction}
                      validationRules={{
                        required: "Không được bỏ trống!",
                      }}
                    />
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
                      name="otherInfo"
                      label="Thông tin khác"
                      errors={errorsEditAction}
                      validationRules={{
                        required: "Không được bỏ trống!",
                      }}
                    /> */}
                    <NotifyCheckInfoForm actionText="Hãy kiểm tra kĩ thông tin trước khi cập nhật!" />
                    <div className="mt-4 flex justify-end">
                      <ButtonComponent
                        type="error"
                        action="reset"
                        onClick={() => resetEditAction()}
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

Header.defaultProps = {
  children: "",
};

Header.propTypes = {
  children: PropTypes.node,
  currentUser: PropTypes.object,
  permissions: PropTypes.any,
};

export default Header;
