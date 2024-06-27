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
import { useQuery } from "react-query";
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

const Dashboard = React.memo(() => {
  const [currentPage, setCurrentPage] = useState(1);
  // const [currentData, setCurrentData] = useState([]);
  const itemsPerPage = 20;
  let paginatedData = [],
    totalItems = 0,
    totalPages = 0;
  const navigate = useNavigate();
  const accessToken = localStorage.getItem("authToken");
  // const userRole = localStorage.getItem("userRole");

  // Call API Get all notifications
  const { data, error, isLoading } = useQuery(["notifications", { accessToken }], () =>
    getAllNotifications(accessToken)
  );

  if (data?.success) {
    paginatedData = data?.data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    totalItems = data?.data.length;
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
      <Card className="max-h-max mb-8">
        <MDBox p={5}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <SliderComponent
                sliderImages={[
                  {
                    title: "Trường THPT Nguyễn Việt Hồng",
                    description: "Tự hào trường top!",
                    image: sliderImage1,
                  },
                  {
                    title: "CÔ GIÁO ĐẠT THÀNH TÍCH TRONG CUỘC THI CODE",
                    description: "Chúc mừng cô Mỹ Quyên đã đạt thành tích code dữ!",
                    image: sliderImage3,
                  },
                  {
                    title: "Trường THPT Nguyễn Việt Hồng",
                    description: "Tự hào trường top!",
                    image: sliderImage2,
                  },
                ]}
              />
            </Grid>
          </Grid>

          <Grid container marginTop={10} spacing={2}>
            <div className="w-full text-center font-bold text-base mb-6">
              <p className="animate-pulse uppercase text-2xl primary-color ">
                <HomeWorkIcon className="mb-1 mr-2" />
                TRƯỜNG THPT NGUYỄN VIỆT HỒNG
              </p>
              <p className="mt-4 mx-auto max-w-screen-sm">
                Trường THPT Châu Văn Liêm là một trong những trường có uy tín và chất lượng giáo dục
                hàng đầu tại thành phố Cần Thơ. Với hơn 100 năm kinh nghiệm trong lĩnh vực giáo dục,
                trường đã đào tạo ra nhiều thế hệ học sinh tài năng đem lại đóng góp to lớn cho xã
                hội. Trường gắn bó với định hướng phát triển bền vững, đem lại cho học sinh một môi
                trường học tập và rèn luyện vượt trội. Đội ngũ giáo viên tâm huyết, giàu kinh nghiệm
                và nhiệt tình với nghề giáo, chắp cánh cho học sinh tiến bộ và phát triển trong
                nhiều lĩnh vực.
              </p>
            </div>
            <Grid item xs={12} md={3} className="text-center">
              <p className="text-5xl font-bold primary-color">50+</p>
              <p className="text-lg mt-2 font-medium">GIÁO VIÊN</p>
            </Grid>
            <Grid item xs={12} md={3} className="text-center">
              <p className="text-5xl font-bold primary-color">12+</p>
              <p className="text-lg mt-2 font-medium">TUỔI</p>
            </Grid>
            <Grid item xs={12} md={3} className="text-center">
              <p className="text-5xl font-bold primary-color">98+</p>
              <p className="text-lg mt-2 font-medium">TRÚNG TUYỂN ĐẠI HỌC</p>
            </Grid>
            <Grid item xs={12} md={3} className="text-center">
              <p className="text-5xl font-bold primary-color">20+</p>
              <p className="text-lg mt-2 font-medium">SỰ KIỆN/NĂM</p>
            </Grid>
          </Grid>

          <Grid container marginTop={10}>
            <Grid item xs={12} className="shadow rounded-md">
              <Grid container paddingX={2} paddingY={2}>
                <div className="flex justify-between item-center w-full">
                  <p className="font-bold animate-pulse text-lg">
                    <CircleNotificationsIcon className="mb-1 mr-2" />
                    THÔNG BÁO(NEWS)
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
                ) : data?.success && paginatedData?.length > 0 ? (
                  paginatedData?.map((item, index) => (
                    <Grid key={index} item xs={12} marginTop={1}>
                      <Card sx={{ padding: "12px", marginBottom: "12px" }}>
                        <div className="flex max-[639px]:flex-wrap">
                          <img
                            className="w-40 h-32 object-cover object-right rounded-md max-[639px]:w-full"
                            src={item.thumbnail}
                            alt="Ảnh bìa"
                          />
                          <div className="text-base ml-4 max-[639px]:ml-0 max-[639px]:mt-3">
                            <p className="font-bold uppercase text-blue-500 ">[{item.title}]</p>
                            <p className="max-line-3 text-sm text-color text-justify text-container">
                              {item.content}
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
                <PaginationComponent
                  location="center"
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
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
