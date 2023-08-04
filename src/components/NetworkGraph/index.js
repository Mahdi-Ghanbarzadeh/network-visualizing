import React, { useEffect, useRef, useState } from "react";
import Graph from "./Graph";
import Sidebar from "./Sidebar";
import data from "./../../data/data.json";
import styles from "./NetworkGraph.module.css";

const NetworkGraph = () => {
  const [forceProperties, setForceProperties] = useState({
    center: {
      x: 0.5, // min: 0, max: 1
      y: 0.5, // min: 0, max: 1
      strength: 1, // min: 0.1 max: 2
    },
    charge: {
      enabled: true,
      strength: -300, // min: -1000, max: -100
      distanceMin: 1, // min: 1, max: 1
      distanceMax: 2000, // min: 1000, max: 5000
      theta: 0, // min: -1, max: 1
    },
    collide: {
      enabled: true,
      radius: 25 + 10,
      strength: 0.7, // 0 - 2
      iterations: 5, // 1 - 10
    },
    forceX: {
      enabled: false,
      strength: 0.1,
      x: 0.5,
    },
    forceY: {
      enabled: false,
      strength: 0.1,
      y: 0.5,
    },
    link: {
      enabled: true,
      distance: 80,
      iterations: 1,
      strength: 1, // set
    },
    radial: {
      enabled: false, // set
      strength: 0, // if set, the
      radius: 30, // set
      x: 1100 / 2, // had set
      y: 700 / 2, // had set
    },
  }); // Initialize with your default values

  return (
    <div className={styles.layout}>
      <Graph data={data} />
      <Sidebar
        forceProperties={forceProperties}
        setForceProperties={setForceProperties}
      />
    </div>
  );
};

export default NetworkGraph;
