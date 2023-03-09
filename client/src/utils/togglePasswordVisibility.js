import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const usePasswordToggle = () => {
  const [visible, setVisible] = useState(false);

  const icon = <FontAwesomeIcon 
                icon={visible ? "eye" : "eye-slash"}
                onClick={() => setVisible(!visible)}
                 />;

  const inputType = visible ? "text" : "password";

  return [inputType, icon];
};