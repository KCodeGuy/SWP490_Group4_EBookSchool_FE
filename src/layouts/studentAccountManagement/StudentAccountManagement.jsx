import React, { useState, useEffect } from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import { ToastContainer, toast } from "react-toastify";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { Card, CircularProgress, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import MDBox from "components/MDBox";
import Footer from "examples/Footer";
import { useForm } from "react-hook-form";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import GroupIcon from "@mui/icons-material/Group";
import DownloadIcon from "@mui/icons-material/Download";
import CancelIcon from "@mui/icons-material/Cancel";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import SwapVertIcon from "@mui/icons-material/SwapVert";

import "./style.scss";
import noDataImage3 from "../../assets/images/noDataImage3.avif";
import { nationOptions } from "../../mock/student";
import InputBaseComponent from "../../components/InputBaseComponent/InputBaseComponent";
import PopupComponent from "../../components/PopupComponent/PopupComponent";
import TableComponent from "../../components/TableComponent/TableComponent";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import SearchInputComponent from "../../components/SearchInputComponent/SearchInputComponent";
import { deleteStudent } from "../../services/StudentService";
import { getStudentByID } from "../../services/StudentService";
import { createStudent } from "../../services/StudentService";
import { updateStudent } from "../../services/StudentService";
import { getAllStudents } from "../../services/StudentService";
import NotifyCheckInfoForm from "../../components/NotifyCheckInfoForm";
import { handleDownloadStudentExcel } from "../../services/StudentService";
import { addStudentByExcel } from "../../services/StudentService";
import { isXlsxFile } from "utils/CommonFunctions";

const genderOptions = [
  { label: "Nam", value: "Nam" },
  { label: "Nữ", value: "Nữ" },
];

const sortOptions = [
  { label: "Chưa xài được", value: { index: 0, option: "ASC" } },
  { label: "Mã học sinh(A-Z)", value: { index: 1, option: "ASC" } },
  { label: "Mã học sinh(Z-A)", value: { index: 1, option: "DESC" } },
  { label: "Tên đăng nhập(A-Z)", value: { index: 2, option: "ASC" } },
  { label: "Tên đăng nhập(Z-A)", value: { index: 2, option: "DESC" } },
  { label: "Họ và tên(A-Z)", value: { index: 3, option: "ASC" } },
  { label: "Họ và tên(Z-A)", value: { index: 3, option: "DESC" } },
];

export default function StudentAccountManagement() {
  const accessToken = localStorage.getItem("authToken");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalEditOpen, setModalEditOpen] = useState(false);
  const [modalDeleteOpen, setModalDeleteOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState(0);
  const [accounts, setAccounts] = useState([]);
  const [studentID, setStudentID] = useState();
  const [avatar, setAvatar] = useState(null);
  const queryClient = useQueryClient();
  const [sortOption, setSortOption] = useState(sortOptions[0].value);

  // 1. Get all students
  const { data, error, isLoading } = useQuery(["studentsState", { accessToken }], () =>
    getAllStudents(accessToken)
  );
  useEffect(() => {
    if (data) {
      setAccounts(data);
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

  const addStudentMutationByExcel = useMutation(
    (templateFile) => addStudentByExcel(accessToken, templateFile),
    {
      onSuccess: (response) => {
        queryClient.invalidateQueries("studentsState");
        if (response && response?.status === 200) {
          toast.success("Tạo học sinh thành công!");
          reset();
          setModalOpen(false);
          setAccounts(data);
        } else {
          toast.error(`Tạo học sinh thất bại. Dữ liệu file không đúng định dạng!`);
        }
      },
      onError: (error) => {
        toast.error(`Tạo học sinh thất bại. ${error.message}!`);
      },
    }
  );

  const handleAddAccountByExcel = (data) => {
    if (data && data?.studentFileExcel) {
      if (isXlsxFile(data?.studentFileExcel)) {
        addStudentMutationByExcel.mutate(data?.studentFileExcel);
      } else {
        toast.error(`Tạo tài khoản thất bại! File không đúng định dạng ".xlsx"!`);
      }
    }
  };

  const addStudentMutationManually = useMutation((data) => createStudent(accessToken, data), {
    onSuccess: (response) => {
      queryClient.invalidateQueries("studentsState");
      if (response && response?.status === 200) {
        toast.success("Tạo học sinh thành công!");
        reset();
        setModalOpen(false);
      } else {
        toast.error(`Tạo học sinh thất bại!. ${response?.response?.data}!`);
      }
    },
    onError: (error) => {
      toast.error(`Tạo học sinh thất bại. ${error.message}!`);
    },
  });

  const handleAddStudentManually = (data) => {
    if (data) {
      if (!data.gender || data.gender == "") {
        data.gender = genderOptions[0].value;
      }
      if (!data.nation || data.nation == "") {
        data.nation = nationOptions[0].value;
      }
      addStudentMutationManually.mutate(data);
    }
  };

  // 3. Update API
  const handleEdit = (rowItem) => {
    if (rowItem) {
      setStudentID(rowItem[0]);
      const studentByID = getStudentByID(accessToken, rowItem[0]);
      studentByID.then((result) => {
        setValue("id", result?.id);
        setValue("fullName", result?.fullname);
        setValue("email", result?.email);
        setValue("gender", result?.gender);
        setValue("fatherFullName", result?.fatherFullName);
        setValue("fatherPhone", result?.fatherPhone);
        setValue("fatherProfession", result?.fatherProfession);
        setValue("motherFullName", result?.motherFullName);
        setValue("motherPhone", result?.motherPhone);
        setValue("motherProfession", result?.motherProfession);
        setValue("phone", result?.phone);
        if (result?.birthday) {
          setValue("birthday", result?.birthday.split("T")[0]);
        }
        setValue("birthplace", result?.birthplace);
        setValue("nation", result?.nation);
        setValue("avatar", result?.avatar);
        setValue("address", result?.address);
        setAvatar(result?.avatar);
        if (result) {
          setModalEditOpen(true);
        }
      });
    } else {
      setModalEditOpen(false);
    }
  };

  const updateStudentMutation = useMutation(
    (studentData) => updateStudent(accessToken, studentData),
    {
      onSuccess: (response) => {
        queryClient.invalidateQueries("studentsState");
        if (response) {
          toast.success("Cập nhật học sinh thành công!");
        } else {
          toast.error(`Cập nhật học sinh thất bại. ${response.data}!`);
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
    if (data) {
      updateStudentMutation.mutate(data);
    }
  };

  const deleteStudentMutation = useMutation((studentID) => deleteStudent(accessToken, studentID), {
    onSuccess: (response) => {
      if (response) {
        queryClient.invalidateQueries(["studentsState", { accessToken }]); // Invalidate the getStudents query
        toast.success("Xóa học sinh thành công!");
      } else {
        toast.error("Xóa học sinh thất bại!");
      }
      setModalDeleteOpen(false);
    },
  });

  const handleDelete = (rowItem) => {
    if (rowItem) {
      setStudentID(rowItem[0]);
      setModalDeleteOpen(true);
    }
  };

  const handleDeleteAPI = () => {
    deleteStudentMutation.mutate(studentID);
  };

  const handleChangeSearchValue = (txtSearch) => {
    setAccounts(searchStudent(txtSearch, data));
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

  return (
    <DashboardLayout>
      <ToastContainer autoClose={3000} />
      <DashboardNavbar />
      <Card className="max-h-max mb-5 min-h-full">
        <MDBox p={5}>
          <div className="text-center mt-0 ">
            <div className="flex justify-center items-center text-3xl mx-auto w-full">
              <GroupIcon />
              <h4 className="text-xl font-bold ml-3">QUẢN LÍ HỌC SINH</h4>
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
                <ButtonComponent type="success" onClick={() => {}}>
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
                  description="Tạo tài khoản học sinh"
                  icon={<AddCircleOutlineIcon />}
                  isOpen={modalOpen}
                  onClose={() => setModalOpen(false)}
                  tabs={[{ label: "TẠO TÀI KHOẢN" }, { label: "TẠO BẰNG EXCEL" }]}
                  currentTab={currentTab}
                  onTabChange={(newValue) => {
                    setCurrentTab(newValue);
                  }}
                >
                  {/* Content for Tab 1 */}
                  <div role="tabpanel" hidden={currentTab !== 0}>
                    <form onSubmit={handleSubmit(handleAddStudentManually)}>
                      <div className="flex">
                        <InputBaseComponent
                          type="text"
                          className="w-1/2 mr-2"
                          control={control}
                          name="fullName"
                          placeholder="Nguyễn Văn A"
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
                          placeholder="hsabc123@gmail.com"
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
                            pattern: {
                              value: /^[0-9]{10}$/,
                              message: "Không đúng định dạng!",
                            },
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
                          type="select"
                          className="w-1/2 mr-2"
                          control={control}
                          setValue={noSetValue}
                          name="gender"
                          label="Giới tính"
                          errors={errors}
                          options={genderOptions}
                        />
                        <InputBaseComponent
                          type="select"
                          label="Dân tộc"
                          className="w-1/2"
                          control={control}
                          setValue={noSetValue}
                          name="nation"
                          errors={errors}
                          options={nationOptions}
                        />
                      </div>
                      <div className="flex justify-between">
                        <InputBaseComponent
                          type="text"
                          className="w-1/2 mr-2"
                          control={control}
                          setValue={noSetValue}
                          name="fatherFullName"
                          placeholder="Nguyễn Văn B"
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
                            pattern: {
                              value: /^[0-9]{10}$/,
                              message: "Không đúng định dạng!",
                            },
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
                          placeholder="Lê Thị B"
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
                          placeholder="Nội trợ"
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
                            pattern: {
                              value: /^[0-9]{10}$/,
                              message: "Không đúng định dạng!",
                            },
                          }}
                        />
                      </div>
                      <InputBaseComponent
                        type="text"
                        control={control}
                        setValue={noSetValue}
                        name="birthplace"
                        placeholder="An bình, Ninh kiều, Cần Thơ"
                        label="Nơi sinh"
                        errors={errors}
                        validationRules={{
                          required: "Không được bỏ trống!",
                        }}
                      />
                      <InputBaseComponent
                        type="text"
                        control={control}
                        setValue={noSetValue}
                        name="address"
                        placeholder="600, Nguyễn Văn Cừ (nối dài), An Bình, Ninh Kiều, Cần Thơ"
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
                  <div role="tabpanel" hidden={currentTab == 1}>
                    <ButtonComponent action="button" onClick={() => handleDownloadStudentExcel()}>
                      <DownloadIcon className="mr-2" />
                      TẢI XUỐNG
                    </ButtonComponent>
                    <form onSubmit={handleSubmit(handleAddAccountByExcel)}>
                      <InputBaseComponent
                        name="studentFileExcel"
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
                      <NotifyCheckInfoForm actionText="Hãy kiểm tra kĩ thông tin trước tải lên!" />
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
            ) : data && accounts.length > 0 ? (
              <TableComponent
                header={[
                  "Mã học sinh",
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
                // sortOption={sortOption}
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
              title="CẬP NHẬT TÀI KHOẢN"
              description="Cập nhật tài khoản học sinh"
              icon={<EditIcon />}
              isOpen={modalEditOpen}
              onClose={() => setModalEditOpen(false)}
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
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Email không đúng định dạng!",
                      },
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
                      pattern: {
                        value: /^[0-9]{10}$/,
                        message: "Số điện thoại không đúng định dạng!",
                      },
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
                    type="select"
                    className="w-1/2 mr-2"
                    control={controlEditAction}
                    setValue={setValue}
                    name="gender"
                    placeholder="Nam"
                    label="Giới tính"
                    errors={errorsEditAction}
                    options={genderOptions}
                  />
                  <InputBaseComponent
                    type="select"
                    label="Dân tộc"
                    className="w-1/2"
                    control={controlEditAction}
                    setValue={setValue}
                    name="nation"
                    placeholder="Kinh"
                    errors={errorsEditAction}
                    options={nationOptions}
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
                    placeholder="Nguyễn Văn B"
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
                      pattern: {
                        value: /^[0-9]{10}$/,
                        message: "Số điện thoại không đúng định dạng!",
                      },
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
                    placeholder="Lê Thị B"
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
                    placeholder="Nội trợ"
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
                      pattern: {
                        value: /^[0-9]{10}$/,
                        message: "Số điện thoại không đúng định dạng!",
                      },
                    }}
                  />
                </div>
                <InputBaseComponent
                  type="text"
                  className=""
                  control={controlEditAction}
                  setValue={setValue}
                  name="birthplace"
                  placeholder="An bình, Ninh kiều, Cần Thơ"
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
                  placeholder="600, Nguyễn Văn Cừ (nối dài), An Bình, Ninh Kiều, Cần Thơ"
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
                <NotifyCheckInfoForm actionText="Hãy kiểm tra kĩ thông tin trước khi cập nhật!" />
                <div className="mt-4 flex justify-end">
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
            </PopupComponent>
            <PopupComponent
              title="XÓA TÀI KHOẢN"
              description="Xóa tài khoản học sinh"
              icon={<DeleteIcon />}
              isOpen={modalDeleteOpen}
              onClose={() => {
                setModalDeleteOpen(false);
              }}
            >
              <p className="text-base font-medium">Bạn có chắc chắn muốn xóa tài khoản?</p>
              <div className="mt-4 flex justify-end">
                <ButtonComponent
                  type="error"
                  action="button"
                  onClick={() => {
                    setModalDeleteOpen(false);
                  }}
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
