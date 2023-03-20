import React from "react";
import HexBoard from "./lib/HexagonBoard";

function App() {
  return (
    <div className="container">
      <div>
        <h1 className="title" >Abalone</h1>
        <HexBoard />
      </div>
    </div>
  );
}

export default App;