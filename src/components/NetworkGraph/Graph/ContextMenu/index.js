import React, { useState, useRef } from "react";
import styles from "./ContextMenu.module.css";
import {
  Modal,
  Button,
  Input,
  Form,
  InputNumber,
  Select,
  Descriptions,
} from "antd";
import { ExclamationCircleOutlined, UserOutlined } from "@ant-design/icons";

import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import highchartsMap from "highcharts/modules/map";
import proj4 from "proj4";
import mapDataIE from "@highcharts/map-collection/countries/ir/ir-all.topo.json";
// import mapDataIE from "@highcharts/mapdata/custom/world-highres.topo.json";
highchartsMap(Highcharts); // Initialize the map module

if (typeof window !== "undefined") {
  window.proj4 = window.proj4 || proj4;
}

const { Option } = Select;

function ContextMenu({
  visible,
  position,
  onClose,
  options,
  data,
  setData,
  clickedNodeData,
  setClickedNodeData,
  clickedEdgeData,
  setClickedEdgeData,
  setContextMenuVisible,
  confirmDeleteAction,
  currentMenuContext,
  deleteAvailable,
  device_types,
}) {
  const deviceTypeValues = device_types.map((device) => device.device_type);
  console.log("clickedNodeData");
  console.log(clickedNodeData?.id);

  const subnetMaskRanges = [
    { label: "/32 - 1 IP", value: "255.255.255.255" },
    { label: "/31 - 2 IPs", value: "255.255.255.254" },
    { label: "/30 - 4 IPs", value: "255.255.255.252" },
    { label: "/29 - 8 IPs", value: "255.255.255.248" },
    { label: "/28 - 16 IPs", value: "255.255.255.240" },
    { label: "/27 - 32 IPs", value: "255.255.255.224" },
    { label: "/26 - 64 IPs", value: "255.255.255.192" },
    { label: "/25 - 128 IPs", value: "255.255.255.128" },
    { label: "/24 - 256 IPs", value: "255.255.255.0" },
    { label: "/23 - 512 IPs", value: "255.255.254.0" },
    { label: "/22 - 1,024 IPs", value: "255.255.252.0" },
    { label: "/21 - 2,048 IPs", value: "255.255.248.0" },
    { label: "/20 - 4,096 IPs", value: "255.255.240.0" },
    { label: "/19 - 8,192 IPs", value: "255.255.224.0" },
    { label: "/18 - 16,384 IPs", value: "255.255.192.0" },
    { label: "/17 - 32,768 IPs", value: "255.255.128.0" },
    { label: "/16 - 65,536 IPs", value: "255.255.0.0" },
    { label: "/15 - 131,072 IPs", value: "255.254.0.0" },
    { label: "/14 - 262,144 IPs", value: "255.252.0.0" },
    { label: "/13 - 524,288 IPs", value: "255.248.0.0" },
    { label: "/12 - 1,048,576 IPs", value: "255.240.0.0" },
    { label: "/11 - 2,097,152 IPs", value: "255.224.0.0" },
    { label: "/10 - 4,194,304 IPs", value: "255.192.0.0" },
    { label: "/9 - 8,388,608 IPs", value: "255.128.0.0" },
    { label: "/8 - 16,777,216 IPs", value: "255.0.0.0" },
    { label: "/7 - 33,554,432 IPs", value: "254.0.0.0" },
    { label: "/6 - 67,108,864 IPs", value: "252.0.0.0" },
    { label: "/5 - 134,217,728 IPs", value: "248.0.0.0" },
    { label: "/4 - 268,435,456 IPs", value: "240.0.0.0" },
    { label: "/3 - 536,870,912 IPs", value: "224.0.0.0" },
    { label: "/2 - 1,073,741,824 IPs", value: "192.0.0.0" },
    { label: "/1 - 2,147,483,648 IPs", value: "128.0.0.0" },
  ];

  // variables related to "node" context menu
  const [nodeInformationModalVisibility, setNodeInformationModalVisibility] =
    useState(false);
  const [nodeEditModalVisibility, setNodeEditModalVisibility] = useState(false);
  const [nodeForm] = Form.useForm();
  const [nodeReportModalVisibility, setNodeReportModalVisibility] =
    useState(false);

  const ID = clickedNodeData?.id;

  // Attack Data Chart for a Single Device
  const generateAttackDataForDevice = (deviceId, numberOfHours) => {
    const generateTimestampsForPreviousHours = (numberOfHours) => {
      const currentTimestamp = new Date().getTime();
      const timestamps = Array.from({ length: numberOfHours }, (_, i) => {
        const timestamp = currentTimestamp - i * 60 * 60 * 1000; // 1 hour = 60 minutes = 60 seconds = 1000 milliseconds
        return timestamp;
      });
      return timestamps;
    };

    const timestamps = generateTimestampsForPreviousHours(numberOfHours);

    const attacks = timestamps.map((timestamp) => ({
      x: timestamp,
      y: Math.floor(Math.random() * 10) + 5, // Random values between 5 and 14 for actual attacks
    }));

    return { attacks };
  };

  // Generate sample attack data for a single device for the previous 10 hours
  const deviceAttackData = generateAttackDataForDevice(ID, 10);

  const attackOptions = {
    title: {
      text: `Attack Data for ${ID}`,
    },
    xAxis: {
      type: "datetime",
    },
    yAxis: {
      title: {
        text: "number of attacks",
      },
    },
    series: [
      {
        name: "Attacks",
        data: deviceAttackData.attacks.map((dataPoint) => [
          dataPoint.x,
          dataPoint.y,
        ]),
      },
    ],
  };
  // History of Attacks Chart
  const columnRotatedLabelsOptions = {
    chart: {
      type: "column",
    },
    title: {
      text: `History of Attacks - ${ID}`,
    },
    xAxis: {
      categories: ["computer3", "laptop3", "phone1", "computer2", "laptop2"],
      labels: {
        rotation: -45,
        style: {
          fontSize: "12px",
          fontFamily: "Arial, sans-serif",
        },
      },
    },
    yAxis: {
      min: 0,
      title: {
        text: "Attacks",
      },
    },
    legend: {
      enabled: false,
    },
    tooltip: {
      pointFormat: "Attacks: <b>{point.y}</b>",
    },
    series: [
      {
        name: "Attacks",
        data: [5, 8, 12, 3, 10],
        color: "#FF6347",
      },
    ],
  };

  // Network Attack Distribution Chart
  const deviceData = {
    attacks: [
      {
        name: "Malware",
        y: 25,
      },
      {
        name: "DDoS",
        y: 15,
      },
      {
        name: "Phishing",
        y: 10,
      },
      {
        name: "SQL Injection",
        y: 8,
      },
      {
        name: "Brute Force",
        y: 12,
      },
      {
        name: "Ransomware",
        y: 7,
      },
      {
        name: "Man-in-the-Middle",
        y: 6,
      },
    ],
  };

  const { attacks } = deviceData;
  const pieChartOptions = {
    chart: {
      type: "pie",
    },
    title: {
      text: `Network Attacks Distribution - ${ID}`,
    },
    tooltip: {
      pointFormat: "<b>{point.percentage:.1f}%</b>",
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: "pointer",
        dataLabels: {
          enabled: true,
          format: "<b>{point.name}</b>: {point.percentage:.1f} %",
          style: {
            color: "black",
          },
        },
      },
    },
    series: [
      {
        name: "Attack Types",
        colorByPoint: true,
        data: attacks,
      },
    ],
  };

  // Attack Location Chart
  const mapOptions = {
    chart: {
      map: "countries/ir/iran",
    },
    title: {
      text: `Attack Location - ${ID}`,
    },
    credits: {
      enabled: false,
    },
    mapNavigation: {
      enabled: true,
    },
    tooltip: {
      headerFormat: "",
      pointFormat: "{point.custom.role}",
    },
    series: [
      {
        name: "Basemap",
        mapData: mapDataIE,
        borderColor: "#A0A0A0",
        nullColor: "rgba(200, 200, 200, 0.3)",
        showInLegend: false,
      },
      {
        type: "mapline",
        data: [
          {
            geometry: {
              type: "LineString",
              coordinates: [
                [51.6, 32.6],
                [51.3, 35.6],
              ],
            },
            className: styles.animated_line,
            color: "#eb2943 ",
          },
        ],
        lineWidth: 3,
        enableMouseTracking: false,
      },
      {
        type: "mappoint",
        // name: "Locations",
        color: "#4169E1",
        data: [
          {
            lon: 51.3,
            lat: 35.6,
            name: "Tehran",
            keyword: "Tehran",
            custom: {
              role: "Offender",
            },
          },
          {
            lon: 51.6,
            lat: 32.6,
            name: "Isfahan",
            keyword: "Isfahan",
            custom: {
              role: "Victim",
            },
          },
        ],
        cursor: "pointer",
        point: {
          events: {
            click: function () {
              console.log(this.keyword);
            },
          },
        },
      },
    ],
  };

  // variables related to "edge" context menu
  const [edgeInformationModalVisibility, setEdgeInformationModalVisibility] =
    useState(false);
  const [edgeEditModalVisibility, setEdgeEditModalVisibility] = useState(false);
  const [edgeForm] = Form.useForm();

  const [sourceOptions, setSourceOptions] = useState(data.nodes);
  const [targetOptions, setTargetOptions] = useState(data.nodes);

  function handleOptions() {
    setSourceOptions(
      data.nodes.filter(
        (node) => node.id !== edgeForm.getFieldValue(["target", "id"])
      )
    );

    setTargetOptions(
      data.nodes.filter(
        (node) => node.id !== edgeForm.getFieldValue(["source", "id"])
      )
    );
  }

  const handleOptionClick = (option) => {
    if (currentMenuContext === "Node") {
      console.log("node options");
      if (option.label === "Show Information") {
        deleteAvailable.current = false;
        if (clickedNodeData) {
          setNodeInformationModalVisibility(true);
        }
      } else if (option.label === "Edit Information") {
        deleteAvailable.current = false;
        nodeForm.setFieldsValue(clickedNodeData);
        setNodeEditModalVisibility(true);
      } else if (option.label === "Show Report") {
        deleteAvailable.current = false;
        setNodeReportModalVisibility(true);
      } else if (option.label === "Collapse / Expand") {
        // Handle collapse / expand logic here
        console.log("Collapse / Expand function");
      } else if (option.label === "Delete Node") {
        console.log("delete function");
        confirmDeleteAction(null, clickedNodeData);
      }
    } else if (currentMenuContext === "Edge") {
      console.log("edge options");
      if (option.label === "Show Information") {
        deleteAvailable.current = false;
        if (clickedEdgeData) {
          setEdgeInformationModalVisibility(true);
        }
      } else if (option.label === "Edit Information") {
        deleteAvailable.current = false;
        edgeForm.setFieldsValue(clickedEdgeData);
        setEdgeEditModalVisibility(true);
      } else if (option.label === "Delete Edge") {
        confirmDeleteAction(clickedEdgeData, null);
      }
    }

    onClose();
  };

  const handleNodeEditFormSubmit = (values) => {
    console.log("---values---");
    console.log(values);
    // Find the index of the clicked node
    const clickedNodeIndex = data.nodes.findIndex(
      (node) => node.id === clickedNodeData.id
    );

    if (clickedNodeIndex !== -1) {
      // Check if the edited values are the same as the existing node values
      const isSameValues = Object.keys(values).every(
        (key) => values[key] === clickedNodeData[key]
      );

      if (isSameValues) {
        // No need to update if values are the same, just close the modal
        setNodeEditModalVisibility(false);
        return;
      }

      // Remove the existing node and its connected edges
      const updatedNodes = data.nodes.filter(
        (node) => node.id !== clickedNodeData.id
      );

      // Add the updated node with its new information
      const updatedNode = {
        ...clickedNodeData,
        ...values,
      };
      updatedNodes.push(updatedNode);

      // Add back the connected edges with the updated node
      const updatedConnectedEdges = data.edges.map((edge) => {
        if (
          edge.source.id === clickedNodeData.id ||
          edge.target.id === clickedNodeData.id
        ) {
          // Update the edge's source or target if it was connected to the updated node
          return {
            ...edge,
            source:
              edge.source.id === clickedNodeData.id ? updatedNode : edge.source,
            target:
              edge.target.id === clickedNodeData.id ? updatedNode : edge.target,
          };
        }
        return edge;
      });

      // Update the data state with the new nodes and connected edges
      setData({
        nodes: updatedNodes,
        edges: [
          ...data.edges.filter((edge) => edge === null),
          ...updatedConnectedEdges,
        ],
      });

      setNodeEditModalVisibility(false);
      deleteAvailable.current = true;
    }
  };

  const handleEdgeEditFormSubmit = (values) => {
    if (areEdgeFormValuesEqual(clickedEdgeData, values)) {
      setEdgeEditModalVisibility(false);
      return;
    }

    // Find the index of the clicked edge
    const clickedEdgeIndex = data.edges.findIndex(
      (edge) => edge.index === clickedEdgeData.index
    );

    if (clickedEdgeIndex !== -1) {
      // Find the index of the source and target nodes in the nodes array
      const sourceNodeIndex = data.nodes.findIndex(
        (node) => node.id === values.source.id
      );
      const targetNodeIndex = data.nodes.findIndex(
        (node) => node.id === values.target.id
      );

      if (sourceNodeIndex !== -1 && targetNodeIndex !== -1) {
        const updatedNodes = data.nodes.filter(
          (node) => node.id !== values.source.id && node.id !== values.target.id
        );

        // Update the data with the edited edge information
        const updatedEdges = data.edges.map((edge, index) =>
          index === clickedEdgeIndex
            ? {
                ...edge,
                ...values,
                source: data.nodes[sourceNodeIndex],
                target: data.nodes[targetNodeIndex],
              }
            : edge
        );

        updatedNodes.push(data.nodes[sourceNodeIndex]);
        updatedNodes.push(data.nodes[targetNodeIndex]);

        setData({
          edges: updatedEdges,
          nodes: updatedNodes,
        });

        setEdgeEditModalVisibility(false);
        deleteAvailable.current = true;
      }
    }
  };

  // Function to check if edge form values are equal
  const areEdgeFormValuesEqual = (originalValues, newValues) => {
    return (
      originalValues.source.id === newValues.source.id &&
      originalValues.target.id === newValues.target.id &&
      originalValues.label === newValues.label &&
      originalValues.flow === newValues.flow
    );
  };

  const handleCancelEditInformation = () => {
    setNodeEditModalVisibility(false);
    setEdgeEditModalVisibility(false);

    // set right clicked edge and node to null to prevent possible bug
    setClickedNodeData(null);
    setClickedEdgeData(null);

    nodeForm.resetFields();
    edgeForm.resetFields();

    deleteAvailable.current = true;
  };

  // Regular expression to match a valid IP address pattern
  const validateIPAddress = (_, value) => {
    const ipRegex = /^(?:\d{1,3}\.){3}\d{1,3}$/;

    if (value && !ipRegex.test(value)) {
      return Promise.reject("Please enter a valid IP address");
    }

    return Promise.resolve();
  };

  // Regular expression to match a valid MAC address pattern
  const validateMACAddress = (_, value) => {
    const macRegex = /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/;

    if (value && !macRegex.test(value)) {
      return Promise.reject("Please enter a valid MAC address");
    }

    return Promise.resolve();
  };

  return (
    <div>
      {visible && (
        <div
          className={styles.context_menu}
          onMouseLeave={onClose}
          style={{ left: position.x, top: position.y }}
        >
          {options.map((option, index) => (
            <div
              key={index}
              className={styles.menu_option}
              onClick={() => {
                handleOptionClick(option);
              }}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}

      <Modal
        title="Node Information"
        open={nodeInformationModalVisibility}
        onCancel={() => {
          setNodeInformationModalVisibility(false);
          deleteAvailable.current = true;
        }}
        footer={null}
      >
        {clickedNodeData && (
          <Descriptions column={1} bordered>
            <Descriptions.Item label="ID">
              {clickedNodeData.id}
            </Descriptions.Item>
            <Descriptions.Item label="Device Type">
              {clickedNodeData.device_type}
            </Descriptions.Item>
            <Descriptions.Item label="Model">
              {clickedNodeData.model}
            </Descriptions.Item>
            <Descriptions.Item label="Manufacturer">
              {clickedNodeData.manufacturer}
            </Descriptions.Item>
            <Descriptions.Item label="Serial Number">
              {clickedNodeData.serial_number}
            </Descriptions.Item>
            <Descriptions.Item label="IP Address">
              {clickedNodeData.ip_address}
            </Descriptions.Item>
            <Descriptions.Item label="Subnet Mask">
              {clickedNodeData.subnet_mask}
            </Descriptions.Item>
            <Descriptions.Item label="MAC Address">
              {clickedNodeData.mac_address}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>

      <Modal
        title="Edit Information"
        open={nodeEditModalVisibility}
        onCancel={() => {
          handleCancelEditInformation();
        }}
        footer={[
          <Button
            key="cancel"
            onClick={() => {
              handleCancelEditInformation();
            }}
          >
            Cancel
          </Button>,
          <Button key="Edit" type="primary" onClick={nodeForm.submit}>
            Edit
          </Button>,
        ]}
      >
        {clickedNodeData && (
          <Form
            form={nodeForm}
            onFinish={handleNodeEditFormSubmit}
            initialValues={clickedNodeData}
          >
            <div className={styles.modalContent}>
              <Form.Item
                label="Device Type"
                name="device_type"
                rules={[
                  { required: true, message: "Please input the device type!" },
                ]}
              >
                <Select
                  options={deviceTypeValues.map((province) => ({
                    label: province,
                    value: province,
                  }))}
                />
              </Form.Item>
              <Form.Item
                label="Model"
                name="model"
                rules={[
                  { required: false, message: "Please input the model!" },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Manufacturer"
                name="manufacturer"
                rules={[
                  {
                    required: false,
                    message: "Please input the manufacturer!",
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Serial Number"
                name="serial_number"
                rules={[
                  {
                    required: false,
                    message: "Please input the serial number!",
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="IP Address"
                name="ip_address"
                rules={[
                  { required: true, message: "Please input the IP address!" },
                  { validator: validateIPAddress },
                ]}
              >
                <Input placeholder="192.168.1.1" />
              </Form.Item>
              <Form.Item
                label="Subnet Mask"
                name="subnet_mask"
                rules={[
                  { required: true, message: "Please input the subnet mask!" },
                ]}
              >
                <Select
                  options={subnetMaskRanges.map((range) => ({
                    label: range.label,
                    value: range.value,
                  }))}
                />
              </Form.Item>
              <Form.Item
                label="MAC Address"
                name="mac_address"
                rules={[
                  { required: true, message: "Please input the MAC address!" },
                  { validator: validateMACAddress },
                ]}
              >
                <Input placeholder="A1:B2:C3:D4:E5:F6" />
              </Form.Item>
            </div>
          </Form>
        )}
      </Modal>

      <Modal
        title="Show Report"
        open={nodeReportModalVisibility}
        onCancel={() => {
          setNodeReportModalVisibility(false);
          deleteAvailable.current = true;
        }}
        footer={null}
        width={1000}
      >
        {clickedNodeData && (
          <div className={styles.reportContainer}>
            <div className={styles.box}>
              <span className={`${styles.label} ${styles.offenderLabel}`}>
                <ExclamationCircleOutlined /> Offender
              </span>
              <div className={styles.value}>laptop2</div>
              <div className={styles.ipAddress}>192.168.1.75</div>
            </div>
            <div className={styles.box}>
              <span className={`${styles.label} ${styles.victimLabel}`}>
                <UserOutlined /> Victim
              </span>
              <div className={styles.value}>{clickedNodeData.id}</div>
              <div className={styles.ipAddress}>
                {clickedNodeData.ip_address}
              </div>
            </div>
            {/* <div className={styles.chartBox}>
              <HighchartsReact highcharts={Highcharts} options={chartOptions} />
            </div> */}

            <div className={styles.chartBox}>
              <HighchartsReact
                highcharts={Highcharts}
                options={attackOptions}
              />
            </div>

            <div className={styles.chartBox}>
              <HighchartsReact
                highcharts={Highcharts}
                options={columnRotatedLabelsOptions}
              />
            </div>

            <div className={styles.chartBox}>
              <HighchartsReact
                highcharts={Highcharts}
                options={pieChartOptions}
              />
            </div>

            <div className={styles.chartBox}>
              <HighchartsReact
                constructorType={"mapChart"}
                highcharts={Highcharts}
                options={mapOptions}
              />
            </div>
          </div>
        )}
      </Modal>

      <Modal
        title="Edge Information"
        open={edgeInformationModalVisibility}
        onCancel={() => {
          setEdgeInformationModalVisibility(false);
        }}
        footer={null}
      >
        {clickedEdgeData && (
          <Descriptions column={1} bordered>
            <Descriptions.Item label="Source">
              {clickedEdgeData.source.id}
            </Descriptions.Item>
            <Descriptions.Item label="Target">
              {clickedEdgeData.target.id}
            </Descriptions.Item>
            <Descriptions.Item label="Label">
              {clickedEdgeData.label}
            </Descriptions.Item>
            <Descriptions.Item label="Flow">
              {clickedEdgeData.flow}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>

      <Modal
        title="Edit Information"
        open={edgeEditModalVisibility}
        onCancel={() => {
          handleCancelEditInformation();
        }}
        footer={[
          <Button
            key="cancel"
            onClick={() => {
              handleCancelEditInformation();
            }}
          >
            Cancel
          </Button>,
          <Button key="Edit" type="primary" onClick={edgeForm.submit}>
            Edit
          </Button>,
        ]}
      >
        {clickedEdgeData && (
          <Form
            form={edgeForm}
            onFinish={handleEdgeEditFormSubmit}
            initialValues={clickedEdgeData}
          >
            <div className={styles.modalContent}>
              <Form.Item
                label="Source"
                name={["source", "id"]}
                rules={[
                  { required: true, message: "Please input the source!" },
                ]}
              >
                <Select onChange={handleOptions}>
                  {sourceOptions
                    .filter(
                      (node) =>
                        node.id !== edgeForm.getFieldValue(["target", "id"])
                    )
                    .map((node) => (
                      <Select.Option key={node.id} value={node.id}>
                        ID: {node.id} - IP: {node.ip_address} - MAC:{" "}
                        {node.mac_address}
                      </Select.Option>
                    ))}
                </Select>
              </Form.Item>
              <Form.Item
                label="Target"
                name={["target", "id"]}
                rules={[
                  { required: true, message: "Please input the target!" },
                ]}
              >
                <Select onChange={handleOptions}>
                  {targetOptions
                    .filter(
                      (node) =>
                        node.id !== edgeForm.getFieldValue(["source", "id"])
                    )
                    .map((node) => (
                      <Select.Option key={node.id} value={node.id}>
                        ID: {node.id} - IP: {node.ip_address} - MAC:{" "}
                        {node.mac_address}
                      </Select.Option>
                    ))}
                </Select>
              </Form.Item>
              <Form.Item
                label="Label"
                name="label"
                rules={[
                  { required: false, message: "Please input the label!" },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Flow"
                name="flow"
                rules={[{ required: false, message: "Please input the flow!" }]}
              >
                <InputNumber />
              </Form.Item>
            </div>
          </Form>
        )}
      </Modal>
    </div>
  );
}

export default ContextMenu;
