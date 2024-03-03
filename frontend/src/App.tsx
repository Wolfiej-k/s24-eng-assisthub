import { Refine } from "@refinedev/core"

import { RefineSnackbarProvider, ThemedLayoutV2, useNotificationProvider } from "@refinedev/mui"

import CssBaseline from "@mui/material/CssBaseline"
import GlobalStyles from "@mui/material/GlobalStyles"
import routerProvider, {
  DocumentTitleHandler,
  NavigateToResource,
  UnsavedChangesNotifier,
} from "@refinedev/react-router-v6"
import dataProvider from "@refinedev/simple-rest"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import { authProvider } from "./authProvider"
import { ColorModeContextProvider } from "./contexts/color-mode"

import HomePage from "./pages"
import ForgotPage from "./pages/forgot"
import LoginPage from "./pages/login"
import RegisterPage from "./pages/register"

export default function App() {
  return (
    <BrowserRouter>
      <ColorModeContextProvider>
        <CssBaseline />
        <GlobalStyles styles={{ html: { WebkitFontSmoothing: "auto" } }} />
        <RefineSnackbarProvider>
          <Refine
            dataProvider={dataProvider("https://api.fake-rest.refine.dev")}
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
              syncWithLocation: true,
              warnWhenUnsavedChanges: true,
              useNewQueryKeys: true,
              projectId: "7nmKip-7xeawJ-mdyZ6f",
            }}
          >
            <Routes>
              <Route
                element={
                  <ThemedLayoutV2
                    Title={({ collapsed }) => (
                      <>
                        {collapsed && <span>AH</span>}
                        {!collapsed && <span>AssistHub</span>}
                      </>
                    )}
                  >
                    <HomePage />
                  </ThemedLayoutV2>
                }
              >
                <Route index element={<NavigateToResource resource="posts" />} />
              </Route>
              <Route path="login" element={<LoginPage />} />
              <Route path="register" element={<RegisterPage />} />
              <Route path="forgot" element={<ForgotPage />} />
            </Routes>
            <UnsavedChangesNotifier />
            <DocumentTitleHandler />
          </Refine>
        </RefineSnackbarProvider>
      </ColorModeContextProvider>
    </BrowserRouter>
  )
}
