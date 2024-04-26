import { Box, Button, Card, FormControl, Grid, InputLabel, MenuItem, Select } from "@mui/material";
import ButtonComponent from "components/ButtonComponent/ButtonComponent";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DeleteIcon from "@mui/icons-material/Delete";
import SendIcon from "@mui/icons-material/Send";
import Footer from "../../examples/Footer";
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../examples/Navbars/DashboardNavbar";
import { useState } from "react";
import TableMarkAllStudentsComponent from "../../components/TableMarkAllStudentsComponent/TableMarkAllStudentsComponent";
import TableComponent from "../../components/TableComponent/TableComponent";
import SearchComponent from "../../components/SearchComponent/SearchComponent";
import TableMarkOfSubjectComponent from "../../components/TableMarkOfSubjectComponent/TableMarkOfSubjectComponent";
import { scoreByStudentsBySubjectEnlish } from "../../mock/score";
import { countDuplicateItemsInArray } from "utils/HandleArray";
import PopupComponent from "../../components/PopupComponent/PopupComponent";
import { useForm, Controller } from "react-hook-form";
import InputBaseComponent from "components/InputBaseComponent/InputBaseComponent";
import VpnKeyIcon from "@mui/icons-material/VpnKey";

const Wiki = () => {
  const logger = () => {
    console.log("clicked me");
  };

  const oldArr = scoreByStudentsBySubjectEnlish.data.score[0].scores;
  const result = countDuplicateItemsInArray(oldArr);

  const [age, setAge] = useState("");

  const handleSelectedChange = (event) => {
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
  const [tableData, setTableData] = useState([
    ["Nguyen van", "Doe", "25"],
    ["Le van", "Smith", "30"],
    ["Tran thi", "Smith", "30"],
    ["Quach tuan minh", "Smith", "30"],
    ["Jane", "Smith", "30"],
    ["Dinh minh", "Smith", "30"],
    ["Jane", "Smith", "30"],
    ["Tuan", "Smith", "30"],
    ["Jane", "Smith", "30"],
    ["Admin role", "Smith", "30"],
    ["Admin", "Smith", "30"],
    ["Jane", "Smith", "30"],
    ["Son tung", "Smith", "30"],
    ["Jane", "Smith", "30"],
    ["Den vau", "Smith", "30"],
    ["Phan manh", "Smith", "30"],
    ["Dang tuan", "Smith", "30"],
  ]);

  const [tableDataNoAction, setTableDataNoAction] = useState([
    ["Thông báo : Lịch thi văn nghệ Hội Trại chào mừng 26/3."],
    [
      "Thông báo : Tiết học trải nghiệm địa lí và lịch sử địa phương sẽ được diễn ra vào ngày 30/3.",
    ],
    ["Thông báo : Lịch nghỉ Tết Nguyên Đán Giáp Thìn 2024 chính thức. "],
  ]);

  const handleEdit = (rowItem) => {
    console.log("Edit row:", rowItem);
    // Implement edit logic here
  };

  const handleDelete = (rowItem) => {
    console.log("Delete row:", rowItem);
    // Implement delete logic here
  };

  const handleChecked = (rowItem) => {
    console.log("checked:", rowItem);
    // Implement delete logic here
  };

  const handleDetails = (rowItem) => {
    console.log("Details row:", rowItem);
    // Implement delete logic here
  };

  const handleEnter = (value) => {
    console.log("Value after Enter:", value);
  };

  const handleCancel = (value) => {
    console.log("Cancel:", value);
  };
  const hanldeOK = (value) => {
    console.log("Cancel:", value);
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmitDefaultLabel = (data) => {
    console.log(data); // You can do something with the form data here
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
                onChange={handleSelectedChange}
              >
                <MenuItem value={10}>Ten</MenuItem>
                <MenuItem value={20}>Twenty</MenuItem>
                <MenuItem value={30}>Thirty</MenuItem>
              </Select>
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
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6} lg={3} marginTop={2}>
            <MDTypography>3. Table</MDTypography>
            <p>1. Table component(CRUD, pagging)</p>
            <TableComponent
              header={["Full name", "CC", "Age"]}
              data={tableData}
              onEdit={handleEdit}
              onDelete={handleDelete}
              className="mt-4"
            />
            <p className="mt-4">2. Table component(Checked, pagging)</p>
            <TableComponent
              header={["Full name", "CC", "Age"]}
              data={tableData}
              onCheckboxChange={handleChecked}
              showCheckboxes={true}
              className="mt-4"
            />
            <p className="mt-4">3. Table no action</p>
            <TableComponent
              header={["Nội dung thông báo"]}
              data={tableDataNoAction}
              className="mt-4 text-left"
            />
            <p className="mt-4">4. Table show điểm all học sinh</p>
            <TableMarkAllStudentsComponent
              className="mt-4"
              data={scoreByStudents.data}
              onViewDetails={handleViewDetails}
            />
            <p className="mt-4">5. Table show điểm một môn của cả lớp</p>
            <TableMarkOfSubjectComponent
              header={result}
              data={scoreByStudentsBySubjectEnlish.data.score}
              className="mt-4 text-left"
              onDetails={handleDetails}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={3} marginTop={2}>
            <MDTypography>4. Popup, form</MDTypography>
            <p className="mt-4">1. Popup</p>
            <PopupComponent title="Popup title" onSubmit={hanldeOK}>
              <p>CC</p>
              <p>CC</p>
              <p>CC</p>
            </PopupComponent>
            <p className="mt-4 mb-3">2. Form horizontalLabel</p>
            <form onSubmit={handleSubmit(onSubmitDefaultLabel)} className="w-96">
              <InputBaseComponent
                placeholder="Enter your email"
                type="email"
                control={control}
                name="email"
                errors={errors}
                horizontalLabel={true}
                validationRules={{
                  required: "Email is required!",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email format!",
                  },
                }}
              />
              <InputBaseComponent
                placeholder="Enter your password"
                type="password"
                control={control}
                name="password"
                errors={errors}
                validationRules={{
                  required: "Password is required!",
                  minLength: {
                    value: 8,
                    message: "Password is min length 8!",
                  },
                  maxLength: {
                    value: 20,
                    message: "Password is max length 20",
                  },
                }}
              />
              <InputBaseComponent
                placeholder="Enter your phone"
                type="text"
                control={control}
                name="phone"
                errors={errors}
                validationRules={{
                  required: "Phone is required!",
                  pattern: {
                    value: /^[0-9]{10}$/,
                    message: "Phone is invalid format!",
                  },
                }}
              />
              <InputBaseComponent
                placeholder="Enter your address"
                type="text"
                control={control}
                name="address"
                errors={errors}
                noLabel={true}
                validationRules={{
                  required: "address is required!",
                }}
              />
              <ButtonComponent style={{ marginTop: "12px", width: "100%" }} action="submit">
                Submit
              </ButtonComponent>
            </form>
          </Grid>
        </MDBox>
      </Card>
      <Footer />
    </DashboardLayout>
  );
};

export default Wiki;
