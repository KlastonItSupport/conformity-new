import { Checkbox, Text } from "@chakra-ui/react";
import React from "react";

const DaysBoxes = ({ days, setDays, error }) => {
  return (
    <>
      {days.map((day, index) => (
        <Checkbox
          key={day.value}
          margin={"5px"}
          size="md"
          _checked={{
            "& .chakra-checkbox__control": {
              background: "primary.100",
            },
          }}
          onChange={(e) => {
            const updatedDay = {
              label: day.label,
              value: day.value,
              isChecked: e.target.checked,
            };
            const daysCopy = [...days];
            daysCopy[index] = updatedDay;
            setDays(daysCopy);
          }}
          isChecked={day.isChecked}
        >
          {day.label}
        </Checkbox>
      ))}
      {error && <Text color="red.500">{error}</Text>}
    </>
  );
};

export default DaysBoxes;
