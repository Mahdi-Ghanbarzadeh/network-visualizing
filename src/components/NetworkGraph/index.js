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

const NetworkGraph = ({ fullScreenHandle }) => {
  const [defaultForceProperties, setDefaultForceProperties] =
    useState(force_properties);
  const [forceProperties, setForceProperties] = useState(force_properties);

  const [nodeLabelVisibility, setNodeLabelVisibility] = useState(
    node_label_visibility
  );

  const [edgeLabelVisibility, setEdgeLabelVisibility] = useState(
    edge_label_visibility
  );

  return (
    <div className={styles.layout}>
      <Graph
        width={width}
        height={height}
        edge_width={edge_width}
        node_radius={node_radius}
        node_label_visibility={nodeLabelVisibility}
        edge_label_visibility={edgeLabelVisibility}
        zoom_scale={zoom_scale}
        force_properties={forceProperties}
        default_force_properties={defaultForceProperties}
        data={data}
        fullScreenHandle={fullScreenHandle}
      />
      <Sidebar
        forceProperties={forceProperties}
        setForceProperties={setForceProperties}
        node_label_visibility={nodeLabelVisibility}
        setNodeLabelVisibility={setNodeLabelVisibility}
        edge_label_visibility={edgeLabelVisibility}
        setEdgeLabelVisibility={setEdgeLabelVisibility}
      />
    </div>
  );
};

export default NetworkGraph;
