import React, { useEffect, useRef, useState } from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { Card, CircularProgress, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import MDBox from "components/MDBox";
import Footer from "examples/Footer";
import { set, useForm } from "react-hook-form";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import { ToastContainer, toast } from "react-toastify";
import DownloadIcon from "@mui/icons-material/Download";
import CancelIcon from "@mui/icons-material/Cancel";
import BookIcon from "@mui/icons-material/Book";
import CleaningServicesIcon from "@mui/icons-material/CleaningServices";
import { useMutation, useQuery, useQueryClient } from "react-query";

import "./style.scss";
import noDataImage3 from "../../assets/images/noDataImage3.avif";
import InputBaseComponent from "../../components/InputBaseComponent/InputBaseComponent";
import PopupComponent from "../../components/PopupComponent/PopupComponent";
import TableComponent from "../../components/TableComponent/TableComponent";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import SearchInputComponent from "../../components/SearchInputComponent/SearchInputComponent";
import NotifyCheckInfoForm from "../../components/NotifyCheckInfoForm";
import {
  getAllSubjects,
  addSubject,
  updateSubject,
  deleteSubject,
  downloadTemplateSubject,
  addSubjectByExcel,
  getSubjectByID,
} from "../../services/SubjectService";
import { isXlsxFile } from "utils/CommonFunctions";
import { useToasts } from "react-toast-notifications";

const grades = [10, 11, 12, "Môn chung"];
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

// Subject Management (UolLT)
export default function SubjectManagement() {
  const { addToast } = useToasts();
  const accessToken = localStorage.getItem("authToken");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalEditOpen, setModalEditOpen] = useState(false);
  const [modalDeleteOpen, setModalDeleteOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState(0);
  const [markFactors, setMarkFactors] = useState([]);
  const [lessonPlans, setLessonPlans] = useState([]);
  const [deletedData, setDeletedData] = useState({});
  const [currentData, setCurrentData] = useState([]);
  const queryClient = useQueryClient();

  //call api get all
  const { data, isError, isLoading, refetch } = useQuery({
    queryKey: ["subjectState"],
    queryFn: () => getAllSubjects(accessToken),
    enabled: false,
  });

  useEffect(() => {
    refetch().then((result) => {
      if (result.data) {
        setCurrentData(result.data);
      }
    });
  }, [data]);

  const formattedGrades = grades.map((item) => ({
    label: `Khối ${item}`,
    value: item,
  }));

  const [grade, setGrade] = React.useState(grades[0]);
  const handleGradeSelectedChange = (event) => {
    setGrade(event.target.value);
  };

  //React-hook-from of adding action
  const {
    control,
    handleSubmit,
    reset,
    setValue: noSetValue,
    formState: { errors },
  } = useForm();

  //React-hook-from of editing action
  const {
    control: controlEditAction,
    handleSubmit: handleSubmitEditAction,
    reset: resetEditAction,
    setValue,
    formState: { errors: errorsEditAction },
  } = useForm();

  // Adding action
  const addSubjectsMutation = useMutation((subjectData) => addSubject(accessToken, subjectData), {
    onSuccess: (response) => {
      queryClient.invalidateQueries("subjectState");
      if (response && response.status == 200) {
        refetch().then((result) => {
          if (result.data) {
            setCurrentData(result.data);
          }
        });
        setMarkFactors([]);
        setLessonPlans([]);
        reset();
        setModalOpen(false);
        addToast("Tạo môn học thành công!", {
          appearance: "success",
        });
      } else {
        addToast(`Tạo môn thất bại! ${response?.response?.data}!`, {
          appearance: "error",
        });
      }
    },
    onError: (error) => {
      addToast(`Tạo môn thất bại. ${error.message}!`, {
        appearance: "error",
      });
    },
  });

  const addSubjectByExcelMutation = useMutation((file) => addSubjectByExcel(accessToken, file), {
    onSuccess: (response) => {
      queryClient.invalidateQueries("addSubjectExcel");
      if (response && response.status == 200) {
        refetch().then((result) => {
          if (result.data) {
            setCurrentData(result.data);
          }
        });
        reset();
        setModalOpen(false);
        addToast("Tạo môn thành công!", {
          appearance: "success",
        });
      } else {
        addToast(`Tạo môn thất bại! Dữ liệu file không đúng định dạng!`, {
          appearance: "error",
        });
      }
    },
    onError: (error) => {
      addToast(`Tạo môn thất bại. Dữ liệu file không đúng định dạng!`, {
        appearance: "error",
      });
    },
  });
  const handleAddSubjectByExcel = (data) => {
    if (data) {
      if (isXlsxFile(data?.subjectFile)) {
        addSubjectByExcelMutation.mutate(data?.subjectFile);
      } else {
        addToast(`Tạo môn học thất bại! File không đúng định dạng ".xlsx"!`, {
          appearance: "error",
        });
      }
    }
  };

  const formatMarkFactors = (data) => {
    return data.map((data) => {
      let newObject = {
        name: data.nameScore,
        count: data.count,
        scoreFactor: data.scoreFactor,
        semester: data.semester,
      };
      return newObject;
    });
  };

  const handleAddMark = (data) => {
    let isDuplicateFactor = false;
    let nameScoreFormatted = data.nameScore;
    let semesterFormatted = data.semester;
    if (data.nameScore === "") {
      nameScoreFormatted = nameScore[0].value;
    }
    if (data.semester === "") {
      semesterFormatted = semesters[0].value;
    }
    if (markFactors.length > 0) {
      markFactors.forEach((item) => {
        if (item.nameScore === nameScoreFormatted && item.semester === semesterFormatted) {
          isDuplicateFactor = true;
          addToast(`Điểm thành phần "Kiểm tra ${data.nameScore}" đã tồn tại!`, {
            appearance: "error",
          });
        }
      });
    }
    if (!isDuplicateFactor) {
      const id = markFactors.length;
      const newMarkFactor = {
        id,
        nameScore: nameScoreFormatted,
        semester: semesterFormatted,
        count: data.count,
        scoreFactor: data.scoreFactor,
      };
      setMarkFactors((prevMarkFactors) => [...prevMarkFactors, newMarkFactor]);
      addToast("Thêm điểm thành phần thành công!", {
        appearance: "success",
      });
    }
    resetEditAction();
    reset();
  };

  const handleAddLessonPlan = (data) => {
    let isDuplicateLessonPlan = false;
    if (lessonPlans.length > 0) {
      lessonPlans.forEach((item) => {
        if (item.slot === data.slot) {
          isDuplicateLessonPlan = true;
          addToast(`Tiết học thứ "${data.slot}" đã tồn tại!`, {
            appearance: "error",
          });
        } else if (item.slot === data.slotEdit) {
          isDuplicateLessonPlan = true;
          addToast(`Tiết học thứ "${data.slotEdit}" đã tồn tại!`, {
            appearance: "error",
          });
        }
      });
    }
    if (!isDuplicateLessonPlan) {
      const id = lessonPlans.length;
      const newLessonPlane = {
        id: id,
        slot: data.slot ? data.slot : data.slotEdit,
        title: data.titleOfSubject ? data.titleOfSubject : data.titleOfSubjectEdit,
      };
      setLessonPlans((pre) => [...pre, newLessonPlane]);
      addToast("Thêm giáo án thành công!", {
        appearance: "success",
      });
    }
    resetEditAction();
    reset();
  };
  const handleAddSubject = (data) => {
    const markFactorsTransform = formatMarkFactors(markFactors);
    let formattedGrade = data.grade;
    if (!data.grade) {
      formattedGrade = grades[0].toString();
    }
    if (markFactorsTransform.length <= 0) {
      addToast("Điểm thành phần không được bỏ trống!", {
        appearance: "error",
      });
    } else if (lessonPlans.length <= 0) {
      addToast("Giáo án không được bỏ trống!", {
        appearance: "error",
      });
    } else {
      const classData = {
        name: data.nameOfSubject,
        grade: formattedGrade,
        lessonPlans: lessonPlans,
        componentScores: markFactorsTransform,
      };
      addSubjectsMutation.mutate(classData);
    }
  };

  // Updating action
  const handleEdit = (rowItem) => {
    if (rowItem) {
      const subjectByID = getSubjectByID(accessToken, rowItem[0]);
      subjectByID.then((result) => {
        const transformedComponentScores = result?.componentScores.map((item) => ({
          ...item,
          nameScore: item.name,
        }));

        setMarkFactors(transformedComponentScores);
        setLessonPlans(result?.lessonPlans);
      });
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
        if (response && response?.status === 200) {
          refetch().then((result) => {
            if (result.data) {
              setCurrentData(result.data);
            }
          });
          addToast("Cập nhật môn học thành công!", {
            appearance: "success",
          });
          resetEditAction();
          setModalEditOpen(false);
        } else {
          addToast(`Cập nhật môn học thất bại! ${response?.response?.data}!`, {
            appearance: "error",
          });
        }
      },
      onError: (error) => {
        addToast(`Cập nhật môn học thất bại! ${error.message}!`, {
          appearance: "error",
        });
      },
    }
  );

  const handleUpdateSubject = (data) => {
    const listMarks = formatMarkFactors(markFactors);
    const subjectData = {
      id: data.idEdit,
      name: data.nameEdit,
      grade: data.gradeEdit,
      lessonPlans: lessonPlans,
      componentScores: listMarks,
    };
    updateSubjectMutation.mutate(subjectData);
  };

  const handleStatistic = () => {
    setCurrentData(filterSubjectByGrade(grade, data));
  };

  const deleteSubjectMutation = useMutation((subjectId) => deleteSubject(accessToken, subjectId), {
    onSuccess: (response) => {
      queryClient.invalidateQueries("subjectState");
      if (response && response?.status === 200) {
        refetch().then((result) => {
          if (result.data) {
            setCurrentData(result.data);
          }
        });
        addToast("Xóa môn học thành công!", {
          appearance: "success",
        });
        setModalDeleteOpen(false);
      } else {
        addToast("Xóa môn học thất bại!", {
          appearance: "error",
        });
      }
    },
    onError: (error) => {
      addToast(`Xóa môn học thất bại! ${error.message}!`, {
        appearance: "error",
      });
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
    setCurrentData(searchSubjectByKeys(txtSearch, data));
  };

  const filterSubjectByGrade = (option, data) => {
    if (data) {
      return data.filter((item) => {
        return item.grade == option;
      });
    }
  };

  const searchSubjectByKeys = (txtSearch, data) => {
    const search = txtSearch.trim().toLowerCase();
    return data.filter((subject) => {
      return (
        (subject.name && subject.name.toLowerCase().includes(search)) ||
        (subject.grade && subject.grade.toLowerCase().includes(search))
      );
    });
  };

  const handleDeleteMarkFactor = (data) => {
    if (data) {
      setMarkFactors(markFactors.filter((item) => item.id != data[0]));
      addToast("Xóa điểm thành phần thành công!", {
        appearance: "success",
      });
    }
  };

  const handleDeleteLessonPlan = (data) => {
    if (data) {
      setLessonPlans(lessonPlans.filter((item) => item.id != data[0]));
      addToast("Xóa giáo án thành công!", {
        appearance: "success",
      });
    }
  };

  return (
    <DashboardLayout>
      <ToastContainer autoClose={3000} />
      <DashboardNavbar />
      <Card className="max-h-max mb-5 min-h-full">
        <MDBox p={5}>
          <div className="text-center mt-0 ">
            <div className="flex justify-center items-center text-3xl mx-auto w-full">
              <BookIcon />
              <h4 className="text-xl font-bold ml-3">QUẢN LÍ MÔN HỌC</h4>
            </div>
          </div>
          <div className="mt-4 grid max-[693px]:grid-cols-1 md:grid-cols-2 gap-1 max-[693px]:mt-6">
            <div className="flex justify-start max-[639px]:flex-wrap">
              <FormControl sx={{ minWidth: 120, marginRight: "12px" }}>
                <InputLabel id="select-school-year-lable" className="w-fit">
                  Khối
                </InputLabel>
                <Select
                  labelId="select-school-year-lable"
                  id="select-school-year"
                  value={grade}
                  className="h-11 mr-0"
                  label="Khối"
                  onChange={handleGradeSelectedChange}
                >
                  {formattedGrades.map((item, index) => (
                    <MenuItem key={index} value={item.value}>
                      {item.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <div className="max-[639px]:w-full max-[639px]:ml-0 mt-3 ml-2 sm:mt-0">
                <ButtonComponent
                  className="max-[639px]:w-full"
                  type="success"
                  onClick={handleStatistic}
                >
                  <FilterAltIcon className="mr-1" /> TÌM KIẾM
                </ButtonComponent>
              </div>
            </div>
            <div className="w-full flex justify-end max-[639px]:justify-between items-center mt-3 sm:mt-0">
              <SearchInputComponent
                onSearch={handleChangeSearchValue}
                placeHolder="Nhập từ khóa..."
              />
              <div className="ml-3">
                <ButtonComponent className="" onClick={() => setModalOpen(true)}>
                  <AddCircleOutlineIcon className="text-3xl mr-1" />
                  TẠO
                </ButtonComponent>
                <PopupComponent
                  title="TẠO MÔN HỌC"
                  description="Hãy tạo môn học để bắt đầu năm học mới"
                  icon={<AddCircleOutlineIcon />}
                  isOpen={modalOpen}
                  onClose={() => setModalOpen(false)}
                  tabs={[
                    { label: "1. ĐIỂM THÀNH PHẦN" },
                    { label: "2. GIÁO ÁN" },
                    { label: "3. TẠO MÔN" },
                    { label: "TẠO BẰNG EXCEL" },
                  ]}
                  currentTab={currentTab}
                  onTabChange={(newValue) => {
                    reset();
                    setCurrentTab(newValue);
                  }}
                >
                  {/* Content for Tab 2 */}
                  <div role="tabpanel" hidden={currentTab !== 0}>
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
                        />
                      </div>
                      <div className="flex w-full">
                        <InputBaseComponent
                          className="w-1/2 mr-3"
                          placeholder="Nhập số lượng..."
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
                          placeholder="Nhập hệ số..."
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
                          }}
                        />
                      </div>
                      <NotifyCheckInfoForm actionText="Hãy chuyển sang tab tiếp theo để tiếp tục tạo!" />
                      <div className="mt-4 flex justify-end">
                        <ButtonComponent
                          type="error"
                          action="reset"
                          onClick={() => {
                            reset();
                          }}
                        >
                          <CleaningServicesIcon className="text-3xl mr-1 mb-1" />
                          ĐẶT LẠI
                        </ButtonComponent>
                        <ButtonComponent action="submit">
                          <AddCircleOutlineIcon className="text-3xl mr-1" />
                          THÊM ĐIỂM
                        </ButtonComponent>
                      </div>
                    </form>
                    <p className="text-sm font-bold max-[639px]:my-3">
                      TẤT CẢ CỘT ĐIỂM({markFactors?.length})
                    </p>
                    <TableComponent
                      header={["Tên", "Kì học", "Số lượng", "Hệ số"]}
                      data={markFactors?.map((item) => [
                        item.id,
                        item.nameScore,
                        item.semester,
                        item.count,
                        item.scoreFactor,
                      ])}
                      isOrdered={false}
                      itemsPerPage={10}
                      onDelete={handleDeleteMarkFactor}
                      hiddenColumns={[0]}
                      className="mt-1"
                    />
                  </div>
                  {/* Content for Tab 3 */}
                  <div role="tabpanel1" hidden={currentTab == 1}>
                    <form onSubmit={handleSubmit(handleAddLessonPlan)}>
                      <div className="flex">
                        <InputBaseComponent
                          className="w-1/2 mr-3"
                          placeholder="Nhập nội dung bài học..."
                          type="text"
                          control={control}
                          setValue={noSetValue}
                          name="titleOfSubject"
                          label="Nội dung"
                          errors={errors}
                          validationRules={{
                            required: "Không được bỏ trống!",
                          }}
                        />
                        <InputBaseComponent
                          className="w-1/2"
                          placeholder="Nhập thứ tự tiết..."
                          type="number"
                          control={control}
                          setValue={noSetValue}
                          name="slot"
                          minValue={1}
                          maxValue={200}
                          label="Thứ tự tiết học"
                          errors={errors}
                          validationRules={{
                            required: "Không được bỏ trống!",
                          }}
                        />
                      </div>
                      <NotifyCheckInfoForm actionText="Hãy chuyển sang tab tiếp theo để tiếp tục tạo!" />
                      <div className="mt-4 flex justify-end">
                        <ButtonComponent
                          type="error"
                          action="reset"
                          onClick={() => {
                            reset();
                          }}
                        >
                          <CleaningServicesIcon className="text-3xl mr-1 mb-1" />
                          ĐẶT LẠI
                        </ButtonComponent>
                        <ButtonComponent action="submit">
                          <AddCircleOutlineIcon className="text-3xl mr-1" />
                          THÊM GIÁO ÁN
                        </ButtonComponent>
                      </div>
                    </form>
                    <p className="text-sm font-bold max-[639px]:my-3">
                      TẤT CẢ GIÁO ÁN({markFactors?.length})
                    </p>
                    <TableComponent
                      header={["Tên bài học", "Tiêt thứ"]}
                      data={lessonPlans?.map((item) => [item.id, item.title, item.slot])}
                      isOrdered={false}
                      hiddenColumns={[0]}
                      itemsPerPage={10}
                      onDelete={handleDeleteLessonPlan}
                      className="mt-1 mb-4"
                    />
                  </div>

                  {/* Content for Tab 1 */}
                  <div role="tabpane2" hidden={currentTab === 2}>
                    <form onSubmit={handleSubmit(handleAddSubject)}>
                      <div className="flex">
                        <InputBaseComponent
                          placeholder="Nhập tên môn học..."
                          type="text"
                          control={control}
                          className="w-1/2 mr-2"
                          setValue={noSetValue}
                          name="nameOfSubject"
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
                        />
                      </div>
                      <NotifyCheckInfoForm actionText="Hãy kiểm tra kĩ thông tin trước khi tạo!" />
                      <div className="mt-4 flex justify-end">
                        <ButtonComponent
                          type="error"
                          action="reset"
                          onClick={() => {
                            reset();
                            setModalOpen(false);
                          }}
                        >
                          <CancelIcon className="text-3xl mr-1 mb-0.5" />
                          HỦY BỎ
                        </ButtonComponent>
                        <ButtonComponent action="submit">
                          <AddCircleOutlineIcon className="text-3xl mr-1" />
                          TẠO
                        </ButtonComponent>
                      </div>
                    </form>
                  </div>

                  <div role="tabpane3" hidden={currentTab == 3}>
                    <ButtonComponent action="submit" onClick={downloadTemplateSubject}>
                      <DownloadIcon className="mr-2" />
                      TẢI XUỐNG
                    </ButtonComponent>
                    <form onSubmit={handleSubmit(handleAddSubjectByExcel)}>
                      <InputBaseComponent
                        name="subjectFile"
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
                      <NotifyCheckInfoForm actionText="Hãy kiểm tra kĩ thông tin trước khi tạo!" />
                      <div className="mt-5 flex justify-end">
                        <ButtonComponent
                          type="error"
                          action="reset"
                          onClick={() => {
                            reset();
                            setModalOpen(false);
                          }}
                        >
                          <CancelIcon className="text-3xl mr-1 mb-0.5" />
                          HỦY BỎ
                        </ButtonComponent>
                        <ButtonComponent action="submit">
                          {addSubjectByExcelMutation.isLoading ? (
                            <CircularProgress size={20} color="inherit" />
                          ) : (
                            <>
                              <AddCircleOutlineIcon className="text-3xl mr-1" />
                              TẠO
                            </>
                          )}
                        </ButtonComponent>
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
            ) : data ? (
              <TableComponent
                header={["Tên môn học", "Khối"]}
                data={currentData?.map((item) => [item.id, item.name, item.grade])}
                itemsPerPage={20}
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
              title="CẬP NHẬT MÔN HỌC"
              description="Hãy chỉnh sửa để bắt đầu năm học mới"
              icon={<EditIcon />}
              isOpen={modalEditOpen}
              onClose={() => {
                setModalEditOpen(false);
                setMarkFactors([]);
                setLessonPlans([]);
                resetEditAction();
              }}
              tabs={[
                { label: "1. ĐIỂM THÀNH PHẦN" },
                { label: "2. GIÁO ÁN" },
                { label: "3. MÔN HỌC" },
              ]}
              currentTab={currentTab}
              onTabChange={(newValue) => {
                resetEditAction();
                setCurrentTab(newValue);
              }}
            >
              {/* Content for Tab 2 */}
              <div role="tabpanel" hidden={currentTab !== 0}>
                <form onSubmit={handleSubmitEditAction(handleAddMark)}>
                  <div className="flex w-full">
                    <InputBaseComponent
                      className="w-1/2 mr-3"
                      type="select"
                      options={nameScore}
                      control={controlEditAction}
                      setValue={setValue}
                      name="nameScore"
                      label="Điểm thành phần"
                      errors={errorsEditAction}
                    />
                    <InputBaseComponent
                      className="w-1/2"
                      type="select"
                      options={semesters}
                      control={controlEditAction}
                      setValue={setValue}
                      name="semester"
                      label="Học kì"
                      errors={errorsEditAction}
                    />
                  </div>
                  <div className="flex w-full">
                    <InputBaseComponent
                      className="w-1/2 mr-3"
                      placeholder="Nhập số lượng..."
                      type="number"
                      minValue={1}
                      maxValue={10}
                      control={controlEditAction}
                      setValue={setValue}
                      name="count"
                      label="Số lượng"
                      errors={errorsEditAction}
                      validationRules={{
                        required: "Không được bỏ trống!",
                      }}
                    />
                    <InputBaseComponent
                      className="w-1/2"
                      placeholder="Nhập hệ số..."
                      type="number"
                      minValue={1}
                      maxValue={10}
                      control={controlEditAction}
                      setValue={setValue}
                      name="scoreFactor"
                      label="Hệ số"
                      errors={errorsEditAction}
                      validationRules={{
                        required: "Không được bỏ trống!",
                      }}
                    />
                  </div>
                  <NotifyCheckInfoForm actionText="Hãy chuyển sang tab tiếp theo để tiếp tục cập nhật!" />
                  <div className="mt-4 flex justify-end sm:min-w-fit-table max-[639px]:mb-3">
                    <ButtonComponent
                      type="error"
                      action="reset"
                      onClick={() => {
                        resetEditAction();
                      }}
                    >
                      <CleaningServicesIcon className="text-3xl mr-1 mb-1" />
                      ĐẶT LẠI
                    </ButtonComponent>
                    <ButtonComponent action="submit">
                      <AddCircleOutlineIcon className="text-3xl mr-1" />
                      THÊM ĐIỂM
                    </ButtonComponent>
                  </div>
                </form>
                <p className="text-sm font-bold mt-3 max-[639px]:my-3">
                  TẤT CẢ CỘT ĐIỂM({markFactors?.length})
                </p>
                <TableComponent
                  header={["Tên", "Kì học", "Số lượng", "Hệ số"]}
                  data={markFactors?.map((item) => [
                    item.id,
                    item.nameScore,
                    item.semester,
                    item.count,
                    item.scoreFactor,
                  ])}
                  isOrdered={false}
                  itemsPerPage={10}
                  onDelete={handleDeleteMarkFactor}
                  hiddenColumns={[0]}
                  className="mt-1"
                />
              </div>
              {/* Content for Tab 1 */}
              <div role="tabpanel1" hidden={currentTab == 1}>
                <form onSubmit={handleSubmitEditAction(handleAddLessonPlan)}>
                  <div className="flex">
                    <InputBaseComponent
                      className="w-1/2 mr-3"
                      placeholder="Nhập nội dung bài học..."
                      type="text"
                      control={controlEditAction}
                      setValue={setValue}
                      name="titleOfSubjectEdit"
                      label="Nội dung"
                      errors={errorsEditAction}
                      validationRules={{
                        required: "Không được bỏ trống!",
                      }}
                    />
                    <InputBaseComponent
                      className="w-1/2"
                      placeholder="Nhập thứ tự tiết..."
                      type="number"
                      control={controlEditAction}
                      setValue={setValue}
                      name="slotEdit"
                      minValue={1}
                      maxValue={200}
                      label="Thứ tự tiết học"
                      errors={errorsEditAction}
                      validationRules={{
                        required: "Không được bỏ trống!",
                      }}
                    />
                  </div>
                  <NotifyCheckInfoForm actionText="Hãy chuyển sang tab tiếp theo để tiếp tục tạo!" />
                  <div className="mt-4 flex justify-end sm:min-w-fit-table max-[639px]:mb-3">
                    <ButtonComponent
                      type="error"
                      action="reset"
                      onClick={() => {
                        resetEditAction();
                      }}
                    >
                      <CleaningServicesIcon className="text-3xl mr-1 mb-1" />
                      ĐẶT LẠI
                    </ButtonComponent>
                    <ButtonComponent action="submit">
                      <AddCircleOutlineIcon className="text-3xl mr-1" />
                      THÊM GIÁO ÁN
                    </ButtonComponent>
                  </div>
                </form>
                <p className="text-sm font-bold mt-3 max-[639px]:my-3">
                  TẤT CẢ GIÁO ÁN({lessonPlans?.length})
                </p>
                <TableComponent
                  header={["Tên bài học", "Tiêt thứ"]}
                  data={lessonPlans?.map((item) => [item.id, item.title, item.slot])}
                  isOrdered={false}
                  hiddenColumns={[0]}
                  itemsPerPage={10}
                  onDelete={handleDeleteLessonPlan}
                  className="mt-1 mb-4"
                />
              </div>

              {/* Content for Tab 1 */}
              <div role="tabpane2" hidden={currentTab === 2}>
                <form onSubmit={handleSubmitEditAction(handleUpdateSubject)}>
                  <div className="flex">
                    <InputBaseComponent
                      placeholder="Nhập tên môn học..."
                      type="text"
                      control={controlEditAction}
                      className="w-1/2 mr-2"
                      setValue={setValue}
                      name="nameEdit"
                      label="Tên môn học"
                      errors={errorsEditAction}
                      validationRules={{
                        required: "Không được bỏ trống!",
                      }}
                    />
                    <InputBaseComponent
                      label="Khối"
                      name="gradeEdit"
                      control={controlEditAction}
                      className="w-1/2 mr-2"
                      setValue={setValue}
                      type="select"
                      options={formattedGrades}
                      errors={errorsEditAction}
                    />
                  </div>
                  <NotifyCheckInfoForm actionText="Hãy kiểm tra kĩ thông tin trước khi cập nhật!" />
                  <div className="mt-4 flex justify-end">
                    <ButtonComponent
                      type="error"
                      action="reset"
                      onClick={() => {
                        resetEditAction();
                        setModalEditOpen(false);
                        setMarkFactors([]);
                        setLessonPlans([]);
                      }}
                    >
                      <CancelIcon className="text-3xl mr-1 mb-0.5" />
                      HỦY BỎ
                    </ButtonComponent>
                    <ButtonComponent action="submit">
                      <EditIcon className="text-3xl mr-1" />
                      CẬP NHẬT
                    </ButtonComponent>
                  </div>
                </form>
              </div>
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
                  <CancelIcon className="text-3xl mr-1 mb-0.5" />
                  HỦY BỎ
                </ButtonComponent>
                <ButtonComponent action="button" onClick={handleDeleteAPI}>
                  <DeleteIcon className="text-3xl mr-1 mb-0.5" />
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
