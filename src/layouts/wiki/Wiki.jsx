import { Box, Card, FormControl, Grid, InputLabel, MenuItem, Select } from "@mui/material";
import ButtonComponent from "components/ButtonComponent/ButtonComponent";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DeleteIcon from "@mui/icons-material/Delete";
import SendIcon from "@mui/icons-material/Send";
import Footer from "../../examples/Footer";
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../examples/Navbars/DashboardNavbar";
import { useState } from "react";
import WeeklyTimeTableComponent from "../../components/WeeklyTimeTableComponent/WeeklyTimeTableComponent";
import TableComponent from "../../components/TableComponent/TableCoponent";

const Wiki = () => {
  const logger = () => {
    console.log("clicked me");
  };

  const [age, setAge] = useState("");
  console.log(age);

  const handleChange = (event) => {
    setAge(event.target.value);
  };

  const scoreByStudents = {
    code: 200,
    status: true,
    message: "ok",
    data: [
      {
        id: 1,
        fullName: "Nguyễn Lê Văn A",
        average: 10,
        study: "Giỏi",
        conduct: "Tốt",
        rank: 1,
        scores: [
          { key: "Toán", value: 10 },
          { key: "Vật lí", value: 10 },
          { key: "Hóa học", value: 10 },
          { key: "Sinh học", value: 10 },
          { key: "Tin học", value: 10 },
          { key: "Ngữ Văn", value: 10 },
          { key: "Lịch Sử", value: 10 },
          { key: "Địa lí", value: 10 },
          { key: "Ngoại ngữ", value: 10 },
          { key: "Công nghệ", value: 10 },
          { key: "GDCD", value: 10 },
          { key: "GDQP", value: 10 },
          { key: "Thể dục", value: 10 },
        ],
      },
      {
        id: 2,
        fullName: "Nguyễn Lê Văn A",
        average: 10,
        study: "Giỏi",
        conduct: "Tốt",
        rank: 1,
        scores: [
          { key: "Toán", value: 10 },
          { key: "Vật lí", value: 10 },
          { key: "Hóa học", value: 10 },
          { key: "Sinh học", value: 10 },
          { key: "Tin học", value: 10 },
          { key: "Ngữ Văn", value: 10 },
          { key: "Lịch Sử", value: 10 },
          { key: "Địa lí", value: 10 },
          { key: "Ngoại ngữ", value: 10 },
          { key: "Công nghệ", value: 10 },
          { key: "GDCD", value: 10 },
          { key: "GDQP", value: 10 },
          { key: "Thể dục", value: 10 },
        ],
      },
      {
        id: 3,
        fullName: "Nguyễn Lê Văn A",
        average: 10,
        study: "Giỏi",
        conduct: "Tốt",
        rank: 1,
        scores: [
          { key: "Toán", value: 10 },
          { key: "Vật lí", value: 10 },
          { key: "Hóa học", value: 10 },
          { key: "Sinh học", value: 10 },
          { key: "Tin học", value: 10 },
          { key: "Ngữ Văn", value: 10 },
          { key: "Lịch Sử", value: 10 },
          { key: "Địa lí", value: 10 },
          { key: "Ngoại ngữ", value: 10 },
          { key: "Công nghệ", value: 10 },
          { key: "GDCD", value: 10 },
          { key: "GDQP", value: 10 },
          { key: "Thể dục", value: 10 },
        ],
      },
      // Additional student data...
    ],
  };

  const handleViewDetails = (student) => {
    console.log("View details for student:", student);
    // Implement your logic to view details
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Card>
        <MDBox p={5}>
          <Grid item xs={12} md={6} lg={3}>
            <MDTypography>1. Buttons</MDTypography>
            <ButtonComponent>btn default</ButtonComponent>
            <ButtonComponent type="primary">btn primary</ButtonComponent>
            <ButtonComponent type="success">btn success</ButtonComponent>
            <ButtonComponent type="warning">btn warning</ButtonComponent>
            <ButtonComponent type="error">btn error</ButtonComponent>
            <ButtonComponent type="red">btn red</ButtonComponent>
            <ButtonComponent type="dark">btn dark</ButtonComponent>
            <ButtonComponent type="light">btn light</ButtonComponent>
          </Grid>
          <Grid item xs={12} md={6} lg={3} marginTop={2}>
            <ButtonComponent type="primary" size="sm">
              {" "}
              btn primary sm
            </ButtonComponent>
            <ButtonComponent type="primary" size="md">
              {" "}
              btn primary md
            </ButtonComponent>
            <ButtonComponent type="primary" size="lg">
              {" "}
              btn primary lg
            </ButtonComponent>
          </Grid>
          <Grid item xs={12} md={6} lg={3} marginTop={2}>
            <ButtonComponent type="error" size="md">
              <DeleteIcon className="mr-1" />
              btn icon delete
            </ButtonComponent>
            <ButtonComponent type="success" size="md">
              <SendIcon className="mr-1" />
              btn icon send
            </ButtonComponent>
            <ButtonComponent type="primary" onClick={logger}>
              btn onclick
            </ButtonComponent>
          </Grid>
          <Grid item xs={12} md={6} lg={3} marginTop={2}>
            <MDTypography>2. Drop down</MDTypography>
            <FormControl sx={{ minWidth: 120, marginLeft: "12px" }}>
              <InputLabel id="demo-simple-select-label">Age</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={age}
                className="h-10"
                label="Age"
                onChange={handleChange}
              >
                <MenuItem value={10}>Ten</MenuItem>
                <MenuItem value={20}>Twenty</MenuItem>
                <MenuItem value={30}>Thirty</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6} lg={3} marginTop={2}>
            <MDTypography>3. Table</MDTypography>
            <TableComponent data={scoreByStudents.data} onViewDetails={handleViewDetails} />
          </Grid>
        </MDBox>
      </Card>
      <Footer />
    </DashboardLayout>
  );
};

export default Wiki;
