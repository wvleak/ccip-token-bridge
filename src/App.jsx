//import "./App.css";
//import "../styles/globals.css";
import Bridge from "./components/Bridge/Bridge";
import Heading from "./components/Heading";
import TopBar from "./components/TopBar";

function App() {
  return (
    <>
      <div className="main">
        <div className="gradient"></div>
      </div>
      <div className="relative z-10 flex justify-center items-center flex-center flex-col max-w-7xl mx-auto sm:px-16 px-6">
        <TopBar />
        <Heading />
        <Bridge />
      </div>
    </>
  );
}

export default App;
