import { HStack, VStack } from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { FormInput } from "components/components";
import React, { useContext, useEffect, useRef, useState } from "react";
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import SelectInput from "components/select";
import { useBreakpoint } from "hooks/usebreakpoint";
import TextEditor from "components/text-editor-mce";
import { CrmContext } from "providers/crm";

const contractSchema = Yup.object().shape({
  title: Yup.string(),
  status: Yup.string(),
  crmCompanyId: Yup.string(),
  startDate: Yup.string(),
  endDate: Yup.string(),
  value: Yup.string(),
  description: Yup.string(),
  contract: Yup.string(),
  solicitationMonth: Yup.string(),
  solicitationYear: Yup.string(),
});

const LeadsForm = ({
  formValues,
  formRef,
  event = "add",
  onAdd,
  onEdit,
  setLoading,
  onClose,
  id,
}) => {
  const { isDesktop } = useBreakpoint();
  const [yearsSolicitations, setYearsSolicitations] = useState([]);
  const [description, setDescription] = useState("");
  const richTextRef = useRef(null);
  const { getCrm } = useContext(CrmContext);
  const [crmOptions, setCrmOptions] = useState([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({ resolver: yupResolver(contractSchema) });

  const onSubmit = async (data) => {
    setLoading(true);

    if (event === "add") {
      const res = await onAdd(data);
      setLoading(false);
      onClose(res);
      return;
    }

    const res = await onEdit(id, { ...data, description });

    setLoading(false);
    onClose(res);
  };

  const currentMonth =
    new Date()
      .toLocaleString("pt-BR", { month: "long" })
      .charAt(0)
      .toUpperCase() +
    new Date().toLocaleString("pt-BR", { month: "long" }).slice(1);

  const statusInput = (
    <VStack align={"start"} w={"100%"} mt={"5px"}>
      <SelectInput
        label={"Status * "}
        {...register("status")}
        error={errors.status?.message}
        options={[
          {
            label: "Solicitado",
            value: "solicitado",
          },
          {
            label: "Em Andamento",
            value: "em andamento",
          },
          {
            label: "Cancelado",
            value: "Cancelado",
          },
          {
            label: "Recusado",
            value: "recusado",
          },
          {
            label: "Concluído",
            value: "concluido",
          },
        ]}
      />
    </VStack>
  );

  const contractCelebrated = (
    <VStack align={"start"} w={"100%"} mt={"5px"}>
      <SelectInput
        label={"Contrato Celebrado * "}
        {...register("contract")}
        error={errors.contract?.message}
        options={[
          {
            label: "Sim",
            value: "Sim",
          },
          {
            label: "Não",
            value: "Não",
          },
        ]}
      />
    </VStack>
  );

  const supplierInput = (
    <VStack align={"start"} w={"100%"} mt={"5px"}>
      <SelectInput
        label={"Cliente / Fornecedor * "}
        {...register("crmCompanyId")}
        error={errors.crmCompanyId?.message}
        defaultValue={
          formValues
            ? {
                label: formValues?.clientName,
                value: formValues?.clientName,
              }
            : {
                label: "-",
                value: "",
              }
        }
        options={crmOptions}
      />
    </VStack>
  );

  const monthSolicitation = (
    <VStack align={"start"} w={"100%"} mt={"5px"}>
      <SelectInput
        label={"Mes de solitação * "}
        {...register("solicitationMonth")}
        error={errors.solicitationMonth?.message}
        defaultValue={
          formValues
            ? { label: formValues?.status, value: formValues?.status }
            : {
                label: currentMonth,
                value: currentMonth,
              }
        }
        options={[
          {
            label: "Janeiro",
            value: "janeiro",
          },
          {
            label: "Fevereiro",
            value: "fevereiro",
          },
          {
            label: "Março",
            value: "marco",
          },
          {
            label: "Abril",
            value: "abril",
          },
          {
            label: "Maio",
            value: "maio",
          },
          {
            label: "Junho",
            value: "junho",
          },
          {
            label: "Julho",
            value: "julho",
          },
          {
            label: "Agosto",
            value: "agosto",
          },
          {
            label: "Setembro",
            value: "setembro",
          },
          {
            label: "Outubro",
            value: "outubro",
          },
          {
            label: "Novembro",
            value: "novembro",
          },
          {
            label: "Dezembro",
            value: "dezembro",
          },
        ]}
      />
    </VStack>
  );

  const yearSolicitation = (
    <VStack align={"start"} w={"100%"} mt={"5px"}>
      <SelectInput
        label={"Ano de solitação * "}
        {...register("solicitationYear")}
        defaultValue={
          formValues?.solicitationYear
            ? {
                label: formValues?.solicitationYear,
                value: formValues?.solicitationYear,
              }
            : {
                label: 2024,
                value: 2024,
              }
        }
        error={errors.solicitationYear?.message}
        options={yearsSolicitations}
      />
    </VStack>
  );

  useEffect(() => {
    const options = [];
    for (let i = 1990; i <= 2099; i++) {
      options.push({ label: i, value: i });
    }
    setYearsSolicitations(options);

    getCrm(1, "", 10000).then((res) => {
      setCrmOptions(
        res.items.map((item) => {
          return { label: item.socialReason, value: item.id };
        })
      );
    });

    if (formValues && event === "edit") {
      setValue("status", formValues.status);
      setValue("solicitationMonth", formValues.solicitationMonth);
      setValue("contract", formValues.contract);
      setDescription(formValues.description);

      getCrm(1, "", 10000).then((res) => {
        setCrmOptions(
          res.items.map((item) => {
            return { label: item.socialReason, value: item.id };
          })
        );

        setValue("crmCompanyId", formValues.crmCompanyId);
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <VStack
      as={"form"}
      onSubmit={handleSubmit(onSubmit)}
      ref={formRef}
      w={"100%"}
      alignItems={"start"}
    >
      {isDesktop ? (
        <HStack w={"100%"} justifyContent={"space-between"}>
          {statusInput}
          {contractCelebrated}
        </HStack>
      ) : (
        <VStack align={"start"} w={"100%"} mt={"5px"}>
          {statusInput}
          {contractCelebrated}
        </VStack>
      )}
      {isDesktop ? (
        <HStack w={"100%"}>
          {monthSolicitation}
          {yearSolicitation}
        </HStack>
      ) : (
        <VStack align={"start"} w={"100%"} mt={"5px"}>
          {monthSolicitation}
          {yearSolicitation}
        </VStack>
      )}

      <FormInput
        label={"Valor: * "}
        {...register("value")}
        error={errors.value?.message}
        defaultValue={formValues?.value}
        placeholder={"EX: R$349,99"}
      />
      <FormInput
        label={"Responsável: * "}
        {...register("responsable")}
        error={errors.responsable?.message}
        defaultValue={formValues?.responsable}
        placeholder={"Ex: Bruno - Head of Operations"}
      />
      {supplierInput}
      <FormInput
        variant="auth"
        fontSize="sm"
        type="text"
        placeholder="Ex: bruno@example.com"
        margin="0 0 10px 0 "
        fontWeight="500"
        size="lg"
        borderRadius="6px"
        bgColor={"primary.50"}
        label="Email: "
        width="100%"
        {...register("email")}
        error={errors.email?.message}
        defaultValue={formValues?.email}
      />

      <FormInput
        variant="auth"
        fontSize="sm"
        type="text"
        placeholder="EX: (99) 99999-9999"
        margin="0 0 10px 0 "
        fontWeight="500"
        size="lg"
        borderRadius="6px"
        bgColor={"primary.50"}
        label="Telefone: "
        width="100%"
        {...register("celphone")}
        error={errors.celphone?.message}
        defaultValue={formValues?.celphone}
      />
      <FormInput
        variant="auth"
        fontSize="sm"
        type="text"
        placeholder="Ex: José"
        margin="0 0 10px 0 "
        fontWeight="500"
        size="lg"
        borderRadius="6px"
        bgColor={"primary.50"}
        label="Referência: "
        width="100%"
        {...register("reference")}
        error={errors.reference?.message}
        defaultValue={formValues?.reference}
      />
      <TextEditor
        value={description}
        onChange={setDescription}
        ref={richTextRef}
      />
    </VStack>
  );
};

export default LeadsForm;
