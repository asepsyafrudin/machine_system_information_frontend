import { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import { useNavigate } from "react-router-dom";
import "./modalBarcodeScanner.css";
import QrReader from "react-qr-reader-private";

function ModalBarcodeScanner(props) {
  const { onHandleShow, onHandleClose } = props;

  const handleClose = () => {
    onHandleClose(false);
    window.location.reload();
  };

  const [data, setData] = useState("");

  const closeCam = async () => {
    // the rest of the cleanup code
    window.location.reload();
  };

  const navigate = useNavigate();
  useEffect(() => {
    if (data) {
      navigate(`/searching_page/${data}`);
      closeCam();
    }
  });
  const handleScan = (data) => {
    if (data) {
      setData(data.text);
    }
  };
  const handleError = (err) => {
    console.error(err);
  };
  return (
    <Modal
      show={onHandleShow}
      onHide={handleClose}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header
        closeButton
        style={{
          textAlign: "center",
        }}
      >
        <div className="titleModalBarcode">
          <span>Please Scan Here...</span>
        </div>
      </Modal.Header>
      <Modal.Body>
        <QrReader
          delay={300}
          onError={handleError}
          onScan={handleScan}
          style={{ width: "100%" }}
        />
      </Modal.Body>
    </Modal>
  );
}

export default ModalBarcodeScanner;
