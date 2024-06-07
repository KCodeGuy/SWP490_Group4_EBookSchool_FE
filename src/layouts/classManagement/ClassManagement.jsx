import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { ToastContainer, toast } from "react-toastify";
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
import { getAllClasses, addClass, updateClass, deleteClass } from "../../services/ClassService";
import { useNavigate } from "react-router-dom";
//get access token
const token = localStorage.getItem("authToken");
const accessToken = `Bearer ${token}`;

// Class management (UolLT)
export default function ClassManagement() {
  console.log("Render-component");
  //1. Modal form states open, close
  const [modalOpen, setModalOpen] = useState(false);
  const [modalEditOpen, setModalEditOpen] = useState(false);
  const [modalDeleteOpen, setModalDeleteOpen] = useState(false);
  const [deletedData, setDeletedData] = useState({});
  const [currentData, setCurrentData] = useState([]);
  const navigate = useNavigate();

  const queryClient = useQueryClient();
  //call api get all
  const { data, error, isLoading } = useQuery(["classState", { accessToken }], () =>
    getAllClasses(accessToken)
  );

  // useEffect(() => {
  //   setCurrentData(data?.data);
  // }, [data]);
  useEffect(() => {
    if (Array.isArray(data?.data)) {
      setCurrentData(data.data);
    } else {
      setCurrentData([]);
    }
  }, [data]);
  // const [currentData, setCurrentData] = useState(data?.data);

  //2. Set data by Call API
  const [schoolYear, setSchoolYear] = React.useState(schoolYears.data[0].schoolYear);
  const handleSchoolYearSelectedChange = (event) => {
    setSchoolYear(event.target.value);
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

  const addClassMutation = useMutation((classData) => addClass(accessToken, classData), {
    onSuccess: (response) => {
      queryClient.invalidateQueries("classState");
      if (response && response.success) {
        toast.success("Tạo lớp học thành công!");
      } else {
        toast.error(`${response.data}!`);
      }
      reset();
      setModalOpen(false);
    },
  });

  const handleAddClass = (data) => {
    const classData = {
      teacher: data.teacher,
      schoolYear: data.schoolYear,
      classroom: data.classroom,
      students: data.students,
    };
    addClassMutation.mutate(classData);
  };

  //5. Functions handle editing
  const handleCloseEditModal = () => {
    setModalEditOpen(false);
  };
  const handleEdit = (rowItem) => {
    if (rowItem) {
      setValue("idEdit", rowItem[0]);
      setValue("nameEdit", rowItem[0]);
      setValue("classroomEdit", rowItem[0]);
      setValue("selectOptionEdit", rowItem[2]);
      setValue("teacherEdit", rowItem[3]);
      setModalEditOpen(true);
    } else {
      setModalEditOpen(false);
    }
  };

  const updateClassMutation = useMutation(
    (classData) => updateNotification(accessToken, classData),
    {
      onSuccess: (response) => {
        queryClient.invalidateQueries("classState");
        if (response && response.success) {
          toast.success("Cập nhật lớp học thành công!");
        } else {
          toast.error(`${response.data}!`);
        }
        reset();
        setModalEditOpen(false);
      },
    }
  );

  const handleEditClass = (data) => {
    console.log("Call API edit class: ", data);
    // Call API edit class here
  };
  const handleClearEditForm = () => {
    resetEditAction();
  };

  const handleStatistic = () => {
    console.log("Call api: ", { schoolYear, classroom });
  };
  //delete api
  const deleteClassMutation = useMutation((classId) => deleteClass(accessToken, classId), {
    onSuccess: (response) => {
      queryClient.invalidateQueries("classState");
      if (response && response.success) {
        toast.success("Xóa lớp học thành công!");
      } else {
        toast.error("Xóa lớp học thất bại!");
      }
      setModalDeleteOpen(false);
    },
  });

  const handleDelete = (rowItem) => {
    if (rowItem) {
      setDeletedData({
        id: rowItem[0],
      });
      setModalDeleteOpen(true);
    }
  };

  const handleDeleteAPI = () => {
    console.log("Deleted ID:", deletedData.id);
    deleteClassMutation.mutate(deletedData.id);
  };

  //search value
  const handleChangeSearchValue = (txtSearch) => {
    setCurrentData(filterStudentClasses(txtSearch, data?.data));
  };

  const filterStudentClasses = (txtSearch, data) => {
    const search = txtSearch.trim().toLowerCase();
    return data.filter((classroom) => {
      return (
        classroom.teacher.toLowerCase().includes(search) ||
        classroom.schoolYear.toLowerCase().includes(search) ||
        classroom.classroom.toLowerCase().includes(search)
      );
    });
  };
  return (
    <DashboardLayout>
      <ToastContainer autoClose={3000} />
      <DashboardNavbar />
      <Card className="max-h-max mb-8">
        <MDBox p={5}>
          {/* DO NOT DELETE CODE AS ABOVE*/}
          {/* Your code here */}
          <div className="text-center mt-0">
            <h4 className="text-xl font-bold">QUẢN LÍ LỚP HỌC</h4>
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
              <div className="max-[639px]:mt-2 ml-3">
                <ButtonComponent type="success" onClick={handleStatistic}>
                  <FilterAltIcon className="" /> Tìm kiếm
                </ButtonComponent>
              </div>
            </div>
            <div className="flex justify-end items-center sm:w-full sm:flex-wrap ">
              <SearchInputComponent
                onSearch={handleChangeSearchValue}
                placeHolder="Nhập từ khóa..."
              />
              <div className="ml-3">
                <ButtonComponent className="" onClick={() => setModalOpen(true)}>
                  <AddCircleOutlineIcon className="text-3xl mr-1" />
                  Tạo
                </ButtonComponent>
                <PopupComponent
                  title="TẠO LỚP HỌC"
                  description="Hãy tạo lớp học để bắt đầu năm học mới"
                  icon={<AddCircleOutlineIcon />}
                  isOpen={modalOpen}
                  onClose={() => setModalOpen(false)}
                >
                  <form onSubmit={handleSubmit(handleAddClass)}>
                    <InputBaseComponent
                      placeholder="Nhập tên lớp học"
                      type="text"
                      control={control}
                      setValue={noSetValue}
                      name="name"
                      label="Tên lớp"
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
                      placeholder="Nhập giáo viên chủ nhiệm"
                      type="text"
                      control={control}
                      setValue={noSetValue}
                      name="homeroomteacher"
                      label="GV chủ nhiệm"
                      errors={errors}
                      validationRules={{
                        required: "Không được bỏ trống!",
                      }}
                    />
                    <div className="mt-4 flex justify-end">
                      <ButtonComponent type="error" action="reset" onClick={() => reset()}>
                        CLEAR
                      </ButtonComponent>
                      <ButtonComponent action="submit">TẠO</ButtonComponent>
                    </div>
                  </form>
                </PopupComponent>
              </div>
            </div>
          </div>
          <div>
            {isLoading ? (
              <div className="text-center">Loading...</div>
            ) : (
              <TableComponent
                header={["Tên lớp", "Năm học", "Phòng học", "Giáo viên chủ nhiệm"]}
                data={currentData?.map((item) => [
                  item.id.toString(),
                  item.classroom.toString(),
                  item.schoolYear.toString(),
                  item.classroom.toString(),
                  item.teacher.toString(),
                ])}
                itemsPerPage={4}
                onEdit={handleEdit}
                hiddenColumns={[0]}
                onDelete={handleDelete}
                className="mt-8"
              />
            )}
            <PopupComponent
              title="CẬP NHẬT"
              description="Hãy chỉnh sửa để bắt đầu năm học mới"
              icon={<EditIcon />}
              isOpen={modalEditOpen}
              onClose={handleCloseEditModal}
            >
              <form onSubmit={handleSubmitEditAction(handleEditClass)}>
                <InputBaseComponent
                  placeholder="Nhập tên lớp học"
                  type="text"
                  control={controlEditAction}
                  name="nameEdit"
                  label="Tên lớp"
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
                  placeholder="Nhập giáo viên chủ nhiệm"
                  type="text"
                  control={controlEditAction}
                  name="teacherEdit"
                  label="Giáo viên chủ nhiệm"
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
                  <ButtonComponent action="submit">CẬP NHẬT</ButtonComponent>
                </div>
              </form>
            </PopupComponent>
            <PopupComponent
              title="XÓA LỚP HỌC"
              description="Hãy kiểm xác nhận thông tin trước khi xóa"
              icon={<DeleteIcon />}
              isOpen={modalDeleteOpen}
              onClose={() => setModalDeleteOpen(false)}
            >
              <p>Bạn có chắc chắn muốn xóa lớp học?</p>
              <div className="mt-4 flex justify-end">
                <ButtonComponent
                  type="error"
                  action="button"
                  onClick={() => setModalDeleteOpen(false)}
                >
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
