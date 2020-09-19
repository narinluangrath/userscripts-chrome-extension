import React from "react";

import { ICON_CLICK } from "./constants";

export function useIsPopupOpen(): boolean {
  const [isOpen, setIsOpen] = React.useState(true);
  React.useEffect(() => {
    const handleMessage = (request, sender) => {
      const isIconClick = !sender.tab && request.type === ICON_CLICK;
      isIconClick && setIsOpen((b) => !b);
    };
    chrome.runtime.onMessage.addListener(handleMessage);
  }, []);

  return isOpen;
}
