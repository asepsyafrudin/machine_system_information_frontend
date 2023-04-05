import React from "react";
import { Button, Modal } from "react-bootstrap";

function ModalAlert(props) {
  const { show, onHandleClose, message } = props;

  const handleClose = () => {
    onHandleClose(false);
  };
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Alert</Modal.Title>
      </Modal.Header>
      <Modal.Body>{message}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ModalAlert;
