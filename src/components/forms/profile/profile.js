import { Box } from "@chakra-ui/react";
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

  return (
    <form
      style={{ width: "100%", padding: "0 20px" }}
      onSubmit={handleSubmit(onSubmit)}
    >
      <FormInput
        variant="auth"
        fontSize="sm"
        ms={{ base: "0px", md: "0px" }}
        type="file"
        margin="0 0 10px 0 "
        fontWeight="500"
        size="lg"
        borderRadius="6px"
        bgColor={"primary.50"}
        label={t("Insira sua foto")}
        {...register("profilePic")}
        className="center-file-input"
        error={errors.profilePic?.message}
      />
      <FormInput
        variant="auth"
        fontSize="sm"
        ms={{ base: "0px", md: "0px" }}
        type="text"
        placeholder="Bruno Santos"
        margin="0 0 10px 0 "
        fontWeight="500"
        size="lg"
        borderRadius="6px"
        bgColor={"primary.50"}
        label={t("Nome *")}
        width="100%"
        {...register("name")}
        error={errors.name?.message}
        defaultValue={user.name}
      />
      <FormInput
        variant="auth"
        fontSize="sm"
        ms={{ base: "0px", md: "0px" }}
        type="text"
        placeholder="(xx) xxxx-xxxx"
        margin="0 0 10px 0 "
        fontWeight="500"
        size="lg"
        borderRadius="6px"
        bgColor={"primary.50"}
        label={t("Telefone *")}
        width="100%"
        defaultValue={user.celphone ?? ""}
        {...register("celphone")}
        error={errors.celphone?.message}
      />
      <FormInput
        variant="auth"
        fontSize="sm"
        ms={{ base: "0px", md: "0px" }}
        type="text"
        placeholder="dd/mm/yyyy"
        margin="0 0 10px 0 "
        fontWeight="500"
        size="lg"
        borderRadius="6px"
        bgColor={"primary.50"}
        label={t("Data de aniversário")}
        onClick={() => setIsShowingCalendar(!isShowingCalendar)}
        width="100%"
        defaultValue={user.birthDate ?? ""}
        autocomplete="off"
        {...register("birthday")}
        error={errors.birthday?.message}
        onChange={(e) => {
          if (e.target.value.length === 10) setIsShowingCalendar(false);
        }}
      />
      {isShowingCalendar && (
        <Box
          position={"absolute"}
          top={{ lg: "410px", md: "410px", sm: "420px" }}
          zIndex={2}
          w={{ sm: "80%" }}
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
        label={t("Salvar")}
        onClick={() => {}}
        width="150px"
        isLoading={isLoading}
        type="submit"
      />
    </form>
  );
};
