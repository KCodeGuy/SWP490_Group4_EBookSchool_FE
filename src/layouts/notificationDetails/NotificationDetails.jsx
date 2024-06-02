import { Card } from "@mui/material";
import MDBox from "components/MDBox";
import Footer from "examples/Footer";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import React from "react";
import { notification } from "../../mock/notification";
import sliderImage1 from "../../assets/images/slider2.png";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";

export default function NotificationDetails() {
  const { data } = notification;
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Card className="max-h-max mb-8">
        <MDBox p={5}>
          <div className="text-center mt-5 text-base">
            <div className="flex justify-between max-[639px]:flex-wrap">
              <div className="flex items-baseline ">
                <h4 className="text-xl font-bold uppercase">[{data.title}]</h4>
                <div className="text-sm bg-success-color italic text-white rounded-md px-2 ml-4 h-5 leading-5 animate-new transition-all max-[639px]:hidden ">
                  Mới nhất
                </div>
              </div>
              <div className="flex items-baseline max-[639px]:mt-2">
                <p>
                  <EventAvailableIcon className="mr-2" />
                  {data.startDate}
                </p>
                <div className="sm:hidden text-sm bg-success-color italic text-white rounded-md px-2 ml-4 h-5 leading-5 animate-new transition-all max-[639px]:block ">
                  Mới nhất
                </div>
              </div>
            </div>
            <div className="w-full text-center">
              <img
                className="mt-8 rounded-md mx-auto w-full h-96 object-cover"
                src={sliderImage1}
                alt="Ảnh thông báo"
              />
              <p className="mt-4 italic font-medium">Ảnh: {data.title}</p>
            </div>
            <p className="mt-5 text-justify italic">
              Trường THPT Châu Văn Liêm là một trong những trường có uy tín và chất lượng giáo dục
              hàng đầu tại thành phố Cần Thơ. Với hơn 100 năm kinh nghiệm trong lĩnh vực giáo dục,
              trường đã đào tạo ra nhiều thế hệ học sinh tài năng đem lại đóng góp to lớn cho xã
              hội. Trường gắn bó với định hướng phát triển bền vững, đem lại cho học sinh một môi
              trường học tập và rèn luyện vượt trội. Đội ngũ giáo viên tâm huyết, giàu kinh nghiệm
              và nhiệt tình với nghề giáo, chắp cánh cho học sinh tiến bộ và phát triển trong nhiều
              lĩnh vực. Trường THPT Châu Văn Liêm là một trong những trường có uy tín và chất lượng
              giáo dục hàng đầu tại thành phố Cần Thơ. Với hơn 100 năm kinh nghiệm trong lĩnh vực
              giáo dục, trường đã đào tạo ra nhiều thế hệ học sinh tài năng đem lại đóng góp to lớn
              cho xã hội. Trường gắn bó với định hướng phát triển bền vững, đem lại cho học sinh một
              môi trường học tập và rèn luyện vượt trội.
            </p>
            <div className="flex mt-5 font-medium justify-end">
              <span>Trường THPT Nguyễn Văn A</span>
              <span className="mx-2">|</span>
              <span>Ban truyền thông</span>
            </div>
          </div>
        </MDBox>
      </Card>
      <Footer />
    </DashboardLayout>
  );
}
