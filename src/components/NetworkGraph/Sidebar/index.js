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

const Sidebar = ({ forceProperties, setForceProperties }) => {
  const handleChange = (section, key, value) => {
    setForceProperties((prevProperties) => ({
      ...prevProperties,
      [section]: {
        ...prevProperties[section],
        [key]: value,
      },
    }));
  };

  // console.log("--forceProperties--");
  // console.log(forceProperties);

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
          defaultActiveKey={["representation", "filter", "style"]}
          style={{
            minHeight: "688.8px",
            maxHeight: "688.8px",
            overflowY: "auto",
          }}
          // className={styles.collapse}
        >
          <Panel header="Network Representation" key="representation">
            <div className={styles.section}>
              <div className={styles.panel}>
                <span>
                  <b>Center: </b> Shifts the view, so the graph is centered at
                  this location.
                </span>

                <div className={styles.column}>
                  <span>
                    X-Center{" "}
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
                    Y-Center{" "}
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
                    <Tooltip title="A value between 0.1 and 2, representing the strength of the centering force. Higher values will result in stronger attraction towards the center. A reduced strength softens the movements on interactive graphs in which new nodes enter or exit the graph."></Tooltip>
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
                    <Tooltip title="A value between 0 and 1, indicating the x-coordinate of the center point. 0 represents the left edge of the container, and 1 represents the right edge."></Tooltip>
                  </span>
                  <InputNumber
                    min={-1000}
                    max={-100}
                    step={50}
                    value={forceProperties.charge.strength}
                    onChange={(value) =>
                      handleChange("charge", "strength", value)
                    }
                    disabled={!forceProperties.charge.enabled}
                  />
                </div>

                <div className={styles.row}>
                  <span>Distance Min:</span>
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
                  <span>Distance Max:</span>
                  <InputNumber
                    min={1}
                    max={2000}
                    step={1}
                    value={forceProperties.charge.distanceMax}
                    onChange={(value) =>
                      handleChange("charge", "distanceMax", value)
                    }
                    disabled={!forceProperties.charge.enabled}
                  />
                </div>

                <div className={styles.column}>
                  <span>theta:</span>
                  <Slider
                    min={-1}
                    max={1}
                    step={0.01}
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
                  <span>Radius:</span>
                  <Slider
                    min={10}
                    max={40}
                    step={1}
                    value={forceProperties.collide.radius}
                    onChange={(value) =>
                      handleChange("collide", "radius", value)
                    }
                    disabled={!forceProperties.collide.enabled}
                  />
                </div>

                <div className={styles.column}>
                  <span>Strength:</span>
                  <Slider
                    min={0}
                    max={2}
                    step={0.1}
                    value={forceProperties.collide.strength}
                    onChange={(value) =>
                      handleChange("collide", "strength", value)
                    }
                    disabled={!forceProperties.collide.enabled}
                  />
                </div>

                <div className={styles.column}>
                  <span>Iterations:</span>
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
                  <span>Strength:</span>
                  <Slider
                    min={0}
                    max={1}
                    step={0.01}
                    value={forceProperties.forceX.strength}
                    onChange={(value) =>
                      handleChange("forceX", "strength", value)
                    }
                    disabled={!forceProperties.forceX.enabled}
                  />
                </div>

                <div className={styles.column}>
                  <span>X:</span>
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
                  <span>Strength:</span>
                  <Slider
                    min={0}
                    max={1}
                    step={0.01}
                    value={forceProperties.forceY.strength}
                    onChange={(value) =>
                      handleChange("forceY", "strength", value)
                    }
                    disabled={!forceProperties.forceY.enabled}
                  />
                </div>

                <div className={styles.column}>
                  <span>Y:</span>
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
                  <span>Distance:</span>
                  <Slider
                    min={0}
                    max={100}
                    step={1}
                    value={forceProperties.link.distance}
                    onChange={(value) =>
                      handleChange("link", "distance", value)
                    }
                    disabled={!forceProperties.link.enabled}
                  />
                </div>

                <div className={styles.column}>
                  <span>Iterations:</span>
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
                  <span>Strength:</span>
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
                  <b>Radial: </b> write explanation!!!!
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
                  <span>Strength:</span>
                  <Slider
                    min={0}
                    max={2}
                    step={0.01}
                    value={forceProperties.radial.strength}
                    onChange={(value) =>
                      handleChange("radial", "strength", value)
                    }
                    disabled={!forceProperties.radial.enabled}
                  />
                </div>

                <div className={styles.column}>
                  <span>Radius:</span>
                  <Slider
                    min={0}
                    max={100}
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
          <Panel header="Network Filter" key="filter">
            {/* Add input fields for charge forceProperties */}
          </Panel>
          <Panel header="Network Style" key="style">
            {/* Add input fields for collide forceProperties */}
          </Panel>

          {/* <button onClick={handleFormSubmit}>Apply</button> */}
        </Collapse>
      </ConfigProvider>
    </div>
  );
};

export default Sidebar;
