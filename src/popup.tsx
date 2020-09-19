import React from "react";
import ReactDOM from "react-dom";

import { POPUP_ID } from "./constants";
import { isPopupOpen } from "./state";
import { BEM } from "./bem";
import style from "./popup.module.scss";

const bem = new BEM(style);

/** The actual rendered popup */
export const Popup: React.FC = () => <div className={bem.get("popup")}></div>;

ReactDOM.render(<Popup />, document.body);
