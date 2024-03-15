import React, { useEffect, useState } from "react";
import { GrDocumentCloud } from "react-icons/gr";
import TitleSection from "../TitleSection";
import axios from "axios";
import { getDocumentByProjectIdApi } from "../../Config/API";
import { Link } from "react-router-dom";
import { Button, Table } from "react-bootstrap";
import moment from "moment";
import { MdVideoLibrary } from "react-icons/md";

function DocumentProject(props) {
  const { id } = props;
  const [tableDocument, setTableDocument] = useState([]);

  useEffect(() => {
   
    const controller = new AbortController();
    axios
      .get(getDocumentByProjectIdApi(id), {
        signal: controller.signal,
      })
      .then((response) => {
         setTableDocument(response.data.data);
      });

  
  }, [id]);
  return (
    <div className="capabilityFormContainer">
      <div className="capabilityForm">
        <TitleSection
          title={"Document Project Upload"}
          icon={<GrDocumentCloud style={{ marginRight: 5 }} />}
        />
        <div className="tableDocument">
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
                <th>Document Name</th>
                <th>Product Name</th>
                <th>Line Name</th>
                <th>Machine Name</th>
                <th>Create Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {tableDocument.length > 0 ? (
                tableDocument.map((value, index) => {
                  return (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{value.title}</td>
                      <td>{value.product_name}</td>
                      <td>{value.line_name}</td>
                      <td>{value.machine_name}</td>
                      <td>{moment(value.create_date).format("lll")}</td>

                      <td>
                        <Link to={`/document/${value.id}`} target="_blank">
                          <Button
                            title="View"
                            size="sm"
                            style={{ marginRight: 2 }}
                            id={value.id}
                            variant="dark"
                          >
                            <MdVideoLibrary style={{ pointerEvents: "none" }} />
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr key={new Date().getTime}>
                  <td colSpan={7}> Data Tidak Di Temukan</td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
      </div>
    </div>
  );
}

export default DocumentProject;
