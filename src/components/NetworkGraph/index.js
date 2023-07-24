import React, { useEffect, useRef } from "react";
import Graph from "./Graph";
import Sidebar from "./Sidebar";
import data from "./../../data/data.json";
import styles from "./NetworkGraph.module.css";

const NetworkGraph = () => {
  return (
    <div className={styles.layout}>
      <Graph data={data} />
      <Sidebar />
    </div>
  );
};

export default NetworkGraph;
