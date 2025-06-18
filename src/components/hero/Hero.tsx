"use client";
import { JSX, useEffect, useRef } from "react";
import { useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { motion, useScroll, useTransform } from "framer-motion";
import ContainerWrapper from "@/components/ContainerWrapper";

type HeroProps = {
  chip?: { label: string | JSX.Element };
  headLine?: JSX.Element | string;
  captionLine?: string;
  primaryBtn?: React.ComponentProps<typeof Button>;
  videoSrc?: string;
  videoThumbnail?: string;
};

export default function Hero({
  chip,
  headLine,
  captionLine,
  primaryBtn,
  videoSrc,
  videoThumbnail,
}: HeroProps) {
  const theme = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);
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

  useEffect(() => {
    // Modern browsers require user interaction to autoplay videos
    // We'll attempt to play when component mounts
    const attemptPlay = () => {
      if (videoRef.current) {
        const playPromise = videoRef.current.play();

        if (playPromise !== undefined) {
          playPromise.catch((_error) => {
            console.log("Autoplay prevented, showing fallback");
            // If autoplay fails, show the poster as fallback
            if (videoRef.current) {
              videoRef.current.poster = videoThumbnail || "";
            }
          });
        }
      }
    };

    // Try to play immediately
    attemptPlay();

    // Also try to play when user interacts with the page
    const handleUserInteraction = () => {
      attemptPlay();
      document.removeEventListener("click", handleUserInteraction);
      document.removeEventListener("touchstart", handleUserInteraction);
    };

    document.addEventListener("click", handleUserInteraction);
    document.addEventListener("touchstart", handleUserInteraction);

    return () => {
      document.removeEventListener("click", handleUserInteraction);
      document.removeEventListener("touchstart", handleUserInteraction);
    };
  }, []);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        position: "relative",
        overflow: "hidden",
        background: `linear-gradient(135deg, ${theme.palette.landing.sections.hero.gradientFrom} 0%, ${theme.palette.landing.sections.hero.gradientTo} 100%)`,
        pt: 8, // Add padding top for the app bar
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="0.5"/></pattern></defs><rect width="100" height="100" fill="url(%23grid)"/></svg>')`,
          animation: "float 20s ease-in-out infinite",
        },
        "@keyframes float": {
          "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
          "50%": { transform: "translateY(-20px) rotate(1deg)" },
        },
      }}
    >
      {/* Floating elements */}
      <Box
        sx={{
          position: "absolute",
          width: "100%",
          height: "100%",
          overflow: "hidden",
          pointerEvents: "none",
          zIndex: 1,
          "&::before, &::after": {
            content: '""',
            position: "absolute",
            width: "100px",
            height: "100px",
            background: "rgba(255,255,255,0.1)",
            borderRadius: "50%",
            animation: "float 15s ease-in-out infinite",
          },
          "&::before": {
            top: "20%",
            left: "10%",
            animationDelay: "-5s",
          },
          "&::after": {
            top: "60%",
            right: "10%",
            animationDelay: "-10s",
          },
        }}
      />

      {/* Video Background */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          overflow: "hidden",
          zIndex: 2,
        }}
      >
        <video
          ref={videoRef}
          playsInline
          muted
          loop
          preload="auto"
          poster={videoThumbnail}
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            minWidth: "100%",
            minHeight: "100%",
            width: "auto",
            height: "auto",
            transform: "translate(-50%, -50%)",
            objectFit: "cover",
            opacity: 0.3,
          }}
        >
          <source src={videoSrc} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </Box>

      <ContainerWrapper>
        <Box
          ref={containerRef}
          component={motion.div}
          style={{ scale }}
          sx={{
            position: "relative",
            zIndex: 3,
            textAlign: "center",
            animation: "slideUp 1s ease-out",
            "@keyframes slideUp": {
              from: { opacity: 0, transform: "translateY(50px)" },
              to: { opacity: 1, transform: "translateY(0)" },
            },
          }}
        >
          {chip && (
            <Box
              sx={{
                display: "inline-block",
                mb: 3,
                px: 2,
                py: 0.5,
                borderRadius: "20px",
                backgroundColor: "rgba(255,255,255,0.15)",
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  color: "#fff",
                  fontWeight: 600,
                }}
              >
                {chip.label}
              </Typography>
            </Box>
          )}

          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: "2.5rem", sm: "3.5rem", md: "4rem" },
              fontWeight: 900,
              mb: 2,
              textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
              lineHeight: 1.1,
              color: "white",
            }}
          >
            {headLine}
          </Typography>

          <Typography
            variant="h5"
            sx={{
              fontSize: { xs: "1.2rem", sm: "1.4rem", md: "1.5rem" },
              mb: 4,
              opacity: 0.95,
              fontWeight: 300,
              color: "white",
              maxWidth: "800px",
              mx: "auto",
            }}
          >
            {captionLine}
          </Typography>

          {primaryBtn && (
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
                },
              }}
              {...primaryBtn}
            />
          )}
        </Box>
      </ContainerWrapper>
    </Box>
  );
}
