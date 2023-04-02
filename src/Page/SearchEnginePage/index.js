import React, { useState } from "react";
import { Button, Form, InputGroup } from "react-bootstrap";
import Footer from "../../Component/Footer";
import Header from "../../Component/Header";
import "./searchEnginePage.css";
import { MdOutlineScreenSearchDesktop } from "react-icons/md";
import { BiBarcodeReader } from "react-icons/bi";
import ModalBarcodeScanner from "../../Component/ModalBarcodeScanner";
import { useNavigate } from "react-router-dom";

function SearchEnginePage(props) {
  const [showModalBarcode, setShowModalBarcode] = useState(false);
  const [searchingText, setSearchingText] = useState("");

  const navigate = useNavigate();
  const handleSearch = () => {
    navigate(`/searching_page/${searchingText}`);
  };

  return (
    <div>
      <Header />
      <div className="searchEngineContainer">
        <div>
          <span className="searchTitle1">
            All the assets you need, in one place
          </span>
          <br />
          <span className="searchTitle2">
            {" "}
            You can find information here to check machine story and others
          </span>
          <br />
          <br />
          <div className="searchBoxSubmit">
            <Form onSubmit={handleSearch}>
              <InputGroup size="lg">
                <InputGroup.Text>
                  <MdOutlineScreenSearchDesktop />
                </InputGroup.Text>
                <Form.Control
                  required
                  type="text"
                  placeholder="Search here...."
                  value={searchingText}
                  onChange={(e) => setSearchingText(e.target.value)}
                />
              </InputGroup>
              <br />
              <Button type="submit">Search</Button>
              <Button
                variant="success"
                type="button"
                style={{ marginLeft: 5 }}
                onClick={() => setShowModalBarcode(true)}
              >
                <BiBarcodeReader size={22} /> Scan
              </Button>
            </Form>
          </div>
        </div>
      </div>
      <Footer />
      <ModalBarcodeScanner
        onHandleShow={showModalBarcode}
        onHandleClose={(e) => setShowModalBarcode(e)}
      />
    </div>
  );
}

export default SearchEnginePage;
