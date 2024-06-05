import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Card } from "@mui/material";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import MDBox from "components/MDBox";
import Footer from "examples/Footer";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import EditIcon from "@mui/icons-material/Edit";
import CircleNotificationsIcon from "@mui/icons-material/CircleNotifications";

import InputBaseComponent from "../../components/InputBaseComponent/InputBaseComponent";
import PopupComponent from "../../components/PopupComponent/PopupComponent";
import TableComponent from "../../components/TableComponent/TableComponent";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import SearchInputComponent from "../../components/SearchInputComponent/SearchInputComponent";
import { getAllNotifications } from "../../services/NotificationService";
import {
  addNotification,
  deleteNotification,
  updateNotification,
} from "../../services/NotificationService";

// Notification Management (UolLT)
export default function NotificationManagement() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalEditOpen, setModalEditOpen] = useState(false);
  const [modalDeleteOpen, setModalDeleteOpen] = useState(false);
  const [deleteData, setDeleteData] = useState({});
  const [currentData, setCurrentData] = useState([]);
  const queryClient = useQueryClient();

  // Get access token
  const token = localStorage.getItem("authToken");
  const accessToken = `Bearer ${token}`;

  // Call API Get all notifications
  const { data, error, isLoading } = useQuery(["notificationState", { accessToken }], () =>
    getAllNotifications(accessToken)
  );
  useEffect(() => {
    setCurrentData(data?.data);
  }, [data]);

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

  // Call API add notification
  const addNotificationMutation = useMutation(
    (notificationData) => addNotification(accessToken, notificationData),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("notificationState");
      },
    }
  );

  const handleAddNotification = (data) => {
    const notificationData = {
      title: data.title,
      content: data.content,
      thumbnail: data.thumbnail,
    };
    addNotificationMutation.mutate(notificationData, {
      onSuccess: () => {
        reset();
        setModalOpen(false);
        toast.success("Tạo thông báo thành công!");
      },
    });
  };

  // Call API update notification
  const handleEdit = (rowItem) => {
    if (rowItem) {
      setValue("idEdit", rowItem[0]);
      setValue("nameEdit", rowItem[1]);
      setValue("thumbnailEdit", rowItem[2]);
      setValue("contentEdit", rowItem[6]);
      setModalEditOpen(true);
    } else {
      setModalEditOpen(false);
    }
  };
  const editNotificationMutation = useMutation(
    (notificationData) => updateNotification(accessToken, notificationData),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("notificationState");
      },
    }
  );

  // Call API delete notification
  const handleEditNotification = (data) => {
    const notificationData = {
      id: data.idEdit,
      title: data.nameEdit,
      content: data.contentEdit,
      thumbnail: data.thumbnailEdit,
    };
    editNotificationMutation.mutate(notificationData, {
      onSuccess: () => {
        reset();
        toast.success("Cập nhật thông báo thành công!");
        setModalEditOpen(false);
      },
    });
  };

  const deleteNotificationMutation = useMutation(
    (notificationId) => deleteNotification(accessToken, notificationId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("notificationState");
      },
    }
  );

  const handleDelete = (rowItem) => {
    if (rowItem) {
      setDeleteData({
        id: rowItem[0],
      });
      setModalDeleteOpen(true);
    } else {
      setModalDeleteOpen(false);
    }
  };

  const handleDeleteAPI = () => {
    deleteNotificationMutation.mutate(deleteData.id, {
      onSuccess: () => {
        toast.success("Xóa thông báo thành công!");
        setModalDeleteOpen(false);
      },
    });
  };

  // Handle search function
  const handleChangeSearchValue = (txtSearch) => {
    setCurrentData(filterNotifications(txtSearch, data?.data));
  };

  const filterNotifications = (txtSearch, data) => {
    const search = txtSearch.trim().toLowerCase();
    return data.filter((item) => {
      return (
        (item.title && item.title.toLowerCase().includes(search)) ||
        (item.content && item.content.toLowerCase().includes(search))
      );
    });
  };

  return (
    <DashboardLayout>
      <ToastContainer autoClose={3000} />
      <DashboardNavbar />
      <Card className="min-h-screen mb-8">
        <MDBox p={5}>
          <div className="text-center mt-0 ">
            <div className="flex justify-center items-center text-3xl mx-auto w-full">
              <CircleNotificationsIcon />
              <h4 className="text-xl font-bold ml-3">QUẢN LÍ THÔNG BÁO</h4>
            </div>
          </div>
          <div className="flex justify-end items-center mt-5">
            <SearchInputComponent
              onSearch={handleChangeSearchValue}
              placeHolder="Nhập từ khóa..."
            />
            <div className="ml-3">
              <ButtonComponent onClick={() => setModalOpen(true)}>
                <AddCircleOutlineIcon className="text-3xl mr-1" />
                Tạo
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
                    name="title"
                    label="Tiêu đề"
                    errors={errors}
                    validationRules={{
                      required: "Không được bỏ trống!",
                    }}
                  />
                  <InputBaseComponent
                    type="file"
                    control={control}
                    setValue={noSetValue}
                    name="thumbnail"
                    label="Ảnh bìa"
                    errors={errors}
                    validationRules={{
                      required: "Không được bỏ trống!",
                    }}
                  />
                  <InputBaseComponent
                    className="w-96"
                    name="content"
                    placeholder="Nhập nội dung thông báo"
                    type="textArea"
                    control={control}
                    rowTextArea={6}
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
                    <ButtonComponent action="submit">TẠO</ButtonComponent>
                  </div>
                </form>
              </PopupComponent>
            </div>
          </div>
          <div>
            <TableComponent
              header={["Tiêu đề", "Ảnh bìa", "Ngày tạo", "Ngày cập nhật", "Người tạo", "Nội dung"]}
              data={currentData?.map((item) => [
                item.id.toString(),
                item.title.toString(),
                item.thumbnail.toString(),
                item.createAt.toString(),
                item.updateAt.toString(),
                item.createBy.toString(),
                item.content.toString(),
              ])}
              itemsPerPage={10}
              onEdit={handleEdit}
              onDelete={handleDelete}
              hiddenColumns={[0]}
              isImage={2}
              className="mt-4"
            />
            <PopupComponent
              title="CẬP NHẬT"
              description="Cập nhật thông báo"
              icon={<EditIcon />}
              isOpen={modalEditOpen}
              onClose={() => setModalEditOpen(false)}
            >
              <form onSubmit={handleSubmitEditAction(handleEditNotification)}>
                <InputBaseComponent
                  placeholder="Nhập tiêu đề thông báo"
                  type="text"
                  control={controlEditAction}
                  name="nameEdit"
                  label="Tiêu đề"
                  setValue={setValue}
                  errors={errorsEditAction}
                  validationRules={{
                    required: "Không được bỏ trống!",
                  }}
                />

                <InputBaseComponent
                  placeholder="Chọn file"
                  type="file"
                  control={controlEditAction}
                  name="thumbnailEdit"
                  label="Ảnh bìa"
                  setValue={setValue}
                  errors={errorsEditAction}
                  validationRules={{
                    required: "Không được bỏ trống!",
                  }}
                />
                <InputBaseComponent
                  name="contentEdit"
                  placeholder="Nhập nội dung thông báo"
                  type="textArea"
                  control={controlEditAction}
                  rowTextArea={6}
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
                  <ButtonComponent action="submit">CẬP NHẬT</ButtonComponent>
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
