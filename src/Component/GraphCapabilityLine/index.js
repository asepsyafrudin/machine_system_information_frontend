import React, { useEffect, useState } from "react";
import {
  CartesianGrid,
  Label,
  Legend,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  DOUBLE_STANDARD,
  SINGLE_STANDARD_MAX,
  SINGLE_STANDARD_MIN,
} from "../../Config/const";

function GraphCapabilityLine(props) {
  const {
    standardMax,
    standardMin,
    standard,
    type,
    listData,
    actionValue,
    listData2,
    status,
  } = props;
  const [data, setData] = useState([]);
  const [minDomain, setMinDomain] = useState("auto");
  const [maxDomain, setMaxDomain] = useState("auto");

  useEffect(() => {
    let totalDataLengthMax = 0;
    if (status === "compare") {
      if (listData.length > listData2.length) {
        totalDataLengthMax = listData.length;
      } else {
        totalDataLengthMax = listData2.length;
      }
    } else {
      totalDataLengthMax = listData.length;
    }

    if (totalDataLengthMax > 0) {
      let newData = [];
      for (let index = 0; index < totalDataLengthMax; index++) {
        newData.push({
          no: index + 1,
          data: index < listData.length && listData[index].data,
          data2: index < listData2.length && listData2[index].data,
        });
      }

      setData(newData);
    }

    const min = () => {
      if (type === DOUBLE_STANDARD) {
        let newValue =
          parseFloat(standardMin) -
          (parseFloat(standardMax) - parseFloat(standardMin)) / 2;
        let number = (Math.round(newValue * 100) / 100).toFixed(2);
        return parseFloat(number);
      } else if (type === SINGLE_STANDARD_MIN) {
        let newValue = parseFloat(standard) - parseFloat(standard) / 2;
        let number = (Math.round(newValue * 100) / 100).toFixed(2);
        return parseFloat(number);
      }
      return "auto";
    };

    const max = () => {
      if (type === DOUBLE_STANDARD) {
        let newValue =
          parseFloat(standardMax) +
          (parseFloat(standardMax) - parseFloat(standardMin)) / 2;
        let number = (Math.round(newValue * 100) / 100).toFixed(2);
        return parseFloat(number);
      } else if (type === SINGLE_STANDARD_MAX) {
        let newValue = parseFloat(standard) + parseFloat(standard) / 4;
        let number = (Math.round(newValue * 100) / 100).toFixed(2);
        console.log(newValue);
        return parseFloat(number);
      }
      return "auto";
    };

    let dataCheck = [];
    for (let index = 0; index < listData.length; index++) {
      dataCheck.push(listData[index].data);
    }
    for (let index = 0; index < listData2.length; index++) {
      dataCheck.push(listData[index].data);
    }
    if (type === DOUBLE_STANDARD) {
      setMinDomain(min());
      setMaxDomain(max());
    } else if (type === SINGLE_STANDARD_MAX) {
      setMaxDomain(max());
    } else if (type === SINGLE_STANDARD_MIN) {
      setMinDomain(min());
    }
  }, [
    listData,
    actionValue,
    listData2,
    status,
    standardMin,
    standardMax,
    type,
    standard,
  ]);

  return (
    <div>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="no" />
          <YAxis domain={[minDomain, maxDomain]} />
          {type === DOUBLE_STANDARD ? (
            <>
              <ReferenceLine y={standardMax} stroke="red">
                <Label value={"Maximum Standard"} position={"top"} />
              </ReferenceLine>
              <ReferenceLine y={standardMin} stroke="blue">
                <Label value={"Minimum Standard"} position={"bottom"} />
              </ReferenceLine>
              <ReferenceLine
                y={(parseFloat(standardMin) + parseFloat(standardMax)) / 2}
                stroke="green"
                strokeDasharray="3 3"
              >
                <Label value={"Center Standard"} position={"center"} />
              </ReferenceLine>
            </>
          ) : (
            <ReferenceLine
              y={standard}
              label={
                type === SINGLE_STANDARD_MAX
                  ? "Max Standard"
                  : "Minimum Standard"
              }
              stroke="#f81607"
            />
          )}
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="data"
            stroke="#8884d8"
            name="Current"
          />
          {status === "compare" && (
            <Line
              type="monotone"
              dataKey={"data2"}
              stroke="#8cc3a9"
              name="After"
            />
          )}
        </LineChart>
      </ResponsiveContainer>
      <div>
        Set Y Axis Value Min :{" "}
        <input
          type="number"
          lang="en"
          step={".001"}
          onChange={(e) => setMinDomain(parseFloat(e.target.value))}
          value={minDomain}
        />{" "}
        Max :{" "}
        <input
          type="number"
          lang="en"
          step={".001"}
          onChange={(e) => setMaxDomain(parseFloat(e.target.value))}
          value={maxDomain}
        />
      </div>
    </div>
  );
}

export default GraphCapabilityLine;
