import { Card } from "@mui/material";
import MDBox from "components/MDBox";
import Footer from "examples/Footer";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import React from "react";
import { notification } from "../../mock/notification";
import sliderImage1 from "../../assets/images/slider2.png";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import { getNotificationByID } from "../../services/NotificationService";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "react-query";
import ButtonComponent from "components/ButtonComponent/ButtonComponent";

export default function NotificationDetails() {
  // Get access token
  const accessToken = localStorage.getItem("authToken");
  const permissions = localStorage.getItem("permissions");
  const schoolSetting = JSON.parse(localStorage.getItem("schoolSetting"));
  const { notificationID } = useParams();
  const { data, error, isLoading } = useQuery(["notificationDetails", { accessToken }], () =>
    getNotificationByID(accessToken, notificationID)
  );
  const navigate = useNavigate();

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Card className="max-h-max mb-5 min-h-full">
        <MDBox p={5}>
          {isLoading ? (
            <div>Loading...</div>
          ) : (
            <div className="text-center mt-5 text-base">
              <div className="flex justify-between max-[639px]:flex-wrap">
                <div className="flex items-baseline ">
                  <h4 className="text-xl font-bold uppercase max-[639px]:mb-2">[{data?.title}]</h4>
                  <div className="text-sm bg-success-color italic text-white rounded-md px-2 ml-4 h-5 leading-5 animate-new transition-all max-[639px]:hidden ">
                    Mới nhất
                  </div>
                </div>
                <div className="flex items-baseline max-[639px]:mt-2">
                  <p className="font-bold">
                    <EventAvailableIcon className="mr-2" />
                    {data?.createAt}
                  </p>
                  {permissions.includes("Add Notification") && (
                    <>
                      <span className="mx-2">|</span>
                      <ButtonComponent
                        size="sm"
                        onClick={() => navigate("/notificationManagement")}
                      >
                        Trở về quản lí
                      </ButtonComponent>
                    </>
                  )}
                  <div className="sm:hidden text-sm bg-success-color italic text-white rounded-md px-2 ml-4 h-5 leading-5 animate-new transition-all max-[639px]:block ">
                    Mới nhất
                  </div>
                </div>
              </div>
              <div className="w-full text-center">
                <img
                  className="mt-8 rounded-md mx-auto w-full h-full"
                  src={data?.thumbnail}
                  alt="Ảnh thông báo"
                />
                <p className="mt-4 italic font-medium">Ảnh: {data?.title}</p>
              </div>
              <div
                className="w-full text-left mt-5"
                dangerouslySetInnerHTML={{ __html: data?.content }}
              ></div>
              <div className="flex mt-5 font-medium justify-end ">
                <span>{schoolSetting?.schoolName}</span>
                <span className="mx-2 max-[639px]:mx-0.5">|</span>
                <span>{data?.createBy}</span>
              </div>
            </div>
          )}
        </MDBox>
      </Card>
      <Footer />
    </DashboardLayout>
  );
}
