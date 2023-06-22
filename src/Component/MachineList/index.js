import React, { useEffect, useState } from "react";
import TitleSection from "../TitleSection";
import { HiOutlineDesktopComputer } from "react-icons/hi";
import {
  Alert,
  Button,
  Col,
  Form,
  InputGroup,
  Modal,
  Row,
  Table,
} from "react-bootstrap";
import "./machineList.css";
import axios from "axios";
import {
  deleteMachineApi,
  getAllLineApi,
  getAllMachineApi,
  getAllProductApi,
  registerMachineApi,
  searchMachineApi,
  updateMachineApi,
  updateStatusMachineApi,
} from "../../Config/API";
import { GoGitCompare, GoSmiley } from "react-icons/go";
import { AiOutlineFileSearch } from "react-icons/ai";
import { CapitalCaseFirstWord } from "../../Config/capitalCaseFirstWord";
import { MdDeleteForever } from "react-icons/md";
import { GrEdit } from "react-icons/gr";
import PaginationTable from "../Pagination";
import { MdOutlineQrCode2 } from "react-icons/md";
import QRCode from "react-qr-code";
import ModalAlert from "../ModalAlert";

function MachineList(props) {
  const { actionState, actionStateValue } = props;
  const [product, setProduct] = useState("");
  const [line, setLine] = useState("");
  const [machine, setMachine] = useState("");
  const [cycletime, setCycletime] = useState("");
  const [operationRatio, setOperationRatio] = useState("");
  const [description, setDescription] = useState("");
  const [dateMassProd, setDateMassProd] = useState("");
  const [tableProduct, setTableProduct] = useState("");
  const [tableLine, setTableLine] = useState("");
  const [tableMachine, setTableMachine] = useState("");
  const [search, setSearch] = useState("");
  const [notifSuccess, setNotifSuccess] = useState(false);
  const [id, setId] = useState("");
  const [updateMode, setUpdateMode] = useState(false);
  const [page, setPage] = useState(1);
  const [modalShowGenerateQR, setModalShowGenerateQR] = useState(false);
  const [machineForGenerateQR, setMachineForGeneratedOR] = useState("");
  const [assetNo, setAssetNo] = useState("");
  const [message, setMessage] = useState("");
  const [showModalAlert, setShowModalAlert] = useState(false);

  useEffect(() => {
    axios
      .get(getAllProductApi)
      .then((response) => {
        setTableProduct(response.data.data);
      })
      .catch((error) => console.log(error));

    axios
      .get(getAllLineApi)
      .then((response) => {
        setTableLine(response.data.data);
      })
      .catch((error) => console.log(error));

    if (search) {
      axios
        .get(searchMachineApi(search))
        .then((response) => {
          setTableMachine(response.data.data);
        })
        .catch((error) => console.log(error));
    } else {
      axios
        .get(getAllMachineApi)
        .then((response) => {
          setTableMachine(response.data.data);
        })
        .catch((error) => console.log(error));
    }
  }, [actionStateValue, search]);

  const handleSetProduct = (e) => {
    setProduct(e.target.value);
    setLine("");
  };

  const generateId = () => {
    let date = new Date();
    let id = `ME${date.getTime()}`;
    return id;
  };

  const productOption = () => {
    let option = [];
    if (tableProduct) {
      for (let index = 0; index < tableProduct.length; index++) {
        option.push(
          <option key={index} value={tableProduct[index].id}>
            {tableProduct[index].product_name}
          </option>
        );
      }
    }
    return <>{option}</>;
  };

  const lineOption = () => {
    let option = [];
    if (product && tableLine) {
      const lineFilter = tableLine.filter(
        (value) =>
          value.product_id === parseInt(product) && value.status === "Active"
      );
      if (lineFilter) {
        for (let index = 0; index < lineFilter.length; index++) {
          option.push(
            <option key={index} value={lineFilter[index].id}>
              {lineFilter[index].line_name}
            </option>
          );
        }
      }
    }

    return <>{option}</>;
  };

  const handleRegisterMachine = (e) => {
    const data = {
      id: updateMode ? id : generateId(),
      line_id: line,
      machine_name: machine,
      cycletime: cycletime,
      operation_ratio: parseInt(operationRatio),
      masspro_date: dateMassProd,
      description: description,
      status: "Active",
      asset_id: assetNo,
    };

    e.preventDefault();
    if (!updateMode) {
      axios
        .post(registerMachineApi, data)
        .then((response) => {
          setMessage("Register Success!!");
          setNotifSuccess(true);
          handleResetForm();
          actionState(1);
        })
        .catch((error) => console.log.error);
    } else {
      axios
        .patch(updateMachineApi, data)
        .then((response) => {
          setMessage("Update Data Success!!!");
          setNotifSuccess(true);
          handleResetForm();
          actionState(1);
        })
        .catch((error) => console.log(error));
    }
  };

  const handleResetForm = () => {
    setProduct("");
    setCycletime("");
    setDateMassProd("");
    setDescription("");
    setLine("");
    setMachine("");
    setOperationRatio("");
    setUpdateMode(false);
    setAssetNo("");
  };

  const handleDelete = (e) => {
    const id = e.target.id;
    const machineDelete = tableMachine.find((value) => {
      return value.id === id;
    });
    const confirmDelete = window.confirm(
      `Apakah ${machineDelete.machine_name} akan di hapus?`
    );
    if (confirmDelete) {
      axios.delete(deleteMachineApi(id)).then((response) => {
        setMessage("Data Telah Terhapus");
        setShowModalAlert(true);
        handleResetForm();
        actionState(1);
      });
    }
  };

  const handleEdit = (e) => {
    const id = e.target.id;
    const machineEdit = tableMachine.find((value) => value.id === id);
    if (machineEdit) {
      setId(id);
      setCycletime(machineEdit.cycletime);
      setDateMassProd(machineEdit.masspro_date);
      setDescription(machineEdit.description);
      setLine(machineEdit.line_id);
      setProduct(machineEdit.product_id);
      setMachine(machineEdit.machine_name);
      setOperationRatio(machineEdit.operation_ratio);
      setUpdateMode(true);
      setAssetNo(machineEdit.asset_id);
    }
  };

  const changeStatus = (e) => {
    const id = e.target.id;
    const dataMesinForChangeStatus = tableMachine.find(
      (value) => value.id === id
    );
    const data = {
      id: id,
      status:
        dataMesinForChangeStatus.status === "Active" ? "Non Active" : "Active",
    };
    axios
      .patch(updateStatusMachineApi, data)
      .then((response) => {
        setMessage("Data Status Mesin Berhasil diubah");
        setShowModalAlert(true);
        actionState(1);
      })
      .catch((error) => console.log(error));
  };

  const generateOR = (e) => {
    setModalShowGenerateQR(true);
    handleResetForm();
    const id = e.target.id;
    setId(id);
    const checkAvailableMachine = tableMachine.find((value) => value.id === id);
    setMachineForGeneratedOR(checkAvailableMachine);
  };

  const dataPerPage = 10;
  const maxPagesShow = 3;
  const totalPageData = Math.ceil(tableMachine.length / dataPerPage);
  const tableData = () => {
    let listData = [];
    if (tableMachine.length === 0) {
      listData.push(
        <tr key={new Date()}>
          <td colSpan={8}> Data Tidak Di Temukan</td>
        </tr>
      );
    } else {
      for (
        let index = (page - 1) * dataPerPage;
        index < page * dataPerPage && index < tableMachine.length;
        index++
      ) {
        listData.push(
          <tr key={index}>
            <td>{index + 1}</td>
            <td>{CapitalCaseFirstWord(tableMachine[index].product_name)}</td>
            <td>{tableMachine[index].line_name}</td>
            <td>{tableMachine[index].id}</td>
            <td>{tableMachine[index].machine_name}</td>
            <td>{tableMachine[index].cycletime}</td>
            <td>{tableMachine[index].operation_ratio}</td>
            <td>{tableMachine[index].status}</td>
            <td>
              <Button
                title="Delete"
                size="sm"
                style={{ marginRight: 2 }}
                id={tableMachine[index].id}
                onClick={handleDelete}
              >
                <MdDeleteForever style={{ pointerEvents: "none" }} />
              </Button>
              <Button
                title="Edit"
                size="sm"
                style={{ marginRight: 2 }}
                variant="success"
                id={tableMachine[index].id}
                onClick={handleEdit}
              >
                <GrEdit style={{ pointerEvents: "none" }} />
              </Button>
              <Button
                title="Change Status"
                size="sm"
                style={{ marginRight: 2 }}
                variant="warning"
                id={tableMachine[index].id}
                onClick={changeStatus}
              >
                <GoGitCompare style={{ pointerEvents: "none" }} />
              </Button>
              <Button
                title="Generate QR"
                size="sm"
                style={{ marginRight: 2 }}
                variant="secondary"
                id={tableMachine[index].id}
                onClick={generateOR}
              >
                <MdOutlineQrCode2
                  style={{ pointerEvents: "none" }}
                  size="20px"
                />
              </Button>
            </td>
          </tr>
        );
      }
    }

    return <>{listData}</>;
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  return (
    <div className="userListContainer">
      <TitleSection
        title="Machine Register"
        icon={<HiOutlineDesktopComputer style={{ marginRight: 5 }} />}
      />
      <div className="registerMachineFormContainer">
        <Form onSubmit={handleRegisterMachine}>
          <Row className="mb-3">
            <Form.Group as={Col}>
              <Form.Label>Select Product</Form.Label>
              <Form.Select value={product} onChange={handleSetProduct} required>
                <option value={""} disabled>
                  Open This
                </option>
                {productOption()}
              </Form.Select>
            </Form.Group>
            <Form.Group as={Col}>
              <Form.Label>Select Line</Form.Label>
              <Form.Select
                value={line}
                onChange={(e) => setLine(e.target.value)}
                required
              >
                <option value={""} disabled>
                  Open This
                </option>
                {lineOption()}
              </Form.Select>
            </Form.Group>
            <Form.Group as={Col}>
              <Form.Label>Machine Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Machine Name"
                value={machine}
                onChange={(e) => setMachine(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group as={Col}>
              <Form.Label>Asset No</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Asset No"
                value={assetNo}
                onChange={(e) => setAssetNo(e.target.value)}
              />
            </Form.Group>
          </Row>
          <Row className="mb-3">
            <Form.Group as={Col}>
              <Form.Label>Cycle Time</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter Cycletime"
                value={cycletime}
                onChange={(e) => setCycletime(e.target.value)}
                required
              />
              <span className="informationState">*input in Sec</span>
            </Form.Group>
            <Form.Group as={Col}>
              <Form.Label>Operation Ratio Target</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter Operation Ratio"
                value={operationRatio}
                onChange={(e) => setOperationRatio(e.target.value)}
                required
              />
              <span className="informationState">*input in range 0-100</span>
            </Form.Group>
            <Form.Group as={Col}>
              <Form.Label>Start MassProd</Form.Label>
              <br />
              <input
                type="date"
                className="inputDateAndTime"
                value={dateMassProd}
                onChange={(e) => setDateMassProd(e.target.value)}
                required
              />
            </Form.Group>
          </Row>
          <Row className="mb-3">
            <Col>
              <Form.Label>Machine Description</Form.Label>
              <Form.Control
                as="textarea"
                style={{ height: 100 }}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></Form.Control>
            </Col>
          </Row>
          <Row>
            <Col></Col>
            <Col></Col>
            <Col style={{ textAlign: "right" }}>
              <Button type="submit" style={{ marginRight: 5 }}>
                {updateMode ? "Update" : "Register"}
              </Button>
              <Button type="button" onClick={handleResetForm}>
                clear
              </Button>{" "}
            </Col>
          </Row>
        </Form>
      </div>
      <div style={{ marginTop: 5 }}>
        <Alert
          show={notifSuccess}
          variant="success"
          onClose={() => setNotifSuccess(false)}
          dismissible
        >
          {message}
          <GoSmiley style={{ marginLeft: 10 }} />
        </Alert>
      </div>
      <div className="tabelMachine">
        <InputGroup className="mb-3">
          <InputGroup.Text id="basic-addon1">
            <AiOutlineFileSearch />
          </InputGroup.Text>
          <Form.Control
            placeholder="Search"
            aria-label="Search"
            aria-describedby="basic-addon1"
            value={search}
            onChange={handleSearch}
          />
        </InputGroup>
        <Table
          style={{ fontSize: 15 }}
          striped
          hover
          bordered
          size="sm"
          responsive
        >
          <thead>
            <tr>
              <th>No</th>
              <th>Product</th>
              <th>Line</th>
              <th>Machine Id</th>
              <th>Machine Name</th>
              <th>Cycle time (sec)</th>
              <th>Operatio Ratio (%)</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>{tableData()}</tbody>
        </Table>
      </div>
      <div className="paginationTableProduct">
        <PaginationTable
          totalPage={totalPageData}
          maxPagesShow={maxPagesShow}
          onChangePage={(e) => setPage(e)}
          pageActive={page}
        />
      </div>
      <Modal
        show={modalShowGenerateQR}
        onHide={() => setModalShowGenerateQR(false)}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            Machine {machineForGenerateQR.machine_name} QR Generator
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <QRCode
            size={256}
            style={{ height: "auto", maxWidth: "100%", width: "100%" }}
            value={id}
            viewBox={`0 0 256 256`}
          />
          <div className="machineDescriptionTitle">Machine Description</div>
          <div className="machineDescription">
            {machineForGenerateQR.description}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setModalShowGenerateQR(false)}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      <ModalAlert
        show={showModalAlert}
        onHandleClose={(e) => {
          setShowModalAlert(e);
        }}
        message={message}
      />
    </div>
  );
}

export default MachineList;
