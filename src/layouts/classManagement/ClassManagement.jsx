import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import React, { useState } from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { Card } from "@mui/material";
import MDBox from "components/MDBox";
import Footer from "examples/Footer";
import { useForm } from "react-hook-form";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import FilterAltIcon from "@mui/icons-material/FilterAlt";

import "./style.scss";
import { classrooms } from "../../mock/classroom";
import { studentClasses } from "../../mock/class";
import { schoolYears } from "../../mock/schoolYear";
import InputBaseComponent from "../../components/InputBaseComponent/InputBaseComponent";
import PopupComponent from "../../components/PopupComponent/PopupComponent";
import TableComponent from "../../components/TableComponent/TableComponent";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import SearchInputComponent from "../../components/SearchInputComponent/SearchInputComponent";

// Class management (UolLT)
export default function ClassManagement() {
  //1. Modal form states open, close
  const [modalOpen, setModalOpen] = useState(false);
  const [modalEditOpen, setModalEditOpen] = useState(false);
  const [modalDeleteOpen, setModalDeleteOpen] = useState(false);
  const [deletedClass, setDeletedClass] = useState({});
  const [currentData, setCurrentData] = useState(studentClasses.data);

  //2. Set data by Call API
  const [schoolYear, setSchoolYear] = React.useState(schoolYears.data[0].schoolYear);
  const handleSchoolYearSelectedChange = (event) => {
    setSchoolYear(event.target.value);
  };
  const [classroom, setClassRoom] = React.useState(classrooms.data[0].name);
  const handleClassRoomSelectedChange = (event) => {
    setClassRoom(event.target.value);
  };
  const formattedSchoolYears = schoolYears.data.map((year) => ({
    label: year.schoolYear,
    value: year.schoolYear,
  }));

  //3.1 React-hook-from of adding action
  const {
    control,
    handleSubmit,
    reset,
    setValue: noSetValue,
    formState: { errors },
  } = useForm();

  //3.1 React-hook-from of editing action
  const {
    control: controlEditAction,
    handleSubmit: handleSubmitEditAction,
    reset: resetEditAction,
    setValue,
    formState: { errors: errorsEditAction },
  } = useForm();

  //4. Functions handle adding
  const handleOpenAddModal = () => {
    setModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setModalOpen(false);
  };

  const handleAddClass = (data) => {
    console.log("Call API add class: ", data);
    // Call API add class here
  };

  const handleClearAddForm = () => {
    reset(); // Reset the form of adding modal
  };

  //5. Functions handle editing
  const handleCloseEditModal = () => {
    setModalEditOpen(false);
  };
  const handleEdit = (rowItem) => {
    if (rowItem) {
      setValue("idEdit", rowItem[0]);
      setValue("nameEdit", rowItem[1]);
      setValue("classroomEdit", rowItem[3]);
      setValue("selectOptionEdit", rowItem[2]);
      setValue("descriptionEdit", rowItem[4]);
      setModalEditOpen(true);
    } else {
      setModalEditOpen(false);
    }
  };
  const handleEditClass = (data) => {
    console.log("Call API edit class: ", data);
    // Call API edit class here
  };
  const handleClearEditForm = () => {
    resetEditAction();
  };

  //6. Functions handle deleting
  const handleCloseDeleteModal = () => {
    setModalDeleteOpen(false);
  };

  const handleStatistic = () => {
    console.log("Call api: ", { schoolYear, classroom });
  };

  const handleDelete = (rowItem) => {
    if (rowItem) {
      setDeletedClass({
        idEdit: rowItem[0],
        nameEdit: rowItem[1],
        classroomEdit: rowItem[3],
        selectOptionEdit: rowItem[2],
        descriptionEdit: rowItem[4],
      });
      setModalDeleteOpen(true);
    } else {
      setModalDeleteOpen(false);
    }
  };

  const handleDeleteAPI = () => {
    setModalDeleteOpen(false);
    console.log("Call API delete class: ", deletedClass);
    // Call API delete class here
  };

  const handleChangeSearchValue = (txtSearch) => {
    console.log(txtSearch);
    setCurrentData(filterStudentClasses(txtSearch, studentClasses.data));
  };

  const filterStudentClasses = (txtSearch, data) => {
    const search = txtSearch.trim().toLowerCase();
    return data.filter((classroom) => {
      return (
        classroom.name.toLowerCase().includes(search) ||
        (classroom.description && classroom.description.toLowerCase().includes(search)) ||
        classroom.schoolYear.toLowerCase().includes(search) ||
        classroom.classroom.toLowerCase().includes(search)
      );
    });
  };
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Card className="max-h-max">
        <MDBox p={5}>
          {/* DO NOT DELETE CODE AS ABOVE*/}
          {/* Your code here */}
          <div className="text-center mt-0">
            <h4 className="text-xl font-bold">Quản lý lớp học</h4>
          </div>
          <div className="mt-4 grid sm:grid-cols-1 lg:grid-cols-2 gap-1">
            {/* School Year Select */}
            <div className="flex justify-start max-[639px]:flex-wrap">
              <FormControl sx={{ minWidth: 120 }}>
                <InputLabel id="select-school-year-lable">Năm học</InputLabel>
                <Select
                  labelId="select-school-year-lable"
                  id="elect-school-year"
                  value={schoolYear}
                  className="h-11 mr-0"
                  label="Năm học"
                  onChange={handleSchoolYearSelectedChange}
                >
                  {schoolYears.data.map((item, index) => (
                    <MenuItem key={index} value={item.schoolYear.toString()}>
                      {item.schoolYear.toString()}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl sx={{ minWidth: 120, marginLeft: "12px" }}>
                <InputLabel id="select-class-room-lable">Phòng học</InputLabel>
                <Select
                  labelId="select-class-room-lable"
                  id="select-class-room"
                  value={classroom}
                  className="h-11 mr-3"
                  label="Phòng học"
                  onChange={handleClassRoomSelectedChange}
                >
                  {classrooms.data.map((item, index) => (
                    <MenuItem key={index} value={item.name.toString()}>
                      {item.name.toString()}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <div className="max-[639px]:mt-2">
                <ButtonComponent type="success" onClick={handleStatistic}>
                  <FilterAltIcon className="mr-1" /> Thống kế
                </ButtonComponent>
              </div>
            </div>
            <div className="flex justify-end items-center sm:w-full sm:flex-wrap ">
              <SearchInputComponent
                onSearch={handleChangeSearchValue}
                placeHolder="Nhập từ khóa..."
              />
              <div className="ml-3">
                <ButtonComponent className="" onClick={handleOpenAddModal}>
                  <AddCircleOutlineIcon className="text-3xl mr-1" />
                  Tạo lớp học
                </ButtonComponent>
                <PopupComponent
                  title="TẠO LỚP HỌC"
                  description="Hãy tạo lớp học để bắt đầu năm học mới"
                  icon={<AddCircleOutlineIcon />}
                  isOpen={modalOpen}
                  onClose={handleCloseAddModal}
                >
                  <form onSubmit={handleSubmit(handleAddClass)}>
                    <InputBaseComponent
                      placeholder="Nhập tên phòng học"
                      type="text"
                      control={control}
                      setValue={noSetValue}
                      name="name"
                      label="Tên phòng"
                      errors={errors}
                      validationRules={{
                        required: "Không được bỏ trống!",
                      }}
                    />
                    <div className="flex">
                      <InputBaseComponent
                        label="Năm học"
                        name="selectOption"
                        className="w-1/2 mr-2"
                        control={control}
                        setValue={noSetValue}
                        type="select"
                        options={formattedSchoolYears}
                        errors={errors}
                        validationRules={{
                          required: "Hãy chọn năm học!",
                        }}
                      />
                      <InputBaseComponent
                        placeholder="Nhập phòng học"
                        type="text"
                        control={control}
                        setValue={noSetValue}
                        name="classroom"
                        label="Phòng học"
                        errors={errors}
                        validationRules={{
                          required: "Không được bỏ trống!",
                        }}
                      />
                    </div>
                    <InputBaseComponent
                      placeholder="Nhập mô tả phòng"
                      type="text"
                      control={control}
                      setValue={noSetValue}
                      name="description"
                      label="Mô tả"
                      errors={errors}
                      validationRules={{
                        required: "Không được bỏ trống!",
                      }}
                    />
                    <div className="mt-4 flex justify-end">
                      <ButtonComponent type="error" action="reset" onClick={handleClearAddForm}>
                        CLEAR
                      </ButtonComponent>
                      <ButtonComponent action="submit">TẠO LỚP HỌC</ButtonComponent>
                    </div>
                  </form>
                </PopupComponent>
              </div>
            </div>
          </div>
          <div>
            <TableComponent
              header={["ID", "Tên lớp", "Năm học", "Phòng học", "Mô tả"]}
              data={currentData.map((item) => [
                item.id.toString(),
                item.name.toString(),
                item.schoolYear.toString(),
                item.classroom.toString(),
                item.description.toString(),
              ])}
              itemsPerPage={4}
              onEdit={handleEdit}
              onDelete={handleDelete}
              className="mt-8"
            />
            <PopupComponent
              title="CẬP NHẬT"
              description="Hãy chỉnh sửa để bắt đầu năm học mới"
              icon={<EditIcon />}
              isOpen={modalEditOpen}
              onClose={handleCloseEditModal}
            >
              <form onSubmit={handleSubmitEditAction(handleEditClass)}>
                <InputBaseComponent
                  placeholder="Nhập tên phòng học"
                  type="text"
                  control={controlEditAction}
                  name="nameEdit"
                  label="Tên phòng"
                  setValue={setValue}
                  errors={errorsEditAction}
                  validationRules={{
                    required: "Không được bỏ trống!",
                  }}
                />
                <div className="flex">
                  <InputBaseComponent
                    label="Năm học"
                    name="selectOptionEdit"
                    className="w-1/2 mr-2"
                    control={controlEditAction}
                    type="select"
                    options={formattedSchoolYears}
                    setValue={setValue}
                    errors={errorsEditAction}
                    validationRules={{
                      required: "Hãy chọn năm học!",
                    }}
                  />
                  <InputBaseComponent
                    placeholder="Nhập phòng học"
                    type="text"
                    control={controlEditAction}
                    name="classroomEdit"
                    label="Phòng học"
                    setValue={setValue}
                    errors={errorsEditAction}
                    validationRules={{
                      required: "Không được bỏ trống!",
                    }}
                  />
                </div>
                <InputBaseComponent
                  placeholder="Nhập mô tả phòng"
                  type="text"
                  control={controlEditAction}
                  name="descriptionEdit"
                  label="Mô tả"
                  setValue={setValue}
                  errors={errorsEditAction}
                  validationRules={{
                    required: "Không được bỏ trống!",
                  }}
                />
                <div className="mt-4 flex justify-end">
                  <ButtonComponent type="error" action="reset" onClick={handleClearEditForm}>
                    CLEAR
                  </ButtonComponent>
                  <ButtonComponent action="submit">CHỈNH SỬA</ButtonComponent>
                </div>
              </form>
            </PopupComponent>
            <PopupComponent
              title="XÓA LỚP HỌC"
              description="Hãy kiểm xác nhận thông tin trước khi xóa"
              icon={<DeleteIcon />}
              isOpen={modalDeleteOpen}
              onClose={handleCloseDeleteModal}
            >
              <p>Bạn có chắc chắn muốn xóa lớp học?</p>
              <div className="mt-4 flex justify-end">
                <ButtonComponent type="error" action="button" onClick={handleCloseDeleteModal}>
                  HỦY BỎ
                </ButtonComponent>
                <ButtonComponent action="button" onClick={handleDeleteAPI}>
                  XÓA
                </ButtonComponent>
              </div>
            </PopupComponent>
          </div>
        </MDBox>
      </Card>
      <Footer />
    </DashboardLayout>
  );
}
