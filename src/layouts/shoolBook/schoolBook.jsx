import MDBox from "components/MDBox";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import DataTable from "components/DataTable/DataTable";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard/index.js";
import MDTypography from "components/MDTypography/index.js";
import Button from "@mui/material/Button";

import * as ProductService from "../../services/ProductService.jsx";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent.jsx";
import Footer from "../../examples/Footer/index.js";
import { studentClasses } from "mock/class";
import { schoolYears } from "mock/schoolYear";
import { registerBooksByWeekly } from "mock/registerBook.js";
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
import { Fullscreen } from "@mui/icons-material";
import SearchComponent from "components/SearchComponent/SearchComponent.jsx";

const columns = [
  { field: "id", headerName: "No.", width: 70 },
  { field: "title", headerName: "Title", width: 130 },
  { field: "description", headerName: "Description", width: 240 },
  {
    field: "price",
    headerName: "Price",
    type: "number",
    width: 90,
  },
  {
    field: "discountPercentage",
    headerName: "Discount",
    type: "number",
    width: 160,
  },
  {
    field: "rating",
    headerName: "Rating",
    type: "number",
    width: 90,
  },
  {
    field: "brand",
    headerName: "Brand",
    width: 90,
  },
  {
    field: "thumbnail",
    headerName: "Thumbnail",
    ype: "image",
    width: 200,
  },
  {
    field: "action",
    headerName: "Action",
    type: "number",
    width: 90,
    sortable: false,
  },
];

const SchoolBook = () => {
  const [schoolYear, setSchoolYear] = React.useState(schoolYears.data[0].schoolYear);
  const handleSchoolYearSelectedChange = (event) => {
    setSchoolYear(event.target.value);
  };

  const [schoolClass, setSchoolClass] = React.useState(studentClasses.data[0].name);
  const handleSchoolClassSelectedChange = (event) => {
    setSchoolClass(event.target.value);
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

  console.log(registerBooksByWeekly.data.detail);

  const handleEnter = () => {
    console.log("data");
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Card>
        <MDBox p={5}>
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

          <FormControl sx={{ minWidth: 120, marginLeft: "12px" }}>
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

          <SearchComponent
            data={[
              { title: "Apple", age: 12 },
              { title: "Banana", age: 11 },
              { title: "ABC", age: 14 },
            ]}
            option="title"
            placeHolder="Search item"
            onEnter={handleEnter}
            className="mt-5"
          />

          <Grid container spacing={2} marginTop={2}>
            {registerBooksByWeekly.data.detail.map((item, index) => (
              <Grid key={index} item xs={12} md={6} lg={3}>
                <Card sx={{ maxWidth: 345, marginBottom: 24 }}>
                  <CardActionArea>
                    <CardMedia
                      className="w-full"
                      component="img"
                      alt="green iguana"
                      height="140"
                      image="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSLFldOLZiLNW91179-8Y1D67r7u68CrFF-Zw&s"
                    />
                    <CardContent>
                      <Typography gutterBottom variant="h5" component="div">
                        {item.weekName}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {item.weekDescription}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                  <CardActions>
                    <ButtonComponent type="primary" size="md" style={{ width: "100%" }}>
                      <SendIcon className="mr-1" />
                      GO TO WEEK
                    </ButtonComponent>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
          {/* */}
        </MDBox>
      </Card>
      <Footer />
    </DashboardLayout>
  );
};
export default SchoolBook;
