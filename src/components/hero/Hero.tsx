"use client";

import { JSX, useEffect, useRef, useState } from "react";

// @mui
/* import Button from "@mui/material/Button"; */
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

// @third-party
import { motion, useScroll, useTransform } from "framer-motion";

// @project
/* import ButtonAnimationWrapper from "@/components/ButtonAnimationWrapper"; */
import GraphicsCard from "@/components/cards/GraphicsCard";
import ContainerWrapper from "@/components/ContainerWrapper";

import ButtonAnimationWrapper from "../ButtonAnimationWrapper";
import Button from "@mui/material/Button";
/* import SvgIcon from "@mui/material/SvgIcon"; */

// threshold - adjust threshold as needed
const options = { root: null, rootMargin: "0px", threshold: 0.6 };

/***************************  HERO - 17  ***************************/

interface ChipType {
  label: string | JSX.Element;
}

export default function Hero({
  chip,
  headLine,
  captionLine,
  primaryBtn,
  videoSrc,
  videoThumbnail,
}: {
  chip?: ChipType;
  headLine?: string;
  captionLine?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  primaryBtn?: any /* PrimaryButtonProps */;
  videoSrc?: string;
  videoThumbnail?: string;
  listData?: Array<{ title: string; image: string }>;
}) {
  const boxRadius = { xs: 24, sm: 32, md: 40 };

  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const scale = useTransform(
    scrollYProgress,
    [0, 0.1, 0.2, 0.4, 0.6],
    [0.9, 0.92, 0.94, 0.96, 1]
  );

  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Handle video play/pause based on intersection with the viewport
  useEffect(() => {
    interface IntersectionObserverEntryWithIsIntersecting
      extends IntersectionObserverEntry {
      isIntersecting: boolean;
    }

    const handleIntersection = (
      entries: IntersectionObserverEntryWithIsIntersecting[]
    ) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (videoRef.current && !isPlaying) {
            videoRef.current
              .play()
              .then(() => {
                setIsPlaying(true);
              })
              .catch((error) => {
                console.error("Autoplay was prevented:", error);
              });
          }
        } else {
          if (videoRef.current && isPlaying) {
            videoRef.current.pause();
            setIsPlaying(false);
          }
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersection, options);
    const videoElement = videoRef.current;

    if (videoElement) {
      observer.observe(videoElement);
    }

    return () => {
      if (videoElement) {
        observer.unobserve(videoElement);
      }
    };
  }, [isPlaying]);

  return (
    <>
      <Box
        sx={{
          height: { xs: 592, sm: 738, md: 878 },
          position: "absolute",
          top: 0,
          left: 0,
          width: 1,
          zIndex: -1,
          borderBottomLeftRadius: boxRadius,
          borderBottomRightRadius: boxRadius,
          // background: getBackgroundDots(theme.palette.grey[300], 60, 35),
          // bgcolor: "grey.100",
        }}
      ></Box>
      <ContainerWrapper sx={{ py: 0 }}>
        <Box ref={containerRef}>
          <Box sx={{ pb: { xs: 3, sm: 4, md: 5 } }}>
            <Stack sx={{ alignItems: "center", gap: 1.5 }}>
              {chip && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 1,
                    delay: 0.1,
                    ease: [0.215, 0.61, 0.355, 1],
                  }}
                >
                  <Chip
                    variant="outlined"
                    label={
                      typeof chip?.label === "string" ? (
                        <Typography
                          variant="caption"
                          sx={{ color: "rgba(255,255,255,0.8)" }}
                        >
                          {chip?.label}
                        </Typography>
                      ) : (
                        chip?.label
                      )
                    }
                    sx={{
                      bgcolor: "rgba(255,255,255,0.1)",
                      borderColor: "rgba(255,255,255,0.3)",
                      "& .MuiChip-label": { py: 0.5, px: 1.5 },
                    }}
                  />
                </motion.div>
              )}

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 1,
                  delay: 0.2,
                  ease: [0.215, 0.61, 0.355, 1],
                }}
              >
                <Typography
                  variant="h1"
                  sx={{
                    color: "white",
                    fontWeight: 900,
                    fontSize: { xs: "2.5rem", sm: "3.5rem", md: "4rem" },
                    lineHeight: 1.1,
                    textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
                    mb: 2,
                  }}
                >
                  {headLine}
                </Typography>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 1,
                  delay: 0.3,
                  ease: [0.215, 0.61, 0.355, 1],
                }}
              >
                <Typography
                  variant="h5"
                  sx={{
                    color: "rgba(255,255,255,0.95)",
                    fontWeight: 300,
                    fontSize: { xs: "1.2rem", sm: "1.4rem", md: "1.5rem" },
                    maxWidth: 650,
                    mb: 4,
                  }}
                >
                  {captionLine}
                </Typography>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 1,
                  delay: 0.4,
                  ease: [0.215, 0.61, 0.355, 1],
                }}
              >
                <ButtonAnimationWrapper>
                  <Button
                    variant="contained"
                    sx={{
                      background: "linear-gradient(45deg, #FFC107, #ffb300)",
                      color: "#003d1a",
                      textTransform: "uppercase",
                      letterSpacing: "1px",
                      fontWeight: 700,
                      fontSize: "1.2rem",
                      // eslint-disable-next-line no-restricted-syntax
                      padding: "1.2rem 3rem",
                      borderRadius: "50px",
                      boxShadow: "0 10px 30px rgba(255,193,7,0.4)",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        transform: "translateY(-5px)",
                        boxShadow: "0 20px 40px rgba(255,193,7,0.6)",
                        filter: "brightness(1.1)",
                        background: "linear-gradient(45deg, #FFC107, #ffb300)",
                      },
                    }}
                    {...primaryBtn}
                  />
                </ButtonAnimationWrapper>
              </motion.div>
            </Stack>
          </Box>
          <motion.div
            initial={{ opacity: 0, y: 0 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              delay: 0.5,
            }}
            style={{ scale }}
          >
            <GraphicsCard
              sx={{ border: "5px solid", borderColor: "grey.300" }}
              bgImage={undefined}
            >
              <video
                playsInline
                ref={videoRef}
                width="100%"
                height="100%"
                style={{ display: "flex", objectFit: "cover" }}
                preload="metadata"
                autoPlay={false}
                loop={true}
                muted={true}
                poster={videoThumbnail}
              >
                <source src={videoSrc} type="video/mp4" />
              </video>
            </GraphicsCard>
          </motion.div>
        </Box>
      </ContainerWrapper>
    </>
  );
}
