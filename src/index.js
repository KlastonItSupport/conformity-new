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
import { CompaniesPage } from "views/companies";
import { CompanyProvider } from "providers/company";
import { GroupsPage } from "views/groups";
import { GroupProvider } from "providers/group";

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
  {
    path: "companies",
    element: <CompaniesPage />,
  },
  {
    path: "groups",
    element: <GroupsPage />,
  },
]);

ReactDOM.render(
  <AuthProvider>
    <CompanyProvider>
      <UserProvider>
        <GroupProvider>
          <ChakraProvider theme={theme}>
            <ToastContainer />
            <React.StrictMode>
              <ThemeEditorProvider>
                <RouterProvider router={routes} />
              </ThemeEditorProvider>
            </React.StrictMode>
          </ChakraProvider>
        </GroupProvider>
      </UserProvider>
    </CompanyProvider>
  </AuthProvider>,
  document.getElementById("root")
);
