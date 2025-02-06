import { Box, VStack, HStack, Text, Avatar } from "@chakra-ui/react";
import { CalendarCustom } from "../../calendar/index";
import { FormInput } from "components/components";
import React, { useContext, useState } from "react";
import { ButtonPrimary } from "components/button-primary";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import editProfileSchema from "./schema";
import { AuthContext } from "providers/auth";
import { useTranslation } from "react-i18next";
import { handlingFileToBase64 } from "helpers/buffer-to-base-64";

export const ProfileForm = () => {
  const [isShowingCalendar, setIsShowingCalendar] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const { editProfile, user } = useContext(AuthContext);
  const { t } = useTranslation();

  const {
    handleSubmit,
    register,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: yupResolver(editProfileSchema),
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    const profilePic = data.profilePic[0];
    let profilePicFileName;
    let profilePicBuffer;
    let profilePicFileType;

    if (profilePic) {
      const fileTreated = await handlingFileToBase64(profilePic);
      profilePicBuffer = fileTreated.base;
      profilePicFileName = fileTreated.name;
      profilePicFileType = fileTreated.type;
    }

    await editProfile({
      ...data,
      profilePic: profilePicBuffer,
      fileName: profilePicFileName,
      fileType: profilePicFileType,
    });

    setIsLoading(false);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const profilePicInput = (
    <Box 
      w="100%"
      display="flex"
      flexDirection="column"
      alignItems="center"
      gap={4}
      mb={4}
    >
      <Avatar 
        size="2xl"
        src={previewImage || user.profilePic}
        name={user.name}
        bg="primary.100"
      />
      <Box flex={1} h="85px" maxW="320px">
        <FormInput
          variant="auth"
          fontSize="sm"
          type="file"
          accept="image/*"
          fontWeight="500"
          size="lg"
          h="45px"
          borderRadius="7px"
          bgColor="primary.50"
          label={t("Insira sua foto")}
          {...register("profilePic")}
          className="center-file-input"
          error={errors.profilePic?.message}
          onChange={(e) => {
            handleImageChange(e);
            register("profilePic").onChange(e);
          }}
        />
      </Box>
    </Box>
  );

  const nameInput = (
    <Box flex={1} h="85px">
      <FormInput
        variant="auth"
        fontSize="sm"
        type="text"
        placeholder={t("Ex: Bruno Santos")}
        fontWeight="500"
        size="lg"
        h="45px"
        borderRadius="7px"
        bgColor="primary.50"
        label={t("Nome *")}
        {...register("name")}
        error={errors.name?.message}
        defaultValue={user.name}
      />
    </Box>
  );

  const phoneInput = (
    <Box flex={1} h="85px">
      <FormInput
        variant="auth"
        fontSize="sm"
        type="text"
        placeholder={t("(xx) xxxx-xxxx")}
        fontWeight="500"
        size="lg"
        h="45px"
        borderRadius="7px"
        bgColor="primary.50"
        label={t("Telefone *")}
        defaultValue={user.celphone ?? ""}
        {...register("celphone")}
        error={errors.celphone?.message}
      />
    </Box>
  );

  const birthdayInput = (
    <Box flex={1} h="85px" position="relative">
      <FormInput
        variant="auth"
        fontSize="sm"
        type="text"
        placeholder={t("dd/mm/yyyy")}
        fontWeight="500"
        size="lg"
        h="45px"
        borderRadius="7px"
        bgColor="primary.50"
        label={t("Data de aniversário")}
        onClick={() => setIsShowingCalendar(!isShowingCalendar)}
        defaultValue={user.birthday ?? ""}
        autoComplete="off"
        {...register("birthday")}
        error={errors.birthday?.message}
        onChange={(e) => {
          if (e.target.value.length === 10) setIsShowingCalendar(false);
        }}
      />
      {isShowingCalendar && (
        <Box
          position="absolute"
          top="100%"
          left="0"
          zIndex={2}
          w="100%"
          maxW="320px"
          bg="white"
          boxShadow="lg"
          borderRadius="md"
          border="1px solid"
          borderColor="gray.200"
        >
          <CalendarCustom
            onChangeDate={(date) => {
              const day = String(date.getDate()).padStart(2, "0");
              const month = String(date.getMonth() + 1).padStart(2, "0");
              const year = date.getFullYear();

              const formattedDate = `${day}/${month}/${year}`;

              setValue("birthday", formattedDate);
              setIsShowingCalendar(!isShowingCalendar);
            }}
          />
        </Box>
      )}
    </Box>
  );

  return (
    <VStack
      as="form"
      onSubmit={handleSubmit(onSubmit)}
      w="100%"
      spacing={6}
      align="stretch"
      bg="white"
      borderRadius="lg"
      boxShadow="sm"
      p={6}
    >
      <Text fontSize="xl" fontWeight="bold" color="gray.700">
        {t("Informações do Perfil")}
      </Text>

      {profilePicInput}
      
      <VStack spacing={4} align="stretch">
        <HStack spacing={4} align="flex-start">
          {nameInput}
          {phoneInput}
        </HStack>
        
        <Box maxW="50%">
          {birthdayInput}
        </Box>
      </VStack>

      <Box pt={4}>
        <ButtonPrimary
          fontSize="sm"
          fontWeight="bold"
          h="40px"
          bgColor="header.100"
          _hover={{ bgColor: "primary.200" }}
          textColor="white"
          boxShadow="0 4px 16px rgba(0, 0, 0, 0.2)"
          borderRadius="7px"
          _active={{ bgColor: "primary.200" }}
          label={t("Salvar")}
          type="submit"
          width="150px"
          isLoading={isLoading}
        />
      </Box>
    </VStack>
  );
};
