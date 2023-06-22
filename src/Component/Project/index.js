import React from "react";
import TitleSection from "../TitleSection";
import { FaUserAlt } from "react-icons/fa";
import { Button, Col, Form, Row } from "react-bootstrap";
import { useEffect } from "react";
import { getAllProductApi, getAllUsersApi } from "../../Config/API";
import { useState } from "react";
import axios from "axios";
import { CapitalCaseFirstWord } from "../../Config/capitalCaseFirstWord";

function Project() {
  const [tableProduct, setTableProduct] = useState([]);
  const [product, setProduct] = useState("");
  const [projectName, setProjectName] = useState("");
  const [manager, setManager] = useState("");
  const [tableUser, setTableUser] = useState([]);
  const [budget, setBudget] = useState("");
  const [savingCost, setSavingCost] = useState("");
  const [startDate, setStartDate] = useState("");
  const [sopDate, setSopDate] = useState("");
  const [member, setMember] = useState([]);

  useEffect(() => {
    axios
      .get(getAllProductApi)
      .then((response) => {
        setTableProduct(response.data.data);
      })
      .catch((error) => console.log(error));

    axios
      .get(getAllUsersApi)
      .then((response) => {
        setTableUser(response.data.data);
      })
      .catch((error) => console.log(error));
  }, []);

  const productOption = () => {
    let option = [];
    if (tableProduct.length > 0) {
      for (let index = 0; index < tableProduct.length; index++) {
        option.push(
          <option key={index} value={tableProduct[index].id}>
            {tableProduct[index].product_name}
          </option>
        );
      }
    }
    return <>{option}</>;
  };

  const userOption = () => {
    let option = [];
    if (tableUser.length > 0) {
      for (let index = 0; index < tableUser.length; index++) {
        option.push(
          <option key={index} value={tableUser[index].id}>
            {CapitalCaseFirstWord(tableUser[index].username)}
          </option>
        );
      }
    }
    return <>{option}</>;
  };

  const handleMember = (e) => {
    setMember((prev) => [...prev, e.target.value]);
  };
  return (
    <div className="capabilityFormContainer">
      <div className="capabilityForm">
        <TitleSection
          title="Create project"
          icon={<FaUserAlt style={{ marginRight: 5 }} />}
        />
        <Form>
          <Row className="mb-3" style={{ textAlign: "left" }}>
            <Form.Group as={Col}>
              <Form.Label>Select Product</Form.Label>
              <Form.Select
                value={product}
                onChange={(e) => setProduct(e.target.value)}
                required
              >
                <option value="" disabled>
                  Open This
                </option>
                {productOption()}
              </Form.Select>
            </Form.Group>
            <Form.Group as={Col}>
              <Form.Label>Project Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Project Name"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group as={Col}>
              <Form.Label>PIC Manager</Form.Label>
              <Form.Select
                value={manager}
                onChange={(e) => setManager(e.target.value)}
                required
              >
                <option value="" disabled>
                  Open This
                </option>
                {userOption()}
              </Form.Select>
            </Form.Group>
          </Row>
          <Row className="mb-3" style={{ textAlign: "left" }}>
            <Form.Group as={Col}>
              <Form.Label>Budget</Form.Label>
              <Form.Control
                type="number"
                placeholder="Budget"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                lang="en"
                step={".001"}
                required
              />
            </Form.Group>
            <Form.Group as={Col}>
              <Form.Label>Saving Cost Estimation</Form.Label>
              <Form.Control
                type="number"
                placeholder="Saving Cost"
                value={savingCost}
                onChange={(e) => setSavingCost(e.target.value)}
                lang="en"
                step={".001"}
                required
              />
            </Form.Group>
            <Form.Group as={Col}>
              <Form.Label>Start Project Date</Form.Label>
              <Form.Control
                type="date"
                placeholder="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group as={Col}>
              <Form.Label>SOP Project Date</Form.Label>
              <Form.Control
                type="date"
                placeholder="Saving Cost"
                value={sopDate}
                onChange={(e) => setSopDate(e.target.value)}
                required
              />
            </Form.Group>
          </Row>
          <Row className="mb-3" style={{ textAlign: "left" }}>
            <Form.Group as={Col}>
              <Form.Label>Members</Form.Label>
              <Form.Select onChange={handleMember} required>
                <option value="" disabled>
                  Open This
                </option>
                {userOption()}
              </Form.Select>
            </Form.Group>
            <Button>ADD</Button>
          </Row>
        </Form>
      </div>
    </div>
  );
}

export default Project;
