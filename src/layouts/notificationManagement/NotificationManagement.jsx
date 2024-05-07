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
import { notifications } from "../../mock/notification";
import InputBaseComponent from "../../components/InputBaseComponent/InputBaseComponent";
import PopupComponent from "../../components/PopupComponent/PopupComponent";
import TableComponent from "../../components/TableComponent/TableComponent";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import SearchInputComponent from "../../components/SearchInputComponent/SearchInputComponent";

// Notification Management (UolLT)
export default function NotificationManagement() {
  // Modal form states open, close
  const [modalOpen, setModalOpen] = useState(false);
  const [modalEditOpen, setModalEditOpen] = useState(false);
  const [modalDeleteOpen, setModalDeleteOpen] = useState(false);
  const [deletedNotification, setDeletedNotification] = useState({});
  const [currentData, setCurrentData] = useState(notifications.data);

  // React-hook-form for adding action
  const {
    control,
    handleSubmit,
    reset,
    setValue: noSetValue,
    formState: { errors },
  } = useForm();

  // React-hook-form for editing action
  const {
    control: controlEditAction,
    handleSubmit: handleSubmitEditAction,
    reset: resetEditAction,
    setValue,
    formState: { errors: errorsEditAction },
  } = useForm();

  const handleAddNotification = (data) => {
    console.log("Call API add notification: ", data);
    // Call API add notification here
  };

  const handleEdit = (rowItem) => {
    if (rowItem) {
      setValue("idEdit", rowItem[0]);
      setValue("nameEdit", rowItem[1]);
      setValue("startDateEdit", rowItem[2]);
      setValue("endDateEdit", rowItem[3]);
      setValue("contentEdit", rowItem[4]);
      setModalEditOpen(true);
    } else {
      setModalEditOpen(false);
    }
  };
  const handleEditNotification = (data) => {
    console.log("Call API edit notification: ", data);
    // Call API edit notification here
  };

  const handleDelete = (rowItem) => {
    if (rowItem) {
      setDeletedNotification({
        idEdit: rowItem[0],
        nameEdit: rowItem[1],
        startDateEdit: rowItem[2],
        endDateEdit: rowItem[3],
        contentEdit: rowItem[4],
      });
      setModalDeleteOpen(true);
    } else {
      setModalDeleteOpen(false);
    }
  };

  const handleDeleteAPI = () => {
    setModalDeleteOpen(false);
    console.log("Call API delete notification: ", deletedNotification);
    // Call API delete notification here
  };

  const handleChangeSearchValue = (txtSearch) => {
    setCurrentData(filterNotifications(txtSearch, notifications.data));
  };

  const filterNotifications = (txtSearch, data) => {
    const search = txtSearch.trim().toLowerCase();
    return data.filter((notification) => {
      return (
        (notification.title && notification.title.toLowerCase().includes(search)) ||
        (notification.content && notification.content.body.toLowerCase().includes(search))
      );
    });
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Card className="h-screen">
        <MDBox p={5}>
          <div className="text-center mt-0">
            <h4 className="text-xl font-bold">Quản lý thông báo</h4>
          </div>
          <div className="flex justify-end items-center">
            <SearchInputComponent
              onSearch={handleChangeSearchValue}
              placeHolder="Nhập từ khóa..."
            />
            <div className="ml-3">
              <ButtonComponent onClick={() => setModalOpen(true)}>
                <AddCircleOutlineIcon className="text-3xl mr-1" />
                Tạo thông báo
              </ButtonComponent>
              <PopupComponent
                title="TẠO THÔNG BÁO"
                description="Tạo thông báo cho năm học"
                icon={<AddCircleOutlineIcon />}
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
              >
                <form onSubmit={handleSubmit(handleAddNotification)}>
                  <InputBaseComponent
                    placeholder="Nhập tên thông báo"
                    type="text"
                    control={control}
                    setValue={noSetValue}
                    name="name"
                    label="Tên thông báo"
                    errors={errors}
                    validationRules={{
                      required: "Không được bỏ trống!",
                    }}
                  />
                  <div className="flex">
                    <InputBaseComponent
                      type="date"
                      className="w-1/2 mr-2"
                      control={control}
                      setValue={noSetValue}
                      name="startdate"
                      label="Ngày tạo"
                      errors={errors}
                      validationRules={{
                        required: "Không được bỏ trống!",
                      }}
                    />
                    <InputBaseComponent
                      type="date"
                      control={control}
                      className="w-1/2"
                      setValue={noSetValue}
                      name="enddate"
                      label="Ngày kết thúc"
                      errors={errors}
                      validationRules={{
                        required: "Không được bỏ trống!",
                      }}
                    />
                  </div>
                  <InputBaseComponent
                    name="content"
                    placeholder="Nhập nội dung thông báo"
                    type="textArea"
                    control={control}
                    rowTextArea={2}
                    setValue={noSetValue}
                    label="Nội dung"
                    errors={errors}
                    validationRules={{
                      required: "Không được bỏ trống!",
                    }}
                  />
                  <div className="mt-4 flex justify-end">
                    <ButtonComponent type="error" action="reset" onClick={() => reset()}>
                      CLEAR
                    </ButtonComponent>
                    <ButtonComponent action="submit">TẠO THÔNG BÁO</ButtonComponent>
                  </div>
                </form>
              </PopupComponent>
            </div>
          </div>
          <div>
            <TableComponent
              header={["ID", "Tên thông báo", "Ngày tạo", "Ngày kết thúc", "Nội dung"]}
              data={currentData.map((item) => [
                item.id.toString(),
                item.title.toString(),
                item.startDate.toString(),
                item.endDate.toString(),
                item.content.body.toString(),
              ])}
              itemsPerPage={4}
              onEdit={handleEdit}
              onDelete={handleDelete}
              className="mt-4"
            />
            <PopupComponent
              title="CẬP NHẬT"
              description="Chỉnh sửa thông báo"
              icon={<EditIcon />}
              isOpen={modalEditOpen}
              onClose={() => setModalEditOpen(false)}
            >
              <form onSubmit={handleSubmitEditAction(handleEditNotification)}>
                <InputBaseComponent
                  placeholder="Nhập tên thông báo"
                  type="text"
                  control={controlEditAction}
                  name="nameEdit"
                  label="Tên thông báo"
                  setValue={setValue}
                  errors={errorsEditAction}
                  validationRules={{
                    required: "Không được bỏ trống!",
                  }}
                />
                <div className="flex">
                  <InputBaseComponent
                    type="date"
                    className="w-1/2 mr-2"
                    control={controlEditAction}
                    setValue={setValue}
                    name="startDateEdit"
                    label="Ngày tạo"
                    errors={errorsEditAction}
                    validationRules={{
                      required: "Không được bỏ trống!",
                    }}
                  />
                  <InputBaseComponent
                    type="date"
                    control={controlEditAction}
                    className="w-1/2"
                    setValue={setValue}
                    name="endDateEdit"
                    label="Ngày kết thúc"
                    errors={errorsEditAction}
                    validationRules={{
                      required: "Không được bỏ trống!",
                    }}
                  />
                </div>
                <InputBaseComponent
                  name="contentEdit"
                  placeholder="Nhập nội dung thông báo"
                  type="textArea"
                  control={controlEditAction}
                  rowTextArea={2}
                  setValue={setValue}
                  label="Nội dung"
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
              title="XÓA THÔNG BÁO"
              description="Hãy kiểm xác nhận thông tin trước khi xóa"
              icon={<DeleteIcon />}
              isOpen={modalDeleteOpen}
              onClose={() => setModalDeleteOpen(false)}
            >
              <p>Bạn có chắc chắn muốn xóa thông báo?</p>
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
