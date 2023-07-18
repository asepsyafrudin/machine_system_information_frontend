import React, { useEffect, useState } from "react";
import TitleSection from "../TitleSection";
import { BiVideoRecording } from "react-icons/bi";
import axios from "axios";
import { getVideoByProjectIdApi } from "../../Config/API";
import { Button, Table } from "react-bootstrap";
import { MdVideoLibrary } from "react-icons/md";
import { Link } from "react-router-dom";
import moment from "moment";

function VideoProject(props) {
  const { id } = props;
  const [tableVideo, setTableVideo] = useState([]);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    axios
      .get(getVideoByProjectIdApi(id), {
        signal: controller.signal,
      })
      .then((response) => {
        isMounted && setTableVideo(response.data.data);
      })
      .catch((error) => console.log(error));

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [id]);

  return (
    <div className="capabilityFormContainer">
      <div className="capabilityForm">
        <TitleSection
          title={"Video Project Upload"}
          icon={<BiVideoRecording style={{ marginRight: 5 }} />}
        />
        <div className="tableVideo">
          <Table
            striped
            hover
            bordered
            size="sm"
            responsive
            style={{ fontSize: 15 }}
          >
            <thead>
              <tr>
                <th>No</th>
                <th>Video Name</th>
                <th>Product Name</th>
                <th>Line Name</th>
                <th>Machine Name</th>
                <th>Create Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {tableVideo.length > 0 ? (
                tableVideo.map((value, index) => {
                  return (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{value.video_name}</td>
                      <td>{value.product_name}</td>
                      <td>{value.line_name}</td>
                      <td>{value.machine_name}</td>
                      <td>{moment(value.create_date).format("lll")}</td>
                      <td>{value.status}</td>
                      <td>
                        <Link to={`/video/${value.id}`} target="_blank">
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
                  <td colSpan={8}> Data Tidak Di Temukan</td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
      </div>
    </div>
  );
}

export default VideoProject;
