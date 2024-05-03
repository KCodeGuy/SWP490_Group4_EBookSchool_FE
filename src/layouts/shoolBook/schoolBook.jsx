import MDBox from "components/MDBox";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import FilterAltIcon from "@mui/icons-material/FilterAlt";

import * as ProductService from "../../services/ProductService.jsx";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent.jsx";
import Footer from "../../examples/Footer/index.js";
import { studentClasses } from "mock/class";
import { schoolYears } from "mock/schoolYear";
import { registerBooks } from "../../mock/registerBook.js";
import SendIcon from "@mui/icons-material/Send";

import {
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import SearchInputComponent from "components/SearchInputComponent/SearchInputComponent.jsx";
import PaginationComponent from "components/PaginationComponent/PaginationComponent.jsx";
import TableRegisterBookComponent from "components/TableRegisterBookComponent/index.jsx";

const SchoolBook = () => {
  const schoolWeeks = [
    { id: 1, name: "week 1", startTime: "20/1/2024", endTime: "28/1/2024" },
    { id: 2, name: "week 2", startTime: "20/1/2024", endTime: "28/1/2024" },
    { id: 3, name: "week 3", startTime: "20/1/2024", endTime: "28/1/2024" },
    { id: 4, name: "week 4", startTime: "20/1/2024", endTime: "28/1/2024" },
    { id: 5, name: "week 5", startTime: "20/1/2024", endTime: "28/1/2024" },
    { id: 6, name: "week 6", startTime: "20/1/2024", endTime: "28/1/2024" },
    { id: 7, name: "week 7", startTime: "20/1/2024", endTime: "28/1/2024" },
    { id: 8, name: "week 8", startTime: "20/1/2024", endTime: "28/1/2024" },
    { id: 9, name: "week 9", startTime: "20/1/2024", endTime: "28/1/2024" },
    { id: 10, name: "week 10", startTime: "20/1/2024", endTime: "28/1/2024" },
    { id: 11, name: "week 11", startTime: "20/1/2024", endTime: "28/1/2024" },
    { id: 12, name: "week 12", startTime: "20/1/2024", endTime: "28/1/2024" },
    { id: 13, name: "week 13", startTime: "20/1/2024", endTime: "28/1/2024" },
  ];
  const [schoolYear, setSchoolYear] = React.useState(schoolYears.data[0].schoolYear);
  const handleSchoolYearSelectedChange = (event) => {
    setSchoolYear(event.target.value);
  };

  const [schoolClass, setSchoolClass] = React.useState(studentClasses.data[0].name);
  const handleSchoolClassSelectedChange = (event) => {
    setSchoolClass(event.target.value);
  };

  const [schoolWeek, setSchoolWeek] = React.useState(schoolWeeks[0].name);
  const handleSchoolWeeksSelectedChange = (event) => {
    setSchoolWeek(event.target.value);
  };
  // const [products, setProducts] = useState([]);
  // const [isLoading, setIsLoading] = useState(true);
  // const [error, setError] = useState(null);

  // async function fetchData() {
  //   try {
  //     const response = await ProductService.getAllProduct();
  //     setProducts(response.products);
  //     setIsLoading(false);
  //   } catch (error) {
  //     setError(error.message);
  //     setIsLoading(false);
  //   }
  // }

  // useEffect(() => {
  //   fetchData();
  // }, []);

  const transformedData = [];

  registerBooks.data.detail.forEach((detail) => {
    const date = detail.date;
    const weekDate = detail.weekDate;

    detail.slots.forEach((slot) => {
      const transformedSlot = {
        id: detail.id,
        date: date,
        weekDate: weekDate,
        slot: slot.slot,
        subject: slot.subject,
        teacher: slot.teacher,
        slotByLessonPlans: slot.slotByLessonPlans,
        numberOfAbsent: slot.numberOfAbsent,
        memberAbsent: slot.memberAbsent,
        title: slot.title,
        note: slot.note,
        rating: slot.rating,
      };
      transformedSlot.countSlots = detail.slots.length;
      transformedData.push(transformedSlot);
    });
  });

  console.log(transformedData);

  const handleChangeSearchValue = (txtSearch) => {
    console.log(txtSearch);
  };

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const totalItems = schoolWeeks.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const paginatedData = schoolWeeks.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleViewSlotDetail = (slot) => {
    console.log("Slot: ", slot);
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Card>
        <MDBox p={5}>
          <div className="flex justify-between items-center">
            <div>
              <FormControl sx={{ minWidth: 120 }}>
                <InputLabel id="select-school-year-lable" className="ml-3">
                  Năm học
                </InputLabel>
                <Select
                  labelId="select-school-year-lable"
                  id="elect-school-year"
                  value={schoolYear}
                  className="h-10 mx-3"
                  label="Năm học"
                  onChange={handleSchoolYearSelectedChange}
                >
                  {schoolYears.data.map((item, index) => (
                    <MenuItem key={index} value={item.schoolYear}>
                      {item.schoolYear}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl sx={{ minWidth: 120 }}>
                <InputLabel id="select-school-class-lable" className="ml-3">
                  Lớp
                </InputLabel>
                <Select
                  labelId="select-school-class-lable"
                  id="select-school-class"
                  value={schoolClass}
                  className="h-10 mx-3"
                  label="Lớp"
                  onChange={handleSchoolClassSelectedChange}
                >
                  {studentClasses.data.map((item, index) => (
                    <MenuItem key={index} value={item.name}>
                      {item.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl sx={{ minWidth: 120 }}>
                <InputLabel id="select-school-week-lable" className="ml-3">
                  Tuần
                </InputLabel>
                <Select
                  labelId="select-school-week-lable"
                  id="select-school-class"
                  value={schoolWeek}
                  className="h-10 mx-3"
                  label="Tuần"
                  onChange={handleSchoolWeeksSelectedChange}
                >
                  {schoolWeeks.map((item, index) => (
                    <MenuItem key={index} value={item.name}>
                      {item.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <ButtonComponent type="success">
                <FilterAltIcon className="mr-1" /> Filter
              </ButtonComponent>
            </div>
            <SearchInputComponent
              onSearch={handleChangeSearchValue}
              placeHolder="Nhập từ khóa..."
            />
          </div>
          <Grid container spacing={2} marginTop={2}>
            {paginatedData.map((item, index) => (
              <Grid key={index} item xs={12} md={6} lg={3}>
                <Card sx={{ maxWidth: 345 }}>
                  <CardActionArea>
                    <CardMedia
                      className="w-full"
                      component="img"
                      alt="green iguana"
                      height="140"
                      image="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSLFldOLZiLNW91179-8Y1D67r7u68CrFF-Zw&s"
                    />
                    <CardContent>
                      <h3 className="text-lg font-bold">{item.weekName}</h3>
                      <p className="text-color">{item.weekDescription}</p>
                      <p className="h-5 leading-5 text-color">
                        <CalendarMonthIcon className="mr-1 mb-1" />
                        <span>21/1/2024 - 28/1/2024</span>
                      </p>
                    </CardContent>
                  </CardActionArea>
                  <CardActions>
                    <ButtonComponent type="primary" size="md" style={{ width: "100%" }}>
                      <SendIcon className="mr-1" />
                      CHI TIẾT TUẦN HỌC
                    </ButtonComponent>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
          <PaginationComponent
            location="center"
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
          <TableRegisterBookComponent
            header={[
              "Ngày",
              "Tiết",
              "Môn học",
              "GV bộ môn",
              "Tiết theo môn",
              "Vắng",
              "Nội dung",
              "Nhận xét",
              "Xếp loại",
            ]}
            data={transformedData}
            onDetails={handleViewSlotDetail}
            className="mt-12"
          />
        </MDBox>
      </Card>
      <Footer />
    </DashboardLayout>
  );
};
export default SchoolBook;
