import "./App.css";
import { GlobalProvider } from "./Context/store";
import LayoutPage from "./Page/LayoutPage";

function App() {
  return (
    <div className="App">
      <LayoutPage />
    </div>
  );
}

export default GlobalProvider(App);
