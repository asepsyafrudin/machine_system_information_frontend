import React from "react";
import { Button, Modal } from "react-bootstrap";

function ModalConfirm(props) {
  const { show, onHandleClose, message, onHandleConfirm } = props;

  const handleClose = () => {
    onHandleClose(false);
  };

  const handleOK = () => {
    onHandleConfirm(true);
  };
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Confirm</Modal.Title>
      </Modal.Header>
      <Modal.Body>{message}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleOK}>
          OK
        </Button>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ModalConfirm;
