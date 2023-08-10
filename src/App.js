import "./App.css";
import NetworkGraph from "./components/NetworkGraph";
import { FullScreen, useFullScreenHandle } from "react-full-screen";

function App() {
  const fullScreenHandle = useFullScreenHandle();

  return (
    <FullScreen handle={fullScreenHandle} style={{ backgroundColor: "unset" }}>
      <div className="App">
        <NetworkGraph fullScreenHandle={fullScreenHandle} />
      </div>
    </FullScreen>
  );
}

export default App;
