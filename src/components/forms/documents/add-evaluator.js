import { yupResolver } from "@hookform/resolvers/yup";
import SelectInput from "components/select";
import { useContext, useEffect, useState } from "react";
import { addEvaluatorSchema } from "./schemas/add-evaluator.schema";
import { useForm } from "react-hook-form";
import { Checkbox, Flex } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { useBreakpoint } from "hooks/usebreakpoint";
import { api } from "api/api";
import { AuthContext } from "providers/auth";

const AddEvaluatorForm = ({ onClose, formRef, onAddEvaluator, documentId }) => {
  const { t } = useTranslation();
  const { isMobile } = useBreakpoint();
  const { getToken } = useContext(AuthContext);

  const [companyUsers, setCompanyUsers] = useState([]);
  const [checkBoxSelected, setCheckBoxSelected] = useState({
    reviewed: true,
    approved: true,
    edited: true,
    deleted: true,
  });

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(addEvaluatorSchema),
  });

  const onSubmit = async (data) => {
    const formattedData = { ...data, ...checkBoxSelected, documentId };
    console.log("formattedData", formattedData);
    await onAddEvaluator(formattedData);
    onClose();
  };

  const getCompanyUsers = async () => {
    const response = await api.get("/companies/get-users", {
      headers: { Authorization: `Bearer ${getToken()}` },
    });

    setCompanyUsers(
      response.data.map((user) => {
        return { label: user.name, value: user.id };
      })
    );
  };

  useEffect(() => {
    getCompanyUsers();
  }, []);

  const buildCheckBoxes = (key, label) => {
    return (
      <Checkbox
        pr={"25px"}
        padding={isMobile ? "10px" : 0}
        isChecked={checkBoxSelected[key]}
        onChange={(e) => {
          setCheckBoxSelected({
            ...checkBoxSelected,
            [key]: e.target.checked,
          });
        }}
      >
        {t(`${label}`)}
      </Checkbox>
    );
  };
  return (
    <form
      style={{ width: "100%", padding: "" }}
      onSubmit={handleSubmit(onSubmit)}
      ref={formRef}
    >
      <SelectInput
        label="Nome do avaliador / Gestor"
        placeholder="Selecione um Avaliador"
        options={companyUsers}
        {...register("userId")}
        error={errors.userId?.message}
      />
      <Flex
        direction={isMobile ? "column" : "row"}
        justifyContent={"space-between"}
        alignItems={isMobile ? "start" : "center"}
      >
        {buildCheckBoxes("reviewed", "Revisão?")}
        {buildCheckBoxes("approved", "Aprovar?")}
        {buildCheckBoxes("edited", "Editar?")}
        {buildCheckBoxes("deleted", "Deletar?")}
      </Flex>
    </form>
  );
};

export default AddEvaluatorForm;
