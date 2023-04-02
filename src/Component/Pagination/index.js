import React, { useEffect, useState } from "react";
import Pagination from "react-bootstrap/Pagination";

function PaginationTable(props) {
  const { totalPage, maxPagesShow, onChangePage, pageActive } = props;
  const [startPage, setStartPage] = useState(1);
  const [endPage, setEndPage] = useState(1);

  useEffect(() => {
    if (totalPage <= maxPagesShow) {
      setStartPage(1);
      setEndPage(totalPage);
    } else {
      let maxPageBeforeCurrentPage = Math.floor(maxPagesShow / 2);
      let maxPageAfterCurrentPage = Math.ceil(maxPagesShow / 2) - 1;
      if (pageActive <= maxPageBeforeCurrentPage) {
        setStartPage(1);
        setEndPage(maxPagesShow);
      } else if (pageActive + maxPageAfterCurrentPage >= totalPage) {
        setStartPage(totalPage - maxPagesShow + 1);
        setEndPage(totalPage);
      } else {
        setStartPage(pageActive - maxPageBeforeCurrentPage);
        setEndPage(pageActive + maxPageAfterCurrentPage);
      }
    }
  }, [pageActive, startPage, endPage, totalPage, maxPagesShow]);

  //function page

  const handleCurrentPage = (el) => {
    onChangePage(parseInt(el.target.innerText));
  };
  const handleFirstPage = () => {
    onChangePage(1);
  };

  const handlePreviousPage = () => {
    if (pageActive > 1) {
      onChangePage(pageActive - 1);
    }
  };

  const handleNextPage = () => {
    if (pageActive < endPage) {
      onChangePage(pageActive + 1);
    }
  };

  const handleLastPage = () => {
    onChangePage(totalPage);
  };

  let paginationArray = [];
  if (totalPage !== 0) {
    for (let index = startPage; index <= endPage; index++) {
      paginationArray.push(
        <Pagination.Item
          active={pageActive === index ? true : false}
          value={index}
          key={index}
          onClick={handleCurrentPage}
        >
          {index}
        </Pagination.Item>
      );
    }
  }

  return (
    <>
      <Pagination>
        <Pagination.First onClick={handleFirstPage} />
        <Pagination.Prev onClick={handlePreviousPage} />
        {paginationArray}
        <Pagination.Next onClick={handleNextPage} />
        <Pagination.Last onClick={handleLastPage} />
      </Pagination>
    </>
  );
}

export default PaginationTable;
