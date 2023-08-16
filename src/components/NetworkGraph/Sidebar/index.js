import React, { useState } from "react";
import {
  Collapse,
  InputNumber,
  ConfigProvider,
  Slider,
  Divider,
  Switch,
} from "antd";
import { Tooltip } from "../../Common/Tooltip";

import styles from "./Sidebar.module.css";
import { style } from "d3";
const { Panel } = Collapse;

const Sidebar = ({
  device_types,
  forceProperties,
  setForceProperties,
  node_label_visibility,
  setNodeLabelVisibility,
  edge_label_visibility,
  setEdgeLabelVisibility,
  traffic_flow_visibility,
  setTrafficFlowVisibility,
  vulnerability_visibility,
  setVulnerabilityVisibility,
}) => {
  // const device_types = [
  //   { device_type: "computer", icon: "icons/computer.svg" },
  //   { device_type: "laptop", icon: "icons/laptop.svg" },
  //   { device_type: "phone", icon: "icons/phone.svg" },
  //   { device_type: "printer", icon: "icons/printer.svg" },
  //   { device_type: "server", icon: "icons/server.svg" },
  //   { device_type: "switch", icon: "icons/switch.svg" },
  //   { device_type: "modem", icon: "icons/modem.svg" },
  //   { device_type: "router", icon: "icons/router.svg" },
  //   { device_type: "firewall", icon: "icons/firewall.svg" },
  //   { device_type: "internet", icon: "icons/internet.svg" },
  // ];

  const handleChange = (section, key, value) => {
    setForceProperties((prevProperties) => ({
      ...prevProperties,
      [section]: {
        ...prevProperties[section],
        [key]: value,
      },
    }));
  };

  const handleDragStart = (event, node) => {
    console.log("handleDragStart");
    event.dataTransfer.setData("application/x-d3-node", JSON.stringify(node));
  };

  // random ID
  function guidGenerator() {
    var S4 = function () {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    return (
      S4() +
      S4() +
      "-" +
      S4() +
      "-" +
      S4() +
      "-" +
      S4() +
      "-" +
      S4() +
      S4() +
      S4()
    );
  }

  return (
    <div className={styles.sidebar}>
      <ConfigProvider
        theme={{
          // hashed: false,
          token: {
            colorText: "whitesmoke",
            colorBgContainer: "rgb(70,70,70)",
          },
          components: {
            Collapse: {
              // colorText: "black",
              colorBorder: "rgb(191, 191, 191)",
              borderRadiusLG: "5",
              lineWidth: "2",
            },
            InputNumber: {
              // colorText: "black",
            },
          },
        }}
      >
        <Collapse
          size="large"
          defaultActiveKey={["simulation"]}
          // defaultActiveKey={["representation", "filter", "style"]}
          style={{
            minHeight: "calc(100vh - 5rem)",
            maxHeight: "calc(100vh - 5rem)",
            overflowY: "auto",
          }}
          // className={styles.collapse}
        >
          <Panel header="Network Simulation" key="simulation">
            <div className={styles.simulation}>
              <span>
                <b> Design Your Network: </b> Simply drag and drop the nodes
                below onto the canvas to construct and simulate your network
                topology.
              </span>

              <div className={styles.node_container}>
                {device_types.map((iconInfo) => (
                  <div
                    key={iconInfo.device_type}
                    className={styles.icon_container}
                    draggable
                    onDragStart={(event) =>
                      handleDragStart(event, {
                        id: guidGenerator() /* other properties */,
                        device_type: iconInfo.device_type,
                      })
                    }
                  >
                    <img
                      className={styles.icon}
                      draggable="false"
                      src={iconInfo.icon}
                      alt={`SVG Example for ${iconInfo.device_type}`}
                    />
                  </div>
                ))}
              </div>
            </div>
          </Panel>

          <Panel header="Network Filter" key="filter">
            <div className={styles.section}>
              <div className={styles.panel}>
                <div className={styles.row}>
                  <Switch
                    checkedChildren="On"
                    unCheckedChildren="Off"
                    onChange={(value) => setNodeLabelVisibility(value)}
                    checked={node_label_visibility}
                  />
                  <span>Show Node Labels</span>
                </div>

                <div className={styles.row}>
                  <Switch
                    checkedChildren="On"
                    unCheckedChildren="Off"
                    onChange={(value) => setEdgeLabelVisibility(value)}
                    checked={edge_label_visibility}
                  />
                  <span>Show Edge Labels</span>
                </div>

                <div className={styles.row}>
                  <Switch
                    checkedChildren="On"
                    unCheckedChildren="Off"
                    onChange={(value) => setTrafficFlowVisibility(value)}
                    checked={traffic_flow_visibility}
                  />
                  <span>Show Traffic Flow</span>
                </div>

                <div className={styles.row}>
                  <Switch
                    checkedChildren="On"
                    unCheckedChildren="Off"
                    onChange={(value) => setVulnerabilityVisibility(value)}
                    checked={vulnerability_visibility}
                  />
                  <span>Show Vulnerability</span>
                </div>
              </div>
            </div>
          </Panel>

          <Panel header="Network Representation" key="representation">
            <div className={styles.section}>
              <div className={styles.panel}>
                <span>
                  <b>Center: </b> Shifts the view, so the graph is centered at
                  this location.
                </span>

                <div className={styles.column}>
                  <span>
                    X-coordinate{" "}
                    <Tooltip title="A value between 0 and 1, indicating the x-coordinate of the center point. 0 represents the left edge of the container, and 1 represents the right edge."></Tooltip>
                  </span>
                  <Slider
                    min={0}
                    max={1}
                    step={0.01}
                    value={forceProperties.center.x}
                    onChange={(value) => handleChange("center", "x", value)}
                    className={style.test}
                  />
                </div>

                <div className={styles.column}>
                  <span>
                    Y-coordinate{" "}
                    <Tooltip title="A value between 0 and 1, indicating the y-coordinate of the center point. 0 represents the top edge of the container, and 1 represents the bottom edge."></Tooltip>
                  </span>
                  <Slider
                    min={0}
                    max={1}
                    step={0.01}
                    value={forceProperties.center.y}
                    onChange={(value) => handleChange("center", "y", value)}
                  />
                </div>
                <div className={styles.row}>
                  <span>
                    Strength{" "}
                    <Tooltip title="A value between 0.1 and 1, representing the strength of the centering force. Higher values will result in stronger attraction towards the center. A reduced strength softens the movements on interactive graphs in which new nodes enter or exit the graph. This can result in preventing “jumpy” moves when nodes enter"></Tooltip>
                  </span>
                  <InputNumber
                    min={0.1}
                    max={1}
                    step={0.1}
                    value={forceProperties.center.strength}
                    onChange={(value) =>
                      handleChange("center", "strength", value)
                    }
                  />
                </div>
              </div>

              <Divider />

              <div className={styles.panel}>
                <span>
                  <b> Charge: </b> Attracts (+) or repels (-) nodes to / from
                  each other.
                </span>

                <div className={styles.row}>
                  <span>Charge Status</span>
                  <Switch
                    checkedChildren="On"
                    unCheckedChildren="Off"
                    onChange={(value) =>
                      handleChange("charge", "enabled", value)
                    }
                    checked={forceProperties.charge.enabled}
                  />
                </div>

                <div className={styles.row}>
                  <span>
                    Strength{" "}
                    <Tooltip title="A value between -1000 and 1000, representing the strength of the charge force. A positive value causes nodes to attract each other, while a negative value causes nodes to repel each other."></Tooltip>
                  </span>
                  <InputNumber
                    min={-1000}
                    max={1000}
                    step={50}
                    value={forceProperties.charge.strength}
                    onChange={(value) =>
                      handleChange("charge", "strength", value)
                    }
                    disabled={!forceProperties.charge.enabled}
                  />
                </div>

                <div className={styles.row}>
                  <span>
                    Distance Min{" "}
                    <Tooltip title="The value, ranging from 1 to 50, represents the minimum distance at which nodes start repelling each other and establishes an upper bound on the force strength between nearby nodes, preventing instability and random force direction when nodes are coincident."></Tooltip>
                  </span>
                  <InputNumber
                    min={1}
                    max={50}
                    step={1}
                    value={forceProperties.charge.distanceMin}
                    onChange={(value) =>
                      handleChange("charge", "distanceMin", value)
                    }
                    disabled={!forceProperties.charge.enabled}
                  />
                </div>

                <div className={styles.row}>
                  <span>
                    Distance Max{" "}
                    <Tooltip title="The value, ranging from 0 to 2000, represents the maximum distance at which nodes start repelling each other and establishes an upper bound on the force strength between nearby nodes, preventing instability and random force direction when nodes are coincident."></Tooltip>
                  </span>
                  <InputNumber
                    min={0}
                    max={2000}
                    step={100}
                    value={forceProperties.charge.distanceMax}
                    onChange={(value) =>
                      handleChange("charge", "distanceMax", value)
                    }
                    disabled={!forceProperties.charge.enabled}
                  />
                </div>

                <div className={styles.column}>
                  <span>
                    theta{" "}
                    <Tooltip title="A value between -10 and 10, controlling the Barnes-Hut approximation accuracy. Higher values improve performance but may reduce accuracy."></Tooltip>
                  </span>
                  <Slider
                    min={-10}
                    max={10}
                    step={1}
                    value={forceProperties.charge.theta}
                    onChange={(value) => handleChange("charge", "theta", value)}
                    disabled={!forceProperties.charge.enabled}
                  />
                </div>
              </div>

              <Divider />

              <div className={styles.panel}>
                <span>
                  <b>Collide: </b> Prevents nodes from overlapping
                </span>

                <div className={styles.row}>
                  <span>Collide Status:</span>
                  <Switch
                    checkedChildren="On"
                    unCheckedChildren="Off"
                    onChange={(value) =>
                      handleChange("collide", "enabled", value)
                    }
                    checked={forceProperties.collide.enabled}
                  />
                </div>

                <div className={styles.column}>
                  <span>
                    Radius{" "}
                    <Tooltip title="A value between 0 and 100, representing the minimum distance nodes must be apart to avoid overlapping."></Tooltip>
                  </span>
                  <Slider
                    min={0}
                    max={100}
                    step={1}
                    value={forceProperties.collide.radius}
                    onChange={(value) =>
                      handleChange("collide", "radius", value)
                    }
                    disabled={!forceProperties.collide.enabled}
                  />
                </div>

                <div className={styles.column}>
                  <span>
                    Strength{" "}
                    <Tooltip title="A value between 0 and 1, controlling the strength of the collision force. Higher values result in stronger collision avoidance."></Tooltip>
                  </span>
                  <Slider
                    min={0}
                    max={1}
                    step={0.1}
                    value={forceProperties.collide.strength}
                    onChange={(value) =>
                      handleChange("collide", "strength", value)
                    }
                    disabled={!forceProperties.collide.enabled}
                  />
                </div>

                <div className={styles.column}>
                  <span>
                    Iterations{" "}
                    <Tooltip title="A value between 0 and 10, Increasing the number of iterations greatly increases the rigidity of the constraint and avoids partial overlap of nodes, but also increases the runtime cost to evaluate the force."></Tooltip>
                  </span>
                  <Slider
                    min={1}
                    max={10}
                    step={1}
                    value={forceProperties.collide.iterations}
                    onChange={(value) =>
                      handleChange("collide", "iterations", value)
                    }
                    disabled={!forceProperties.collide.enabled}
                  />
                </div>
              </div>

              <Divider />

              <div className={styles.panel}>
                <span>
                  <b>ForceX: </b> Acts like gravity. Pulls all points towards an
                  X location.
                </span>

                <div className={styles.row}>
                  <span>ForceX Status:</span>
                  <Switch
                    checkedChildren="On"
                    unCheckedChildren="Off"
                    onChange={(value) =>
                      handleChange("forceX", "enabled", value)
                    }
                    checked={forceProperties.forceX.enabled}
                  />
                </div>

                <div className={styles.column}>
                  <span>
                    Strength{" "}
                    <Tooltip title="A value between 0 and 1, determines how much to increment the node’s x-velocity. For example, a value of 0.1 indicates that the node should move a tenth of the way from its current x-position to the target x-position with each application. Higher values moves nodes more quickly to the target position."></Tooltip>
                  </span>
                  <Slider
                    min={0}
                    max={1}
                    step={0.1}
                    value={forceProperties.forceX.strength}
                    onChange={(value) =>
                      handleChange("forceX", "strength", value)
                    }
                    disabled={!forceProperties.forceX.enabled}
                  />
                </div>

                <div className={styles.column}>
                  <span>
                    X-coordinate{" "}
                    <Tooltip title="A value between 0 and 1, determines how much the force will push the nodes in the X direction."></Tooltip>
                  </span>
                  <Slider
                    min={0}
                    max={1}
                    step={0.01}
                    value={forceProperties.forceX.x}
                    onChange={(value) => handleChange("forceX", "x", value)}
                    disabled={!forceProperties.forceX.enabled}
                  />
                </div>
              </div>

              <Divider />

              <div className={styles.panel}>
                <span>
                  <b>ForceY: </b> Acts like gravity. Pulls all points towards an
                  Y location.
                </span>

                <div className={styles.row}>
                  <span>ForceY Status:</span>
                  <Switch
                    checkedChildren="On"
                    unCheckedChildren="Off"
                    onChange={(value) =>
                      handleChange("forceY", "enabled", value)
                    }
                    checked={forceProperties.forceY.enabled}
                  />
                </div>

                <div className={styles.column}>
                  <span>
                    Strength{" "}
                    <Tooltip title="A value between 0 and 1, determines how much to increment the node’s y-velocity. For example, a value of 0.1 indicates that the node should move a tenth of the way from its current y-position to the target y-position with each application. Higher values moves nodes more quickly to the target position."></Tooltip>
                  </span>
                  <Slider
                    min={0}
                    max={1}
                    step={0.1}
                    value={forceProperties.forceY.strength}
                    onChange={(value) =>
                      handleChange("forceY", "strength", value)
                    }
                    disabled={!forceProperties.forceY.enabled}
                  />
                </div>

                <div className={styles.column}>
                  <span>
                    Y-coordinate{" "}
                    <Tooltip title="A value between 0 and 1, determines how much the force will push the nodes in the Y direction."></Tooltip>
                  </span>
                  <Slider
                    min={0}
                    max={1}
                    step={0.01}
                    value={forceProperties.forceY.y}
                    onChange={(value) => handleChange("forceY", "y", value)}
                    disabled={!forceProperties.forceY.enabled}
                  />
                </div>
              </div>

              <Divider />

              <div className={styles.panel}>
                <span>
                  <b>Link: </b> Sets link length
                </span>

                <div className={styles.row}>
                  <span>Link Status:</span>
                  <Switch
                    checkedChildren="On"
                    unCheckedChildren="Off"
                    onChange={(value) => handleChange("link", "enabled", value)}
                    checked={forceProperties.link.enabled}
                  />
                </div>

                <div className={styles.column}>
                  <span>
                    Distance{" "}
                    <Tooltip title="A value between 0 and 500, determines the length to which the force will push/pull nodes to create links."></Tooltip>
                  </span>
                  <Slider
                    min={0}
                    max={500}
                    step={1}
                    value={forceProperties.link.distance}
                    onChange={(value) =>
                      handleChange("link", "distance", value)
                    }
                    disabled={!forceProperties.link.enabled}
                  />
                </div>

                <div className={styles.column}>
                  <span>
                    Iterations{" "}
                    <Tooltip title="A value between 1 and 10, used for iterations, significantly enhances constraint rigidity, making it particularly suitable for intricate structures like lattices. However, this enhancement comes at the cost of intensifying the computational load due to increased force evaluation runtime. Caution is advised when considering higher values."></Tooltip>
                  </span>
                  <Slider
                    min={1}
                    max={10}
                    step={1}
                    value={forceProperties.link.iterations}
                    onChange={(value) =>
                      handleChange("link", "iterations", value)
                    }
                    disabled={!forceProperties.link.enabled}
                  />
                </div>

                <div className={styles.column}>
                  <span>
                    Strength{" "}
                    <Tooltip title="A value between 0 and 2, determines how much the links influence the layout of the nodes. Higher values result in stronger forces that pull the linked nodes together, while lower values reduce the effect of the force."></Tooltip>
                  </span>
                  <Slider
                    min={0}
                    max={2}
                    step={0.01}
                    value={forceProperties.link.strength}
                    onChange={(value) =>
                      handleChange("link", "strength", value)
                    }
                    disabled={!forceProperties.link.enabled}
                  />
                </div>
              </div>

              <Divider />

              <div className={styles.panel}>
                <span>
                  <b>Radial: </b> drawing all nodes towards a center point
                </span>

                <div className={styles.row}>
                  <span>Radial Status:</span>
                  <Switch
                    checkedChildren="On"
                    unCheckedChildren="Off"
                    onChange={(value) =>
                      handleChange("radial", "enabled", value)
                    }
                    checked={forceProperties.radial.enabled}
                  />
                </div>

                <div className={styles.column}>
                  <span>
                    Strength{" "}
                    <Tooltip title="A value between 0 and 1, determines the increment in a node's x- and y-velocity, effectively determining how rapidly the node approaches its target point."></Tooltip>
                  </span>
                  <Slider
                    min={0}
                    max={1}
                    step={0.01}
                    value={forceProperties.radial.strength}
                    onChange={(value) =>
                      handleChange("radial", "strength", value)
                    }
                    disabled={!forceProperties.radial.enabled}
                  />
                </div>

                <div className={styles.column}>
                  <span>
                    Radius{" "}
                    <Tooltip title="A value between 0 and 500, establishes the circle's radius for the given node. By setting this attribute, the force recalculates the radius for each node based on the specified number or function, facilitating the movement towards or away from the circle's edge. "></Tooltip>
                  </span>
                  <Slider
                    min={0}
                    max={500}
                    step={1}
                    value={forceProperties.radial.radius}
                    onChange={(value) =>
                      handleChange("radial", "radius", value)
                    }
                    disabled={!forceProperties.radial.enabled}
                  />
                </div>
              </div>
            </div>
          </Panel>

          <Panel header="Network Style" key="style">
            {/* Add input fields */}
          </Panel>
        </Collapse>
      </ConfigProvider>
    </div>
  );
};

export default Sidebar;
