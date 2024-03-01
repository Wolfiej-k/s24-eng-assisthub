import { Refine } from "@refinedev/core"

import { RefineSnackbarProvider, ThemedLayoutV2, useNotificationProvider } from "@refinedev/mui"

import CssBaseline from "@mui/material/CssBaseline"
import GlobalStyles from "@mui/material/GlobalStyles"
import routerBindings, { DocumentTitleHandler, UnsavedChangesNotifier } from "@refinedev/react-router-v6"
import dataProvider from "@refinedev/simple-rest"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import { authProvider } from "./authProvider"
import { ColorModeContextProvider } from "./contexts/color-mode"

import HomePage from "./pages"
import ForgotPage from "./pages/forgot"
import LoginPage from "./pages/login"
import RegisterPage from "./pages/register"
import AnalyticsPage from "./pages/analytics"

function App() {
  return (
    <BrowserRouter>
      <ColorModeContextProvider>
        <CssBaseline />
        <GlobalStyles styles={{ html: { WebkitFontSmoothing: "auto" } }} />
        <RefineSnackbarProvider>
          <Refine
            dataProvider={dataProvider("https://api.fake-rest.refine.dev")}
            notificationProvider={useNotificationProvider}
            routerProvider={routerBindings}
            authProvider={authProvider}
            options={{
              syncWithLocation: true,
              warnWhenUnsavedChanges: true,
              useNewQueryKeys: true,
              projectId: "7nmKip-7xeawJ-mdyZ6f",
            }}
          >
            <Routes>
              <Route
                index
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
                    <AnalyticsPage/>
                  </ThemedLayoutV2>
                }
              />
              <Route path="analytics" element={<AnalyticsPage />} />
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

export default App
