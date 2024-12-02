import { api } from "api/api";
import { AuthContext } from "./auth";

import { createContext, useContext } from "react";
import { toast } from "react-toastify";
import { AUDIT_EVENTS } from "constants/audit-events";

const CertificatesContext = createContext();

const CertificatesProvider = ({ children }) => {
  const { getToken } = useContext(AuthContext);

  const getCertificates = async (page = 1, search = "", id, limit = 10) => {
    const response = await api.get(
      `/user-trainings/certificates/${id}?page=${page}&search=${search}&pageSize=${limit}`,
      {
        headers: { Authorization: `Bearer ${getToken()}` },
      }
    );

    return response.data;
  };

  const createCertificate = async (data) => {
    try {
      const response = await api.post(
        `/user-trainings/certificates/${data.id}`,

        [...data.documents],
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
            "x-audit-event": AUDIT_EVENTS.TRAININGS_USER_CERTIFICATES_CREATED,
          },
        }
      );

      if (response.status === 201) {
        toast.success("Certificado criado com sucesso");
        return response.data;
      }
    } catch (error) {
      toast.error("Erro ao criar Certificado");
    }
  };

  const editTraining = async (data, id) => {
    const response = await api.patch(`trainings/${id}`, data, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });

    if (response.status === 200) {
      toast.success("Treinamento editado com sucesso");

      return response.data;
    }
  };

  const deleteCertificate = async (id, showToast = true) => {
    try {
      const response = await api.delete(`/user-trainings/certificates/${id}`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
          "x-audit-event": AUDIT_EVENTS.TRAININGS_USER_CERTIFICATES_DELETED,
        },
      });

      if (response.status === 200) {
        if (showToast) {
          toast.success("Certificado deletado com sucesso");
        }
      }

      return true;
    } catch (error) {
      if (showToast) {
        toast.error("Erro ao deletar treinamento");
      }
    }
  };

  const deleteMultipleCertificates = async (
    selecteds,
    setServices,
    services
  ) => {
    const deletePromises = selecteds.map((selected) =>
      deleteCertificate(selected.id, false)
    );
    await Promise.all(deletePromises);

    setServices(
      services.filter(
        (service) => !selecteds.some((selected) => selected.id === service.id)
      )
    );
    toast.success("Certificados excluídas com sucesso!");
  };

  const getCertificatesDetails = async (id) => {
    const response = await api.get(
      `/user-trainings/certificates-details/${id}`
    );

    return response.data;
  };
  return (
    <CertificatesContext.Provider
      value={{
        getCertificates,
        deleteCertificate,
        deleteMultipleCertificates,
        createCertificate,
        editTraining,
        getCertificatesDetails,
      }}
    >
      {children}
    </CertificatesContext.Provider>
  );
};

export { CertificatesContext, CertificatesProvider };
