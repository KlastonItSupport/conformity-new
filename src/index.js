import React from "react";
import ReactDOM from "react-dom";
import "assets/css/App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import { ThemeEditorProvider } from "@hypertheme-editor/chakra-ui";
import { AuthProvider } from "providers/auth";
import theme from "./theme/theme";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SignInPage from "views/sign-in";
import { UsersPage } from "views/users";
import { UserProvider } from "providers/users";

const routes = createBrowserRouter([
  {
    path: "/",
    element: <SignInPage />,
  },
  {
    path: "signin",
    element: <SignInPage />,
  },
  {
    path: "users",
    element: <UsersPage />,
  },
]);

ReactDOM.render(
  <AuthProvider>
    <UserProvider>
      <ChakraProvider theme={theme}>
        <ToastContainer />
        <React.StrictMode>
          <ThemeEditorProvider>
            <RouterProvider router={routes} />
          </ThemeEditorProvider>
        </React.StrictMode>
      </ChakraProvider>
    </UserProvider>
  </AuthProvider>,
  document.getElementById("root")
);
