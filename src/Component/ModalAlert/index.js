import React from "react";
import { Button, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function ModalAlert(props) {
  const { show, onHandleClose, message, type } = props;

  const navigate = useNavigate();
  const handleClose = () => {
    onHandleClose(false);
    if (type === "navigate") {
      navigate("/capabilityList");
    }
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
