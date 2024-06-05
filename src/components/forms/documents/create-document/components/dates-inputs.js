import { Box } from "@chakra-ui/react";
import { CalendarCustom } from "components/calendar";
import { FormInput } from "components/components";
import React, { useRef, useState } from "react";

const DatesInputs = ({ register, errors, setValue }) => {
  const [isShowingCalendarInclusion, setIsShowingCalendarInclusion] =
    useState(false);
  const [isShowingCalendarRevision, setIsShowingCalendarRevision] =
    useState(false);
  const [isShowingCalendarCreate, setIsShowingCalendarCreate] = useState(false);

  const documentInclusionDateRef = useRef(null);
  const documentRevisionDateRef = useRef(null);
  const documentCreateDateRef = useRef(null);

  return (
    <>
      <Box position="relative" w="100%">
        <FormInput
          ref={documentInclusionDateRef}
          variant="auth"
          fontSize="sm"
          ms={{ base: "0px", md: "0px" }}
          type="text"
          margin="20px 0 20px 0 "
          placeholder="dd/mm/yyyy"
          fontWeight="500"
          size="lg"
          borderRadius="6px"
          bgColor={"primary.50"}
          label={"Data de inclusão (Sistema)"}
          onClick={() =>
            setIsShowingCalendarInclusion(!isShowingCalendarInclusion)
          }
          width="100%"
          autocomplete="off"
          onChange={(e) => {
            if (e.target.value.length === 10)
              setIsShowingCalendarInclusion(false);
          }}
          {...register("inclusionDate")}
          error={errors.inclusionDate?.message}
        />
        {isShowingCalendarInclusion && (
          <Box position={"absolute"} top="100%" left={0} zIndex={2} w="100%">
            <CalendarCustom
              onChangeDate={(date) => {
                const day = String(date.getDate()).padStart(2, "0");
                const month = String(date.getMonth() + 1).padStart(2, "0");
                const year = date.getFullYear();

                const formattedDate = `${day}/${month}/${year}`;

                setValue("inclusionDate", formattedDate);
                setIsShowingCalendarInclusion(!isShowingCalendarInclusion);
              }}
            />
          </Box>
        )}
      </Box>
      <Box position="relative" w="100%">
        <FormInput
          ref={documentRevisionDateRef}
          variant="auth"
          fontSize="sm"
          ms={{ base: "0px", md: "0px" }}
          type="text"
          margin="20px 0 20px 0 "
          placeholder="dd/mm/yyyy"
          fontWeight="500"
          size="lg"
          borderRadius="6px"
          bgColor={"primary.50"}
          label={"Data de revisão (Documento)"}
          {...register("revisionDate")}
          onClick={() =>
            setIsShowingCalendarRevision(!isShowingCalendarRevision)
          }
          width="100%"
          autocomplete="off"
          onChange={(e) => {
            if (e.target.value.length === 10)
              setIsShowingCalendarRevision(false);
          }}
          {...register("revisionDate")}
          error={errors.revisionDate?.message}
        />
        {isShowingCalendarRevision && (
          <Box position={"absolute"} top="100%" left={0} zIndex={2} w="100%">
            <CalendarCustom
              onChangeDate={(date) => {
                const day = String(date.getDate()).padStart(2, "0");
                const month = String(date.getMonth() + 1).padStart(2, "0");
                const year = date.getFullYear();

                const formattedDate = `${day}/${month}/${year}`;

                setValue("revisionDate", formattedDate);
                setIsShowingCalendarRevision(!isShowingCalendarRevision);
              }}
            />
          </Box>
        )}
      </Box>
      <Box position="relative" w="100%">
        <FormInput
          ref={documentCreateDateRef}
          variant="auth"
          fontSize="sm"
          ms={{ base: "0px", md: "0px" }}
          type="text"
          margin="20px 0 20px 0 "
          placeholder="dd/mm/yyyy"
          fontWeight="500"
          size="lg"
          borderRadius="6px"
          bgColor={"primary.50"}
          label={"Data de criação (Documento)"}
          {...register("createDate")}
          onClick={() => setIsShowingCalendarCreate(!isShowingCalendarCreate)}
          width="100%"
          autocomplete="off"
          onChange={(e) => {
            if (e.target.value.length === 10) setIsShowingCalendarCreate(false);
          }}
          {...register("createDate")}
          error={errors.createDate?.message}
        />
        {isShowingCalendarCreate && (
          <Box position={"absolute"} top="100%" left={0} zIndex={2} w="100%">
            <CalendarCustom
              onChangeDate={(date) => {
                const day = String(date.getDate()).padStart(2, "0");
                const month = String(date.getMonth() + 1).padStart(2, "0");
                const year = date.getFullYear();

                const formattedDate = `${day}/${month}/${year}`;

                setValue("createDate", formattedDate);
                setIsShowingCalendarCreate(!isShowingCalendarCreate);
              }}
            />
          </Box>
        )}
      </Box>
    </>
  );
};

export default DatesInputs;
