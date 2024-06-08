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
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";

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
import { getAllTeachers } from "services/TeacherService";

//get access token
const accessToken = localStorage.getItem("authToken");
const students = ["HS0001", "HS0002", "HS0003", "HS0004", "HS0005", "HS0006", "HS0007"];

export default function ClassManagement() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalEditOpen, setModalEditOpen] = useState(false);
  const [modalDeleteOpen, setModalDeleteOpen] = useState(false);
  const [deletedData, setDeletedData] = useState({});
  const [currentData, setCurrentData] = useState([]);
  const navigate = useNavigate();

  const queryClient = useQueryClient();
  const { data, error, isLoading } = useQuery(["classState", { accessToken }], () =>
    getAllClasses(accessToken)
  );

  const { data: currentTeacher } = useQuery(["teacherState", { accessToken }], () =>
    getAllTeachers(accessToken)
  );
  useEffect(() => {
    if (Array.isArray(data?.data)) {
      setCurrentData(data.data);
    } else {
      setCurrentData([]);
    }
  }, [data]);

  const [schoolYear, setSchoolYear] = useState(schoolYears.data[0].schoolYear);
  const handleSchoolYearSelectedChange = (event) => {
    setSchoolYear(event.target.value);
  };

  const formattedTeachers = currentTeacher?.data.map((teacher) => ({
    label: `${teacher.fullname}(${teacher.id})`,
    value: teacher.id,
  }));

  const formattedSchoolYears = schoolYears.data.map((year) => ({
    label: year.schoolYear,
    value: year.schoolYear,
  }));

  const {
    control,
    handleSubmit,
    reset,
    setValue: noSetValue,
    formState: { errors },
  } = useForm();

  const {
    control: controlEditAction,
    handleSubmit: handleSubmitEditAction,
    reset: resetEditAction,
    setValue,
    formState: { errors: errorsEditAction },
  } = useForm();

  //call api add class
  const addClassMutation = useMutation((classData) => addClass(accessToken, classData), {
    onSuccess: (response) => {
      queryClient.invalidateQueries("classState");
      if (response && response.success) {
        toast.success("Tạo lớp học thành công!");
      } else {
        toast.error(`${response.data} !`);
      }
      reset();
      setModalOpen(false);
    },
  });

  const handleAddClass = (data) => {
    const classData = {
      classroom: data.classroom,
      schoolYear: data.schoolYear,
      teacherID: data.teacherID,
      students: students,
    };
    console.log(classData);
    addClassMutation.mutate(classData);
  };

  const handleCloseEditModal = () => {
    setModalEditOpen(false);
  };

  // Xử lí show lên form edit thôi
  const handleEdit = (rowItem) => {
    console.log(rowItem);
    if (rowItem) {
      setValue("idEdit", rowItem[0]);
      setValue("classroomEdit", rowItem[1]);
      setValue("schoolYearEdit", rowItem[2]);
      setValue("teacherIDEdit", rowItem[4]);
      setModalEditOpen(true);
    } else {
      setModalEditOpen(false);
    }
  };

  const updateClassMutation = useMutation((classData) => updateClass(accessToken, classData), {
    onSuccess: (response) => {
      queryClient.invalidateQueries("classState");
      if (response && response.success) {
        toast.success("Cập nhật lớp học thành công!");
      } else {
        toast.error(`${response.data} !`);
      }
      reset();
      setModalOpen(false);
    },
  });

  // Xử lí get dữ liệu khi submit
  const handleUpdateClass = (data) => {
    console.log("Submit data", data);
    const classData = {
      id: data.idEdit,
      classroom: data.classroomEdit,
      schoolYear: data.schoolYearEdit,
      teacherID: data.teacherIDEdit,
      students: students,
    };
    console.log("Data gửi đi: ", classData);
    updateClassMutation.mutate(classData);
  };

  const handleClearEditForm = () => {
    resetEditAction();
  };

  const handleStatistic = () => {
    setCurrentData(filterByButton(schoolYear, data?.data));
  };

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
    deleteClassMutation.mutate(deletedData.id);
  };

  const handleChangeSearchValue = (txtSearch) => {
    setCurrentData(filterStudentClasses(txtSearch, data?.data));
  };

  const filterByButton = (action, data) => {
    if (data) {
      return data.filter((item) => {
        return item.schoolYear.toLowerCase() === action.toLowerCase();
      });
    }
  };

  const filterStudentClasses = (txtSearch, data) => {
    const search = txtSearch.trim().toLowerCase();
    if (data) {
      return data.filter((classroom) => {
        return (
          classroom.teacher.toLowerCase().includes(search) ||
          classroom.schoolYear.toLowerCase().includes(search) ||
          classroom.classroom.toLowerCase().includes(search)
        );
      });
    }
  };

  return (
    <DashboardLayout>
      <ToastContainer autoClose={3000} />
      <DashboardNavbar />
      <Card className="max-h-max mb-8">
        <MDBox p={5}>
          <div className="text-center mt-0 ">
            <div className="flex justify-center items-center text-3xl mx-auto w-full">
              <MeetingRoomIcon />
              <h4 className="text-xl font-bold ml-3">QUẢN LÍ LỚP HỌC</h4>
            </div>
          </div>
          <div className="mt-4 grid sm:grid-cols-1 lg:grid-cols-2 gap-1">
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
                    <div className="flex">
                      <InputBaseComponent
                        placeholder="Nhập tên lớp học"
                        type="text"
                        control={control}
                        setValue={noSetValue}
                        name="classroom"
                        className="w-1/2 mr-2"
                        label="Tên lớp"
                        errors={errors}
                        validationRules={{
                          required: "Không được bỏ trống!",
                          minLength: {
                            value: 4,
                            message: "tên lớp ít nhât 4 kí tự!",
                          },
                          maxLength: {
                            value: 10,
                            message: "Tên lớp nhiều nhất 10 kí tự!",
                          },
                        }}
                      />
                      <InputBaseComponent
                        label="Năm học"
                        name="schoolYear"
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
                    </div>
                    <InputBaseComponent
                      label="GV chủ nhiệm"
                      name="teacherID"
                      control={control}
                      setValue={noSetValue}
                      type="select"
                      options={formattedTeachers}
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
                itemsPerPage={10}
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
              <form onSubmit={handleSubmitEditAction(handleUpdateClass)}>
                <div className="flex">
                  <InputBaseComponent
                    placeholder="Nhập tên lớp học"
                    type="text"
                    control={controlEditAction}
                    className="w-1/2 mr-2"
                    name="classroomEdit"
                    label="Tên lớp"
                    setValue={setValue}
                    errors={errorsEditAction}
                    validationRules={{
                      required: "Không được bỏ trống!",
                    }}
                  />
                  <InputBaseComponent
                    label="Năm học"
                    name="schoolYearEdit"
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
                </div>
                <InputBaseComponent
                  label="Giáo viên chủ nhiệm"
                  name="teacherIDEdit"
                  control={controlEditAction}
                  setValue={setValue}
                  type="select"
                  options={formattedTeachers}
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
