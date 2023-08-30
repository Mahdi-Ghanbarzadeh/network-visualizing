import React, { useEffect, useRef, useState } from "react";
import Graph from "./Graph";
import Sidebar from "./Sidebar";
import dataset from "./../../data/data.json";
import styles from "./NetworkGraph.module.css";
import {
  width,
  height,
  edge_width,
  node_radius,
  zoom_panning_availability,
  node_label_visibility,
  edge_label_visibility,
  traffic_flow_visibility,
  vulnerability_visibility,
  zoom_scale,
  force_properties,
  device_types,
} from "../../config";

const NetworkGraph = ({ fullScreenHandle }) => {
  console.log("dataset");
  console.log(dataset);
  const [data, setData] = useState(dataset);

  const [defaultForceProperties, setDefaultForceProperties] =
    useState(force_properties);
  const [forceProperties, setForceProperties] = useState(force_properties);

  const [nodeLabelVisibility, setNodeLabelVisibility] = useState(
    node_label_visibility
  );

  const [edgeLabelVisibility, setEdgeLabelVisibility] = useState(
    edge_label_visibility
  );

  const [trafficFlowVisibility, setTrafficFlowVisibility] = useState(
    traffic_flow_visibility
  );

  const [vulnerabilityVisibility, setVulnerabilityVisibility] = useState(
    vulnerability_visibility
  );

  const [zoomPanning, setZoomPanning] = useState(zoom_panning_availability);

  function calculateLAN(ip, subnetMask) {
    const ipParts = ip.split(".").map(Number);
    const subnetMaskParts = subnetMask.split(".").map(Number);

    const networkAddressParts = ipParts.map(
      (ipPart, index) => ipPart & subnetMaskParts[index]
    );

    const networkAddress = networkAddressParts.join(".");

    return networkAddress;
  }

  const lans = {};

  data.nodes.forEach((node) => {
    if (node.ip_address && node.subnet_mask) {
      const networkAddress = calculateLAN(node.ip_address, node.subnet_mask);
      console.log(networkAddress);
      if (!lans[networkAddress]) {
        lans[networkAddress] = Object.keys(lans).length + 1; // Assign a distinct LAN number
      }
      node.lan_number = lans[networkAddress];
      node.network_address = networkAddress;
    }
  });

  console.log(lans);
  console.log(data);
  console.log(data.nodes);

  return (
    <div className={styles.layout}>
      <Graph
        width={width}
        height={height}
        edge_width={edge_width}
        node_radius={node_radius}
        zoom_panning_availability={zoomPanning}
        node_label_visibility={nodeLabelVisibility}
        edge_label_visibility={edgeLabelVisibility}
        traffic_flow_visibility={trafficFlowVisibility}
        vulnerability_visibility={vulnerabilityVisibility}
        zoom_scale={zoom_scale}
        force_properties={forceProperties}
        default_force_properties={defaultForceProperties}
        data={data}
        setData={setData}
        device_types={device_types}
        fullScreenHandle={fullScreenHandle}
      />
      <Sidebar
        device_types={device_types}
        forceProperties={forceProperties}
        setForceProperties={setForceProperties}
        node_label_visibility={nodeLabelVisibility}
        setNodeLabelVisibility={setNodeLabelVisibility}
        edge_label_visibility={edgeLabelVisibility}
        setEdgeLabelVisibility={setEdgeLabelVisibility}
        traffic_flow_visibility={trafficFlowVisibility}
        setTrafficFlowVisibility={setTrafficFlowVisibility}
        vulnerability_visibility={vulnerabilityVisibility}
        setVulnerabilityVisibility={setVulnerabilityVisibility}
        zoom_panning_availability={zoomPanning}
        setZoomPanning={setZoomPanning}
      />
    </div>
  );
};

export default NetworkGraph;
