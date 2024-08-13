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

import logoImage from "assets/images/logo1.png";
import sliderImage1 from "assets/images/slider1.png";
import sliderImage2 from "assets/images/slider2.png";
import sliderImage3 from "assets/images/slider3.png";
import React, { useEffect, useState } from "react";
import MDTypography from "components/MDTypography";
import ButtonComponent from "components/ButtonComponent/ButtonComponent";
import PopupComponent from "components/PopupComponent/PopupComponent";
import InputBaseComponent from "components/InputBaseComponent/InputBaseComponent";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { getSetting } from "services/SettingService";
import NotifyCheckInfoForm from "components/NotifyCheckInfoForm";
import { updateSetting } from "services/SettingService";
import { uploadImage } from "services/SettingService";
import { LOGO_IMAGE } from "services/APIConfig";
import { SCHOOL_SLIDER_1 } from "services/APIConfig";
import { SCHOOL_SLIDER_2 } from "services/APIConfig";
import { SCHOOL_SLIDER_3 } from "services/APIConfig";
import MDAvatar from "components/MDAvatar";
import { useToasts } from "react-toast-notifications";

const schoolLevelOptions = [
  { label: "Trường THPT", value: "Trường trung học phổ thông" },
  { label: "Trường THCS", value: "Trường trung học cơ sở" },
  { label: "Trường THCS & THPT", value: "Trường trung học cơ sở và trung học phổ thông" },
];
export default function SystemSetting() {
  const { addToast } = useToasts();
  const accessToken = localStorage.getItem("authToken");
  const [modalEditOpen, setModalEditOpen] = useState(false);
  const queryClient = useQueryClient();
  const [imageURL, setImageURL] = useState(localStorage.getItem("schoolLogoURL"));
  const [schoolSlider1, setSchoolSlider1] = useState(localStorage.getItem("schoolSlider1"));
  const [schoolSlider2, setSchoolSlider2] = useState(localStorage.getItem("schoolSlider2"));
  const [schoolSlider3, setSchoolSlider3] = useState(localStorage.getItem("schoolSlider3"));

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
          addToast(`Cập nhật hệ thống thành công!`, {
            appearance: "success",
          });
          setModalEditOpen(false);
        } else {
          addToast(`Cập nhật hệ thống thất bại! ${response?.response?.data}!`, {
            appearance: "error",
          });
        }
      },
      onError: (error) => {
        addToast(`Cập nhật hệ thống thất bại!`, {
          appearance: "error",
        });
      },
    }
  );

  const uploadImageMutation = useMutation((data) => uploadImage(accessToken, data), {
    onSuccess: (response) => {
      queryClient.invalidateQueries("uploadImageState");
      if (response && response.status == 200) {
      }
    },
  });

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

  const handleEdit = async (data) => {
    if (data) {
      const schoolSetting = {
        schoolName: data.schoolName,
        schoolAddress: data.schoolAddress,
        schoolPhone: data.schoolPhone,
        schoolEmail: data.schoolEmail,
        schoolLevel: data.schoolLevel,
      };

      // Create an array to hold image upload promises
      const uploadPromises = [];

      if (data?.logo) {
        const logoData = {
          file: data.logo,
          name: LOGO_IMAGE,
        };
        uploadPromises.push(uploadImageMutation.mutateAsync(logoData));
      }
      if (data?.schoolSlider1) {
        const schoolSlider1 = {
          file: data.schoolSlider1,
          name: SCHOOL_SLIDER_1,
        };
        uploadPromises.push(uploadImageMutation.mutateAsync(schoolSlider1));
      }
      if (data?.schoolSlider2) {
        const schoolSlider2 = {
          file: data.schoolSlider2,
          name: SCHOOL_SLIDER_2,
        };
        uploadPromises.push(uploadImageMutation.mutateAsync(schoolSlider2));
      }
      if (data?.schoolSlider3) {
        const schoolSlider3 = {
          file: data.schoolSlider3,
          name: SCHOOL_SLIDER_3,
        };
        uploadPromises.push(uploadImageMutation.mutateAsync(schoolSlider3));
      }

      // Wait for all upload promises to complete
      try {
        await Promise.all(uploadPromises);
        updateSchoolSettingMutation.mutate(schoolSetting);
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } catch (error) {
        addToast(`Tải ảnh lên thất bại!`, {
          appearance: "error",
        });
      }
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
          <div className="sm:text-right max-[639px]:w-full max-[639px]:mt-4 max-[639px]:mb-4">
            <ButtonComponent className="max-[639px]:w-full" onClick={handleOpenModalEdit}>
              <BorderColorIcon className="text-3xl mr-1 " />
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
                  className="w-1/2 mr-2"
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
                  className="w-1/2"
                  errors={errorsEditAction}
                  validationRules={{
                    required: "Không được bỏ trống!",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
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
                  label="Cấp bật trường"
                  errors={errorsEditAction}
                  options={schoolLevelOptions}
                />
                <InputBaseComponent
                  placeholder="0234567890..."
                  type="text"
                  control={controlEditAction}
                  setValue={setValue}
                  name="schoolPhone"
                  label="Số điện thoại"
                  className="w-1/2"
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

              <div className="flex items-center">
                <InputBaseComponent
                  type="file"
                  className="w-full"
                  control={controlEditAction}
                  setValue={setValue}
                  name="logo"
                  label="Ảnh logo"
                  errors={errorsEditAction}
                />
                <img
                  className="w-14 ml-2 h-14 rounded-md object-cover object-center mt-3"
                  src={imageURL ? imageURL : logoImage}
                  alt="avatar"
                />
              </div>
              <div className="flex items-center">
                <InputBaseComponent
                  type="file"
                  className="w-full"
                  control={controlEditAction}
                  setValue={setValue}
                  name="schoolSlider1"
                  label="Ảnh nổi bật(1)"
                  errors={errorsEditAction}
                />
                <img
                  className="w-14 ml-2 h-14 rounded-md object-cover object-center"
                  src={schoolSlider1 ? schoolSlider1 : sliderImage1}
                  alt="Ảnh nổi bật 1"
                />
              </div>
              <div className="flex items-center">
                <InputBaseComponent
                  type="file"
                  className="w-full"
                  control={controlEditAction}
                  setValue={setValue}
                  name="schoolSlider2"
                  label="Ảnh nổi bật(2)"
                  errors={errorsEditAction}
                />
                <img
                  className="w-14 ml-2 h-14 rounded-md object-cover object-center"
                  src={schoolSlider2 ? schoolSlider2 : sliderImage2}
                  alt="Ảnh nổi bật 2"
                />
              </div>
              <div className="flex items-center">
                <InputBaseComponent
                  type="file"
                  className="w-full"
                  control={controlEditAction}
                  setValue={setValue}
                  name="schoolSlider3"
                  label="Ảnh nổi bật(3)"
                  errors={errorsEditAction}
                />
                <img
                  className="w-14 ml-2 h-14 rounded-md object-cover object-center"
                  src={schoolSlider3 ? schoolSlider3 : sliderImage3}
                  alt="Ảnh nổi bật 3"
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
                  {uploadImageMutation?.isLoading || updateSchoolSettingMutation?.isLoading ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : (
                    <>
                      <BorderColorIcon className="text-3xl mr-1" />
                      CẬP NHẬT
                    </>
                  )}
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
                  <span className="text-base font-bold mx-2">Cấp bật: </span>
                  <span className="text-sm text-color">
                    {data?.schoolLevel || "Chưa có dữ liệu!"}
                  </span>
                </div>
                <div className="flex items-center mt-4 max-[639px]:mb-4">
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
                    ẢNH NỔI BẬT
                  </MDTypography>
                </MDBox>
                <div className="flex items-center">
                  <FilterIcon />
                  <span className="text-base font-bold mx-2">Ảnh nổi bật(1): </span>
                  <img
                    className="w-14 ml-2 h-14 rounded-md object-cover object-center"
                    src={schoolSlider1 ? schoolSlider1 : sliderImage1}
                    alt="Ảnh nổi bật 1"
                  />
                </div>
                <div className="flex items-center mt-4">
                  <FilterIcon />
                  <span className="text-base font-bold mx-2">Ảnh nổi bật(2): </span>
                  <img
                    className="w-14 ml-2 h-14 rounded-md object-cover object-center"
                    src={schoolSlider2 ? schoolSlider2 : sliderImage2}
                    alt="Ảnh nổi bật 1"
                  />
                </div>
                <div className="flex items-center mt-4 max-[639px]:mb-4">
                  <FilterIcon />
                  <span className="text-base font-bold mx-2">Ảnh nổi bật(3): </span>
                  <img
                    className="w-14 ml-2 h-14 rounded-md object-cover object-center"
                    src={schoolSlider3 ? schoolSlider3 : sliderImage3}
                    alt="Ảnh nổi bật 1"
                  />
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
                  <span className="text-base font-bold mx-2">Ảnh logo: </span>
                  <img
                    className="w-14 ml-2 h-14 rounded-md object-cover object-center mt-3"
                    src={imageURL ? imageURL : logoImage}
                    alt="avatar"
                  />
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
