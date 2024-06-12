import React, { useEffect, useState } from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { Card, CircularProgress, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import MDBox from "components/MDBox";
import Footer from "examples/Footer";
import { useForm } from "react-hook-form";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import { ToastContainer, toast } from "react-toastify";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import DownloadIcon from "@mui/icons-material/Download";
import { useNavigate } from "react-router-dom";
import BookIcon from "@mui/icons-material/Book";

import "./style.scss";
import noDataImage3 from "../../assets/images/noDataImage3.avif";
import { grades } from "../../mock/grade";
import { subjects, subject } from "../../mock/subject";
import { schoolYears } from "../../mock/schoolYear";
import InputBaseComponent from "../../components/InputBaseComponent/InputBaseComponent";
import PopupComponent from "../../components/PopupComponent/PopupComponent";
import TableComponent from "../../components/TableComponent/TableComponent";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import SearchInputComponent from "../../components/SearchInputComponent/SearchInputComponent";
import {
  getAllSubjects,
  addSubject,
  updateSubject,
  deleteSubject,
} from "../../services/SubjectService";
import { useMutation, useQuery, useQueryClient } from "react-query";
//get access token
const accessToken = localStorage.getItem("authToken");

const lessonPlans = [
  {
    slot: 1,
    title: "string 0",
  },
  {
    slot: 2,
    title: "string 1",
  },
  {
    slot: 3,
    title: "string 2",
  },
];

const componentScores = [
  {
    name: "Miệng",
    scoreFactor: 1,
    count: 3,
    semester: "Học kỳ I",
  },
  {
    name: "15p",
    scoreFactor: 1,
    count: 2,
    semester: "Học kỳ I",
  },
  {
    name: "1 Tiết",
    scoreFactor: 2,
    count: 1,
    semester: "Học kỳ I",
  },
  {
    name: "Cuối kỳ",
    scoreFactor: 3,
    count: 1,
    semester: "Học kỳ I",
  },
  {
    name: "Miệng",
    scoreFactor: 1,
    count: 3,
    semester: "Học kỳ II",
  },
  {
    name: "15p",
    scoreFactor: 1,
    count: 2,
    semester: "Học kỳ II",
  },
  {
    name: "1 Tiết",
    scoreFactor: 2,
    count: 1,
    semester: "Học kỳ II",
  },
  {
    name: "Cuối kỳ",
    scoreFactor: 3,
    count: 1,
    semester: "Học kỳ II",
  },
];

// Subject Management (UolLT)
export default function SubjectManagement() {
  //1. Modal form states open, close
  const [modalOpen, setModalOpen] = useState(false);
  const [modalEditOpen, setModalEditOpen] = useState(false);
  const [modalDeleteOpen, setModalDeleteOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState(0);
  const [markFactors, setMarkFactors] = useState([]);
  const [deletedData, setDeletedData] = useState({});
  const [currentData, setCurrentData] = useState([]);
  const navigate = useNavigate();

  const queryClient = useQueryClient();
  //call api get all
  const { data, error, isLoading } = useQuery(["subjectState", { accessToken }], () =>
    getAllSubjects(accessToken)
  );

  useEffect(() => {
    if (Array.isArray(data?.data)) {
      setCurrentData(data.data);
    } else {
      setCurrentData([]);
    }
  }, [data]);

  const lessonPlan = subject.data.lessonPlans.map((obj) => [obj.id, obj.title, obj.slot]);

  //2. Set data by Call API
  const [schoolYear, setSchoolYear] = React.useState(schoolYears.data[0].schoolYear);
  const handleSchoolYearSelectedChange = (event) => {
    setSchoolYear(event.target.value);
  };

  const [grade, setGrade] = React.useState(grades.data[0].name);
  const handleGradeSelectedChange = (event) => {
    setGrade(event.target.value);
  };

  const semesters = [
    { label: "Học kì I", value: "Học kỳ I" },
    { label: "Học kì II", value: "Học kỳ II" },
  ];

  const nameScore = [
    { label: "Kiểm tra miệng", value: "Miệng" },
    { label: "Kiểm tra 15 phút", value: "15p" },
    { label: "Kiểm tra 1 tiết", value: "1 Tiết" },
    { label: "Kiểm tra học kì", value: "Cuối kỳ" },
  ];

  const formattedSchoolYears = schoolYears.data.map((year) => ({
    label: year.schoolYear,
    value: year.schoolYear,
  }));

  const formattedGrades = grades.data.map((name) => ({
    label: name.name,
    value: name.name,
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

  const addSubjectsMutation = useMutation((subjectData) => addSubject(accessToken, subjectData), {
    onSuccess: (response) => {
      queryClient.invalidateQueries("subjectState");
      if (response && response.success) {
        toast.success("Tạo môn học thành công!");
      } else {
        toast.error(`${response.data} !`);
      }
      reset();
      setModalOpen(false);
    },
  });

  const handleAddSubject = (data) => {
    const classData = {
      name: data.name,
      grade: data.grade,
      lessonPlans: lessonPlans,
      componentScores: componentScores,
    };
    // console.log(classData);
    addSubjectsMutation.mutate(classData);
  };

  const handleAddMark = (data) => {
    let isDuplicateFactor = false;
    if (markFactors.length > 0) {
      markFactors.forEach((item) => {
        if (item.nameScore === data.nameScore && item.semester === data.semester) {
          isDuplicateFactor = true;
          toast.error(`Điểm thành phần "Kiểm tra ${data.nameScore}" đã tồn tại!`);
        }
      });
    }
    if (!isDuplicateFactor) {
      const id = markFactors.length;
      const newMarkFactor = { id, ...data };
      setMarkFactors((prevMarkFactors) => [...prevMarkFactors, newMarkFactor]);
    }
  };
  const handleAddLesson = (data) => {
    console.log("Call API add lesson: ", data);
    // Call API add subject here
  };

  const handleClearAddForm = () => {
    reset(); // Reset the form of adding modal
  };

  //5. Functions handle editing
  const handleCloseEditModal = () => {
    setModalEditOpen(false);
  };
  const handleEdit = (rowItem) => {
    // console.log(rowItem);
    if (rowItem) {
      setValue("idEdit", rowItem[0]);
      setValue("nameEdit", rowItem[1]);
      setValue("gradeEdit", rowItem[2]);
      setModalEditOpen(true);
    } else {
      setModalEditOpen(false);
    }
  };

  const updateSubjectMutation = useMutation(
    (subjectData) => updateSubject(accessToken, subjectData),
    {
      onSuccess: (response) => {
        queryClient.invalidateQueries("subjectState");
        if (response && response.success) {
          toast.success("Cập nhật môn học thành công!");
        } else {
          toast.error(`${response.data} !`);
        }
        reset();
        setModalOpen(false);
      },
    }
  );

  // Xử lí get dữ liệu khi submit
  const handleUpdateSubject = (data) => {
    // console.log("Submit data", data);
    const subjectData = {
      id: data.idEdit,
      name: data.nameEdit,
      grade: data.gradeEdit,
      lessonPlans: lessonPlans,
      componentScores: componentScores,
    };
    // console.log("Data gửi đi: ", subjectData);
    updateSubjectMutation.mutate(subjectData);
  };

  const handleClearEditForm = () => {
    resetEditAction();
  };

  const handleStatistic = () => {
    setCurrentData(filterByButton(grade, data?.data));
  };

  const deleteSubjectMutation = useMutation((subjectId) => deleteSubject(accessToken, subjectId), {
    onSuccess: (response) => {
      queryClient.invalidateQueries("subjectState");
      if (response && response.success) {
        toast.success("Xóa môn học thành công!");
      } else {
        toast.error("Xóa môn học thất bại!");
      }
      setModalDeleteOpen(false);
    },
    onError: (error) => {
      console.error("Error deleting subject:", error);
      toast.error("Đã xảy ra lỗi khi xóa môn học!");
    },
  });

  const handleDelete = (rowItem) => {
    if (rowItem) {
      setDeletedData({ id: rowItem[0] });
      setModalDeleteOpen(true);
    }
  };

  const handleDeleteAPI = () => {
    deleteSubjectMutation.mutate(deletedData.id);
  };

  const handleChangeSearchValue = (txtSearch) => {
    setCurrentData(filterSubjects(txtSearch, data?.data));
  };

  const filterByButton = (action, data) => {
    if (data) {
      return data.filter((item) => {
        return item.grade.toLowerCase() === action.toLowerCase();
      });
    }
  };

  const filterSubjects = (txtSearch, data) => {
    const search = txtSearch.trim().toLowerCase();
    return data.filter((subject) => {
      return (
        (subject.title && subject.title.toLowerCase().includes(search)) ||
        (subject.grade && subject.grade.toLowerCase().includes(search))
      );
    });
  };

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const hanldeDeleteMarkFactor = (data) => {
    deleteItemById(data[0]);
    console.log("Delete: ", data[0]);
  };

  const deleteItemById = (id) => {
    setMarkFactors(markFactors.filter((item) => item.id != id));
  };
  return (
    <DashboardLayout>
      <ToastContainer autoClose={3000} />
      <DashboardNavbar />
      <Card className="max-h-max mb-8">
        <MDBox p={5}>
          <div className="text-center mt-0 ">
            <div className="flex justify-center items-center text-3xl mx-auto w-full">
              <BookIcon />
              <h4 className="text-xl font-bold ml-3">QUẢN LÍ MÔN HỌC</h4>
            </div>
          </div>
          <div className="mt-4 grid sm:grid-cols-1 lg:grid-cols-2 gap-1">
            {/* School Year Select */}
            <div className="flex justify-start max-[639px]:flex-wrap">
              <FormControl sx={{ minWidth: 120, marginRight: "12px" }}>
                <InputLabel id="select-school-year-lable">Khối</InputLabel>
                <Select
                  labelId="select-school-year-lable"
                  id="elect-school-year"
                  value={grade}
                  className="h-11 mr-0"
                  label="Năm học"
                  onChange={handleGradeSelectedChange}
                >
                  {grades.data.map((item, index) => (
                    <MenuItem key={index} value={item.name.toString()}>
                      {item.name.toString()}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <div className="max-[639px]:mt-2">
                <ButtonComponent type="success" onClick={handleStatistic}>
                  <FilterAltIcon className="mr-1" /> Tìm kiếm
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
                  Tạo
                </ButtonComponent>
                <PopupComponent
                  title="TẠO MÔN HỌC"
                  description="Hãy tạo môn học để bắt đầu năm học mới"
                  icon={<AddCircleOutlineIcon />}
                  isOpen={modalOpen}
                  onClose={handleCloseAddModal}
                  tabs={[
                    { label: "TẠO MÔN" },
                    { label: "ĐIỂM THÀNH PHẦN" },
                    { label: "GIÁO ÁN" },
                    { label: "TẠO BẰNG EXCEL" },
                  ]}
                  currentTab={currentTab}
                  onTabChange={handleTabChange}
                >
                  {/* Content for Tab 1 */}
                  <div role="tabpanel" hidden={currentTab !== 0}>
                    <form onSubmit={handleSubmit(handleAddSubject)}>
                      <div className="flex">
                        <InputBaseComponent
                          placeholder="Nhập tên môn học"
                          type="text"
                          control={control}
                          className="w-1/2 mr-2"
                          setValue={noSetValue}
                          name="name"
                          label="Tên môn học"
                          errors={errors}
                          validationRules={{
                            required: "Không được bỏ trống!",
                          }}
                        />
                        <InputBaseComponent
                          label="Khối"
                          name="grade"
                          control={control}
                          className="w-1/2 mr-2"
                          setValue={noSetValue}
                          type="select"
                          options={formattedGrades}
                          errors={errors}
                          validationRules={{
                            required: "Hãy chọn khối!",
                          }}
                        />
                      </div>
                      <div className="mt-4 flex justify-end">
                        <ButtonComponent type="error" action="reset" onClick={handleClearAddForm}>
                          CLEAR
                        </ButtonComponent>
                        <ButtonComponent action="submit">TẠO</ButtonComponent>
                      </div>
                    </form>
                  </div>

                  {/* Content for Tab 2 */}
                  <div role="tabpanel" hidden={currentTab == 1}>
                    {/* Form để nhập điểm */}
                    <form onSubmit={handleSubmit(handleAddMark)}>
                      <div className="flex w-full">
                        <InputBaseComponent
                          className="w-1/2 mr-3"
                          type="select"
                          options={nameScore}
                          control={control}
                          setValue={noSetValue}
                          name="nameScore"
                          label="Điểm thành phần"
                          errors={errors}
                          validationRules={{
                            required: "Không được bỏ trống!",
                          }}
                        />
                        <InputBaseComponent
                          className="w-1/2"
                          type="select"
                          options={semesters}
                          control={control}
                          setValue={noSetValue}
                          name="semester"
                          label="Học kì"
                          errors={errors}
                          validationRules={{
                            required: "Không được bỏ trống!",
                          }}
                        />
                      </div>
                      <div className="flex w-full">
                        <InputBaseComponent
                          className="w-1/2 mr-3"
                          placeholder="Nhập số lượng"
                          type="number"
                          minValue={1}
                          maxValue={10}
                          control={control}
                          setValue={noSetValue}
                          name="count"
                          label="Số lượng"
                          errors={errors}
                          validationRules={{
                            required: "Không được bỏ trống!",
                          }}
                        />
                        <InputBaseComponent
                          className="w-1/2"
                          placeholder="Nhập hệ số"
                          type="number"
                          minValue={1}
                          maxValue={10}
                          control={control}
                          setValue={noSetValue}
                          name="scoreFactor"
                          label="Hệ số"
                          errors={errors}
                          validationRules={{
                            required: "Không được bỏ trống!",
                            pattern: {
                              value: /^[0-9]*$/,
                              message: "Điểm phải là một số nguyên dương!",
                            },
                          }}
                        />
                      </div>
                      <div className="mt-4 flex justify-end">
                        <ButtonComponent type="error" action="reset" onClick={handleClearAddForm}>
                          CLEAR
                        </ButtonComponent>
                        <ButtonComponent action="submit">THÊM ĐIỂM</ButtonComponent>
                      </div>
                    </form>
                    <p className="text-sm font-bold">TẤT CẢ CỘT ĐIỂM (TOÁN)</p>
                    <TableComponent
                      header={[, "Tên", "Số lượng", "Hệ số", "Kì học"]}
                      data={markFactors?.map((item) => [
                        item.id.toString(),
                        item.nameScore.toString(),
                        item.semester.toString(),
                        item.count.toString(),
                        item.scoreFactor.toString(),
                      ])}
                      isOrdered={false}
                      itemsPerPage={5}
                      // onEdit={handleEdit}
                      onDelete={hanldeDeleteMarkFactor}
                      hiddenColumns={[0]}
                      className="mt-1"
                    />
                  </div>
                  {/* Content for Tab 3 */}
                  <div role="tabpanel" hidden={currentTab == 2}>
                    {/* form nhập giáo án*/}
                    <form onSubmit={handleSubmit(handleAddMark)}>
                      <div className="flex">
                        <InputBaseComponent
                          placeholder="Nhập tên chủ đề"
                          className="w-1/2 mr-2"
                          type="text"
                          control={control}
                          setValue={noSetValue}
                          name="title"
                          label="Tên chủ đề"
                          errors={errors}
                          validationRules={{
                            required: "Không được bỏ trống!",
                          }}
                        />
                        <InputBaseComponent
                          className="w-1/2"
                          placeholder="Nhập thứ tự tiết"
                          type="number"
                          control={control}
                          setValue={noSetValue}
                          name="slot"
                          label="Thứ tự tiết học"
                          errors={errors}
                          validationRules={{
                            required: "Không được bỏ trống!",
                            pattern: {
                              value: /^[0-9]*$/,
                              message: "Điểm phải là một số nguyên dương!",
                            },
                          }}
                        />
                      </div>
                      <div className="mt-4 flex justify-end">
                        <ButtonComponent type="error" action="reset" onClick={handleClearAddForm}>
                          CLEAR
                        </ButtonComponent>
                        <ButtonComponent action="submit">TẠO</ButtonComponent>
                      </div>
                    </form>
                    <p className="text-sm font-bold">TẤT CẢ GIÁO ÁN (TOÁN)</p>
                    <TableComponent
                      header={["ID", "Tên chủ đề", "Thứ tự"]}
                      data={lessonPlan}
                      isOrdered={false}
                      itemsPerPage={5}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      className="mt-1"
                    />
                  </div>

                  <div role="tabpanel" hidden={currentTab == 3}>
                    <ButtonComponent action="submit">
                      <DownloadIcon className="mr-2" />
                      TẢI FILE
                    </ButtonComponent>
                    <form onSubmit={handleSubmit(handleAddMark)}>
                      <InputBaseComponent
                        name="timeTableFile"
                        label="Môn học(Excel)"
                        className="w-full mt-5"
                        control={control}
                        setValue={noSetValue}
                        type="file"
                        errors={errors}
                        validationRules={{
                          required: "Hãy chọn file!",
                        }}
                      />
                      <div className="mt-5 flex justify-end">
                        <ButtonComponent type="error" action="reset" onClick={handleClearAddForm}>
                          CLEAR
                        </ButtonComponent>
                        <ButtonComponent action="submit">TẠO</ButtonComponent>
                      </div>
                    </form>
                  </div>
                </PopupComponent>
              </div>
            </div>
          </div>
          <div>
            {isLoading ? (
              <div className="text-center primary-color my-10 text-xl italic font-medium">
                <div className="mx-auto flex items-center justify-center">
                  <p className="mr-3">Loading</p>
                  <CircularProgress size={24} color="inherit" />
                </div>
              </div>
            ) : data?.success ? (
              <TableComponent
                header={["Tên môn học", "Khối"]}
                data={currentData?.map((item) => [
                  item.id.toString(),
                  item.name.toString(),
                  item.grade.toString(),
                ])}
                itemsPerPage={15}
                hiddenColumns={[0]}
                onEdit={handleEdit}
                onDelete={handleDelete}
                className="mt-8"
              />
            ) : (
              <div className="text-center primary-color my-10 text-xl italic font-medium">
                <img
                  className="w-60 h-60 object-cover object-center mx-auto"
                  src={noDataImage3}
                  alt="Chưa có dữ liệu!"
                />
                Chưa có dữ liệu!
              </div>
            )}
            <PopupComponent
              title="CẬP NHẬT"
              description="Hãy chỉnh sửa để bắt đầu năm học mới"
              icon={<EditIcon />}
              isOpen={modalEditOpen}
              onClose={handleCloseEditModal}
            >
              <form onSubmit={handleSubmitEditAction(handleUpdateSubject)}>
                <InputBaseComponent
                  placeholder="Nhập tên môn học"
                  type="text"
                  control={controlEditAction}
                  name="nameEdit"
                  label="Tên môn học"
                  setValue={setValue}
                  errors={errorsEditAction}
                  validationRules={{
                    required: "Không được bỏ trống!",
                  }}
                />
                <InputBaseComponent
                  label="Khối"
                  name="gradeEdit"
                  control={controlEditAction}
                  setValue={noSetValue}
                  type="select"
                  options={formattedGrades}
                  errors={errors}
                  validationRules={{
                    required: "Hãy chọn khối!",
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
              title="XÓA MÔN HỌC"
              description="Hãy kiểm xác nhận thông tin trước khi xóa"
              icon={<DeleteIcon />}
              isOpen={modalDeleteOpen}
              onClose={() => setModalDeleteOpen(false)}
            >
              <p>Bạn có chắc chắn muốn xóa môn học?</p>
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
