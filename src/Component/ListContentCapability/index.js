import React, { useEffect, useState } from "react";
import { Button, Form, Table } from "react-bootstrap";
import TitleSection from "../TitleSection";
import { AiOutlineDotChart } from "react-icons/ai";
import axios from "axios";
import { getAllCapabilityApi, searchCapabilityApi } from "../../Config/API";
import PaginationTable from "../Pagination";
import moment from "moment";
import { Link } from "react-router-dom";
import { CapitalCaseFirstWord } from "../../Config/capitalCaseFirstWord";
import { BsBack } from "react-icons/bs";

function ListContentCapability() {
  const [tableCapability, setTableCapability] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPageData, setTotalPageData] = useState(1);
  const [numberStart, setNumberStart] = useState(1);
  const [position, setPosition] = useState("");

  useEffect(() => {
    if (search === "") {
      axios.get(getAllCapabilityApi(page)).then((response) => {
        const data = response.data.data;
        if (data.length > 0) {
          setTableCapability(data);
          setTotalPageData(response.data.totalPageData);
          setNumberStart(response.data.numberStart);
        }
      });
    } else {
      axios.get(searchCapabilityApi(search, page)).then((response) => {
        const data = response.data.data;
        if (data.length > 0) {
          setTableCapability(data);
          setTotalPageData(response.data.totalPageData);
          setNumberStart(response.data.numberStart);
        }
      });
    }

    const user = JSON.parse(localStorage.getItem("user"));
    setPosition(user.position);
  }, [page, search]);

  const maxPagesShow = 3;

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };
  return (
    <div className="capabilityFormContainer">
      <div className="capabilityForm">
        <div style={{ textAlign: "left", marginBottom: 5 }}>
          <Link
            to={position === "Administrator" ? "/adminmenu" : "/dashboardUsers"}
          >
            <Button>
              <BsBack style={{ pointerEvents: "none", marginRight: 5 }} />
              Back to Dashboard User
            </Button>
          </Link>
        </div>
        <TitleSection
          title="Capability List"
          icon={<AiOutlineDotChart style={{ marginRight: 5 }} />}
        />
        <div style={{ textAlign: "left", marginBottom: 10 }}>
          <Form>
            <Form.Label>Search Capability Data</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter Search Text"
              value={search}
              onChange={handleSearch}
            />
          </Form>
        </div>
        <div>
          <Table responsive hover bordered size="sm">
            <thead>
              <tr>
                <th>No</th>
                <th>Product</th>
                <th>Line</th>
                <th>Machine Name</th>
                <th>Part Name</th>
                <th>Part Number</th>
                <th>Item Check</th>
                <th>Date</th>
                <th>Created By</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {tableCapability.length > 0 ? (
                tableCapability.map((value, index) => {
                  return (
                    <tr key={index}>
                      <td>{numberStart + index}</td>
                      <td>{value.product_name}</td>
                      <td>{value.line_name}</td>
                      <td>{value.machine_name}</td>
                      <td>{value.part_name}</td>
                      <td>{value.part_number}</td>
                      <td>{value.item_check}</td>
                      <td>{moment(value.create_date).format("LLL")}</td>
                      <td>{CapitalCaseFirstWord(value.username)}</td>
                      <td>
                        {value.status === "compare" ? (
                          <Link to={`/capabilityComparisonForm/${value.id}`}>
                            <Button
                              size="sm"
                              style={{ marginRight: 2 }}
                              variant="secondary"
                              id={value.id}
                            >
                              View
                            </Button>
                          </Link>
                        ) : (
                          <Link to={`/capabilityForm/${value.id}`}>
                            <Button
                              size="sm"
                              style={{ marginRight: 2 }}
                              variant="secondary"
                              id={value.id}
                            >
                              View
                            </Button>
                          </Link>
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
        </div>
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

export default ListContentCapability;
