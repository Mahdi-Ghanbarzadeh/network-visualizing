import React, { useEffect, useRef, useState } from "react";
import Graph from "./Graph";
import Sidebar from "./Sidebar";
import data from "./../../data/data.json";
import styles from "./NetworkGraph.module.css";
import {
  width,
  height,
  edge_width,
  node_radius,
  node_label_visibility,
  edge_label_visibility,
  zoom_scale,
  force_properties,
} from "../../config";

const NetworkGraph = () => {
  const [defaultForceProperties, setDefaultForceProperties] =
    useState(force_properties);
  const [forceProperties, setForceProperties] = useState(force_properties);
  console.log("-----forceProperties-----");
  console.log(forceProperties);

  return (
    <div className={styles.layout}>
      <Graph
        width={width}
        height={height}
        edge_width={edge_width}
        node_radius={node_radius}
        node_label_visibility={node_label_visibility}
        edge_label_visibility={edge_label_visibility}
        zoom_scale={zoom_scale}
        force_properties={forceProperties}
        default_force_properties={defaultForceProperties}
        data={data}
      />
      <Sidebar
        forceProperties={forceProperties}
        setForceProperties={setForceProperties}
      />
    </div>
  );
};

export default NetworkGraph;
