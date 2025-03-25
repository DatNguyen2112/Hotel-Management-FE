import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function RenderSidebarItem({
  item,
  hideSidebar,
  setHideSidebar,
  handleNavigate,
}: {
  item: any;
  hideSidebar: boolean;
  setHideSidebar: Function;
  handleNavigate: Function;
}) {
  const onClickSidebarItem = () => {
    if (item.to) {
      handleNavigate(item.to);
    } else {
      setHideSidebar(false);
    }
  };

  const checkParentSelected = (to: string) => {
    if (location.pathname.split("/")[1] === to) {
      return "selected";
    } else if (
      item.children?.find(
        (obj: any) => location.pathname.split("/")[1] === obj.to
      )
    ) {
      return "selected";
    } else {
      return "";
    }
  };

  //   const checkChildSelected = (to: string) => {
  //     if (location.pathname.split("/")[1] === to) {
  //       return "selected";
  //     } else {
  //       return "";
  //     }
  //   };

  return (
    <div className={`side-bar__item`}>
      <div
        className={`side-bar__item__main rounded ${checkParentSelected(
          item.to
        )} ${!hideSidebar ? "big-padding" : ""}`}
        onClick={onClickSidebarItem}
      >
        <div className="side-bar__icon">
          <FontAwesomeIcon icon={item.icon} className="fa-lg" />
        </div>

        <span className="side-bar__text">{item.name}&nbsp;</span>
      </div>
    </div>
  );
}
