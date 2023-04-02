import React, { useEffect, useState } from "react";
import TitleSection from "../TitleSection";
import "./productList.css";
import { FaCashRegister } from "react-icons/fa";
import { GoSmiley } from "react-icons/go";
import {
  Alert,
  Button,
  Col,
  Form,
  InputGroup,
  Row,
  Table,
} from "react-bootstrap";
import { AiOutlineFileSearch } from "react-icons/ai";
import { MdDeleteForever } from "react-icons/md";
import { GrEdit } from "react-icons/gr";
import { GoGitCompare } from "react-icons/go";
import axios from "axios";
import {
  deleteProductApi,
  getAllProductApi,
  registerProductApi,
  searchProductApi,
  updateProductNameApi,
  updateProductStatusApi,
} from "../../Config/API";
import PaginationTable from "../Pagination";
import { CapitalCaseFirstWord } from "../../Config/capitalCaseFirstWord";

function ProductList(props) {
  const { actionState, actionStateValue } = props;
  const [productName, setProductName] = useState("");
  const [search, setSearch] = useState("");
  const [alert, setAlert] = useState(false);
  const [notifSuccess, setNotifSuccess] = useState(false);
  const [tableProduct, setTableProduct] = useState("");
  const [page, setPage] = useState(1);
  const [updateMode, setUpdateMode] = useState(false);
  const [id, setId] = useState("");

  useEffect(() => {
    if (search === "") {
      axios
        .get(getAllProductApi)
        .then((response) => {
          setTableProduct(response.data.data);
        })
        .catch((error) => console.log(error));
    } else {
      axios.get(searchProductApi(search)).then((response) => {
        setTableProduct(response.data.data);
        setPage(1);
      });
    }
  }, [search, actionStateValue]);

  const handleRegisterProduct = (e) => {
    e.preventDefault();
    if (!updateMode) {
      const data = {
        product_name: productName,
        status: "Active",
      };

      axios.post(registerProductApi, data).then((response) => {
        setProductName("");
        setNotifSuccess(true);
        setAlert(false);
        actionState(1);
      });
    } else {
      const data = {
        id: id,
        product_name: productName,
      };
      axios.patch(updateProductNameApi, data).then((response) => {
        setId("");
        setUpdateMode(false);
        setProductName("");
        setNotifSuccess(true);
        actionState(1);
      });
    }
  };

  const handleClear = () => {
    setProductName("");
    setUpdateMode(false);
    actionState(1);
  };

  const handleEdit = (e) => {
    const id = e.target.id;
    setId(id);
    const product = tableProduct.find((value) => {
      return value.id === parseInt(id);
    });

    setProductName(product.product_name);
    setUpdateMode(true);
    actionState(1);
  };

  const changeStatus = (e) => {
    const id = e.target.id;
    const productEdit = tableProduct.find((value) => {
      return value.id === parseInt(id);
    });
    let status = "";
    if (productEdit.status === "Active") {
      status = "Non Active";
    } else {
      status = "Active";
    }
    const data = {
      id: id,
      status: status,
    };
    axios.patch(updateProductStatusApi, data).then((response) => {
      window.alert("data telah terupdate");
      setProductName("");
      actionState(1);
    });
  };

  const deleteProduct = (e) => {
    const id = e.target.id;
    const productDelete = tableProduct.find((value) => {
      return value.id === parseInt(id);
    });
    const confirmDelete = window.confirm(
      `Apakah ${productDelete.product_name} akan di hapus?`
    );
    if (confirmDelete) {
      axios
        .delete(deleteProductApi(id))
        .then((response) => {
          window.alert("Data telah terhapus");
          setProductName("");
          actionState(1);
        })
        .catch((error) => {
          window.alert(
            "Product tidak dapat di hapus karena sudah mempunyai Line List , Silahkan Hapus Line List Terlebih dahulu"
          );
        });
    }
  };

  const dataPerPage = 10;
  const maxPagesShow = 3;
  const totalPageData = Math.ceil(tableProduct.length / dataPerPage);
  const tableData = () => {
    let listData = [];
    if (tableProduct.length === 0) {
      listData.push(
        <tr key={new Date()}>
          <td colSpan={8}> Data Tidak Di Temukan</td>
        </tr>
      );
    } else {
      for (
        let index = (page - 1) * dataPerPage;
        index < page * dataPerPage && index < tableProduct.length;
        index++
      ) {
        listData.push(
          <tr key={index}>
            <td>{index + 1}</td>
            <td>{CapitalCaseFirstWord(tableProduct[index].product_name)}</td>
            <td>{tableProduct[index].status}</td>
            <td>
              <Button
                title="Delete"
                size="sm"
                style={{ marginRight: 2 }}
                id={tableProduct[index].id}
                onClick={deleteProduct}
              >
                <MdDeleteForever style={{ pointerEvents: "none" }} />
              </Button>
              <Button
                title="Edit"
                size="sm"
                style={{ marginRight: 2 }}
                variant="success"
                id={tableProduct[index].id}
                onClick={handleEdit}
              >
                <GrEdit style={{ pointerEvents: "none" }} />
              </Button>
              <Button
                title="Change Status"
                size="sm"
                style={{ marginRight: 2 }}
                variant="warning"
                id={tableProduct[index].id}
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
        title="Product Registration"
        icon={<FaCashRegister style={{ marginRight: 5 }} />}
      />
      <div className="registerProductFormContainer">
        <Form onSubmit={handleRegisterProduct}>
          <Row>
            <Col sm={8}>
              <Form.Label>Product Name</Form.Label>
            </Col>
            <Col sm={4} />
          </Row>
          <Row>
            <Col sm={8}>
              <Form.Control
                type="text"
                placeholder="Enter product name"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                required
              />
            </Col>
            <Col sm={4}>
              <Button type="submit" style={{ marginRight: 5 }}>
                {updateMode ? "Update" : "Register"}
              </Button>
              <Button type="button" variant="info" onClick={handleClear}>
                Clear
              </Button>
            </Col>
          </Row>
        </Form>
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
      </div>
      <div className="tabelProduct">
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
        <Table striped hover bordered size="sm" style={{ fontSize: 15 }}>
          <thead>
            <tr>
              <th>No</th>
              <th>Product Name</th>
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

export default ProductList;
