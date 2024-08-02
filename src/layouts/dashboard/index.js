import Grid from "@mui/material/Grid";
import MDBox from "components/MDBox";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import CreateIcon from "@mui/icons-material/Create";
import HomeWorkIcon from "@mui/icons-material/HomeWork";
import CircleNotificationsIcon from "@mui/icons-material/CircleNotifications";
import { Card, CircularProgress } from "@mui/material";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import { useQuery, useQueryClient } from "react-query";
import React, { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import sliderImage1 from "../../assets/images/slider1.png";
import sliderImage2 from "../../assets/images/slider2.png";
import sliderImage3 from "../../assets/images/slider3.png";
import SliderComponent from "../../components/SilderComponent";
import PaginationComponent from "../../components/PaginationComponent/PaginationComponent";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import { getAllNotifications } from "../../services/NotificationService";
import noDataImage3 from "../../assets/images/noDataImage3.avif";
import { getInnerTextInsideHTML } from "utils/CommonFunctions";

const Dashboard = React.memo(() => {
  const [currentPage, setCurrentPage] = useState(1);
  const queryClient = useQueryClient();
  const itemsPerPage = 20;
  const navigate = useNavigate();
  const [schoolSlider1, setSchoolSlider1] = useState(
    localStorage.getItem("schoolSlider1") || sliderImage1
  );

  const [schoolSlider2, setSchoolSlider2] = useState(
    localStorage.getItem("schoolSlider2") || sliderImage2
  );
  const [schoolSlider3, setSchoolSlider3] = useState(
    localStorage.getItem("schoolSlider3") || sliderImage3
  );

  let accessToken, userRole;
  const schoolSetting = JSON.parse(localStorage.getItem("schoolSetting"));
  userRole = localStorage.getItem("userRole");
  if (userRole) {
    accessToken = localStorage.getItem("authToken");
  }

  useEffect(() => {
    let schoolSlider1 = localStorage.getItem("schoolSlider1");
    if (schoolSlider1) {
      setSchoolSlider1(schoolSlider1);
    }
    let schoolSlider2 = localStorage.getItem("schoolSlider2");
    if (schoolSlider2) {
      setSchoolSlider2(schoolSlider2);
    }
    let schoolSlider3 = localStorage.getItem("schoolSlider3");
    if (schoolSlider3) {
      setSchoolSlider3(schoolSlider3);
    }
  }, [schoolSlider1, schoolSlider2, schoolSlider3]);

  // Call API Get all notifications
  const { data, error, isLoading } = useQuery(
    ["notifications", { accessToken }],
    () => getAllNotifications(accessToken),
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      keepPreviousData: true,
    }
  );

  useEffect(() => {
    if (data && accessToken) {
      queryClient.prefetchQuery(["notifications", { accessToken, page: currentPage + 1 }], () =>
        getAllNotifications(accessToken)
      );
    }
  }, [data, accessToken]);

  let paginatedData = [];
  let totalItems = 0;
  let totalPages = 0;

  if (data) {
    paginatedData = data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    totalItems = data.length;
    totalPages = Math.ceil(totalItems / itemsPerPage);
  }

  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
  }, []);

  const handleNotificationDetails = useCallback(
    (id) => {
      if (id) {
        navigate(`/notificationDetails/${id}`);
      }
    },
    [navigate]
  );

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Card className="max-h-max mb-5 min-h-full">
        <MDBox p={5}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <SliderComponent
                sliderImages={[
                  {
                    title: "",
                    description: "",
                    image: schoolSlider1 ? schoolSlider1 : sliderImage1,
                  },
                  {
                    title: "",
                    description: "",
                    image: schoolSlider2 ? schoolSlider2 : sliderImage2,
                  },
                  {
                    title: "",
                    description: "",
                    image: schoolSlider3 ? schoolSlider3 : sliderImage3,
                  },
                ]}
              />
            </Grid>
          </Grid>

          <Grid container marginTop={10} spacing={2}>
            <div className="w-full text-center font-bold text-base mb-6">
              <p className="animate-pulse uppercase text-2xl primary-color ">
                <HomeWorkIcon className="mb-1 mr-2" />
                {schoolSetting?.schoolName || "Trường THPT Nguyễn Việt Hồng"}
              </p>
              <p className="mt-4 mx-auto max-w-screen-sm">
                {schoolSetting?.schoolName || "Trường THPT Nguyễn Việt Hồng"} là một trong những
                trường có uy tín và chất lượng giáo dục hàng đầu tại khu vực. Với hơn nhiều kinh
                nghiệm trong lĩnh vực giáo dục, trường đã đào tạo ra nhiều thế hệ học sinh tài năng
                đem lại đóng góp to lớn cho xã hội. Trường gắn bó với định hướng phát triển bền
                vững, đem lại cho học sinh một môi trường học tập và rèn luyện vượt trội. Đội ngũ
                giáo viên tâm huyết, giàu kinh nghiệm và nhiệt tình với nghề giáo, chắp cánh cho học
                sinh tiến bộ và phát triển trong nhiều lĩnh vực.
              </p>
            </div>
            <Grid item xs={12} md={3} className="text-center">
              <p className="text-5xl font-bold primary-color">20+</p>
              <p className="text-lg mt-2 font-medium">CÁN BỘ NHÂN VIÊN</p>
            </Grid>
            <Grid item xs={12} md={3} className="text-center">
              <p className="text-5xl font-bold primary-color">1000+</p>
              <p className="text-lg mt-2 font-medium">HỌC SINH</p>
            </Grid>
            <Grid item xs={12} md={3} className="text-center">
              <p className="text-5xl font-bold primary-color">90+</p>
              <p className="text-lg mt-2 font-medium">TRÚNG TUYỂN ĐẠI HỌC</p>
            </Grid>
            <Grid item xs={12} md={3} className="text-center">
              <p className="text-5xl font-bold primary-color">100+</p>
              <p className="text-lg mt-2 font-medium">SỰ KIỆN/NĂM</p>
            </Grid>
          </Grid>

          <Grid container marginTop={10}>
            <Grid item xs={12} className="">
              <Grid container paddingX={2} paddingY={2}>
                <div className="flex justify-between item-center w-full">
                  <p className="font-bold animate-pulse text-lg">
                    <CircleNotificationsIcon className="mb-1 mr-2" />
                    THÔNG BÁO
                  </p>
                  <div className="text-sm bg-success-color italic text-white rounded-md px-4 h-7 leading-7 animate-pulse">
                    Mới nhất
                  </div>
                </div>
                {isLoading ? (
                  <div className="text-center primary-color my-10 text-xl italic font-medium">
                    <div className="mx-auto flex items-center justify-center">
                      <p className="mr-3">Loading</p>
                      <CircularProgress size={24} color="inherit" />
                    </div>
                  </div>
                ) : data && paginatedData?.length > 0 ? (
                  paginatedData?.map((item, index) => (
                    <Grid key={index} item xs={12} marginTop={1}>
                      <Card
                        sx={{ padding: "12px", marginBottom: "12px", cursor: "pointer" }}
                        onClick={() => handleNotificationDetails(item.id)}
                        className="hover:bg-slate-100 animation-button"
                      >
                        <div className="flex max-[639px]:flex-wrap">
                          <img
                            className="w-40 h-32 object-cover object-center rounded-md max-[639px]:w-full"
                            src={item.thumbnail}
                            alt="Ảnh bìa"
                          />
                          <div className="flex-1 text-base ml-4 max-[639px]:ml-0 max-[639px]:mt-3">
                            <p className="font-bold uppercase text-blue-500 ">[{item.title}]</p>
                            <p className="max-line-3 text-sm text-color text-justify text-container">
                              {getInnerTextInsideHTML(item.content.toString())}
                            </p>
                            <div className="flex justify-between items-end mt-2 w-full">
                              <p className="font-medium">
                                <EventAvailableIcon className="mr-2" />
                                {item.createAt}
                              </p>
                              <ButtonComponent
                                size="sm"
                                onClick={() => handleNotificationDetails(item.id)}
                              >
                                <CreateIcon className="mr-1 mb-1" />
                                CHI TIẾT
                              </ButtonComponent>
                            </div>
                          </div>
                        </div>
                      </Card>
                    </Grid>
                  ))
                ) : (
                  <div className="text-center primary-color my-10 text-xl italic font-medium w-full">
                    <img
                      className="w-60 h-60 object-cover object-center mx-auto"
                      src={noDataImage3}
                      alt="Chưa có dữ liệu!"
                    />
                    Chưa có dữ liệu!
                  </div>
                )}
                {data && paginatedData?.length > 0 ? (
                  <PaginationComponent
                    location="center"
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                ) : (
                  ""
                )}
              </Grid>
            </Grid>
          </Grid>
        </MDBox>
      </Card>
      <Footer />
    </DashboardLayout>
  );
});

export default Dashboard;
