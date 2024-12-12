import { Box, HStack, VStack } from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { FormInput } from "components/components";
import React, { useContext, useEffect, useRef, useState } from "react";
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { sleep } from "helpers/sleep";
import SelectInput from "components/select";
import moment from "moment";
import { CalendarCustom } from "components/calendar";
import { FormTextArea } from "components/components";
import TextEditor from "components/text-editor-mce";
import { BlogCategoriesContext } from "providers/blog-categories";

const blogSchema = Yup.object().shape({
  title: Yup.string().required("Campo obrigatório"),
  blogCategoryId: Yup.string().required("Campo obrigatório"),
  status: Yup.string().required("Campo obrigatório"),
  tag: Yup.string().required("Campo obrigatório"),
  goal: Yup.string().required("Campo obrigatório"),
  resume: Yup.string().required("Campo obrigatório"),
  exbitionDate: Yup.string().required("Campo obrigatório"),
});

const BlogForm = ({
  formValues,
  formRef,
  event = "add",
  onAdd,
  onEdit,
  setLoading,
  onClose,
  id,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({ resolver: yupResolver(blogSchema) });

  const { getBlogCategories } = useContext(BlogCategoriesContext);
  const dateRef = useRef();
  const [isShowingCalendar, setIsShowingCalendar] = useState(false);
  const [description, setDescription] = useState("");
  const [blogCategoriesOptions, setBlogCategoriesOptions] = useState([]);
  const richTextRef = useRef(null);

  const onSubmit = async (data) => {
    setLoading(true);
    data.text = description;
    if (data.exbitionDate) {
      data.exbitionDate = moment(data.exbitionDate, "DD/MM/YYYY").format(
        "YYYY-MM-DD"
      );
    }

    if (event === "add") {
      sleep(1000);
      const service = await onAdd(data);
      onClose(service);
      setLoading(false);
      return;
    }

    const service = await onEdit({ ...data, id });
    setLoading(false);
    onClose(service);
  };

  useEffect(() => {
    getBlogCategories(1, "", 10000).then((data) => {
      setBlogCategoriesOptions(
        data.items.map((item) => {
          return { label: item.name, value: item.id };
        })
      );

      if (formValues) {
        setDescription(formValues.text);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const exbitionDate = (
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
        {...register("exbitionDate")}
        onClick={() => setIsShowingCalendar(!isShowingCalendar)}
        width="100%"
        autocomplete="off"
        onChange={(e) => {
          if (e.target.value.length === 10) setIsShowingCalendar(false);
        }}
        error={errors.exbitionDate?.message}
        defaultValue={
          formValues && formValues.exbitionDate
            ? moment(formValues.exbitionDate).format("DD/MM/YYYY")
            : null
        }
      />
      {isShowingCalendar && (
        <Box position={"absolute"} top="80%" left={0} zIndex={2} w="100%">
          <CalendarCustom
            onChangeDate={(date) => {
              const day = String(date.getDate()).padStart(2, "0");
              const month = String(date.getMonth() + 1).padStart(2, "0");
              const year = date.getFullYear();

              const formattedDate = `${day}/${month}/${year}`;

              setValue("exbitionDate", formattedDate);
              setIsShowingCalendar(!isShowingCalendar);
            }}
          />
        </Box>
      )}
    </Box>
  );

  return (
    <VStack
      as={"form"}
      onSubmit={handleSubmit(onSubmit)}
      ref={formRef}
      w={"100%"}
      alignItems={"start"}
    >
      <FormInput
        variant="auth"
        fontSize="sm"
        type="text"
        placeholder="Ex: Gerente de RH"
        margin="0 0 10px 0 "
        fontWeight="500"
        size="lg"
        borderRadius="6px"
        bgColor={"primary.50"}
        label="Título:"
        width="100%"
        {...register("title")}
        error={errors.title?.message}
        defaultValue={formValues?.title}
      />
      <VStack w={"100%"} alignItems={"start"}>
        <SelectInput
          label="Categorias"
          {...register("blogCategoryId")}
          errors={errors.blogCategoryId}
          paddingLabel="0"
          options={blogCategoriesOptions}
          defaultValue={
            formValues && formValues.blogCategoryId
              ? {
                  label: formValues.blogCategoryName,
                  value: formValues.blogCategoryId,
                }
              : null
          }
        />
        <SelectInput
          label="Status"
          {...register("status")}
          errors={errors.status}
          paddingLabel="0"
          options={[
            {
              label: "Ativo",
              value: "ativo",
            },
            {
              label: "Inativo",
              value: "inativo",
            },
          ]}
          defaultValue={
            formValues && formValues.status
              ? {
                  label: formValues.status,
                  value: formValues.status,
                }
              : null
          }
        />
      </VStack>
      <HStack w={"100%"}>
        <FormInput
          variant="auth"
          fontSize="sm"
          type="text"
          placeholder="Ex: Novidade no Conformity"
          margin="0 0 10px 0 "
          fontWeight="500"
          size="lg"
          borderRadius="6px"
          bgColor={"primary.50"}
          label="Tag"
          width="100%"
          {...register("tag")}
          error={errors.tag?.message}
          defaultValue={formValues?.tag}
        />
        {exbitionDate}
      </HStack>
      <FormTextArea
        label={"Meta"}
        {...register("goal")}
        error={errors.goal?.message}
        defaultValue={formValues?.goal}
        height={"125px"}
        placeholder="Descreva a meta do seu post. Exemplo: Criamos x para ..."
      />
      <FormTextArea
        label={"Resumo"}
        {...register("resume")}
        error={errors.resume?.message}
        defaultValue={formValues?.resume}
        height={"125px"}
        placeholder="Descreva o resumo do seu post. Exemplo: Este post será sobre ..."
      />
      <TextEditor
        value={description}
        onChange={setDescription}
        ref={richTextRef}
      />
    </VStack>
  );
};

export default BlogForm;
