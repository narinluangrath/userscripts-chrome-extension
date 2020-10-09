import React from "react";
import ReactDOM from "react-dom";

import { Popup } from "./popup";

const Wrapper: React.FC = () => {
  const props = { userScripts: [] };
  return <Popup {...props} />;
};

ReactDOM.render(<Wrapper />, document.getElementById("root"));
