import { api } from "api/api";
import axios from "axios";

export const useCNPJInfos = () => {
  const getCNPJInfos = async (cnpj) => {
    const cleanedCnpj = cnpj.replace(/[./-]/g, "");
    const response = await api.get(`/cnpj-info/${cleanedCnpj}`);

    return response.data;
  };

  //   const getCNPJInfos = async (cnpj) => {
  //     const response = await axios.get(`https://publica.cnpj.ws/cnpj/${cnpj}`);

  //     return {
  //       cnpj: response.data.cnpj,
  //       celphone: `(${response.data.estabelecimento.ddd1}) ${response.data.estabelecimento.telefone1}`,
  //       email: response.data.estabelecimento.email,
  //       cep: response.data.estabelecimento.cep,
  //       number: response.data.estabelecimento.numero,
  //       socialReason: response.data.razao_social,
  //     };
  //   };

  return {
    getCNPJInfos,
  };
};
