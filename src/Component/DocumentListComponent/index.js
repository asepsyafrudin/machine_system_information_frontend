import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  getAllDocumentByPage,
  searchDocumentApiByPage,
} from "../../Config/API";
import CardDocument from "../CardDocument";
import PaginationTable from "../Pagination";
import "./documentListComponent.css";

function DocumentListComponent(props) {
  const { searchValue, pageNumber } = props;
  const [documentList, setDocumentList] = useState([]);
  const [page, setPage] = useState(pageNumber);
  const [totalPageData, setTotalPageData] = useState(1);

  useEffect(() => {
    if (searchValue !== "all") {
      axios.get(searchDocumentApiByPage(searchValue, page)).then((response) => {
        setDocumentList(response.data.data);
        setTotalPageData(response.data.totalPageData);
      });
    } else {
      axios
        .get(getAllDocumentByPage(page))
        .then((response) => {
          setDocumentList(response.data.data);
          setTotalPageData(response.data.totalPageData);
        })
        .catch((error) => console.log(error));
    }
  }, [searchValue, page]);

  const maxPagesShow = 3;

  return (
    <div className="documentListContainer">
      {documentList.length !== 0
        ? documentList.map((value, index) => {
            return (
              <CardDocument
                key={index}
                title={value.title}
                fileType={value.file_type}
                username={value.username}
                description={value.description}
                createDate={value.create_date}
                id={value.id}
              />
            );
          })
        : "Data tidak di temukan"}
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

export default DocumentListComponent;
