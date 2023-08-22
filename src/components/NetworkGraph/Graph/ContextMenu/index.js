import React, { useState, useRef } from "react";
import styles from "./ContextMenu.module.css";
import { Modal, Button, Input, Form } from "antd"; // Import Modal and Form from Ant Design
import data from "./../../../../data/data.json";

function ContextMenu({
  visible,
  position,
  onClose,
  options,
  data,
  setData,
  clickedNodeData,
  setContextMenuVisible,
  initialSim,
}) {
  // console.log(data);
  const [showModalVisible, setShowModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [form] = Form.useForm(); // Create a form instance

  const handleOptionClick = (option) => {
    if (option.label === "Show Information") {
      if (clickedNodeData) {
        // console.log("Clicked node info:", clickedNodeData);
        setShowModalVisible(true); // Set modal visibility first
      }
    } else if (option.label === "Edit Information") {
      console.log("Edit Information function");
      // console.log(clickedNodeData);
      form.setFieldsValue(clickedNodeData);
      setEditModalVisible(true);
    } else if (option.label === "Collapse / Expand") {
      // Handle collapse / expand logic here
      console.log("Collapse / Expand function");
    }

    onClose();
  };

  const handleEditFormSubmit = (values) => {
    console.log(values);
    // Find the index of the clicked node
    const clickedNodeIndex = data.nodes.findIndex(
      (node) => node.id === clickedNodeData.id
    );

    console.log(clickedNodeIndex);

    if (clickedNodeIndex !== -1) {
      // Check if the edited values are the same as the existing node values
      const isSameValues = Object.keys(values).every(
        (key) => values[key] === clickedNodeData[key]
      );

      if (isSameValues) {
        // No need to update if values are the same, just close the modal
        setEditModalVisible(false);
        return;
      }

      // Remove the existing node and its connected edges
      const updatedNodes = data.nodes.filter(
        (node) => node.id !== clickedNodeData.id
      );
      const updatedEdges = data.edges.filter(
        (edge) =>
          edge.source.id !== clickedNodeData.id &&
          edge.target.id !== clickedNodeData.id
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

      console.log(updatedConnectedEdges);

      // Update the data state with the new nodes and connected edges
      setData({
        nodes: updatedNodes,
        edges: [
          ...data.edges.filter((node) => node === null),
          ...updatedConnectedEdges,
        ],
      });

      setEditModalVisible(false);
    }
  };

  const handleCancelEditInformation = () => {
    setEditModalVisible(false);
    form.resetFields();
    // form.resetFields()
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
        open={showModalVisible}
        onCancel={() => {
          setShowModalVisible(false);
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
        open={editModalVisible}
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
          <Button key="Edit" type="primary" onClick={form.submit}>
            Edit
          </Button>,
        ]}
      >
        {clickedNodeData && (
          <Form
            form={form}
            onFinish={handleEditFormSubmit}
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
              {/* <Form.Item
                label="Group Number"
                name="group_number"
                rules={[
                  { required: true, message: "Please input the group number!" },
                ]}
              >
                <Input placeholder="Group Number" />
              </Form.Item> */}
            </div>
            {/* <div className={styles.modalFooter}>
              <Button key="cancel" onClick={() => setEditModalVisible(false)}>
                Cancel
              </Button>
              <Button key="edit" type="primary" htmlType="submit">
                Edit
              </Button>
            </div> */}
          </Form>
        )}
      </Modal>
    </div>
  );
}

export default ContextMenu;
