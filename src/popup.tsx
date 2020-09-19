import React from "react";
import ReactDOM from "react-dom";

import { POPUP_ID } from "./constants";
import { useIsPopupOpen } from "./state";
import { BEM } from "./utils";
import { css } from "./css";
import style from "./popup.module.scss";

const bem = new BEM(style).getter;

export const Popup: React.FC = () => {
  return (
    <div>
      <style>{css}</style>
      <div id={POPUP_ID}>
        <div className={bem("popup", null, [], "rbl-panel")}>
          <h1 className="rbl-header-3">User Scripts &nbsp;📝</h1>
        </div>
      </div>
    </div>
  );
};

const PopupWrapper: React.FC = () => {
  const isOpen = useIsPopupOpen();
  return isOpen ? <Popup /> : null;
};

// ReactDOM.render(<PopupWrapper />, document.body);
