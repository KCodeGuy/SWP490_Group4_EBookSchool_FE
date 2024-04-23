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
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  async function fetchData() {
    try {
      const response = await ProductService.getAllProduct();
      setProducts(response.products);
      setIsLoading(false);
    } catch (error) {
      setError(error.message);
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Card>
        <MDBox p={5}>
          <Grid
            display="flex"
            alignItems="top"
            justifyContent="space-between"
            container
            spacing={3}
          >
            <Grid item xs={12} md={6} lg={3}>
              <MDTypography>Manage products</MDTypography>
              <ButtonComponent type="primary"> + Add new</ButtonComponent>
            </Grid>
            <Grid item xs={12} md={6} lg={3}>
              <MDBox mb={1.5}>
                <ComplexStatisticsCard
                  color="dark"
                  icon="weekend"
                  title="Total products"
                  count={products.length}
                  percentage={{
                    color: "success",
                    amount: "+55%",
                    label: "than lask week",
                  }}
                />
              </MDBox>
            </Grid>
          </Grid>
          <Grid container spacing={3} marginTop={3}>
            <Grid item xs={12}>
              <DataTable rows={products} columns={columns} />
            </Grid>
          </Grid>
        </MDBox>
      </Card>
      <Footer />
    </DashboardLayout>
  );
};
export default SchoolBook;
