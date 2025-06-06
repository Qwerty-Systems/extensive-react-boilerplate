import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

export interface SectionData {
  title: string;
  description: string;
  downloadLink: string;
  features: {
    title: string;
    description: string;
  }[];
}

export default function SectionComponent(data: SectionData) {
  return (
    <>
      {/* Hero Section */}
      <Box sx={{ textAlign: "center", mb: 8 }}>
        <Typography variant="h2" component="h1" gutterBottom>
          {data.title}
        </Typography>
        <Typography variant="h5" color="text.secondary">
          {data.description}
        </Typography>
      </Box>

      {/* Features Grid */}
      <Grid container spacing={4}>
        {data.features.map((feature: any, index: any) => (
          <Grid /* xs={12} md={6} lg={4} */ key={index}>
            <Paper sx={{ p: 4, height: "100%" }}>
              <Typography variant="h5" gutterBottom>
                {feature.title}
              </Typography>
              <Typography color="text.secondary">
                {feature.description}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Download CTA */}
      <Box sx={{ mt: 8, textAlign: "center" }}>
        <Button variant="contained" size="large" href={data.downloadLink}>
          Check out the {data.title}
        </Button>
      </Box>
    </>
  );
}
