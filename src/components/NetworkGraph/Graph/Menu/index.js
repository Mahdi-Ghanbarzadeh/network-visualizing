import React from "react";
import { ConfigProvider, FloatButton } from "antd";
import {
  ZoomOutOutlined,
  ZoomInOutlined,
  FullscreenExitOutlined,
  FullscreenOutlined,
  DownloadOutlined,
  SyncOutlined,
} from "@ant-design/icons";

const Menu = ({
  zoomInHandler,
  zoomResetHandler,
  zoomOutHandler,
  fullScreenHandle,
}) => {
  return (
    <div>
      <ConfigProvider
        theme={{
          // hashed: false,
          token: {
            // colorText: "whitesmoke",
            colorText: "steelblue",
            colorBgElevated: "rgb(40,40,40)",
            // colorBgElevated: "steelblue",
            colorSplit: "red",
            boxShadowSecondary:
              "0 6px 16px 0 rgba(0, 0, 0, 0.04), 0 3px 6px -4px rgba(0, 0, 0, 0.08), 0 9px 28px 8px rgba(0, 0, 0, 0.01) ",
            controlItemBgHover: "rgba(100, 0, 100, 0.04)",
          },
          components: {},
        }}
      >
        <FloatButton.Group
          shape="square"
          style={{
            // right: 94,
            top: 250,
            left: 40,
          }}
        >
          <FloatButton
            icon={<ZoomInOutlined />}
            onClick={() => zoomInHandler()}
          />
          <FloatButton
            icon={<SyncOutlined />}
            onClick={() => zoomResetHandler()}
          />
          <FloatButton
            icon={<ZoomOutOutlined />}
            onClick={() => zoomOutHandler()}
          />
          <FloatButton
            icon={
              fullScreenHandle.active ? (
                <FullscreenExitOutlined />
              ) : (
                <FullscreenOutlined />
              )
            }
            onClick={() => {
              return fullScreenHandle.active
                ? fullScreenHandle.exit()
                : fullScreenHandle.enter();
            }}
          />
          <FloatButton icon={<DownloadOutlined />} />
        </FloatButton.Group>
      </ConfigProvider>
    </div>
  );
};

export default Menu;
