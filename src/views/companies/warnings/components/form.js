import { Box, HStack, Text, VStack } from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import React, { useContext, useEffect, useRef, useState } from "react";
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import SelectInput from "components/select";
import { ButtonPrimary } from "components/button-primary";
import TextEditor from "components/text-editor-mce";
import { WarningsContext } from "providers/warnings";
import { FormInput } from "components/components";
import { CalendarCustom } from "components/calendar";
import moment from "moment";

const warningSchema = Yup.object().shape({
  showWarning: Yup.string(),
});

const WarningsForm = ({ formRef, formValues }) => {
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isShowingCalendar, setIsShowingCalendar] = useState(false);
  const richTextRef = useRef();
  const dateRef = useRef();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({ resolver: yupResolver(warningSchema) });
  const { createWarning, getCompanyWarnings } = useContext(WarningsContext);

  const onSubmit = async (data) => {
    setIsLoading(true);

    if (data.expiredAt) {
      data.expiredAt = moment(data.expiredAt, "DD/MM/YYYY").format(
        "YYYY-MM-DD"
      );
    }
    await createWarning({
      ...data,
      warningMessage: description,
    });

    setIsLoading(false);
  };

  useEffect(() => {
    getCompanyWarnings().then((res) => {
      setDescription(res.warningMessage);
      setValue(
        "expiredAt",
        res.expiredAt ? moment(res.expiredAt).format("DD/MM/YYYY") : null
      );
      setValue("showWarning", res.showWarning ? 1 : 0);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <VStack
      as={"form"}
      onSubmit={handleSubmit(onSubmit)}
      ref={formRef}
      w={"100%"}
      alignItems={"start"}
      backgroundColor={"white"}
      border={"1px solid #E0E0E0"}
      padding={"20px"}
      borderRadius={"6px"}
    >
      <SelectInput
        label="Exibir aviso?"
        {...register("showWarning")}
        errors={errors.showWarning}
        defaultValue={{ label: "Sim", value: 1 }}
        options={[
          {
            label: "Sim",
            value: 1,
          },
          {
            label: "Não",
            value: 0,
          },
        ]}
      />
      <Box position="relative" w="100%">
        <FormInput
          ref={dateRef}
          variant="auth"
          fontSize="sm"
          ms={{ base: "0px", md: "0px" }}
          type="text"
          margin={{
            lg: "20px 0 20px 0 ",
            sm: "0 0 10px 0 ",
          }}
          placeholder="dd/mm/yyyy"
          fontWeight="500"
          size="lg"
          borderRadius="6px"
          bgColor={"primary.50"}
          label={"Data de inicio"}
          {...register("expiredAt")}
          onClick={() => setIsShowingCalendar(!isShowingCalendar)}
          width="100%"
          autocomplete="off"
          onChange={(e) => {
            if (e.target.value.length === 10) setIsShowingCalendar(false);
          }}
          error={errors.date?.message}
        />
        {isShowingCalendar && (
          <Box position={"absolute"} top="80%" left={0} zIndex={3} w="100%">
            <CalendarCustom
              onChangeDate={(date) => {
                const day = String(date.getDate()).padStart(2, "0");
                const month = String(date.getMonth() + 1).padStart(2, "0");
                const year = date.getFullYear();

                const formattedDate = `${day}/${month}/${year}`;

                setValue("expiredAt", formattedDate);
                setIsShowingCalendar(!isShowingCalendar);
              }}
            />
          </Box>
        )}
      </Box>
      <Text fontSize="sm" fontWeight="500" paddingLeft={"5px"}>
        Mensagem
      </Text>
      <TextEditor
        value={description}
        onChange={setDescription}
        ref={richTextRef}
      />
      <HStack w={"100%"} justifyContent={"center"}>
        <ButtonPrimary
          fontSize="sm"
          fontWeight="bold"
          h="50"
          bgColor={"primary.100"}
          _hover={{ bgColor: "primary.200" }}
          textColor={"white"}
          boxShadow="0 4px 16px rgba(0, 0, 0, 0.2)"
          borderRadius="7px"
          _active={{ bgColor: "primary.200" }}
          label={"Disparar Aviso"}
          type="submit"
          width="150px"
          isLoading={isLoading}
        />
      </HStack>
    </VStack>
  );
};

export default WarningsForm;
