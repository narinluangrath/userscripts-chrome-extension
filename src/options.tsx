import React from "react";
import cx from "classnames";
import { Menu, Button, Input } from "antd";
import {
  ReloadOutlined,
  DownloadOutlined,
  FileDoneOutlined,
} from "@ant-design/icons";
import SyntaxHighlighter from "react-syntax-highlighter";

import { MatchPattern, BEM } from "./utils";
import { useGetStorage, useSetStorage, useUserscriptFiles } from "./hooks";
import { REPO_KEY } from "./constants";
import { Userscript } from "./types";
import style from "./options.module.scss";

const bem = new BEM(style).getter;

export interface LeftProps {
  userscripts: Userscript[];
  openUserscript: Userscript;
  onUserscriptClick: (us: Userscript) => void;
}

export const Left: React.FC<LeftProps> = ({
  userscripts,
  openUserscript,
  onUserscriptClick,
}) => (
  <Menu
    onClick={({ key }) =>
      onUserscriptClick(userscripts.find(({ id }) => id === key))
    }
    selectedKeys={[openUserscript.id]}
  >
    {userscripts.map((us) => (
      <Menu.Item key={us.id}>{us.metadata.name || us.filename}</Menu.Item>
    ))}
  </Menu>
);

export interface CenterProps {
  userscript: Userscript;
}

export const Center: React.FC<CenterProps> = ({ userscript }) =>
  userscript ? (
    <main>
      <SyntaxHighlighter showLineNumbers language="javascript">
        {userscript.script}
      </SyntaxHighlighter>
    </main>
  ) : null;

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
}

export const Right: React.FC<RightProps> = ({ userscript }) => {
  const [value, setValue] = React.useState("");
  const [isMatch, setIsMatch] = React.useState<boolean | null>(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const match =
      userscript && userscript.metadata && userscript.metadata.match;
    if (!match) {
      return;
    }

    const matchPattern = new MatchPattern(match);
    if (matchPattern.isMatch(value)) {
      setIsMatch(true);
    } else {
      setIsMatch(false);
    }
  };

  if (!userscript) {
    return null;
  }

  return (
    <aside>
      <h1>Metadata</h1>
      <table>
        <thead>
          <tr>
            <td>Name</td>
            <td>Value</td>
          </tr>
        </thead>
        <tbody>
          {Object.entries(userscript.metadata).map(([name, value]) => (
            <tr>
              <td>{name}</td>
              <td>{value}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <form onSubmit={handleSubmit}>
        <input value={value} onChange={(e) => setValue(e.target.value)} />
        <button type="submit">Check</button>
        {isMatch !== null && isMatch ? <p>Match</p> : <p>Not Match</p>}
      </form>
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
            userscripts={userscripts}
            openUserscript={openUserscript}
            onUserscriptClick={(us) => setOpenId(us.id)}
          />
          <Center userscript={openUserscript} />
          <Right userscript={openUserscript} />
        </>
      )}
    </div>
  );
};
