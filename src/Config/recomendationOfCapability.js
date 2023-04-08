const RULE_1 = "One point beyond the 3 σ control limit";
const RULE_2 =
  "Eight or more points on one side of the centerline without crossing";
const RULE_3 =
  "Four out of five points in zone B (over than center +/- 1 Sigma) or beyond";
const RULE_4 = "Six points or more in a row steadily increasing or decreasing";
const RULE_5 =
  "Two out of three points in zone A (over than center +/- 2 sigma)";
const RULE_6 = "14 points in a row alternating up and down";
// const RULE_7 = "Any noticeable/predictable pattern, cycle, or trend";

const CATEGORY_1 = "Equipment, Machines, and Tooling";
const CATEGORY_2 = "Environment";
const CATEGORY_3 = "Process";
const CATEGORY_4 = "Inspection";
const CATEGORY_5 = "Materials";
const CATEGORY_6 = "Operator";

const RULE_1_CATEGORY_1_ITEM = [
  "improper start-up",
  "improper setup",
  "sudden support system failure (cooling, heating, compressed air, vacuum, steam, etc.)",
  "tool failure/breakage",
  "equipment or machine failure",
  "improper equipment, machine, and tooling maintenance",
  "utility interruption",
];
const RULE_1_CATEGORY_2_ITEM = [
  "temperature suddenly too low/high",
  "humidity suddenly too low/high",
];
const RULE_1_CATEGORY_3_ITEM = [
  "equipment has not stabilized (warmed-up)",
  "inadequate work instructions",
  "missed process step",
  "new process",
];
const RULE_1_CATEGORY_4_ITEM = [
  "inspection, measuring, and testing equipment not properly calibrated",
  "damaged inspection, measuring, and testing equipment",
];
const RULE_1_CATEGORY_5_ITEM = [
  "change in raw materials",
  "change in components",
  "handling damage",
  "expired materials",
];
const RULE_1_CATEGORY_6_ITEM = [
  "new operators",
  "inadequate training",
  "operator interrupted or distracted",
  "operator overcompensating when making process adjustments",
];

const RULE_2_CATEGORY_1_ITEM = [
  "improper setup",
  "improper equipment, machine, and tooling maintenance",
  "damaged tooling",
  "tool wear",
];
const RULE_2_CATEGORY_2_ITEM = [
  "temperature shifted too low/high",
  "humidity shifted too low/high",
];
const RULE_2_CATEGORY_3_ITEM = [
  "new process parameters",
  "incorrect process parameters",
  "process has improved",
  "process has degraded",
];
const RULE_2_CATEGORY_4_ITEM = [
  "inspection, measuring, and testing equipment not properly calibrated",
  "damaged inspection, measuring, and testing equipment",
];
const RULE_2_CATEGORY_5_ITEM = [
  "change in raw materials",
  "change in components",
  "expired materials",
];
const RULE_2_CATEGORY_6_ITEM = [
  "new operators",
  "inadequate training",
  "operator interrupted or distracted",
  "shift change",
];

const RULE_3_CATEGORY_1_ITEM = [
  "improper setup",
  "intermittent support system failure (cooling, heating, compressed air, vacuum, steam, etc.)",
  "improper equipment, machine, and tooling maintenance",
];

const RULE_3_CATEGORY_2_ITEM = [
  "temperature suddenly too low/high",
  "humidity suddenly too low/high",
];
const RULE_3_CATEGORY_3_ITEM = [
  "new process parameters",
  "incorrect process parameters",
  "process has improved",
  "process has degraded",
];
const RULE_3_CATEGORY_4_ITEM = [
  "inspection, measuring, and testing equipment not properly calibrated",
  "inspection, measuring, and testing equipment not adequate for the intended use",
  "damaged inspection, measuring, and testing equipment",
];
const RULE_3_CATEGORY_5_ITEM = ["mixed raw materials", "mixed components"];
const RULE_3_CATEGORY_6_ITEM = [
  "new operators",
  "inadequate training",
  "operator interrupted or distracted",
  "shift change",
];

const RULE_4_CATEGORY_1_ITEM = [
  "gradual support system failure (cooling, heating, compressed air, vacuum, steam, etc.)",
  "tool wear",
];
const RULE_4_CATEGORY_2_ITEM = [
  "temperature gradually drifting too low/high",
  "humidity gradually drifting too low/high",
];
const RULE_4_CATEGORY_3_ITEM = ["process is slowly degrading"];
const RULE_4_CATEGORY_4_ITEM = [
  "inspection, measuring, and testing equipment not adequate for the intended use",
  "damaged inspection, measuring, and testing equipment",
];
const RULE_4_CATEGORY_5_ITEM = [
  "variation in the raw materials",
  "variation in the components",
];
const RULE_4_CATEGORY_6_ITEM = ["operator distracted"];

const RULE_5_CATEGORY_1_ITEM = [
  "improper setup",
  "support system failure (cooling, heating, compressed air, vacuum, steam, etc.)",
  "improper equipment, machine, and tooling maintenance",
];
const RULE_5_CATEGORY_2_ITEM = [
  "temperature suddenly too low/high",
  "humidity suddenly too low/high",
];
const RULE_5_CATEGORY_3_ITEM = [
  "new process parameters",
  "incorrect process parameters",
  "process has degraded",
];
const RULE_5_CATEGORY_4_ITEM = [
  "inspection, measuring, and testing equipment not properly calibrated",
  "inspection, measuring, and testing equipment not adequate for the intended use",
  "damaged inspection, measuring, and testing equipment",
];
const RULE_5_CATEGORY_5_ITEM = ["mixed raw materials", "mixed components"];
const RULE_5_CATEGORY_6_ITEM = [
  "new operators",
  "inadequate training",
  "operator interrupted or distracted",
  "shift change",
];

const RULE_6_CATEGORY_1_ITEM = [
  "improper setup",
  "intermittent support system failure (cooling, heating, compressed air, vacuum, steam, etc.)",
  "improper equipment, machine, and tooling maintenance",
];
const RULE_6_CATEGORY_2_ITEM = [
  "temperature intermittently too low/high",
  "humidity intermittently too low/high",
];
const RULE_6_CATEGORY_3_ITEM = [
  "equipment has not stabilized (warmed-up)",
  "new process parameters",
  "incorrect process parameters",
  "inadequate work instructions",
  "missed process step",
  "new process",
];
const RULE_6_CATEGORY_4_ITEM = [
  "inspection, measuring, and testing equipment not adequate for the intended use",
  "damaged inspection, measuring, and testing equipment",
];
const RULE_6_CATEGORY_5_ITEM = ["mixed raw materials", "mixed components"];
const RULE_6_CATEGORY_6_ITEM = [
  "new operators",
  "inadequate training",
  "operator overcompensating when making process adjustments",
  "operator not waiting for the process to stabilize before making process adjustments",
];

// const RULE_7_CATEGORY_1_ITEM = [
//   "improper setup",
//   "intermittent support system failure (cooling, heating, compressed air, vacuum, steam, etc.)",
//   "gradual support system failure (cooling, heating, compressed air, vacuum, steam, etc.)",
//   "improper equipment, machine, and tooling maintenance",
//   "tool wear",
// ];
// const RULE_7_CATEGORY_2_ITEM = [
//   "temperature gradually drifting too low/high",
//   "humidity gradually drifting too low/high",
//   "temperature shifted too low/high",
//   "humidity shifted too low/high",
//   "temperature intermittently too low/high",
//   "humidity intermittently too low/high",
// ];
// const RULE_7_CATEGORY_3_ITEM = [
//   "equipment has not stabilized (warmed-up)",
//   "new process parameters",
//   "incorrect process parameters",
//   "inadequate work instructions",
//   "missed process step",
//   "new process",
//   "two or more processes",
// ];
// const RULE_7_CATEGORY_4_ITEM = [
//   "inspection, measuring, and testing equipment not properly calibrated",
//   "inspection, measuring, and testing equipment not adequate for the intended use",
// ];
// const RULE_7_CATEGORY_5_ITEM = [
//   "change in raw materials",
//   "change in components",
//   "mixed raw materials",
//   "mixed components",
//   "variation in the raw materials",
//   "variation in the components",
// ];
// const RULE_7_CATEGORY_6_ITEM = [
//   "new operators",
//   "inadequate training",
//   "operator interrupted or distracted",
//   "multiple shifts",
// ];

const RECOMENDATION = (
  dataList,
  standardMax,
  standardMin,
  sigma,
  type,
  cp,
  cpk
) => {
  const max = parseFloat(standardMax);
  const min = parseFloat(standardMin);
  const sigmaData = parseFloat(sigma);

  const center = (max + min) / 2;
  const sigma_1 = center + sigmaData;
  const sigma_2 = center + 2 * sigmaData;
  const sigma_3 = center + 3 * sigmaData;
  const sigma_4 = center - sigmaData;
  const sigma_5 = center - 2 * sigmaData;
  const sigma_6 = center - 3 * sigmaData;

  let result = [];

  const rule_1 = () => {
    let count = 0;
    for (let index = 0; index < dataList.length; index++) {
      if (dataList[index].data > sigma_3) {
        count++;
      } else if (dataList[index].data < sigma_6) {
        count++;
      }
    }
    if (count > 0) {
      result.push({
        rule: RULE_1,
        category: [
          {
            title: CATEGORY_1,
            item: RULE_1_CATEGORY_1_ITEM,
          },
          {
            title: CATEGORY_2,
            item: RULE_1_CATEGORY_2_ITEM,
          },
          {
            title: CATEGORY_3,
            item: RULE_1_CATEGORY_3_ITEM,
          },
          {
            title: CATEGORY_4,
            item: RULE_1_CATEGORY_4_ITEM,
          },
          {
            title: CATEGORY_5,
            item: RULE_1_CATEGORY_5_ITEM,
          },
          {
            title: CATEGORY_6,
            item: RULE_1_CATEGORY_6_ITEM,
          },
        ],
      });
      return;
    }
  };

  const rule_2 = () => {
    let count = 0;
    for (let index = 0; index < dataList.length; index++) {
      if (dataList[index].data > center) {
        count++;
        if (count >= 8) {
          result.push({
            rule: RULE_2,
            category: [
              {
                title: CATEGORY_1,
                item: RULE_2_CATEGORY_1_ITEM,
              },
              {
                title: CATEGORY_2,
                item: RULE_2_CATEGORY_2_ITEM,
              },
              {
                title: CATEGORY_3,
                item: RULE_2_CATEGORY_3_ITEM,
              },
              {
                title: CATEGORY_4,
                item: RULE_2_CATEGORY_4_ITEM,
              },
              {
                title: CATEGORY_5,
                item: RULE_2_CATEGORY_5_ITEM,
              },
              {
                title: CATEGORY_6,
                item: RULE_2_CATEGORY_6_ITEM,
              },
            ],
          });
          return;
        }
      } else {
        count = 0;
      }
    }

    for (let index = 0; index < dataList.length; index++) {
      if (dataList[index].data < center) {
        count++;
        if (count >= 8) {
          result.push({
            rule: RULE_2,
            category: [
              {
                title: CATEGORY_1,
                item: RULE_2_CATEGORY_1_ITEM,
              },
              {
                title: CATEGORY_2,
                item: RULE_2_CATEGORY_2_ITEM,
              },
              {
                title: CATEGORY_3,
                item: RULE_2_CATEGORY_3_ITEM,
              },
              {
                title: CATEGORY_4,
                item: RULE_2_CATEGORY_4_ITEM,
              },
              {
                title: CATEGORY_5,
                item: RULE_2_CATEGORY_5_ITEM,
              },
              {
                title: CATEGORY_6,
                item: RULE_2_CATEGORY_6_ITEM,
              },
            ],
          });
          return;
        }
      } else {
        count = 0;
      }
    }
  };

  const rule_3 = () => {
    let count = 0;
    for (let index = 0; index < dataList.length; index++) {
      if (dataList[index].data > sigma_1 && dataList[index].data < sigma_3) {
        count++;
        if (count >= 5) {
          result.push({
            rule: RULE_3,
            category: [
              {
                title: CATEGORY_1,
                item: RULE_3_CATEGORY_1_ITEM,
              },
              {
                title: CATEGORY_2,
                item: RULE_3_CATEGORY_2_ITEM,
              },
              {
                title: CATEGORY_3,
                item: RULE_3_CATEGORY_3_ITEM,
              },
              {
                title: CATEGORY_4,
                item: RULE_3_CATEGORY_4_ITEM,
              },
              {
                title: CATEGORY_5,
                item: RULE_3_CATEGORY_5_ITEM,
              },
              {
                title: CATEGORY_6,
                item: RULE_3_CATEGORY_6_ITEM,
              },
            ],
          });
          return;
        }
      } else {
        count = 0;
      }
    }

    for (let index = 0; index < dataList.length; index++) {
      if (dataList[index].data < sigma_4 && dataList[index].data > sigma_6) {
        count++;
        if (count >= 8) {
          result.push({
            rule: RULE_3,
            category: [
              {
                title: CATEGORY_1,
                item: RULE_3_CATEGORY_1_ITEM,
              },
              {
                title: CATEGORY_2,
                item: RULE_3_CATEGORY_2_ITEM,
              },
              {
                title: CATEGORY_3,
                item: RULE_3_CATEGORY_3_ITEM,
              },
              {
                title: CATEGORY_4,
                item: RULE_3_CATEGORY_4_ITEM,
              },
              {
                title: CATEGORY_5,
                item: RULE_3_CATEGORY_5_ITEM,
              },
              {
                title: CATEGORY_6,
                item: RULE_3_CATEGORY_6_ITEM,
              },
            ],
          });
          return;
        }
      } else {
        count = 0;
      }
    }
  };

  const rule_4 = () => {
    let count = 0;
    for (let index = 1; index < dataList.length; index++) {
      if (dataList[index - 1].data > dataList[index].data) {
        count++;
        if (count >= 6) {
          result.push({
            rule: RULE_4,
            category: [
              {
                title: CATEGORY_1,
                item: RULE_4_CATEGORY_1_ITEM,
              },
              {
                title: CATEGORY_2,
                item: RULE_4_CATEGORY_2_ITEM,
              },
              {
                title: CATEGORY_3,
                item: RULE_4_CATEGORY_3_ITEM,
              },
              {
                title: CATEGORY_4,
                item: RULE_4_CATEGORY_4_ITEM,
              },
              {
                title: CATEGORY_5,
                item: RULE_4_CATEGORY_5_ITEM,
              },
              {
                title: CATEGORY_6,
                item: RULE_4_CATEGORY_6_ITEM,
              },
            ],
          });
          return;
        }
      } else {
        count = 0;
      }
    }

    for (let index = 1; index < dataList.length; index++) {
      if (dataList[index - 1].data < dataList[index].data) {
        count++;
        if (count >= 6) {
          result.push({
            rule: RULE_4,
            category: [
              {
                title: CATEGORY_1,
                item: RULE_4_CATEGORY_1_ITEM,
              },
              {
                title: CATEGORY_2,
                item: RULE_4_CATEGORY_2_ITEM,
              },
              {
                title: CATEGORY_3,
                item: RULE_4_CATEGORY_3_ITEM,
              },
              {
                title: CATEGORY_4,
                item: RULE_4_CATEGORY_4_ITEM,
              },
              {
                title: CATEGORY_5,
                item: RULE_4_CATEGORY_5_ITEM,
              },
              {
                title: CATEGORY_6,
                item: RULE_4_CATEGORY_6_ITEM,
              },
            ],
          });
          return;
        }
      } else {
        count = 0;
      }
    }
  };

  const rule_5 = () => {
    let count = 0;
    for (let index = 0; index < dataList.length; index++) {
      if (dataList[index].data > sigma_2) {
        count++;
        if (count >= 2) {
          result.push({
            rule: RULE_5,
            category: [
              {
                title: CATEGORY_1,
                item: RULE_5_CATEGORY_1_ITEM,
              },
              {
                title: CATEGORY_2,
                item: RULE_5_CATEGORY_2_ITEM,
              },
              {
                title: CATEGORY_3,
                item: RULE_5_CATEGORY_3_ITEM,
              },
              {
                title: CATEGORY_4,
                item: RULE_5_CATEGORY_4_ITEM,
              },
              {
                title: CATEGORY_5,
                item: RULE_5_CATEGORY_5_ITEM,
              },
              {
                title: CATEGORY_6,
                item: RULE_5_CATEGORY_6_ITEM,
              },
            ],
          });
          return;
        }
      } else {
        count = 0;
      }
    }

    for (let index = 0; index < dataList.length; index++) {
      if (dataList[index].data < sigma_5) {
        count++;
        if (count >= 2) {
          result.push({
            rule: RULE_5,
            category: [
              {
                title: CATEGORY_1,
                item: RULE_5_CATEGORY_1_ITEM,
              },
              {
                title: CATEGORY_2,
                item: RULE_5_CATEGORY_2_ITEM,
              },
              {
                title: CATEGORY_3,
                item: RULE_5_CATEGORY_3_ITEM,
              },
              {
                title: CATEGORY_4,
                item: RULE_5_CATEGORY_4_ITEM,
              },
              {
                title: CATEGORY_5,
                item: RULE_5_CATEGORY_5_ITEM,
              },
              {
                title: CATEGORY_6,
                item: RULE_5_CATEGORY_6_ITEM,
              },
            ],
          });
          return;
        }
      } else {
        count = 0;
      }
    }
  };

  const rule_6 = () => {
    let count = 0;
    for (let index = 1; index < dataList.length - 1; index = index + 2) {
      if (
        dataList[index - 1].data > dataList[index].data &&
        dataList[index].data < dataList[index + 1].data
      ) {
        count = count + 2;
        if (count >= 6) {
          result.push({
            rule: RULE_6,
            category: [
              {
                title: CATEGORY_1,
                item: RULE_6_CATEGORY_1_ITEM,
              },
              {
                title: CATEGORY_2,
                item: RULE_6_CATEGORY_2_ITEM,
              },
              {
                title: CATEGORY_3,
                item: RULE_6_CATEGORY_3_ITEM,
              },
              {
                title: CATEGORY_4,
                item: RULE_6_CATEGORY_4_ITEM,
              },
              {
                title: CATEGORY_5,
                item: RULE_6_CATEGORY_5_ITEM,
              },
              {
                title: CATEGORY_6,
                item: RULE_6_CATEGORY_6_ITEM,
              },
            ],
          });
          return;
        }
      } else {
        count = 0;
      }
    }
  };

  const startRule = () => {
    rule_1();
    rule_2();
    rule_3();
    rule_4();
    rule_5();
    rule_6();
  };

  startRule();

  let summary = {
    role: [],
    category: [
      {
        title: CATEGORY_1,
        item: [],
      },
      {
        title: CATEGORY_2,
        item: [],
      },
      {
        title: CATEGORY_3,
        item: [],
      },
      {
        title: CATEGORY_4,
        item: [],
      },
      {
        title: CATEGORY_5,
        item: [],
      },
      {
        title: CATEGORY_6,
        item: [],
      },
    ],
  };

  if (result.length > 0) {
    for (let index = 0; index < result.length; index++) {
      summary.role.push(result[index].rule);
      for (let index2 = 0; index2 < result[index].category.length; index2++) {
        if (result[index].category[index2].title === CATEGORY_1) {
          for (
            let index3 = 0;
            index3 < result[index].category[index2].item.length;
            index3++
          ) {
            const filter = summary.category[0].item.filter((value) => {
              return value === result[index].category[index2].item[index3];
            });
            if (filter.length === 0) {
              summary.category[0].item.push(
                result[index].category[index2].item[index3]
              );
            }
          }
        }
        if (result[index].category[index2].title === CATEGORY_2) {
          for (
            let index3 = 0;
            index3 < result[index].category[index2].item.length;
            index3++
          ) {
            const filter = summary.category[1].item.filter((value) => {
              return value === result[index].category[index2].item[index3];
            });
            if (filter.length === 0) {
              summary.category[1].item.push(
                result[index].category[index2].item[index3]
              );
            }
          }
        }
        if (result[index].category[index2].title === CATEGORY_3) {
          for (
            let index3 = 0;
            index3 < result[index].category[index2].item.length;
            index3++
          ) {
            const filter = summary.category[2].item.filter((value) => {
              return value === result[index].category[index2].item[index3];
            });
            if (filter.length === 0) {
              summary.category[2].item.push(
                result[index].category[index2].item[index3]
              );
            }
          }
        }
        if (result[index].category[index2].title === CATEGORY_4) {
          for (
            let index3 = 0;
            index3 < result[index].category[index2].item.length;
            index3++
          ) {
            const filter = summary.category[3].item.filter((value) => {
              return value === result[index].category[index2].item[index3];
            });
            if (filter.length === 0) {
              summary.category[3].item.push(
                result[index].category[index2].item[index3]
              );
            }
          }
        }
        if (result[index].category[index2].title === CATEGORY_5) {
          for (
            let index3 = 0;
            index3 < result[index].category[index2].item.length;
            index3++
          ) {
            const filter = summary.category[4].item.filter((value) => {
              return value === result[index].category[index2].item[index3];
            });
            if (filter.length === 0) {
              summary.category[4].item.push(
                result[index].category[index2].item[index3]
              );
            }
          }
        }
        if (result[index].category[index2].title === CATEGORY_6) {
          for (
            let index3 = 0;
            index3 < result[index].category[index2].item.length;
            index3++
          ) {
            const filter = summary.category[5].item.filter((value) => {
              return value === result[index].category[index2].item[index3];
            });
            if (filter.length === 0) {
              summary.category[5].item.push(
                result[index].category[index2].item[index3]
              );
            }
          }
        }
      }
    }
  }

  return summary;
};

export default RECOMENDATION;
