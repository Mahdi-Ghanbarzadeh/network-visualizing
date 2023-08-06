import React from "react";
import { Tooltip as T } from "antd";
import { QuestionCircleFilled } from "@ant-design/icons";

export const Tooltip = ({ title }) => {
  return (
    <T title={title}>
      <QuestionCircleFilled style={{ color: "white", cursor: "pointer" }} />
    </T>
  );
};
