import { Box, HStack, VStack } from "@chakra-ui/react";
import { CalendarCustom } from "components/calendar";
import { FormInput } from "components/components";
import SelectInput from "components/select";
import React, { useRef, useState } from "react";

const TimeAndRepeat = ({ register, errors, setValue }) => {
  const calendarRef = useRef();
  const [isShowingCalendar, setIsShowingCalendar] = useState(false);

  const hoursOptions = Array.from({ length: 24 }, (_, i) => {
    const hour = String(i).padStart(2, "0");
    return { label: `${hour}:00`, value: `${hour}:00` };
  });

  return (
    <HStack>
      <VStack w={"100%"} alignItems={"start"}>
        <SelectInput
          label="Hora do aviso"
          {...register("hour")}
          errors={errors.hour}
          options={hoursOptions}
        />
      </VStack>
      <Box position="relative" w="100%">
        <FormInput
          ref={calendarRef}
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
          label={"Repetir até"}
          onClick={() => setIsShowingCalendar(!isShowingCalendar)}
          width="100%"
          autocomplete="off"
          onChange={(e) => {
            if (e.target.value.length === 10) setIsShowingCalendar(false);
          }}
          {...register("dataEnd")}
          error={errors.dataEnd?.message}
          // defaultValue={moment(formValues.createdAt ?? new Date()).format(
          //   "DD/MM/YYYY"
          // )}
        />
        {isShowingCalendar && (
          <Box position={"absolute"} top="100%" left={0} zIndex={2} w="100%">
            <CalendarCustom
              onChangeDate={(date) => {
                const day = String(date.getDate()).padStart(2, "0");
                const month = String(date.getMonth() + 1).padStart(2, "0");
                const year = date.getFullYear();

                const formattedDate = `${day}/${month}/${year}`;

                setValue("dataEnd", formattedDate);
                setIsShowingCalendar(!isShowingCalendar);
              }}
            />
          </Box>
        )}
      </Box>
    </HStack>
  );
};

export default TimeAndRepeat;
