"use client";
// @mui
import { alpha, useTheme } from "@mui/material/styles";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";

// @third-party
import { motion } from "framer-motion";
import Slider from "react-slick";

// @project
import ContainerWrapper from "@/components/ContainerWrapper";

import { SECTION_COMMON_PY } from "@/utils/constant";
import GraphicsImage from "../GraphicsImage";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

/***************************  CLIENTELE - 3  ***************************/

interface Clientele3Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  clienteleList: Array<Record<string, any>>;
}

export default function Clientele3({ clienteleList }: Clientele3Props) {
  const theme = useTheme();
  // const isLight = theme.palette.mode === "light";
  const settings = {
    autoplay: true,
    arrows: false,
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    swipeToSlide: true,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: theme.breakpoints.values.md,
        settings: { slidesToShow: 4 },
      },
      {
        breakpoint: theme.breakpoints.values.sm,
        settings: { slidesToShow: 2, centerMode: true },
      },
    ],
  };

  const shade = {
    content: `' '`,
    zIndex: 1,
    position: "absolute",
    width: { sm: 60, xs: 40 },
    height: 1,
    top: 0,
    background: `linear-gradient(90deg, ${theme.palette.background.default} -8.54%, ${alpha(theme.palette.background.default, 0)} 100%)`,
    transform: null,
  };

  return (
    <ContainerWrapper
      sx={{ py: SECTION_COMMON_PY /* , background: "#005c24" */ }}
    >
      <Stack sx={{ gap: 2.5 }}>
        <Box
          sx={{
            py: SECTION_COMMON_PY,
            textAlign: "center",
          }}
        >
          <ContainerWrapper>
            <Typography
              variant="h3"
              sx={{
                fontSize: "1.5rem",
                mb: 1,
                color: "#FFC107",
              }}
            >
              Partners in Clean Communities
            </Typography>
          </ContainerWrapper>
        </Box>
        <Box
          sx={{
            position: "relative",
            "&:before": { ...shade, left: 0 },
            "&:after": { ...shade, right: 0, rotate: "180deg" },
          }}
        >
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.5,
              delay: 0.4,
            }}
          >
            <Slider {...settings}>
              {clienteleList.map((item, index) => (
                <Box
                  key={index}
                  sx={{
                    px: { xs: 0.25, sm: 0.5, md: 0.75 },
                    "& svg": {
                      opacity: 0.4,
                      transition: " all 0.5s ease-in-out",
                    },
                    "&:hover svg": {
                      opacity: 1,
                      transition: " all 0.5s ease-in-out",
                    },
                  }}
                >
                  <Chip
                    label={
                      <GraphicsImage
                        image={item.image}
                        nestedChildren={null}
                        sx={{
                          height: { xs: 120, sm: 120, md: 120 },
                          width: "auto",
                          maxWidth: "100%",
                          objectFit: "contain",
                        }}
                        cardMediaProps={{ component: "img" }}
                      />
                    }
                    sx={{
                      bgcolor: "transparent",
                      height: { xs: 40, sm: 46, md: 60 },
                      width: 1,
                      "& .MuiChip-label": { p: 0 },
                    }}
                  />
                </Box>
              ))}
            </Slider>
          </motion.div>
        </Box>
        <Box
          sx={{
            py: SECTION_COMMON_PY,
            textAlign: "center",
          }}
        >
          <ContainerWrapper>
            <Button
              href="/en/sign-up"
              rel="noopener noreferrer"
              variant="contained"
              sx={{
                background: "linear-gradient(45deg, #FFC107, #ffb300)",
                color: "#003d1a",
                textTransform: "uppercase",
                letterSpacing: "1px",
                fontWeight: 700,
                borderRadius: "50px",
                boxShadow: "0 10px 30px rgba(255,193,7,0.4)",
                px: 3,
                py: 1.5,
              }}
            >
              {" "}
              Join us on this journey!
            </Button>
          </ContainerWrapper>
        </Box>
      </Stack>
    </ContainerWrapper>
  );
}
