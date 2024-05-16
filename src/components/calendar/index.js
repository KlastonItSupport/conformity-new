import { Box } from "@chakra-ui/react";
import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

export const CalendarCustom = ({ onChangeDate }) => {
  const [date, setDate] = useState(new Date());

  const onChange = (date) => {
    setDate(date);
    onChangeDate(date);
  };

  return (
    <Box>
      <Calendar onChange={onChange} value={date} />
    </Box>
  );
};
