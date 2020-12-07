import React from "react";
import { Button, Spin, Empty, Table, Typography, Switch } from "antd";
import { SettingTwoTone } from "@ant-design/icons";
import "antd/dist/antd.css";

import { Userscript } from "./types";
import { BEM } from "./utils";
import style from "./popup.module.scss";

const bem = new BEM(style).getter;

export interface PopupProps {
  fetching: boolean;
  userscripts: Userscript[];
  isUserscriptEnabled: (us: Userscript) => boolean;
  toggleUserscript: (us: Userscript) => void;
  onSettingsClick: () => void;
}

export const Popup: React.FC<PopupProps> = ({
  fetching,
  userscripts,
  isUserscriptEnabled,
  toggleUserscript,
  onSettingsClick,
}) => {
  const columns = [
    {
      title: "Script Name",
      dataIndex: ["metadata", "name"],
      key: "name",
    },
    {
      title: "Version",
      dataIndex: ["metadata", "version"],
      key: "version",
    },
    {
      title: "Enabled",
      key: "enabled",
      render: (_, us: Userscript) => (
        <Switch
          onClick={() => toggleUserscript(us)}
          checked={isUserscriptEnabled(us)}
        />
      ),
    },
  ];

  return (
    <div className={bem("popup")}>
      <Typography.Title level={3}>Userscripts</Typography.Title>
      <Button
        onClick={onSettingsClick}
        shape="round"
        icon={<SettingTwoTone />}
        className={bem("popup", "settings")}
      />
      {fetching ? (
        <Spin
          size="large"
          tip="Loading..."
          className={bem("popup", "spinner")}
        />
      ) : userscripts.length < 1 ? (
        <Empty description="No userscripts match current URL" />
      ) : (
        <Table
          size="small"
          // @ts-ignore
          pagination={userscripts.length > 5}
          columns={columns}
          dataSource={userscripts}
        />
      )}
    </div>
  );
};
