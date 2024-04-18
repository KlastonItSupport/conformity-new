import { useBreakpointValue } from "@chakra-ui/react";

export const useBreakpoint = () => {
  const isMobile = useBreakpointValue({
    base: false,
    md: false,
    lg: false,
    sm: true,
  });
  const isIpad = useBreakpointValue({ base: false, lg: false, md: true });
  const isDesktop = !isMobile && !isIpad ? true : false;

  return {
    isMobile,
    isIpad,
    isDesktop,
  };
};
