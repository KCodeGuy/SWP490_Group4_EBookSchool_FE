import { Card, CircularProgress, Grid } from "@mui/material";
import MDBox from "components/MDBox";
import Footer from "examples/Footer";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import { ToastContainer, toast } from "react-toastify";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import MarkunreadIcon from "@mui/icons-material/Markunread";
import SettingsIcon from "@mui/icons-material/Settings";
import noDataImage3 from "../../assets/images/noDataImage3.avif";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import MilitaryTechIcon from "@mui/icons-material/MilitaryTech";
import PersonIcon from "@mui/icons-material/Person";
import SchoolIcon from "@mui/icons-material/School";
import DomainIcon from "@mui/icons-material/Domain";
import CancelIcon from "@mui/icons-material/Cancel";
import TodayIcon from "@mui/icons-material/Today";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import FilterIcon from "@mui/icons-material/Filter";

import React, { useState } from "react";
import MDTypography from "components/MDTypography";
import ButtonComponent from "components/ButtonComponent/ButtonComponent";
import PopupComponent from "components/PopupComponent/PopupComponent";
import InputBaseComponent from "components/InputBaseComponent/InputBaseComponent";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { getSetting } from "services/SettingService";
import NotifyCheckInfoForm from "components/NotifyCheckInfoForm";
import { updateSetting } from "services/SettingService";

const schoolLevelOptions = [
  { label: "Trường THCS", value: "Trường trung học cơ sở" },
  { label: "Trường THPT", value: "Trường trung học phổ thông" },
  { label: "Trường THCS & THPT", value: "Trường trung học cơ sở và trung học phổ thông" },
];
export default function SystemSetting() {
  const accessToken = localStorage.getItem("authToken");
  const [modalEditOpen, setModalEditOpen] = useState(false);
  const queryClient = useQueryClient();

  //call api get all
  const { data, error, isLoading } = useQuery(["settingState"], () => getSetting(accessToken));

  const {
    control: controlEditAction,
    handleSubmit: handleSubmitEditAction,
    reset: resetEditAction,
    setValue,
    formState: { errors: errorsEditAction },
  } = useForm();

  const updateSchoolSettingMutation = useMutation(
    (setting) => updateSetting(accessToken, setting),
    {
      onSuccess: (response) => {
        queryClient.invalidateQueries("settingState");
        if (response && response.status == 200) {
          toast.success("Cập nhật hệ thống thành công!");
        } else {
          toast.error(`Cập nhật hệ thống thất bại. ${response?.response?.data}!`);
        }
      },
      onError: (error) => {
        toast.error(`Cập nhật hệ thống thất bại! ${error.message}!`);
      },
    }
  );

  const handleOpenModalEdit = () => {
    setModalEditOpen(true);
    if (data) {
      setValue("schoolName", data.schoolName);
      setValue("schoolAddress", data.schoolAddress);
      setValue("schoolPhone", data.schoolPhone);
      setValue("schoolEmail", data.schoolEmail);
      setValue("schoolLevel", data.schoolLevel);
    }
  };

  const handleEdit = (data) => {
    if (data) {
      const schoolSetting = {
        schoolName: data.schoolName,
        schoolAddress: data.schoolAddress,
        schoolPhone: data.schoolPhone,
        schoolEmail: data.schoolEmail,
        schoolLevel: data.schoolLevel,
      };
      updateSchoolSettingMutation.mutate(schoolSetting);
    }
  };

  return (
    <DashboardLayout>
      <ToastContainer autoClose={3000} />
      <DashboardNavbar />
      <Card className="h-screen mb-8">
        <MDBox p={5}>
          <div className="text-center mt-0 ">
            <div className="flex justify-center items-center text-3xl mx-auto w-full">
              <SettingsIcon />
              <h4 className="text-xl font-bold ml-3">CÀI ĐẶT HỆ THỐNG</h4>
            </div>
          </div>
          <div className="text-right">
            <ButtonComponent onClick={handleOpenModalEdit}>
              <BorderColorIcon className="text-3xl mr-1" />
              CẬP NHẬT
            </ButtonComponent>
          </div>
          <PopupComponent
            title="CẬP NHẬT"
            description="Cập nhật thông tin hệ thống"
            isOpen={modalEditOpen}
            onClose={() => setModalEditOpen(false)}
          >
            <form onSubmit={handleSubmitEditAction(handleEdit)}>
              <div className="flex">
                <InputBaseComponent
                  type="text"
                  className="w-1/3 mr-2"
                  control={controlEditAction}
                  name="schoolName"
                  placeholder="Trường THPT Nguyễn Việt Hồng..."
                  label="Tên trường"
                  setValue={setValue}
                  errors={errorsEditAction}
                  validationRules={{
                    required: "Không được bỏ trống!",
                  }}
                />
                <InputBaseComponent
                  placeholder="nvhthpt@gmail.com..."
                  type="email"
                  control={controlEditAction}
                  setValue={setValue}
                  name="schoolEmail"
                  label="Email"
                  className="w-1/3 mr-2"
                  errors={errorsEditAction}
                  validationRules={{
                    required: "Không được bỏ trống!",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Không đúng định dạng!",
                    },
                  }}
                />
                <InputBaseComponent
                  placeholder="0234567890..."
                  type="text"
                  control={controlEditAction}
                  setValue={setValue}
                  name="schoolPhone"
                  label="Số điện thoại"
                  className="w-1/3"
                  errors={errorsEditAction}
                  validationRules={{
                    required: "Không được bỏ trống!",
                    pattern: {
                      value: /^[0-9]{10}$/,
                      message: "Không đúng định dạng!",
                    },
                  }}
                />
              </div>

              <div className="flex">
                <InputBaseComponent
                  type="select"
                  className="w-1/2 mr-2"
                  control={controlEditAction}
                  setValue={setValue}
                  name="schoolLevel"
                  label="Cấp bậc trường"
                  errors={errorsEditAction}
                  options={schoolLevelOptions}
                />
                {/* <InputBaseComponent
                  type="text"
                  placeholder="Thông tin khác..."
                  control={controlEditAction}
                  setValue={setValue}
                  name="otherInfor"
                  label="Thông tin khác"
                  className="w-1/2"
                  errors={errorsEditAction}
                /> */}
                <InputBaseComponent
                  type="file"
                  className="w-1/2"
                  control={controlEditAction}
                  setValue={setValue}
                  name="logo"
                  label="Ảnh logo"
                  errors={errorsEditAction}
                />
              </div>
              <InputBaseComponent
                type="text"
                placeholder="600, Nguyễn Văn Cừ (nối dài), An Bình, Ninh Kiều, Cần Thơ..."
                control={controlEditAction}
                setValue={setValue}
                name="schoolAddress"
                label="Địa chỉ"
                className="w-full"
                errors={errorsEditAction}
                validationRules={{
                  required: "Không được bỏ trống!",
                }}
              />

              <div className="flex">
                <InputBaseComponent
                  type="file"
                  className="w-1/2 mr-2"
                  control={controlEditAction}
                  setValue={setValue}
                  name="schoolSlider1"
                  label="Ảnh 1"
                  errors={errorsEditAction}
                  // validationRules={{
                  //   required: "Không được bỏ trống!",
                  // }}
                />
                <InputBaseComponent
                  type="file"
                  className="w-1/2 mr-2"
                  control={controlEditAction}
                  setValue={setValue}
                  name="schoolSlider2"
                  label="Ảnh 2"
                  errors={errorsEditAction}
                  // validationRules={{
                  //   required: "Không được bỏ trống!",
                  // }}
                />
                <InputBaseComponent
                  type="file"
                  className="w-1/2"
                  control={controlEditAction}
                  setValue={setValue}
                  name="schoolSlider3"
                  label="Ảnh 3"
                  errors={errorsEditAction}
                  // validationRules={{
                  //   required: "Không được bỏ trống!",
                  // }}
                />
              </div>
              <NotifyCheckInfoForm actionText="Hãy kiểm tra kĩ trước khi cập nhật!" />
              <div className="mt-4 flex justify-end">
                <ButtonComponent
                  type="error"
                  action="reset"
                  onClick={() => {
                    setModalEditOpen(false);
                    resetEditAction();
                  }}
                >
                  <CancelIcon className="text-3xl mr-1 mb-0.5" />
                  HỦY BỎ
                </ButtonComponent>
                <ButtonComponent action="submit">
                  <BorderColorIcon className="text-3xl mr-1" />
                  CẬP NHẬT
                </ButtonComponent>
              </div>
            </form>
          </PopupComponent>
          {isLoading ? (
            <div className="text-center primary-color my-10 text-xl italic font-medium">
              <div className="mx-auto flex items-center justify-center">
                <p className="mr-3">Loading</p>
                <CircularProgress size={24} color="inherit" />
              </div>
            </div>
          ) : data ? (
            <Grid container spacing={1}>
              <Grid item xs={12} md={4}>
                <MDBox mb={4}>
                  <MDTypography variant="h6" fontWeight="medium" textTransform="capitalize">
                    THÔNG TIN CHUNG
                  </MDTypography>
                </MDBox>
                <div className="flex items-center">
                  <DomainIcon />
                  <span className="text-base font-bold mx-2">Tên trường: </span>
                  <span className="text-sm text-color">
                    {data?.schoolName || "Chưa có dữ liệu!"}
                  </span>
                </div>

                <div className="flex items-center mt-4">
                  <PhoneIphoneIcon />
                  <span className="text-base font-bold mx-2">Số điện thoại: </span>
                  <span className="text-sm text-color">
                    {data?.schoolPhone || "Chưa có dữ liệu!"}
                  </span>
                </div>
                <div className="flex items-center mt-4">
                  <MarkunreadIcon />
                  <span className="text-base font-bold mx-2">Email: </span>
                  <span className="text-sm text-color">
                    {data?.schoolEmail || "Chưa có dữ liệu!"}
                  </span>
                </div>
                <div className="flex items-center mt-4">
                  <MilitaryTechIcon />
                  <span className="text-base font-bold mx-2">Cấp bậc: </span>
                  <span className="text-sm text-color">
                    {data?.schoolLevel || "Chưa có dữ liệu!"}
                  </span>
                </div>
                <div className="flex items-center mt-4">
                  <LocationOnIcon />
                  <span className="text-base font-bold mx-2">Địa chỉ: </span>
                  <span className="text-sm text-color">
                    {data?.schoolAddress || "Chưa có dữ liệu!"}
                  </span>
                </div>
              </Grid>
              <Grid item xs={12} md={4}>
                <MDBox mb={4}>
                  <MDTypography variant="h6" fontWeight="medium" textTransform="capitalize">
                    THÔNG TIN KHÁC
                  </MDTypography>
                </MDBox>
                <div className="flex items-center">
                  <DomainIcon />
                  <span className="text-base font-bold mx-2">Logo: </span>
                  <span className="text-sm text-color">Chưa có dữ liệu!</span>
                </div>
                <div className="flex items-center mt-4">
                  <EmojiEventsIcon />
                  <span className="text-base font-bold mx-2">Giới thiệu: </span>
                  <span className="text-sm text-color">
                    {data?.schoolName || "Chưa có dữ liệu!"}
                  </span>
                </div>
                <div className="flex items-center mt-4">
                  <TodayIcon />
                  <span className="text-base font-bold mx-2">Số năm thành lập: </span>
                  <span className="text-sm text-color">2024</span>
                </div>
                <div className="flex items-center mt-4">
                  <TodayIcon />
                  <span className="text-base font-bold mx-2">Sự kiện: </span>
                  <span className="text-sm text-color">100</span>
                </div>
              </Grid>
              <Grid item xs={12} md={4}>
                <MDBox mb={4}>
                  <MDTypography variant="h6" fontWeight="medium" textTransform="capitalize">
                    ẢNH NỔI BẬT
                  </MDTypography>
                </MDBox>
                <div className="flex items-center">
                  <FilterIcon />
                  <span className="text-base font-bold mx-2">Ảnh 1: </span>
                  <span className="text-sm text-color">Chưa có dữ liệu!</span>
                </div>
                <div className="flex items-center mt-4">
                  <FilterIcon />
                  <span className="text-base font-bold mx-2">Ảnh 2: </span>
                  <span className="text-sm text-color">Chưa có dữ liệu!</span>
                </div>
                <div className="flex items-center mt-4">
                  <FilterIcon />
                  <span className="text-base font-bold mx-2">Ảnh 3: </span>
                  <span className="text-sm text-color">Chưa có dữ liệu!</span>
                </div>
              </Grid>
            </Grid>
          ) : (
            <div className="text-center primary-color my-10 text-xl italic font-medium">
              <img
                className="w-60 h-60 object-cover object-center mx-auto"
                src={noDataImage3}
                alt="Chưa có dữ liệu!!"
              />
              Chưa có dữ liệu!!
            </div>
          )}
        </MDBox>
      </Card>
      <Footer />
    </DashboardLayout>
  );
}
