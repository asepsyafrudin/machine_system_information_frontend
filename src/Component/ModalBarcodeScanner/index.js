import { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import { QrReader } from "react-qr-reader";
import { useNavigate } from "react-router-dom";
import "./modalBarcodeScanner.css";

function ModalBarcodeScanner(props) {
  const { onHandleShow, onHandleClose } = props;

  const handleClose = () => {
    onHandleClose(false);
    window.location.reload();
  };

  const [data, setData] = useState("");

  const closeCam = async () => {
    await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: true,
    });
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
          onResult={(result, error) => {
            if (!!result) {
              setData(result?.text);
            }

            if (!!error) {
              console.info(error);
            }
          }}
          style={{ width: "100%" }}
        />
      </Modal.Body>
    </Modal>
  );
}

export default ModalBarcodeScanner;
