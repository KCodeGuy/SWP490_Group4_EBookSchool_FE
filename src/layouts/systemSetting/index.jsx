import { Card, Grid } from "@mui/material";
import MDBox from "components/MDBox";
import Footer from "examples/Footer";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import MarkunreadIcon from "@mui/icons-material/Markunread";

import React, { useState } from "react";
import MDTypography from "components/MDTypography";
import ButtonComponent from "components/ButtonComponent/ButtonComponent";
import PopupComponent from "components/PopupComponent/PopupComponent";
import InputBaseComponent from "components/InputBaseComponent/InputBaseComponent";
import { useForm } from "react-hook-form";

export default function SystemSetting() {
  const [modalEditOpen, setModalEditOpen] = useState(false);
  const {
    control: controlEditAction,
    handleSubmit: handleSubmitEditAction,
    reset: resetEditAction,
    setValue,
    formState: { errors: errorsEditAction },
  } = useForm();

  const handleEdit = () => {};
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Card className="h-screen mb-8">
        <MDBox p={5}>
          <div className="text-center mt-0">
            <h4 className="text-xl font-bold">CÀI ĐẶT HỆ THỐNG</h4>
          </div>
          <div className="text-right">
            <ButtonComponent onClick={() => setModalEditOpen(true)}>CẬP NHẬT</ButtonComponent>
          </div>
          <PopupComponent
            title="CẬP NHẬT"
            description="Cập nhật hệ thống"
            isOpen={modalEditOpen}
            onClose={() => setModalEditOpen(false)}
          >
            <form onSubmit={handleSubmitEditAction(handleEdit)}>
              <div className="flex">
                <InputBaseComponent
                  type="text"
                  className="w-1/2 mr-2"
                  control={controlEditAction}
                  name="nameEdit"
                  placeholder="Nhập tên trường..."
                  label="Tên trường"
                  setValue={setValue}
                  errors={errorsEditAction}
                  validationRules={{
                    required: "Không được bỏ trống!",
                  }}
                />
                <InputBaseComponent
                  type="number"
                  className="w-1/2 mr-2"
                  control={controlEditAction}
                  name="teacherQuantity"
                  placeholder="Nhập SL giáo viên"
                  label="SL giáo viên"
                  setValue={setValue}
                  errors={errorsEditAction}
                  validationRules={{
                    required: "Không được bỏ trống!",
                  }}
                />
                <InputBaseComponent
                  type="number"
                  className="w-1/2"
                  control={controlEditAction}
                  name="establishedYear"
                  placeholder="Nhập năm thành lập"
                  label="Năm thành lập"
                  setValue={setValue}
                  errors={errorsEditAction}
                  validationRules={{
                    required: "Không được bỏ trống!",
                  }}
                />
              </div>
              <InputBaseComponent
                type="number"
                className="w-full"
                control={controlEditAction}
                name="eventQuantity"
                placeholder="Nhập số lượng sự kiện"
                label="Sự kiện"
                setValue={setValue}
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
                  name="sliderImg1"
                  label="Ảnh slider 1"
                  errors={errorsEditAction}
                  validationRules={{
                    required: "Không được bỏ trống!",
                  }}
                />
                <InputBaseComponent
                  type="file"
                  className="w-1/2 mr-2"
                  control={controlEditAction}
                  setValue={setValue}
                  name="sliderImg2"
                  label="Ảnh slider 2"
                  errors={errorsEditAction}
                  validationRules={{
                    required: "Không được bỏ trống!",
                  }}
                />
                <InputBaseComponent
                  type="file"
                  className="w-1/2"
                  control={controlEditAction}
                  setValue={setValue}
                  name="sliderImg3"
                  label="Ảnh slider 3"
                  errors={errorsEditAction}
                  validationRules={{
                    required: "Không được bỏ trống!",
                  }}
                />
              </div>

              <InputBaseComponent
                type="textArea"
                className="w-full"
                control={controlEditAction}
                setValue={setValue}
                name="introductionSchool"
                label="Giới thiệu"
                errors={errorsEditAction}
                validationRules={{
                  required: "Không được bỏ trống!",
                }}
              />

              <InputBaseComponent
                type="textArea"
                className="w-full"
                control={controlEditAction}
                setValue={setValue}
                name="others"
                label="Thông tin khác"
                errors={errorsEditAction}
                validationRules={{
                  required: "Không được bỏ trống!",
                }}
              />
              <div className="mt-4 flex justify-end">
                <ButtonComponent type="error" action="reset" onClick={() => resetEditAction()}>
                  CLEAR
                </ButtonComponent>
                <ButtonComponent action="submit">CẬP NHẬT</ButtonComponent>
              </div>
            </form>
          </PopupComponent>
          <Grid container spacing={1}>
            <Grid item xs={12} md={4}>
              <MDBox mb={4}>
                <MDTypography variant="h6" fontWeight="medium" textTransform="capitalize">
                  THÔNG TIN CHUNG
                </MDTypography>
              </MDBox>
              <div className="flex items-center">
                <MarkunreadIcon />
                <span className="text-base font-bold mx-2">Tên trường: </span>
                <span className="text-sm text-color">Chưa có dữ liệu</span>
              </div>
              <div className="flex items-center mt-4">
                <MarkunreadIcon />
                <span className="text-base font-bold mx-2">Số lượng giáo viên: </span>
                <span className="text-sm text-color">Chưa có dữ liệu</span>
              </div>
              <div className="flex items-center mt-4">
                <MarkunreadIcon />
                <span className="text-base font-bold mx-2">Số năm thành lập: </span>
                <span className="text-sm text-color">Chưa có dữ liệu</span>
              </div>
              <div className="flex items-center mt-4">
                <MarkunreadIcon />
                <span className="text-base font-bold mx-2">Tỉ lệ trúng tuyển đại học: </span>
                <span className="text-sm text-color">Chưa có dữ liệu</span>
              </div>
              <div className="flex items-center mt-4">
                <MarkunreadIcon />
                <span className="text-base font-bold mx-2">Sự kiện: </span>
                <span className="text-sm text-color">Chưa có dữ liệu</span>
              </div>
            </Grid>
            <Grid item xs={12} md={4}>
              <MDBox mb={4}>
                <MDTypography variant="h6" fontWeight="medium" textTransform="capitalize">
                  THÔNG TIN KHÁC
                </MDTypography>
              </MDBox>
              <div className="flex items-center">
                <MarkunreadIcon />
                <span className="text-base font-bold mx-2">Logo: </span>
                <span className="text-sm text-color">Chưa có dữ liệu</span>
              </div>
              <div className="flex items-center mt-4">
                <MarkunreadIcon />
                <span className="text-base font-bold mx-2">Giới thiệu: </span>
                <span className="text-sm text-color">Chưa có dữ liệu</span>
              </div>
              <div className="flex items-center mt-4">
                <MarkunreadIcon />
                <span className="text-base font-bold mx-2">Hướng dẫn: </span>
                <span className="text-sm text-color">Chưa có dữ liệu</span>
              </div>
            </Grid>
            <Grid item xs={12} md={4}>
              <MDBox mb={4}>
                <MDTypography variant="h6" fontWeight="medium" textTransform="capitalize">
                  SLIDER
                </MDTypography>
              </MDBox>
              <div className="flex items-center">
                <MarkunreadIcon />
                <span className="text-base font-bold mx-2">Ảnh slider 1: </span>
                <span className="text-sm text-color">Chưa có dữ liệu</span>
              </div>
              <div className="flex items-center mt-4">
                <MarkunreadIcon />
                <span className="text-base font-bold mx-2">Ảnh slider 2: </span>
                <span className="text-sm text-color">Chưa có dữ liệu</span>
              </div>
              <div className="flex items-center mt-4">
                <MarkunreadIcon />
                <span className="text-base font-bold mx-2">Ảnh slider 3: </span>
                <span className="text-sm text-color">Chưa có dữ liệu</span>
              </div>
              {/* <div className="flex items-center mt-4">
                <MarkunreadIcon />
                <span className="text-base font-bold mx-2">Ảnh slider 4: </span>
                <span className="text-sm text-color">Chưa có dữ liệu</span>
              </div>
              <div className="flex items-center mt-4">
                <MarkunreadIcon />
                <span className="text-base font-bold mx-2">Ảnh slider 5: </span>
                <span className="text-sm text-color">Chưa có dữ liệu</span>
              </div> */}
            </Grid>
          </Grid>
        </MDBox>
      </Card>
      <Footer />
    </DashboardLayout>
  );
}
