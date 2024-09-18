import { HStack, VStack } from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { FormInput } from "components/components";
import React, { useEffect, useRef, useState } from "react";
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { sleep } from "helpers/sleep";
import SelectInput from "components/select";
import { useBreakpoint } from "hooks/usebreakpoint";
import TextEditor from "components/text-editor-mce";

const contractSchema = Yup.object().shape({
  documents: Yup.array().of(Yup.string().required("Required")),
  title: Yup.string().required("Required"),
  status: Yup.string().required("Required"),
  clientType: Yup.string().required("Required"),
  startDate: Yup.string().required("Required"),
  endDate: Yup.string().required("Required"),
  value: Yup.string().required("Required"),
  description: Yup.string().required("Required"),
  dealIsClosed: Yup.string().required("Required"),
  solicitationMonth: Yup.string().required("Required"),
  solicitationYear: Yup.string().required("Required"),
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

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({ resolver: yupResolver(contractSchema) });

  const onSubmit = async (data) => {
    setLoading(true);

    if (event === "add") {
      sleep(1000);
      setLoading(false);
      onClose();
      return;
    }

    await onEdit();
    setLoading(false);
    onClose();
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
        {...register("state")}
        error={errors.state?.message}
        defaultValue={
          formValues
            ? { label: formValues?.status, value: formValues?.status }
            : { label: "Ativo", value: "Ativo" }
        }
        options={[
          {
            label: "Ativo",
            value: "Ativo",
          },
          {
            label: "Inativo",
            value: "Inativo",
          },
          {
            label: "Cancelado",
            value: "Cancelado",
          },
        ]}
      />
    </VStack>
  );

  const contractCelebrated = (
    <VStack align={"start"} w={"100%"} mt={"5px"}>
      <SelectInput
        label={"Contrato Celebrado * "}
        {...register("dealIsClosed")}
        error={errors.dealIsClosed?.message}
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
        {...register("clientName")}
        error={errors.clientName?.message}
        defaultValue={{
          label: formValues?.clientName,
          value: formValues?.clientName,
        }}
        margin
        options={[
          {
            label: "Ativo",
            value: "Ativo",
          },
          {
            label: "Inativo",
            value: "Inativo",
          },
          {
            label: "Cancelado",
            value: "Cancelado",
          },
        ]}
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

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (formValues) {
      setValue("dealIsClosed", "Não");
      setValue("solicitationMonth", formValues.solicitationMonth.toLowerCase());
      setValue("solicitationYear", formValues.solicitationMonth.toLowerCase());
      setDescription(formValues.description);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setValue]);
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
      />
      <FormInput
        label={"Responsável: * "}
        {...register("user")}
        error={errors.user?.message}
        defaultValue={formValues?.user}
      />
      {supplierInput}
      <FormInput
        variant="auth"
        fontSize="sm"
        type="text"
        placeholder="Email"
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
        placeholder="Telefone"
        margin="0 0 10px 0 "
        fontWeight="500"
        size="lg"
        borderRadius="6px"
        bgColor={"primary.50"}
        label="Telefone: "
        width="100%"
        {...register("phone")}
        error={errors.phone?.message}
        defaultValue={formValues?.phone}
      />
      <FormInput
        variant="auth"
        fontSize="sm"
        type="text"
        placeholder="Referência"
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
