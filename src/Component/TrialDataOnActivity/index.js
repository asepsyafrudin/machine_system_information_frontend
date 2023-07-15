import React from "react";
import TitleSection from "../TitleSection";
import { BiData } from "react-icons/bi";
import { useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import { getCapabilityByProjectId } from "../../Config/API";
import { Button, Table } from "react-bootstrap";
import moment from "moment";
import { CapitalCaseFirstWord } from "../../Config/capitalCaseFirstWord";
import { Link } from "react-router-dom";

function TrialDataOnActivity(props) {
  const { id } = props;
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    axios
      .get(getCapabilityByProjectId(id))
      .then((response) => {
        setTableData(response.data.data);
      })
      .then((error) => console.log(error));
  }, [id]);

  return (
    <div className="capabilityFormContainer">
      <div className="capabilityForm">
        <TitleSection
          title={"Data Trial"}
          icon={<BiData style={{ marginRight: 5 }} />}
        />
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
              {tableData.length > 0 ? (
                tableData.map((value, index) => {
                  return (
                    <tr key={index}>
                      <td>{index + 1}</td>
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
      </div>
    </div>
  );
}

export default TrialDataOnActivity;
