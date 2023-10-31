import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Col, Row } from "react-bootstrap";

function GraphBarProject(props) {
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

        const dataGraph = [
          {
            category: "Productivity",
            notYetStarted: dataAfterFilter[0].data.length,
            onProgress: dataAfterFilter[1].data.length,
            finish: dataAfterFilter[2].data.length,
            waitingDetailActivity: dataAfterFilter[3].data.length,
            cancel: dataAfterFilter[4].data.length,
            delay: dataAfterFilter[5].data.length,
          },
          {
            category: "Quality",
            notYetStarted: dataAfterFilter[6].data.length,
            onProgress: dataAfterFilter[7].data.length,
            finish: dataAfterFilter[8].data.length,
            waitingDetailActivity: dataAfterFilter[9].data.length,
            cancel: dataAfterFilter[10].data.length,
            delay: dataAfterFilter[11].data.length,
          },
          {
            category: "Integrated ",
            notYetStarted: dataAfterFilter[12].data.length,
            onProgress: dataAfterFilter[13].data.length,
            finish: dataAfterFilter[14].data.length,
            waitingDetailActivity: dataAfterFilter[15].data.length,
            cancel: dataAfterFilter[16].data.length,
            delay: dataAfterFilter[17].data.length,
          },
          {
            category: "New Model",
            notYetStarted: dataAfterFilter[18].data.length,
            onProgress: dataAfterFilter[19].data.length,
            finish: dataAfterFilter[20].data.length,
            waitingDetailActivity: dataAfterFilter[21].data.length,
            cancel: dataAfterFilter[22].data.length,
            delay: dataAfterFilter[23].data.length,
          },
          {
            category: `Profit`,
            notYetStarted: dataAfterFilter[24].data.length,
            onProgress: dataAfterFilter[25].data.length,
            finish: dataAfterFilter[26].data.length,
            waitingDetailActivity: dataAfterFilter[27].data.length,
            cancel: dataAfterFilter[28].data.length,
            delay: dataAfterFilter[29].data.length,
          },
        ];

        setData(dataGraph);
      } else {
        setData([]);
      }
    }
  }, [userId, userSection, userPosition, dataForGraph]);

  return (
    <div>
      Total :
      <span style={{ color: "blue", fontWeight: "bold" }}>
        {dataForGraph && dataForGraph.length} Item
      </span>
      <ResponsiveContainer width="100%" height={300}>
        <ComposedChart
          data={data}
          barCategoryGap={"0%"}
          barGap={"0%"}
          margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
        >
          <XAxis
            dataKey="category"
            type="category"
            padding={"gap"}
            height={60}
          ></XAxis>
          <YAxis label={{ value: "QTY", angle: -90, position: "insideLeft" }} />
          <Tooltip />
          <CartesianGrid stroke="#f5f5f5" />
          <Bar
            dataKey="notYetStarted"
            stackId="a"
            barSize={150}
            fill="#ff8042"
          />
          <Bar dataKey="onProgress" stackId="a" barSize={150} fill="#82ca9d" />
          <Bar dataKey="finish" stackId="a" barSize={150} fill="#0088fe" />
          <Bar
            dataKey="waitingDetailActivity"
            stackId="a"
            barSize={150}
            fill="#707f91"
          />
          <Bar dataKey="delay" stackId="a" barSize={150} fill="red" />
        </ComposedChart>
      </ResponsiveContainer>
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

export default GraphBarProject;
