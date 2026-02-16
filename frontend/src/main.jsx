import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App"
import WalletProviderWrapper from "./WalletProviderWrapper"

ReactDOM.createRoot(document.getElementById("root")).render(
  <WalletProviderWrapper>
    <App />
  </WalletProviderWrapper>
)
