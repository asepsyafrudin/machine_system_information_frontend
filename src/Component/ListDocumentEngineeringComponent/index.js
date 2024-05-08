import React, { useEffect, useState } from "react";
import { Button, Table } from "react-bootstrap";
import { BsBack } from "react-icons/bs";
import { Link } from "react-router-dom";
import TitleSection from "../TitleSection";
import { IoMdDocument } from "react-icons/io";
import axios from "axios";
import { getDocumentApprovalApi } from "../../Config/API";
import { MdDeleteForever } from "react-icons/md";
import moment from "moment";
import PaginationTable from "../Pagination";

function ListDocumentEngineeringComponent(props) {
  const [tableDocument, setTableDocument] = useState([]);
  const [userId, setUserId] = useState("");
  const [npk, setNpk] = useState("");
  const [page, setPage] = useState(1);
  const [totalPageData, setTotalPageData] = useState(0);
  const [numberStart, setNumberStart] = useState(1);
  useEffect(() => {
    if (localStorage.getItem("user")) {
      const user = JSON.parse(localStorage.getItem("user"));
      if (user) {
        setUserId(user.id);
        setNpk(user.npk);
      }
    }

    if (userId) {
      axios
        .get(getDocumentApprovalApi(page))
        .then((response) => {
          setTableDocument(response.data.data);
          setNumberStart(response.data.numberStart);
          setTotalPageData(response.data.totalPageData);
        })
        .catch((error) => console.log(error));
    }
  }, [userId, page]);

  console.log("test3", tableDocument);
  const maxPagesShow = 3;
  return (
    <div className="capabilityFormContainer">
      <div className="capabilityForm">
        <div style={{ textAlign: "left", marginBottom: 20 }}>
          <Link to={"/dashboardUsers"}>
            <Button>
              <BsBack style={{ pointerEvents: "none", marginRight: 5 }} />
              Back to Dashboard User
            </Button>
          </Link>
        </div>

        <TitleSection
          title="List Document Engineering Report"
          icon={<IoMdDocument style={{ marginRight: 5 }} />}
        />
        <Table
          striped
          hover
          bordered
          size="sm"
          responsive
          style={{ fontSize: 15 }}
        >
          <thead>
            <tr style={{ textAlign: "center", alignItems: "center" }}>
              <th>No</th>
              <th>Document Title</th>
              <th>Product Name</th>
              <th>Line Name</th>
              <th>Machine Name</th>
              <th>Create Date</th>
              <th>Create By</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {tableDocument.length > 0 &&
              tableDocument.map((value, index) => {
                return (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{value.title}</td>
                    <td>{value.product_name}</td>
                    <td>{value.line_name}</td>
                    <td>{value.machine_name}</td>
                    <td>{moment(value.create_date).format("lll")}</td>
                    <td>{value.username}</td>
                    <td>
                      <Button
                        title="Delete"
                        size="sm"
                        style={{ marginRight: 2 }}
                        id={value.id}
                      >
                        <MdDeleteForever style={{ pointerEvents: "none" }} />
                      </Button>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </Table>
        <div className="paginationTableUser">
          <PaginationTable
            totalPage={totalPageData}
            maxPagesShow={maxPagesShow}
            onChangePage={(e) => setPage(e)}
            pageActive={page}
          />
        </div>
      </div>
    </div>
  );
}

export default ListDocumentEngineeringComponent;
