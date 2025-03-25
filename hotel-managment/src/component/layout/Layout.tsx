/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import Header from "../organisms/header";
import "../layout/style.css";
import Sidebar from "../organisms/side-bar";

export default function Layout({ children }: { children: any }) {
  const [hideSidebar, setHideSidebar] = useState<boolean>(false);

  return (
    <div className="layout">
      <Header />
      <div className="layout__sidebar-and-content">
        <Sidebar hideSidebar={hideSidebar} setHideSidebar={setHideSidebar} />
        <div
          className={`menu-dropshadow ${hideSidebar ? "" : "show"}`}
          onClick={() => setHideSidebar(true)}
        />
        <div className="content-container overflow-auto w-100 p-3">
          {children}
        </div>
      </div>
    </div>
  );
}
