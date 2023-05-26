import React, { useState } from "react";
import Footer from "../../Component/Footer";
import Header from "../../Component/Header";
import { FcSearch } from "react-icons/fc";
import { MdOutlineClear } from "react-icons/md";
import { AiOutlineScan } from "react-icons/ai";
import "./searchListPage.css";
import ModalBarcodeScanner from "../../Component/ModalBarcodeScanner";
import NavigationTab from "../../Component/NavigationTab";
import { useNavigate, useParams } from "react-router-dom";
import { Col, OverlayTrigger, Row, Tooltip } from "react-bootstrap";

function SearchListPage() {
  let { searchValue } = useParams();
  const [search, setSearch] = useState(searchValue);
  const [showModalBarcode, setShowModalBarcode] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);

  const navigate = useNavigate();
  const handleSearch = () => {
    if (search) {
      navigate(`/searching_page/${search}`);
      setPageNumber(1);
    } else {
      setSearch("all");
      navigate(`/searching_page/all`);
      setPageNumber(1);
    }
  };

  const clearTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      Clear
    </Tooltip>
  );

  const scanTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      Scan
    </Tooltip>
  );

  const searchTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      Search
    </Tooltip>
  );

  const handleSearchValue = (e) => {
    setSearch(e.target.value);
  };
  return (
    <div className="searchListPageContainer">
      <Header />
      <div className="searchFormBoxContainer">
        <Row>
          <Col sm={8}>
            <form className="searchFormBox" onSubmit={handleSearch}>
              <input
                type="text"
                placeholder="Enter your request here"
                className="input_search_box"
                value={search}
                onChange={handleSearchValue}
              />
              <OverlayTrigger
                placement="bottom"
                delay={{ show: 250, hide: 400 }}
                overlay={clearTooltip}
              >
                <span className="d-inline-block">
                  <MdOutlineClear
                    onClick={() => setSearch("")}
                    className="buttonSearch"
                  />
                </span>
              </OverlayTrigger>
              <div className="vr" />
              <OverlayTrigger
                placement="bottom"
                delay={{ show: 250, hide: 400 }}
                overlay={scanTooltip}
              >
                <span className="d-inline-block">
                  <AiOutlineScan
                    onClick={() => setShowModalBarcode(true)}
                    className="buttonSearch"
                  />
                </span>
              </OverlayTrigger>
              <div className="vr" />
              <OverlayTrigger
                placement="bottom"
                delay={{ show: 250, hide: 400 }}
                overlay={searchTooltip}
              >
                <span className="d-inline-block">
                  <FcSearch className="buttonSearch" onClick={handleSearch} />
                </span>
              </OverlayTrigger>
            </form>
          </Col>
          <Col sm={4}>
            {/* <Link to="/openai">
              <Button type="button" variant="dark" style={{ marginLeft: 5 }}>
                <SiOpenai size={22} /> Need Assitance?
              </Button>
            </Link> */}
          </Col>
        </Row>
        <div className="navigationTabSearch">
          <NavigationTab searchValue={searchValue} pageNumber={pageNumber} />
        </div>
        <ModalBarcodeScanner
          onHandleShow={showModalBarcode}
          onHandleClose={(e) => setShowModalBarcode(e)}
        />
      </div>
      <Footer />
    </div>
  );
}

export default SearchListPage;
