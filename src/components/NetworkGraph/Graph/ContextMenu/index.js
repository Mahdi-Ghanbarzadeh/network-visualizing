import React, { useState, useRef } from "react";
import styles from "./ContextMenu.module.css";
import { Modal, Button, Input, Form } from "antd"; // Import Modal and Form from Ant Design

function ContextMenu({
  visible,
  position,
  onClose,
  options,
  clickedNodeData,
  setContextMenuVisible,
}) {
  const [showModalVisible, setShowModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [form] = Form.useForm(); // Create a form instance

  const handleOptionClick = (option) => {
    if (option.label === "Show Information") {
      if (clickedNodeData) {
        console.log("Clicked node info:", clickedNodeData);
        setShowModalVisible(true); // Set modal visibility first
      }
    } else if (option.label === "Edit Information") {
      console.log("Edit Information function");
      setEditModalVisible(true);
    } else if (option.label === "Collapse / Expand") {
      // Handle collapse / expand logic here
      console.log("Collapse / Expand function");
    }

    onClose();
  };

  const handleEditFormSubmit = (values) => {
    console.log("Edited values:", values);
    setEditModalVisible(false);
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
          setEditModalVisible(false);
        }}
        footer={[
          <Button
            key="cancel"
            onClick={() => {
              setEditModalVisible(false);
            }}
          >
            Cancel
          </Button>,
          <Button key="Edit" type="primary">
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
              <Form.Item label="ID" name="id">
                <Input disabled />
              </Form.Item>
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
              <Form.Item
                label="Group Number"
                name="group_number"
                rules={[
                  { required: true, message: "Please input the group number!" },
                ]}
              >
                <Input placeholder="Group Number" />
              </Form.Item>
            </div>
            <div className={styles.modalFooter}>
              <Button key="cancel" onClick={() => setEditModalVisible(false)}>
                Cancel
              </Button>
              <Button key="edit" type="primary" htmlType="submit">
                Edit
              </Button>
            </div>
          </Form>
        )}
      </Modal>
    </div>
  );
}

export default ContextMenu;
