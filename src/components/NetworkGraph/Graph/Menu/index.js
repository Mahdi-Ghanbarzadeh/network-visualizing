import React from "react";
import { ConfigProvider, FloatButton, Tooltip } from "antd";
import {
  ZoomOutOutlined,
  ZoomInOutlined,
  FullscreenExitOutlined,
  FullscreenOutlined,
  DownloadOutlined,
  SyncOutlined,
} from "@ant-design/icons";

import styles from "./Menu.module.css";

const Menu = ({
  zoomInHandler,
  zoomResetHandler,
  zoomOutHandler,
  fullScreenHandle,
  downloadGraphImage,
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
            colorSplit: "rgb(200, 200, 200)",
            fontSizeIcon: "24px",
            boxShadowSecondary:
              "0 6px 16px 0 rgba(0, 0, 0, 0.04), 0 3px 6px -4px rgba(0, 0, 0, 0.08), 0 9px 28px 8px rgba(0, 0, 0, 0.01) ",
            colorFillContent: "rgba(100, 100, 100, 0.20)",
          },
          components: {
            FloatButton: {
              fontSize: "24px",
            },
          },
        }}
      >
        <FloatButton.Group
          shape="square"
          style={{
            // right: 94,
            top: "35vh",
            left: 40,
          }}
        >
          <Tooltip
            placement="right"
            title="Zoom In"
            style={{
              fontSize: "14px",
            }}
          >
            <FloatButton
              icon={<ZoomInOutlined className={styles.icon_button} />}
              onClick={() => zoomInHandler()}
            />
          </Tooltip>

          <Tooltip placement="right" title="Reset Zoom">
            <FloatButton
              icon={<SyncOutlined className={styles.icon_button} />}
              onClick={() => zoomResetHandler()}
            />
          </Tooltip>

          <Tooltip placement="right" title="Zoom Out">
            <FloatButton
              icon={<ZoomOutOutlined className={styles.icon_button} />}
              onClick={() => zoomOutHandler()}
            />
          </Tooltip>

          <Tooltip placement="right" title="Full Screen">
            <FloatButton
              icon={
                fullScreenHandle.active ? (
                  <FullscreenExitOutlined className={styles.icon_button} />
                ) : (
                  <FullscreenOutlined className={styles.icon_button} />
                )
              }
              onClick={() => {
                return fullScreenHandle.active
                  ? fullScreenHandle.exit()
                  : fullScreenHandle.enter();
              }}
            />
          </Tooltip>

          <Tooltip placement="right" title="Download Image">
            <FloatButton
              icon={<DownloadOutlined className={styles.icon_button} />}
              onClick={() => downloadGraphImage()}
            />
          </Tooltip>
        </FloatButton.Group>
      </ConfigProvider>
    </div>
  );
};

export default Menu;
