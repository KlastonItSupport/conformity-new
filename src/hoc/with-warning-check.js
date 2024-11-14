import { useDisclosure } from "@chakra-ui/react";
import WarningModal from "components/warning";
import { WarningsContext } from "providers/warnings";
import React, { useEffect, useContext, useState } from "react";

const withWarningCheck = (WrappedComponent) => {
  return (props) => {
    const [warnings, setWarnings] = useState([]);
    const [currentWarningIndex, setCurrentWarningIndex] = useState(0);
    const { getWarnings, readWarning } = useContext(WarningsContext);

    const {
      isOpen: isWarningModalOpen,
      onOpen: onWarningModalOpen,
      onClose: onWarningModalClose,
    } = useDisclosure();

    const handleWarning = async () => {
      const fetchedWarnings = await getWarnings();
      setWarnings(fetchedWarnings);
      if (fetchedWarnings.length > 0) {
        onWarningModalOpen();
      }
    };

    const handleClose = async (warningId) => {
      onWarningModalClose();
      await readWarning(warningId);

      if (currentWarningIndex < warnings.length - 1) {
        setCurrentWarningIndex((prevIndex) => prevIndex + 1);
        onWarningModalOpen();
      }
    };

    useEffect(() => {
      handleWarning();
      // eslint-disable-next-line
    }, []);

    return (
      <>
        {warnings.length > 0 && (
          <WarningModal
            isOpen={isWarningModalOpen}
            onClose={handleClose}
            warning={warnings[currentWarningIndex]}
          />
        )}
        <WrappedComponent {...props} />
      </>
    );
  };
};

export default withWarningCheck;
