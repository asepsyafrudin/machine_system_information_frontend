import axios from "axios";
import React, { useEffect, useState } from "react";
import { getVideoByPageApi, searchVideoApi } from "../../Config/API";
import CardVideo from "../CardVideo";
import PaginationTable from "../Pagination";
import "./videoListComponent.css";

function VideoListComponent(props) {
  const { searchValue, pageNumber } = props;
  const [videoList, setVideoList] = useState([]);
  const [page, setPage] = useState(pageNumber);
  const [totalPageData, setTotalPageData] = useState(0);

  useEffect(() => {
    if (searchValue !== "all") {
      axios.get(searchVideoApi(searchValue, page)).then((response) => {
        setVideoList(response.data.data);
        setTotalPageData(response.data.totalPageData);
      });
    } else {
      axios
        .get(getVideoByPageApi(page))
        .then((response) => {
          setVideoList(response.data.data);
          setTotalPageData(response.data.totalPageData);
        })
        .catch((error) => console.log(error));
    }
  }, [searchValue, page]);

  const maxPagesShow = 3;
  return (
    <div className="videoListContainer">
      <div className="videoList">
        {videoList.length !== 0
          ? videoList.map((value, index) => {
              return (
                <CardVideo
                  key={index}
                  id={value.id}
                  src={value.video_url}
                  title={value.video_name}
                  create_date={value.create_date}
                />
              );
            })
          : "Data tidak di temukan"}
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
  );
}

export default VideoListComponent;
