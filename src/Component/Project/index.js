import React from "react";
import TitleSection from "../TitleSection";
import {
  Alert,
  Badge,
  Button,
  CloseButton,
  Col,
  Form,
  Modal,
  Row,
} from "react-bootstrap";
import PropTypes from "prop-types";
import { useEffect } from "react";
import {
  createProjectApi,
  getAllProductApi,
  getAllProjectApi,
  getAllUsersApi,
  getProjectBySectionIdAndPage,
  getProjectByUserApi,
  sendEmailApi,
  shareFinishProjectForSMDNewModelApi,
  shareFinishProjectToUserCommonApi,
  updateProjectApi,
  updateStatusProjectApi,
  deleteProjectByProjectId,
} from "../../Config/API";
import { useState } from "react";
import axios from "axios";
import { CapitalCaseFirstWord } from "../../Config/capitalCaseFirstWord";
import { v4 as uuid } from "uuid";
import { STATUSOPEN } from "../../Config/const";
import { BsListNested } from "react-icons/bs";
import { IoMdCreate } from "react-icons/io";
import moment from "moment";
import { GoGitCompare } from "react-icons/go";
import { MdEmail, MdVideoLibrary } from "react-icons/md";
import { GrEdit, GrShareOption } from "react-icons/gr";
import { Link } from "react-router-dom";
import "./project.css";
import {
  PE_2WV_AISS,
  PE_4WV_SONAR_EFI,
  PE_AOI,
  PE_METER,
  PE_SMD,
  PE_WSS,
} from "../../Config/groupingName";
import GraphBarProject from "../GraphBarProject";
import GraphPieProject from "../GraphPieProject";
import { GlobalConsumer } from "../../Context/store/index";
// import { SETPAGE } from "../../Context/const/index";
// import { SETFILTER } from "../../Context/const/index";
// import { SETFILTERDETAIL } from "../../Context/const/index";
import { RiDeleteBack2Fill } from "react-icons/ri";
import { BeatLoader } from "react-spinners";
import { DataGrid } from "@mui/x-data-grid";

function Project(props) {
  const { actionState, pageEvent } = props;
  const [description, setDescription] = useState("");
  const [tableProduct, setTableProduct] = useState([]);
  const [tableProject, setTableProject] = useState([]);
  const [totalProject, setTotalProject] = useState([]);
  const [product, setProduct] = useState("");
  const [projectName, setProjectName] = useState("");
  const [manager, setManager] = useState("");
  const [tableUser, setTableUser] = useState([]);
  const [budget, setBudget] = useState("");
  const [savingCost, setSavingCost] = useState("");
  const [startDate, setStartDate] = useState("");
  const [sopDate, setSopDate] = useState("");
  const [memberId, setMemberId] = useState("");
  const [member, setMember] = useState([]);
  const [projectIdEdit, setProjectIdEdit] = useState("");
  const [userId, setUserId] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState("");
  const [page, setPage] = useState(pageEvent);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [memberToEmail, setMemberToEmail] = useState("");
  const [ccMail, setCcMail] = useState("");
  const [ccMailList, setCcMailList] = useState([]);
  const [memberListOfProject, setMemberListOfProject] = useState([]);
  const [totalMemberToEmail, setTotalMemberToEmail] = useState([]);
  const [bodyEmail, setBodyEmail] = useState("");
  const [subjectEmail, setSubjectEmail] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [showModalShare, setShowModalShare] = useState(false);
  const [showModalCreateProject, setShowModalCreateProject] = useState(false);
  const [userPosition, setUserPosition] = useState("");
  const [userSection, setUserSection] = useState("");
  const [dataForGraph, setDataForGraph] = useState([]);
  const [rank, setRank] = useState("");
  const [admin, setAdmin] = useState(false);
  const [fiscalYear, setFiscalYear] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const filterFunctionLogicByDate = (data, fromDate, toDate, status) => {
    if (fromDate && toDate && status && data.length > 0) {
      const fromDateValue = new Date(fromDate).setDate(
        new Date(fromDate).getDate() - 1
      );
      const filterByDate = data.filter(
        (value) =>
          new Date(value.finish) > new Date(fromDateValue) &&
          new Date(value.finish) <= new Date(toDate)
      );
      setStatusFilter(status);
      let filterData = [];
      if (status === "Delay") {
        let notCriteria = [
          "Not Yet Started",
          "On Progress",
          "Finish",
          "Waiting Detail Activity",
          "cancel",
        ];

        filterData = filterByDate.filter(
          (value) => !notCriteria.includes(value.status)
        );
        setTableProject(filterData);
        setDataForGraph(filterData);
      } else {
        filterData = filterByDate.filter((value) => value.status === status);
        setTableProject(filterData);
        setDataForGraph(filterData);
      }
    } else if (fromDate && toDate && data.length > 0) {
      const fromDateValue = new Date(fromDate).setDate(
        new Date(fromDate).getDate() - 1
      );
      const filterByDate = data.filter(
        (value) =>
          new Date(value.finish) > new Date(fromDateValue) &&
          new Date(value.finish) <= new Date(toDate)
      );
      setDataForGraph(filterByDate);
      setTableProject(filterByDate);
    }
  };

  useEffect(() => {
    axios
      .get(getAllProductApi)
      .then((response) => {
        setTableProduct(response.data.data);
      })
      .catch((error) => console.log(error));

    axios
      .get(getAllUsersApi)
      .then((response) => {
        const tableUserSort = response.data.data;
        setTableUser(
          tableUserSort.sort((nameA, nameB) => {
            let a = nameA.username;
            let b = nameB.username;

            if (a < b) {
              return -1;
            }
            if (a > b) {
              return 1;
            }
            return 0;
          })
        );
      })
      .catch((error) => console.log(error));

    const user = JSON.parse(localStorage.getItem("user"));
    setUserId(user.id);
    setUserEmail(user.email);
    const position = user.position;
    setUserPosition(position);
    const section_id = user.section_id;
    setUserSection(section_id);
    const positionThatCanOpenProject = [
      "Departement Manager",
      "Assistant General Manager",
      "General Manager",
      "Director",
      "President",
    ];

    const checkPosition = positionThatCanOpenProject.find(
      (value) => value === position
    );

    if (user.position === "Administrator") {
      setAdmin(true);
      axios
        .get(getAllProjectApi)
        .then((response) => {
          const responseData = response.data.data;
          setDataForGraph(responseData);
          setTableProject(responseData);
          setTotalProject(responseData);
        })
        .then((error) => console.log(error));
    } else if (checkPosition) {
      axios
        .get(getProjectBySectionIdAndPage(page, section_id))
        .then((response) => {
          const responseData = response.data.data;
          setDataForGraph(responseData);
          setTableProject(responseData);
          setTotalProject(responseData);
        })
        .catch((error) => console.log(error));
    } else {
      if (userId) {
        axios
          .get(getProjectByUserApi(userId))
          .then((response) => {
            const responseData = response.data.data;
            setDataForGraph(responseData);
            setTableProject(responseData);
            setTotalProject(responseData);
          })
          .catch((error) => {
            console.error("Error in axios get request:", error);
          });
      }
    }
  }, [userId, page]);

  // useEffect(() => {
  //   const filterFunctionLogicByDate = (data, fromDate, toDate) => {
  //     if (fromDate && toDate && data.length > 0) {
  //       let listData = [];
  //       const fromDateValue = new Date(fromDate).setDate(
  //         new Date(fromDate).getDate() - 1
  //       );
  //       const filterByDate = data.filter(
  //         (value) =>
  //           new Date(value.finish) > new Date(fromDateValue) &&
  //           new Date(value.finish) <= new Date(toDate)
  //       );

  //       for (
  //         let index = (page - 1) * dataPerPage;
  //         index < page * dataPerPage && index < filterByDate.length;
  //         index++
  //       ) {
  //         listData.push(filterByDate[index]);
  //       }
  //       const totalPageData = Math.ceil(filterByDate.length / dataPerPage);
  //       const numberStart = (page - 1) * dataPerPage + 1;
  //       setDataForGraph(filterByDate);
  //       setTableProject(listData);
  //       setStotalPageData(totalPageData);
  //       setNumberStart(numberStart);
  //     }
  //   };

  //   const filterFunctionLogic = (
  //     filterItem,
  //     filterDetailItem,
  //     data,
  //     fromDate,
  //     toDate
  //   ) => {
  //     if (filterItem === "category") {
  //       if (data.length > 0) {
  //         let listData = [];
  //         const filterData = data.filter(
  //           (value) => value.category === filterDetailItem
  //         );

  //         if (fromDate && toDate) {
  //           const fromDateValue = new Date(fromDate).setDate(
  //             new Date(fromDate).getDate() - 1
  //           );
  //           const filterByDate = filterData.filter(
  //             (value) =>
  //               new Date(value.finish) >= new Date(fromDateValue) &&
  //               new Date(value.finish) <= new Date(toDate)
  //           );

  //           for (
  //             let index = (page - 1) * dataPerPage;
  //             index < page * dataPerPage && index < filterByDate.length;
  //             index++
  //           ) {
  //             listData.push(filterByDate[index]);
  //           }
  //           const totalPageData = Math.ceil(filterByDate.length / dataPerPage);
  //           const numberStart = (page - 1) * dataPerPage + 1;
  //           setDataForGraph(filterByDate);
  //           setTableProject(listData);
  //           setStotalPageData(totalPageData);
  //           setNumberStart(numberStart);
  //         } else {
  //           for (
  //             let index = (page - 1) * dataPerPage;
  //             index < page * dataPerPage && index < filterData.length;
  //             index++
  //           ) {
  //             listData.push(filterData[index]);
  //           }
  //           const totalPageData = Math.ceil(filterData.length / dataPerPage);
  //           const numberStart = (page - 1) * dataPerPage + 1;
  //           setDataForGraph(filterData);
  //           setTableProject(listData);
  //           setStotalPageData(totalPageData);
  //           setNumberStart(numberStart);
  //         }
  //       }
  //     } else if (filterItem === "rank") {
  //       if (data.length > 0) {
  //         let listData = [];
  //         const filterData = data.filter(
  //           (value) => value.rank === filterDetailItem
  //         );

  //         if (fromDate && toDate) {
  //           const fromDateValue = new Date(fromDate).setDate(
  //             new Date(fromDate).getDate() - 1
  //           );
  //           const filterByDate = filterData.filter(
  //             (value) =>
  //               new Date(value.finish) >= new Date(fromDateValue) &&
  //               new Date(value.finish) <= new Date(toDate)
  //           );

  //           for (
  //             let index = (page - 1) * dataPerPage;
  //             index < page * dataPerPage && index < filterByDate.length;
  //             index++
  //           ) {
  //             listData.push(filterByDate[index]);
  //           }
  //           const totalPageData = Math.ceil(filterByDate.length / dataPerPage);
  //           const numberStart = (page - 1) * dataPerPage + 1;
  //           setDataForGraph(filterByDate);
  //           setTableProject(listData);
  //           setStotalPageData(totalPageData);
  //           setNumberStart(numberStart);
  //         } else {
  //           for (
  //             let index = (page - 1) * dataPerPage;
  //             index < page * dataPerPage && index < filterData.length;
  //             index++
  //           ) {
  //             listData.push(filterData[index]);
  //           }
  //           const totalPageData = Math.ceil(filterData.length / dataPerPage);
  //           const numberStart = (page - 1) * dataPerPage + 1;
  //           setDataForGraph(filterData);
  //           setTableProject(listData);
  //           setStotalPageData(totalPageData);
  //           setNumberStart(numberStart);
  //         }
  //       }
  //     } else if (filterItem === "pic") {
  //       if (data.length > 0) {
  //         let listData = [];
  //         const filterData = data.filter(
  //           (value) => value.manager_id === parseInt(filterDetailItem)
  //         );

  //         if (fromDate && toDate) {
  //           const fromDateValue = new Date(fromDate).setDate(
  //             new Date(fromDate).getDate() - 1
  //           );
  //           const filterByDate = filterData.filter(
  //             (value) =>
  //               new Date(value.finish) >= new Date(fromDateValue) &&
  //               new Date(value.finish) <= new Date(toDate)
  //           );

  //           for (
  //             let index = (page - 1) * dataPerPage;
  //             index < page * dataPerPage && index < filterByDate.length;
  //             index++
  //           ) {
  //             listData.push(filterByDate[index]);
  //           }
  //           const totalPageData = Math.ceil(filterByDate.length / dataPerPage);
  //           const numberStart = (page - 1) * dataPerPage + 1;
  //           setDataForGraph(filterByDate);
  //           setTableProject(listData);
  //           setStotalPageData(totalPageData);
  //           setNumberStart(numberStart);
  //         } else {
  //           for (
  //             let index = (page - 1) * dataPerPage;
  //             index < page * dataPerPage && index < filterData.length;
  //             index++
  //           ) {
  //             listData.push(filterData[index]);
  //           }
  //           const totalPageData = Math.ceil(filterData.length / dataPerPage);
  //           const numberStart = (page - 1) * dataPerPage + 1;
  //           setDataForGraph(filterData);
  //           setTableProject(listData);
  //           setStotalPageData(totalPageData);
  //           setNumberStart(numberStart);
  //         }
  //       }
  //     } else if (filterItem === "status" && data.length > 0) {
  //       let listData = [];
  //       let filterData = [];
  //       if (filterDetailItem === "Delay") {
  //         let notCriteria = [
  //           "Not Yet Started",
  //           "On Progress",
  //           "Finish",
  //           "Waiting Detail Activity",
  //           "cancel",
  //         ];

  //         filterData = data.filter(
  //           (value) => !notCriteria.includes(value.status)
  //         );
  //       } else {
  //         filterData = data.filter(
  //           (value) => value.status === filterDetailItem
  //         );
  //       }

  //       if (fromDate && toDate) {
  //         const fromDateValue = new Date(fromDate).setDate(
  //           new Date(fromDate).getDate() - 1
  //         );
  //         const filterByDate = filterData.filter(
  //           (value) =>
  //             new Date(value.finish) >= new Date(fromDateValue) &&
  //             new Date(value.finish) <= new Date(toDate)
  //         );
  //         for (
  //           let index = (page - 1) * dataPerPage;
  //           index < page * dataPerPage && index < filterByDate.length;
  //           index++
  //         ) {
  //           listData.push(filterByDate[index]);
  //         }
  //         const totalPageData = Math.ceil(filterByDate.length / dataPerPage);
  //         const numberStart = (page - 1) * dataPerPage + 1;
  //         setDataForGraph(filterByDate);
  //         setTableProject(listData);
  //         setStotalPageData(totalPageData);
  //         setNumberStart(numberStart);
  //       } else {
  //         for (
  //           let index = (page - 1) * dataPerPage;
  //           index < page * dataPerPage && index < filterData.length;
  //           index++
  //         ) {
  //           listData.push(filterData[index]);
  //         }
  //         const totalPageData = Math.ceil(filterData.length / dataPerPage);
  //         const numberStart = (page - 1) * dataPerPage + 1;
  //         setDataForGraph(filterData);
  //         setTableProject(listData);
  //         setStotalPageData(totalPageData);
  //         setNumberStart(numberStart);
  //       }
  //     } else if (filterItem === "product") {
  //       if (data.length > 0) {
  //         let listData = [];
  //         const filterData = data.filter(
  //           (value) => value.product_id === parseInt(filterDetailItem)
  //         );
  //         if (fromDate && toDate) {
  //           const fromDateValue = new Date(fromDate).setDate(
  //             new Date(fromDate).getDate() - 1
  //           );
  //           const filterByDate = filterData.filter(
  //             (value) =>
  //               new Date(value.finish) >= new Date(fromDateValue) &&
  //               new Date(value.finish) <= new Date(toDate)
  //           );

  //           for (
  //             let index = (page - 1) * dataPerPage;
  //             index < page * dataPerPage && index < filterByDate.length;
  //             index++
  //           ) {
  //             listData.push(filterByDate[index]);
  //           }
  //           const totalPageData = Math.ceil(filterByDate.length / dataPerPage);
  //           const numberStart = (page - 1) * dataPerPage + 1;
  //           setDataForGraph(filterByDate);
  //           setTableProject(listData);
  //           setStotalPageData(totalPageData);
  //           setNumberStart(numberStart);
  //         } else {
  //           for (
  //             let index = (page - 1) * dataPerPage;
  //             index < page * dataPerPage && index < filterData.length;
  //             index++
  //           ) {
  //             listData.push(filterData[index]);
  //           }
  //           const totalPageData = Math.ceil(filterData.length / dataPerPage);
  //           const numberStart = (page - 1) * dataPerPage + 1;
  //           setDataForGraph(filterData);
  //           setTableProject(listData);
  //           setStotalPageData(totalPageData);
  //           setNumberStart(numberStart);
  //         }
  //       }
  //     }
  //   };

  //   if (tableProject.length > 0) {
  //     filterFunctionLogic(
  //       filterBy,
  //       detailFilterValue,
  //       tableProject,
  //       fromDate,
  //       toDate
  //     );
  //     filterFunctionLogicByDate(tableProject, fromDate, toDate);
  //   }
  //   //filter sampai sini
  // }, [
  //   actionStateValue,
  //   page,
  //   filterBy,
  //   detailFilterValue,
  //   userId,
  //   fromDate,
  //   toDate,
  // ]);

  const productOption = () => {
    let option = [];
    if (tableProduct.length > 0) {
      for (let index = 0; index < tableProduct.length; index++) {
        option.push(
          <option key={index} value={tableProduct[index].id}>
            {tableProduct[index].product_name}
          </option>
        );
      }
    }
    return <>{option}</>;
  };

  const userOption = () => {
    let option = [];
    if (tableUser.length > 0) {
      for (let index = 0; index < tableUser.length; index++) {
        option.push(
          <option key={index} value={tableUser[index].id}>
            {CapitalCaseFirstWord(tableUser[index].username)}
          </option>
        );
      }
    }
    return <>{option}</>;
  };

  const handleMember = () => {
    let grouppingName = memberId.replace(/^\[\'|\'\]$/g, "").split(",");

    if (grouppingName.length > 1) {
      for (let index = 0; index < grouppingName.length; index++) {
        if (grouppingName[index] !== userEmail) {
          const user = tableUser.find(
            (value) => value.email === grouppingName[index]
          );

          if (user) {
            const check = member.find((value) => value === parseInt(user.id));
            if (!check) {
              setMember((prev) => [...prev, parseInt(user.id)]);
            } else {
            }
          }
        }
      }
    } else if (parseInt(grouppingName[0]) !== parseInt(userId)) {
      const check = member.find(
        (value) => value === parseInt(grouppingName[0])
      );
      if (!check) {
        setMember((prev) => [...prev, parseInt(memberId)]);
      }
    }
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

  const deleteMembers = (e) => {
    const id = parseInt(e.target.id);
    if (id !== userId) {
      const array = member.filter((value) => value !== id);
      setMember(array);
    } else {
      window.alert("Cannot delete");
    }
  };

  const handleReset = () => {
    setProduct("");
    setProjectName("");
    setDescription("");
    setManager("");
    setBudget("");
    setSavingCost("");
    setStartDate("");
    setSopDate("");
    setCategory("");
    setSubCategory("");
    setMemberId("");
    setMember([]);
    setProjectIdEdit("");
    setRank("");
  };

  const handleSaveCreateProject = (e) => {
    e.preventDefault();
    let data = {
      product_id: product,
      project_name: projectName,
      rank: rank,
      manager_id: manager,
      budget: budget,
      saving_cost: savingCost,
      start: startDate,
      finish: sopDate,
      category: category,
      sub_category: subCategory,
      member: projectIdEdit ? [...member] : [...member, userId],
      user_id: userId,
      status: STATUSOPEN,
      description: description,
    };

    if (member.length > 0) {
      if (projectIdEdit) {
        let newData = { ...data, id: projectIdEdit };
        axios.put(updateProjectApi, newData);
        setShowModalCreateProject(false);
        setMessage("Project already Update");
        setShow(true);
        handleReset();
        actionState(1);
      } else {
        let newData = { ...data, id: uuid() };
        let confirm = window.confirm("Do you want to save?");
        if (confirm) {
          axios.post(createProjectApi, newData).then((response) => {
            setShowModalCreateProject(false);
            setMessage("Project already created");
            setShow(true);
            handleReset();
            actionState(1);
          });
        }
      }
    } else {
      window.alert("Please Add Member of This Project ");
    }
  };

  const userNameFunction = (id) => {
    const findUser = tableUser.find((value) => value.id === parseInt(id));
    if (findUser) {
      return CapitalCaseFirstWord(findUser.username);
    }
    return "";
  };

  const statusFunction = (status, id) => {
    if (status !== "cancel") {
      if (status === "Finish") {
        return <Badge bg="primary">{status}</Badge>;
      } else if (status === "Not Yet Started") {
        return <Badge bg="warning">{status}</Badge>;
      } else if (status === "Waiting Detail Activity") {
        return (
          <Badge bg="light" text="dark">
            Waiting Detail Activity
          </Badge>
        );
      } else if (status === "On Progress") {
        return <Badge bg="success">{status}</Badge>;
      } else {
        return <Badge bg="danger">{status}</Badge>;
      }
    } else {
      return <Badge bg="secondary">Cancel</Badge>;
    }
  };

  const dateParse = (date) => {
    return moment(date).format("YYYY-MM-DD");
  };
  const handleEdit = (e) => {
    const id = e.target.id;
    let confirm = window.confirm("Do you want to edit this item?");
    if (confirm) {
      let data = tableProject.find((value) => value.id === id);
      if (data) {
        setShowModalCreateProject(true);
        setProjectIdEdit(data.id);
        setProduct(data.product_id);
        setProjectName(data.project_name);
        setRank(data.rank);
        setManager(data.manager_id);
        setBudget(data.budget);
        setSavingCost(data.saving_cost);
        setStartDate(dateParse(data.start));
        setCategory(data.category);
        setSopDate(dateParse(data.finish));
        setDescription(data.description);
        setSubCategory(data.sub_category);
        let memberIddata = [];
        for (let index = 0; index < data.member.length; index++) {
          memberIddata.push(data.member[index].user_id);
        }
        setMember(memberIddata);
      }
    }
  };

  const handleSendEmail = (e) => {
    const id = e.target.id;
    let confirm = window.confirm("Do You Want to Send Email?");
    if (confirm) {
      const checkProject = tableProject.find((value) => value.id === id);
      if (checkProject) {
        let memberIddata = [];
        for (let index = 0; index < checkProject.member.length; index++) {
          memberIddata.push(checkProject.member[index].user_id);
        }
        setMemberListOfProject(memberIddata);
        setSubjectEmail(checkProject.project_name);
        setShowEmailModal(true);
        setProjectIdEdit(checkProject.id);
        setCcMailList((prev) => [...prev, userId]);
      }
    }
  };

  const handleShowModalShare = (e) => {
    const id = e.target.id;
    const checkProject = tableProject.find((value) => value.id === id);
    if (checkProject) {
      let memberIddata = [];
      for (let index = 0; index < checkProject.member.length; index++) {
        memberIddata.push(checkProject.member[index].user_id);
      }
      setMemberListOfProject(memberIddata);
      setShowModalShare(true);
      setProjectIdEdit(checkProject.id);
      setCcMailList((prev) => [...prev, checkProject.manager_id]);
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

  const handleChangeStatus = (e) => {
    const id = e.target.id;
    const data = tableProject.find((value) => value.id === id);
    if (data) {
      let body = {
        id: id,
        status: data.status === "cancel" ? "open" : "cancel",
      };
      let confirm = window.confirm(`Do you want to change status this item?`);
      if (confirm) {
        axios.put(updateStatusProjectApi, body).then((response) => {
          setMessage("Project Stataus Already Change");
          setShow(true);
          handleReset();
          actionState(1);
        });
      }
    }
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
    const project = tableProject.find((value) => value.id === projectIdEdit);
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

  const handleDeleteCcEmail = (e) => {
    const id = e.target.id;
    let filter = ccMailList.filter((value) => parseInt(value) !== parseInt(id));
    setCcMailList(filter);
  };

  const handleCloseModalEmail = () => {
    setShowEmailModal(false);
    setShowModalShare(false);
    setTotalMemberToEmail([]);
    setMemberToEmail("");
    setBodyEmail("");
    setShowAlert(false);
    setShowSuccess(false);
    setCcMailList([]);
    setCcMail("");
    handleReset();
  };

  const handleSendEmailToUser = (e) => {
    e.preventDefault();
    if (totalMemberToEmail.length > 0) {
      let data = {
        sender: userId,
        toEmail: totalMemberToEmail,
        ccEmail: ccMailList,
        subject: subjectEmail,
        message: bodyEmail,
        project_id: projectIdEdit,
      };
      let confirm = window.confirm("Do you want to send?");
      if (confirm) {
        axios.post(sendEmailApi, data).then((response) => {
          setShowSuccess(true);
        });
      }
    } else {
      setShowAlert(true);
    }
  };

  const handleShareProjectFinishToUser = (e) => {
    e.preventDefault();
    if (totalMemberToEmail.length > 0) {
      let data = {
        user_id: userId,
        toEmail: totalMemberToEmail,
        ccEmail: ccMailList,
        project_id: projectIdEdit,
      };

      const project = tableProject.find((value) => value.id === projectIdEdit);

      let confirm = window.confirm("Do you want to send email?");
      if (confirm) {
        if (project.product_id === 19 && project.category === "New Model") {
          axios
            .post(shareFinishProjectForSMDNewModelApi, data)
            .then((response) => {
              setShowSuccess(true);
              setCcMailList([]);
              setTotalMemberToEmail([]);
              setProjectIdEdit("");
            });
        } else {
          axios
            .post(shareFinishProjectToUserCommonApi, data)
            .then((response) => {
              setShowSuccess(true);
              setCcMailList([]);
              setTotalMemberToEmail([]);
              setProjectIdEdit("");
            });
        }
      }
    } else {
      setShowAlert(true);
    }
  };

  const subCategoryLabel = (value) => {
    if (value) {
      return (
        <div className="label-subcategory">{CapitalCaseFirstWord(value)}</div>
      );
    }
  };

  // const onHandleChangeStatus = (e) => {
  //   const status = e.target.value;
  //   setStatusFilter(status);
  //   let filterData = [];
  //   if (status === "Delay") {
  //     let notCriteria = [
  //       "Not Yet Started",
  //       "On Progress",
  //       "Finish",
  //       "Waiting Detail Activity",
  //       "cancel",
  //     ];

  //     filterData = tableProject.filter(
  //       (value) => !notCriteria.includes(value.status)
  //     );
  //     setTableProject(filterData);
  //   } else {
  //     filterData = tableProject.filter((value) => value.status === status);
  //     setTableProject(filterData);
  //   }
  // };

  const handleChangeDescription = (e) => {
    setDescription(e.target.value);
  };

  // const filterItemLogic = () => {
  //   let option = [];
  //   if (filterBy === "category") {
  //     if (userSection === 4) {
  //       option.push(
  //         <>
  //           <option value={"CO2 Neutral"}>CO2 Neutral</option>
  //           <option value={"Log Auto"}>Log Auto</option>
  //           <option value={"Vision"}>Vision</option>
  //           <option value={"DX"}>DX</option>
  //           <option value={"Layout"}>Layout</option>
  //         </>
  //       );
  //     } else if (userSection === 10) {
  //       option.push(
  //         <>
  //           <option value={"CO2 Neutral"}>CO2 Neutral</option>
  //           <option value={"Log Auto"}>Log Auto</option>
  //           <option value={"Vision"}>Vision</option>
  //           <option value={"DX"}>DX</option>
  //           <option value={"Layout"}>Layout</option>
  //         </>
  //       );
  //     } else {
  //       option.push(
  //         <>
  //           <option value={"New Model"}>New Model</option>
  //           <option value={"Quality"}>Quality</option>
  //           <option value={"Integrated Factory"}>Integrated Factory</option>
  //           <option value={"Productivity"}>Productivity</option>
  //           <option value={"Profit Improvement"}>Profit Improvement</option>
  //         </>
  //       );
  //     }
  //   } else if (filterBy === "rank") {
  //     option.push(
  //       <>
  //         <option value={"A1"}>A1</option>
  //         <option value={"A2"}>A2</option>
  //         <option value={"A3"}>A3</option>
  //         <option value={"B1"}>B1</option>
  //         <option value={"B2"}>B2</option>
  //         <option value={"B3"}>B3</option>
  //         <option value={"C1"}>C1</option>
  //         <option value={"C2"}>C2</option>
  //         <option value={"C3"}>C3</option>
  //       </>
  //     );
  //   } else if (filterBy === "pic") {
  //     return userOption();
  //   } else if (filterBy === "status") {
  //     option.push(
  //       <>
  //         <option value={"Not Yet Started"}>Not Yet Started</option>
  //         <option value={"On Progress"}>On Progress</option>
  //         <option value={"Delay"}>Delay</option>
  //         <option value={"Finish"}>Finish</option>
  //         <option value={"Waiting Detail Activity"}>
  //           Waiting Detail Activity
  //         </option>
  //         <option value={"cancel"}>cancel</option>
  //       </>
  //     );
  //   } else if (filterBy === "product") {
  //     return productOption();
  //   }
  //   return option;
  // };

  const onHandleChangeFiscalYear = (data) => {
    const { fiscalYear, status } = data;
    setFiscalYear(fiscalYear);
    if (fiscalYear === "FY 23") {
      const fromDate = "2023-04-01";
      const toDate = "2024-03-31";
      filterFunctionLogicByDate(totalProject, fromDate, toDate, status);
    } else if (fiscalYear === "FY 24") {
      const fromDate = "2024-04-01";
      const toDate = "2025-03-31";
      filterFunctionLogicByDate(totalProject, fromDate, toDate, status);
    } else if (fiscalYear === "FY 25") {
      const fromDate = "2025-04-01";
      const toDate = "2026-03-31";
      filterFunctionLogicByDate(totalProject, fromDate, toDate, status);
    } else {
      const fromDate = "";
      const toDate = "";
      filterFunctionLogicByDate(totalProject, fromDate, toDate, status);
    }
  };

  const handleDeleteProject = (e) => {
    const id = e.target.id;
    const confirm = window.confirm("Do you want to delete this project?");
    if (confirm) {
      axios
        .delete(deleteProjectByProjectId(id))
        .then((response) => {
          console.log(response);
          actionState(1);
          window.alert("delete project success");
        })
        .catch((error) => {
          console.log(error);
          window.alert("Failed Delete Project");
        });
    }
  };

  const columns = [
    {
      field: "project_name",
      headerName: "Project Name",
      width: 200,
    },
    {
      field: "rank",
      headerName: "Rank",
    },
    {
      field: "category",
      headerName: "Category",
      renderCell: (params) => {
        return (
          <>
            {params.row.category} {subCategoryLabel(params.row.sub_category)}
          </>
        );
      },
      width: 150,
    },

    {
      field: "PIC",
      headerName: "PIC",
      valueGetter: (value, rows) => {
        return userNameFunction(rows.manager_id);
      },
      width: 150,
    },
    {
      field: "create_date",
      headerName: "Create Date",
      valueFormatter: (value) => {
        return moment(value).format("ll");
      },
      width: 150,
      type: "date",
    },
    {
      field: "user_id",
      headerName: "Create By",
      valueGetter: (value) => {
        return userNameFunction(value);
      },
      width: 150,
    },
    {
      field: "start",
      headerName: "Start Project",
      valueFormatter: (value) => {
        return moment(value).format("ll");
      },
      width: 150,
      type: "date",
    },
    {
      field: "finish",
      headerName: "Finish Project",
      valueFormatter: (value) => {
        return moment(value).format("ll");
      },
      width: 150,
      type: "date",
    },
    {
      field: "status",
      headerName: "Status",
      renderCell: (params) => {
        return (
          <>
            {statusFunction(params.row.status, params.row.id)}
            <br />
            {params.row.status === "Finish" && (
              <Button
                id={params.row.id}
                size="sm"
                variant="primary"
                onClick={handleShowModalShare}
              >
                <GrShareOption style={{ pointerEvents: "none" }} />
              </Button>
            )}
          </>
        );
      },
    },
    {
      headerName: "Actions",
      renderCell: (params) => {
        return (
          <>
            {admin && (
              <Button
                variant="danger"
                style={{ marginRight: 2 }}
                id={params.row.id}
                size="sm"
                title="Delete project"
                onClick={handleDeleteProject}
              >
                <RiDeleteBack2Fill style={{ pointerEvents: "none" }} />
              </Button>
            )}
            {params.row.user_id === userId && (
              <Button
                title="Cancel Project"
                size="sm"
                variant="danger"
                style={{ marginRight: 2 }}
                id={params.row.id}
                onClick={handleChangeStatus}
              >
                <GoGitCompare style={{ pointerEvents: "none" }} />
              </Button>
            )}
            <Button
              title="Edit"
              size="sm"
              style={{ marginRight: 2 }}
              variant="success"
              id={params.row.id}
              onClick={handleEdit}
            >
              <GrEdit style={{ pointerEvents: "none" }} />
            </Button>
            <Link to={`/projectActivity/${params.row.id}`}>
              <Button
                title="View"
                size="sm"
                style={{ marginRight: 2 }}
                id={params.row.id}
                variant="dark"
              >
                <MdVideoLibrary style={{ pointerEvents: "none" }} />
              </Button>
            </Link>
            <Button
              title="SendEmail"
              size="sm"
              style={{ marginRight: 2 }}
              id={params.row.id}
              variant="warning"
              onClick={handleSendEmail}
            >
              <MdEmail style={{ pointerEvents: "none" }} />
            </Button>
          </>
        );
      },
      width: 200,
    },
  ];
  return (
    <>
      <Row>
        <Col lg={6}>
          <div className="capabilityFormContainer">
            <div className="capabilityForm">
              {" "}
              Project Monitoring
              {dataForGraph ? (
                <>
                  <GraphBarProject
                    userId={userId}
                    userPosition={userPosition}
                    userSection={userSection}
                    dataForGraph={dataForGraph}
                  />
                </>
              ) : (
                <BeatLoader color="#00ADEB" />
              )}
            </div>
          </div>
        </Col>
        <Col lg={6}>
          <div className="capabilityFormContainer">
            <div className="capabilityForm">
              {" "}
              Project Status
              {dataForGraph ? (
                <>
                  <GraphPieProject
                    userId={userId}
                    userPosition={userPosition}
                    userSection={userSection}
                    dataForGraph={dataForGraph}
                  />
                </>
              ) : (
                <BeatLoader color="#00ADEB" />
              )}
            </div>
          </div>
        </Col>
      </Row>

      <div className="capabilityFormContainer">
        <div className="capabilityForm">
          <div style={{ textAlign: "right", marginBottom: 5 }}>
            <Button
              onClick={() => {
                setShowModalCreateProject(true);
                handleReset();
              }}
            >
              {" "}
              <IoMdCreate style={{ pointerEvents: "none" }} /> Create Project
            </Button>
          </div>

          <div style={{ marginBottom: 6 }}>
            <Row className="test2">
              <Col className="d-flex col-6">
                <Form.Select
                  className="form margin"
                  value={fiscalYear}
                  onChange={(e) =>
                    onHandleChangeFiscalYear({ fiscalYear: e.target.value })
                  }
                >
                  <option value={""}>Fiscal Year</option>
                  <option value={"FY 23"}>FY 23</option>
                  <option value={"FY 24"}>FY 24</option>
                  <option value={"FY 25"}>FY 25</option>
                </Form.Select>
                <Form.Select
                  className="form margin"
                  value={statusFilter}
                  onChange={(e) =>
                    onHandleChangeFiscalYear({
                      fiscalYear: fiscalYear,
                      status: e.target.value,
                    })
                  }
                  disabled={fiscalYear === "" ? true : false}
                >
                  <option value={""}>Select Status</option>
                  <option value={"Not Yet Started"}>Not Yet Started</option>
                  <option value={"On Progress"}>On Progress</option>
                  <option value={"Delay"}>Delay</option>
                  <option value={"Finish"}>Finish</option>
                  <option value={"Waiting Detail Activity"}>
                    Waiting Detail Activity
                  </option>
                  <option value={"cancel"}>cancel</option>
                </Form.Select>
                {/* <Form.Group className="col-2  margin">
                  <Form.Label className="label_start">Start Project</Form.Label>
                  <Form.Control
                    type="date"
                    value={fromDate}
                    onChange={(e) => {
                      setFromDate(e.target.value);
                      handleFilterTableProject({
                        totalProject,
                        fromDate: e.target.value,
                      });
                    }}
                  />
                </Form.Group>
                <Form.Group className="col-2">
                  <Form.Label className="label_start">
                    Finish Project
                  </Form.Label>
                  <Form.Control
                    type="date"
                    value={toDate}
                    onChange={(e) => {
                      setToDate(e.target.value);
                      handleFilterTableProject();
                    }}
                  />
                </Form.Group> */}
              </Col>
            </Row>
          </div>
          {/* 
          <div style={{ marginBottom: 5 }}>
            <Row className="col-12">
              <Col lg={3}>
                <Form.Select
                  value={filterBy}
                  onChange={(e) => {
                    setFilterBy(e.target.value);
                    dispatch({
                      type: SETFILTER,
                      payload: e.target.value,
                    });
                  }}
                >
                  <option value="">Filter By</option>
                  <option value="category">Category</option>
                  <option value="rank">Rank</option>
                  <option value="pic">PIC</option>
                  <option value="status">Status</option>
                  <option value="product">Product</option>
                </Form.Select>
              </Col>
              <Col lg={3}>
                {filterBy !== "" && (
                  <Form.Select
                    value={detailFilterValue}
                    onChange={(e) => {
                      setDetailFilterValue(e.target.value);
                      dispatch({
                        type: SETFILTERDETAIL,
                        payload: e.target.value,
                      });
                    }}
                  >
                    <option value="">Select Detail</option>
                    {filterItemLogic()}
                  </Form.Select>
                )}
              </Col>
              <Col lg={3}>
                {filterBy !== "" && (
                  <Button
                    onClick={() => {
                      setFilterBy("");
                      dispatch({
                        type: SETFILTERDETAIL,
                        payload: "",
                      });
                      dispatch({
                        type: SETFILTER,
                        payload: "",
                      });
                      setFiscalYear("");
                      setFromDate("");
                      setToDate("");
                    }}
                  >
                    Reset
                  </Button>
                )}
              </Col>
            </Row>
          </div> */}

          <TitleSection
            title="Project List"
            icon={<BsListNested style={{ marginRight: 5 }} />}
          />
          {tableProject.length > 0 ? (
            <DataGrid
              columns={columns}
              rows={tableProject}
              disableRowSelectionOnClick
              initialState={{
                pagination: {
                  paginationModel: { pageSize: 10, page: 0 },
                },
              }}
              pageSizeOptions={[5, 10, 20]}
            />
          ) : (
            <BeatLoader color="#00ADEB" />
          )}
          {/* <div className="paginationTableProduct">
            <PaginationTable
              totalPage={totalPageData}
              maxPagesShow={maxPagesShow}
              onChangePage={(e) => {
                setPage(e);
                dispatch({
                  type: SETPAGE,
                  payload: e,
                });
              }}
              pageActive={page}
            />
          </div> */}
        </div>
        {/* //modal start dari sini */}
        <Modal
          show={show}
          onHide={() => {
            setShow(false);
          }}
        >
          <Modal.Header closeButton>
            <Modal.Title>Confirm</Modal.Title>
          </Modal.Header>
          <Modal.Body>{message}</Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => {
                setShow(false);
              }}
            >
              Close
            </Button>
          </Modal.Footer>
        </Modal>
        <Modal show={showEmailModal} onHide={handleCloseModalEmail}>
          <Modal.Header closeButton>
            <Modal.Title>Send Email To Member</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {!showSuccess ? (
              <>
                <Form onSubmit={handleSendEmailToUser}>
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
                      <Button type="button" onClick={handleAddToEmail}>
                        Add
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
                  <Row className="mb-3" style={{ textAlign: "left" }}>
                    <Form.Group as={Col}>
                      <Form.Label>Subject</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter Subject"
                        onChange={(e) => setSubjectEmail(e.target.value)}
                        value={subjectEmail}
                        required
                      />
                    </Form.Group>
                  </Row>
                  <Row className="mb-3" style={{ textAlign: "left" }}>
                    <Form.Group as={Col}>
                      <Form.Label>Body</Form.Label>
                      <Form.Control
                        as={"textarea"}
                        style={{ height: 100 }}
                        placeholder="Enter Body"
                        onChange={(e) => setBodyEmail(e.target.value)}
                        value={bodyEmail}
                        required
                      />
                    </Form.Group>
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
        <Modal
          show={showModalCreateProject}
          size="lg"
          centered
          onHide={() => {
            setShowModalCreateProject(false);
            handleReset();
          }}
        >
          <Modal.Header closeButton>
            <Modal.Title>Form Project</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSaveCreateProject}>
              <Row className="mb-3" style={{ textAlign: "left" }}>
                <Form.Group as={Col}>
                  <Form.Label>Select Product</Form.Label>
                  <Form.Select
                    value={product}
                    onChange={(e) => setProduct(e.target.value)}
                    required
                  >
                    <option value="" disabled>
                      Open This
                    </option>
                    {productOption()}
                  </Form.Select>
                </Form.Group>
                <Form.Group as={Col}>
                  <Form.Label>Project Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter Project Name"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    required
                  />
                </Form.Group>
                <Form.Group as={Col}>
                  <Form.Label>PIC</Form.Label>
                  <Form.Select
                    value={manager}
                    onChange={(e) => setManager(e.target.value)}
                    required
                  >
                    <option value="" disabled>
                      Open This
                    </option>
                    {userOption()}
                  </Form.Select>
                </Form.Group>
              </Row>
              <Row className="mb-3" style={{ textAlign: "left" }}>
                <Form.Group as={Col}>
                  <Form.Label>Budget (*Rupiah)</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Budget"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    lang="en"
                    step={".001"}
                    required
                  />
                </Form.Group>
                <Form.Group as={Col}>
                  <Form.Label>Saving Cost Estimation (*Rupiah)</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Saving Cost"
                    value={savingCost}
                    onChange={(e) => setSavingCost(e.target.value)}
                    lang="en"
                    step={".001"}
                    required
                  />
                </Form.Group>
                <Form.Group as={Col}>
                  <Form.Label>Start Project Date</Form.Label>
                  <Form.Control
                    type="date"
                    placeholder="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    required
                  />
                </Form.Group>
              </Row>
              <Row className="mb-3" style={{ textAlign: "left" }}>
                <Form.Group as={Col}>
                  <Form.Label>SOP Project Date</Form.Label>
                  <Form.Control
                    type="date"
                    placeholder="Saving Cost"
                    value={sopDate}
                    onChange={(e) => setSopDate(e.target.value)}
                    required
                  />
                </Form.Group>
                <Form.Group as={Col}>
                  <Form.Label>Choose Members to Add</Form.Label>
                  <Form.Select
                    value={memberId}
                    onChange={(e) => setMemberId(e.target.value)}
                  >
                    <option value="" disabled>
                      Open This
                    </option>
                    {userOption()}
                    <option value={PE_2WV_AISS}>PE 2WV AISS</option>
                    <option value={PE_4WV_SONAR_EFI}>PE 4WV SONAR EFI</option>
                    <option value={PE_AOI}>PE AOI</option>
                    <option value={PE_METER}>PE METER</option>
                    <option value={PE_SMD}>PE SMD</option>
                    <option value={PE_WSS}>PE WSS</option>
                  </Form.Select>
                </Form.Group>
                <Form.Group as={Col}>
                  <Form.Label></Form.Label> <br />
                  <Button type="button" onClick={handleMember}>
                    Click to Add Member
                  </Button>
                </Form.Group>
              </Row>
              <Row className="mb-3" style={{ textAlign: "left" }}>
                <Col>Our Members</Col>
              </Row>

              <Row className="mb-3" style={{ textAlign: "left" }}>
                <Col>
                  {member.length > 0
                    ? member.map((value, index) => {
                        console.log(member, "cekkk");
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
                                    (value2) => value2.id === parseInt(value)
                                  ).username
                              )}{" "}
                              <CloseButton id={value} onClick={deleteMembers} />
                            </h6>
                          </Badge>
                        );
                      })
                    : "Data Is Not Available"}
                </Col>
              </Row>
              <Row>
                <Col sm={4}>
                  <Row className="mb-3" style={{ textAlign: "left" }}>
                    <Col>
                      <Form.Label>Rank</Form.Label>
                      <Form.Select
                        value={rank}
                        onChange={(e) => setRank(e.target.value)}
                        required
                      >
                        <>
                          <option value={""}>Open This</option>
                          <option value={"A1"}>A1</option>
                          <option value={"A2"}>A2</option>
                          <option value={"A3"}>A3</option>
                          <option value={"B1"}>B1</option>
                          <option value={"B2"}>B2</option>
                          <option value={"B3"}>B3</option>
                          <option value={"C1"}>C1</option>
                          <option value={"C2"}>C2</option>
                          <option value={"C3"}>C3</option>
                        </>
                      </Form.Select>
                    </Col>
                  </Row>
                </Col>
              </Row>
              <Row>
                <Col sm={4}>
                  <Row className="mb-3" style={{ textAlign: "left" }}>
                    <Col>
                      <Form.Label>Category</Form.Label>
                      <Form.Select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        required
                      >
                        <option value={""}>Open This</option>
                        {userSection === 4 || userSection === 10 ? (
                          <>
                            <option value="" disabled>
                              Open This
                            </option>
                            <option value="CO2 Neutral">CO2 Neutral</option>
                            <option value="Log Auto">Log Auto</option>
                            <option value="Vision">Vision</option>
                            <option value="DX">DX</option>
                            <option value="Layout">Layout</option>
                          </>
                        ) : (
                          <>
                            <option value="" disabled>
                              Open This
                            </option>
                            <option value="New Model">New Model</option>
                            <option value="Quality">Quality</option>
                            <option value="Integrated Factory">
                              Integrated Factory
                            </option>
                            <option value="Productivity">Productivity</option>
                            <option value="Profit Improvement">
                              Profit Improvement
                            </option>
                          </>
                        )}

                        {/* {filterItemLogic()} */}
                      </Form.Select>
                    </Col>
                  </Row>
                  <Row className="mb-3" style={{ textAlign: "left" }}>
                    <Col>
                      <Form.Label>Sub Category (*optional)</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter Sub Category"
                        value={subCategory}
                        onChange={(e) => setSubCategory(e.target.value)}
                      />
                    </Col>
                  </Row>
                </Col>
                <Col sm={8} style={{ textAlign: "left" }}>
                  <Form.Label>Description (*optional)</Form.Label>
                  <Form.Control
                    as="textarea"
                    style={{ height: 120 }}
                    value={description}
                    onChange={handleChangeDescription}
                  />
                </Col>
              </Row>
              <Row className="mb-3" style={{ textAlign: "right" }}>
                <Col>
                  <Button type="submit" style={{ marginRight: 5 }}>
                    {projectIdEdit ? "Update" : "Save"}
                  </Button>
                  <Button type="button" onClick={handleReset}>
                    Reset
                  </Button>
                </Col>
              </Row>
            </Form>
          </Modal.Body>
        </Modal>
      </div>
    </>
  );
}

export default GlobalConsumer(Project);

Project.propTypes = {
  action: PropTypes.number,
};
