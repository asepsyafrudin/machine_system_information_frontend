import React, { useEffect, useRef, useState } from "react";
import { Button, Col, Form, Row, Table } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import "./modalFTAForm.css";
import { SECONDANALYSIS } from "../../Config/const";
import { fileName } from "../../Config/fileName";
import { getExtFileName } from "../../Config/fileType";
import { Link } from "react-router-dom";
import { deleteFileByIdApi } from "../../Config/API";
import axios from "axios";

function ModalFTAForm(props) {
  const { onSave, showModal, onHandleHide, id, mode, dataEdit } = props;
  const [type, setType] = useState("");
  const [disabled, setDisabled] = useState(false);
  const [name, setName] = useState("");
  const [attachment, setAttachment] = useState([]);
  const [setUpMode, setSetupMode] = useState(false);

  const refAttachment = useRef();

  useEffect(() => {
    if (dataEdit) {
      if (mode === SECONDANALYSIS) {
        setType("Solution");
        setName(dataEdit.name);
        setAttachment(dataEdit.attachment);
        setDisabled(true);
      } else {
        setType(dataEdit.type);
        setName(dataEdit.name);
        setAttachment(dataEdit.attachment);
      }
    } else if (mode === SECONDANALYSIS) {
      setType("Solution");
      setDisabled(true);
    }
  }, [mode, dataEdit]);

  const onReset = () => {
    setType("");
    setName("");
    setAttachment([]);
    setDisabled(false);
    setSetupMode(false);
  };
  const onHandleSave = (e) => {
    e.preventDefault();
    onSave({
      id: id,
      type: type,
      name: name,
      attachment: attachment,
    });
    onHandleHide(false);
    onReset();
  };

  const handleBack = () => {
    onReset();
    onHandleHide(false);
  };

  const handleAttachment = (e) => {
    const attachmentArray = [...e.target.files];
    setSetupMode(true);
    setAttachment(attachmentArray);
  };

  const handleDeleteFile = () => {
    setSetupMode(false);
    setAttachment([]);
  };

  const handleDeleteFileDataBase = (e) => {
    const id = e.target.id;
    const confirm = window.confirm("Apakah file Akan di Hapus?");
    if (confirm) {
      axios
        .delete(deleteFileByIdApi(id))
        .then((response) => {
          setAttachment([]);
        })
        .catch((error) => setAttachment([]));
    }
  };

  return (
    <Modal
      show={showModal}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Form className="form-style-FTA" onSubmit={onHandleSave}>
        <Modal.Header>Add Solusion or Analysis</Modal.Header>
        <Modal.Body>
          <Row className="mb-3" style={{ textAlign: "left" }}>
            <Form.Group as={Col}>
              <Form.Label>Type</Form.Label>
              <Form.Select
                value={type}
                onChange={(e) => setType(e.target.value)}
                required
                disabled={disabled}
              >
                <option value={""} disabled>
                  Open This
                </option>
                <option value="Solution">Solution</option>
                <option value="Causative Factor">Causative Factor</option>
              </Form.Select>
            </Form.Group>
          </Row>
          <Row className="mb-3" style={{ textAlign: "left" }}>
            <Form.Group as={Col}>
              <Form.Label>Description</Form.Label>
              <Form.Control
                as={"textarea"}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Group>
          </Row>
          {type === "Solution" ? (
            setUpMode === false ? (
              attachment.length === 0 ? (
                <Row className="mb-3" style={{ textAlign: "left" }}>
                  <Form.Group as={Col}>
                    <Form.Label>Attachment</Form.Label>
                    <Form.Control
                      type="file"
                      placeholder="Input File"
                      onChange={handleAttachment}
                      ref={refAttachment}
                    />
                  </Form.Group>
                </Row>
              ) : (
                <Table>
                  <thead>
                    <tr>
                      <td>No</td>
                      <td>File Name</td>
                      <td>File Type</td>
                      <td>Action</td>
                    </tr>
                    <tr>
                      <td>1</td>
                      <td>{fileName(attachment[0].name)}</td>
                      <td>{getExtFileName(attachment[0].file)}</td>
                      <td>
                        <Button
                          type="button"
                          style={{ marginRight: 2 }}
                          variant="danger"
                          id={attachment[0].id}
                          onClick={handleDeleteFileDataBase}
                        >
                          Delete
                        </Button>
                        <Link to={attachment[0].file} target="_blank">
                          <Button type="button" id={attachment[0].id}>
                            View
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  </thead>
                </Table>
              )
            ) : (
              <Table>
                <thead>
                  <tr>
                    <td>No</td>
                    <td>File Name</td>
                    <td>File Type</td>
                    <td>Action</td>
                  </tr>
                  <tr>
                    <td>1</td>
                    <td>{attachment[0].name}</td>
                    <td>{getExtFileName(attachment[0].type)}</td>
                    <td>
                      <Button
                        type="button"
                        style={{ marginRight: 2 }}
                        variant="danger"
                        id={attachment[0].id}
                        onClick={handleDeleteFile}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                </thead>
              </Table>
            )
          ) : (
            ""
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button type="submit">Save</Button>
          <Button type="button" variant="success" onClick={handleBack}>
            Back
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default ModalFTAForm;
