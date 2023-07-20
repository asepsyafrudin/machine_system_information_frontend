import React, { useEffect, useState } from "react";
import TitleSection from "../TitleSection";
import "./lineList.css";
import { AiOutlineFileSearch, AiOutlineWindows } from "react-icons/ai";
import {
  Alert,
  Button,
  Col,
  Form,
  InputGroup,
  Row,
  Table,
} from "react-bootstrap";
import { GoSmiley } from "react-icons/go";
import axios from "axios";
import {
  deleteLineApi,
  getAllLineApi,
  getAllProductApi,
  registerLineApi,
  searchLineApi,
  updateLineApi,
  updateStatusLineApi,
} from "../../Config/API";
import { CapitalCaseFirstWord } from "../../Config/capitalCaseFirstWord";
import { MdDeleteForever } from "react-icons/md";
import { GrEdit } from "react-icons/gr";
import { GoGitCompare } from "react-icons/go";
import PaginationTable from "../Pagination";

function LineList(props) {
  const { actionState, actionStateValue, title } = props;
  const [alert, setAlert] = useState(false);
  const [notifSuccess, setNotifSuccess] = useState(false);
  const [search, setSearch] = useState("");
  const [productList, setProductList] = useState("");
  const [product, setProduct] = useState("");
  const [line, setLine] = useState("");
  const [updateMode, setUpdateMode] = useState(false);
  const [id, setId] = useState("");
  const [tableLine, setTableLine] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    axios
      .get(getAllProductApi)
      .then((response) => {
        setProductList(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
    if (search === "") {
      axios
        .get(getAllLineApi)
        .then((response) => {
          setTableLine(response.data.data);
        })
        .catch((error) => console.log(error));
    } else {
      axios
        .get(searchLineApi(search))
        .then((response) => {
          setTableLine(response.data.data);
        })
        .catch((error) => console.log(error));
    }
  }, [actionStateValue, search]);

  const optionProduct = () => {
    let option = [];
    if (productList) {
      for (let index = 0; index < productList.length; index++) {
        option.push(
          <option key={index} value={productList[index].id}>
            {productList[index].product_name}
          </option>
        );
      }
    }
    return <>{option}</>;
  };

  const handleResetForm = () => {
    setProduct("");
    setLine("");
    setUpdateMode(false);
    setId("");
    actionState(1);
  };

  const handleRegisterLine = (e) => {
    e.preventDefault();
    if (product !== "") {
      if (!updateMode) {
        const data = {
          line_name: line,
          status: "Active",
          product_id: parseInt(product),
        };
        axios
          .post(registerLineApi, data)
          .then((response) => {
            handleResetForm();
            actionState(1);
            setNotifSuccess(true);
            setAlert(false);
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        const data = {
          id: parseInt(id),
          line_name: line,
          product_id: parseInt(product),
        };
        axios.patch(updateLineApi, data).then((response) => {
          handleResetForm();
          actionState(1);
          setNotifSuccess(true);
          setAlert(false);
        });
      }
    } else {
      setAlert(true);
    }
  };

  const deleteLine = (e) => {
    const id = e.target.id;
    const lineDelete = tableLine.find((value) => {
      return value.id === parseInt(id);
    });
    const confirmDelete = window.confirm(
      `Apakah ${lineDelete.line_name} akan di hapus?`
    );
    if (confirmDelete) {
      axios
        .delete(deleteLineApi(id))
        .then((response) => {
          window.alert("Data telah terhapus");
          handleResetForm();
          actionState(1);
        })
        .catch((error) => {
          window.alert(
            "Line tidak dapat di hapus karena sudah memiliki mesin list , silahkan hapus mesin list terlebih dahulu"
          );
        });
    }
  };

  const handleEdit = (e) => {
    const id = e.target.id;
    setId(id);
    const line = tableLine.find((value) => {
      return value.id === parseInt(id);
    });

    setLine(line.line_name);
    setProduct(line.product_id);
    setUpdateMode(true);
  };

  const changeStatus = (e) => {
    const id = e.target.id;
    const line = tableLine.find((value) => {
      return value.id === parseInt(id);
    });
    let status = "";
    if (line.status === "Active") {
      status = "Non Active";
    } else {
      status = "Active";
    }

    const data = {
      id: parseInt(id),
      status: status,
    };

    axios.patch(updateStatusLineApi, data).then((response) => {
      window.alert("data telah di update");
      handleResetForm();
      actionState(1);
    });
  };

  const dataPerPage = 10;
  const maxPagesShow = 3;
  const totalPageData = Math.ceil(tableLine.length / dataPerPage);
  const tableData = () => {
    let listData = [];
    if (tableLine.length === 0) {
      listData.push(
        <tr key={new Date()}>
          <td colSpan={8}> Data Tidak Di Temukan</td>
        </tr>
      );
    } else {
      for (
        let index = (page - 1) * dataPerPage;
        index < page * dataPerPage && index < tableLine.length;
        index++
      ) {
        listData.push(
          <tr key={index}>
            <td>{index + 1}</td>
            <td>{CapitalCaseFirstWord(tableLine[index].product_name)}</td>
            <td>{CapitalCaseFirstWord(tableLine[index].line_name)}</td>
            <td>{tableLine[index].status}</td>
            <td>
              <Button
                title="Delete"
                size="sm"
                style={{ marginRight: 2 }}
                id={tableLine[index].id}
                onClick={deleteLine}
              >
                <MdDeleteForever style={{ pointerEvents: "none" }} />
              </Button>
              <Button
                title="Edit"
                size="sm"
                style={{ marginRight: 2 }}
                variant="success"
                id={tableLine[index].id}
                onClick={handleEdit}
              >
                <GrEdit style={{ pointerEvents: "none" }} />
              </Button>
              <Button
                title="Change Status"
                size="sm"
                style={{ marginRight: 2 }}
                variant="warning"
                id={tableLine[index].id}
                onClick={changeStatus}
              >
                <GoGitCompare style={{ pointerEvents: "none" }} />
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
        title={title}
        icon={<AiOutlineWindows tyle={{ marginRight: 5 }} />}
      />
      <div className="lineRegisterFormContainer">
        <Form onSubmit={handleRegisterLine}>
          <Row>
            <Col sm={4}>
              <Form.Label>Product Name</Form.Label>
            </Col>
            <Col sm={4}>Line Name</Col>
            <Col sm={4}></Col>
          </Row>
          <Row>
            <Col sm={4}>
              <Form.Select
                value={product}
                onChange={(e) => setProduct(e.target.value)}
                required
              >
                <option value="" disabled>
                  OpenThis
                </option>
                {optionProduct()}
              </Form.Select>
            </Col>
            <Col sm={4}>
              <Form.Control
                type="text"
                placeholder="Enter Line Name"
                value={line}
                onChange={(e) => setLine(e.target.value)}
                required
              />
            </Col>
            <Col sm={4}>
              <Button type="submit" style={{ marginRight: 5 }}>
                {updateMode ? "Update" : "Register"}
              </Button>
              <Button type="button" variant="success" onClick={handleResetForm}>
                Clear
              </Button>
            </Col>
          </Row>
        </Form>
      </div>
      <div style={{ marginTop: 5 }}>
        <Alert
          show={alert}
          variant="danger"
          onClose={() => setAlert(false)}
          dismissible
        >
          Please Check Your Input!!!
        </Alert>
      </div>
      <div style={{ marginTop: 5 }}>
        <Alert
          show={notifSuccess}
          variant="success"
          onClose={() => setNotifSuccess(false)}
          dismissible
        >
          Register success <GoSmiley style={{ marginLeft: 10 }} />
        </Alert>
      </div>
      <div className="tabelLine">
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
        <Table striped hover bordered size="sm">
          <thead>
            <tr>
              <th>No</th>
              <th>Product Name</th>
              <th>Line Name</th>
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
    </div>
  );
}

export default LineList;
