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

export const Center: React.FC<CenterProps> = ({ userScript }) =>
  userScript ? (
    <main>
      <header>{userScript.metadata.name || userScript.filename}</header>
      <code>{userScript.script}</code>
    </main>
  ) : null;

export interface TopProps {
  gitRepoUrl: string;
  onRefreshClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  handleGitRepoUrlSubmit: (repo: string) => void;
}

export const Top: React.FC<TopProps> = ({
  gitRepoUrl,
  onRefreshClick,
  handleGitRepoUrlSubmit,
}) => {
  const [input, setInput] = React.useState(gitRepoUrl);
  return (
    <aside>
      <button onClick={onRefreshClick}>Refetch</button>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleGitRepoUrlSubmit(input);
        }}
      >
        <input value={input} onChange={(e) => setInput(e.target.value)} />
        <button type="submit">Submit</button>
      </form>
    </aside>
  );
};

export interface RightProps {
  userScript: UserScript;
}

export const Right: React.FC<RightProps> = ({ userScript }) =>
  userScript ? (
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
  ) : null;

export const Options: React.FC = () => {
  const { setStorage: setRepoUrl } = useSetStorage();
  const { data: repoUrl, fetching: repoUrlFetching } = useGetStorage(REPO_KEY);
  const {
    userScripts,
    refetch,
    fetching: usFetching,
    error,
  } = useUserScriptFiles(repoUrl);
  const [openId, setOpenId] = React.useState<string>(null);
  const openUserScript = userScripts.find((us) => us.id === openId);

  if (repoUrlFetching) {
    return <p>Loading repo url</p>;
  }

  return (
    <div>
      <Top
        gitRepoUrl={repoUrl}
        onRefreshClick={refetch}
        handleGitRepoUrlSubmit={(repo) => setRepoUrl(REPO_KEY, repo)}
      />
      {usFetching ? (
        <p>Fetching user scripts...</p>
      ) : (
        <>
          <Left
            userScripts={userScripts}
            isUserScriptOpen={(us) => us.id === openId}
            onUserScriptClick={(us) => setOpenId(us.id)}
          />
          <Center userScript={openUserScript} />
          <Right userScript={openUserScript} />
        </>
      )}
    </div>
  );
};
