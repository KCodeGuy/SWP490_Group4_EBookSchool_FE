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
  const accessToken = localStorage.getItem("authToken");
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
        toast.success("Tạo giáo viên thành công!");
        refetch().then((result) => {
          if (result.data) {
            setAccounts(data);
          }
        });
        reset();
        setModalOpen(false);
      } else {
        toast.error(`Tạo giáo viên thất bại! ${response?.response?.data}!`);
      }
    },
    onError: (error) => {
      toast.error(`Tạo giáo viên thất bại! ${error.message}!`);
    },
  });

  const addTeacherMutationByExcel = useMutation(
    (templateFile) => addTeacherByExcel(accessToken, templateFile),
    {
      onSuccess: (response) => {
        queryClient.invalidateQueries("teacherState");
        if (response && response?.status === 200) {
          toast.success("Tạo giáo viên thành công!");
          refetch().then((result) => {
            if (result.data) {
              setAccounts(data);
            }
          });
          reset();
          setModalOpen(false);
        } else {
          toast.error(`Tạo giáo viên thất bại! ${response?.response?.data}!`);
        }
      },
      onError: (error) => {
        toast.error(`Tạo giáo viên thất bại! ${error.message}!`);
      },
    }
  );

  const handleAddTeacherByExcel = (data) => {
    if (data && data?.teacherFile) {
      if (isXlsxFile(data?.teacherFile)) {
        addTeacherMutationByExcel.mutate(data?.teacherFile);
      } else {
        toast.error(`Tạo tài khoản thất bại! File không đúng định dạng ".xlsx"!`);
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
      toast.error("Tạo giáo viên thất bại! Bạn phải điền đủ thông tin chi tiết!");
    } else if (roles?.length <= 0) {
      toast.error("Tạo giáo viên thất bại! Bạn chưa chọn vai trò!");
    } else if (permissions?.length <= 0) {
      toast.error("Tạo giáo viên thất bại! Bạn chưa phân quyền!");
    } else if (roles?.length > 0 && permissions?.length > 0 && isCorrectOtherValue) {
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
        setValue("isBachelor", result?.isBachelor);
        setValue("isMaster", result?.isMaster);
        setValue("isDoctor", result?.isDoctor);
        setValue("isProfessor", result?.isProfessor);
        setValue("address", result?.address);
        setValue("avatar", result?.avatar);
        setAvatar(result?.avatar);

        result?.roles?.forEach((role) => {
          const formattedRole = `role${role}`;
          setValue(formattedRole, true);
        });

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
          toast.success("Cập nhật giáo viên thành công!");
          refetch().then((result) => {
            if (result.data) {
              setAccounts(data);
            }
          });
          resetEditAction();
          setModalEditOpen(false);
        } else {
          toast.error(`Cập nhật giáo viên thất bại! ${response?.response?.data}!`);
        }
      },
      onError: (error) => {
        toast.error(`Cập nhật giáo viên thất bại! ${error.message}!`);
      },
    }
  );

  const handleEditSubject = (data) => {
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
      toast.error("Cập nhật giáo viên thất bại! Bạn phải điền đủ thông tin chi tiết!");
    } else if (roles?.length <= 0) {
      toast.error("Cập nhật giáo viên thất bại! Bạn chưa chọn vai trò!");
    } else if (permissions?.length <= 0) {
      toast.error("Cập nhật giáo viên thất bại! Bạn chưa phân quyền!");
    } else if (roles?.length > 0 && permissions?.length > 0 && isCorrectOtherValue) {
      updateTeacherMutation.mutate(newObj);
    }
  };

  const deleteTeacherMutation = useMutation((username) => deleteTeacher(accessToken, username), {
    onSuccess: (response) => {
      if (response) {
        queryClient.invalidateQueries(["teacherAccounts", { accessToken }]); // Invalidate the getTeachers query
        toast.success(`Xóa giáo viên thành công!`);
        refetch().then((result) => {
          if (result.data) {
            setAccounts(data);
          }
        });
        setModalDeleteOpen(false);
      } else {
        toast.error("Xóa giáo viên thất bại!");
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
          <div className="mt-4 grid sm:grid-cols-1 lg:grid-cols-2 gap-1">
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
              <div className="max-[639px]:mt-2 ml-3">
                <ButtonComponent type="success" onClick={handleSortTeacher}>
                  <SwapVertIcon className="text-3xl mr-1" /> SẮP XẾP
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
                  TẠO
                </ButtonComponent>
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
                    { label: "4. PHÂN QUYỀN" },
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
                      <div className="flex">
                        <InputBaseComponent
                          placeholder="Nguyen Van A"
                          className="w-1/2 mr-2"
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
                          className="w-1/2 mr-2"
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
                          className="w-1/2 "
                          control={control}
                          setValue={noSetValue}
                          name="gender"
                          label="Giới tính"
                          errors={errors}
                          options={genderOptions}
                        />
                      </div>

                      <div className="w-full flex">
                        <InputBaseComponent
                          type="select"
                          label="Dân tộc"
                          className="w-1/2 mr-2"
                          control={control}
                          setValue={noSetValue}
                          name="nation"
                          errors={errors}
                          options={nationOptions}
                        />
                        <InputBaseComponent
                          placeholder="gv@gmail.com"
                          className="w-1/2 mr-2"
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
                          className="w-1/2"
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
                      <div className="flex mt-2">
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
                    </form>
                    <NotifyCheckInfoForm actionText="Hãy chuyển sang tab tiếp theo để tiếp tục tạo!" />
                  </div>
                  <div role="tabpanel" hidden={currentTab == 3}>
                    {/* phân quyền*/}
                    <form onSubmit={handleSubmit(handleAddRole)}>
                      <div className="flex w-full">
                        <div className="w-1/2 border-2 border-gray-300 rounded-md justify-center px-5 py-2 mt-5 mr-3">
                          {/* Left in right column */}
                          <p className="uppercase font-medium mb-2 primary-color">
                            Tài khoản giáo viên
                          </p>
                          <InputBaseComponent
                            type="checkbox"
                            horizontalLabel={true}
                            control={control}
                            setValue={noSetValue}
                            name="isGetTeacher"
                            label="Xem giáo viên"
                            errors={errors}
                          />
                          <InputBaseComponent
                            type="checkbox"
                            horizontalLabel={true}
                            control={control}
                            setValue={noSetValue}
                            name="isAddTeacher"
                            label="Thêm giáo viên"
                            errors={errors}
                          />
                          <InputBaseComponent
                            type="checkbox"
                            horizontalLabel={true}
                            control={control}
                            setValue={noSetValue}
                            name="isUpdateTeacher"
                            label="Chỉnh sửa giáo viên"
                            errors={errors}
                          />
                          <InputBaseComponent
                            type="checkbox"
                            horizontalLabel={true}
                            control={control}
                            setValue={noSetValue}
                            name="isDeleteTeacher"
                            label="Xóa giáo viên"
                            errors={errors}
                          />
                        </div>
                        <div className="w-1/2 border-2 border-gray-300 rounded-md justify-center px-5 py-2 mt-5">
                          {/* Left in right column */}
                          <p className="uppercase font-medium mb-2 primary-color">
                            Tài khoản học SINH
                          </p>
                          <InputBaseComponent
                            type="checkbox"
                            horizontalLabel={true}
                            control={control}
                            setValue={noSetValue}
                            name="isGetStudent"
                            label="Xem học sinh"
                            errors={errors}
                          />
                          <InputBaseComponent
                            type="checkbox"
                            horizontalLabel={true}
                            control={control}
                            setValue={noSetValue}
                            name="isAddStudent"
                            label="Thêm học sinh"
                            errors={errors}
                          />
                          <InputBaseComponent
                            type="checkbox"
                            horizontalLabel={true}
                            control={control}
                            setValue={noSetValue}
                            name="isUpdateStudent"
                            label="Chỉnh sửa học sinh"
                            errors={errors}
                          />
                          <InputBaseComponent
                            type="checkbox"
                            horizontalLabel={true}
                            control={control}
                            setValue={noSetValue}
                            name="isDeleteStudent"
                            label="Xóa học sinh"
                            errors={errors}
                          />
                        </div>
                      </div>
                      <div className="w-full flex">
                        <div className="w-1/2 border-2 border-gray-300 rounded-md justify-center px-5 py-2 mt-5 mr-3">
                          <p className="uppercase font-medium mb-2 primary-color">Môn học</p>
                          <InputBaseComponent
                            type="checkbox"
                            horizontalLabel={true}
                            control={control}
                            setValue={noSetValue}
                            name="isGetSubject"
                            label="Xem môn học"
                            errors={errors}
                          />
                          <InputBaseComponent
                            type="checkbox"
                            horizontalLabel={true}
                            control={control}
                            setValue={noSetValue}
                            name="isAddSubject"
                            label="Thêm môn học"
                            errors={errors}
                          />
                          <InputBaseComponent
                            type="checkbox"
                            horizontalLabel={true}
                            control={control}
                            setValue={noSetValue}
                            name="isUpdateSubject"
                            label="Chỉnh sửa môn học"
                            errors={errors}
                          />
                          <InputBaseComponent
                            type="checkbox"
                            horizontalLabel={true}
                            control={control}
                            setValue={noSetValue}
                            name="isDeleteSubject"
                            label="Xóa môn học"
                            errors={errors}
                          />
                        </div>
                        <div className="w-1/2 border-2 border-gray-300 rounded-md justify-center px-5 py-2 mt-5">
                          <p className="uppercase font-medium mb-2 primary-color">lớp học</p>
                          <InputBaseComponent
                            type="checkbox"
                            horizontalLabel={true}
                            control={control}
                            setValue={noSetValue}
                            name="isGetClass"
                            label="Xem lớp"
                            errors={errors}
                          />
                          <InputBaseComponent
                            type="checkbox"
                            horizontalLabel={true}
                            control={control}
                            setValue={noSetValue}
                            name="isAddClass"
                            label="Thêm lớp"
                            errors={errors}
                          />
                          <InputBaseComponent
                            type="checkbox"
                            horizontalLabel={true}
                            control={control}
                            setValue={noSetValue}
                            name="isUpdateClass"
                            label="Chỉnh sửa lớp"
                            errors={errors}
                          />
                          <InputBaseComponent
                            type="checkbox"
                            horizontalLabel={true}
                            control={control}
                            setValue={noSetValue}
                            name="isDeleteClass"
                            label="Xóa lớp"
                            errors={errors}
                          />
                        </div>
                      </div>
                      <div className="w-full flex mt-5">
                        <div className="w-1/2 border-2 order-2 border-gray-300 rounded-md justify-center px-5 py-2">
                          <p className="uppercase font-medium mb-2 primary-color">Thời khóa biểu</p>
                          <InputBaseComponent
                            type="checkbox"
                            horizontalLabel={true}
                            control={control}
                            setValue={noSetValue}
                            name="isGetSchedule"
                            label="Xem thời khóa biểu"
                            errors={errors}
                          />
                          <InputBaseComponent
                            type="checkbox"
                            horizontalLabel={true}
                            control={control}
                            setValue={noSetValue}
                            name="isAddSchedule"
                            label="Thêm thời khóa biểu"
                            errors={errors}
                          />
                          <InputBaseComponent
                            type="checkbox"
                            horizontalLabel={true}
                            control={control}
                            setValue={noSetValue}
                            name="isUpdateSchedule"
                            label="Chỉnh sửa thời khóa biểu"
                            errors={errors}
                          />
                          <InputBaseComponent
                            type="checkbox"
                            horizontalLabel={true}
                            control={control}
                            setValue={noSetValue}
                            name="isDeleteSchedule"
                            label="Xóa thời khóa biểu"
                            errors={errors}
                          />
                        </div>
                        <div className="w-1/2 border-2 border-gray-300 rounded-md justify-center px-5 py-2 mr-3">
                          <p className="uppercase font-medium mb-2 primary-color">sổ đầu bài</p>
                          <InputBaseComponent
                            type="checkbox"
                            horizontalLabel={true}
                            control={control}
                            setValue={noSetValue}
                            name="isGetRegisterBook"
                            label="Xem sổ đầu bài"
                            errors={errors}
                          />
                          <InputBaseComponent
                            type="checkbox"
                            horizontalLabel={true}
                            control={control}
                            setValue={noSetValue}
                            name="isAddRegisterBook"
                            label="Thêm sổ đầu bài"
                            errors={errors}
                          />
                          <InputBaseComponent
                            type="checkbox"
                            horizontalLabel={true}
                            control={control}
                            setValue={noSetValue}
                            name="isUpdateRegisterBook"
                            label="Chỉnh sửa sổ đầu bài"
                            errors={errors}
                          />
                          <InputBaseComponent
                            type="checkbox"
                            horizontalLabel={true}
                            control={control}
                            setValue={noSetValue}
                            name="isDeleteRegisterBook"
                            label="Xóa sổ đầu bài"
                            errors={errors}
                          />
                        </div>
                      </div>
                      <div className="w-full flex">
                        <div className="w-1/2 border-2 border-gray-300 rounded-md justify-center px-5 py-2 mt-5 mr-3">
                          <p className="uppercase font-medium mb-2 primary-color">Điểm danh</p>
                          <InputBaseComponent
                            type="checkbox"
                            horizontalLabel={true}
                            control={control}
                            setValue={noSetValue}
                            name="isGetAttendance"
                            label="Xem điểm danh"
                            errors={errors}
                          />
                          <InputBaseComponent
                            type="checkbox"
                            horizontalLabel={true}
                            control={control}
                            setValue={noSetValue}
                            name="isAddAttendance"
                            label="Thêm điểm danh"
                            errors={errors}
                          />
                          <InputBaseComponent
                            type="checkbox"
                            horizontalLabel={true}
                            control={control}
                            setValue={noSetValue}
                            name="isUpdateAttendance"
                            label="Chỉnh sửa điểm danh"
                            errors={errors}
                          />
                          <InputBaseComponent
                            type="checkbox"
                            horizontalLabel={true}
                            control={control}
                            setValue={noSetValue}
                            name="isDeleteAttendance"
                            label="Xóa điểm danh"
                            errors={errors}
                          />
                        </div>
                        <div className="w-1/2 border-2 border-gray-300 rounded-md justify-center px-5 py-2 mt-5">
                          {/* Left in right column */}
                          <p className="uppercase font-medium mb-2 primary-color">Điểm số</p>
                          <InputBaseComponent
                            type="checkbox"
                            horizontalLabel={true}
                            control={control}
                            setValue={noSetValue}
                            name="isGetMark"
                            label="Xem điểm"
                            errors={errors}
                          />
                          <InputBaseComponent
                            type="checkbox"
                            horizontalLabel={true}
                            control={control}
                            setValue={noSetValue}
                            name="isAddMark"
                            label="Thêm điểm"
                            errors={errors}
                          />
                          <InputBaseComponent
                            type="checkbox"
                            horizontalLabel={true}
                            control={control}
                            setValue={noSetValue}
                            name="isUpdateMark"
                            label="Chỉnh sửa điểm"
                            errors={errors}
                          />
                          <InputBaseComponent
                            type="checkbox"
                            horizontalLabel={true}
                            control={control}
                            setValue={noSetValue}
                            name="isDeleteMark"
                            label="Xóa điểm"
                            errors={errors}
                          />
                        </div>
                      </div>
                      <div className="w-full flex mb-2">
                        <div className="w-1/2 border-2 border-gray-300 rounded-md justify-center px-5 py-2 mt-5 mr-3">
                          <p className="uppercase font-medium mb-2 primary-color">Thông báo</p>
                          <InputBaseComponent
                            type="checkbox"
                            horizontalLabel={true}
                            control={control}
                            setValue={noSetValue}
                            name="isGetNotification"
                            label="Xem thông báo"
                            errors={errors}
                          />
                          <InputBaseComponent
                            type="checkbox"
                            horizontalLabel={true}
                            control={control}
                            setValue={noSetValue}
                            name="isAddNotification"
                            label="Thêm thông báo"
                            errors={errors}
                          />
                          <InputBaseComponent
                            type="checkbox"
                            horizontalLabel={true}
                            control={control}
                            setValue={noSetValue}
                            name="isUpdateNotification"
                            label="Chỉnh sửa thông báo"
                            errors={errors}
                          />
                          <InputBaseComponent
                            type="checkbox"
                            horizontalLabel={true}
                            control={control}
                            setValue={noSetValue}
                            name="isDeleteNotification"
                            label="Xóa thông báo"
                            errors={errors}
                          />
                        </div>
                        <div className="w-1/2 border-2 border-gray-300 rounded-md justify-center px-5 py-2 mt-5">
                          <p className="uppercase font-medium mb-2 primary-color">Hệ thống</p>
                          <InputBaseComponent
                            type="checkbox"
                            horizontalLabel={true}
                            control={control}
                            setValue={noSetValue}
                            name="isUpdateSetting"
                            label="Cài đặt hệ thống"
                            errors={errors}
                          />
                          <InputBaseComponent
                            type="checkbox"
                            horizontalLabel={true}
                            control={control}
                            setValue={noSetValue}
                            name="isGetLog"
                            label="Xem lịch sử hoạt động"
                            errors={errors}
                          />
                        </div>
                      </div>
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
                  <div role="tabpanel" hidden={currentTab == 4}>
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
                          <AddCircleOutlineIcon className="text-3xl mr-1" />
                          TẠO
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
              onClose={() => setModalEditOpen(false)}
              tabs={[{ label: "1. CHI TIẾT" }, { label: "2. VAI TRÒ" }, { label: "3. PHÂN QUYỀN" }]}
              currentTab={currentTabEdit}
              onTabChange={(newTab) => {
                setCurrentTabEdit(newTab);
              }}
            >
              <div role="tabpanel" hidden={currentTabEdit !== 0}>
                <form onSubmit={handleSubmit(handleAddInfomation)}>
                  <div className="w-full flex">
                    <InputBaseComponent
                      placeholder="Nguyễn Văn A"
                      className="w-1/3 mr-2"
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
                      placeholder=""
                      className="w-1/3 mr-2"
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
                          message: "Email không đúng định dạng!",
                        },
                      }}
                    />
                    <InputBaseComponent
                      placeholder="Nhập số điện thoại"
                      className="w-1/3"
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
                          message: "Số điện thoại không đúng định dạng!",
                        },
                      }}
                    />
                  </div>

                  <div className="flex ">
                    <InputBaseComponent
                      placeholder="Nhập ngày sinh"
                      className="w-1/3 mr-2"
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
                      className="w-1/3 mr-2"
                      control={controlEditAction}
                      setValue={setValue}
                      name="gender"
                      label="Giới tính"
                      errors={errorsEditAction}
                      options={genderOptions}
                    />
                    <InputBaseComponent
                      type="select"
                      label="Dân tộc"
                      className="w-1/3"
                      control={controlEditAction}
                      setValue={setValue}
                      name="nation"
                      errors={errorsEditAction}
                      options={nationOptions}
                    />
                  </div>

                  <InputBaseComponent
                    placeholder="Nhập mã số căn cước"
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
                  <div className="flex justify-evenly">
                    <InputBaseComponent
                      type="checkbox"
                      horizontalLabel={true}
                      control={controlEditAction}
                      setValue={setValue}
                      name="bachelor"
                      label="Cử nhân"
                      errors={errorsEditAction}
                    />

                    <InputBaseComponent
                      type="checkbox"
                      horizontalLabel={true}
                      control={controlEditAction}
                      setValue={setValue}
                      name="master"
                      label="Thạc sĩ"
                      errors={errorsEditAction}
                    />

                    <InputBaseComponent
                      type="checkbox"
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
                <NotifyCheckInfoForm actionText="Hãy chuyển sang tab tiếp theo để tiếp tục cập nhật!" />
              </div>
              <div role="tabpanel" hidden={currentTabEdit == 1}>
                {/* phân quyền*/}
                <form onSubmit={handleSubmit(handleAddRole)}>
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
                </form>
                <NotifyCheckInfoForm actionText="Hãy chuyển sang tab tiếp theo để tiếp tục cập nhật!" />
              </div>
              <div role="tabpanel" hidden={currentTabEdit == 2}>
                <form onSubmit={handleSubmitEditAction(handleEditSubject)}>
                  <div className="">
                    <div className="w-full flex mb-2 mt-5">
                      <div className="w-1/2 border-2 border-gray-300 rounded-md justify-center px-5 py-2 mr-3">
                        <p className="uppercase font-medium mb-2 primary-color">
                          Tài khoản giáo viên
                        </p>
                        <InputBaseComponent
                          type="checkbox"
                          horizontalLabel={true}
                          control={controlEditAction}
                          setValue={setValue}
                          name="isGetTeacher"
                          label="Xem giáo viên"
                          errors={errorsEditAction}
                        />
                        <InputBaseComponent
                          type="checkbox"
                          horizontalLabel={true}
                          control={controlEditAction}
                          setValue={setValue}
                          name="isAddTeacher"
                          label="Thêm giáo viên"
                          errors={errorsEditAction}
                        />
                        <InputBaseComponent
                          type="checkbox"
                          horizontalLabel={true}
                          control={controlEditAction}
                          setValue={setValue}
                          name="isUpdateTeacher"
                          label="Chỉnh sửa giáo viên"
                          errors={errorsEditAction}
                        />
                        <InputBaseComponent
                          type="checkbox"
                          horizontalLabel={true}
                          control={controlEditAction}
                          setValue={setValue}
                          name="isDeleteTeacher"
                          label="Xóa giáo viên"
                          errors={errorsEditAction}
                        />
                      </div>
                      <div className="w-1/2 border-2 border-gray-300 rounded-md justify-center px-5 py-2">
                        <p className="uppercase font-medium mb-2 primary-color">
                          Tài khoản học sinh
                        </p>
                        <InputBaseComponent
                          type="checkbox"
                          horizontalLabel={true}
                          control={controlEditAction}
                          setValue={setValue}
                          name="isGetStudent"
                          label="Xem học sinh"
                          errors={errorsEditAction}
                        />
                        <InputBaseComponent
                          type="checkbox"
                          horizontalLabel={true}
                          control={controlEditAction}
                          setValue={setValue}
                          name="isAddStudent"
                          label="Thêm học sinh"
                          errors={errorsEditAction}
                        />
                        <InputBaseComponent
                          type="checkbox"
                          horizontalLabel={true}
                          control={controlEditAction}
                          setValue={setValue}
                          name="isUpdateStudent"
                          label="Chỉnh sửa học sinh"
                          errors={errorsEditAction}
                        />
                        <InputBaseComponent
                          type="checkbox"
                          horizontalLabel={true}
                          control={controlEditAction}
                          setValue={setValue}
                          name="isDeleteStudent"
                          label="Xóa học sinh"
                          errors={errorsEditAction}
                        />
                      </div>
                    </div>
                    <div className="w-full flex mb-2 mt-5">
                      <div className="w-1/2 border-2 border-gray-300 rounded-md justify-center px-5 py-2 mr-3">
                        <p className="uppercase font-medium mb-2 primary-color">Môn học</p>
                        <InputBaseComponent
                          type="checkbox"
                          horizontalLabel={true}
                          control={controlEditAction}
                          setValue={setValue}
                          name="isGetSubject"
                          label="Xem môn học"
                          errors={errorsEditAction}
                        />
                        <InputBaseComponent
                          type="checkbox"
                          horizontalLabel={true}
                          control={controlEditAction}
                          setValue={setValue}
                          name="isAddSubject"
                          label="Thêm môn học"
                          errors={errorsEditAction}
                        />
                        <InputBaseComponent
                          type="checkbox"
                          horizontalLabel={true}
                          control={controlEditAction}
                          setValue={setValue}
                          name="isUpdateSubject"
                          label="Chỉnh sửa môn học"
                          errors={errorsEditAction}
                        />
                        <InputBaseComponent
                          type="checkbox"
                          horizontalLabel={true}
                          control={controlEditAction}
                          setValue={setValue}
                          name="isDeleteSubject"
                          label="Xóa môn học"
                          errors={errorsEditAction}
                        />
                      </div>
                      <div className="w-1/2 border-2 border-gray-300 rounded-md justify-center px-5 py-2">
                        <p className="uppercase font-medium mb-2 primary-color">Lớp học</p>
                        <InputBaseComponent
                          type="checkbox"
                          horizontalLabel={true}
                          control={controlEditAction}
                          setValue={setValue}
                          name="isGetClass"
                          label="Xem lớp"
                          errors={errorsEditAction}
                        />
                        <InputBaseComponent
                          type="checkbox"
                          horizontalLabel={true}
                          control={controlEditAction}
                          setValue={setValue}
                          name="isAddClass"
                          label="Thêm lớp"
                          errors={errorsEditAction}
                        />
                        <InputBaseComponent
                          type="checkbox"
                          horizontalLabel={true}
                          control={controlEditAction}
                          setValue={setValue}
                          name="isUpdateClass"
                          label="Chỉnh sửa lớp"
                          errors={errorsEditAction}
                        />
                        <InputBaseComponent
                          type="checkbox"
                          horizontalLabel={true}
                          control={controlEditAction}
                          setValue={setValue}
                          name="isDeleteClass"
                          label="Xóa lớp"
                          errors={errorsEditAction}
                        />
                      </div>
                    </div>
                    <div className="w-full flex mb-2 mt-5">
                      <div className="w-1/2 border-2 border-gray-300 rounded-md justify-center px-5 py-2 mr-3">
                        <p className="uppercase font-medium mb-2 primary-color">Thời khóa biểu</p>
                        <InputBaseComponent
                          type="checkbox"
                          horizontalLabel={true}
                          control={controlEditAction}
                          setValue={setValue}
                          name="isGetSchedule"
                          label="Xem thời khóa biểu"
                          errors={errorsEditAction}
                        />
                        <InputBaseComponent
                          type="checkbox"
                          horizontalLabel={true}
                          control={controlEditAction}
                          setValue={setValue}
                          name="isAddSchedule"
                          label="Thêm thời khóa biểu"
                          errors={errorsEditAction}
                        />
                        <InputBaseComponent
                          type="checkbox"
                          horizontalLabel={true}
                          control={controlEditAction}
                          setValue={setValue}
                          name="isUpdateSchedule"
                          label="Chỉnh sửa thời khóa biểu"
                          errors={errorsEditAction}
                        />
                        <InputBaseComponent
                          type="checkbox"
                          horizontalLabel={true}
                          control={controlEditAction}
                          setValue={setValue}
                          name="isDeleteSchedule"
                          label="Xóa thời khóa biểu"
                          errors={errorsEditAction}
                        />
                      </div>
                      <div className="w-1/2 border-2 border-gray-300 rounded-md justify-center px-5 py-2">
                        <p className="uppercase font-medium mb-2 primary-color">Sổ đầu bài</p>
                        <InputBaseComponent
                          type="checkbox"
                          horizontalLabel={true}
                          control={controlEditAction}
                          setValue={setValue}
                          name="isGetRegisterBook"
                          label="Xem sổ đầu bài"
                          errors={errorsEditAction}
                        />
                        <InputBaseComponent
                          type="checkbox"
                          horizontalLabel={true}
                          control={controlEditAction}
                          setValue={setValue}
                          name="isAddRegisterBook"
                          label="Thêm sổ đầu bài"
                          errors={errorsEditAction}
                        />
                        <InputBaseComponent
                          type="checkbox"
                          horizontalLabel={true}
                          control={controlEditAction}
                          setValue={setValue}
                          name="isUpdateRegisterBook"
                          label="Chỉnh sửa sổ đầu bài"
                          errors={errorsEditAction}
                        />
                        <InputBaseComponent
                          type="checkbox"
                          horizontalLabel={true}
                          control={controlEditAction}
                          setValue={setValue}
                          name="isDeleteRegisterBook"
                          label="Xóa sổ đầu bài"
                          errors={errorsEditAction}
                        />
                      </div>
                    </div>

                    <div className="w-full flex mb-2 mt-5">
                      <div className="w-1/2 border-2 border-gray-300 rounded-md justify-center px-5 py-2 mr-3">
                        <p className="uppercase font-medium mb-2 primary-color">Điểm danh</p>
                        <InputBaseComponent
                          type="checkbox"
                          horizontalLabel={true}
                          control={controlEditAction}
                          setValue={setValue}
                          name="isGetAttendance"
                          label="Xem điểm danh"
                          errors={errorsEditAction}
                        />
                        <InputBaseComponent
                          type="checkbox"
                          horizontalLabel={true}
                          control={controlEditAction}
                          setValue={setValue}
                          name="isAddAttendance"
                          label="Thêm điểm danh"
                          errors={errorsEditAction}
                        />
                        <InputBaseComponent
                          type="checkbox"
                          horizontalLabel={true}
                          control={controlEditAction}
                          setValue={setValue}
                          name="isUpdateAttendance"
                          label="Chỉnh sửa điểm danh"
                          errors={errorsEditAction}
                        />
                        <InputBaseComponent
                          type="checkbox"
                          horizontalLabel={true}
                          control={controlEditAction}
                          setValue={setValue}
                          name="isDeleteAttendance"
                          label="Xóa điểm danh"
                          errors={errorsEditAction}
                        />
                      </div>
                      <div className="w-1/2 border-2 border-gray-300 rounded-md justify-center px-5 py-2 ">
                        <p className="uppercase font-medium mb-2 primary-color">Điểm số</p>
                        <InputBaseComponent
                          type="checkbox"
                          horizontalLabel={true}
                          control={controlEditAction}
                          setValue={setValue}
                          name="isGetMark"
                          label="Xem điểm"
                          errors={errorsEditAction}
                        />
                        <InputBaseComponent
                          type="checkbox"
                          horizontalLabel={true}
                          control={controlEditAction}
                          setValue={setValue}
                          name="isAddMark"
                          label="Thêm điểm"
                          errors={errorsEditAction}
                        />
                        <InputBaseComponent
                          type="checkbox"
                          horizontalLabel={true}
                          control={controlEditAction}
                          setValue={setValue}
                          name="isUpdateMark"
                          label="Chỉnh sửa điểm"
                          errors={errorsEditAction}
                        />
                        <InputBaseComponent
                          type="checkbox"
                          horizontalLabel={true}
                          control={controlEditAction}
                          setValue={setValue}
                          name="isDeleteMark"
                          label="Xóa điểm"
                          errors={errorsEditAction}
                        />
                      </div>
                    </div>
                    <div className="w-full flex mb-2 mt-5">
                      <div className="w-1/2 border-2 border-gray-300 rounded-md justify-center px-5 py-2 mr-3">
                        <p className="uppercase font-medium mb-2 primary-color">Thông báo</p>
                        <InputBaseComponent
                          type="checkbox"
                          horizontalLabel={true}
                          control={controlEditAction}
                          setValue={setValue}
                          name="isGetNotification"
                          label="Xem thông báo"
                          errors={errorsEditAction}
                        />
                        <InputBaseComponent
                          type="checkbox"
                          horizontalLabel={true}
                          control={controlEditAction}
                          setValue={setValue}
                          name="isAddNotification"
                          label="Thêm thông báo"
                          errors={errorsEditAction}
                        />
                        <InputBaseComponent
                          type="checkbox"
                          horizontalLabel={true}
                          control={controlEditAction}
                          setValue={setValue}
                          name="isUpdateNotification"
                          label="Chỉnh sửa thông báo"
                          errors={errorsEditAction}
                        />
                        <InputBaseComponent
                          type="checkbox"
                          horizontalLabel={true}
                          control={controlEditAction}
                          setValue={setValue}
                          name="isDeleteNotification"
                          label="Xóa thông báo"
                          errors={errorsEditAction}
                        />
                      </div>
                      <div className="w-1/2 border-2 border-gray-300 rounded-md justify-center px-5 py-2 ">
                        <p className="uppercase font-medium mb-2 primary-color">Hệ thống</p>
                        <InputBaseComponent
                          type="checkbox"
                          horizontalLabel={true}
                          control={controlEditAction}
                          setValue={setValue}
                          name="isUpdateSetting"
                          label="Cài đặt hệ thống"
                          errors={errorsEditAction}
                        />
                        <InputBaseComponent
                          type="checkbox"
                          horizontalLabel={true}
                          control={controlEditAction}
                          setValue={setValue}
                          name="isGetLog"
                          label="Xem lịch sử hoạt động"
                          errors={errors}
                        />
                      </div>
                    </div>
                  </div>
                  <NotifyCheckInfoForm actionText="Hãy kiểm tra kĩ thông tin trước khi cập nhật!" />

                  <div className="mt-5 flex justify-end">
                    <ButtonComponent
                      type="error"
                      action="reset"
                      onClick={() => {
                        resetEditAction();
                        setModalEditOpen(false);
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
