import { useAuth0 } from "@auth0/auth0-react"
import { DonutSmall as AnalyticsIcon, TableChart as CasesIcon } from "@mui/icons-material"
import { Box, CircularProgress } from "@mui/material"
import CssBaseline from "@mui/material/CssBaseline"
import GlobalStyles from "@mui/material/GlobalStyles"
import { ThemeProvider } from "@mui/material/styles"
import { Authenticated, Refine, type AuthProvider } from "@refinedev/core"
import { RefineSnackbarProvider, ThemedLayoutV2, useNotificationProvider } from "@refinedev/mui"
import routerProvider, {
  CatchAllNavigate,
  DocumentTitleHandler,
  UnsavedChangesNotifier,
} from "@refinedev/react-router-v6"
import dataProvider from "@refinedev/simple-rest"
import axios from "axios"
import { ConfirmProvider } from "material-ui-confirm"
import { BrowserRouter, Link, Route, Routes } from "react-router-dom"

import Logo from "./assets/assisthublogo.svg"
import SmallLogo from "./assets/assisthublogosmall.svg"
import Collapse from "./components/collapse"
import { ColorModeContextProvider } from "./contexts/color-mode"
import { theme } from "./theme"
import { type Coach } from "./types"

import { useState } from "react"
import Admin from "./components/admin"
import { NotFound } from "./components/message"
import HomePage from "./pages"
import AnalyticsPage from "./pages/analytics"
import DetailsPage from "./pages/details"
import LoginPage from "./pages/login"

export default function App() {
  const { isLoading, user, logout, getAccessTokenSilently } = useAuth0()
  const [userState, setUserState] = useState<Coach | undefined>()

  if (isLoading) {
    return (
      <Box sx={{ color: "#7f32cd" }}>
        <CircularProgress color="inherit" />
      </Box>
    )
  }

  const authProvider: AuthProvider = {
    login: () => {
      return Promise.resolve({
        success: true,
      })
    },
    logout: () => {
      void logout({ logoutParams: { returnTo: window.location.origin } })
      return Promise.resolve({
        success: true,
      })
    },
    onError: (error: Error) => {
      return Promise.resolve({
        error: error,
      })
    },
    check: async () => {
      try {
        if (user) {
          const accessToken = await getAccessTokenSilently()
          axios.defaults.headers.common = {
            Authorization: `Bearer ${accessToken}`,
          }
          return {
            authenticated: true,
          }
        } else {
          return {
            authenticated: false,
            error: {
              message: "Check failed",
              name: "Token not found",
            },
            redirectTo: "/login",
            logout: true,
          }
        }
      } catch (error: unknown) {
        return {
          authenticated: false,
          error: new Error("Unknown error"),
          redirectTo: "/login",
          logout: true,
        }
      }
    },
    getPermissions: async () => Promise.resolve(null),
    getIdentity: async () => {
      if (user && user.sub) {
        if (!userState || !userState.name || !userState.email || !userState.admin) {
          try {
            const response = await axios.get<Coach>(`${import.meta.env.VITE_API_URL}/coaches/${user.sub.substring(6)}`)
            if (response.status != 200) {
              return Promise.resolve(null)
            }

            setUserState({
              name: response.data.name,
              email: response.data.email,
              admin: response.data.admin,
            })

            return response.data
          } catch (error) {
            return null
          }
        }

        return userState
      }

      return null
    },
  }

  return (
    <BrowserRouter>
      <ColorModeContextProvider>
        <CssBaseline />
        <GlobalStyles styles={{ html: { WebkitFontSmoothing: "auto" } }} />
        <RefineSnackbarProvider>
          <Refine
            dataProvider={dataProvider(import.meta.env.VITE_API_URL, axios)}
            notificationProvider={useNotificationProvider}
            routerProvider={routerProvider}
            authProvider={authProvider}
            resources={[
              {
                name: "cases",
                list: "/",
                show: "/cases/:id",
                meta: {
                  icon: <CasesIcon />,
                },
              },
              {
                name: "analytics",
                list: "/analytics",
                meta: {
                  icon: <AnalyticsIcon />,
                  hide: !userState?.admin,
                },
              },
            ]}
            options={{
              warnWhenUnsavedChanges: true,
              useNewQueryKeys: true,
              projectId: "7nmKip-7xeawJ-mdyZ6f",
            }}
          >
            <ThemeProvider theme={theme}>
              <ThemedLayoutV2
                Header={() => <></>}
                Title={({ collapsed }) =>
                  collapsed ? (
                    <Collapse>
                      <img src={SmallLogo} alt="AssistHub Logo" style={{ height: "40px" }} />
                    </Collapse>
                  ) : (
                    <Link to="/">
                      <img src={Logo} alt="AssistHub Logo" style={{ height: "50px" }} />
                    </Link>
                  )
                }
                initialSiderCollapsed={true}
              >
                <ConfirmProvider
                  defaultOptions={{
                    confirmationButtonProps: { autoFocus: true },
                  }}
                >
                  <Routes>
                    <Route
                      path="/"
                      element={
                        <Authenticated key="dashboard" fallback={<CatchAllNavigate to="/login" />}>
                          <HomePage />
                        </Authenticated>
                      }
                    />
                    <Route
                      path="/analytics"
                      element={
                        <Authenticated key="analytics" fallback={<CatchAllNavigate to="/login" />}>
                          <Admin>
                            <AnalyticsPage />
                          </Admin>
                        </Authenticated>
                      }
                    />
                    <Route
                      path="/cases/:id"
                      element={
                        <Authenticated key="details" fallback={<CatchAllNavigate to="/login" />}>
                          <DetailsPage />
                        </Authenticated>
                      }
                    />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </ConfirmProvider>
              </ThemedLayoutV2>
            </ThemeProvider>
            <UnsavedChangesNotifier />
            <DocumentTitleHandler handler={() => "AssistHub"} />
          </Refine>
        </RefineSnackbarProvider>
      </ColorModeContextProvider>
    </BrowserRouter>
  )
}
