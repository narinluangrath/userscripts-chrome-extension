import React from "react";
import ReactDOM from "react-dom";

import { BEM } from "./utils";
import { UserScript } from "./types";
import style from "./popup.module.scss";

const bem = new BEM(style).getter;

export interface PopupProps {
  userScripts: UserScript[];
  // isUserScriptEnabled: (us: UserScript) => boolean;
  // toggleUserScript: (us: UserScript) => void;
  // onSettingsClick: () => void;
}

export const Popup: React.FC<PopupProps> = ({
  userScripts,
  // isUserScriptEnabled,
  // toggleUserScript,
  // onSettingsClick,
}) => {
  return (
    <div>
      <h1>User Scripts</h1>
      <table>
        <thead className={style.visuallyHidden}>
          <tr>
            <th>Script Name</th>
            <th>Enabled</th>
          </tr>
        </thead>
        <tbody>
          {userScripts.map((us) => (
            <tr key={us.id}>
              <td>{us.metadata.name || us.filename}</td>
              <td>
                {/* <button onClick={() => toggleUserScript(us)}>
                  {isUserScriptEnabled(us) ? "On" : "Off"}
                </button> */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* <div>
        <button onClick={onSettingsClick}>⚙️</button>
      </div> */}
    </div>
  );
};
