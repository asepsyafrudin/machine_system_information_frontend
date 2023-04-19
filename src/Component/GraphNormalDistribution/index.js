import React, { useEffect, useState } from "react";
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";
import { DOUBLE_STANDARD, SINGLE_STANDARD_MIN } from "../../Config/const";

function GraphNormalDistribution(props) {
  const {
    standardMax,
    standardMin,
    standard,
    type,
    listData,
    sigma,
    average,
    actionValue,
  } = props;
  const [data, setData] = useState([]);
  const [minXAxis, setMinXAxis] = useState(0);
  const [maxXAxis, setMaxXAxis] = useState(0);

  useEffect(() => {
    const yValue = (xValue) => {
      let a =
        (-1 / 2) * ((xValue - parseFloat(average)) / parseFloat(sigma)) ** 2;
      let b = Math.E ** a;
      let c = 1 / (sigma * Math.sqrt(2 * Math.PI));
      let result = c * b;
      return result;
    };

    const setDataValue = () => {
      let arrayList = [];
      const totalRender = 50;
      let startGraph = 0;
      let endGraph = 0;

      if (type === DOUBLE_STANDARD) {
        startGraph =
          parseFloat(standardMin) -
          (parseFloat(standardMax) - parseFloat(standardMin)) / 4;

        endGraph =
          parseFloat(standardMax) +
          (parseFloat(standardMax) - parseFloat(standardMin)) / 4;
        let minXAxis = startGraph - (endGraph - startGraph) / 4;
        let maxXAxis = parseFloat(endGraph + (endGraph - startGraph) / 4);
        setMinXAxis(minXAxis);
        setMaxXAxis(maxXAxis);
      } else if (type === SINGLE_STANDARD_MIN) {
        startGraph = parseFloat(standard) - parseFloat(standardMin) / 4;

        let minXAxis = startGraph - startGraph / 4;
        setMinXAxis(minXAxis);
        setMaxXAxis("auto");
      } else {
        endGraph = parseFloat(standard) - parseFloat(standard) / 4;
        let maxXAxis = parseFloat(endGraph + endGraph / 4);
        setMinXAxis("auto");
        setMaxXAxis(maxXAxis);
      }
      let range = (endGraph - startGraph) / totalRender;
      for (let index = 0; index < totalRender; index++) {
        let checkValueY = yValue(startGraph);
        if (checkValueY > 0.001) {
          arrayList.push({
            name: index + 1,
            xValue: startGraph,
            yValue: checkValueY,
          });
        }
        startGraph += range;
      }
      setData(arrayList);
    };
    setDataValue();
  }, [
    listData,
    average,
    sigma,
    standardMin,
    standardMax,
    type,
    standard,
    actionValue,
  ]);

  return (
    <div>
      <ResponsiveContainer width="100%" height={300}>
        <ComposedChart
          data={data}
          margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
        >
          <XAxis dataKey="xValue" type="number" domain={[minXAxis, maxXAxis]} />
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip />
          <Legend />
          <CartesianGrid stroke="#f5f5f5" />
          <Area
            type="monotone"
            dataKey="yValue"
            fill="#8884d8"
            stroke="#8884d8"
          />
          {/* <Line type="monotone" dataKey="yValue" stroke="#ff7300" /> */}
          <ReferenceLine
            x={standardMin}
            stroke="blue"
            label={{
              value: "Minimum",
              position: "left",
            }}
          />
          <ReferenceLine
            x={standardMax}
            stroke="red"
            label={{
              value: "Maximum",
              position: "right",
            }}
          />
          <ReferenceLine
            x={`${(parseFloat(standardMax) + parseFloat(standardMin)) / 2}`}
            stroke="green"
            label={{
              value: "center",
              position: "inside",
            }}
            strokeDasharray="3 3"
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}

export default GraphNormalDistribution;