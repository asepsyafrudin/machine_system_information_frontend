import { Provider } from "react-redux";
import "./App.css";
import LayoutPage from "./Page/LayoutPage";
import store from "../src/redux/store";

function App() {
  return (
    <Provider store={store}>
      <div className="App">
        <LayoutPage />
      </div>
    </Provider>
  );
}

export default App;
