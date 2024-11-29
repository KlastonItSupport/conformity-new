import { api } from "api/api";
import { AuthContext } from "./auth";

import { createContext, useContext, useState } from "react";
import { toast } from "react-toastify";
import { AUDIT_EVENTS } from "constants/audit-events";

const ContractContext = createContext();

const ContractProvider = ({ children }) => {
  const { getToken, getUserInfo } = useContext(AuthContext);
  const [contractsByStatus, setContractsByStatus] = useState([]);

  const getContractsStatus = async () => {
    const response = await api.get("/contracts/contracts-status", {
      headers: { Authorization: `Bearer ${getToken()}` },
    });

    setContractsByStatus(response.data);
  };

  const createContract = async (data) => {
    const response = await api.post(
      "/contracts",
      { ...data, companyId: getUserInfo().companyId },
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
          "x-audit-event": AUDIT_EVENTS.CRM_CONTRACTS_CREATE,
        },
      }
    );

    await getContractsStatus();
    return response.data;
  };

  const getContracts = async (page = 1, search = "") => {
    const response = await api.get(`/contracts?page=${page}&search=${search}`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });

    await getContractsStatus();
    return response.data;
  };

  const editContract = async (data) => {
    const response = await api.patch(`/contracts/${data.id}`, data, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
        "x-audit-event": AUDIT_EVENTS.CRM_CONTRACTS_EDIT,
      },
    });

    if (response.status === 200) {
      toast.success("Contrato editado com sucesso");

      await getContractsStatus();
      return response.data;
    }
  };

  const deleteContract = async (id, showToast = true) => {
    try {
      const response = await api.delete(`/contracts/${id}`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
          "x-audit-event": AUDIT_EVENTS.CRM_CONTRACTS_DELETE,
        },
      });

      if (response.status === 200) {
        if (showToast) {
          await getContractsStatus();
          toast.success("Contrato excluído com sucesso");
        }
      }

      return true;
    } catch (error) {
      if (showToast) {
        toast.error("Erro ao deletar contrato");
      }
    }
  };

  const deleteMultipleContracts = async (
    selecteds,
    setContracts,
    contracts
  ) => {
    const deletePromises = selecteds.map((selected) =>
      deleteContract(selected.id, false)
    );
    await Promise.all(deletePromises);

    setContracts(
      contracts.filter(
        (contract) => !selecteds.some((selected) => selected.id === contract.id)
      )
    );

    await getContractsStatus();
    toast.success("Contratos excluídos com sucesso!");
  };

  return (
    <ContractContext.Provider
      value={{
        getContracts,
        deleteContract,
        deleteMultipleContracts,
        createContract,
        contractsByStatus,
        editContract,
      }}
    >
      {children}
    </ContractContext.Provider>
  );
};

export { ContractContext, ContractProvider };
