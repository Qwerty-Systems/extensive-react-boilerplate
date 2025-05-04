"use client";
import { useState } from "react";
import { styled } from "@mui/material/styles";
import { useTranslation } from "@/services/i18n/client";
import Link from "@/components/link";
import ThemeSwitchButton from "@/components/switch-theme-button";
import { IS_SIGN_UP_ENABLED } from "@/services/auth/config";
import MenuIcon from "@mui/icons-material/Menu";
import Logo from "./logo";
import { usePathname } from "next/navigation";
import useAuth from "@/services/auth/use-auth";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";

const StyledAppBar = styled(AppBar)({
  background: "transparent",
  boxShadow: "none",
});

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  minHeight: 56,
  paddingTop: theme.spacing(1),
  paddingBottom: theme.spacing(1),
  [theme.breakpoints.down("sm")]: {
    minHeight: 48,
  },
}));

enum SectionKeys {
  MARKETPLACE = "/market",
  RECYCLERS = "/recycle",
  WASTE_COLLECTORS = "collectors",
  COMMUNITY_GROUPS = "community",
}

type DownloadLinks = Record<SectionKeys, string> & { default: string };

const APP_DOWNLOAD_LINKS: DownloadLinks = {
  [SectionKeys.MARKETPLACE]: "https://marketplace-app-download.com",
  [SectionKeys.RECYCLERS]: "https://recyclers-app-download.com",
  [SectionKeys.WASTE_COLLECTORS]: "https://waste-collectors-app-download.com",
  [SectionKeys.COMMUNITY_GROUPS]: "https://community-groups-app-download.com",
  default: "https://default-app-download.com",
};

const validSections = Object.values(SectionKeys);

const ResponsiveAppBar = () => {
  const { t } = useTranslation("common");
  const { user, isLoaded } = useAuth();
  const [anchorNav, setAnchorNav] = useState<HTMLElement | null>(null);
  const pathname = usePathname();

  const segments = pathname.split("/");
  const lang = segments[1] || "en";
  const currentSection = segments[2];
  const fromParam = validSections.includes(currentSection as SectionKeys)
    ? { from: currentSection }
    : undefined;

  const getAppDownloadLink = (): string => {
    if (
      currentSection &&
      validSections.includes(currentSection as SectionKeys)
    ) {
      return APP_DOWNLOAD_LINKS[currentSection as SectionKeys];
    }
    return APP_DOWNLOAD_LINKS.default;
  };

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorNav(null);
  };

  const navItems = [
    { key: "marketplace", path: SectionKeys.MARKETPLACE },
    { key: "recyclers", path: SectionKeys.RECYCLERS },
    { key: "wasteCollectors", path: SectionKeys.WASTE_COLLECTORS },
    { key: "communityGroups", path: SectionKeys.COMMUNITY_GROUPS },
  ];

  const desktopNav = (
    <Stack
      direction="row"
      spacing={2}
      sx={{
        flexGrow: 1,
        justifyContent: "center",
        display: { xs: "none", md: "flex" },
      }}
    >
      {navItems.map((item) => (
        <Button
          key={item.key}
          component={Link}
          href={`/${item.path}`}
          sx={{ color: "inherit" }}
        >
          {t(`common:navigation.${item.key}`)}
        </Button>
      ))}
    </Stack>
  );

  const mobileNavItems = navItems.map((item) => (
    <MenuItem
      key={item.key}
      component={Link}
      href={`/${item.path}`}
      onClick={handleCloseNavMenu}
    >
      {t(`common:navigation.${item.key}`)}
    </MenuItem>
  ));

  return pathname === `/${lang}` ||
    pathname === `/${lang}/market` ||
    pathname === `/${lang}/recycle` ||
    pathname === `/${lang}/collectors` ||
    pathname === `/${lang}/community` ? (
    <Box sx={{ bgcolor: "grey.100" }}>
      <StyledAppBar position="static">
        <Container maxWidth="xl">
          <StyledToolbar>
            <Stack
              direction="row"
              alignItems="center"
              sx={{ width: "100%", justifyContent: "space-between" }}
            >
              <Box sx={{ display: { xs: "none", md: "flex" } }}>
                <Logo to="/" />
              </Box>

              <Box sx={{ display: { xs: "flex", md: "none" } }}>
                <IconButton
                  size="large"
                  onClick={handleOpenNavMenu}
                  color="inherit"
                  aria-label="open navigation menu"
                >
                  <MenuIcon />
                </IconButton>
                <Menu
                  anchorEl={anchorNav}
                  open={Boolean(anchorNav)}
                  onClose={handleCloseNavMenu}
                  sx={{ display: { xs: "block", md: "none" } }}
                >
                  <MenuItem
                    component={Link}
                    href="/"
                    onClick={handleCloseNavMenu}
                  >
                    {t("common:navigation.home")}
                  </MenuItem>
                  {mobileNavItems}
                  <Divider />
                  <MenuItem
                    component="a"
                    href={getAppDownloadLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={handleCloseNavMenu}
                  >
                    {t("common:navigation.downloadApp")}
                  </MenuItem>

                  {isLoaded && !user
                    ? [
                        <Divider key="auth-divider" />,
                        <MenuItem
                          key="sign-in"
                          component={Link}
                          href={{ pathname: "/sign-in", query: fromParam }}
                          onClick={handleCloseNavMenu}
                        >
                          {t("common:navigation.signIn")}
                        </MenuItem>,
                        IS_SIGN_UP_ENABLED && (
                          <MenuItem
                            key="sign-up"
                            component={Link}
                            href={{ pathname: "/sign-up", query: fromParam }}
                            onClick={handleCloseNavMenu}
                          >
                            {t("common:navigation.signUp")}
                          </MenuItem>
                        ),
                      ]
                    : null}
                </Menu>
              </Box>

              <Typography
                variant="h6"
                component={Link}
                href="/"
                sx={{
                  flexGrow: 1,
                  display: { xs: "flex", md: "none" },
                  textDecoration: "none",
                  color: "inherit",
                }}
              >
                {t("common:app-name")}
              </Typography>

              {desktopNav}

              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <ThemeSwitchButton />
                <Button
                  variant="contained"
                  color="secondary"
                  href={getAppDownloadLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ display: { xs: "none", md: "flex" } }}
                >
                  {t("common:navigation.downloadApp")}
                </Button>
                {!isLoaded ? (
                  <CircularProgress size={24} sx={{ ml: 2 }} />
                ) : user ? (
                  // Add user menu component here
                  <></>
                ) : (
                  <Box sx={{ display: { xs: "none", md: "flex" }, gap: 1 }}>
                    <Button
                      component={Link}
                      href={`/sign-in${fromParam ? `?from=${fromParam.from}` : ""}`}
                    >
                      {t("common:navigation.signIn")}
                    </Button>
                    {IS_SIGN_UP_ENABLED && (
                      <Button
                        component={Link}
                        href={`/sign-up${fromParam ? `?from=${fromParam.from}` : ""}`}
                      >
                        {t("common:navigation.signUp")}
                      </Button>
                    )}
                  </Box>
                )}
              </Box>
            </Stack>
          </StyledToolbar>
        </Container>
      </StyledAppBar>
    </Box>
  ) : null;
};

export default ResponsiveAppBar;
