import { useDisclosure } from "@chakra-ui/react";
import WarningModal from "components/warning";
import { WarningsContext } from "providers/warnings";
import React, { useEffect, useContext, useState } from "react";

const withWarningCheck = (WrappedComponent) => {
  return (props) => {
    const [warnings, setWarnings] = useState([]);
    const { getWarnings, readWarning } = useContext(WarningsContext);

    const {
      isOpen: isWarningModalOpen,
      onOpen: onWarningModalOpen,
      onClose: onWarningModalClose,
    } = useDisclosure();

    const handleWarning = async () => {
      const fetchedWarnings = await getWarnings();
      setWarnings(fetchedWarnings);
      onWarningModalOpen();
    };

    const handleClose = async (warningId) => {
      onWarningModalClose();
    };

    const onConfirm = async (warningId) => {
      await readWarning(warningId);
      handleClose(warningId);
    };

    useEffect(() => {
      handleWarning();
      // eslint-disable-next-line
    }, []);

    return (
      <>
        {warnings && !warnings.isExpired && (
          <WarningModal
            isOpen={isWarningModalOpen}
            onClose={handleClose}
            warning={warnings}
            onConfirm={onConfirm}
          />
        )}
        <WrappedComponent {...props} />
      </>
    );
  };
};

export default withWarningCheck;
