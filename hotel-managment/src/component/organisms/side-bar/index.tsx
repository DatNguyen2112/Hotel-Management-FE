/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-types */
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router";
import { Button } from "react-bootstrap";
import { optionListRoutes } from "../../../constants";
import RenderSidebarItem from "./side-bar-item";
import "./style.css";

export default function Sidebar({
  hideSidebar,
  setHideSidebar,
}: {
  hideSidebar: boolean;
  setHideSidebar: Function;
}) {
  const navigate = useNavigate();

  const handleNavigate = (to: string) => {
    navigate(`/${to}`);
  };

  const toggleShowSidebar = () => {
    setHideSidebar(!hideSidebar);
  };

  return (
    <div className={`border-end side-bar ${hideSidebar ? "hide-sidebar" : ""}`}>
      <div className="mb-2">
        <Button
          variant="outline-secondary"
          className="float-end"
          onClick={toggleShowSidebar}
        >
          <FontAwesomeIcon icon={faBars} />
        </Button>
      </div>

      <div className="side-bar__items-list">
        <div className="overflow-hidden">
          {optionListRoutes.map((item: any, index: number) => (
            <RenderSidebarItem
              key={index}
              item={item}
              hideSidebar={hideSidebar}
              setHideSidebar={setHideSidebar}
              handleNavigate={handleNavigate}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
