import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell } from "recharts";

import "./graphPie.css";
import { Col, Row } from "react-bootstrap";
import axios from "axios";
import { getAllProjectApi, getProjectByUserApi } from "../../Config/API";

const COLORS = ["#0088FE", "#707F91", "#82CA9D", "#FF8042", "red"];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  index,
}) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

function GraphPieProject(props) {
  const { userId, userPosition, userSection, dataForGraph } = props;
  const [data, setData] = useState([]);

  useEffect(() => {
    const dataFilter = (category, status, data) => {
      if (data.length > 0) {
        let notCryteria = [
          "Not Yet Started",
          "On Progress",
          "Finish",
          "Waiting Detail Activity",
          "cancel",
        ];

        const check = notCryteria.find((value) => value === status);
        if (!check) {
          let dataDelay = [];
          for (let index = 0; index < data.length; index++) {
            let checkData = notCryteria.find(
              (value) => value === data[index].status
            );
            if (!checkData) {
              dataDelay.push(data[index]);
            }
          }
          return dataDelay.filter((value) => value.category === category);
        } else {
          return data.filter(
            (value) => value.category === category && value.status === status
          );
        }
      }
    };

    if (userId && userPosition) {
      if (dataForGraph.length > 0) {
        const status = [
          "Not Yet Started",
          "On Progress",
          "Finish",
          "Waiting Detail Activity",
          "cancel",
          "Delay",
        ];

        const category = [
          "Productivity",
          "Quality",
          "Integrated Factory",
          "New Model",
          "Profit Improvement",
        ];

        const dataAfterFilter = [];
        for (let index1 = 0; index1 < category.length; index1++) {
          for (let index2 = 0; index2 < status.length; index2++) {
            const filter = dataFilter(
              category[index1],
              status[index2],
              dataForGraph
            );
            dataAfterFilter.push({
              category: category[index1],
              status: status[index2],
              data: filter,
            });
          }
        }
        const countingDataBaseOnStatus = (status) => {
          let counter = 0;
          for (let index = 0; index < dataAfterFilter.length; index++) {
            if (dataAfterFilter[index].status === status) {
              counter += dataAfterFilter[index].data.length;
            }
          }
          return counter;
        };
        const dataGraph = [
          {
            name: "Group A",
            value: countingDataBaseOnStatus("Finish"),
          },
          {
            name: "Group B",
            value: countingDataBaseOnStatus("Waiting Detail Activity"),
          },
          {
            name: "Group C",
            value: countingDataBaseOnStatus("On Progress"),
          },
          {
            name: "Group D",
            value: countingDataBaseOnStatus("Not Yet Started"),
          },
          {
            name: "Group E",
            value: countingDataBaseOnStatus("Delay"),
          },
        ];

        setData(dataGraph);
      } else {
        setData([])
      }
    }
  }, [userId, userPosition, userSection, dataForGraph]);

  return (
    <div>
      <PieChart width={500} height={200}>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={renderCustomizedLabel}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          legendType="diamond"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
      </PieChart>
      <Row>
        <Col style={{ textAlign: "left" }}>
          <div className="legendPie colorAbuAbu" /> Waiting Detail Activity{" "}
          <br />
          <div className="legendPie colorOrange" /> Not Yet Started <br />
          <div className="legendPie colorBlue" /> Project Finish <br />
        </Col>
        <Col style={{ textAlign: "left" }}>
          <div className="legendPie colorYellow " /> On Progress <br />
          <div className="legendPie colorRed " /> Delay <br />
        </Col>
      </Row>
    </div>
  );
}

export default GraphPieProject;
