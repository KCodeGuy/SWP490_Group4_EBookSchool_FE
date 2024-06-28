import React, { useState, useEffect } from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { Card, CircularProgress, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import MDBox from "components/MDBox";
import Footer from "examples/Footer";
import { useForm } from "react-hook-form";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import GroupIcon from "@mui/icons-material/Group";
import DownloadIcon from "@mui/icons-material/Download";
import { ToastContainer, toast } from "react-toastify";

import "./style.scss";
import noDataImage3 from "../../assets/images/noDataImage3.avif";
import { grades } from "../../mock/grade";
import { schoolYears } from "../../mock/schoolYear";
import InputBaseComponent from "../../components/InputBaseComponent/InputBaseComponent";
import PopupComponent from "../../components/PopupComponent/PopupComponent";
import TableComponent from "../../components/TableComponent/TableComponent";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import SearchInputComponent from "../../components/SearchInputComponent/SearchInputComponent";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { deleteStudent } from "services/StudentService";
import { getStudentByID } from "services/StudentService";
import { createStudent } from "services/StudentService";
import { updateStudent } from "services/StudentService";
import { getAllStudents } from "services/StudentService";

export default function StudentAccountManagement() {
  //1. Modal form states open, close
  const accessToken = localStorage.getItem("authToken");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalEditOpen, setModalEditOpen] = useState(false);
  const [modalDeleteOpen, setModalDeleteOpen] = useState(false);
  const [deletedSubject, setDeletedSubject] = useState({});
  const [currentTab, setCurrentTab] = useState(0);
  const [currentTabEdit, setCurrentTabEdit] = useState(0);
  const roles = ["học sinh chủ nhiệm", "Học sinh/Phụ huynh", "học sinh bộ môn", "Giám thị"];

  const [selectedRole, setSelectedRole] = useState(roles[0]);

  const handleRoleChange = (event) => {
    setSelectedRole(event.target.value);
  };
  const [schoolYear, setSchoolYear] = React.useState(schoolYears.data[0].schoolYear);
  const handleSchoolYearSelectedChange = (event) => {
    setSchoolYear(event.target.value);
  };

  const formattedSchoolYears = schoolYears.data.map((year) => ({
    label: year.schoolYear,
    value: year.schoolYear,
  }));

  const formattedGrades = grades.data.map((grade) => ({
    label: grade.name,
    value: grade.name,
  }));

  const [accounts, setAccounts] = useState([]);
  const [username, setUsername] = useState();
  const [studentID, setStudentID] = useState();
  const [avatar, setAvatar] = useState(null);

  const queryClient = useQueryClient();

  const { data, error, isLoading } = useQuery(["getStudents", { accessToken }], () =>
    getAllStudents(accessToken)
  );
  useEffect(() => {
    if (data?.success) {
      setAccounts(data?.data);
    }
  }, [data]);

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
    watch: watch,
    formState: { errors: errorsEditAction },
  } = useForm();

  //4. Functions handle adding
  const handleOpenAddModal = () => {
    setModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setModalOpen(false);
  };

  const handleAddAccount = (data) => {
    console.log("Call API add subject: ", data);
    // Call API add subject here
  };

  const handleAddInfomation = (data) => {
    console.log("Call API add mark: ", data);
    // Call API add subject here
  };

  // Add nè
  const addStudentMutation = useMutation((data) => createStudent(accessToken, data), {
    onSuccess: (response) => {
      queryClient.invalidateQueries("addStudent");
      if (response && response.success) {
        toast.success("Tạo học sinh thành công!");
      } else {
        toast.error(`${response.data}!`);
      }
      reset();
      setModalOpen(false);
    },
  });

  const handleAddRole = (data) => {
    addStudentMutation.mutate(data);
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
      setStudentID(rowItem[0]);
      setModalEditOpen(true);
    } else {
      setModalEditOpen(false);
    }
  };

  const updateStudentMutation = useMutation(
    (studentData) => updateStudent(accessToken, studentData),
    {
      onSuccess: (response) => {
        queryClient.invalidateQueries("studentState");
        if (response && response.success) {
          toast.success("Cập nhật học sinh thành công!");
        } else {
          toast.error(`${response.data}!`);
        }
        resetEditAction();
        setModalEditOpen(false);
      },
      onError: (error) => {
        console.error("Error updating student:", error);
        toast.error("Cập nhật học sinh thất bại!");
      },
    }
  );

  const handleEditSubject = (data) => {
    updateStudentMutation.mutate(data);
  };
  const {
    data: studentData,
    error: studentError,
    isLoading: studentLoading,
  } = useQuery(
    ["studentState", { accessToken, studentID }],
    () => getStudentByID(accessToken, studentID),
    {
      enabled: !!studentID, // Only run the query if studentID is defined
    }
  );

  useEffect(() => {
    if (studentData?.data) {
      setValue("id", studentData.data.id);
      setValue("fullName", studentData.data.fullname);
      setValue("email", studentData.data.email);
      setValue("gender", studentData.data.gender);
      setValue("fatherFullName", studentData.data.fatherFullName);
      setValue("fatherPhone", studentData.data.fatherPhone);
      setValue("fatherProfession", studentData.data.fatherProfession);
      setValue("motherFullName", studentData.data.motherFullName);
      setValue("motherPhone", studentData.data.motherPhone);
      setValue("motherProfession", studentData.data.motherProfession);
      setValue("phone", studentData.data.phone);
      setValue("birthday", studentData.data.birthday.split("T")[0]);
      setValue("birthplace", studentData.data.birthplace);
      setValue("nation", studentData.data.nation);
      setValue("avatar", studentData.data.avatar);
      setValue("address", studentData.data.address);
      setAvatar(studentData.data.avatar);
    }
  }, [studentData, setValue]);

  const formValues = watch();

  useEffect(() => {
    // console.log("Form values:", formValues);
  }, [formValues]);

  useEffect(() => {
    queryClient.invalidateQueries(["studentState", { accessToken, studentID }]);
  }, [studentID]);

  //6. Functions handle deleting
  const handleCloseDeleteModal = () => {
    setModalDeleteOpen(false);
  };

  useEffect(() => {
    if (data?.success) {
      setAccounts(data?.data);
    }
  }, [data]);

  const deleteStudentMutation = useMutation((studentID) => deleteStudent(accessToken, studentID), {
    onSuccess: (response) => {
      if (response && response.success) {
        toast.success("Xóa học sinh thành công!");
        queryClient.invalidateQueries(["getStudents", { accessToken }]); // Invalidate the getStudents query
      } else {
        toast.error("Xóa học sinh thất bại!");
      }
      setModalDeleteOpen(false);
    },
  });

  const handleDelete = (rowItem) => {
    if (rowItem) {
      setStudentID(rowItem[0]);
      setUsername(rowItem[1]);
      setModalDeleteOpen(true);
    }
  };

  const handleDeleteAPI = () => {
    deleteStudentMutation.mutate(studentID);
  };

  const handleChangeSearchValue = (txtSearch) => {
    console.log(txtSearch);
    setAccounts(searchStudent(txtSearch, data?.data));
  };

  const searchStudent = (txtSearch, data) => {
    const search = txtSearch.trim().toLowerCase();
    return data.filter((item) => {
      return (
        (item.id && item.id.toLowerCase().includes(search)) ||
        (item.fullname && item.fullname.toLowerCase().includes(search)) ||
        (item.username && item.username.toLowerCase().includes(search)) ||
        (item.email && item.email.toLowerCase().includes(search)) ||
        (item.phone && item.phone.toLowerCase().includes(search))
      );
    });
  };

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const handleTabEditChange = (event, newValue) => {
    setCurrentTabEdits(newValue);
  };
  return (
    <DashboardLayout>
      <ToastContainer autoClose={3000} />
      <DashboardNavbar />
      <Card className="max-h-max mb-8">
        <MDBox p={5}>
          <div className="text-center mt-0 ">
            <div className="flex justify-center items-center text-3xl mx-auto w-full">
              <GroupIcon />
              <h4 className="text-xl font-bold ml-3">QUẢN LÍ HỌC SINH</h4>
            </div>
          </div>
          <div className="mt-4 grid sm:grid-cols-1 lg:grid-cols-2 gap-1">
            {/* role Select */}
            <div className="flex justify-start max-[639px]:flex-wrap">
              {/* <FormControl sx={{ minWidth: 120, marginRight: "12px" }}>
                <InputLabel id="select-role-label" className="ml-3">
                  Chức vụ
                </InputLabel>
                <Select
                  labelId="select-role-label"
                  id="select-role"
                  value={selectedRole}
                  className="h-10 mx-3"
                  label="Chức vụ"
                  onChange={handleRoleChange}
                >
                  {roles.map((role) => (
                    <MenuItem key={role} value={role}>
                      {role}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <div className="max-[639px]:mt-2">
                <ButtonComponent type="success" onClick={handleStatistic}>
                  <FilterAltIcon className="mr-1" /> Tìm kiếm
                </ButtonComponent>
              </div>*/}
            </div>
            <div className="flex justify-end items-center sm:w-full sm:flex-wrap ">
              <SearchInputComponent
                onSearch={handleChangeSearchValue}
                placeHolder="Nhập từ khóa..."
              />
              <div className="ml-3">
                {/* <ButtonComponent className="" onClick={handleOpenAddModal}>
                  <AddCircleOutlineIcon className="text-3xl mr-1" />
                  Tạo TKGV
                </ButtonComponent> */}
                <ButtonComponent className="" onClick={handleOpenAddModal}>
                  <AddCircleOutlineIcon className="text-3xl mr-1" />
                  Tạo
                </ButtonComponent>
                <PopupComponent
                  title="TẠO TÀI KHOẢN"
                  description="Hãy tạo tài khoản"
                  icon={<AddCircleOutlineIcon />}
                  isOpen={modalOpen}
                  onClose={handleCloseAddModal}
                  tabs={[{ label: "TẠO TÀI KHOẢN" }, { label: "TẠO BẰNG EXCEL" }]}
                  currentTab={currentTab}
                  onTabChange={handleTabChange}
                >
                  {/* Content for Tab 1 */}
                  <div role="tabpanel" hidden={currentTab !== 0}>
                    <form onSubmit={handleSubmit(handleAddRole)}>
                      <div className="flex">
                        <InputBaseComponent
                          type="text"
                          className="w-1/2 mr-2"
                          control={control}
                          name="fullName"
                          placeholder="Nguyen Van A"
                          label="Họ và tên"
                          setValue={noSetValue}
                          errors={errors}
                          validationRules={{
                            required: "Không được bỏ trống!",
                          }}
                        />
                        <InputBaseComponent
                          type="email"
                          className="w-1/2  mr-2"
                          control={control}
                          setValue={noSetValue}
                          name="email"
                          placeholder="hs@gmail.com"
                          label="Email"
                          errors={errors}
                          validationRules={{
                            required: "Không được bỏ trống!",
                          }}
                        />
                        <InputBaseComponent
                          type="text"
                          className="w-1/2"
                          control={control}
                          setValue={noSetValue}
                          name="gender"
                          placeholder="Nam"
                          label="Giới tính"
                          errors={errors}
                          validationRules={{
                            required: "Không được bỏ trống!",
                          }}
                        />
                      </div>
                      <div className="flex">
                        <InputBaseComponent
                          type="date"
                          className="w-1/2 mr-2"
                          control={control}
                          setValue={noSetValue}
                          name="birthday"
                          label="Ngày sinh"
                          errors={errors}
                          validationRules={{
                            required: "Không được bỏ trống!",
                          }}
                        />
                        <InputBaseComponent
                          type="text"
                          label="Dân tộc"
                          className="w-1/2 mr-2"
                          control={control}
                          setValue={noSetValue}
                          name="nation"
                          placeholder="Kinh"
                          errors={errors}
                          validationRules={{
                            required: "Không được bỏ trống!",
                          }}
                        />
                        <InputBaseComponent
                          type="text"
                          label="Số điện thoại"
                          className="w-1/2"
                          control={control}
                          setValue={noSetValue}
                          name="phone"
                          placeholder="0234123470"
                          errors={errors}
                          validationRules={{
                            required: "Không được bỏ trống!",
                          }}
                        />
                      </div>
                      <div className="flex"></div>
                      <div className="flex justify-between">
                        <InputBaseComponent
                          type="text"
                          className="w-1/2 mr-2"
                          control={control}
                          setValue={noSetValue}
                          name="fatherFullName"
                          placeholder="Nguyen Van B"
                          label="Họ tên cha"
                          errors={errors}
                          validationRules={{
                            required: "Không được bỏ trống!",
                          }}
                        />
                        <InputBaseComponent
                          type="text"
                          className="w-1/2 mr-2"
                          control={control}
                          setValue={noSetValue}
                          placeholder="Làm nông"
                          name="fatherProfession"
                          label="Nghề nghiệp cha"
                          errors={errors}
                          validationRules={{
                            required: "Không được bỏ trống!",
                          }}
                        />

                        <InputBaseComponent
                          type="text"
                          className="w-1/2"
                          control={control}
                          setValue={noSetValue}
                          name="fatherPhone"
                          placeholder="0234123471"
                          label="SĐT cha"
                          errors={errors}
                          validationRules={{
                            required: "Không được bỏ trống!",
                          }}
                        />
                      </div>

                      <div className="flex justify-between">
                        <InputBaseComponent
                          type="text"
                          className="w-1/2 mr-2"
                          control={control}
                          setValue={noSetValue}
                          name="motherFullName"
                          label="Họ tên mẹ"
                          placeholder="Lê thị B"
                          errors={errors}
                          validationRules={{
                            required: "Không được bỏ trống!",
                          }}
                        />
                        <InputBaseComponent
                          type="text"
                          className="w-1/2 mr-2"
                          control={control}
                          setValue={noSetValue}
                          name="motherProfession"
                          placeholder="học sinh"
                          label="Nghề nghiệp mẹ"
                          errors={errors}
                          validationRules={{
                            required: "Không được bỏ trống!",
                          }}
                        />

                        <InputBaseComponent
                          type="text"
                          className="w-1/2"
                          control={control}
                          setValue={noSetValue}
                          name="motherPhone"
                          label="SĐT mẹ"
                          placeholder="0234123472"
                          errors={errors}
                          validationRules={{
                            required: "Không được bỏ trống!",
                          }}
                        />
                      </div>
                      <InputBaseComponent
                        type="text"
                        className=""
                        control={control}
                        setValue={noSetValue}
                        name="birthplace"
                        placeholder="Cần Thơ"
                        label="Nơi sinh"
                        errors={errors}
                        validationRules={{
                          required: "Không được bỏ trống!",
                        }}
                      />
                      <InputBaseComponent
                        type="text"
                        className=""
                        control={control}
                        setValue={noSetValue}
                        name="address"
                        placeholder="600 Nguyen van cu"
                        label="Địa chỉ"
                        errors={errors}
                        validationRules={{
                          required: "Không được bỏ trống!",
                        }}
                      />

                      <div className="flex">
                        <InputBaseComponent
                          type="file"
                          className="w-full"
                          control={control}
                          setValue={noSetValue}
                          name="avatar"
                          label="Ảnh đại diện"
                          errors={errors}
                          validationRules={{
                            required: "Không được bỏ trống!",
                          }}
                        />
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
                      <div className="mt-4 flex justify-end">
                        <ButtonComponent
                          type="error"
                          action="reset"
                          onClick={() => resetEditAction()}
                        >
                          CLEAR
                        </ButtonComponent>
                        <ButtonComponent action="submit">THÊM</ButtonComponent>
                      </div>
                    </form>
                  </div>
                  <div role="tabpanel" hidden={currentTab == 1}>
                    <ButtonComponent action="submit">
                      <DownloadIcon className="mr-2" />
                      TẢI FILE
                    </ButtonComponent>
                    <form onSubmit={handleSubmit(handleAddAccount)}>
                      <InputBaseComponent
                        name="timeTableFile"
                        label="Tài khoản(Excel)"
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
            ) : data?.success && accounts.length > 0 ? (
              <TableComponent
                header={["Mã học sinh", "Tên đăng nhập", "Tên đầy đủ", "Email", "Số điện thoại"]}
                data={accounts.map((item) => [
                  item.id,
                  item.username,
                  item.fullname,
                  item.email,
                  item.phone,
                ])}
                itemsPerPage={30}
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
              currentTab={currentTabEdit}
              onTabChange={handleTabEditChange}
            >
              <form onSubmit={handleSubmitEditAction(handleEditSubject)}>
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
                    type="email"
                    className="w-1/2  mr-2"
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
                <div className="flex"></div>
                <div className="flex justify-between">
                  <InputBaseComponent
                    type="text"
                    className="w-1/2 mr-2"
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
                    className="w-1/2 mr-2"
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
                    className="w-1/2"
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

                <div className="flex justify-between">
                  <InputBaseComponent
                    type="text"
                    className="w-1/2 mr-2"
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
                    className="w-1/2 mr-2"
                    control={controlEditAction}
                    setValue={setValue}
                    name="motherProfession"
                    placeholder="học sinh"
                    label="Nghề nghiệp mẹ"
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
                <div className="mt-4 flex justify-end">
                  <ButtonComponent type="error" action="reset" onClick={() => resetEditAction()}>
                    CLEAR
                  </ButtonComponent>
                  <ButtonComponent action="submit">CẬP NHẬT</ButtonComponent>
                </div>
              </form>
            </PopupComponent>
            <PopupComponent
              title="XÓA TÀI KHOẢN"
              description="Hãy kiểm xác nhận thông tin trước khi xóa"
              icon={<DeleteIcon />}
              isOpen={modalDeleteOpen}
              onClose={handleCloseDeleteModal}
            >
              <p>Bạn có chắc chắn muốn xóa tài khoản?</p>
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
