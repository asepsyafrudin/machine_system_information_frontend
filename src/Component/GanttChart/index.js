import React from "react";

import { Gantt } from "gantt-task-react";

import "gantt-task-react/dist/index.css";

function GanttChart(props) {
  const { tasks, viewMode } = props;
  return <Gantt tasks={tasks} viewMode={viewMode} {...props} />;
}

export default GanttChart;
