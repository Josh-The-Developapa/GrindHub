import { keyframes } from "@emotion/react";
import styled from "@emotion/styled";
import {
  AddRounded,
  CategoryRounded,
  DeleteForeverRounded,
  DownloadDoneRounded,
  FiberManualRecord,
  GetAppRounded,
  InstallDesktopRounded,
  InstallMobileRounded,
  IosShareRounded,
  Logout,
  PhoneIphoneRounded,
  SettingsRounded,
  TaskAltRounded,
  ThumbUpRounded,
} from "@mui/icons-material";
import {
  Dialog,
  DialogActions,
  DialogContent,
  Divider,
  IconButton,
  MenuItem,
  SwipeableDrawer,
  Tooltip,
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CustomDialogTitle, LogoutDialog, SettingsDialog } from ".";
import logo from "../assets/logo256.png";
import { defaultUser } from "../constants/defaultUser";
import { UserContext } from "../contexts/UserContext";
import { DialogBtn, UserAvatar, pulseAnimation, ring } from "../styles";
import { ColorPalette } from "../theme/themeConfig";
import { showToast, systemInfo } from "../utils";

export const ProfileSidebar = () => {
  const { user, setUser } = useContext(UserContext);
  const { name, profilePicture, tasks, settings } = user;
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [openLogoutDialog, setOpenLogoutDialog] = useState<boolean>(false);
  const [openSettings, setOpenSettings] = useState<boolean>(false);

  const n = useNavigate();

  useEffect(() => {
    // const fetchRepoInfo: () => Promise<void> = async () => {
    //   const { repoData, branchData } = await fetchGitHubInfo();
    //   setStars(repoData.stargazers_count);
    //   // setLastUpdate(branchData.commit.commit.committer.date);
    //   setIssuesCount(repoData.open_issues_count);
    // };

    // const fetchBMC: () => Promise<void> = async () => {
    //   // Fetch data from the Buy Me a Coffee API
    //   const { supportersCount } = await fetchBMCInfo();
    //   // In case BMC api fails
    //   if (supportersCount > 0) {
    //     setBmcSupporters(supportersCount);
    //   } else {
    //     console.error("No BMC supporters found.");
    //   }
    // };

    // fetchBMC();
    // fetchRepoInfo();
  }, []);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  interface BeforeInstallPromptEvent extends Event {
    readonly platforms: ReadonlyArray<string>;
    readonly userChoice: Promise<{
      outcome: "accepted" | "dismissed";
      platform: string;
    }>;
    prompt(): Promise<void>;
  }

  const [supportsPWA, setSupportsPWA] = useState<boolean>(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isAppInstalled, setIsAppInstalled] = useState<boolean>(false);

  const [openInstalledDialog, setOpenInstalledDialog] = useState<boolean>(false);

  useEffect(() => {
    const beforeInstallPromptHandler = (e: Event) => {
      e.preventDefault();
      setSupportsPWA(true);
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const detectAppInstallation = () => {
      window.matchMedia("(display-mode: standalone)").addEventListener("change", (e) => {
        setIsAppInstalled(e.matches);
      });
    };

    window.addEventListener("beforeinstallprompt", beforeInstallPromptHandler);
    detectAppInstallation();

    return () => {
      window.removeEventListener("beforeinstallprompt", beforeInstallPromptHandler);
    };
  }, []);

  const installPWA = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === "accepted") {
          if ("setAppBadge" in navigator) {
            setUser((prevUser) => ({
              ...prevUser,
              settings: {
                ...prevUser.settings,
                appBadge: true,
              },
            }));
          }
          // Show a dialog to inform the user that the app is now running as a PWA on Windows
          if (systemInfo.os === "Windows") {
            setOpenInstalledDialog(true);
          } else {
            showToast("App installed successfully!");
          }
          handleClose();
        }
        if (choiceResult.outcome === "dismissed") {
          showToast("Installation dismissed.", { type: "error" });
        }
      });
    }
  };

  return (
    <Container>
      <Tooltip title={<div translate={name ? "no" : "yes"}>{name || "User"}</div>}>
        <IconButton
          aria-label="Sidebar"
          aria-controls={open ? "basic-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          onClick={handleClick}
          sx={{ zIndex: 1 }}
        >
          <UserAvatar
            src={(profilePicture as string) || undefined}
            alt={name || "User"}
            hasimage={profilePicture !== null}
            pulse={
              user.name === defaultUser.name &&
              JSON.stringify(user.settings) === JSON.stringify(defaultUser.settings)
            }
            size="52px"
            onError={() => {
              // This prevents the error handling from being called unnecessarily when offline
              if (!navigator.onLine) return;
              setUser((prevUser) => ({
                ...prevUser,
                profilePicture: null,
              }));
              showToast("Error in profile picture URL", { type: "error" });
              throw new Error("Error in profile picture URL");
            }}
          >
            {name ? name[0].toUpperCase() : undefined}
          </UserAvatar>
        </IconButton>
      </Tooltip>
      <StyledSwipeableDrawer
        disableBackdropTransition={systemInfo.os !== "iOS"}
        disableDiscovery={systemInfo.os === "iOS"}
        id="basic-menu"
        anchor="right"
        open={open}
        onOpen={(e) => e.preventDefault()}
        onClose={handleClose}
      >
        <LogoContainer
          translate="no"
          onClick={() => {
            n("/");
            handleClose();
          }}
        >
          <Logo src={logo} alt="logo" />
          <LogoText>
            <span>Grind</span> Hub
            <span>.</span>
          </LogoText>
        </LogoContainer>

        <MenuLink to="/">
          <StyledMenuItem onClick={handleClose}>
            <TaskAltRounded /> &nbsp; Tasks
            {tasks.filter((task) => !task.done).length > 0 && (
              <Tooltip title={`${tasks.filter((task) => !task.done).length} tasks to do`}>
                <MenuLabel>
                  {tasks.filter((task) => !task.done).length > 99
                    ? "99+"
                    : tasks.filter((task) => !task.done).length}
                </MenuLabel>
              </Tooltip>
            )}
          </StyledMenuItem>
        </MenuLink>

         <MenuLink to="/ib-resources">
          <StyledMenuItem onClick={handleClose}>
            <AddRounded /> &nbsp; IB Resources
          </StyledMenuItem>
        </MenuLink>

        <MenuLink to="/add">
          <StyledMenuItem onClick={handleClose}>
            <AddRounded /> &nbsp; Add Task
          </StyledMenuItem>
        </MenuLink>

        {settings.enableCategories !== undefined && settings.enableCategories && (
          <MenuLink to="/categories">
            <StyledMenuItem onClick={handleClose}>
              <CategoryRounded /> &nbsp; Categories
            </StyledMenuItem>
          </MenuLink>
        )}

        <MenuLink to="/purge">
          <StyledMenuItem onClick={handleClose}>
            <DeleteForeverRounded /> &nbsp; Purge Tasks
          </StyledMenuItem>
        </MenuLink>

        <MenuLink to="/transfer">
          <StyledMenuItem onClick={handleClose}>
            <GetAppRounded /> &nbsp; Transfer
          </StyledMenuItem>
        </MenuLink>

        <StyledDivider />

        <StyledDivider />

        {supportsPWA && !isAppInstalled && (
          <StyledMenuItem onClick={installPWA}>
            {systemInfo.os === "Android" ? <InstallMobileRounded /> : <InstallDesktopRounded />}
            &nbsp; Install App
          </StyledMenuItem>
        )}

        {systemInfo.browser === "Safari" &&
          systemInfo.os === "iOS" &&
          !window.matchMedia("(display-mode: standalone)").matches && (
            <StyledMenuItem
              onClick={() => {
                showToast(
                  <div style={{ display: "inline-block" }}>
                    To install the app on iOS Safari, click on{" "}
                    <IosShareRounded sx={{ verticalAlign: "middle", mb: "4px" }} /> and then{" "}
                    <span style={{ fontWeight: "bold" }}>Add to Home Screen</span>.
                  </div>,
                  { type: "blank", duration: 8000 },
                );
                handleClose();
              }}
            >
              <PhoneIphoneRounded />
              &nbsp; Install App
            </StyledMenuItem>
          )}

        <StyledMenuItem
          onClick={() => {
            handleClose();
            setOpenLogoutDialog(true);
          }}
          sx={{ color: "#ff4040 !important" }}
        >
          <Logout /> &nbsp; Logout
        </StyledMenuItem>

          <SettingsMenuItem
            onClick={() => {
              setOpenSettings(true);
              handleClose();
            }}
          >
            <SettingsRounded /> &nbsp; Settings
            {JSON.stringify(settings) === JSON.stringify(defaultUser.settings) &&
              user.darkmode === defaultUser.darkmode &&
              user.theme === defaultUser.theme &&
              user.emojisStyle === defaultUser.emojisStyle && <PulseMenuLabel />}
          </SettingsMenuItem>

          <StyledDivider />
          <MenuLink to="/user">
            <ProfileMenuItem translate={name ? "no" : "yes"} onClick={handleClose}>
              <UserAvatar
                src={(profilePicture as string) || undefined}
                hasimage={profilePicture !== null}
                size="44px"
              >
                {name ? name[0].toUpperCase() : undefined}
              </UserAvatar>
              <h4 style={{ margin: 0, fontWeight: 600 }}> {name || "User"}</h4>{" "}
              {(name === null || name === "") && profilePicture === null && <PulseMenuLabel />}
            </ProfileMenuItem>
          </MenuLink>

          <StyledDivider />

        
      </StyledSwipeableDrawer>

      <Dialog open={openInstalledDialog} onClose={() => setOpenInstalledDialog(false)}>
        <CustomDialogTitle
          title="App installed successfully!"
          subTitle="The app is now running as a PWA."
          icon={<DownloadDoneRounded />}
          onClose={() => setOpenInstalledDialog(false)}
        />
        <DialogContent>
          You can access it from your home screen, with offline support and features like shortcuts
          and badges.
        </DialogContent>
        <DialogActions>
          <DialogBtn onClick={() => setOpenInstalledDialog(false)}>
            <ThumbUpRounded /> &nbsp; Got it
          </DialogBtn>
        </DialogActions>
      </Dialog>
      <LogoutDialog open={openLogoutDialog} onClose={() => setOpenLogoutDialog(false)} />
      <SettingsDialog open={openSettings} onClose={() => setOpenSettings(false)} />
    </Container>
  );
};

const MenuLink = ({ to, children }: { to: string; children: React.ReactNode }) => {
  const styles: React.CSSProperties = { borderRadius: "14px" };
  if (to.startsWith("/")) {
    return (
      // React Router Link component for internal navigation
      <Link to={to} style={styles}>
        {children}
      </Link>
    );
  }
  // Render an anchor tag for external navigation
  return (
    <a href={to} target="_blank" style={styles}>
      {children}
    </a>
  );
};

const PulseMenuLabel = () => {
  return (
    <StyledPulseMenuLabel>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <FiberManualRecord style={{ fontSize: "16px" }} />
      </div>
    </StyledPulseMenuLabel>
  );
};

const Container = styled.div`
  position: absolute;
  right: 16vw;
  top: 14px;
  z-index: 900;
  @media (max-width: 1024px) {
    right: 16px;
  }
`;

const StyledSwipeableDrawer = styled(SwipeableDrawer)`
  & .MuiPaper-root {
    border-radius: 24px 0 0 0;
    min-width: 300px;
    box-shadow: none;
    padding: 4px 12px;
    color: ${({ theme }) => (theme.darkmode ? ColorPalette.fontLight : "#101727")};
    z-index: 999;

    @media (min-width: 1920px) {
      min-width: 310px;
    }

    @media (max-width: 1024px) {
      min-width: 270px;
    }

    @media (max-width: 600px) {
      min-width: 55vw;
    }
  }
`;
const LogoutAnimation = keyframes`
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(0.9) translateX(-2px);
    opacity: 0.7;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
`;

const InstallAppAnimation = keyframes`
   0% {
    transform: translateY(0);
  }
  30% {
    transform: translateY(-5px);
  }
  50% {
    transform: translateY(2px);
  }
  70% {
    transform: translateY(-2px);
  }
  100% {
    transform: translateY(0);
  }
`;

const StyledMenuItem = styled(MenuItem)`
  /* margin: 0px 8px; */
  padding: 16px 12px;
  border-radius: 14px;
  box-shadow: none;
  font-weight: 500;
  gap: 6px;

  & svg,
  .bmc-icon {
    transition: 0.4s transform;
  }

  &:hover {
    & svg[data-testid="GitHubIcon"] {
      transform: rotateY(${2 * Math.PI}rad);
    }
    & svg[data-testid="BugReportRoundedIcon"] {
      transform: rotate(45deg) scale(1.1) translateY(-10%);
    }

    & svg[data-testid="InstallDesktopRoundedIcon"] {
      animation: ${InstallAppAnimation} 0.8s ease-in alternate;
    }

    & svg[data-testid="LogoutIcon"] {
      animation: ${LogoutAnimation} 0.5s ease-in alternate;
    }

    & .bmc-icon {
      animation: ${ring} 2.5s ease-in alternate;
    }
  }
`;

const SettingsMenuItem = styled(StyledMenuItem)`
  background: ${({ theme }) => (theme.darkmode ? "#1f1f1f" : "#101727")};
  color: ${ColorPalette.fontLight} !important;
  margin-top: 8px !important;
  &:hover {
    background: ${({ theme }) => (theme.darkmode ? "#1f1f1fb2" : "#101727b2")};
    & svg[data-testid="SettingsRoundedIcon"] {
      transform: rotate(180deg);
    }
  }
`;

const ProfileMenuItem = styled(StyledMenuItem)`
  display: flex;
  align-items: center;
  gap: 10px;
  background: ${({ theme }) => (theme.darkmode ? "#1f1f1f" : "#d7d7d7")};
  &:hover {
    background: ${({ theme }) => (theme.darkmode ? "#1f1f1fb2" : "#d7d7d7b2")};
  }
`;

const MenuLabel = styled.span<{ clr?: string }>`
  margin-left: auto;
  font-weight: 600;
  background: ${({ clr, theme }) => (clr || theme.primary) + "35"};
  color: ${({ clr, theme }) => clr || theme.primary};
  padding: 2px 12px;
  border-radius: 32px;
  font-size: 14px;
`;

const StyledDivider = styled(Divider)`
  margin: 8px 4px;
`;

const StyledPulseMenuLabel = styled(MenuLabel)`
  animation: ${({ theme }) => pulseAnimation(theme.primary, 6)} 1.2s infinite;
  padding: 6px;
  margin-right: 4px;
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  flex-direction: row;
  margin-top: 8px;
  margin-bottom: 16px;
  gap: 12px;
  cursor: pointer;
`;

const Logo = styled.img`
  width: 52px;
  height: 52px;
  margin-left: 12px;
  border-radius: 14px;
`;

const LogoText = styled.h2`
  & span {
    color: #7764e8;
  }
`;


// const ProfileOptionsBottom = styled.div`
//   margin-top: auto;
//   margin-bottom: ${window.matchMedia("(display-mode: standalone)").matches &&
//   /Mobi/.test(navigator.userAgent)
//     ? "38px"
//     : "16px"};
//   display: flex;
//   flex-direction: column;
//   gap: 8px;
// `;


