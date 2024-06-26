import { yupResolver } from "@hookform/resolvers/yup";

import React, { useContext } from "react";
import { useForm } from "react-hook-form";
import { FormInput } from "components/components";
import { categorySchema } from "./schemas/create-category.schema";
import { CategoryContext } from "providers/category";

const CategoryForm = ({ formRef, onClose, event = "add", id }) => {
  const {
    createCategory,
    setCreateCategoryIsLoading,
    editCategory,
    setEditIsLoading,
  } = useContext(CategoryContext);

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(categorySchema),
  });

  const onSubmit = async (data) => {
    if (event === "add") {
      setCreateCategoryIsLoading(true);
      const response = await createCategory(data);
      setCreateCategoryIsLoading(false);
      onClose(response);
      return;
    }
    setEditIsLoading(true);

    await editCategory(id, data);
    onClose();

    setEditIsLoading(false);
  };

  return (
    <form
      style={{ width: "100%", padding: "" }}
      onSubmit={handleSubmit(onSubmit)}
      ref={formRef}
    >
      <FormInput
        label={"Nome * "}
        {...register("name")}
        error={errors.name?.message}
      />
    </form>
  );
};

export default CategoryForm;
