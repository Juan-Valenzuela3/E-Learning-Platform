import React, { useState } from "react";
import { SidebarContext } from "./SidebarContext";

const SidebarProvider = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const value = {
    isCollapsed,
    toggleCollapse,
    setIsCollapsed,
  };

  return (
    <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>
  );
};

export { SidebarProvider };
