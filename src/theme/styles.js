import { mode } from "@chakra-ui/theme-tools";
export const globalStyles = {
  colors: {
    primary: {
      50: "#F5FAFF",
      75: "#EBF5FF",
      100: "#0086FF",
      200: "#0075df",
    },
    header: {
      100: "#2B3D4C",
    },

    brand: {
      100: "#E9E3FF",
      200: "#422AFB",
      300: "#422AFB",
      400: "#7551FF",
      500: "#422AFB",
      600: "#3311DB",
      700: "#02044A",
      800: "#190793",
      900: "#11047A",
    },
    brandScheme: {
      100: "#E9E3FF",
      200: "#7551FF",
      300: "#7551FF",
      400: "#7551FF",
      500: "#422AFB",
      600: "#3311DB",
      700: "#02044A",
      800: "#190793",
      900: "#02044A",
    },

    secondaryGray: {
      100: "#E0E5F2",
      200: "#E1E9F8",
      300: "#F4F7FE",
      400: "#E9EDF7",
      500: "#8F9BBA",
      600: "#A3AED0",
      700: "#707EAE",
      800: "#707EAE",
      900: "#1B2559",
    },
    red: {
      100: "#FEEFEE",
      500: "#EE5D50",
      600: "#E31A1A",
    },
    blue: {
      50: "#EFF4FB",
      500: "#87A3BC",
    },

    gray: {
      100: "#FAFCFE",
    },
    green: {
      100: "#E9F8F5",
      200: "#5cb85c",
    },
  },
  styles: {
    global: (props) => ({
      'html, body': {
        overflowX: "hidden",
        bg: mode("#1f2d39", "navy.900")(props),
        fontFamily: "DM Sans",
        letterSpacing: "-0.5px",
      },
      '#root': {
        bg: mode("#1f2d39", "navy.900")(props),
        minHeight: '100vh',
      },
      '.chakra-stack': {
        bg: 'transparent',
      },
      input: {
        color: "gray.700",
      },
      html: {
        fontFamily: "DM Sans",
      },
      '.navbar': {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        base: {
          position: 'relative',
          zIndex: 1000,
        },
        md: {
          position: 'static',
          zIndex: 'auto',
        }
      },
      '.mobile-menu': {
        display: 'none',
        base: {
          position: 'absolute',
          top: '100%',
          right: 0,
          width: '100%',
          bg: 'white',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        },
        '&.active': {
          display: 'block',
        }
      },
      '.menu-toggle': {
        display: 'none',
        base: {
          display: 'block',
          cursor: 'pointer',
          padding: '1rem',
        },
        md: {
          display: 'none',
        }
      },
      '.desktop-menu': {
        base: {
          display: 'none',
        },
        md: {
          display: 'block',
        }
      }
    }),
  },
};
