import {
  Box,
  Button,
  Card,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import ButtonComponent from "components/ButtonComponent/ButtonComponent";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DeleteIcon from "@mui/icons-material/Delete";
import SendIcon from "@mui/icons-material/Send";
import Footer from "../../examples/Footer";
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../examples/Navbars/DashboardNavbar";
import React, { useState } from "react";
import TableMarkAllStudentsComponent from "../../components/TableMarkAllStudentsComponent/TableMarkAllStudentsComponent";
import TableComponent from "../../components/TableComponent/TableComponent";
import SearchComponent from "../../components/SearchComponent/SearchComponent";
import TableMarkOfSubjectComponent from "../../components/TableMarkOfSubjectComponent/TableMarkOfSubjectComponent";
import { scoreByStudentsBySubjectEnlish } from "../../mock/score";
import { countDuplicateItemsInArray } from "utils/CommonFunctions";
import PopupComponent from "../../components/PopupComponent/PopupComponent";
import { useForm, Controller } from "react-hook-form";
import InputBaseComponent from "../../components/InputBaseComponent/InputBaseComponent";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import SearchInputComponent from "components/SearchInputComponent/SearchInputComponent";
import { studentClasses } from "mock/class";
import { subjects } from "mock/subject";
import FilterAltIcon from "@mui/icons-material/FilterAlt";

const schoolYears = [
  {
    schoolYear: "2018",
    fromDate: "2/9/2018",
    toDate: "31/5/2018",
  },
  {
    schoolYear: "2019",
    fromDate: "2/9/2018",
    toDate: "31/5/2019",
  },
  {
    schoolYear: "2020",
    fromDate: "2/9/2018",
    toDate: "31/5/2019",
  },
  {
    schoolYear: "2021",
    fromDate: "2/9/2018",
    toDate: "31/5/2019",
  },
  {
    schoolYear: "2022",
    fromDate: "2/9/2018",
    toDate: "31/5/2019",
  },
  {
    schoolYear: "2023",
    fromDate: "2/9/2018",
    toDate: "31/5/2019",
  },
];
const Wiki = () => {
  const semesters = ["Học kì I", "Học kì II", "Cả năm"];
  const grades = ["Khối 10", "Khối 11", "Khối 12"];
  const logger = () => {
    console.log("clicked me");
  };

  const [schoolYear, setSchoolYear] = React.useState(schoolYears.data[0].schoolYear);
  const handleSchoolYearSelectedChange = (event) => {
    setSchoolYear(event.target.value);
  };

  const [schoolSemester, setSchoolSemester] = React.useState(semesters[0]);
  const handleSchoolSemesterSelectedChange = (event) => {
    setSchoolSemester(event.target.value);
  };

  const [grade, setGrade] = React.useState(grades[0]);
  const handleGradeSelectedChange = (event) => {
    setGrade(event.target.value);
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
    ["Nguyen van", "Doe", "25"],
    ["Nguyen van", "Doe", "25"],
    ["Nguyen van", "Doe", "25"],
    ["Nguyen van", "Doe", "25"],
  ]);

  const [tableDataNoAction, setTableDataNoAction] = useState([
    ["Thông báo : Lịch thi văn nghệ Hội Trại chào mừng 26/3."],
    [
      "Thông báo : Tiết học trải nghiệm địa lí và lịch sử địa phương sẽ được diễn ra vào ngày 30/3.",
    ],
    ["Thông báo : Lịch nghỉ Tết Nguyên Đán Giáp Thìn 2024 chính thức. "],
  ]);

  const handleChecked = (rowItem) => {
    console.log("checked:", rowItem);
    // Implement delete logic here
  };

  const handleDetails = (rowItem) => {
    console.log("Details row:", rowItem);
    // Implement delete logic here
  };

  const {
    control,
    handleSubmit,
    setValue: noSetValue,
    formState: { errors },
  } = useForm();

  const onSubmitDefaultLabel = (data) => {
    console.log(data); // You can do something with the form data here
  };

  const [modalOpen, setModalOpen] = useState(false);

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleStatistic = () => {
    console.log("Call api: ", { schoolYear, grades });
  };

  const [modalIconTitleOpen, setModalIconTitleOpen] = useState(false);

  const handleOpenIconTitleModal = () => {
    setModalIconTitleOpen(true);
  };

  const handleCloseIconTitleModal = () => {
    setModalIconTitleOpen(false);
  };

  const [modal3, setModal3] = useState(false);
  const [modal4, setModal4] = useState(false);

  const handleOpenModal3 = () => {
    setModal3(true);
  };

  const handleCloseModal3 = () => {
    setModal3(false);
  };

  const handleSubmitModal3 = () => {
    setModal3(false);
    // Add logic handle submit
  };

  const handleEdit = (data) => {
    console.log(data);
  };

  const selectOptions = [
    { value: "option1", label: "Option 1" },
    { value: "option2", label: "Option 2" },
    { value: "option3", label: "Option 3" },
  ];

  const radioOptions = [
    { label: "Option 1", value: "option1" },
    { label: "Option 2", value: "option2" },
    { label: "Option 3", value: "option3" },
  ];
  const handleSearchAction = (txtSearch) => {
    console.log("txtSearch: ", txtSearch);
  };

  function Tab1Content() {
    return (
      <div>
        <InputBaseComponent
          placeholder="Enter your email"
          type="email"
          control={control}
          setValue={noSetValue}
          name="input1Tab1"
          label="Email"
          errors={errors}
        />
        <InputBaseComponent
          placeholder="Enter your password"
          type="password"
          control={control}
          setValue={noSetValue}
          name="input2Tab1"
          label="Mật khẩu"
          errors={errors}
        />
        <div className="flex justify-end">
          <ButtonComponent action="button" type="error">
            Cancel
          </ButtonComponent>
          <ButtonComponent action="button">Submit</ButtonComponent>
        </div>
      </div>
    );
  }

  function Tab2Content() {
    return (
      <div>
        <InputBaseComponent
          type="checkbox"
          horizontalLabel={true}
          control={control}
          setValue={noSetValue}
          name="input1Tab2"
          label="Đẹp trai"
          errors={errors}
        />
        <InputBaseComponent
          placeholder="Input horizontal Label"
          type="radio"
          horizontalLabel={true}
          control={control}
          setValue={noSetValue}
          options={radioOptions}
          name="input2Tab2"
          label="Giới tính"
          errors={errors}
        />
        <div className="flex justify-end mt-2">
          <ButtonComponent action="button" type="error">
            Cancel
          </ButtonComponent>
          <ButtonComponent action="button">Submit</ButtonComponent>
        </div>
      </div>
    );
  }

  function Tab3Content() {
    return (
      <div>
        <ol>
          <li>Thông báo : Lịch thi văn nghệ Hội Trại chào mừng 26/3.</li>
          <li>Thông báo : Lịch thi văn nghệ Hội Trại chào mừng 26/3.</li>
          <li>Thông báo : Có ghệ đẹp.</li>
          <li>Thông báo : Rớt môn đồ án.</li>
        </ol>
        <ButtonComponent
          action="button"
          type="success"
          style={{ marginTop: "12px", width: "100%" }}
        >
          Apply
        </ButtonComponent>
      </div>
    );
  }

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
            <MDTypography>1. Select drop down</MDTypography>
            <div className="left mt-8">
              <FormControl sx={{ minWidth: 120, marginBottom: "12px" }}>
                <InputLabel id="select-school-year-lable">Năm học</InputLabel>
                <Select
                  labelId="select-school-year-lable"
                  id="elect-school-year"
                  value={schoolYear}
                  className="h-11 mr-3"
                  label="Năm học"
                  onChange={handleSchoolYearSelectedChange}
                >
                  {schoolYears.data.map((item) => (
                    <MenuItem key={item.schoolYear} value={item.schoolYear}>
                      {item.schoolYear}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl sx={{ minWidth: 120, marginBottom: "12px" }}>
                <InputLabel id="select-semester-lable">Học kì</InputLabel>
                <Select
                  labelId="select-semester-lable"
                  id="select-semester"
                  value={schoolSemester}
                  className="h-11 mr-3"
                  label="Học kì"
                  onChange={handleSchoolSemesterSelectedChange}
                >
                  {semesters.map((item) => (
                    <MenuItem key={item} value={item}>
                      {item}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl sx={{ minWidth: 120, marginBottom: "12px" }}>
                <InputLabel id="select-grade-lable">Khối</InputLabel>
                <Select
                  labelId="select-grade-lable"
                  id="select-grade"
                  value={grade}
                  className="h-11 mr-3"
                  label="Khối"
                  onChange={handleGradeSelectedChange}
                >
                  {grades.map((item) => (
                    <MenuItem key={item} value={item}>
                      {item}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <ButtonComponent
                type="success"
                className="max-[639px]:w-full"
                onClick={handleStatistic}
              >
                <FilterAltIcon className="mr-1" /> Thống kế
              </ButtonComponent>
            </div>
            <MDTypography>2. Drop down, Search</MDTypography>
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
              <SearchInputComponent
                className="mt-4"
                onSearch={handleSearchAction}
                placeHolder="Nhập từ khóa..."
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
              onDetails={handleDetails}
              // onDelete={handleDelete}
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
              className="mt-4 overflow-auto"
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

          <p className="mt-4"></p>
          <MDTypography>4. Popup, form</MDTypography>
          <p className="mt-4">1. Popup basic modal</p>
          <ButtonComponent onClick={handleOpenModal}>Open basic modal</ButtonComponent>
          <PopupComponent title="Modal basic" isOpen={modalOpen} onClose={handleCloseModal}>
            {/* Modal Content */}
            <p className="mt-4">This is modal content</p>
          </PopupComponent>
          <p className="mt-4">2. Popup icon title modal</p>
          <ButtonComponent onClick={handleOpenIconTitleModal}>Open with icon modal</ButtonComponent>
          <PopupComponent
            icon={<DeleteIcon />}
            title="Modal icon basic"
            isOpen={modalIconTitleOpen}
            onClose={handleCloseIconTitleModal}
          >
            {/* Modal Content */}
            <p className="mt-4">This is modal content</p>
          </PopupComponent>
          <p className="mt-4">3. Popup modal with action</p>
          <ButtonComponent onClick={handleOpenModal3}>Open action modal</ButtonComponent>
          <PopupComponent
            title="XÓA LỚP HỌC"
            description="Hãy kiểm xác nhận thông tin trước khi xóa"
            isOpen={modal3}
            onClose={handleCloseModal3}
          >
            <p>Bạn có chắc chắn muốn xóa lớp học?</p>
            <div className="mt-4 flex justify-end">
              <ButtonComponent type="error" action="button" onClick={handleCloseModal3}>
                HỦY BỎ
              </ButtonComponent>
              <ButtonComponent action="button" onClick={handleSubmitModal3}>
                XÓA
              </ButtonComponent>
            </div>
          </PopupComponent>
          <p className="mt-4">4. Popup with tabs</p>
          <ButtonComponent onClick={() => setModal4(true)}>Open tabs popup</ButtonComponent>
          <PopupComponent
            title="Modal tabs"
            isOpen={modal4}
            onClose={() => setModal4(false)}
            tabs={[{ label: "Tab 1" }, { label: "Tab 2" }, { label: "Tab 3" }]}
            description="This is a description."
          >
            <Tab1Content />
            <Tab2Content />
            <Tab3Content />
          </PopupComponent>
          <p className="mt-4 mb-3">2. Form mẫu</p>
          <form onSubmit={handleSubmit(onSubmitDefaultLabel)} className="w-full">
            <Grid container spacing={3}>
              <Grid item xs={12} md={4} marginTop={2}>
                <p className="mt-4 mb-3">2.1. Các loại thẻ input</p>
                <InputBaseComponent
                  placeholder="Enter your email"
                  type="email"
                  control={control}
                  setValue={noSetValue}
                  name="email"
                  label="Email"
                  errors={errors}
                  validationRules={{
                    required: "Không được bỏ trống!",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Email không đúng định dạng!",
                    },
                  }}
                />
                <InputBaseComponent
                  placeholder="Enter your password"
                  type="password"
                  control={control}
                  setValue={noSetValue}
                  name="password"
                  label="Mật khẩu"
                  errors={errors}
                  validationRules={{
                    required: "Không được bỏ trống!",
                    minLength: {
                      value: 10,
                      message: "Mật khẩu ít nhât 8 kí tự!",
                    },
                    maxLength: {
                      value: 20,
                      message: "Mật khẩu nhiều nhất 20 kí tự!",
                    },
                  }}
                />
                <InputBaseComponent
                  placeholder="Enter your phone"
                  type="text"
                  control={control}
                  setValue={noSetValue}
                  name="phone"
                  label="Số điện thoại"
                  errors={errors}
                  validationRules={{
                    required: "Không được bỏ trống!",
                    pattern: {
                      value: /^[0-9]{10}$/,
                      message: "Số điện thoại không đúng định dạng!",
                    },
                  }}
                />
                <InputBaseComponent
                  label="Select"
                  name="selectOption"
                  control={control}
                  type="select"
                  options={selectOptions}
                  setValue={noSetValue}
                  errors={errors}
                />

                <InputBaseComponent
                  type="date"
                  control={control}
                  setValue={noSetValue}
                  name="birdthday"
                  label="Ngày sinh"
                  errors={errors}
                  validationRules={{
                    required: "Không được bỏ trống!",
                  }}
                />

                <InputBaseComponent
                  type="file"
                  control={control}
                  setValue={noSetValue}
                  name="document"
                  label="Chọn file"
                  errors={errors}
                  validationRules={{
                    required: "Không được bỏ trống!",
                  }}
                />
                <InputBaseComponent
                  type="checkbox"
                  horizontalLabel={true}
                  control={control}
                  setValue={noSetValue}
                  name="handsomeBoy"
                  label="Đẹp trai"
                  errors={errors}
                  // validationRules={{
                  //   required: "Phải chọn!",
                  // }}
                />
                <InputBaseComponent
                  placeholder="Input horizontal Label"
                  type="radio"
                  horizontalLabel={true}
                  control={control}
                  setValue={noSetValue}
                  options={radioOptions}
                  name="sex"
                  label="Giới tính"
                  errors={errors}
                  validationRules={{
                    required: "Phải chọn 1 trong các options!",
                  }}
                />
              </Grid>
              <Grid item xs={12} md={4} marginTop={2}>
                <p className="mt-4 mb-3">2.2. Các loại label đi cùng</p>
                <InputBaseComponent
                  placeholder="Nhập địa chỉ"
                  type="text"
                  control={control}
                  setValue={noSetValue}
                  name="address1"
                  label="1. Label đứng(default)"
                  errors={errors}
                  validationRules={{
                    required: "Không được bỏ trống!",
                  }}
                />
                <InputBaseComponent
                  placeholder="Nhập địa chỉ"
                  type="text"
                  horizontalLabel={true}
                  control={control}
                  setValue={noSetValue}
                  name="address2"
                  label="2. Label ngang"
                  errors={errors}
                  validationRules={{
                    required: "Không được bỏ trống!",
                  }}
                />
                <InputBaseComponent
                  placeholder="3. No label"
                  type="text"
                  control={control}
                  setValue={noSetValue}
                  name="address"
                  label="Địa chỉ"
                  errors={errors}
                  noLabel={true}
                  validationRules={{
                    required: "Không được bỏ trống!",
                  }}
                />
              </Grid>
              <Grid item xs={12} md={4} marginTop={2}>
                <p className="mt-4 mb-3">2.3. Custom gọp 2 ô input thành 1 dòng</p>
                <div className="flex">
                  <InputBaseComponent
                    type="date"
                    className="w-1/2 mr-2"
                    control={control}
                    setValue={noSetValue}
                    name="birdthday2"
                    label="Ngày sinh"
                    errors={errors}
                    validationRules={{
                      required: "Không được bỏ trống!",
                    }}
                  />
                  <InputBaseComponent
                    type="date"
                    control={control}
                    className="w-1/2"
                    setValue={noSetValue}
                    name="birdthday3"
                    label="Sinh nhật ghệ"
                    errors={errors}
                    validationRules={{
                      required: "Không được bỏ trống!",
                    }}
                  />
                </div>
              </Grid>
            </Grid>

            <ButtonComponent style={{ marginTop: "12px", width: "100%" }} action="submit">
              Submit
            </ButtonComponent>
          </form>
        </MDBox>
      </Card>
      <Footer />
    </DashboardLayout>
  );
};

export default Wiki;
