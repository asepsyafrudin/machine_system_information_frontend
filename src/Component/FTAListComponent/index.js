import React, { useEffect, useState } from "react";
import TitleSection from "../TitleSection";
import { ImTree } from "react-icons/im";
import "./FTAListComponent.css";
import { Button, Form, Modal, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import moment from "moment";
import axios from "axios";
import {
  deleteProblemByIdApi,
  getAllMachineApi,
  getAllProblemApi,
  searchProblemByMachineIdApi,
} from "../../Config/API";
import PaginationTable from "../Pagination";

function FTAListComponent() {
  const [tableFTA, setTableFTA] = useState([]);
  const [numberStart, setNumberStart] = useState("");
  const [tableMachine, setTableMachine] = useState([]);
  const [searchByMachine, setSearchbyMachine] = useState("");
  const [page, setPage] = useState(1);
  const [totalPageData, setTotalPageData] = useState("");
  const [userId, setUserId] = useState("");
  const [showNotif, setShowNotif] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    axios.get(getAllMachineApi).then((response) => {
      setTableMachine(response.data.data);
    });
    if (searchByMachine === "") {
      axios
        .get(getAllProblemApi(page))
        .then((response) => {
          setTableFTA(response.data.data);
          setTotalPageData(response.data.totalPageData);
          setNumberStart(response.data.numberStart);
        })
        .catch((error) => console.log(error));
    } else {
      axios
        .get(searchProblemByMachineIdApi(searchByMachine, page))
        .then((response) => {
          setTableFTA(response.data.data);
          setTotalPageData(response.data.totalPageData);
          setNumberStart(response.data.numberStart);
        })
        .catch((error) => console.log(error));
    }

    const user = JSON.parse(localStorage.getItem("user"));
    setUserId(user.id);
  }, [page, searchByMachine, showNotif]);

  const machineOption = () => {
    let option = [];

    if (tableMachine.length > 0) {
      for (let index = 0; index < tableMachine.length; index++) {
        option.push(
          <option key={index} value={tableMachine[index].id}>
            {tableMachine[index].machine_name}
          </option>
        );
      }
    }

    return <>{option}</>;
  };

  const maxPagesShow = 3;

  const handleDeleteProblem = (e) => {
    const id = e.target.id;
    let confirm = window.confirm("Do you want to delete this problem?");
    if (confirm) {
      axios.delete(deleteProblemByIdApi(id)).then((response) => {
        setMessage("Data Already Delete");
        setShowNotif(true);
      });
    }
  };
  return (
    <div className="capabilityFormContainer">
      <div className="capabilityForm">
        <TitleSection
          title="FTA List"
          icon={<ImTree style={{ marginRight: 5 }} />}
        />
        <div style={{ textAlign: "left", marginBottom: 10 }}>
          <Form>
            <Form.Label>Search FTA by Machine</Form.Label>
            <Form.Select
              value={searchByMachine}
              onChange={(e) => setSearchbyMachine(e.target.value)}
              required
            >
              <option value="" disabled>
                Open This
              </option>
              {machineOption()}
            </Form.Select>
          </Form>
        </div>
        <div>
          <Table responsive hover bordered size="sm">
            <thead>
              <tr>
                <th>No</th>
                <th>Machine Name</th>
                <th>Created By</th>
                <th>Last Update</th>
                <th>Problem Name</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {tableFTA.length > 0 ? (
                tableFTA.map((value, index) => {
                  return (
                    <tr key={index}>
                      <td>{numberStart + index}</td>
                      <td>{value.machine_name}</td>
                      <td>{value.username}</td>
                      <td>{moment(value.create_date).format("LLL")}</td>
                      <td>{value.problem_name}</td>
                      <td>
                        {value.user_id === userId ? (
                          <>
                            <Link to={`/FTA/${value.id}`} target="_blank">
                              <Button
                                size="sm"
                                style={{ marginRight: 2 }}
                                variant="secondary"
                                id={value.id}
                              >
                                View
                              </Button>
                            </Link>
                            <Button
                              size="sm"
                              style={{ marginRight: 2 }}
                              variant="danger"
                              id={value.id}
                              onClick={handleDeleteProblem}
                            >
                              Delete
                            </Button>
                          </>
                        ) : (
                          "NO"
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={10}>Data is Not Available</td>
                </tr>
              )}
            </tbody>
          </Table>
          <div className="paginationTableProduct">
            <PaginationTable
              totalPage={totalPageData}
              maxPagesShow={maxPagesShow}
              onChangePage={(e) => setPage(e)}
              pageActive={page}
            />
          </div>
          <Modal
            show={showNotif}
            onHide={() => {
              setShowNotif(false);
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
                  setShowNotif(false);
                }}
              >
                Close
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      </div>
    </div>
  );
}

export default FTAListComponent;
