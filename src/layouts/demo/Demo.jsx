import { Box, Card, Tab, Tabs, Typography } from "@mui/material";
import { BarChart } from "@mui/x-charts";
import ButtonComponent from "components/ButtonComponent/ButtonComponent";
import MDBox from "components/MDBox";
import { TabPanel } from "components/TabPanelComponent";
import TableComponent from "components/TableComponent/TableComponent";
import Footer from "examples/Footer";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import React, { useState } from "react";
import * as XLSX from "xlsx";
import { scoreByStudentsBySubjectEnlish } from "../../mock/score";
import { handleImportData, handleExportData } from "../../utils/CommonFunctions";

export default function Demo() {
  const [value, setValue] = React.useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const [excelData, setExcelData] = useState([]);
  // console.log(excelData);
  const tabLabels = ["Tab 1", "Tab 2", "Tab 3"];
  const data = scoreByStudentsBySubjectEnlish.data.score;

  const handleExport = () => {
    handleExportData(data, "sheetNew", "MyFile");
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Card className="max-h-max">
        <MDBox p={5}>
          <h2 className="text-xl font-bold mb-4">1. Grid layout responsive example</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="h-20 bg-primary-color rounded text-white">01</div>
            <div className="h-20 bg-primary-color rounded text-white">02</div>
            <div className="h-20 bg-primary-color rounded text-white">03</div>
            <div className="h-20 bg-primary-color rounded text-white">04</div>
            <div className="h-20 bg-primary-color rounded text-white">05</div>
            <div className="h-20 bg-primary-color rounded text-white">06</div>
            <div className="h-20 bg-primary-color rounded text-white">07</div>
            <div className="h-20 bg-primary-color rounded text-white">08</div>
          </div>
          {/* <BarChart
            xAxis={[{ scaleType: "band", data: ["group A", "group B", "group C"] }]}
            series={[{ data: [4, 3, 5] }, { data: [1, 6, 3] }, { data: [2, 5, 6] }]}
            width={500}
            height={300}
          /> */}
          <div className="mt-10 w-full">
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="simple tabs example"
              sx={{
                width: "100%",
                textAlign: "left",
                paddingX: 2,
                paddingY: 2,
                overflowWrap: "wrap",
                "& .Mui-selected": {
                  backgroundColor: "#247cd4",
                  color: "white !important",
                  paddingY: 2,
                },
              }}
            >
              {tabLabels.map((item, index) => (
                <Tab
                  sx={{
                    color: "teal", // customize the tab label color
                    "&.Mui-selected": {
                      color: "navy", // customize the tab label color when selected
                    },
                  }}
                  key={index}
                  label={item}
                />
              ))}
            </Tabs>
            <TabPanel value={value} index={0}>
              Tab 1 Content
            </TabPanel>
            <TabPanel value={value} index={1}>
              Tab 2 Content
            </TabPanel>
            <TabPanel value={value} index={2}>
              Tab 3 Content
            </TabPanel>
          </div>

          <div className="mt-10">
            <div>
              <input type="file" onChange={(e) => console.log(e.target.files[0])} />
            </div>

            {excelData.length > 0 ? (
              <TableComponent
                header={["ID", "Full name", "Age", "Gender", "New", "new"]}
                data={excelData}
                onEdit={(data) => console.log(data)}
                onDelete={(data) => console.log(data)}
                className="mt-10"
              />
            ) : (
              <p className="mt-10">Chưa chọn file...!</p>
            )}
            <ButtonComponent className="mt-20" onClick={handleExport}>
              Export data
            </ButtonComponent>
          </div>
        </MDBox>
      </Card>
      <Footer />
    </DashboardLayout>
  );
}
