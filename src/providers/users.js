import { api } from "api/api";
import { createContext, useRef, useState } from "react";

import { toast } from "react-toastify";
import { usersMock } from "views/users/components/usersarray";

const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [deleteId, setDeleteId] = useState();
  const [editId, setEditId] = useState();
  const [users, setUsers] = useState(usersMock);
  const [selectedItems, setSelectedItems] = useState([]);
  const editFormRef = useRef(null);

  const changeDeleteId = (id) => {
    setDeleteId(id);
  };

  const changeEditId = (id) => {
    setDeleteId(id);
  };

  const changeSetSelectedItems = () => {};

  const changeUsers = (users) => setUsers([...users]);

  return (
    <UserContext.Provider
      value={{
        deleteId,
        changeDeleteId,
        editId,
        changeEditId,
        users,
        changeUsers,
        editFormRef,
        selectedItems,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserProvider };
