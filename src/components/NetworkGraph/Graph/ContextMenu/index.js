import React, { useState, useRef } from "react";
import styles from "./ContextMenu.module.css";
import { Modal, Button, Input, Form, InputNumber } from "antd"; // Import Modal and Form from Ant Design
import data from "./../../../../data/data.json";

function ContextMenu({
  visible,
  position,
  onClose,
  options,
  data,
  setData,
  clickedNodeData,
  clickedEdgeData,
  setContextMenuVisible,
  confirmDeleteAction,
  currentMenuContext,
}) {
  // variables related to "node" context menu
  const [nodeInformationModalVisibility, setNodeInformationModalVisibility] =
    useState(false);
  const [nodeEditModalVisibility, setNodeEditModalVisibility] = useState(false);
  const [nodeForm] = Form.useForm(); // Create a form instance for editing node

  // variables related to "edge" context menu
  const [edgeInformationModalVisibility, setEdgeInformationModalVisibility] =
    useState(false);
  const [edgeEditModalVisibility, setEdgeEditModalVisibility] = useState(false);
  const [edgeForm] = Form.useForm(); // Create a form instance for editing edge

  const handleOptionClick = (option) => {
    if (currentMenuContext === "Node") {
      console.log("node options");
      if (option.label === "Show Information") {
        if (clickedNodeData) {
          setNodeInformationModalVisibility(true);
        }
      } else if (option.label === "Edit Information") {
        nodeForm.setFieldsValue(clickedNodeData);
        setNodeEditModalVisibility(true);
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
        if (clickedEdgeData) {
          setEdgeInformationModalVisibility(true);
        }
      } else if (option.label === "Edit Information") {
        edgeForm.setFieldsValue(clickedEdgeData);
        setEdgeEditModalVisibility(true);
      } else if (option.label === "Delete Edge") {
        confirmDeleteAction(clickedEdgeData, null);
      }
    }

    onClose();
  };

  const handleNodeEditFormSubmit = (values) => {
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

  // const handleEdgeEditFormSubmit = (values) => {
  //   console.log("Submitting edited edge data:", values);

  //   // Assuming you have a way to update the data with the edited edge information
  //   // Update the data with the edited edge information
  //   const updatedEdges = data.edges.map((edge) =>
  //     edge.index === clickedEdgeData.index ? { ...edge, ...values } : edge
  //   );

  //   console.log("updatedEdges");
  //   console.log(updatedEdges);

  //   // Update the data state with the updated edges
  //   setData((prevData) => ({
  //     nodes: [...data.nodes.filter((node) => node === null), ...data.nodes],
  //     edges: updatedEdges,
  //   }));

  //   // Close the modal
  //   setEdgeEditModalVisibility(false);
  // };

  const handleCancelEditInformation = () => {
    setNodeEditModalVisibility(false);
    setEdgeEditModalVisibility(false);

    nodeForm.resetFields();
    edgeForm.resetFields();
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
        }}
        footer={null}
      >
        {clickedNodeData && (
          <div>
            <p>ID: {clickedNodeData.id}</p>
            <p>Device Type: {clickedNodeData.device_type}</p>
            <p>Model: {clickedNodeData.model}</p>
            <p>Manufacturer: {clickedNodeData.manufacturer}</p>
            <p>Serial Number: {clickedNodeData.serial_number}</p>
            <p>IP Address: {clickedNodeData.ip_address}</p>
            <p>MAC Address: {clickedNodeData.mac_address}</p>
            <p>Group Number: {clickedNodeData.group_number}</p>
          </div>
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
                <Input placeholder="Device Type" />
              </Form.Item>
              <Form.Item
                label="Model"
                name="model"
                rules={[{ required: true, message: "Please input the model!" }]}
              >
                <Input placeholder="Model" />
              </Form.Item>
              <Form.Item
                label="Manufacturer"
                name="manufacturer"
                rules={[
                  { required: true, message: "Please input the manufacturer!" },
                ]}
              >
                <Input placeholder="Manufacturer" />
              </Form.Item>
              <Form.Item
                label="Serial Number"
                name="serial_number"
                rules={[
                  {
                    required: true,
                    message: "Please input the serial number!",
                  },
                ]}
              >
                <Input placeholder="Serial Number" />
              </Form.Item>
              <Form.Item
                label="IP Address"
                name="ip_address"
                rules={[
                  { required: true, message: "Please input the IP address!" },
                ]}
              >
                <Input placeholder="IP Address" />
              </Form.Item>
              <Form.Item
                label="MAC Address"
                name="mac_address"
                rules={[
                  { required: true, message: "Please input the MAC address!" },
                ]}
              >
                <Input placeholder="MAC Address" />
              </Form.Item>
            </div>
          </Form>
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
        {console.log(clickedEdgeData)}
        {clickedEdgeData && (
          <div>
            <p>Source: {clickedEdgeData.source.id}</p>
            <p>Target: {clickedEdgeData.target.id}</p>
            <p>Label: {clickedEdgeData.label}</p>
            <p>Flow: {clickedEdgeData.flow}</p>
          </div>
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
        {console.log(clickedEdgeData)}
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
                <Input placeholder="Source" />
              </Form.Item>
              <Form.Item
                label="Target"
                name={["target", "id"]}
                rules={[
                  { required: true, message: "Please input the target!" },
                ]}
              >
                <Input placeholder="Target" />
              </Form.Item>
              <Form.Item
                label="Label"
                name="label"
                rules={[{ required: true, message: "Please input the label!" }]}
              >
                <Input placeholder="Label" />
              </Form.Item>
              <Form.Item
                label="Flow"
                name="flow"
                rules={[{ required: true, message: "Please input the flow!" }]}
              >
                <InputNumber placeholder="Flow" />
              </Form.Item>
            </div>
          </Form>
        )}
      </Modal>
    </div>
  );
}

export default ContextMenu;
