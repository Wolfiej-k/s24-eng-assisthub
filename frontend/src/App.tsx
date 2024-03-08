import { useAuth0 } from "@auth0/auth0-react"
import CssBaseline from "@mui/material/CssBaseline"
import GlobalStyles from "@mui/material/GlobalStyles"
import { ThemeProvider } from "@mui/material/styles"
import { Authenticated, Refine, type AuthBindings } from "@refinedev/core"
import { RefineSnackbarProvider, ThemedLayoutV2, useNotificationProvider } from "@refinedev/mui"
import routerProvider, {
  CatchAllNavigate,
  DocumentTitleHandler,
  UnsavedChangesNotifier,
} from "@refinedev/react-router-v6"
import dataProvider from "@refinedev/simple-rest"
import axios from "axios"
import { BrowserRouter, Link, Route, Routes } from "react-router-dom"
import Logo from "./assets/assisthublogo.png"
import SmallLogo from "./assets/assisthublogosmall.png"
import { ColorModeContextProvider } from "./contexts/color-mode"
import { theme } from "./theme"

import HomePage from "./pages"
import AnalyticsPage from "./pages/analytics"
import LoginPage from "./pages/login"

export default function App() {
  const { isLoading, user, logout, getIdTokenClaims } = useAuth0()

  if (isLoading) {
    return <span>Loading...</span>
  }

  const authProvider: AuthBindings = {
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
    onError: (error: string) => {
      return Promise.resolve({
        logout: true,
        redirectTo: "/login",
        error: new Error(error),
      })
    },
    check: async () => {
      try {
        const token = await getIdTokenClaims()
        if (token) {
          axios.defaults.headers.common = {
            Authorization: `Bearer ${token.__raw}`,
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
    getPermissions: () => Promise.resolve(null),
    getIdentity: async () => {
      if (user) {
        return Promise.resolve({
          ...user,
          avatar: user.picture,
        })
      }
      return Promise.resolve(null)
    },
  }

  void getIdTokenClaims().then((token) => {
    if (token) {
      axios.defaults.headers.common = {
        Authorization: `Bearer ${token.__raw}`,
      }
    }
  })

  return (
    <BrowserRouter>
      <ColorModeContextProvider>
        <CssBaseline />
        <GlobalStyles styles={{ html: { WebkitFontSmoothing: "auto" } }} />
        <RefineSnackbarProvider>
          <Refine
            dataProvider={dataProvider("https://api.fake-rest.refine.dev", axios)}
            notificationProvider={useNotificationProvider}
            routerProvider={routerProvider}
            authProvider={authProvider}
            resources={[
              {
                name: "posts",
                list: "/",
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
                Title={({ collapsed }) => (
                  <Link to="/">
                    {collapsed && (
                      <>
                        <img src={SmallLogo} alt="AssistHub Logo" style={{ height: "40px" }} />
                      </>
                    )}
                    {!collapsed && (
                      <>
                        <img src={Logo} alt="AssistHub Logo" style={{ height: "50px" }} />
                      </>
                    )}
                  </Link>
                )}
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
                      <Authenticated key="dashboard" fallback={<CatchAllNavigate to="/login" />}>
                        <AnalyticsPage />
                      </Authenticated>
                    }
                  />
                  <Route path="/login" element={<LoginPage />} />
                </Routes>
              </ThemedLayoutV2>
            </ThemeProvider>
            <UnsavedChangesNotifier />
            <DocumentTitleHandler />
          </Refine>
        </RefineSnackbarProvider>
      </ColorModeContextProvider>
    </BrowserRouter>
  )
}
