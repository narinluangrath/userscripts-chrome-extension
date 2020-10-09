import React from "react";
import cx from "classnames";

import { useGetStorage, useSetStorage, useUserScriptFiles } from "./hooks";
import { REPO_KEY } from "./constants";
import { UserScript } from "./types";
import style from "./options.module.scss";

export interface LeftProps {
  userScripts: UserScript[];
  isUserScriptOpen: (us: UserScript) => boolean;
  onUserScriptClick: (us: UserScript) => void;
}

export const Left: React.FC<LeftProps> = ({
  userScripts,
  isUserScriptOpen,
  onUserScriptClick,
}) => (
  <aside>
    <nav>
      <ul>
        {userScripts.map((us) => (
          <li
            key={us.id}
            onClick={() => onUserScriptClick(us)}
            className={cx(
              style.scriptName,
              isUserScriptOpen(us) && style.isOpen
            )}
          >
            <code>{us.metadata.name || us.filename}</code>
            <small>{us.metadata.version}</small>
          </li>
        ))}
      </ul>
    </nav>
  </aside>
);

export interface CenterProps {
  userScript: UserScript;
}

export const Center: React.FC<CenterProps> = ({ userScript }) => (
  <main>
    <header>{userScript.metadata.name || userScript.filename}</header>
    <code>{userScript.script}</code>
  </main>
);

export interface TopProps {
  gitRepoUrl: string;
  onRefreshClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  handleGitRepoUrlSubmit: (repo: string) => void;
}

export const Top: React.FC<TopProps> = ({
  gitRepoUrl,
  onRefreshClick,
  handleGitRepoUrlSubmit,
}) => (
  <aside>
    <button onClick={onRefreshClick}>Refetch</button>
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const form = new FormData(e.currentTarget);
        const repo = form.get("repo") as string;
        handleGitRepoUrlSubmit(repo);
      }}
    >
      <input value={gitRepoUrl} name="repo" />
      <button type="submit">Submit</button>
    </form>
  </aside>
);

export interface RightProps {
  userScript: UserScript;
}

export const Right: React.FC<RightProps> = ({ userScript }) => (
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
        {Object.entries(userScript.metadata).map(([name, value]) => (
          <tr>
            <td>{name}</td>
            <td>{value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </aside>
);

const Options: React.FC = () => {
  const { setStorage, fetching: setFetching } = useSetStorage();
  const { data, fetching: getFetching } = useGetStorage(REPO_KEY);
  const {
    userScripts,
    refetch,
    fetching: usFetching,
    error,
  } = useUserScriptFiles(data);
  const [openId, setOpenId] = React.useState<string>(null);
  const openUserScript = userScripts.find((us) => us.id === openId);

  return (
    <div>
      <Top
        gitRepoUrl={data}
        onRefreshClick={refetch}
        handleGitRepoUrlSubmit={(repo) => setStorage(REPO_KEY, repo)}
      />
      <Left
        userScripts={userScripts}
        isUserScriptOpen={(us) => us.id === openId}
        onUserScriptClick={(us) => setOpenId(us.id)}
      />
      <Center userScript={openUserScript} />
      <Right userScript={openUserScript} />
    </div>
  );
};
