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
import { UserProvider } from "providers/users";
import { CompaniesPage } from "views/companies";
import { CompanyProvider } from "providers/company";
import { GroupsPage } from "views/groups";
import { GroupProvider } from "providers/group";
// eslint-disable-next-line no-unused-vars
import i18n from "./i18n/index.js";
import UsersPage from "./views/users/index";
import ProfilePage from "views/profile";
import DocumentsDetailsPage from "views/documents/details";
import ListDocumentsPage from "views/documents/list-documents";
import { DocumentProvider } from "providers/document";
import { CategoryProvider } from "providers/category";
import { DepartamentProvider } from "providers/departament";
import { DetailsDocumentsProvider } from "providers/details-documents";
import CategoriesPage from "views/documents/categories";
import AnalysisPage from "views/documents/analysis";
import { AnalysisProvider } from "providers/analysis";
import RevisionsPage from "views/documents/revisions";
import DocumentRemindersPage from "views/documents/document-reminders";
import ListTasksPage from "views/tasks/list-tasks";
import { TasksProvider } from "providers/tasks";
import TaskDetailsPage from "views/tasks/details";
import OriginsPage from "views/tasks/origins";
import { DetailsTaskProvider } from "providers/details-task";
import TypesPage from "views/tasks/types";
import ClassificationPage from "views/tasks/classifications";
import EquipmmentsPage from "views/equipments";
import ActionsPage from "views/equipments/actions";
import { EquipmentProvider } from "providers/equipments";
import IndicatorsPage from "views/indicators";
import GraphItemsPage from "views/indicators/graph-items";
import GraphsPage from "views/indicators/graphs";
import { IndicatorsProvider } from "providers/indicators";
import { IndicatorsAnswerProvider } from "providers/indicator-answer";
import ClientsSuppliers from "views/crm/clients-suppliers";
import ContractsPage from "views/crm/contracts";
import LeadsPage from "views/crm/leads";

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
  {
    path: "profile",
    element: <ProfilePage />,
  },
  {
    path: "documents/details",
    element: <DocumentsDetailsPage />,
  },
  {
    path: "/documents",
    element: <ListDocumentsPage />,
  },
  {
    path: "/categories",
    element: <CategoriesPage />,
  },
  {
    path: "/analysis",
    element: <AnalysisPage />,
  },
  {
    path: "/revisions",
    element: <RevisionsPage />,
  },
  {
    path: "/documents/reminders",
    element: <DocumentRemindersPage />,
  },
  {
    path: "/tasks",
    element: <ListTasksPage />,
  },

  {
    path: "/tasks/details",
    element: <TaskDetailsPage />,
  },
  {
    path: "/tasks/origins",
    element: <OriginsPage />,
  },
  {
    path: "/tasks/types",
    element: <TypesPage />,
  },
  {
    path: "/tasks/classifications",
    element: <ClassificationPage />,
  },
  {
    path: "/equipments",
    element: <EquipmmentsPage />,
  },

  {
    path: "/equipments/actions",
    element: <ActionsPage />,
  },
  {
    path: "indicators",
    element: <IndicatorsPage />,
  },
  {
    path: "indicators/graph-items",
    element: <GraphItemsPage />,
  },
  {
    path: "indicators/graphs",
    element: <GraphsPage />,
  },
  {
    path: "crm/clients-suppliers",
    element: <ClientsSuppliers />,
  },
  {
    path: "crm/contracts",
    element: <ContractsPage />,
  },
  {
    path: "crm/leads",
    element: <LeadsPage />,
  },
]);

ReactDOM.render(
  <AuthProvider>
    <ChakraProvider theme={theme}>
      <CompanyProvider>
        <UserProvider>
          <GroupProvider>
            <DocumentProvider>
              <AnalysisProvider>
                <DetailsDocumentsProvider>
                  <CategoryProvider>
                    <DepartamentProvider>
                      <TasksProvider>
                        <DetailsTaskProvider>
                          <EquipmentProvider>
                            <IndicatorsProvider>
                              <IndicatorsAnswerProvider>
                                <ToastContainer />
                                <React.StrictMode>
                                  <ThemeEditorProvider>
                                    <RouterProvider router={routes} />
                                  </ThemeEditorProvider>
                                </React.StrictMode>
                              </IndicatorsAnswerProvider>
                            </IndicatorsProvider>
                          </EquipmentProvider>
                        </DetailsTaskProvider>
                      </TasksProvider>
                    </DepartamentProvider>
                  </CategoryProvider>
                </DetailsDocumentsProvider>
              </AnalysisProvider>
            </DocumentProvider>
          </GroupProvider>
        </UserProvider>
      </CompanyProvider>
    </ChakraProvider>
  </AuthProvider>,
  document.getElementById("root")
);
