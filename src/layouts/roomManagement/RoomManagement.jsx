import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import React, { useState } from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { Card } from "@mui/material";
import MDBox from "components/MDBox";
import Footer from "examples/Footer";
import { useForm } from "react-hook-form";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

import "./style.scss";
import { classrooms } from "../../mock/classroom";
import InputBaseComponent from "../../components/InputBaseComponent/InputBaseComponent";
import PopupComponent from "../../components/PopupComponent/PopupComponent";
import TableComponent from "../../components/TableComponent/TableComponent";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import SearchInputComponent from "../../components/SearchInputComponent/SearchInputComponent";

// Room management (UolLT)
export default function RoomManagement() {
  //1. Modal form states open, close
  const [modalOpen, setModalOpen] = useState(false);
  const [modalEditOpen, setModalEditOpen] = useState(false);
  const [modalDeleteOpen, setModalDeleteOpen] = useState(false);
  const [deletedRoom, setDeletedRoom] = useState({});
  const [currentData, setCurrentData] = useState(classrooms.data);

  //2. React-hook-from of adding action
  const {
    control,
    handleSubmit,
    reset,
    setValue: noSetValue,
    formState: { errors },
  } = useForm();

  //3. React-hook-from of editing action
  const {
    control: controlEditAction,
    handleSubmit: handleSubmitEditAction,
    reset: resetEditAction,
    setValue,
    formState: { errors: errorsEditAction },
  } = useForm();

  const handleAddRoom = (data) => {
    console.log("Call API add room: ", data);
    // Call API add room here
  };

  const handleEdit = (rowItem) => {
    if (rowItem) {
      setValue("idEdit", rowItem[0]);
      setValue("nameEdit", rowItem[1]);
      setValue("descriptionEdit", rowItem[2]);
      setModalEditOpen(true);
    } else {
      setModalEditOpen(false);
    }
  };
  const handleEditRoom = (data) => {
    console.log("Call API edit room: ", data);
    // Call API edit room here
  };

  const handleDelete = (rowItem) => {
    if (rowItem) {
      setDeletedRoom({
        idEdit: rowItem[0],
        nameEdit: rowItem[1],
        descriptionEdit: rowItem[2],
      });
      setModalDeleteOpen(true);
    } else {
      setModalDeleteOpen(false);
    }
  };

  const handleDeleteAPI = () => {
    setModalDeleteOpen(false);
    console.log("Call API delete room: ", deletedRoom);
    // Call API delete room here
  };

  const handleChangeSearchValue = (txtSearch) => {
    setCurrentData(filterRooms(txtSearch, classrooms.data));
  };

  const filterRooms = (txtSearch, data) => {
    const search = txtSearch.trim().toLowerCase();
    return data.filter((room) => {
      return (
        room.name.toLowerCase().includes(search) ||
        (room.description && room.description.toLowerCase().includes(search))
      );
    });
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Card className="max-h-max">
        <MDBox p={5}>
          {/* DO NOT DELETE CODE AS ABOVE*/}
          {/* Your code here */}
          <div className="text-center mt-0">
            <h4 className="text-xl font-bold">Quản lý phòng học</h4>
          </div>
          <div className="flex justify-end items-center">
            <SearchInputComponent
              onSearch={handleChangeSearchValue}
              placeHolder="Nhập từ khóa..."
            />
            <div className="ml-3">
              <ButtonComponent onClick={() => setModalOpen(true)}>
                <AddCircleOutlineIcon className="text-3xl mr-1" />
                Tạo phòng học
              </ButtonComponent>
              <PopupComponent
                title="TẠO PHÒNG HỌC"
                description="Hãy tạo phòng học để bắt đầu năm học mới"
                icon={<AddCircleOutlineIcon />}
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
              >
                <form onSubmit={handleSubmit(handleAddRoom)}>
                  <InputBaseComponent
                    placeholder="Nhập tên phòng học"
                    type="text"
                    control={control}
                    setValue={noSetValue}
                    name="name"
                    label="Tên phòng"
                    errors={errors}
                    validationRules={{
                      required: "Không được bỏ trống!",
                    }}
                  />
                  <InputBaseComponent
                    placeholder="Nhập mô tả phòng"
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
                    <ButtonComponent type="error" action="reset" onClick={() => reset()}>
                      CLEAR
                    </ButtonComponent>
                    <ButtonComponent action="submit">TẠO PHÒNG HỌC</ButtonComponent>
                  </div>
                </form>
              </PopupComponent>
            </div>
          </div>
          <div>
            <TableComponent
              header={["ID", "Tên phòng", "Mô tả"]}
              data={currentData.map((item) => [
                item.id.toString(),
                item.name.toString(),
                item.description.toString(),
              ])}
              itemsPerPage={4}
              onEdit={handleEdit}
              onDelete={handleDelete}
              className="mt-4"
            />
            <PopupComponent
              title="CẬP NHẬT"
              description="Hãy chỉnh sửa để bắt đầu năm học mới"
              icon={<EditIcon />}
              isOpen={modalEditOpen}
              onClose={() => setModalEditOpen(false)}
            >
              <form onSubmit={handleSubmitEditAction(handleEditRoom)}>
                <InputBaseComponent
                  placeholder="Nhập tên phòng học"
                  type="text"
                  control={controlEditAction}
                  name="nameEdit"
                  label="Tên phòng"
                  setValue={setValue}
                  errors={errorsEditAction}
                  validationRules={{
                    required: "Không được bỏ trống!",
                  }}
                />
                <InputBaseComponent
                  placeholder="Nhập mô tả phòng"
                  type="text"
                  control={controlEditAction}
                  name="descriptionEdit"
                  label="Mô tả"
                  setValue={setValue}
                  errors={errorsEditAction}
                  validationRules={{
                    required: "Không được bỏ trống!",
                  }}
                />
                <div className="mt-4 flex justify-end">
                  <ButtonComponent type="error" action="reset" onClick={() => resetEditAction()}>
                    CLEAR
                  </ButtonComponent>
                  <ButtonComponent action="submit">CHỈNH SỬA</ButtonComponent>
                </div>
              </form>
            </PopupComponent>
            <PopupComponent
              title="XÓA PHÒNG HỌC"
              description="Hãy kiểm xác nhận thông tin trước khi xóa"
              icon={<DeleteIcon />}
              isOpen={modalDeleteOpen}
              onClose={() => setModalDeleteOpen(false)}
            >
              <p>Bạn có chắc chắn muốn xóa phòng học?</p>
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
