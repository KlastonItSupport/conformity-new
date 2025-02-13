import { yupResolver } from "@hookform/resolvers/yup";
import FormInput from "components/form-input/form-input";
import { useForm } from "react-hook-form";
import editUsersFormSchema from "./schema";
import SelectInput from "components/select";
import { UserContext } from "providers/users";
import { useContext, useEffect, useRef, useState } from "react";
import { GroupContext } from "providers/group";
import { CompanyContext } from "providers/company";
import {
  Center,
  Flex,
  HStack,
  Spinner,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import { Plus } from "@phosphor-icons/react";
import { ModalForm } from "components/modals/modalForm";
import { GroupForm } from "components/forms/groups/group";
import { AuthContext } from "providers/auth";

export const AddUserForm = ({ formRef, onCloseModal, setLoading }) => {
  const { createUser } = useContext(UserContext);
  const { getUserInfo } = useContext(AuthContext);
  const { getGroups, createGroupIsLoading } = useContext(GroupContext);
  const { getCompanies } = useContext(CompanyContext);
  const [groupOptions, setGroupOptions] = useState([]);
  const [companyOptions, setCompanyOptions] = useState([]);
  const [groupIsLoading, setGroupIsLoading] = useState(false);
  const [companyIsLoading, setCompanyIsLoading] = useState(false);
  const groupFormRef = useRef(null);
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(editUsersFormSchema),
  });

  const {
    isOpen: isCreateGroupOpen,
    onOpen: onCreateGroupOpen,
    onClose: onCreateGroupClose,
  } = useDisclosure();

  const onSubmit = async (data) => {
    if (setLoading) setLoading(true);
    
    if (!data.companyId) {
      console.log("Por favor seleccione uma empresa");
      return;
    }

    try {
      const userData = {
        ...data,
        companyId: data.companyId,
      };

      const createdSuccessfully = await createUser(userData);
      
      if (createdSuccessfully) {
        onCloseModal(createdSuccessfully);
      }
    } catch (error) {
      if (error.response?.status === 400) {
        console.log("Invalid company selection");
      } else if (error.response?.status === 404) {
        console.log("Company not found");
      } else {
        console.log("Error creating user");
      }
    } finally {
      if (setLoading) setLoading(false);
    }
  };

  const fetchGroupData = async () => {
    try {
      const options = await getGroups(false);
      setGroupOptions(
        options.map((option) => ({ label: option.name, value: option.id }))
      );
    } catch (error) {
    } finally {
      setGroupIsLoading(false);
    }
  };

  const fetchCompaniesData = async () => {
    try {
      setCompanyIsLoading(true);
      const companies = await getCompanies();
      setCompanyOptions(
        companies.map((company) => ({ label: company.name, value: company.id }))
      );
    } catch (error) {
      console.error('Error fetching companies:', error);
    } finally {
      setCompanyIsLoading(false);
    }
  };

  useEffect(() => {
    setGroupIsLoading(true);
    setCompanyIsLoading(true);
    fetchGroupData();
    fetchCompaniesData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <form
        style={{ width: "100%" }}
        onSubmit={handleSubmit(onSubmit)}
        ref={formRef}
      >
        <FormInput
          variant="auth"
          fontSize="sm"
          ms={{ base: "0px", md: "0px" }}
          type="text"
          placeholder="Nome"
          margin="0 0 10px 0 "
          fontWeight="500"
          size="lg"
          borderRadius="6px"
          bgColor={"primary.50"}
          label="Nome *"
          width="100%"
          {...register("name")}
          error={errors.name?.message}
        />
        
        {companyIsLoading ? (
          <Center>
            <Spinner />
          </Center>
        ) : (
          <SelectInput
            label="Empresa *"
            {...register("companyId")}
            errors={errors.companyId}
            options={companyOptions}
            placeholder="Selecione uma empresa"
          />
        )}

        <FormInput
          variant="auth"
          fontSize="sm"
          ms={{ base: "0px", md: "0px" }}
          type="email"
          placeholder="emailexample@hotmail.com"
          margin="0 0 10px 0 "
          fontWeight="500"
          size="lg"
          borderRadius="6px"
          bgColor={"primary.50"}
          label="Email *"
          {...register("email")}
          error={errors.email?.message}
        />
        {groupIsLoading && (
          <Center>
            <Spinner />
          </Center>
        )}
        {!groupIsLoading && (
          <HStack
            w={"100%"}
            h={"100%"}
            alignContent={"center"}
            alignItems={"center"}
            margin="0 0 10px 0 "
          >
            <VStack
              w={"100%"}
              h={"100%"}
              alignItems={"start"}
              spacing={0}
              justify={"center"}
            >
              <SelectInput
                label="Adicionar a um Grupo"
                {...register("groupId")}
                options={groupOptions}
                placeholder="Selecione um grupo"
                defaultValue={{
                  label: "Selecione um grupo",
                  value: "none-group-participant",
                }}
              />
            </VStack>

            <Flex
              bgColor={"primary.100"}
              cursor={"pointer"}
              // borderRadius={"50%"}
              style={{ marginTop: "30px" }}
              onClick={onCreateGroupOpen}
              padding={"5px"}
            >
              <Plus color="white" size={20} weight="bold" />
            </Flex>
          </HStack>
        )}

        <FormInput
          variant="auth"
          fontSize="sm"
          ms={{ base: "0px", md: "0px" }}
          type="password"
          placeholder="emailexample@hotmail.com"
          margin="0 0 10px 0 "
          fontWeight="500"
          size="lg"
          borderRadius="6px"
          bgColor={"primary.50"}
          label="Senha *"
          {...register("password")}
          error={errors.password?.message}
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
          label="Telefone *"
          width="100%"
          {...register("celphone")}
          error={errors.celphone?.message}
        />
        <SelectInput
          label="Cargo"
          error={errors.role}
          options={[
            { label: "TI", value: "1" },
            { label: "DP", value: "a" },
            { label: "RH", value: "3" },
          ]}
          {...register("role")}
        />
        <SelectInput
          label="Departamento"
          errors={errors.departament}
          options={[
            { label: "Qualidade", value: "1" },
            { label: "Compras", value: "2" },
            { label: "Administrativo", value: "3" },
          ]}
          {...register("departament")}
        />
        <SelectInput
          label="Regra de acesso"
          errors={errors.accessRule}
          {...register("accessRule")}
          options={[
            ...(getUserInfo().accessRule === 'super-admin'
              ? [{ label: "Super Admin", value: "super-admin" }]
              : []),
            ...(getUserInfo().accessRule === 'super-admin' || getUserInfo().accessRule === 'super-user'
              ? [{ label: "Super Usuário", value: "super-user" }]
              : []),
            { label: "Usuário", value: "user" }
          ].filter(Boolean)}
        />
        <SelectInput
          label="Status"
          {...register("status")}
          errors={errors.status}
          options={[
            {
              label: "Ativo",
              value: "active",
            },
            {
              label: "Inativo",
              value: "inactive",
            },
          ]}
        />
      </form>
      <ModalForm
        isOpen={isCreateGroupOpen}
        onClose={onCreateGroupClose}
        form={
          <GroupForm
            formRef={groupFormRef}
            onCloseModal={async () => {
              await fetchGroupData();
              onCreateGroupClose();
            }}
          />
        }
        formRef={groupFormRef}
        title={"Adicionar Grupo"}
        description={""}
        leftButtonLabel={"Cancelar"}
        rightButtonLabel={"Criar"}
        isLoading={createGroupIsLoading}
      />
    </>
  );
};
