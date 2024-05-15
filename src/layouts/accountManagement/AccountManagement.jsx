import React, { useState } from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { Card, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import MDBox from "components/MDBox";
import Footer from "examples/Footer";
import { useForm } from "react-hook-form";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import FilterAltIcon from "@mui/icons-material/FilterAlt";

import "./style.scss";
import { grades } from "../../mock/grade";
import { subjects, subject } from "../../mock/subject";
import { studentClasses } from "../../mock/class";
import { schoolYears } from "../../mock/schoolYear";
import InputBaseComponent from "../../components/InputBaseComponent/InputBaseComponent";
import PopupComponent from "../../components/PopupComponent/PopupComponent";
import TableComponent from "../../components/TableComponent/TableComponent";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import SearchInputComponent from "../../components/SearchInputComponent/SearchInputComponent";
// Account management (UolLT)
export default function AccountManagement() {
  //1. Modal form states open, close
  const [modalOpen, setModalOpen] = useState(false);
  const [modalEditOpen, setModalEditOpen] = useState(false);
  const [modalDeleteOpen, setModalDeleteOpen] = useState(false);
  const [deletedSubject, setDeletedSubject] = useState({});
  const [currentTab, setCurrentTab] = useState(0);

  const currentSubjects = subjects.data;

  const markFactors = subject.data.points[0].componentPoints.map((obj) => [
    obj.id,
    obj.name,
    obj.count,
    obj.scoreFactor,
    subject.data.points[0].semeaster,
  ]);

  const lessonPlan = subject.data.lessonPlans.map((obj) => [
    obj.id,
    obj.title,
    obj.description,
    obj.slot,
  ]);

  //2. Set data by Call API
  const radioOptions = [
    { label: "Đảng viên", value: "Đảng viên" },
    { label: "Đoàn viên", value: "Đoàn viên" },
  ];

  const roles = ["Giáo viên chủ nhiệm", "Học sinh/Phụ huynh", "Giáo viên bộ môn", "Giám thị"];
  const semesters = ["Học kì I", "Học kì II", "Cả năm"];

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

  const handleAddAccount = (data) => {
    console.log("Call API add subject: ", data);
    // Call API add subject here
  };

  const handleAddInfomation = (data) => {
    console.log("Call API add mark: ", data);
    // Call API add subject here
  };

  const handleAddRole = (data) => {
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
    console.log(rowItem);
    if (rowItem) {
      setValue("idEdit", rowItem[0]);
      setValue("nameEdit", rowItem[1]);
      setValue("selectGradeEdit", rowItem[3]);
      setValue("selectYearEdit", rowItem[2]);
      setValue("descriptionEdit", rowItem[2]);
      setModalEditOpen(true);
    } else {
      setModalEditOpen(false);
    }
  };
  const handleEditSubject = (data) => {
    console.log("Call API edit subject: ", data);
    // Call API edit subject here
  };
  const handleClearEditForm = () => {
    resetEditAction();
  };

  //6. Functions handle deleting
  const handleCloseDeleteModal = () => {
    setModalDeleteOpen(false);
  };

  const handleStatistic = () => {
    console.log("Call api: ", { schoolYear });
  };

  const handleDelete = (rowItem) => {
    if (rowItem) {
      setDeletedSubject({
        idEdit: rowItem[0],
        nameEdit: rowItem[1],
        selectGradeEdit: rowItem[3],
        selectYearEdit: rowItem[2],
        descriptionEdit: rowItem[2],
      });
      setModalDeleteOpen(true);
    } else {
      setModalDeleteOpen(false);
    }
  };

  const handleDeleteAPI = () => {
    setModalDeleteOpen(false);
    console.log("Call API delete subject: ", deletedSubject);
    // Call API delete subject here
  };

  const handleChangeSearchValue = (txtSearch) => {
    console.log(txtSearch);
    setCurrentData(filterSubjects(txtSearch, studentClasses.data));
  };

  const filterSubjects = (txtSearch, data) => {
    const search = txtSearch.trim().toLowerCase();
    return data.filter((subject) => {
      return (
        (subject.title && subject.title.toLowerCase().includes(search)) ||
        (subject.description && subject.description.toLowerCase().includes(search))
      );
    });
  };

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Card className="max-h-max">
        <MDBox p={5}>
          <div className="text-center mt-0">
            <h4 className="text-xl font-bold">Quản lí tài khoản</h4>
          </div>
          <div className="mt-4 grid sm:grid-cols-1 lg:grid-cols-2 gap-1">
            {/* role Select */}
            <div className="flex justify-start max-[639px]:flex-wrap">
              <FormControl sx={{ minWidth: 120, marginRight: "12px" }}>
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
                  Tạo
                </ButtonComponent>
                <PopupComponent
                  title="TẠO TÀI KHOẢN"
                  description="Hãy tạo tài khoản"
                  icon={<AddCircleOutlineIcon />}
                  isOpen={modalOpen}
                  onClose={handleCloseAddModal}
                  tabs={[
                    { label: "TẠO TÀI KHOẢN" },
                    { label: "THÊM THÔNG TIN" },
                    { label: "PHÂN QUYỀN" },
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
                        name="name"
                        label="Tên tài khoản"
                        errors={errors}
                        validationRules={{
                          required: "Không được bỏ trống!",
                        }}
                      />
                      <InputBaseComponent
                        placeholder="Nhập email"
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
                            message: "Email không đúng định dạng!",
                          },
                        }}
                      />
                      <div className="flex">
                        <InputBaseComponent
                          placeholder="Nhập mật khẩu"
                          className="w-1/2 mr-3"
                          type="password"
                          control={control}
                          setValue={noSetValue}
                          name="password"
                          label="Mật khẩu"
                          errors={errors}
                          validationRules={{
                            required: "Không được bỏ trống!",
                          }}
                        />
                        <InputBaseComponent
                          placeholder="Nhập lại mật khẩu"
                          className="w-1/2"
                          type="password"
                          control={control}
                          setValue={noSetValue}
                          name="passwordConfirm"
                          label="Xác nhận mật khẩu"
                          errors={errors}
                          validationRules={{
                            required: "Không được bỏ trống!",
                          }}
                        />
                      </div>
                      <div className="mt-4 flex justify-end">
                        <ButtonComponent type="error" action="reset" onClick={handleClearAddForm}>
                          CLEAR
                        </ButtonComponent>
                        <ButtonComponent action="submit">TẠO TÀI KHOÁN</ButtonComponent>
                      </div>
                    </form>
                  </div>
                  {/* Content for Tab 2 */}
                  <div role="tabpanel" hidden={currentTab == 1}>
                    {/* Form để nhập thêm thông tin */}
                    <form onSubmit={handleSubmit(handleAddInfomation)}>
                      <div className="grid grid-cols-3 gap-4">
                        <InputBaseComponent
                          placeholder="Nhập họ và tên"
                          type="text"
                          control={control}
                          setValue={noSetValue}
                          name="fullName"
                          label="Họ & Tên"
                          errors={errors}
                          validationRules={{ required: "Không được bỏ trống!" }}
                        />
                        <InputBaseComponent
                          placeholder="Nhập email"
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
                              message: "Email không đúng định dạng!",
                            },
                          }}
                        />
                        <InputBaseComponent
                          placeholder="Nhập số điện thoại"
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
                              message: "Số điện thoại không đúng định dạng!",
                            },
                          }}
                        />
                        <InputBaseComponent
                          placeholder="Nhập mã số căn cước"
                          type="text"
                          control={control}
                          setValue={noSetValue}
                          name="citizenIdentification"
                          label="CCCD"
                          errors={errors}
                          validationRules={{ required: "Không được bỏ trống!" }}
                        />
                        <InputBaseComponent
                          placeholder="Nhập ngày sinh"
                          type="date"
                          control={control}
                          setValue={noSetValue}
                          name="birthday"
                          label="Ngày sinh"
                          errors={errors}
                          validationRules={{ required: "Không được bỏ trống!" }}
                        />
                        <InputBaseComponent
                          name="countryside"
                          placeholder="Nhập quê quán"
                          type="textArea"
                          control={control}
                          rowTextArea={1}
                          setValue={noSetValue}
                          label="Quê quán"
                          errors={errors}
                          validationRules={{ required: "Không được bỏ trống!" }}
                        />
                        <InputBaseComponent
                          placeholder="Nhập giới tính"
                          type="text"
                          control={control}
                          setValue={noSetValue}
                          name="gender"
                          label="Giới tính"
                          errors={errors}
                          validationRules={{ required: "Không được bỏ trống!" }}
                        />
                        <InputBaseComponent
                          placeholder="Nhập dân tộc"
                          type="text"
                          control={control}
                          setValue={noSetValue}
                          name="nation"
                          label="Dân tộc"
                          errors={errors}
                          validationRules={{ required: "Không được bỏ trống!" }}
                        />
                        <InputBaseComponent
                          placeholder="Nhập tôn giáo"
                          type="text"
                          control={control}
                          setValue={noSetValue}
                          name="religion"
                          label="Tôn giáo"
                          errors={errors}
                          validationRules={{ required: "Không được bỏ trống!" }}
                        />
                        <InputBaseComponent
                          placeholder="Nhập quốc tịch"
                          type="text"
                          control={control}
                          setValue={noSetValue}
                          name="nationality"
                          label="Quốc tịch"
                          errors={errors}
                          validationRules={{ required: "Không được bỏ trống!" }}
                        />
                        <InputBaseComponent
                          name="insurance"
                          placeholder="Nhập mã BHXH"
                          type="textArea"
                          control={control}
                          rowTextArea={1}
                          setValue={noSetValue}
                          label="BHXH"
                          errors={errors}
                          validationRules={{ required: "Không được bỏ trống!" }}
                        />
                        <InputBaseComponent
                          name="qualification"
                          placeholder="..."
                          type="textArea"
                          control={control}
                          rowTextArea={1}
                          setValue={noSetValue}
                          label="Trình độ chuyên môn"
                          errors={errors}
                          validationRules={{ required: "Không được bỏ trống!" }}
                        />
                        <InputBaseComponent
                          name="politicalTheoretical"
                          placeholder="..."
                          type="textArea"
                          control={control}
                          rowTextArea={1}
                          setValue={noSetValue}
                          label="Trình độ LL chính trị"
                          errors={errors}
                          validationRules={{ required: "Không được bỏ trống!" }}
                        />
                        <InputBaseComponent
                          name="educationalManagement"
                          placeholder="..."
                          type="textArea"
                          control={control}
                          rowTextArea={1}
                          setValue={noSetValue}
                          label="Trình độ QL giáo dục"
                          errors={errors}
                          validationRules={{ required: "Không được bỏ trống!" }}
                        />
                        <InputBaseComponent
                          name="computerSkill"
                          placeholder="..."
                          type="textArea"
                          control={control}
                          rowTextArea={1}
                          setValue={noSetValue}
                          label="Trình độ tin học"
                          errors={errors}
                          validationRules={{ required: "Không được bỏ trống!" }}
                        />
                        <InputBaseComponent
                          name="langue"
                          placeholder="..."
                          type="textArea"
                          control={control}
                          rowTextArea={1}
                          setValue={noSetValue}
                          label="Ngoại ngữ chính"
                          errors={errors}
                          validationRules={{ required: "Không được bỏ trống!" }}
                        />
                        <InputBaseComponent
                          name="id"
                          placeholder="Nhập mã số"
                          type="textArea"
                          control={control}
                          rowTextArea={1}
                          setValue={noSetValue}
                          label="Mã số"
                          errors={errors}
                          validationRules={{ required: "Không được bỏ trống!" }}
                        />
                        <InputBaseComponent
                          placeholder="Nhập trạng thái"
                          type="text"
                          control={control}
                          setValue={noSetValue}
                          name="status"
                          label="Trạng thái"
                          errors={errors}
                          validationRules={{ required: "Không được bỏ trống!" }}
                        />
                        <InputBaseComponent
                          type="radio"
                          horizontalLabel={true}
                          control={control}
                          setValue={noSetValue}
                          options={radioOptions}
                          name="mission"
                          label="Chọn "
                          errors={errors}
                          validationRules={{ required: "Phải chọn 1 trong các options!" }}
                        />
                      </div>
                      <div className="mt-4 flex justify-end">
                        <ButtonComponent type="error" action="reset" onClick={handleClearAddForm}>
                          CLEAR
                        </ButtonComponent>
                        <ButtonComponent action="submit">THÊM THÔNG TIN</ButtonComponent>
                      </div>
                    </form>
                  </div>
                  {/* Content for Tab 3 */}
                  <div role="tabpanel" hidden={currentTab == 2}>
                    {/* phân quyền*/}
                    <form onSubmit={handleSubmit(handleAddRole)}>
                      <div className="flex w-full">
                        {/* Left column */}
                        <div className="w-1/2 mr-3">
                          {/* box trên */}
                          <div className="border-2 border-gray-300 rounded-xl w-full p-5">
                            <InputBaseComponent
                              placeholder="Nhập email"
                              type="textArea"
                              control={control}
                              horizontalLabel={true}
                              setValue={noSetValue}
                              rowTextArea={1}
                              name="email"
                              label="Email"
                              errors={errors}
                              validationRules={{
                                required: "Không được bỏ trống!",
                                pattern: {
                                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                  message: "Email không đúng định dạng!",
                                },
                              }}
                            />
                            <InputBaseComponent
                              placeholder="Nhập họ & tên"
                              type="text"
                              horizontalLabel={true}
                              control={control}
                              setValue={noSetValue}
                              name="name"
                              label="Họ & Tên"
                              errors={errors}
                              validationRules={{
                                required: "Không được bỏ trống!",
                              }}
                            />
                          </div>
                          {/* box dưới */}
                          <div className="border-2 border-gray-300 flex rounded-xl justify-center p-5 mt-5">
                            <FormControl sx={{ minWidth: 120, marginRight: "0px" }}>
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
                          </div>
                        </div>
                        {/* Right column */}
                        <div className="w-1/2">
                          <div className="flex mt-3">
                            {/* Left in right column */}
                            <div className="w-1/2 mr-3">
                              <InputBaseComponent
                                type="checkbox"
                                horizontalLabel={true}
                                control={control}
                                setValue={noSetValue}
                                name="editAttendence"
                                label="Chỉnh sữa điểm danh"
                                errors={errors}
                              />
                              <InputBaseComponent
                                type="checkbox"
                                horizontalLabel={true}
                                control={control}
                                setValue={noSetValue}
                                name="editAttendence"
                                label="Chỉnh sữa báo cáo"
                                errors={errors}
                              />
                              <InputBaseComponent
                                type="checkbox"
                                horizontalLabel={true}
                                control={control}
                                setValue={noSetValue}
                                name="editAttendence"
                                label="Chỉnh sữa điểm số"
                                errors={errors}
                              />
                              <InputBaseComponent
                                type="checkbox"
                                horizontalLabel={true}
                                control={control}
                                setValue={noSetValue}
                                name="editAttendence"
                                label="Chỉnh sữa thời khóa biểu"
                                errors={errors}
                              />
                            </div>
                            {/* Right in right column */}
                            <div className="w-1/2">
                              <InputBaseComponent
                                type="checkbox"
                                horizontalLabel={true}
                                control={control}
                                setValue={noSetValue}
                                name="editAttendence"
                                label="Chỉnh sữa điểm một kì"
                                errors={errors}
                              />
                              <InputBaseComponent
                                type="checkbox"
                                horizontalLabel={true}
                                control={control}
                                setValue={noSetValue}
                                name="changeSlot"
                                label="Chỉnh sữa đổi tiết học"
                                errors={errors}
                              />
                              <InputBaseComponent
                                type="checkbox"
                                horizontalLabel={true}
                                control={control}
                                setValue={noSetValue}
                                name="editAttendence"
                                label="Chỉnh sữa đổi giờ học"
                                errors={errors}
                              />
                              <InputBaseComponent
                                type="checkbox"
                                horizontalLabel={true}
                                control={control}
                                setValue={noSetValue}
                                name="changeSlot"
                                label="Chỉnh sữa tiết học"
                                errors={errors}
                              />
                            </div>
                          </div>
                          <div className="mt-5 flex justify-end">
                            <ButtonComponent
                              type="error"
                              action="reset"
                              onClick={handleClearAddForm}
                            >
                              CLEAR
                            </ButtonComponent>
                            <ButtonComponent action="submit">XÁC NHẬN</ButtonComponent>
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                </PopupComponent>
              </div>
            </div>
          </div>
          <div>
            {/* show data table */}
            <TableComponent
              header={["ID", "Tên tài khoản", "Email", "Địa chỉ"]}
              data={currentSubjects.map((item) => [
                item.id.toString(),
                item.name.toString(),
                item.grade.toString(),
                item.description.toString(),
              ])}
              itemsPerPage={10}
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
              <form onSubmit={handleSubmitEditAction(handleEditSubject)}>
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
                <div className="flex">
                  <InputBaseComponent
                    label="Năm học"
                    name="selectYearEdit"
                    className="w-1/2 mr-2"
                    control={controlEditAction}
                    type="select"
                    options={formattedSchoolYears}
                    setValue={noSetValue}
                    errors={errorsEditAction}
                    validationRules={{
                      required: "Hãy chọn năm học!",
                    }}
                  />
                  <InputBaseComponent
                    label="Khối"
                    name="selectGradeEdit"
                    className="w-1/2 mr-2"
                    control={controlEditAction}
                    setValue={noSetValue}
                    type="select"
                    options={formattedGrades}
                    errors={errors}
                    validationRules={{
                      required: "Hãy chọn khối!",
                    }}
                  />
                </div>
                <InputBaseComponent
                  placeholder="Nhập mô tả"
                  type="text"
                  control={controlEditAction}
                  name="descriptionEdit"
                  label="Nhập mô tả"
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
              title="XÓA MÔN HỌC"
              description="Hãy kiểm xác nhận thông tin trước khi xóa"
              icon={<DeleteIcon />}
              isOpen={modalDeleteOpen}
              onClose={handleCloseDeleteModal}
            >
              <p>Bạn có chắc chắn muốn xóa môn học?</p>
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
