import Grid from "@mui/material/Grid";
import MDBox from "components/MDBox";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import { Card } from "@mui/material";

function Dashboard() {
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Card className="max-h-max">
        <MDBox p={5}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={3}>
              lklskdf
            </Grid>
            <Grid item xs={12} md={6} lg={3}></Grid>
            <Grid item xs={12} md={6} lg={3}></Grid>
            <Grid item xs={12} md={6} lg={3}></Grid>
          </Grid>
        </MDBox>
      </Card>
      <Footer />
    </DashboardLayout>
  );
}

export default Dashboard;
