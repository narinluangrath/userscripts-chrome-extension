import React from "react";
import {
  Menu,
  Button,
  Input,
  Table,
  Alert,
  Typography,
  Switch,
  Space,
  Empty,
  Spin,
  Result,
} from "antd";
import {
  ReloadOutlined,
  DownloadOutlined,
  FileDoneOutlined,
  SmileOutlined,
} from "@ant-design/icons";
import SyntaxHighlighter from "react-syntax-highlighter";

import { MatchPattern, BEM } from "./utils";
import { Userscript } from "./types";
import style from "./options.module.scss";

const bem = new BEM(style).getter;

export interface LeftProps {
  className?: string;
  fetching: boolean;
  userscripts?: Userscript[];
  openUserscript?: Userscript;
  onUserscriptClick: (us: Userscript) => void;
}

export const Left: React.FC<LeftProps> = ({
  className,
  fetching,
  userscripts,
  openUserscript,
  onUserscriptClick,
}) => {
  const [search, setSearch] = React.useState("");
  const getName = (us: Userscript) => us.metadata.name || us.filename;
  const filtered = userscripts.filter((us) =>
    getName(us).toLowerCase().startsWith(search.toLowerCase())
  );

  if (!userscripts || !userscripts.length) {
    return <Empty description="No Userscripts!" />;
  }

  return (
    <Space direction="vertical" className={className}>
      <Input.Search
        size="large"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      {fetching ? (
        <Spin tip="Loading..." className={bem("left", "spinner")} />
      ) : (
        <Menu
          onClick={({ key }) =>
            onUserscriptClick(userscripts.find(({ id }) => id === key))
          }
          selectedKeys={[openUserscript && openUserscript.id].filter(Boolean)}
        >
          {filtered.map((us) => (
            <Menu.Item key={us.id}>{getName(us)}</Menu.Item>
          ))}
        </Menu>
      )}
    </Space>
  );
};

export interface CenterProps {
  className?: string;
  gitRepoUrl?: string;
  userscript?: Userscript;
}

export const Center: React.FC<CenterProps> = ({
  className,
  userscript,
  gitRepoUrl,
}) => (
  <main className={className}>
    {userscript ? (
      <SyntaxHighlighter showLineNumbers language="javascript">
        {userscript.script}
      </SyntaxHighlighter>
    ) : (
      <Result
        icon={<SmileOutlined />}
        title={
          gitRepoUrl
            ? "Select a userscript on the left"
            : "Clone a git repo (above) to get started!"
        }
      />
    )}
  </main>
);

export interface TopProps {
  className?: string;
  error?: Error | string;
  gitRepoUrl: string;
  onRefreshClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  fetching: boolean;
  handleGitRepoUrlSubmit: (repo: string) => void;
}

export const Top: React.FC<TopProps> = ({
  className,
  error,
  gitRepoUrl,
  onRefreshClick,
  fetching,
  handleGitRepoUrlSubmit,
}) => {
  const [input, setInput] = React.useState(gitRepoUrl);
  return (
    <div className={bem("top", null, null, className)}>
      <form
        className={bem("top", "form")}
        onSubmit={(e) => {
          e.preventDefault();
          handleGitRepoUrlSubmit(input);
        }}
      >
        <Input
          size="large"
          className={bem("top", "input")}
          prefix={<DownloadOutlined />}
          placeholder="https://github.com/example-url.git"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <Button size="large" htmlType="submit" icon={<FileDoneOutlined />}>
          Clone
        </Button>
        <Button
          type="primary"
          onClick={onRefreshClick}
          icon={<ReloadOutlined />}
          loading={fetching}
          size="large"
        >
          {fetching ? "Fetching" : "Refetch"}
        </Button>
      </form>
      {error && (
        <Alert closable showIcon type="error" message={error.toString()} />
      )}
    </div>
  );
};

export interface RightProps {
  className?: string;
  userscript: Userscript;
  isUserscriptEnabled: boolean;
  setUserscriptEnabled(b: boolean): void;
}

export const Right: React.FC<RightProps> = ({
  className,
  userscript,
  isUserscriptEnabled,
  setUserscriptEnabled,
}) => {
  const [value, setValue] = React.useState("");

  let isMatch = false;
  try {
    const match =
      userscript && userscript.metadata && userscript.metadata.match;
    const matchPattern = match && new MatchPattern(match);
    isMatch = matchPattern && matchPattern.isMatch(value);
  } catch (e) {}

  if (!userscript) {
    return null;
  }

  const columns = [
    {
      key: "property",
      title: "Property",
      render: (_, entry) => entry[0],
    },
    {
      key: "value",
      title: "Value",
      render: (_, entry) => entry[1],
    },
  ];

  return (
    <Space direction="vertical" size="middle" className={className}>
      <div>
        <Typography.Title level={5}>Metadata</Typography.Title>
        <Table
          pagination={false}
          size="small"
          columns={columns}
          dataSource={Object.entries(userscript.metadata)}
        />
      </div>
      <div>
        <Typography.Title level={5}>Test Match Pattern</Typography.Title>
        <Input
          placeholder="https://www.example.com/foo"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <div className={bem("right", "alert")}>
          {value &&
            value.length > 0 &&
            (isMatch ? (
              <Alert showIcon type="success" message="Pattern Matches!" />
            ) : (
              <Alert showIcon type="error" message="Not A Match!" />
            ))}
        </div>
      </div>
      <div>
        <Typography.Title level={5}>Enable/Disable</Typography.Title>
        <Switch
          checked={isUserscriptEnabled}
          onChange={(b) => setUserscriptEnabled(b)}
        />
      </div>
    </Space>
  );
};

export interface OptionsProps {
  setRepoUrl(url: string): void;
  repoUrl?: string;
  repoUrlFetching: boolean;
  userscripts: Userscript[];
  userscriptsRefetch(): void;
  userscriptsFetching: boolean;
  userscriptsError?: Error | string;
  openUserscript?: Userscript;
  onUserscriptClick(us: Userscript): void;
  isOpenUserscriptEnabled?: boolean;
  setIsOpenUserscriptEnabled?(): void;
}

export const Options: React.FC<OptionsProps> = ({
  setRepoUrl,
  repoUrl,
  repoUrlFetching,
  userscripts,
  userscriptsRefetch,
  userscriptsFetching,
  userscriptsError,
  openUserscript,
  onUserscriptClick,
  isOpenUserscriptEnabled,
  setIsOpenUserscriptEnabled,
}) => {
  return (
    <div className={bem("layout")}>
      <Top
        error={userscriptsError}
        gitRepoUrl={repoUrl}
        onRefreshClick={userscriptsRefetch}
        fetching={repoUrlFetching}
        handleGitRepoUrlSubmit={setRepoUrl}
        className={bem("layout", "top")}
      />
      <Left
        fetching={userscriptsFetching}
        openUserscript={openUserscript}
        userscripts={userscripts}
        onUserscriptClick={onUserscriptClick}
        className={bem("layout", "left")}
      />
      <Center
        gitRepoUrl={repoUrl}
        userscript={openUserscript}
        className={bem("layout", "center")}
      />
      <Right
        userscript={openUserscript}
        isUserscriptEnabled={isOpenUserscriptEnabled}
        setUserscriptEnabled={setIsOpenUserscriptEnabled}
        className={bem("layout", "right")}
      />
    </div>
  );
};
