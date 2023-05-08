import React, { useEffect, useState } from "react";
import {
  Label,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { DOUBLE_STANDARD, SINGLE_STANDARD_MAX } from "../../Config/const";

function GraphDistribution(props) {
  const {
    standardMax,
    standardMin,
    standard,
    average,
    average2,
    type,
    actionValue,
    sigma,
    sigma2,
    status,
  } = props;
  const [data, setData] = useState([]);
  const [data2, setData2] = useState([]);
  const [batasBawah, setBatasBawah] = useState("");
  const [batasAtas, setBatasAtas] = useState("");

  useEffect(() => {
    const buluKanan = parseFloat(average) + 4 * parseFloat(sigma);
    const buluKiri = parseFloat(average) - 4 * parseFloat(sigma);
    const buluKanan2 = parseFloat(average2) + 4 * parseFloat(sigma2);
    const buluKiri2 = parseFloat(average2) - 4 * parseFloat(sigma2);
    let data1 = {
      y: status === "compare" ? 2 : 1.5,
      x: buluKiri,
    };

    let data2 = {
      y: status === "compare" ? 2 : 1.5,
      x: parseFloat(average),
    };

    let data3 = {
      y: status === "compare" ? 2 : 1.5,
      x: buluKanan,
    };

    let data4 = {
      y: 4,
      x: buluKiri2,
    };

    let data5 = {
      y: 4,
      x: parseFloat(average2),
    };

    let data6 = {
      y: 4,
      x: buluKanan2,
    };

    setData([data1, data2, data3]);
    setData2([data4, data5, data6]);

    if (type === DOUBLE_STANDARD) {
      setBatasAtas(parseFloat(standardMax));
      setBatasBawah(parseFloat(standardMin));
    } else if (type === SINGLE_STANDARD_MAX) {
      const batasBawah = Math.min([buluKiri, buluKiri2]);
      setBatasBawah(batasBawah);
      setBatasAtas(standard);
    } else {
      const batasAtas = Math.max([buluKanan, buluKanan2]);
      setBatasAtas(batasAtas);
      setBatasBawah(standard);
    }
  }, [
    actionValue,
    average,
    sigma,
    average2,
    sigma2,
    status,
    standard,
    standardMax,
    standardMin,
    type,
  ]);

  const refrensilineX = () => {
    if (batasAtas !== "" && batasBawah !== "") {
      const gap = (batasAtas - batasBawah) / 8;
      return (
        <>
          <ReferenceLine x={parseFloat(batasBawah)} stroke="red">
            <Label position={"bottom"} value={parseFloat(batasBawah)} />
          </ReferenceLine>
          <ReferenceLine
            x={parseFloat(batasBawah) + gap}
            stroke="#dfdfdf"
            strokeDasharray="3 3"
          >
            <Label position={"bottom"} value={parseFloat(batasBawah) + gap} />
          </ReferenceLine>
          <ReferenceLine
            x={parseFloat(batasBawah) + 2 * gap}
            stroke="#dfdfdf"
            strokeDasharray="3 3"
          >
            <Label
              position={"bottom"}
              value={parseFloat(batasBawah) + 2 * gap}
            />
          </ReferenceLine>
          <ReferenceLine
            x={parseFloat(batasBawah) + 3 * gap}
            stroke="#dfdfdf"
            strokeDasharray="3 3"
          >
            <Label
              position={"bottom"}
              value={parseFloat(batasBawah) + 3 * gap}
            />
          </ReferenceLine>
          <ReferenceLine
            x={parseFloat(batasBawah) + 4 * gap}
            stroke="red"
            strokeDasharray="3 3"
          >
            <Label
              position={"bottom"}
              value={parseFloat(batasBawah) + 4 * gap}
            />
          </ReferenceLine>
          <ReferenceLine
            x={parseFloat(batasBawah) + 5 * gap}
            stroke="#dfdfdf"
            strokeDasharray="3 3"
          >
            <Label
              position={"bottom"}
              value={parseFloat(batasBawah) + 5 * gap}
            />
          </ReferenceLine>
          <ReferenceLine
            x={parseFloat(batasBawah) + 6 * gap}
            stroke="#dfdfdf"
            strokeDasharray="3 3"
          >
            <Label
              position={"bottom"}
              value={parseFloat(batasBawah) + 6 * gap}
            />
          </ReferenceLine>
          <ReferenceLine
            x={parseFloat(batasBawah) + 7 * gap}
            stroke="#dfdfdf"
            strokeDasharray="3 3"
          >
            <Label
              position={"bottom"}
              value={parseFloat(batasBawah) + 7 * gap}
            />
          </ReferenceLine>
          <ReferenceLine x={parseFloat(batasBawah) + 8 * gap} stroke="red">
            <Label
              position={"bottom"}
              value={parseFloat(batasBawah) + 8 * gap}
            />
          </ReferenceLine>
        </>
      );
    }
  };

  return (
    <div>
      <ResponsiveContainer width="100%" height={300}>
        <ScatterChart
          layout="vertical"
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <XAxis
            type="number"
            dataKey="x"
            domain={[batasBawah, batasAtas]}
            visibility={"hidden"}
          />
          {refrensilineX()}
          <YAxis
            type="number"
            dataKey="y"
            domain={status === "compare" ? [0, 6] : [0, 3]}
            visibility={"hidden"}
          />
          <Tooltip />
          <Legend />

          <Scatter
            name="Current"
            data={data}
            fill="#82ca9d"
            line
            strokeWidth={5}
            shape="diamond"
          />

          {status === "compare" && (
            <Scatter
              name="After"
              data={data2}
              fill="#084cdf"
              strokeWidth={5}
              line
              shape="diamond"
            />
          )}
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}

export default GraphDistribution;
