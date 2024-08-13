import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Card, CircularProgress, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import MDBox from "components/MDBox";
import Footer from "examples/Footer";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import EditIcon from "@mui/icons-material/Edit";
import CancelIcon from "@mui/icons-material/Cancel";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import CircleNotificationsIcon from "@mui/icons-material/CircleNotifications";
import FilterAltIcon from "@mui/icons-material/FilterAlt";

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
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { formatUrlToFile } from "utils/CommonFunctions";
import { getInnerTextInsideHTML } from "utils/CommonFunctions";
import NotifyCheckInfoForm from "components/NotifyCheckInfoForm";
import { isImageFie } from "utils/CommonFunctions";
import { useToasts } from "react-toast-notifications";

// Notification Management (UolLT)
// Get access token
const accessToken = localStorage.getItem("authToken");
const modules = {
  toolbar: [
    [{ header: "1" }, { header: "2" }, { font: [] }],
    [{ size: [] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
    ["link", "image"],
    ["clean"],
  ],
};

export default function NotificationManagement() {
  const { addToast } = useToasts();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalEditOpen, setModalEditOpen] = useState(false);
  const [modalDeleteOpen, setModalDeleteOpen] = useState(false);
  const [deleteData, setDeleteData] = useState({});
  const [currentData, setCurrentData] = useState([]);
  const [fileThumbnail, setFileThumbnail] = useState(null);
  const [contentQuillValue, setContentQuillValue] = useState("");
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  let schoolYearsAPI = JSON.parse(localStorage.getItem("schoolYears"));
  // Function to transform schoolYearsAPI to an array of individual years
  const transformSchoolYears = (years) => {
    const allYears = new Set();
    years.forEach((year) => {
      const [startYear, endYear] = year.split("-");
      allYears.add(parseInt(startYear));
      allYears.add(parseInt(endYear));
    });
    return Array.from(allYears).sort();
  };

  const transformedYears = transformSchoolYears(schoolYearsAPI);

  const [schoolYear, setSchoolYear] = React.useState(transformedYears[transformedYears.length - 1]);

  const handleSchoolYearSelectedChange = (event) => {
    setSchoolYear(event.target.value);
  };

  // Call API Get all notifications
  const { data, error, isLoading } = useQuery(["notificationState", { accessToken }], () =>
    getAllNotifications(accessToken)
  );
  useEffect(() => {
    if (data) {
      setCurrentData(data);
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
        if (response) {
          addToast("Tạo thông báo thành công!", {
            appearance: "success",
          });
        } else {
          addToast(`${response.data}!`, {
            appearance: "error",
          });
        }
        reset();
        setModalOpen(false);
      },
    }
  );

  const handleAddNotification = (data) => {
    const notificationData = {
      title: data.title,
      content: contentQuillValue,
      thumbnail: data.thumbnail,
    };

    const isNotEmptyQuill = contentQuillValue && contentQuillValue !== "<p><br></p>";
    const isImage = isImageFie(data.thumbnail);
    if (!isNotEmptyQuill) {
      addToast(`Nội dung không được bỏ trống!`, {
        appearance: "error",
      });
    } else if (!isImage) {
      addToast(`File không đúng định dạnh hình ảnh!`, {
        appearance: "error",
      });
    } else {
      addNotificationMutation.mutate(notificationData);
    }
  };

  // Call API update notification
  const handleEdit = (rowItem) => {
    if (rowItem) {
      setValue("idEdit", rowItem[0]);
      setValue("nameEdit", rowItem[1]);
      setValue("thumbnailEdit", rowItem[2]);
      setContentQuillValue(rowItem[6]);
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
        if (response && response.status == 200) {
          addToast("Cập nhật thông báo thành công!", {
            appearance: "success",
          });
        } else {
          addToast(`Cập nhật thông báo thất bại! ${response.data}!`, {
            appearance: "error",
          });
        }
        reset();
        setModalEditOpen(false);
      },
      onError: (error) => {
        addToast(`Cập nhật thông báo thất bại!`, {
          appearance: "error",
        });
      },
    }
  );
  const handleEditNotification = async (data) => {
    // Function to fetch an image from a URL and convert it to a File object
    const urlToFile = async (url, filename, mimeType) => {
      const response = await fetch(url);
      const buffer = await response.arrayBuffer();
      return new File([buffer], filename, { type: mimeType });
    };

    // Check if the contentQuillValue is valid
    // if (!contentQuillValue || contentQuillValue === "<p><br></p>")
    //   addToast(`Nội dung không được bỏ trống!`, {
    //     appearance: "error",
    //   });
    //   return;
    // }

    let thumbnailFile;

    try {
      // Check if the thumbnail is a URL or a File object
      if (typeof data.thumbnailEdit === "string") {
        // Convert the thumbnail URL to a File object
        thumbnailFile = await urlToFile(data.thumbnailEdit, "thumbnail.jpg", "image/jpeg");
      } else {
        // Assume it's already a File object
        thumbnailFile = data.thumbnailEdit;
      }

      const notificationData = {
        id: data.idEdit,
        title: data.nameEdit,
        content: contentQuillValue,
        thumbnail: thumbnailFile,
      };
      if (!isImageFie(thumbnailFile)) {
        addToast(`File không đúng định dạnh hình ảnh!`, {
          appearance: "error",
        });
      } else {
        updateNotificationMutation.mutate(notificationData);
      }
      // Call the mutation to update the notification
    } catch (error) {
      addToast(`Có lỗi khi chuyển file: ${error.message}!`, {
        appearance: "error",
      });
    }
  };

  const deleteNotificationMutation = useMutation(
    (notificationId) => deleteNotification(accessToken, notificationId),
    {
      onSuccess: (response) => {
        queryClient.invalidateQueries("notificationState");
        if (response && response.status == 200) {
          addToast(`Xóa thông báo thành công!`, {
            appearance: "success",
          });
        } else {
          addToast(`Xóa thông báo  thất bại!`, {
            appearance: "error",
          });
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
    setCurrentData(filterNotifications(txtSearch, data));
  };

  const filterNotifications = (txtSearch, data) => {
    const search = txtSearch.trim().toLowerCase();
    return data.filter((item) => {
      return (
        (item.title && item.title.toLowerCase().includes(search)) ||
        (item.createAt && item.createAt.toLowerCase().includes(search)) ||
        (item.updateAt && item.updateAt.toLowerCase().includes(search)) ||
        (item.createBy && item.createBy.toLowerCase().includes(search)) ||
        (item.content && item.content.toLowerCase().includes(search))
      );
    });
  };

  const filterByButton = (action, data) => {
    if (data) {
      return data.filter((item) => {
        return (
          item.createAt.toString().includes(action) || item.updateAt.toString().includes(action)
        );
      });
    }
  };

  const handleFilterNotificationByYear = () => {
    setCurrentData(filterByButton(schoolYear, data));
  };
  handleFilterNotificationByYear;

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
          <div className="mt-4 grid max-[693px]:grid-cols-1 md:grid-cols-2 gap-1 max-[693px]:mt-6">
            <div className="flex justify-start max-[639px]:flex-wrap">
              <FormControl sx={{ minWidth: 120 }}>
                <InputLabel id="select-school-year-label">Năm</InputLabel>
                <Select
                  labelId="select-school-year-label"
                  id="select-school-year"
                  value={schoolYear}
                  className="h-10 mr-0"
                  label="Năm"
                  onChange={handleSchoolYearSelectedChange}
                >
                  {transformedYears.map((year, index) => (
                    <MenuItem key={index} value={year}>
                      {year}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <div className="max-[639px]:w-full max-[639px]:ml-0 mt-3 ml-2 sm:mt-0">
                <ButtonComponent
                  className="max-[639px]:w-full"
                  type="success"
                  onClick={handleFilterNotificationByYear}
                >
                  <FilterAltIcon className="mr-1" /> TÌM KIẾM
                </ButtonComponent>
              </div>
            </div>
            <div className="w-full flex justify-end max-[639px]:justify-between items-center mt-3 sm:mt-0 ">
              <SearchInputComponent
                onSearch={handleChangeSearchValue}
                placeHolder="Nhập từ khóa..."
              />

              <div className="ml-3">
                <ButtonComponent
                  onClick={() => {
                    reset();
                    setModalOpen(true);
                    setContentQuillValue("");
                  }}
                >
                  <AddCircleOutlineIcon className="text-3xl mr-1" />
                  TẠO
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

                    <div className="mt-5 max-w-md mb-2">
                      <ReactQuill
                        theme="snow"
                        value={contentQuillValue}
                        onChange={setContentQuillValue}
                        modules={modules}
                        placeholder="Nhập nội dung thông báo..."
                      />
                      {contentQuillValue !== "" || contentQuillValue !== "<p><br></p>" ? (
                        ""
                      ) : (
                        <p className="error-color mt-1 text-base">Không được bỏ trống!</p>
                      )}
                    </div>
                    <NotifyCheckInfoForm actionText="Hãy kiểm tra kĩ trước khi tạo!" />
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
                        <AddCircleOutlineIcon className="mr-1" />
                        TẠO
                      </ButtonComponent>
                    </div>
                  </form>
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
            ) : data ? (
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
                  getInnerTextInsideHTML(item.content.toString()), // Strip HTML tags from content
                ])}
                itemsPerPage={20}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onDetails={handleNotificationDetails}
                hiddenColumns={[0]}
                isImage={2}
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

                <div className="flex max-w-md">
                  <InputBaseComponent
                    type="file"
                    control={controlEditAction}
                    setValue={setValue}
                    name="thumbnailEdit"
                    label="Ảnh bìa"
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
                <div className="mt-5 max-w-md mb-2">
                  <ReactQuill
                    theme="snow"
                    value={contentQuillValue}
                    onChange={setContentQuillValue}
                    modules={modules}
                    placeholder="Nhập nội dung thông báo..."
                  />
                </div>
                <NotifyCheckInfoForm actionText="Hãy kiểm tra kĩ trước khi cập nhật!" />
                <div className="mt-4 flex justify-end">
                  <ButtonComponent
                    type="error"
                    action="reset"
                    onClick={() => {
                      () => setModalEditOpen(false);
                      resetEditAction();
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
