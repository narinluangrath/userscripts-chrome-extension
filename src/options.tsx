import React from "react";
import {
  Menu,
  Button,
  Input,
  Descriptions,
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
import { useGetStorage, useSetStorage, useUserscriptFiles } from "./hooks";
import { REPO_KEY } from "./constants";
import { Userscript } from "./types";
import style from "./options.module.scss";

const bem = new BEM(style).getter;

export interface LeftProps {
  fetching: boolean;
  userscripts?: Userscript[];
  openUserscript?: Userscript;
  onUserscriptClick: (us: Userscript) => void;
}

export const Left: React.FC<LeftProps> = ({
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
    <Space direction="vertical">
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
  userscript?: Userscript;
}

export const Center: React.FC<CenterProps> = ({ userscript }) =>
  userscript ? (
    <main>
      <SyntaxHighlighter showLineNumbers language="javascript">
        {userscript.script}
      </SyntaxHighlighter>
    </main>
  ) : (
    <Result
      icon={<SmileOutlined />}
      title="Select a userscript to get started!"
    />
  );

export interface TopProps {
  gitRepoUrl: string;
  onRefreshClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  fetching: boolean;
  handleGitRepoUrlSubmit: (repo: string) => void;
}

export const Top: React.FC<TopProps> = ({
  gitRepoUrl,
  onRefreshClick,
  fetching,
  handleGitRepoUrlSubmit,
}) => {
  const [input, setInput] = React.useState(gitRepoUrl);
  return (
    <div className={bem("top")}>
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
      </form>
      <Button
        type="primary"
        onClick={onRefreshClick}
        icon={<ReloadOutlined />}
        loading={fetching}
      >
        {fetching ? "Fetching" : "Refetch"}
      </Button>
    </div>
  );
};

export interface RightProps {
  userscript: Userscript;
  isUserscriptEnabled: boolean;
  setUserscriptEnabled(b: boolean): void;
}

export const Right: React.FC<RightProps> = ({
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

  return (
    <aside>
      <Descriptions bordered title="Metadata" size="small">
        {Object.entries(userscript.metadata).map(([name, value]) => (
          <Descriptions.Item label={name}>{value}</Descriptions.Item>
        ))}
      </Descriptions>
      <Typography.Title className={bem("right", "match")} level={5}>
        Test Match Pattern
      </Typography.Title>
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
      <Typography.Title className={bem("right", "match")} level={5}>
        Enable/Disable
      </Typography.Title>
      <Switch
        checked={isUserscriptEnabled}
        onChange={(b) => setUserscriptEnabled(b)}
      />
    </aside>
  );
};

export const Options: React.FC = () => {
  const { setStorage: setRepoUrl } = useSetStorage();
  const { data: repoUrl, fetching: repoUrlFetching } = useGetStorage(REPO_KEY);
  const {
    userscripts,
    refetch,
    fetching: usFetching,
    error,
  } = useUserscriptFiles(repoUrl);
  const [openId, setOpenId] = React.useState<string>(null);
  const openUserscript = userscripts.find((us) => us.id === openId);

  if (repoUrlFetching) {
    return <p>Loading repo url</p>;
  }

  return (
    <div>
      <Top
        fetching={false}
        gitRepoUrl={repoUrl}
        onRefreshClick={refetch}
        handleGitRepoUrlSubmit={(repo) => setRepoUrl(REPO_KEY, repo)}
      />
      {usFetching ? (
        <p>Fetching user scripts...</p>
      ) : (
        <>
          <Left
            fetching={false}
            userscripts={userscripts}
            openUserscript={openUserscript}
            onUserscriptClick={(us) => setOpenId(us.id)}
          />
          <Center userscript={openUserscript} />
          <Right
            userscript={openUserscript}
            isUserscriptEnabled={false}
            setUserscriptEnabled={() => undefined}
          />
        </>
      )}
    </div>
  );
};
