import { yupResolver } from "@hookform/resolvers/yup";
import SelectInput from "components/select";
import React, { useEffect } from "react";
import { addEvaluatorSchema } from "./schemas/add-evaluator.schema";
import { useForm } from "react-hook-form";
import { Checkbox, Flex } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { useBreakpoint } from "hooks/usebreakpoint";

const AddEvaluatorForm = ({ onClose, formRef }) => {
  const { t } = useTranslation();
  const { isMobile } = useBreakpoint();
  const [checkBoxSelected, setCheckBoxSelected] = React.useState({
    revision: true,
    approve: true,
    edit: true,
    delete: true,
  });

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(addEvaluatorSchema),
  });

  const onSubmit = async (data) => {
    onClose();
  };

  useEffect(() => {
    console.log(checkBoxSelected, "checkBoxSelected");
  }, [checkBoxSelected]);

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
        options={[
          {
            label: "Bruno",
            value: "1",
          },
          {
            label: "Richard",
            value: "2",
          },
        ]}
        placeholder="Selecione um Avaliador"
        defaultValue={{
          label: "Selecione um grupo",
          value: "none-group-participant",
        }}
        {...register("evaluator")}
        error={errors.evaluator?.message}
      />
      <Flex
        direction={isMobile ? "column" : "row"}
        justifyContent={"space-between"}
        alignItems={isMobile ? "start" : "center"}
      >
        {buildCheckBoxes("revision", "Revisão?")}
        {buildCheckBoxes("approve", "Aprovar?")}
        {buildCheckBoxes("edit", "Editar?")}
        {buildCheckBoxes("delete", "Deletar?")}
      </Flex>
    </form>
  );
};

export default AddEvaluatorForm;
