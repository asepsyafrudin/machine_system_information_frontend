import React, { Component, createContext } from "react";
import {
  CHANGEDATA,
  RESETUSERLOGIN,
  SAVECHANGEDATA,
  SAVEUSERLOGIN,
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
