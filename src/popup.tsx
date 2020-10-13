import React from "react";
import ReactDOM from "react-dom";

import { BEM } from "./utils";
import { Userscript } from "./types";
import style from "./popup.module.scss";

const bem = new BEM(style).getter;

export interface PopupProps {
  userscripts: Userscript[];
  // isUserscriptEnabled: (us: Userscript) => boolean;
  // toggleUserscript: (us: Userscript) => void;
  // onSettingsClick: () => void;
}

export const Popup: React.FC<PopupProps> = ({
  userscripts,
  // isUserscriptEnabled,
  // toggleUserscript,
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
          {userscripts.map((us) => (
            <tr key={us.id}>
              <td>{us.metadata.name || us.filename}</td>
              <td>
                {/* <button onClick={() => toggleUserscript(us)}>
                  {isUserscriptEnabled(us) ? "On" : "Off"}
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
