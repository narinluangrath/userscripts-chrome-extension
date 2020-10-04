import React from "react";
import cx from "classnames";

import { UserScript } from "./types";
import style from "./options.module.scss";

export interface LeftRailProps {
  userScripts: UserScript[];
  isUserScriptOpen: (us: UserScript) => boolean;
  onUserScriptClick: (us: UserScript) => void;
}

export const LeftRail: React.FC<LeftRailProps> = ({
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

export interface MainProps {
  userScript: UserScript;
}

export const Main: React.FC<MainProps> = ({ userScript }) => (
  <main>
    <header>{userScript.metadata.name || userScript.filename}</header>
    <code>{userScript.script}</code>
  </main>
);

export interface TopProps {
  gitRepoUrl: string;
  onRefreshClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  handleGitRepoUrlSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export const Top: React.FC<TopProps> = ({
  gitRepoUrl,
  onRefreshClick,
  handleGitRepoUrlSubmit,
}) => (
  <aside>
    <button onClick={onRefreshClick}>Refetch</button>
    <form onSubmit={handleGitRepoUrlSubmit}>
      <input value={gitRepoUrl} />
      <button type="submit">Submit</button>
    </form>
  </aside>
);

export interface RightRailProps {
  userScript: UserScript;
  isDisabledGlobally: boolean;
  toggleDisabledGlobally: () => void;
  disabledDomains: string[];
  removeDisabledDomain: (domain: string) => void;
}

export const RightRail: React.FC<RightRailProps> = ({
  userScript,
  isDisabledGlobally,
  toggleDisabledGlobally,
  disabledDomains,
  removeDisabledDomain,
}) => (
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
    <div>
      <button onClick={toggleDisabledGlobally}>
        {isDisabledGlobally
          ? "Globally OFF"
          : "On (Unless visiting disabled domain)"}
      </button>
      <h2>Disabled Domains</h2>
      <ul>
        {disabledDomains.map((domain) => (
          <li>
            <span>{domain}</span>
            <button onClick={() => removeDisabledDomain(domain)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  </aside>
);
