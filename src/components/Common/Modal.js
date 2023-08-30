import React, { useState } from "react";
import { Modal as AntdModal } from "antd";
import { QuestionCircleFilled } from "@ant-design/icons";

export const CustomModal = ({
  title,
  open,
  openModal,
  closeModal,
  handleOk,
  children,
}) => {
  const handleCancel = () => {
    closeModal();
  };

  return (
    <>
      <QuestionCircleFilled
        style={{ color: "blue", cursor: "pointer" }}
        onClick={openModal}
      />
      <AntdModal
        title={title}
        open={open}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        {children}
      </AntdModal>
    </>
  );
};
