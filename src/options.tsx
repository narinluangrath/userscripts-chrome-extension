import React from "react";
import cx from "classnames";

import { MatchPattern } from "./utils";
import { useGetStorage, useSetStorage, useUserscriptFiles } from "./hooks";
import { REPO_KEY } from "./constants";
import { Userscript } from "./types";
import style from "./options.module.scss";

export interface LeftProps {
  userscripts: Userscript[];
  isUserscriptOpen: (us: Userscript) => boolean;
  onUserscriptClick: (us: Userscript) => void;
}

export const Left: React.FC<LeftProps> = ({
  userscripts,
  isUserscriptOpen,
  onUserscriptClick,
}) => (
  <aside>
    <nav>
      <ul>
        {userscripts.map((us) => (
          <li
            key={us.id}
            onClick={() => onUserscriptClick(us)}
            className={cx(
              style.scriptName,
              isUserscriptOpen(us) && style.isOpen
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
  userscript: Userscript;
}

export const Center: React.FC<CenterProps> = ({ userscript }) =>
  userscript ? (
    <main>
      <header>{userscript.metadata.name || userscript.filename}</header>
      <code>{userscript.script}</code>
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
  const openUserScript = userscripts.find((us) => us.id === openId);

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
            userscripts={userscripts}
            isUserscriptOpen={(us) => us.id === openId}
            onUserscriptClick={(us) => setOpenId(us.id)}
          />
          <Center userscript={openUserScript} />
          <Right userscript={openUserScript} />
        </>
      )}
    </div>
  );
};
