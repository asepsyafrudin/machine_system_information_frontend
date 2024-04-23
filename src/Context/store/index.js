import React, { Component, createContext } from "react";
import {
  CHANGEDATA,
  RESETUSERLOGIN,
  SAVECHANGEDATA,
  SAVETODO,
  SAVEUSERLOGIN,
  SETPROJECTEVENT,
  SETUSEREVENT,
  TODOCHANGECOUNT,
  SETPAGE,
  SETFILTER,
  SETFILTERDETAIL,
  SETFILTERDETAIL1,
  SETFILTERDETAIL2,
  SETFILTERDETAIL3,
} from "../const";

const Context = createContext();
const Provider = Context.Provider;

export const GlobalProvider = (Children) => {
  return class ParentComp extends Component {
    state = {
      user_id: "",
      username: "",
      photo: "",
      npk: "",
      email: "",
      product: "",
      section: "",
      position: "",
      dataChangeCount: 0,
      todoChangeCount: 0,
      projectEvent: "totalProject",
      userEvent: "userDashboard",
      pageEvent: 1,
      filterEvent: "",
      filterDetailEvent: "",
      filterDetailEvent1: "",
      filterDetailEvent2: "",
      filterDetailEvent3: "",
    };

    dipatch = (action) => {
      if (action.type === SAVEUSERLOGIN) {
        this.setState({ user_id: action.payload.user_id });
        this.setState({ username: action.payload.username });
        this.setState({ photo: action.payload.photo });
        this.setState({ npk: action.payload.npk });
        this.setState({ email: action.payload.email });
        this.setState({ product: action.payload.product });
        this.setState({ section: action.payload.section });
        this.setState({ position: action.payload.position });
      }

      if (action.type === RESETUSERLOGIN) {
        this.setState({ user_id: "" });
        this.setState({ username: "" });
        this.setState({ photo: "" });
        this.setState({ npk: "" });
        this.setState({ email: "" });
        this.setState({ product: "" });
        this.setState({ section: "" });
        this.setState({ position: "" });
      }

      if (action.type === CHANGEDATA) {
        this.setState({ dataChangeCount: this.state.dataChangeCount + 1 });
      }

      if (action.type === SAVECHANGEDATA) {
        this.setState({ dataChangeCount: 0 });
      }

      if (action.type === TODOCHANGECOUNT) {
        this.setState({ todoChangeCount: this.state.todoChangeCount + 1 });
      }

      if (action.type === SAVETODO) {
        this.setState({ todoChangeCount: 0 });
      }

      if (action.type === SETPROJECTEVENT) {
        this.setState({ projectEvent: action.payload });
      }

      if (action.type === SETUSEREVENT) {
        this.setState({ userEvent: action.payload });
      }

      if (action.type === SETPAGE) {
        this.setState({ pageEvent: action.payload });
      }

      if (action.type === SETFILTER) {
        this.setState({ filterEvent: action.payload });
      }

      if (action.type === SETFILTERDETAIL) {
        this.setState({ filterDetailEvent: action.payload });
      }
      if (action.type === SETFILTERDETAIL1) {
        this.setState({ filterDetailEvent1: action.payload });
      }
      if (action.type === SETFILTERDETAIL2) {
        this.setState({ filterDetailEvent2: action.payload });
      }
      if (action.type === SETFILTERDETAIL3) {
        this.setState({ filterDetailEvent3: action.payload });
      }
    };

    render() {
      return (
        <Provider
          value={{
            user_id: this.state.user_id,
            username: this.state.username,
            photo: this.state.photo,
            npk: this.state.npk,
            email: this.state.email,
            product: this.state.product,
            section: this.state.section,
            position: this.state.position,
            dataChangeCount: this.state.dataChangeCount,
            todoChangeCount: this.state.todoChangeCount,
            projectEvent: this.state.projectEvent,
            userEvent: this.state.userEvent,
            pageEvent: this.state.pageEvent,
            filterEvent: this.state.filterEvent,
            filterDetailEvent: this.state.filterDetailEvent,
            filterDetailEvent1: this.state.filterDetailEvent1,
            filterDetailEvent2: this.state.filterDetailEvent2,
            filterDetailEvent3: this.state.filterDetailEvent3,
            dispatch: this.dipatch,
          }}
        >
          <Children {...this.props} />
        </Provider>
      );
    }
  };
};

const Consumer = Context.Consumer;
export const GlobalConsumer = (Children) => {
  return class ParentComp extends Component {
    render() {
      return (
        <Consumer>
          {(value) => {
            return <Children {...this.props} {...value} />;
          }}
        </Consumer>
      );
    }
  };
};
