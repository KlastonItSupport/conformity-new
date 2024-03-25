import React from "react";
import ReactDOM from "react-dom";
import "assets/css/App.css";
import { Route, Switch, Redirect } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import { ThemeEditorProvider } from "@hypertheme-editor/chakra-ui";
import { AuthProvider } from "providers/auth";
import theme from "./theme/theme";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter } from "react-router-dom/cjs/react-router-dom.min";
import SignInPage from "views/sign-in";

ReactDOM.render(
  <AuthProvider>
    <ChakraProvider theme={theme}>
      <ToastContainer />
      <React.StrictMode>
        <ThemeEditorProvider>
          <BrowserRouter>
            <Switch>
              <Route path={`/signin`} component={SignInPage} />
              <Redirect from="/" to="/admin" />
            </Switch>
          </BrowserRouter>
        </ThemeEditorProvider>
      </React.StrictMode>
    </ChakraProvider>
  </AuthProvider>,
  document.getElementById("root")
);
