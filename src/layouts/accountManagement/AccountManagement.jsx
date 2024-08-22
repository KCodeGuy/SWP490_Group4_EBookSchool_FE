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
import CancelIcon from "@mui/icons-material/Cancel";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import DownloadIcon from "@mui/icons-material/Download";
import SwapVertIcon from "@mui/icons-material/SwapVert";

import "./style.scss";
import noDataImage3 from "../../assets/images/noDataImage3.avif";
import InputBaseComponent from "../../components/InputBaseComponent/InputBaseComponent";
import PopupComponent from "../../components/PopupComponent/PopupComponent";
import TableComponent from "../../components/TableComponent/TableComponent";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import SearchInputComponent from "../../components/SearchInputComponent/SearchInputComponent";
import { getAllTeachers } from "services/TeacherService";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { ToastContainer, toast } from "react-toastify";
import { deleteTeacher } from "services/TeacherService";
import { getTeacherByID } from "services/TeacherService";
import { createTeacher } from "services/TeacherService";
import { updateTeacher } from "services/TeacherService";
import NotifyCheckInfoForm from "components/NotifyCheckInfoForm";
import { handleDownloadTeacherExcel } from "services/TeacherService";
import { addTeacherByExcel } from "services/TeacherService";
import { isXlsxFile } from "utils/CommonFunctions";
import { nationOptions } from "mock/student";
import { PRINCIPAL_ROLE } from "services/APIConfig";
import { useToasts } from "react-toast-notifications";
import { HEADTEACHER_ROLE } from "services/APIConfig";
import { HOMEROOM_ROLE } from "services/APIConfig";
import { SUBJECT_ROLE } from "services/APIConfig";

const sortOptions = [
  { label: "Mã giáo viên(A-Z)", value: { index: 1, option: "ASC" } },
  { label: "Mã giáo viên(Z-A)", value: { index: 1, option: "DESC" } },
  { label: "Tên đăng nhập(A-Z)", value: { index: 2, option: "ASC" } },
  { label: "Tên đăng nhập(Z-A)", value: { index: 2, option: "DESC" } },
  { label: "Họ và tên(A-Z)", value: { index: 3, option: "ASC" } },
  { label: "Họ và tên(Z-A)", value: { index: 3, option: "DESC" } },
];

const genderOptions = [
  { label: "Nam", value: "Nam" },
  { label: "Nữ", value: "Nữ" },
];

// Account management (UolLT)
export default function AccountManagement() {
  const { addToast } = useToasts();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalEditOpen, setModalEditOpen] = useState(false);
  const [modalDeleteOpen, setModalDeleteOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState(0);
  const [currentTabEdit, setCurrentTabEdit] = useState(0);
  const [accounts, setAccounts] = useState([]);
  const [username, setUsername] = useState();
  const [teacherID, setTeacherID] = useState();
  const [avatar, setAvatar] = useState(null);
  const [sortOption, setSortOption] = useState(sortOptions[0].value);
  const queryClient = useQueryClient();

  let accessToken, currentUser, userRole, userID, schoolYearsAPI, classesAPI;
  userRole = localStorage.getItem("userRole");
  if (userRole) {
    accessToken = localStorage.getItem("authToken");
    schoolYearsAPI = JSON.parse(localStorage.getItem("schoolYears"));
    classesAPI = JSON.parse(localStorage.getItem("currentClasses"));
    currentUser = JSON.parse(localStorage.getItem("user"));
    userID = currentUser.id;
  }

  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ["teacherAccounts"],
    queryFn: () => getAllTeachers(accessToken),
    enabled: false,
  });
  useEffect(() => {
    refetch().then((result) => {
      if (result.data) {
        setAccounts(data);
      }
    });
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

  const addTeacherMutation = useMutation((data) => createTeacher(accessToken, data), {
    onSuccess: (response) => {
      queryClient.invalidateQueries("teacherState");
      if (response && response?.status === 200) {
        addToast("Tạo giáo viên thành công!", {
          appearance: "success",
        });
        refetch().then((result) => {
          if (result.data) {
            setAccounts(data);
          }
        });
        reset();
        setModalOpen(false);
      } else {
        addToast(`Tạo giáo viên thất bại! ${response?.response?.data}!`, {
          appearance: "error",
        });
      }
    },
    onError: (error) => {
      addToast(`Tạo giáo viên thất bại! ${error.message}!`, {
        appearance: "error",
      });
    },
  });

  const addTeacherMutationByExcel = useMutation(
    (templateFile) => addTeacherByExcel(accessToken, templateFile),
    {
      onSuccess: (response) => {
        queryClient.invalidateQueries("teacherState");
        if (response && response?.status === 200) {
          addToast("Tạo giáo viên thành công!", {
            appearance: "success",
          });
          refetch().then((result) => {
            if (result.data) {
              setAccounts(data);
            }
          });
          reset();
          setModalOpen(false);
        } else {
          addToast(`Tạo giáo viên thất bại! ${response?.response?.data}!`, {
            appearance: "error",
          });
        }
      },
      onError: (error) => {
        addToast(`Tạo giáo viên thất bại! ${error.message}!`, {
          appearance: "error",
        });
      },
    }
  );

  const handleAddTeacherByExcel = (data) => {
    if (data && data?.teacherFile) {
      if (isXlsxFile(data?.teacherFile)) {
        addTeacherMutationByExcel.mutate(data?.teacherFile);
      } else {
        addToast(`Tạo tài khoản thất bại! File không đúng định dạng ".xlsx"!`, {
          appearance: "error",
        });
      }
    }
  };
  const handleAddRole = (data) => {
    const permissionKeys = Object.keys(data).filter((key) => key.startsWith("is") && data[key]);
    const roleKeys = Object.keys(data).filter((key) => key.startsWith("role") && data[key]);

    const permissions = permissionKeys.map((key) => {
      return key
        .replace("is", "")
        .replace(/([A-Z])/g, " $1")
        .trim();
    });

    const roles = roleKeys.map((key) => {
      return key
        .replace("role", "")
        .replace(/([A-Z])/g, " $1")
        .trim();
    });

    const otherValues = Object.keys(data)
      .filter((key) => !key.startsWith("is") && !key.startsWith("role"))
      .reduce((obj, key) => {
        obj[key] = data[key];
        return obj;
      }, {});

    const newObj = {
      permissions,
      roles,
      otherValues,
    };

    if (!otherValues.gender || otherValues.gender == "") {
      otherValues.gender = genderOptions[0].value;
    }
    if (!otherValues.nation || otherValues.nation == "") {
      otherValues.nation = nationOptions[0].value;
    }
    const isCorrectOtherValue =
      otherValues.fullName &&
      otherValues.birthday &&
      otherValues.gender &&
      otherValues.nation &&
      otherValues.email &&
      otherValues.phone &&
      (otherValues.bachelor || otherValues.master || otherValues.doctor || otherValues.professor) &&
      otherValues.address &&
      otherValues.avatar;

    if (!isCorrectOtherValue) {
      addToast("Tạo giáo viên thất bại! Bạn phải điền đủ thông tin chi tiết!", {
        appearance: "error",
      });
    } else if (roles?.length <= 0) {
      addToast("Tạo giáo viên thất bại! Bạn chưa chọn vai trò!", {
        appearance: "error",
      });
    } else if (roles?.length > 0 && isCorrectOtherValue) {
      addTeacherMutation.mutate(newObj);
    }
  };

  const handleEdit = (rowItem) => {
    if (rowItem) {
      setTeacherID(rowItem[0]);
      const teacherByID = getTeacherByID(accessToken, rowItem[0]);
      teacherByID.then((result) => {
        setValue("id", result?.id);
        setValue("fullName", result?.fullname);
        if (result?.birthday) {
          setValue("birthday", result?.birthday.split("T")[0]);
        }
        setValue("gender", result?.gender);
        setValue("nation", result?.nation);
        setValue("email", result?.email);
        setValue("phone", result?.phone);
        setValue("bachelor", result?.isBachelor);
        setValue("master", result?.isMaster);
        setValue("doctor", result?.isDoctor);
        setValue("professor", result?.isProfessor);
        setValue("address", result?.address);
        // setValue("roleAmin", result?.);
        // setValue("roleSupervisor", result?.address);
        // setValue("roleHomeroomTeacher", result?.address);
        // setValue("roleSubjectTeacher", result?.address);
        // setValue("roleStudent", result?.address);
        setValue("address", result?.address);
        setValue("avatar", result?.avatar);
        setAvatar(result?.avatar);

        if (result?.roles) {
          const roles = result?.roles?.toString();
          if (roles.includes("Admin")) {
            setValue("roleAdmin", true);
          }
          if (roles.includes(HEADTEACHER_ROLE)) {
            setValue("roleSupervisor", true);
          }
          if (roles.includes("Homeroom Teacher")) {
            setValue("roleHomeroomTeacher", true);
          }
          if (roles.includes("Subject Teacher")) {
            setValue("roleSubjectTeacher", true);
          }
          if (roles.includes("Student")) {
            setValue("roleStudent", true);
          }
        }

        // Handling permissions
        result?.permissions?.forEach((permission) => {
          const formattedPermission = `is${permission.replace(/\s+/g, "")}`;
          setValue(formattedPermission, true);
        });
        if (result) {
          setModalEditOpen(true);
        }
      });
    } else {
      setModalEditOpen(false);
    }
  };

  const updateTeacherMutation = useMutation(
    (teacherData) => updateTeacher(accessToken, teacherData),
    {
      onSuccess: (response) => {
        queryClient.invalidateQueries("teacherState");
        if (response && response?.status === 200) {
          addToast("Cập nhật giáo viên thành công!", {
            appearance: "success",
          });
          refetch().then((result) => {
            if (result.data) {
              setAccounts(data);
            }
          });
          resetEditAction();
          setModalEditOpen(false);
        } else {
          addToast(`Cập nhật giáo viên thất bại! ${response?.response?.data}!`, {
            appearance: "error",
          });
        }
      },
      onError: (error) => {
        addToast(`Cập nhật giáo viên thất bại! ${error.message}!`, {
          appearance: "error",
        });
      },
    }
  );

  const handleEditSubject = (data) => {
    // console.log("Chạy vô đây", data);
    const permissionKeys = Object.keys(data).filter((key) => key.startsWith("is") && data[key]);
    const roleKeys = Object.keys(data).filter((key) => key.startsWith("role") && data[key]);

    const permissions = permissionKeys.map((key) => {
      return key
        .replace("is", "")
        .replace(/([A-Z])/g, " $1")
        .trim();
    });

    const roles = roleKeys.map((key) => {
      return key
        .replace("role", "")
        .replace(/([A-Z])/g, " $1")
        .trim();
    });

    const otherValues = Object.keys(data)
      .filter((key) => !key.startsWith("is") && !key.startsWith("role"))
      .reduce((obj, key) => {
        obj[key] = data[key];
        return obj;
      }, {});

    if (!otherValues.gender || otherValues.gender == "") {
      otherValues.gender = genderOptions[0].value;
    }
    if (!otherValues.nation || otherValues.nation == "") {
      otherValues.nation = nationOptions[0].value;
    }

    const newObj = {
      id: teacherID,
      permissions,
      roles,
      fullName: otherValues.fullName,
      birthday: otherValues.birthday,
      gender: otherValues.gender,
      nation: otherValues.nation,
      email: otherValues.email,
      phone: otherValues.phone,
      isBachelor: otherValues.bachelor,
      isMaster: otherValues.master,
      isDoctor: otherValues.doctor,
      isProfessor: otherValues.professor,
      address: otherValues.address,
      avatar: otherValues.avatar,
    };

    const isCorrectOtherValue =
      otherValues.birthday &&
      otherValues.gender &&
      otherValues.nation &&
      otherValues.email &&
      otherValues.phone &&
      (otherValues.bachelor || otherValues.master || otherValues.doctor || otherValues.professor) &&
      otherValues.address &&
      otherValues.avatar;

    if (!isCorrectOtherValue) {
      addToast("Cập nhật giáo viên thất bại! Bạn phải điền đủ thông tin chi tiết!", {
        appearance: "error",
      });
    } else if (roles?.length <= 0) {
      addToast("Cập nhật giáo viên thất bại! Bạn chưa chọn vai trò!", {
        appearance: "error",
      });
    } else if (roles?.length > 0 && isCorrectOtherValue) {
      updateTeacherMutation.mutate(newObj);
    }
  };

  const deleteTeacherMutation = useMutation((username) => deleteTeacher(accessToken, username), {
    onSuccess: (response) => {
      if (response && response.status == 200) {
        queryClient.invalidateQueries(["teacherAccounts", { accessToken }]); // Invalidate the getTeachers query
        addToast(`Xóa giáo viên thành công!`, {
          appearance: "success",
        });
        refetch().then((result) => {
          if (result.data) {
            setAccounts(data);
          }
        });
        setModalDeleteOpen(false);
      } else {
        addToast("Xóa giáo viên thất bại!", {
          appearance: "error",
        });
      }
    },
  });

  const handleDelete = (rowItem) => {
    if (rowItem) {
      setUsername(rowItem[0]);
      setModalDeleteOpen(true);
    }
  };

  const handleDeleteAPI = () => {
    deleteTeacherMutation.mutate(username);
  };

  const handleChangeSearchValue = (txtSearch) => {
    setAccounts(searchTeacher(txtSearch, data));
  };

  const searchTeacher = (txtSearch, data) => {
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

  const handleSortTeacher = () => {
    const { index, option } = sortOption;
    if (accounts?.length > 0) {
      const sortedData = [...accounts].sort((a, b) => {
        let valueA, valueB;

        switch (index) {
          case 1:
            valueA = a.id;
            valueB = b.id;
            break;
          case 2:
            valueA = a.username;
            valueB = b.username;
            break;
          case 3:
            valueA = a.fullname;
            valueB = b.fullname;
            break;
          default:
            return 0;
        }

        if (option === "ASC") {
          return valueA.localeCompare(valueB);
        } else {
          return valueB.localeCompare(valueA);
        }
      });
      setAccounts(sortedData);
    }
  };

  const handleAddAccount = () => {};
  const handleAddInfomation = () => {};
  return (
    <DashboardLayout>
      <ToastContainer autoClose={3000} />
      <DashboardNavbar />
      <Card className="max-h-max mb-5 min-h-full">
        <MDBox p={5}>
          <div className="text-center mt-0 ">
            <div className="flex justify-center items-center text-3xl mx-auto w-full">
              <GroupIcon />
              <h4 className="text-xl font-bold ml-3">QUẢN LÍ GIÁO VIÊN</h4>
            </div>
          </div>
          <div className="mt-4 grid max-[693px]:grid-cols-1 md:grid-cols-2 gap-1 max-[693px]:mt-6">
            <div className="flex justify-start max-[639px]:flex-wrap">
              <FormControl sx={{ minWidth: 120 }}>
                <InputLabel id="select-school-year-lable">Sắp xếp theo</InputLabel>
                <Select
                  labelId="select-school-year-lable"
                  id="select-school-year"
                  value={sortOption}
                  className="h-11 mr-0"
                  label="Sắp xếp theo"
                  onChange={(e) => setSortOption(e.target.value)}
                >
                  {sortOptions.map((item, index) => (
                    <MenuItem key={index} value={item.value}>
                      {item.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <div className="max-[639px]:w-full max-[639px]:ml-0 mt-3 ml-2 sm:mt-0">
                <ButtonComponent
                  type="success"
                  className="max-[639px]:w-full"
                  onClick={handleSortTeacher}
                >
                  <SwapVertIcon className="text-3xl mr-1" /> SẮP XẾP
                </ButtonComponent>
              </div>
            </div>
            <div className="w-full flex justify-end max-[639px]:justify-between items-center mt-3 sm:mt-0 ">
              <SearchInputComponent
                onSearch={handleChangeSearchValue}
                placeHolder="Nhập từ khóa..."
              />
              <div className="ml-3">
                {userRole.includes(PRINCIPAL_ROLE) ? (
                  <ButtonComponent className="" onClick={() => setModalOpen(true)}>
                    <AddCircleOutlineIcon className="text-3xl mr-1" />
                    TẠO
                  </ButtonComponent>
                ) : (
                  ""
                )}

                <PopupComponent
                  title="TẠO TÀI KHOẢN"
                  description="Hãy tạo tài khoản"
                  icon={<AddCircleOutlineIcon />}
                  isOpen={modalOpen}
                  onClose={() => setModalOpen(false)}
                  tabs={[
                    { label: "1. TÀI KHOẢN" },
                    { label: "2. CHI TIẾT" },
                    { label: "3. VAI TRÒ" },
                    { label: "TẠO BẰNG EXCEL" },
                  ]}
                  currentTab={currentTab}
                  onTabChange={handleTabChange}
                >
                  {/* Content for Tab 1 */}
                  <div role="tabpanel" hidden={currentTab !== 0}>
                    <form onSubmit={handleSubmit(handleAddAccount)}>
                      <InputBaseComponent
                        placeholder="Nhập tên tài khoản"
                        type="text"
                        control={control}
                        setValue={noSetValue}
                        name="username"
                        label="Tên tài khoản"
                        errors={errors}
                        validationRules={{
                          required: "Không được bỏ trống!",
                        }}
                      />
                      <InputBaseComponent
                        placeholder="Nhập mật khẩu"
                        // className="w-1/2 mr-3"
                        type="password"
                        control={control}
                        setValue={noSetValue}
                        name="password"
                        label="Mật khẩu"
                        errors={errors}
                        validationRules={{
                          required: "Không được bỏ trống!",
                          minLength: {
                            value: 6,
                            message: "Mật khẩu ít nhất 6 kí tự!",
                          },
                          maxLength: {
                            value: 20,
                            message: "Mật khẩu dài nhất 20 kí tự!",
                          },
                        }}
                      />
                      <NotifyCheckInfoForm actionText="Hãy chuyển sang tab tiếp theo để tiếp tục tạo!" />
                    </form>
                  </div>
                  {/* Content for Tab 2 */}
                  <div role="tabpanel" hidden={currentTab == 1}>
                    <form onSubmit={handleSubmit(handleAddInfomation)}>
                      <div className="sm:flex">
                        <InputBaseComponent
                          placeholder="Nguyen Van A"
                          className="sm:w-1/2 sm:mr-2 max-[639px]-full"
                          type="text"
                          control={control}
                          setValue={noSetValue}
                          name="fullName"
                          label="Họ và tên"
                          errors={errors}
                          validationRules={{
                            required: "Không được bỏ trống!",
                          }}
                        />
                        <InputBaseComponent
                          placeholder="Nhập ngày sinh"
                          className="sm:w-1/2 sm:mr-2 max-[639px]-full"
                          type="date"
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
                          type="select"
                          className="sm:w-1/2 max-[639px]-full"
                          control={control}
                          setValue={noSetValue}
                          name="gender"
                          label="Giới tính"
                          errors={errors}
                          options={genderOptions}
                        />
                      </div>

                      <div className="w-full sm:flex">
                        <InputBaseComponent
                          type="select"
                          label="Dân tộc"
                          className="sm:w-1/2 sm:mr-2 max-[639px]-full"
                          control={control}
                          setValue={noSetValue}
                          name="nation"
                          errors={errors}
                          options={nationOptions}
                        />
                        <InputBaseComponent
                          placeholder="gv@gmail.com"
                          className="sm:w-1/2 sm:mr-2 max-[639px]-full"
                          type="email"
                          control={control}
                          setValue={noSetValue}
                          name="email"
                          label="Email"
                          errors={errors}
                          validationRules={{
                            required: "Không được bỏ trống!",
                            pattern: {
                              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                              message: "Không đúng định dạng!",
                            },
                          }}
                        />
                        <InputBaseComponent
                          placeholder="0234123470"
                          className="sm:w-1/2 max-[639px]-full"
                          type="text"
                          control={control}
                          setValue={noSetValue}
                          name="phone"
                          label="Số điện thoại"
                          errors={errors}
                          validationRules={{
                            required: "Không được bỏ trống!",
                            pattern: {
                              value: /^[0-9]{10}$/,
                              message: "Không đúng định dạng!",
                            },
                          }}
                        />
                      </div>
                      <div className="sm:flex mt-2">
                        <InputBaseComponent
                          type="checkbox"
                          className="mr-3"
                          horizontalLabel={true}
                          control={control}
                          setValue={noSetValue}
                          name="bachelor"
                          label="Cử nhân"
                          errors={errors}
                        />
                        <InputBaseComponent
                          type="checkbox"
                          className="mr-3"
                          horizontalLabel={true}
                          control={control}
                          setValue={noSetValue}
                          name="master"
                          label="Thạc sĩ"
                          errors={errors}
                        />

                        <InputBaseComponent
                          type="checkbox"
                          className="mr-3"
                          horizontalLabel={true}
                          control={control}
                          setValue={noSetValue}
                          name="doctor"
                          label="Tiến sĩ"
                          errors={errors}
                        />

                        <InputBaseComponent
                          type="checkbox"
                          horizontalLabel={true}
                          control={control}
                          setValue={noSetValue}
                          name="professor"
                          label="Giáo sư"
                          errors={errors}
                        />
                      </div>

                      <InputBaseComponent
                        placeholder="600 Nguyen van cu"
                        className="w-full"
                        type="text"
                        control={control}
                        setValue={noSetValue}
                        name="address"
                        label="Địa chỉ"
                        errors={errors}
                        validationRules={{
                          required: "Không được bỏ trống!",
                        }}
                      />

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
                    </form>
                    <NotifyCheckInfoForm actionText="Hãy chuyển sang tab tiếp theo để tiếp tục tạo!" />
                  </div>
                  {/* Content for Tab 3 */}
                  <div role="tabpanel" hidden={currentTab == 2}>
                    {/* phân quyền*/}
                    <form onSubmit={handleSubmit(handleAddRole)}>
                      <InputBaseComponent
                        type="checkbox"
                        className="w-full"
                        horizontalLabel={true}
                        control={control}
                        setValue={noSetValue}
                        name="roleAmin"
                        label="1. Hiệu trưởng/Hiệu phó"
                        errors={errors}
                      />
                      <InputBaseComponent
                        type="checkbox"
                        className="w-full"
                        horizontalLabel={true}
                        control={control}
                        setValue={noSetValue}
                        name="roleSupervisor"
                        label="2. Tổng phụ trách"
                        errors={errors}
                      />
                      <InputBaseComponent
                        type="checkbox"
                        className="w-full"
                        horizontalLabel={true}
                        control={control}
                        setValue={noSetValue}
                        name="roleHomeroomTeacher"
                        label="3. Giáo viên chủ nhiệm"
                        errors={errors}
                      />
                      <InputBaseComponent
                        type="checkbox"
                        className="w-full"
                        horizontalLabel={true}
                        control={control}
                        setValue={noSetValue}
                        name="roleSubjectTeacher"
                        label="4. Giáo viên bộ môn"
                        errors={errors}
                      />
                      <InputBaseComponent
                        type="checkbox"
                        className="w-full"
                        horizontalLabel={true}
                        control={control}
                        setValue={noSetValue}
                        name="roleStudent"
                        label="5. Học sinh"
                        errors={errors}
                      />
                      <NotifyCheckInfoForm
                        className="mt-4"
                        actionText="Hãy kiểm tra kĩ thông tin trước khi tạo!"
                      />
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
                          <AddCircleOutlineIcon className="text-3xl mr-1" />
                          TẠO
                        </ButtonComponent>
                      </div>
                    </form>
                  </div>
                  <div role="tabpanel" hidden={currentTab == 3}>
                    <ButtonComponent action="submit" onClick={() => handleDownloadTeacherExcel()}>
                      <DownloadIcon className="mr-2" />
                      TẢI XUỐNG
                    </ButtonComponent>
                    <form onSubmit={handleSubmit(handleAddTeacherByExcel)}>
                      <InputBaseComponent
                        name="teacherFile"
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
                          {addTeacherMutationByExcel.isLoading ? (
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
            ) : data && accounts?.length > 0 ? (
              userRole.includes(PRINCIPAL_ROLE) ? (
                <TableComponent
                  header={[
                    "Mã giáo viên",
                    "Tên đăng nhập",
                    "Họ và tên",
                    "Hình ảnh",
                    "Email",
                    "Số điện thoại",
                  ]}
                  data={accounts.map((item) => [
                    item.id,
                    item.username,
                    item.fullname,
                    item.avatar,
                    item.email,
                    item.phone,
                  ])}
                  itemsPerPage={30}
                  isImage={3}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  className="mt-8"
                />
              ) : (
                <TableComponent
                  header={[
                    "Mã giáo viên",
                    "Tên đăng nhập",
                    "Họ và tên",
                    "Hình ảnh",
                    "Email",
                    "Số điện thoại",
                  ]}
                  data={accounts.map((item) => [
                    item.id,
                    item.username,
                    item.fullname,
                    item.avatar,
                    item.email,
                    item.phone,
                  ])}
                  itemsPerPage={30}
                  isImage={3}
                  className="mt-8"
                />
              )
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
              description="Hãy cập nhật tài khoản"
              icon={<AddCircleOutlineIcon />}
              isOpen={modalEditOpen}
              onClose={() => {
                setModalEditOpen(false);
                setValue("roleAmin", false);
                setValue("roleSupervisor", false);
                setValue("roleHomeroomTeacher", false);
                setValue("roleSubjectTeacher", false);
                setValue("roleStudent", false);
                resetEditAction();
              }}
              tabs={[{ label: "1. CHI TIẾT" }, { label: "2. VAI TRÒ" }]}
              currentTab={currentTabEdit}
              onTabChange={handleTabChange}
            >
              {/* Content for Tab 2 */}
              <div role="tabpanel" hidden={currentTabEdit == 1}>
                <form onSubmit={handleSubmit(handleAddInfomation)}>
                  <div className="sm:flex">
                    <InputBaseComponent
                      placeholder="Nguyen Van A"
                      className="sm:w-1/2 sm:mr-2 max-[639px]:w-full"
                      type="text"
                      control={controlEditAction}
                      setValue={setValue}
                      name="fullName"
                      label="Họ và tên"
                      errors={errorsEditAction}
                      validationRules={{
                        required: "Không được bỏ trống!",
                      }}
                    />
                    <InputBaseComponent
                      placeholder="Nhập ngày sinh"
                      className="sm:w-1/2 sm:mr-2 max-[639px]:w-full"
                      type="date"
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
                      className="sm:w-1/2 max-[639px]:w-full"
                      control={controlEditAction}
                      setValue={setValue}
                      name="gender"
                      label="Giới tính"
                      errors={errorsEditAction}
                      options={genderOptions}
                    />
                  </div>

                  <div className="w-full sm:flex">
                    <InputBaseComponent
                      type="select"
                      label="Dân tộc"
                      className="sm:w-1/2 sm:mr-2 max-[639px]:w-full"
                      control={controlEditAction}
                      setValue={setValue}
                      name="nation"
                      errors={errors}
                      options={nationOptions}
                    />
                    <InputBaseComponent
                      placeholder="gv@gmail.com"
                      className="sm:w-1/2 sm:mr-2 max-[639px]:w-full"
                      type="email"
                      control={controlEditAction}
                      setValue={setValue}
                      name="email"
                      label="Email"
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
                      placeholder="0234123470"
                      className="sm:w-1/2 max-[639px]:w-full"
                      type="text"
                      control={controlEditAction}
                      setValue={setValue}
                      name="phone"
                      label="Số điện thoại"
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
                  <div className="sm:flex mt-2">
                    <InputBaseComponent
                      type="checkbox"
                      className="mr-3"
                      horizontalLabel={true}
                      control={controlEditAction}
                      setValue={setValue}
                      name="bachelor"
                      label="Cử nhân"
                      errors={errorsEditAction}
                    />
                    <InputBaseComponent
                      type="checkbox"
                      className="mr-3"
                      horizontalLabel={true}
                      control={controlEditAction}
                      setValue={setValue}
                      name="master"
                      label="Thạc sĩ"
                      errors={errorsEditAction}
                    />

                    <InputBaseComponent
                      type="checkbox"
                      className="mr-3"
                      horizontalLabel={true}
                      control={controlEditAction}
                      setValue={setValue}
                      name="doctor"
                      label="Tiến sĩ"
                      errors={errorsEditAction}
                    />

                    <InputBaseComponent
                      type="checkbox"
                      horizontalLabel={true}
                      control={controlEditAction}
                      setValue={setValue}
                      name="professor"
                      label="Giáo sư"
                      errors={errorsEditAction}
                    />
                  </div>

                  <InputBaseComponent
                    placeholder="600 Nguyen van cu"
                    className="w-full"
                    type="text"
                    control={controlEditAction}
                    setValue={setValue}
                    name="address"
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
                        alt="Ảnh bìa"
                      />
                    )}
                  </div>
                </form>
                <NotifyCheckInfoForm actionText="Hãy chuyển sang tab tiếp theo để tiếp tục tạo!" />
              </div>
              {/* Content for Tab 3 */}
              <div role="tabpanel" hidden={currentTabEdit == 2}>
                {/* phân quyền*/}
                <form onSubmit={handleSubmitEditAction(handleEditSubject)}>
                  <InputBaseComponent
                    type="checkbox"
                    className="w-full"
                    horizontalLabel={true}
                    control={controlEditAction}
                    setValue={setValue}
                    name="roleAmin"
                    label="1. Hiệu trưởng/Hiệu phó"
                    errors={errorsEditAction}
                  />
                  <InputBaseComponent
                    type="checkbox"
                    className="w-full"
                    horizontalLabel={true}
                    control={controlEditAction}
                    setValue={setValue}
                    name="roleSupervisor"
                    label="2. Tổng phụ trách"
                    errors={errorsEditAction}
                  />
                  <InputBaseComponent
                    type="checkbox"
                    className="w-full"
                    horizontalLabel={true}
                    control={controlEditAction}
                    setValue={setValue}
                    name="roleHomeroomTeacher"
                    label="3. Giáo viên chủ nhiệm"
                    errors={errorsEditAction}
                  />
                  <InputBaseComponent
                    type="checkbox"
                    className="w-full"
                    horizontalLabel={true}
                    control={controlEditAction}
                    setValue={setValue}
                    name="roleSubjectTeacher"
                    label="4. Giáo viên bộ môn"
                    errors={errorsEditAction}
                  />
                  <InputBaseComponent
                    type="checkbox"
                    className="w-full"
                    horizontalLabel={true}
                    control={controlEditAction}
                    setValue={setValue}
                    name="roleStudent"
                    label="5. Học sinh"
                    errors={errorsEditAction}
                  />
                  <NotifyCheckInfoForm
                    className="mt-4"
                    actionText="Hãy kiểm tra kĩ thông tin trước khi tạo!"
                  />
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
                      <BorderColorIcon className="text-3xl mr-1" />
                      CẬP NHẬT
                    </ButtonComponent>
                  </div>
                </form>
              </div>
            </PopupComponent>
            <PopupComponent
              title="XÓA TÀI KHOẢN"
              description="Hãy kiểm xác nhận thông tin trước khi xóa"
              icon={<DeleteIcon />}
              isOpen={modalDeleteOpen}
              onClose={() => setModalDeleteOpen(false)}
            >
              <p>Bạn có chắc chắn muốn xóa tài khoản?</p>
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
                  <DeleteIcon className="text-3xl mr-1" />
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
