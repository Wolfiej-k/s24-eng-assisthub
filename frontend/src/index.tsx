import { Auth0Provider } from "@auth0/auth0-react"
import "@total-typescript/ts-reset"
import React from "react"
import { createRoot } from "react-dom/client"

import App from "./App"

const container = document.getElementById("root")!
const root = createRoot(container)

const authDomain = "dev-mmubohcpmwk3qtz1.us.auth0.com"
const authClientId = "Glb2r4tKHddzDBiiXy6mTszL4XrBe27J"

root.render(
  <React.StrictMode>
    <Auth0Provider
      domain={authDomain}
      clientId={authClientId}
      authorizationParams={{
        redirect_uri: window.location.origin,
      }}
    >
      <App />
    </Auth0Provider>
  </React.StrictMode>,
)
