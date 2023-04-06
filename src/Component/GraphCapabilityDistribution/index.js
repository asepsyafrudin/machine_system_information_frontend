import React, { useEffect, useState } from "react";
import {
  Area,
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

function GraphCapabilityDistribution(props) {
  const { standardMax, standardMin, standard, type, listData, actionValue } =
    props;
  const data = [
    {
      name: "Page A",
      uv: 4000,
      pv: 2400,
      amt: 2400,
    },
    {
      name: "Page B",
      uv: 3000,
      pv: 1398,
      amt: 2210,
    },
    {
      name: "Page C",
      uv: 2000,
      pv: 9800,
      amt: 2290,
    },
    {
      name: "Page D",
      uv: 2780,
      pv: 3908,
      amt: 2000,
    },
    {
      name: "Page E",
      uv: 1890,
      pv: 4800,
      amt: 2181,
    },
    {
      name: "Page F",
      uv: 2390,
      pv: 3800,
      amt: 2500,
    },
    {
      name: "Page G",
      uv: 3490,
      pv: 4300,
      amt: 2100,
    },
  ];

  const intervalClass = () => {
    let value = 0;
    if (data.length > 0) {
      value = Math.ceil(1 + 3.3 * Math.log10(data.length));
    }
    return value;
  };

  const panjangKelas = () => {
    let value = 0;
    if (data.length > 0) {
      let dataCheck = [];
      for (let index = 0; index < data.length; index++) {
        dataCheck.push(data[index].uv);
      }
      let max = Math.max(...dataCheck);
      let min = Math.min(...dataCheck);

      value = (max - min) / intervalClass(data);
    }
    return value;
  };

  const setDataLListFunction = () => {};
  return (
    <div>
      <ResponsiveContainer width="100%" height={300}>
        <ComposedChart
          data={data}
          barCategoryGap={"0%"}
          barGap={"0%"}
          margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
        >
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <CartesianGrid stroke="#f5f5f5" />
          <Area type="monotone" dataKey="amt" fill="#8884d8" stroke="#8884d8" />
          <Bar dataKey="pv" barSize={150} fill="#413ea0" />
          <Line type="monotone" dataKey="uv" stroke="#ff7300" />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}

export default GraphCapabilityDistribution;
