import React, { useEffect, useState } from "react";
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  LabelList,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

function GraphCapabilityDistribution(props) {
  const { listData, actionValue, average, sigma } = props;
  const [data, setData] = useState([]);

  useEffect(() => {
    if (listData.length > 1) {
      const globalData = [];

      const intervalClass = () => {
        let value = 0;
        if (listData.length > 0) {
          value = Math.ceil(1 + 3.3 * Math.log10(listData.length));
        }
        return value;
      };

      const maxData = () => {
        if (listData.length > 0) {
          let dataCheck = [];
          for (let index = 0; index < listData.length; index++) {
            dataCheck.push(listData[index].data);
          }
          return Math.max(...dataCheck);
        }
        return 0;
      };

      const minData = () => {
        if (listData.length > 0) {
          let dataCheck = [];
          for (let index = 0; index < listData.length; index++) {
            dataCheck.push(listData[index].data);
          }
          return Math.min(...dataCheck);
        }
        return 0;
      };

      const panjangKelas = () => {
        let value = 0;
        if (listData.length > 0) {
          value = (maxData() - minData()) / intervalClass(listData);
        }
        return value;
      };

      const lineYValue = () => {
        if (listData.length > 0) {
          let dataCheck = [];
          let dataYArray = [];
          let arrayData = [];
          for (let index = 0; index < globalData.length; index++) {
            dataCheck.push(globalData[index].count);
            let a =
              (-1 / 2) * ((globalData[index].center - average) / sigma) ** 2;
            let b = Math.E ** a;
            let c = 1 / (sigma * Math.sqrt(2 * Math.PI));
            let result = c * b;
            dataYArray.push(result);
          }
          let dataMax = Math.max(...dataCheck);
          let YMax = Math.max(...dataYArray);

          const convertToYAxisValue = (data) => {
            let value = (dataMax * data) / YMax;
            return value;
          };

          if (dataYArray.length === dataCheck.length) {
            for (let index = 0; index < dataYArray.length; index++) {
              arrayData.push({
                name: globalData[index].name,
                count: globalData[index].count,
                center: globalData[index].center,
                dataY: dataYArray[index],
                yAxis: parseFloat(
                  (
                    Math.round(convertToYAxisValue(dataYArray[index]) * 100) /
                    100
                  ).toFixed(2)
                ),
              });
            }
          }
          setData(arrayData);
        }
      };
      const setDataListFunction = () => {
        if (listData.length > 1) {
          let arrayList = [];
          const range = panjangKelas();
          const interval = intervalClass();
          const min = minData();
          let start = min;
          let end = 0;
          let center = 0;
          for (let index = 0; index < interval; index++) {
            if (index === 0) {
              end = start + range;
              center = (start + end) / 2;
            } else {
              start = end;
              end = start + range;
              center = (start + end) / 2;
            }
            let count = 0;
            for (let index = 0; index < listData.length; index++) {
              if (listData[index].data >= start && listData[index].data < end) {
                count += 1;
              }
            }
            arrayList.push({
              name: `${(Math.round(start * 100) / 100).toFixed(2)} - ${(
                Math.round(end * 100) / 100
              ).toFixed(2)}`,
              count: count,
              center: center,
            });
          }
          globalData.push(...arrayList);
        }
      };
      setDataListFunction();
      lineYValue();
    }
  }, [listData, actionValue, average, sigma]);

  const maxYAxis = () => {
    if (data.length > 0) {
      let dataCheck = [];
      for (let index = 0; index < data.length; index++) {
        dataCheck.push(data[index].count);
      }
      let yaxis = Math.max(...dataCheck);
      return yaxis + yaxis / 4;
    }
    return 0;
  };

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
          <YAxis
            label={{ value: "Frequency", angle: -90, position: "insideLeft" }}
            domain={[0, maxYAxis()]}
          />
          <Tooltip />
          <Legend />
          <CartesianGrid stroke="#f5f5f5" />
          {/* <Area
            type="monotone"
            dataKey="yAxis"
            fill="#8884d8"
            stroke="#8884d8"
          /> */}
          <Bar dataKey="count" barSize={150} fill="#413ea0">
            <LabelList dataKey="count" position="top" />
          </Bar>
          {/* <Line type="monotone" dataKey="yAxis" stroke="#ff7300" /> */}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}

export default GraphCapabilityDistribution;
