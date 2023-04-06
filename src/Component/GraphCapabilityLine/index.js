import React, { useEffect, useState } from "react";
import {
  CartesianGrid,
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
  const { standardMax, standardMin, standard, type, listData, actionValue } =
    props;
  const [data, setData] = useState([]);
  useEffect(() => {
    if (listData.length > 0) {
      let newData = [];
      for (let index = 0; index < listData.length; index++) {
        newData.push({
          no: index + 1,
          data: listData[index].data,
        });
      }
      setData(newData);
    }
  }, [listData, actionValue]);

  const min = () => {
    let newValue =
      parseFloat(standardMin) -
      (parseFloat(standardMax) - parseFloat(standardMin)) / 2;
    let number = (Math.round(newValue * 100) / 100).toFixed(2);

    return parseFloat(number);
  };

  const max = () => {
    let newValue =
      parseFloat(standardMax) +
      (parseFloat(standardMax) - parseFloat(standardMin)) / 2;
    let number = (Math.round(newValue * 100) / 100).toFixed(2);
    return parseFloat(number);
  };

  const domain = (type) => {
    let dataCheck = [];
    for (let index = 0; index < data.length; index++) {
      dataCheck.push(data[index].data);
    }
    if (type === DOUBLE_STANDARD) {
      return [min(), max()];
    } else if (type === SINGLE_STANDARD_MAX) {
      if (parseFloat(standard) < 0) {
        let minData = Math.min(...dataCheck);
        let minYAxis = minData * 1.2;
        return [minYAxis, parseFloat(standard) + parseFloat(standard) * -0.2];
      }
      return [0, max(parseFloat(standard))];
    } else if (type === SINGLE_STANDARD_MIN) {
      return [min(), "auto"];
    }

    return [0, "auto"];
  };

  return (
    <div>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="no" />
          <YAxis domain={domain(type)} />
          {type === DOUBLE_STANDARD ? (
            <>
              <ReferenceLine
                y={standardMax}
                label="Maximum Standard"
                stroke="red"
              />
              <ReferenceLine
                y={standardMin}
                label="Minimum Standard"
                stroke="blue"
              />
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
          <Line type="monotone" dataKey="data" stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default GraphCapabilityLine;
