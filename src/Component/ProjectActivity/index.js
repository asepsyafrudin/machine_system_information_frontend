import React, { useRef } from "react";
import GanttChart from "../GanttChart";
import { ViewMode } from "gantt-task-react";
import {
  Alert,
  Badge,
  Button,
  CloseButton,
  Col,
  Form,
  Modal,
  Row,
  Table,
} from "react-bootstrap";

import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import "./projectActivity.css";
import {
  createActivityApi,
  getActivityByProjectIdApi,
  getAllUsersApi,
  getProjectByIdApi,
  getProjectByUserApi,
  getSettingByProjectIdApi,
  saveSettingProjectApi,
  shareFinishProjectForSMDNewModelApi,
  shareFinishProjectToUserCommonApi,
  createFileApi,
  getFileByIdApi,
  deleteFileByIdApi,
  updateProjectByDateApi,
  sendNotificationToPicApi,
  createPatternApi,
  getAllPatternApi,
  getActivityPatternByIdPatternApi,
} from "../../Config/API";
import { SiStarbucks } from "react-icons/si";
import TitleSection from "../TitleSection";
import {
  BsPlusCircleFill,
  BsSave,
  BsBookmarkCheckFill,
  BsBookmarkCheck,
} from "react-icons/bs";
import moment from "moment";
import { v4 as uuid } from "uuid";
import { CapitalCaseFirstWord } from "../../Config/capitalCaseFirstWord";
import { CHANGEDATA, SAVECHANGEDATA } from "../../Context/const";
import { FaBackward } from "react-icons/fa";
import { json, useNavigate } from "react-router-dom";
import { MdDeleteForever, MdLink } from "react-icons/md";
import TaskListTable from "../TaskListTable";
import { BiShare } from "react-icons/bi";
import { fileName } from "../../Config/fileName";
import { getExtFileName } from "../../Config/fileType";
import { GoDesktopDownload } from "react-icons/go";
import { RiDeleteBin2Fill } from "react-icons/ri";

function ProjectActivity(props) {
  const { id, accessMember, dataChangeCount, dispatch, todoChangeCount } =
    props;
  const [project, setProject] = useState([]);
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [tableUser, setTableUser] = useState([]);
  const [activity, setActivity] = useState([]);
  const [titleProject, setTitleProject] = useState("");
  const [viewMode, setViewMode] = useState(ViewMode.Month);
  const [show, setShow] = useState(false);
  const [activityName, setActivityName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [finishDate, setFinishDate] = useState("");
  const [type, setType] = useState("");
  const [dependencies, setDepedencies] = useState("");
  const [progress, setProgress] = useState("0");
  const [idUpdate, setIdUpdate] = useState("");
  const [colWidth, setColWidth] = useState(120);
  const [showNotif, setShowNotif] = useState(false);
  const [message, setMessage] = useState(false);
  const [rowHeight, setRowHeight] = useState(35);
  const [listCellWidth, setListCellWidth] = useState(300);
  const [remark, setRemark] = useState("");
  const [updateValue, setUpdateValue] = useState(0);
  const [monthFormat, setMonthFormat] = useState("en-US");
  const [hiddenPlan, setHiddenPlan] = useState("Yes");
  const [switchMode, setSwitchMode] = useState(false);
  const [openSetting, setOpenSetting] = useState(false);
  const [shareStatus, setShareStatus] = useState(true);
  const [showModalShare, setShowModalShare] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [memberToEmail, setMemberToEmail] = useState("");
  const [memberListOfProject, setMemberListOfProject] = useState([]);
  const [totalMemberToEmail, setTotalMemberToEmail] = useState([]);
  const [ccMailList, setCcMailList] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [ccMail, setCcMail] = useState("");
  const [userId, setUserId] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [reviseStartDate, setReviseStartDate] = useState("");
  const [reviseFinishDate, setReviseFinishDate] = useState("");
  const [linkToProject, setLinkToProject] = useState("");
  const [tableProject, setTableProject] = useState("");
  const [pic, setPic] = useState("");
  const refAttachment = useRef();
  const [file, setFile] = useState([]);
  const [tableFile, setTableFile] = useState([]);
  const [patternName, setPatternName] = useState("");
  const [showExport, setShowExport] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [tablePattern, setTablePattern] = useState("");
  const [tableActivityPattern, setTableActivityPattern] = useState("");
  const [patternImportId, setPatternImportId] = useState("");

  const refDescription = useRef("");
  if (description) {
    refDescription.current.innerText = description;
  }

  const backgroundColorDelay = (endProject, progressBar, remark) => {
    let currentDate = new Date();
    currentDate.setDate(currentDate.getDate() - 1);

    if (remark === "revise") {
      return {
        backgroundColor: "green",
        backgroundSelectedColor: "green",
        barProgressColor: "green",
        barBackgroundColor: "green",
        barProgressSelectedColor: "green",
      };
    } else if (parseInt(progressBar) === 100) {
      return { backgroundColor: "#A3A3FF", backgroundSelectedColor: "#A3A3FF" };
    } else if (currentDate - endProject > 0) {
      return { backgroundColor: "red", backgroundSelectedColor: "red" };
    }
  };

  useEffect(() => {
    if (idUpdate) {
      axios
        .get(getFileByIdApi(idUpdate))
        .then((response) => {
          setTableFile(response.data.data);
        })
        .catch((error) => console.log(error));
    }
  }, [idUpdate, updateValue]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    setUserId(user.id);

    if (id) {
      axios.get(getProjectByIdApi(id)).then((response) => {
        const dataProject = response.data.data[0];
        setTitleProject(dataProject.project_name);
        setProject(dataProject);
        setDescription(dataProject.description);
        setCategory(dataProject.category);
        let memberIdData = [];
        for (let index = 0; index < dataProject.member.length; index++) {
          memberIdData.push(dataProject.member[index].user_id);
        }
        setMemberListOfProject(memberIdData);

        let dataArray = [];
        const data = {
          name: "Total Schedule",
          id: dataProject.id,
          progress: dataProject.progress,
          type: "project",
          start: new Date(dataProject.start),
          end: new Date(dataProject.finish),
          hideChildren: false,
        };
        dataArray.push(data);
        if (dataProject.status === "Finish") {
          setShareStatus(false);
        }

        axios
          .get(getActivityByProjectIdApi(dataProject.id))
          .then((response) => {
            const dataActivity = response.data.data;
            if (dataActivity.length > 0) {
              for (let index = 0; index < dataActivity.length; index++) {
                let pushData = {
                  id: dataActivity[index].id,
                  start: new Date(moment(dataActivity[index].start)),
                  end: new Date(moment(dataActivity[index].end)),
                  name: dataActivity[index].name,
                  progress: dataActivity[index].progress,
                  dependencies: dataActivity[index].dependencies,
                  type: dataActivity[index].type,
                  project: dataActivity[index].project,
                  styles: backgroundColorDelay(
                    new Date(moment(dataActivity[index].end)),
                    dataActivity[index].progress,
                    dataActivity[index].remark
                  ),
                  remark: dataActivity[index].remark,
                  linkToProject: dataActivity[index].linkToProject,
                  pic: dataActivity[index].pic,
                };
                dataArray.push(pushData);
              }
            }
            setActivity(dataArray);
          });
      });

      axios.get(getSettingByProjectIdApi(id)).then((response) => {
        const data = response.data.data[0];
        if (data) {
          setColWidth(parseInt(data.column_width));
          setRowHeight(parseInt(data.row_height));
          setListCellWidth(parseInt(data.list_cell_width));
          setMonthFormat(data.month_format);
          setHiddenPlan(data.hidden_plan);
          setSwitchMode(() => {
            if (data.switchMode === 1) {
              return true;
            } else {
              return false;
            }
          });
        }
      });
    }

    axios.get(getAllUsersApi).then((response) => {
      setTableUser(response.data.data);
    });

    const data = {
      userId: userId,
    };

    axios.post(getAllPatternApi, data).then((response) => {
      setTablePattern(response.data.data);
    });

    axios.get(getActivityPatternByIdPatternApi).then((response) => {
      setTableActivityPattern(response.data.data);
    });

    axios
      .get(getProjectByUserApi(userId))
      .then((response) => {
        setTableProject(response.data.data);
      })
      .catch((error) => console.log(error));
  }, [id, viewMode, updateValue, userId]);

  const projectOption = () => {
    let option = [];

    if (tableProject.length > 0) {
      for (let index = 0; index < tableProject.length; index++) {
        option.push(
          <option
            key={index}
            value={tableProject[index].id}
            id={tableProject[index].id}
          >
            {tableProject[index].project_name}
          </option>
        );
      }
    }

    return <>{option}</>;
  };

  const patternOption = () => {
    let option = [];
    if (tablePattern.length > 0) {
      for (let index = 0; index < tablePattern.length; index++) {
        option.push(
          <option
            key={index}
            value={tablePattern[index].id}
            id={tablePattern[index].id}
          >
            {tablePattern[index].pattern_name}
          </option>
        );
      }
    }

    return <>{option}</>;
  };

  const resetForm = () => {
    setActivityName("");
    setFinishDate("");
    setStartDate("");
    setReviseStartDate("");
    setReviseFinishDate("");
    setProgress("0");
    setType("");
    setIdUpdate("");
    setDepedencies("");
    setRemark("");
    setLinkToProject("");
    setPic("");
    setFile([]);
    setShow(false);
    setShowForm(false);
    setShowExport(false);
    setShowImport(false);
  };

  const colorBgBadge = (value) => {
    switch (value) {
      case 1:
        return "primary";
      case 2:
        return "secondary";
      case 3:
        return "success";
      case 4:
        return "danger";
      case 5:
        return "warning";
      case 6:
        return "info";
      case 7:
        return "dark";
      default:
        break;
    }
  };

  const optionMemberToEmailFunction = () => {
    let option = [];
    if (memberListOfProject.length > 0) {
      for (let index = 0; index < memberListOfProject.length; index++) {
        option.push(
          <option key={index} value={memberListOfProject[index]}>
            {userNameFunction(memberListOfProject[index])}
          </option>
        );
      }
    }
    return option;
  };

  const handleAddToEmail = () => {
    if (memberToEmail) {
      const check = totalMemberToEmail.find(
        (value) => parseInt(value) === parseInt(memberToEmail)
      );
      if (!check) {
        setTotalMemberToEmail((prev) => [...prev, memberToEmail]);
      }
    }
  };

  const handleAddAllToEmail = () => {
    if (memberListOfProject.length > 0) {
      for (let index = 0; index < memberListOfProject.length; index++) {
        const check = totalMemberToEmail.find(
          (value) => parseInt(value) === parseInt(memberListOfProject[index])
        );
        if (
          !check &&
          parseInt(memberListOfProject[index]) !== parseInt(project.manager_id)
        ) {
          setTotalMemberToEmail((prev) => [
            ...prev,
            memberListOfProject[index],
          ]);
        }
      }
    }
  };

  const handleDeleteToEmail = (e) => {
    const id = e.target.id;
    let filter = totalMemberToEmail.filter(
      (value) => parseInt(value) !== parseInt(id)
    );
    setTotalMemberToEmail(filter);
  };

  const handleAddCcEmail = () => {
    if (ccMail) {
      const check = ccMailList.find(
        (value) => parseInt(value) === parseInt(ccMail)
      );
      if (!check) {
        setCcMailList((prev) => [...prev, ccMail]);
      }
    }
  };

  const notifAssign = () => {
    const checkProject = tableProject.find((value) => value.manager_id);
    const picId = checkProject.manager_id;
    const pic = userEmailFunction(picId);

    let data = {
      user_id: userId,
      picEmail: pic,
      project_id: project.id,
      activity_id: activity[1].id,
    };

    let confirm = window.confirm("Do You Want to Send Email?");
    if (confirm) {
      axios.post(sendNotificationToPicApi, data).then(() => {
        alert("Email has been sent to PIC");
        handleAddActivity();
      });
    } else {
      setShowAlert(true);
    }
  };

  const handleDeleteCcEmail = (e) => {
    const id = e.target.id;
    let filter = ccMailList.filter((value) => parseInt(value) !== parseInt(id));
    setCcMailList(filter);
  };

  const handleShowModalShare = (e) => {
    if (project) {
      let memberIddata = [];
      for (let index = 0; index < project.member.length; index++) {
        memberIddata.push(project.member[index].user_id);
      }
      setMemberListOfProject(memberIddata);
      setShowModalShare(true);
      setCcMailList((prev) => [...prev, project.manager_id]);
    }
  };

  // send email
  const handleShareProjectFinishToUser = (e) => {
    e.preventDefault();
    if (totalMemberToEmail.length > 0) {
      let data = {
        user_id: userId,
        toEmail: totalMemberToEmail,
        ccEmail: ccMailList,
        project_id: project.id,
      };

      let confirm = window.confirm("Do you want to send email?");
      if (confirm) {
        if (project.product_id === 19 && project.category === "New Model") {
          axios.post(shareFinishProjectForSMDNewModelApi, data).then(() => {
            setShowSuccess(true);
            setCcMailList([]);
            setTotalMemberToEmail([]);
          });
        } else {
          axios.post(shareFinishProjectToUserCommonApi, data).then(() => {
            setShowSuccess(true);
            setCcMailList([]);
            setTotalMemberToEmail([]);
          });
        }
      }
    } else {
      setShowAlert(true);
    }
  };

  const handleCloseModalEmail = () => {
    setShowModalShare(false);
    setTotalMemberToEmail([]);
    setMemberToEmail("");
    setShowAlert(false);
    setShowSuccess(false);
    setCcMailList([]);
    setCcMail("");
  };

  const handleChangeFile = (e) => {
    setFile([...e.target.files]);
  };

  const handleDeleteFile = (e) => {
    const id = e.target.id;
    const confirm = window.confirm("Apakah file Akan di Hapus?");
    if (confirm) {
      axios
        .delete(deleteFileByIdApi(id))
        .then((response) => {
          setUpdateValue(updateValue + 1);
        })
        .catch((error) => console.log(error));
    }
  };

  const handleImportPattern = (e) => {
    e.preventDefault();
    let dataResult = [];
    if (patternImportId) {
      axios
        .get(getActivityPatternByIdPatternApi(patternImportId, id))
        .then((response) => {
          const activityResult = response.data.data;
          if (activityResult.length > 0) {
            for (let index = 0; index < activityResult.length; index++) {
              const dependencies = activityResult[index].dependencies;
              let data = {
                id: activityResult[index].id,
                start: new Date(activityResult[index].start),
                end: new Date(activityResult[index].end),
                name: activityResult[index].name,
                progress: "",
                dependencies: dependencies === "" ? [] : [dependencies],
                type: activityResult[index].type,
                project: id,
                styles: backgroundColorDelay(
                  new Date(moment(activityResult[index].end)),
                  activityResult[index].progress,
                  activityResult[index].remark
                ),
                remark: "",
                linkToProject: "",
                pic: "",
              };
              dataResult.push(data);
            }
          }
          setActivity((prev) => [...prev, ...dataResult]);
          dispatch({ type: CHANGEDATA });
          resetForm();
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const handleAddPattern = (e) => {
    e.preventDefault();

    let dataSend = {
      pattern_name: patternName,
      activity: activity.filter((value) => value.type !== "project"),
      user: userId,
    };

    axios.post(createPatternApi, dataSend).then((response) => {
      setUpdateValue(updateValue + 1);
    });

    window.alert("Data Already Save");
    setShowExport(false);
  };

  const handleAddActivity = (e) => {
    setShowForm(false);
    e.preventDefault();

    let data = {
      start: new Date(startDate),
      end: new Date(type === "milestone" ? startDate : finishDate),
      name: activityName,
      progress: progress,
      dependencies: dependencies === "" ? [] : [dependencies],
      type: type,
      project: project.id,
      remark: remark,
      linkToProject: linkToProject,
      pic: pic,
    };

    let revise = {
      start: new Date(reviseStartDate),
      end: new Date(type === "milestone" ? reviseStartDate : reviseFinishDate),
      name: activityName + " Revise",
      progress: progress,
      dependencies: dependencies === "" ? [] : [dependencies],
      type: type,
      project: project.id,
      remark: "",
      linkToProject: linkToProject,
      pic: pic,
    };

    let filterData = [];
    if (idUpdate === "") {
      let newData = { ...data, id: `${activityName}-${uuid()}` };
      setActivity((prev) => [...prev, newData]);
      resetForm();
      dispatch({ type: CHANGEDATA });
    } else if (idUpdate && showForm) {
      if (activity.length > 0) {
        let oldData = {
          start: new Date(startDate),
          end: new Date(type === "milestone" ? startDate : finishDate),
          name: activityName,
          progress: 0,
          dependencies: dependencies === "" ? [] : [dependencies],
          type: type,
          project: project.id,
          remark: "revise",
          linkToProject: linkToProject,
          pic: pic,
        };

        for (let index = 0; index < activity.length; index++) {
          if (activity[index].id === idUpdate) {
            filterData.push({
              ...oldData,
              id: idUpdate,
            });
          } else {
            filterData.push(activity[index]);
          }
        }

        let data = { ...revise, id: `${activityName}-${uuid()}` };
        filterData.push(data);
      }

      setActivity(filterData);
      dispatch({ type: CHANGEDATA });
      resetForm();
    } else if (idUpdate) {
      if (activity.length > 0) {
        let data = {
          start: new Date(startDate),
          end: new Date(type === "milestone" ? startDate : finishDate),
          name: activityName,
          progress: progress,
          dependencies: dependencies === "" ? [] : [dependencies],
          type: type,
          project: project.id,
          remark: remark,
          linkToProject: linkToProject,
          pic: pic,
        };
        for (let index = 0; index < activity.length; index++) {
          if (activity[index].id === idUpdate) {
            filterData.push({
              ...data,
              id: idUpdate,
            });
          } else {
            filterData.push(activity[index]);
          }
        }
      }

      setActivity(filterData);
      dispatch({ type: CHANGEDATA });
      resetForm();
    }
  };

  const submitFile = () => {
    if (file.length > 0) {
      let formData = new FormData();
      formData.append("id", idUpdate);
      for (let index = 0; index < file.length; index++) {
        formData.append("file", file[index]);
      }

      axios
        .post(createFileApi, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          refAttachment.current.value = "";

          dispatch({ type: CHANGEDATA });
          setUpdateValue(updateValue + 1);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const dateParse = (date) => {
    return moment(date).format("YYYY-MM-DD");
  };

  const handleDoubleClick = (task) => {
    if (accessMember) {
      const findData = activity.find((value) => value.id === task.id);
      if (findData) {
        setActivityName(findData.name);
        setFinishDate(dateParse(findData.end));
        setStartDate(dateParse(findData.start));
        setType(findData.type);
        setDepedencies(findData.dependencies[0]);
        setProgress(findData.progress);
        setIdUpdate(findData.id);
        setRemark(findData.remark);
        setLinkToProject(findData.linkToProject);
        setPic(findData.pic);
        setFile(findData.file);
        setShow(true);
      }
    }
  };

  const handleDeleteTask = (task) => {
    if (accessMember) {
      const confirm = window.confirm("Do you want to delete this activity?");
      if (confirm) {
        const filterData = activity.filter((value) => value.id !== task.id);
        setActivity(filterData);
        setShow(false);
        dispatch({ type: CHANGEDATA });
      }
    }
  };

  const revise = () => {
    setShowForm(true);
  };

  const handleDeleteActivity = (id) => {
    if (accessMember) {
      const confirm = window.confirm("Do you want to delete this activity?");
      if (confirm) {
        const filterData = activity.filter((value) => value.id !== id);
        setActivity(filterData);
        resetForm("");
        setShow(false);
        dispatch({ type: CHANGEDATA });
      }
    }
  };

  const handleSaveData = () => {
    const confirm = window.confirm("Do you Want To Save This?");
    if (confirm) {
      const dataSave = activity.filter((value) => value.type !== "project");
      axios.post(createActivityApi, dataSave).then(() => {
        setIdUpdate("");

        if (dataSave.length > 0) {
          let listDateStart = [];
          let listDateEnd = [];

          for (let index = 0; index < dataSave.length; index++) {
            listDateStart.push(dataSave[index].start);
            listDateEnd.push(dataSave[index].end);
          }

          const minDateFromListDateStart = new Date(Math.min(...listDateStart));
          const maxDateFromListDateEnd = new Date(Math.max(...listDateEnd));

          const findData = activity.find((value) => value.type === "project");

          if (findData) {
            const data = {
              name: "Total Schedule",
              id: findData.id,
              progress: findData.progress,
              type: "project",
              start: minDateFromListDateStart,
              end: maxDateFromListDateEnd,
              hideChildren: false,
            };

            axios
              .put(updateProjectByDateApi, data)
              .then((response) => {
                setMessage("Data Already Save");
                setShowNotif(true);
                dispatch({ type: SAVECHANGEDATA });
                setUpdateValue((prev) => prev + 1);
              })
              .catch((error) => console.log(error));
          }
        }
      });
    }
  };

  const userNameFunction = (id) => {
    const findUser = tableUser.find((value) => value.id === parseInt(id));
    if (findUser) {
      return CapitalCaseFirstWord(findUser.username);
    }
    return "";
  };

  const userEmailFunction = (id) => {
    const findUser = tableUser.find((value) => value.id === parseInt(id));
    if (findUser) {
      return findUser.email;
    }
    return "";
  };

  const navigate = useNavigate();
  const handleToProject = (e) => {
    e.preventDefault();
    axios.get(getProjectByUserApi(userId)).then(() => {
      navigate(`/projectActivity/${linkToProject}`);
      setShow(false);
    });
  };

  const handleBackPage = () => {
    if ((dataChangeCount === 0) & (todoChangeCount === 0)) {
      navigate("/projectPage");
    } else {
      let confirm = window.confirm(
        "Your change don't save yet , do you want to next ?"
      );
      if (confirm) {
        navigate("/projectPage");
      }
    }
  };

  const handleExpanderClick = (task) => {
    setActivity(activity.map((t) => (t.id === task.id ? task : t)));
  };

  const handleTaskChange = (task) => {
    if (accessMember) {
      dispatch({ type: CHANGEDATA });
      let newTasks = activity.map((t) => (t.id === task.id ? task : t));
      setActivity(newTasks);
    }
  };

  const saveSettingProjectActivity = () => {
    if (accessMember) {
      const data = {
        projectId: id,
        columnWidth: colWidth,
        rowHeight: rowHeight,
        listCellWidth: listCellWidth,
        monthFormat: monthFormat,
        hiddenPlan: hiddenPlan,
        switchMode: switchMode,
      };

      axios.post(saveSettingProjectApi, data).then(() => {
        setOpenSetting(false);
        window.alert("Setting Format Already Save into Database");
      });
    }
  };

  const memberOption = () => {
    let option = [];
    if (memberListOfProject.length > 0) {
      for (let index = 0; index < memberListOfProject.length; index++) {
        option.push(
          <option key={index} value={memberListOfProject[index]}>
            {userNameFunction(memberListOfProject[index])}
          </option>
        );
      }
    }
    return option;
  };

  const ganttChartFormat = () => {
    if (activity.length > 0) {
      if (hiddenPlan === "Yes") {
        if (switchMode === true) {
          return (
            <GanttChart
              tasks={activity}
              locale={monthFormat}
              viewMode={viewMode}
              listCellWidth={listCellWidth}
              columnWidth={colWidth}
              rowHeight={rowHeight}
              onExpanderClick={(task) => handleExpanderClick(task)}
              onDoubleClick={(task) => handleDoubleClick(task)}
              onDelete={(task) => handleDeleteTask(task)}
              onDateChange={(task) => handleTaskChange(task)}
              TaskListHeader={({ headerHeight }) => (
                <div
                  style={{
                    height: headerHeight,
                    fontFamily: "sans-serif",
                    fontWeight: "bold",
                    paddingLeft: 10,
                    margin: 0,
                    marginBottom: -1,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  Jobs
                </div>
              )}
              TaskListTable={(props) => <TaskListTable {...props} />}
            />
          );
        } else {
          return (
            <GanttChart
              tasks={activity}
              locale={monthFormat}
              viewMode={viewMode}
              listCellWidth={listCellWidth}
              columnWidth={colWidth}
              rowHeight={rowHeight}
              onExpanderClick={(task) => handleExpanderClick(task)}
              onDoubleClick={(task) => handleDoubleClick(task)}
              onDelete={(task) => handleDeleteTask(task)}
              TaskListHeader={({ headerHeight }) => (
                <div
                  style={{
                    height: headerHeight,
                    fontFamily: "sans-serif",
                    fontWeight: "bold",
                    paddingLeft: 10,
                    margin: 0,
                    marginBottom: -1,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  Jobs
                </div>
              )}
              TaskListTable={(props) => <TaskListTable {...props} />}
            />
          );
        }
      } else {
        if (switchMode === true) {
          return (
            <GanttChart
              tasks={activity}
              locale={monthFormat}
              viewMode={viewMode}
              listCellWidth={listCellWidth}
              columnWidth={colWidth}
              rowHeight={rowHeight}
              onExpanderClick={(task) => handleExpanderClick(task)}
              onDoubleClick={(task) => handleDoubleClick(task)}
              onDelete={(task) => handleDeleteTask(task)}
              onDateChange={(task) => handleTaskChange(task)}
            />
          );
        } else {
          return (
            <GanttChart
              tasks={activity}
              locale={monthFormat}
              viewMode={viewMode}
              listCellWidth={listCellWidth}
              columnWidth={colWidth}
              rowHeight={rowHeight}
              onExpanderClick={(task) => handleExpanderClick(task)}
              onDoubleClick={(task) => handleDoubleClick(task)}
              onDelete={(task) => handleDeleteTask(task)}
            />
          );
        }
      }
    } else {
      return "";
    }
  };

  const handleSetPic = (e) => {
    setPic(e.target.value);
  };

  const handleSetLinkToProject = (e) => {
    setLinkToProject(e.target.value);
    if (tableProject.length > 0) {
      const dataProjectBaseOnIdProject = tableProject.find(
        (value) => value.id === e.target.value
      );

      if (dataProjectBaseOnIdProject) {
        setStartDate(dateParse(dataProjectBaseOnIdProject.start));
        setFinishDate(dateParse(dataProjectBaseOnIdProject.finish));
      }
    }
  };
  return (
    <div className="capabilityFormContainer">
      <div className="capabilityForm">
        {accessMember && (
          <div style={{ textAlign: "right", marginBottom: 2 }}>
            <Row>
              <Col sm={6} style={{ textAlign: "left" }}>
                <Button style={{ marginRight: 5 }} onClick={handleBackPage}>
                  <FaBackward pointerEvents={"none"} /> Back to Project Page
                </Button>
              </Col>
              <Col sm={6} style={{ textAlign: "right" }}>
                <Button
                  disabled={shareStatus}
                  style={{ marginRight: 5 }}
                  onClick={handleShowModalShare}
                >
                  <BiShare pointerEvents={"none"} /> Share
                </Button>
                <Button style={{ marginRight: 5 }} onClick={handleSaveData}>
                  <BsSave pointerEvents={"none"} /> Save
                </Button>
                <Button
                  onClick={() => setShow(true)}
                  style={{ marginRight: 5 }}
                >
                  <BsPlusCircleFill pointerEvents={"none"} />
                  Add
                </Button>
                <Button
                  style={{ marginRight: 5 }}
                  onClick={() => setShowExport(true)}
                >
                  <BsBookmarkCheck pointerEvents={"none"} />
                  Export Template
                </Button>
                <Button onClick={() => setShowImport(true)}>
                  <BsBookmarkCheckFill pointerEvents={"none"} />
                  Import Template
                </Button>
              </Col>
            </Row>
          </div>
        )}
        <TitleSection
          title={`Project Schedule ${titleProject}`}
          icon={<SiStarbucks style={{ marginRight: 5 }} />}
        />
        <div>
          <Row className="mb-1" style={{ textAlign: "left" }}>
            <Col sm={2}>PIC</Col>
            <Col sm={4}>{userNameFunction(project.manager_id)}</Col>
          </Row>
          <Row className="mb-1" style={{ textAlign: "left" }}>
            <Col sm={2}>Category</Col>
            <Col sm={10}>{category}</Col>
          </Row>
          <Row className="mb-1" style={{ textAlign: "left" }}>
            <Col sm={2}>Budget</Col>
            <Col sm={10}>{parseFloat(project.budget).toLocaleString()}</Col>
          </Row>
          <Row className="mb-1" style={{ textAlign: "left" }}>
            <Col sm={2}>Saving Cost</Col>
            <Col sm={10}>
              {parseFloat(project.saving_cost).toLocaleString()}
            </Col>
          </Row>
          <Row className="mb-1" style={{ textAlign: "left" }}>
            <Col sm={2}>Description</Col>
            <Col sm={4} ref={refDescription}></Col>
            <Col sm={6} style={{ textAlign: "right" }}>
              <div className="box-revise" /> Revise
              <div className="box-plan" /> Plan
              <div className="box-actual" /> Progress
              <div className="box-delay" /> Delay
              <div className="box-milestone" /> Milestone
            </Col>
          </Row>
        </div>
        {ganttChartFormat()}
        <div style={{ textAlign: "left" }}>
          <Button
            style={{ marginRight: 5 }}
            onClick={() => setViewMode(ViewMode.Day)}
          >
            Day
          </Button>
          <Button
            style={{ marginRight: 5 }}
            onClick={() => setViewMode(ViewMode.Week)}
          >
            Week
          </Button>
          <Button
            style={{ marginRight: 5 }}
            onClick={() => setViewMode(ViewMode.Month)}
          >
            Month
          </Button>
          {accessMember && (
            <Button onClick={() => setOpenSetting(true)}>Setting</Button>
          )}
        </div>
        <Modal show={showExport} centered className="modalAddActivity">
          <Form onSubmit={handleAddPattern}>
            <Row className="titleModalAddActivity">
              <Col>Save Pattern Activity Here</Col>
            </Row>
            <Modal.Body>
              <Row className="mb-3">
                <Form.Group as={Col}>
                  <Form.Label>Pattern Name</Form.Label>
                  <Form.Control
                    value={patternName}
                    onChange={(e) => setPatternName(e.target.value)}
                    type="text"
                    placeholder="Enter Pattern Name"
                    required
                  />
                </Form.Group>
              </Row>
            </Modal.Body>
            <Modal.Footer>
              <Button type="submit">Save</Button>
              <Button variant="secondary" onClick={resetForm}>
                Close
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>

        <Modal show={showImport} centered className="modalAddActivity">
          <Form onSubmit={handleImportPattern}>
            <Row className="titleModalAddActivity">
              <Col>Select Pattern Activity Here</Col>
            </Row>
            <Modal.Body>
              <Row className="mb-3">
                <Form.Group as={Col}>
                  <Form.Label>Pattern Name</Form.Label>
                  <Form.Select
                    value={patternImportId}
                    onChange={(e) => setPatternImportId(e.target.value)}
                  >
                    <option value={""}>Open This</option>
                    {patternOption()}
                  </Form.Select>
                </Form.Group>
              </Row>
            </Modal.Body>
            <Modal.Footer>
              <Button type="submit">Add</Button>
              <Button variant="secondary" onClick={resetForm}>
                Close
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>

        <Modal show={show} centered className="modalAddActivity">
          <Form onSubmit={handleAddActivity}>
            <Row className="titleModalAddActivity">
              <Col sm={7} className="">
                Add Activity Here
              </Col>
              {idUpdate && (
                <Col sm={5} className="">
                  {linkToProject && (
                    <Button
                      className=""
                      variant="info"
                      onClick={handleToProject}
                    >
                      <MdLink
                        style={{
                          pointerEvents: "none",
                          color: "white",
                          fontWeight: "bolder",
                        }}
                      />
                    </Button>
                  )}

                  <Button
                    className="mx-2"
                    variant="danger"
                    onClick={() => handleDeleteActivity(idUpdate)}
                  >
                    <MdDeleteForever style={{ pointerEvents: "none" }} />
                  </Button>
                  <Button variant="secondary" onClick={revise} className="mr-2">
                    Revise
                  </Button>
                </Col>
              )}
            </Row>
            <Modal.Body className="box-model">
              <Row className="mb-3">
                <Form.Group as={Col}>
                  <Form.Label>Activity Name</Form.Label>
                  <Form.Control
                    value={activityName}
                    onChange={(e) => setActivityName(e.target.value)}
                    type="text"
                    placeholder="Enter Activity Name"
                    required
                  />
                </Form.Group>
              </Row>
              <Row className="mb-3">
                <Form.Group as={Col}>
                  <Form.Label>Type</Form.Label>
                  <Form.Select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    required
                  >
                    <option value="" disabled>
                      Open This
                    </option>
                    <option value="task">Task</option>
                    <option value="milestone">Milestone</option>
                  </Form.Select>
                </Form.Group>
              </Row>

              <Row className="mb-3">
                <Form.Group as={Col}>
                  <Form.Label>
                    {type === "milestone" ? "Time" : "Start"}
                  </Form.Label>
                  <Form.Control
                    // value={startDate}
                    // onChange={(e) => setStartDate(e.target.value)}
                    // type="date"

                    // required
                    // disabled={linkToProject ? true : false}
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    type="date"
                    disabled={linkToProject || showForm ? true : false}
                    required
                  />
                </Form.Group>
              </Row>
              {type === "task" && (
                <Row className="mb-3">
                  <Form.Group as={Col}>
                    <Form.Label>Finish</Form.Label>
                    <Form.Control
                      // type="date"
                      // value={finishDate}
                      // onChange={(e) => setFinishDate(e.target.value)}
                      // required
                      // disabled={linkToProject ? true : false}
                      type="date"
                      value={finishDate}
                      onChange={(e) => setFinishDate(e.target.value)}
                      disabled={linkToProject || showForm ? true : false}
                      required
                    />
                  </Form.Group>
                </Row>
              )}
              {/* form revise */}
              {showForm && (
                <>
                  <Row className="mb-3">
                    <Form.Group as={Col}>
                      <Form.Label>Revise Start</Form.Label>
                      <Form.Control
                        type="date"
                        value={reviseStartDate}
                        onChange={(e) => setReviseStartDate(e.target.value)}
                        placeholder="Enter Activity Name"
                        required
                      />
                    </Form.Group>
                    {type === "task" && (
                      <Form.Group as={Col}>
                        <Form.Label>Revise Finish</Form.Label>
                        <Form.Control
                          type="date"
                          value={reviseFinishDate}
                          onChange={(e) => setReviseFinishDate(e.target.value)}
                          placeholder="Enter Activity Name"
                          required
                        />
                      </Form.Group>
                    )}
                  </Row>
                </>
              )}

              <Row className="mb-3">
                <Form.Group as={Col}>
                  <Form.Label>Dependencies</Form.Label>
                  <Form.Select
                    value={dependencies}
                    onChange={(e) => setDepedencies(e.target.value)}
                  >
                    <option value="">Open This</option>
                    {activity.length > 1 &&
                      activity.map((value, index) => {
                        return (
                          <option key={index} value={value.id}>
                            {value.name}
                          </option>
                        );
                      })}
                  </Form.Select>
                </Form.Group>
              </Row>

              <Row className="mb-3">
                <Form.Group as={Col}>
                  <Form.Label>PIC</Form.Label>
                  <Form.Select value={pic} onChange={handleSetPic} required>
                    <option value={""}>Open This</option>
                    {memberOption()}
                  </Form.Select>
                </Form.Group>
              </Row>

              <Row className="mb-3">
                <Form.Group as={Col}>
                  <Form.Label>Progress {progress}%</Form.Label>
                  <Form.Range
                    value={progress}
                    onChange={(e) => setProgress(e.target.value)}
                  />
                </Form.Group>
              </Row>
              <Row className="mb-3">
                <Form.Group as={Col}>
                  <Form.Label>Link To Project (Optional)</Form.Label>
                  <Form.Select
                    value={linkToProject}
                    onChange={handleSetLinkToProject}
                  >
                    <option value={""}>Open This</option>
                    {projectOption()}
                  </Form.Select>
                </Form.Group>
              </Row>
              <Row className="mb-3">
                <Form.Group as={Col}>
                  <Form.Label>Remark</Form.Label>
                  <Form.Control
                    as="textarea"
                    value={remark}
                    onChange={(e) => setRemark(e.target.value)}
                  />
                </Form.Group>
              </Row>

              <Row className="mb-3">
                <Form.Group>
                  <Form.Label>Attachment File</Form.Label>
                  <Row>
                    <Col sm={8}>
                      <Form.Control
                        multiple
                        type="file"
                        ref={refAttachment}
                        onChange={handleChangeFile}
                      />
                    </Col>
                    <Col>
                      <Button type="button" onClick={submitFile}>
                        Submit
                      </Button>
                    </Col>
                  </Row>
                </Form.Group>
              </Row>
              <Table>
                <thead>
                  <tr>
                    <th>No</th>
                    <th>File Name</th>
                    <th>File Type</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {tableFile.length > 0 ? (
                    tableFile.map((value, index) => {
                      return (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td style={{ textAlign: "left", paddingLeft: 20 }}>
                            {fileName(value.name)}
                          </td>
                          <td>{getExtFileName(value.name)}</td>
                          <td>
                            <a
                              href={value.file}
                              target="_blank"
                              rel="noreferrer"
                            >
                              <Button size="sm" style={{ marginRight: 5 }}>
                                <GoDesktopDownload
                                  style={{
                                    marginRight: 5,
                                    pointerEvents: "none",
                                  }}
                                />
                                Open
                              </Button>
                            </a>
                            <Button
                              size="sm"
                              variant="danger"
                              id={value.id}
                              onClick={handleDeleteFile}
                            >
                              <RiDeleteBin2Fill
                                style={{
                                  marginRight: 5,
                                  pointerEvents: "none",
                                }}
                              />
                              Delete
                            </Button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr key={1}>
                      <td colSpan={4}>No File</td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="success"
                className="text-white"
                onClick={notifAssign}
              >
                Save & Send Notification To PIC
              </Button>
              <Button type="submit">Save</Button>
              <Button variant="secondary" onClick={resetForm}>
                Close
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>
        <Modal
          show={showNotif}
          onHide={() => {
            setShowNotif(false);
          }}
        >
          <Modal.Header closeButton>
            <Modal.Title>Notification</Modal.Title>
          </Modal.Header>
          <Modal.Body>{message}</Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => {
                setShowNotif(false);
              }}
            >
              Close
            </Button>
          </Modal.Footer>
        </Modal>
        <Modal
          show={openSetting}
          onHide={() => {
            setOpenSetting(false);
          }}
        >
          <Modal.Header closeButton>
            <Modal.Title>Setting</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Row className="mb-3">
              <Col>
                <Form.Label>Column Width</Form.Label>
              </Col>
              <Col>
                <Form.Control
                  type={"number"}
                  placeholder="Enter Column Width"
                  value={colWidth}
                  onChange={(e) => setColWidth(e.target.value)}
                />
              </Col>
            </Row>
            <Row className="mb-3">
              <Col>
                <Form.Label>Row Height</Form.Label>
              </Col>
              <Col>
                <Form.Control
                  type={"number"}
                  placeholder="Enter Row Height"
                  value={rowHeight}
                  onChange={(e) => setRowHeight(parseInt(e.target.value))}
                />
              </Col>
            </Row>
            <Row className="mb-3">
              <Col>
                <Form.Label>List Cell Width</Form.Label>
              </Col>
              <Col>
                <Form.Control
                  type={"number"}
                  placeholder="Enter List Cell Width"
                  value={listCellWidth}
                  onChange={(e) => setListCellWidth(parseInt(e.target.value))}
                />
              </Col>
            </Row>
            <Row className="mb-3">
              <Col>
                <Form.Label>Month Format</Form.Label>
              </Col>
              <Col>
                <Form.Select
                  value={monthFormat}
                  style={{ width: 150, display: "inline-block" }}
                  onChange={(e) => setMonthFormat(e.target.value)}
                >
                  <option value={"ja-JP"}>Japan</option>
                  <option value={"en-US"}>English</option>
                </Form.Select>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col>
                <Form.Label>Hidden Plan</Form.Label>
              </Col>
              <Col>
                <Form.Select
                  value={hiddenPlan}
                  style={{ width: 100, display: "inline-block" }}
                  onChange={(e) => setHiddenPlan(e.target.value)}
                >
                  <option value={"Yes"}>Yes</option>
                  <option value={"No"}>No</option>
                </Form.Select>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col>
                <Form.Label>Drag Mode</Form.Label>
              </Col>
              <Col>
                <Form.Check
                  type="switch"
                  label="Drag Mode"
                  checked={switchMode}
                  onChange={() => setSwitchMode(!switchMode)}
                />
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button type="button" onClick={saveSettingProjectActivity}>
              Save
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                setOpenSetting(false);
              }}
            >
              Close
            </Button>
          </Modal.Footer>
        </Modal>
        <Modal show={showModalShare} onHide={handleCloseModalEmail}>
          <Modal.Header>
            <Modal.Title>Share Project Finish to Member</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {!showSuccess ? (
              <>
                <Form onSubmit={handleShareProjectFinishToUser}>
                  <Row className="mb-3" style={{ textAlign: "left" }}>
                    <Form.Group as={Col}>
                      <Form.Label>To</Form.Label>
                      <Form.Select
                        value={memberToEmail}
                        onChange={(e) => setMemberToEmail(e.target.value)}
                      >
                        <option value="" disabled>
                          Open This
                        </option>
                        {optionMemberToEmailFunction()}
                      </Form.Select>
                    </Form.Group>
                    <Form.Group as={Col}>
                      <Form.Label></Form.Label> <br />
                      <Button
                        style={{ marginRight: 5 }}
                        type="button"
                        onClick={handleAddToEmail}
                      >
                        Add
                      </Button>
                      <Button type="button" onClick={handleAddAllToEmail}>
                        Add All
                      </Button>
                    </Form.Group>
                  </Row>
                  <Row className="mb-3" style={{ textAlign: "left" }}>
                    <Col>
                      {totalMemberToEmail.length > 0
                        ? totalMemberToEmail.map((value, index) => {
                            return (
                              <Badge
                                key={index}
                                style={{ marginRight: 2 }}
                                bg={colorBgBadge(index + 1)}
                              >
                                <h6>
                                  {CapitalCaseFirstWord(
                                    tableUser.length > 0 &&
                                      tableUser.find(
                                        (value2) =>
                                          value2.id === parseInt(value)
                                      ).username
                                  )}{" "}
                                  <CloseButton
                                    id={value}
                                    onClick={handleDeleteToEmail}
                                  />
                                </h6>
                              </Badge>
                            );
                          })
                        : "Data Is Not Available"}
                    </Col>
                  </Row>{" "}
                  <Row className="mb-3" style={{ textAlign: "left" }}>
                    <Form.Group as={Col}>
                      <Form.Label>Cc</Form.Label>
                      <Form.Select
                        value={ccMail}
                        onChange={(e) => setCcMail(e.target.value)}
                      >
                        <option value="" disabled>
                          Open This
                        </option>
                        {optionMemberToEmailFunction()}
                      </Form.Select>
                    </Form.Group>
                    <Form.Group as={Col}>
                      <Form.Label></Form.Label> <br />
                      <Button type="button" onClick={handleAddCcEmail}>
                        Add
                      </Button>
                    </Form.Group>
                  </Row>
                  <Row className="mb-3" style={{ textAlign: "left" }}>
                    <Col>
                      {ccMailList.length > 0
                        ? ccMailList.map((value, index) => {
                            return (
                              <Badge
                                key={index}
                                style={{ marginRight: 2 }}
                                bg={colorBgBadge(index + 1)}
                              >
                                <h6>
                                  {CapitalCaseFirstWord(
                                    tableUser.length > 0 &&
                                      tableUser.find(
                                        (value2) =>
                                          value2.id === parseInt(value)
                                      ).username
                                  )}{" "}
                                  <CloseButton
                                    id={value}
                                    onClick={handleDeleteCcEmail}
                                  />
                                </h6>
                              </Badge>
                            );
                          })
                        : "Data Is Not Available"}
                    </Col>
                  </Row>
                  <Row>
                    <Col style={{ textAlign: "left" }}>
                      <Button variant="primary" type="submit">
                        Send Email
                      </Button>
                    </Col>
                  </Row>
                </Form>
                <Alert
                  show={showAlert}
                  variant="warning"
                  onClose={() => setShowAlert(false)}
                  dismissible
                >
                  Please Add Users to Email
                </Alert>
              </>
            ) : (
              <Alert
                show={showSuccess}
                variant="success"
                onClose={() => setShowSuccess(false)}
                dismissible
              >
                Email Already Send to Users
              </Alert>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModalEmail}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
}

export default ProjectActivity;
