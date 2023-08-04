import React, { useState } from "react";
import {
  Collapse,
  InputNumber,
  ConfigProvider,
  Slider,
  Divider,
  Switch,
} from "antd";
import styles from "./Sidebar.module.css";
import { style } from "d3";
const { Panel } = Collapse;

const Sidebar = ({ forceProperties, setForceProperties }) => {
  const [properties, setProperties] = useState(forceProperties);

  const handleFormSubmit = () => {
    setForceProperties(properties);
  };

  const handleChange = (section, key, value) => {
    setProperties((prevProperties) => ({
      ...prevProperties,
      [section]: {
        ...prevProperties[section],
        [key]: value,
      },
    }));
  };

  console.log("--properties--");
  console.log(properties);

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
                  <span>X:</span>
                  <Slider
                    min={0}
                    max={1}
                    step={0.01}
                    value={properties.center.x}
                    onChange={(value) => handleChange("center", "x", value)}
                    className={style.test}
                  />
                </div>

                <div className={styles.column}>
                  <span>Y:</span>
                  <Slider
                    min={0}
                    max={1}
                    step={0.01}
                    value={properties.center.y}
                    onChange={(value) => handleChange("center", "y", value)}
                  />
                </div>
                <div className={styles.row}>
                  <span>Strength:</span>
                  <InputNumber
                    min={0.1}
                    max={2}
                    step={0.1}
                    value={properties.center.strength}
                    onChange={(value) =>
                      handleChange("center", "strength", value)
                    }
                  />
                </div>
              </div>

              <Divider />

              <div className={styles.panel}>
                <span>
                  <b> Charge: </b> Attracts (+) or repels (-) nodes to/from each
                  other.
                </span>

                <div className={styles.row}>
                  <span>Charge Status:</span>
                  <Switch
                    checkedChildren="On"
                    unCheckedChildren="Off"
                    onChange={(value) =>
                      handleChange("charge", "enabled", value)
                    }
                    checked={properties.charge.enabled}
                  />
                </div>

                <div className={styles.row}>
                  <span>Strength:</span>
                  <InputNumber
                    min={-1000}
                    max={-100}
                    step={20}
                    value={properties.charge.strength}
                    onChange={(value) =>
                      handleChange("charge", "strength", value)
                    }
                    disabled={!properties.charge.enabled}
                  />
                </div>

                <div className={styles.row}>
                  <span>Distance Min:</span>
                  <InputNumber
                    min={1}
                    max={50}
                    step={1}
                    value={properties.charge.distanceMin}
                    onChange={(value) =>
                      handleChange("charge", "distanceMin", value)
                    }
                    disabled={!properties.charge.enabled}
                  />
                </div>

                <div className={styles.row}>
                  <span>Distance Max:</span>
                  <InputNumber
                    min={1}
                    max={2000}
                    step={1}
                    value={properties.charge.distanceMax}
                    onChange={(value) =>
                      handleChange("charge", "distanceMax", value)
                    }
                    disabled={!properties.charge.enabled}
                  />
                </div>

                <div className={styles.column}>
                  <span>theta:</span>
                  <Slider
                    min={-1}
                    max={1}
                    step={0.01}
                    value={properties.charge.theta}
                    onChange={(value) => handleChange("charge", "theta", value)}
                    disabled={!properties.charge.enabled}
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
                    checked={properties.collide.enabled}
                  />
                </div>

                <div className={styles.column}>
                  <span>Radius:</span>
                  <Slider
                    min={10}
                    max={40}
                    step={1}
                    value={properties.collide.radius}
                    onChange={(value) =>
                      handleChange("collide", "radius", value)
                    }
                    disabled={!properties.collide.enabled}
                  />
                </div>

                <div className={styles.column}>
                  <span>Strength:</span>
                  <Slider
                    min={0}
                    max={2}
                    step={0.1}
                    value={properties.collide.strength}
                    onChange={(value) =>
                      handleChange("collide", "strength", value)
                    }
                    disabled={!properties.collide.enabled}
                  />
                </div>

                <div className={styles.column}>
                  <span>Iterations:</span>
                  <Slider
                    min={1}
                    max={10}
                    step={1}
                    value={properties.collide.iterations}
                    onChange={(value) =>
                      handleChange("collide", "iterations", value)
                    }
                    disabled={!properties.collide.enabled}
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
                    checked={properties.forceX.enabled}
                  />
                </div>

                <div className={styles.column}>
                  <span>Strength:</span>
                  <Slider
                    min={0}
                    max={1}
                    step={0.01}
                    value={properties.forceX.strength}
                    onChange={(value) =>
                      handleChange("forceX", "strength", value)
                    }
                    disabled={!properties.forceX.enabled}
                  />
                </div>

                <div className={styles.column}>
                  <span>X:</span>
                  <Slider
                    min={0}
                    max={1}
                    step={0.01}
                    value={properties.forceX.x}
                    onChange={(value) => handleChange("forceX", "x", value)}
                    disabled={!properties.forceX.enabled}
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
                    checked={properties.forceY.enabled}
                  />
                </div>

                <div className={styles.column}>
                  <span>Strength:</span>
                  <Slider
                    min={0}
                    max={1}
                    step={0.01}
                    value={properties.forceY.strength}
                    onChange={(value) =>
                      handleChange("forceY", "strength", value)
                    }
                    disabled={!properties.forceY.enabled}
                  />
                </div>

                <div className={styles.column}>
                  <span>Y:</span>
                  <Slider
                    min={0}
                    max={1}
                    step={0.01}
                    value={properties.forceY.y}
                    onChange={(value) => handleChange("forceY", "y", value)}
                    disabled={!properties.forceY.enabled}
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
                    checked={properties.link.enabled}
                  />
                </div>

                <div className={styles.column}>
                  <span>Distance:</span>
                  <Slider
                    min={0}
                    max={100}
                    step={1}
                    value={properties.link.distance}
                    onChange={(value) =>
                      handleChange("link", "distance", value)
                    }
                    disabled={!properties.link.enabled}
                  />
                </div>

                <div className={styles.column}>
                  <span>Iterations:</span>
                  <Slider
                    min={1}
                    max={10}
                    step={1}
                    value={properties.link.iterations}
                    onChange={(value) =>
                      handleChange("link", "iterations", value)
                    }
                    disabled={!properties.link.enabled}
                  />
                </div>

                <div className={styles.column}>
                  <span>Strength:</span>
                  <Slider
                    min={0}
                    max={2}
                    step={0.01}
                    value={properties.link.strength}
                    onChange={(value) =>
                      handleChange("link", "strength", value)
                    }
                    disabled={!properties.link.enabled}
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
                    checked={properties.radial.enabled}
                  />
                </div>

                <div className={styles.column}>
                  <span>Strength:</span>
                  <Slider
                    min={0}
                    max={2}
                    step={0.01}
                    value={properties.radial.strength}
                    onChange={(value) =>
                      handleChange("radial", "strength", value)
                    }
                    disabled={!properties.radial.enabled}
                  />
                </div>

                <div className={styles.column}>
                  <span>Radius:</span>
                  <Slider
                    min={0}
                    max={100}
                    step={1}
                    value={properties.radial.radius}
                    onChange={(value) =>
                      handleChange("radial", "radius", value)
                    }
                    disabled={!properties.radial.enabled}
                  />
                </div>
              </div>
            </div>
          </Panel>
          <Panel header="Network Filter" key="filter">
            {/* Add input fields for charge properties */}
          </Panel>
          <Panel header="Network Style" key="style">
            {/* Add input fields for collide properties */}
          </Panel>

          <button onClick={handleFormSubmit}>Apply</button>
        </Collapse>
      </ConfigProvider>
    </div>
  );
};

export default Sidebar;
