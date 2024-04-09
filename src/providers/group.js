import { createContext, useState } from "react";

import { groupsMock } from "views/groups/columns";

const GroupContext = createContext();

const GroupProvider = ({ children }) => {
  const [deleteId, setDeleteId] = useState();
  const [groups, setGroups] = useState(groupsMock);
  const itemsPerPage = 1;

  const changeGroup = (groups) => setGroups([...groups]);

  return (
    <GroupContext.Provider
      value={{
        deleteId,
        groups,
        itemsPerPage,
        changeGroup,
      }}
    >
      {children}
    </GroupContext.Provider>
  );
};

export { GroupContext, GroupProvider };
