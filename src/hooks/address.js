import axios from "axios";

export const useAddress = () => {
  const zipCodeDetails = async (zipcode) => {
    if (zipcode.length !== 9) return;
    const response = await axios.get(
      `https://viacep.com.br/ws/${zipcode}/json/`
    );

    return {
      neighborhood: response.data.bairro,
      city: response.data.localidade,
      state: response.data.estado,
      stateInitials: response.data.uf,
      street: response.data.logradouro,
    };
  };

  return {
    zipCodeDetails,
  };
};
