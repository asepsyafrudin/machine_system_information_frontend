import React, { useState } from "react";
import TitleSection from "../TitleSection";
import { SiEclipseche } from "react-icons/si";
import { Button, Col, Form, Modal, Row, Table } from "react-bootstrap";
import axios from "axios";
import {
  createSectionApi,
  deleteSectionApi,
  getAllSectionApi,
} from "../../Config/API";
import { useEffect } from "react";
import { MdDeleteForever } from "react-icons/md";
import { GrEdit } from "react-icons/gr";
import { CapitalCaseFirstWord } from "../../Config/capitalCaseFirstWord";

function SectionList(props) {
  const { actionState, actionStateValue, title } = props;
  const [idUpdate, setIdUpdate] = useState("");
  const [sectionName, setSectionName] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState("");
  const [tableSection, setTableSection] = useState([]);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    axios
      .get(getAllSectionApi, {
        signal: controller.signal,
      })
      .then((response) => {
        isMounted && setTableSection(response.data.data);
      });

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [actionStateValue]);

  const handleSaveSection = (e) => {
    e.preventDefault();
    let data = { section_name: sectionName };
    if (idUpdate) {
      data = { ...data, id: idUpdate };
      setMessage("Update Section Success");
    } else {
      setMessage("Create Section Success");
    }

    let confirm = window.confirm("Do you want to save this section?");
    if (confirm) {
      axios.post(createSectionApi, data).then((response) => {
        setShowModal(true);
        setIdUpdate("");
        actionState(1);
        setSectionName("");
      });
    }
  };

  const handleDelete = (e) => {
    const id = e.target.id;
    const data = tableSection.find((value) => value.id === parseInt(id));
    let confirm = window.confirm(`Do you want to delete ${data.section_name}`);
    if (confirm) {
      axios
        .delete(deleteSectionApi(id))
        .then((response) => {
          setMessage("Delete Berhasil");
          setShowModal(true);
          actionState(1);
        })
        .catch((error) => {
          setMessage("Cannot Delete");
          setShowModal(true);
        });
    }
  };

  const handleEdit = (e) => {
    const id = e.target.id;
    const data = tableSection.find((value) => value.id === parseInt(id));
    let confirm = window.confirm(`Do you want to edit ${data.section_name}`);
    if (confirm) {
      setIdUpdate(data.id);
      setSectionName(data.section_name);
    }
  };

  return (
    <div className="userListContainer">
      <TitleSection
        title={title}
        icon={<SiEclipseche style={{ marginRight: 5 }} />}
      />
      <Form onSubmit={handleSaveSection}>
        <Row className="mb-3" style={{ textAlign: "left" }}>
          <Form.Group as={Col}>
            <Form.Label>Section Name</Form.Label>
            <Form.Control
              type="text"
              value={sectionName}
              placeholder="Enter Section Name"
              required
              onChange={(e) => setSectionName(e.target.value)}
            />
          </Form.Group>
        </Row>
        <Row className="mb-3" style={{ textAlign: "right" }}>
          <Col>
            <Button type="submit">{idUpdate ? "Update" : "Create"}</Button>
          </Col>
        </Row>
      </Form>
      <Table
        striped
        hover
        bordered
        size="sm"
        responsive
        style={{ fontSize: 20 }}
      >
        <thead>
          <tr>
            <th>No</th>
            <th>Section Name</th>
          </tr>
        </thead>
        <tbody>
          {tableSection.length > 0 ? (
            tableSection.map((value, index) => {
              return (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{CapitalCaseFirstWord(value.section_name)}</td>
                  <td>
                    <Button
                      title="Delete"
                      size="sm"
                      style={{ marginRight: 2 }}
                      id={value.id}
                      onClick={handleDelete}
                    >
                      <MdDeleteForever style={{ pointerEvents: "none" }} />
                    </Button>
                    <Button
                      title="Edit"
                      size="sm"
                      style={{ marginRight: 2 }}
                      id={value.id}
                      onClick={handleEdit}
                      variant="success"
                    >
                      <GrEdit style={{ pointerEvents: "none" }} />
                    </Button>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={2}>Data is Not Available</td>
            </tr>
          )}
        </tbody>
      </Table>
      <Modal
        show={showModal}
        onHide={() => {
          setShowModal(false);
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>Notification</Modal.Title>
        </Modal.Header>
        <Modal.Body>{message}</Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => {
              setShowModal(false);
            }}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default SectionList;
