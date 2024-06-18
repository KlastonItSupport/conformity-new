import { Divider, HStack, Text, VStack, useDisclosure } from "@chakra-ui/react";
import { NotePencil, Trash } from "@phosphor-icons/react";
import { ModalForm } from "components/components";
import { FeedDescriptionForm } from "components/components";
import { DeleteModal } from "components/components";
import { sleep } from "helpers/sleep";
import moment from "moment";
import React, { useRef, useState } from "react";
import { useTranslation } from "react-i18next";

const FeedInfo = ({ author, date, text, onDelete, onEdit, id }) => {
  const { t } = useTranslation();
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const [isEditLoading, setIsEditLoading] = useState(false);
  const formRef = useRef(null);

  const dateFormatted = moment(date, "YYYY-MM-DD HH:mm:ss").format(
    "DD/MM/YYYY HH:mm:ss"
  );

  const {
    isOpen: isDeleteModalOpen,
    onOpen: onDeleteModalOpen,
    onClose: onDeleteModalClose,
  } = useDisclosure();

  const {
    isOpen: isEditModalOpen,
    onOpen: onEditModalOpen,
    onClose: onEditModalClose,
  } = useDisclosure();

  return (
    <>
      <VStack
        bgColor={"#FFFFFF"}
        marginInlineStart={0}
        marginTop={"10"}
        p={"25px"}
        border={"1px solid #ddd"}
        alignItems={"start"}
      >
        <HStack w={"100%"} align={"start"} justifyContent={"space-between"}>
          <VStack alignItems={"start"}>
            <Text fontSize={"20px"} color={"header.100"}>
              Publicado por: {author}
            </Text>
            <Text fontSize={"13px"} fontWeight={"bold"} color={"header.100"}>
              Publicado em:{" "}
              <Text as={"span"} fontWeight={"normal"}>
                {" "}
                {dateFormatted}
              </Text>
            </Text>
          </VStack>
          <HStack bgColor={""} align={"start"} justifyContent={"flex-end"}>
            <NotePencil
              size={16}
              weight="fill"
              color={"#0075df"}
              cursor={"pointer"}
              onClick={onEditModalOpen}
            />
            <Trash
              size={16}
              color="#0086FF"
              weight="fill"
              cursor={"pointer"}
              onClick={onDeleteModalOpen}
            />
          </HStack>
        </HStack>
        <Divider color={"#ddd"} />
        <Text>{text}</Text>
      </VStack>
      <DeleteModal
        title={t("Excluir Feed")}
        subtitle={t("Tem certeza de que deseja excluir este item do Feed?")}
        isOpen={isDeleteModalOpen}
        onClose={onDeleteModalClose}
        onConfirm={async () => {
          setIsDeleteLoading(true);
          await onDelete(id);
          setIsDeleteLoading(false);
          onDeleteModalClose();
        }}
        isLoading={isDeleteLoading}
      />
      <ModalForm
        isOpen={isEditModalOpen}
        onClose={onEditModalClose}
        form={
          <FeedDescriptionForm
            formRef={formRef}
            onClose={onEditModalClose}
            defaultValue={text}
            handleEdit={(item) => {
              onEdit(id, item);
            }}
            setIsLoading={setIsEditLoading}
          />
        }
        formRef={formRef}
        title={t("Editar Feed")}
        description={t("Tem certeza de que deseja Editar este item do Feed?")}
        leftButtonLabel={t("Cancelar")}
        rightButtonLabel={t("Editar")}
        modalSize="xl"
        isLoading={isEditLoading}
      />
    </>
  );
};

export default FeedInfo;
