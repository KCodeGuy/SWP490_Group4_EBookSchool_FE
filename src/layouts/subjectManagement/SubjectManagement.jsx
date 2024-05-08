import React from "react";
import "./style.scss";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { Card, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import MDBox from "components/MDBox";
import Footer from "examples/Footer";
import ButtonComponent from "components/ButtonComponent/ButtonComponent";
import InputBaseComponent from "components/InputBaseComponent/InputBaseComponent";
import TableComponent from "components/TableComponent/TableComponent";
import PopupComponent from "components/PopupComponent/PopupComponent";
import SearchInputComponent from "components/SearchInputComponent/SearchInputComponent";

import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
// Subject management (UolLT)

export default function SubjectManagement() {
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Card className="max-h-max">
        <MDBox p={5}>
          {/* DO NOT DELETE CODE AS ABOVE*/}
          <h4>Subject Management (UolLT)</h4>
          <div className="text-center mt-0">
            <h4 className="text-xl font-bold">Quản lí môn học</h4>
          </div>
          <div className="mt-4 grid sm:grid-cols-1 lg:grid-cols-2 gap-1">
            {/* School Year Select */}
            <div className="flex justify-start max-[639px]:flex-wrap">
              <FormControl sx={{ minWidth: 120, marginRight: "12px" }}>
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
                  title="TẠO MÔN HỌC"
                  description="Hãy tạo môn học để bắt đầu năm học mới"
                  icon={<AddCircleOutlineIcon />}
                  isOpen={modalOpen}
                  onClose={handleCloseAddModal}
                  tabs={[{ label: "Tạo môn" }, { label: "Điểm thành phần" }, { label: "Giáo án" }]}
                  currentTab={currentTab}
                  onTabChange={handleTabChange}
                >
                  {/* Content for Tab 1 */}
                  <div role="tabpanel" hidden={currentTab !== 0}>
                    <form onSubmit={handleSubmit(handleAddSubject)}>
                      <InputBaseComponent
                        placeholder="Nhập tên môn học"
                        type="text"
                        control={control}
                        setValue={noSetValue}
                        name="name"
                        label="Tên môn học"
                        errors={errors}
                        validationRules={{
                          required: "Không được bỏ trống!",
                        }}
                      />
                      <div className="flex">
                        <InputBaseComponent
                          label="Năm học"
                          name="selectYearEdit"
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
                          label="Khối"
                          name="selectGradeEdit"
                          className="w-1/2 mr-2"
                          control={control}
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
                        placeholder="Nhập mô tả môn học"
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
                        <ButtonComponent action="submit">TẠO MÔN HỌC</ButtonComponent>
                      </div>
                    </form>
                  </div>

                  {/* Content for Tab 2 */}
                  <div role="tabpanel" hidden={currentTab == 1}>
                    {/* Form để nhập điểm */}
                    <form onSubmit={handleSubmit(handleAddMark)}>
                      <div className="flex">
                        <InputBaseComponent
                          placeholder="Nhập tên cột điểm"
                          type="text"
                          control={control}
                          setValue={noSetValue}
                          name="nameMark"
                          label="Tên cột điểm"
                          errors={errors}
                          validationRules={{
                            required: "Không được bỏ trống!",
                          }}
                        />
                        <InputBaseComponent
                          placeholder="Nhập số lượng"
                          type="number"
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
                          placeholder="Nhập hệ số"
                          type="number"
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
                        <ButtonComponent action="submit">NHẬP ĐIỂM</ButtonComponent>
                      </div>
                    </form>

                    <TableComponent
                      header={["ID", "Tên cột điểm", "Số lượng", "Hệ số"]}
                      data={currentData.reduce((accumulator, semester) => {
                        if (semester.points && Array.isArray(semester.points)) {
                          const componentPointsData = semester.points.map((componentPoint) => [
                            componentPoint.id.toString(),
                            componentPoint.name.toString(),
                            componentPoint.count.toString(),
                            componentPoint.scoreFactor.toString(),
                          ]);
                          return accumulator.concat(componentPointsData);
                        } else {
                          return accumulator.concat([["", "Không có dữ liệu", "", ""]]);
                        }
                      }, [])}
                      itemsPerPage={4}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      className="mt-8"
                    />
                  </div>
                  {/* Content for Tab 3 */}
                  <div role="tabpanel" hidden={currentTab == 2}>
                    {/* form nhập giáo án*/}
                    <form onSubmit={handleSubmit(handleAddLesson)}>
                      <div className="flex">
                        <InputBaseComponent
                          placeholder="Nhập tên chủ đề"
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
                          placeholder="Nhập mô tả"
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
                        <InputBaseComponent
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
                        <ButtonComponent action="submit">NHẬP GIÁO ÁN</ButtonComponent>
                      </div>
                    </form>
                    <TableComponent
                      header={["ID", "Tên chủ đề", "Mô tả", "Thứ tự"]}
                      data={currentData.reduce((accumulator, lesson) => {
                        if (lesson.lessonPlans && Array.isArray(lesson.lessonPlans)) {
                          const lessonPlansData = lesson.lessonPlans.map((lessonPlan) => [
                            lessonPlan.id.toString(),
                            lessonPlan.title.toString(),
                            lessonPlan.description.toString(),
                            lessonPlan.slot.toString(),
                          ]);
                          return accumulator.concat(lessonPlansData);
                        } else {
                          return accumulator.concat([["", "Không có dữ liệu", "", ""]]);
                        }
                      }, [])}
                      itemsPerPage={4}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      className="mt-8"
                    />
                  </div>
                </PopupComponent>
              </div>
            </div>
          </div>
          <div>
            <TableComponent
              header={["ID", "Tên môn học", "Mô tả"]}
              data={currentData.map((item) => [
                item.id.toString(),
                item.name.toString(),
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
