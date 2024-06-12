import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Card, CircularProgress } from "@mui/material";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import MDBox from "components/MDBox";
import Footer from "examples/Footer";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import EditIcon from "@mui/icons-material/Edit";
import CircleNotificationsIcon from "@mui/icons-material/CircleNotifications";

import noDataImage3 from "../../assets/images/noDataImage3.avif";
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
import { useNavigate } from "react-router-dom";

// Notification Management (UolLT)
// Get access token
const accessToken = localStorage.getItem("authToken");

export default function NotificationManagement() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalEditOpen, setModalEditOpen] = useState(false);
  const [modalDeleteOpen, setModalDeleteOpen] = useState(false);
  const [deleteData, setDeleteData] = useState({});
  const [currentData, setCurrentData] = useState([]);
  const [fileThumbnail, setFileThumbnail] = useState(null);
  const navigate = useNavigate();

  const queryClient = useQueryClient();

  // Call API Get all notifications
  const { data, error, isLoading } = useQuery(["notificationState", { accessToken }], () =>
    getAllNotifications(accessToken)
  );
  useEffect(() => {
    if (data?.success) {
      setCurrentData(data?.data);
    }
  }, [data]);

  const handleNotificationDetails = (data) => {
    if (data) {
      navigate(`/notificationDetails/${data[0]}`);
    }
  };

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

  const addNotificationMutation = useMutation(
    (notificationData) => addNotification(accessToken, notificationData),
    {
      onSuccess: (response) => {
        queryClient.invalidateQueries("notificationState");
        if (response && response.success) {
          toast.success("Tạo thông báo thành công!");
        } else {
          toast.error(`${response.data}!`);
        }
        reset();
        setModalOpen(false);
      },
    }
  );

  const handleAddNotification = (data) => {
    const notificationData = {
      title: data.title,
      content: data.content,
      thumbnail: data.thumbnail,
    };
    addNotificationMutation.mutate(notificationData);
  };

  // Call API update notification
  const handleEdit = (rowItem) => {
    if (rowItem) {
      setValue("idEdit", rowItem[0]);
      setValue("nameEdit", rowItem[1]);
      setValue("thumbnailEdit", rowItem[2]);
      setValue("contentEdit", rowItem[6]);
      setFileThumbnail(rowItem[2]);
      setModalEditOpen(true);
    } else {
      setModalEditOpen(false);
    }
  };

  const updateNotificationMutation = useMutation(
    (notificationData) => updateNotification(accessToken, notificationData),
    {
      onSuccess: (response) => {
        queryClient.invalidateQueries("notificationState");
        if (response && response.success) {
          toast.success("Cập nhật thông báo thành công!");
        } else {
          toast.error(`${response.data}!`);
        }
        reset();
        setModalEditOpen(false);
      },
    }
  );

  const handleEditNotification = (data) => {
    const notificationData = {
      id: data.idEdit,
      title: data.nameEdit,
      content: data.contentEdit,
      thumbnail: data.thumbnailEdit,
    };
    updateNotificationMutation.mutate(notificationData);
  };

  const deleteNotificationMutation = useMutation(
    (notificationId) => deleteNotification(accessToken, notificationId),
    {
      onSuccess: (response) => {
        queryClient.invalidateQueries("notificationState");
        if (response && response.success) {
          toast.success("Xóa thông báo thành công!");
        } else {
          toast.error("Xóa thông báo thất bại!");
        }
        setModalDeleteOpen(false);
      },
    }
  );

  const handleDelete = (rowItem) => {
    if (rowItem) {
      setDeleteData({
        id: rowItem[0],
      });
      setModalDeleteOpen(true);
    }
  };

  const handleDeleteAPI = () => {
    deleteNotificationMutation.mutate(deleteData.id);
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
                    <ButtonComponent
                      type="error"
                      action="reset"
                      onClick={() => {
                        reset();
                        setModalOpen(false);
                      }}
                    >
                      HỦY BỎ
                    </ButtonComponent>
                    <ButtonComponent action="submit">
                      <AddCircleOutlineIcon className="mr-1" />
                      TẠO
                    </ButtonComponent>
                  </div>
                </form>
              </PopupComponent>
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
            ) : data?.success ? (
              <TableComponent
                header={[
                  "Tiêu đề",
                  "Ảnh bìa",
                  "Ngày tạo",
                  "Ngày cập nhật",
                  "Người tạo",
                  "Nội dung",
                ]}
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
                onDetails={handleNotificationDetails}
                hiddenColumns={[0]}
                isImage={2}
                className="mt-4"
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

                <div className="flex">
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
                  {fileThumbnail && (
                    <img
                      className="w-24 ml-2 h-24 rounded-md object-cover object-center"
                      src={fileThumbnail}
                      alt="Ảnh bìa"
                    />
                  )}
                </div>
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
                  <ButtonComponent
                    type="error"
                    action="reset"
                    onClick={() => {
                      () => setModalEditOpen(false);
                      resetEditAction();
                    }}
                  >
                    HỦY BỎ
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
