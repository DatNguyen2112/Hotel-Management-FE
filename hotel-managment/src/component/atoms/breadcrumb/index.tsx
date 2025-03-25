import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { optionListRoutes } from "../../../constants";
import { Breadcrumb } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome } from "@fortawesome/free-solid-svg-icons";
import _ from "lodash";
import "./style.css";

export default function BreadCrumComponent() {
  const navigate = useNavigate();
  const location = useLocation();

  const [breadcrumbData, setBreadcrumbData] = useState([
    { label: "Quản trị chung", type: "partition" },
  ]);
  const [dataPage, setDataPage] = useState<any>({});

  useEffect(() => {
    handleChangePage();
  }, [location.pathname]);

  useEffect(() => {
    if (!_.isEmpty(dataPage)) {
      setBreadcrumbData([dataPage]);
    }
  }, [dataPage]);

  console.log(location.pathname);

  console.log(breadcrumbData, "breadcrum");

  const handleChangePage = () => {
    const pathName = location.pathname.split("/")[1];
    console.log(pathName);
    let result = "";

    const foundObject: any = optionListRoutes.find(
      (item: any) => item.to === pathName
    );

    console.log(optionListRoutes);
    console.log(foundObject);

    if (foundObject) {
      if (foundObject.chidren) {
        result =
          foundObject.children.find((obj: any) => obj.to === pathName)?.name ||
          "";
      } else {
        result = foundObject.name;
      }
    }

    setDataPage({ label: result, type: "page" });
  };

  return (
    <Breadcrumb className="breadcrumb-component d-none d-md-inline-block">
      <Breadcrumb.Item onClick={() => navigate("/users")}>
        <FontAwesomeIcon icon={faHome} />
      </Breadcrumb.Item>

      {!!breadcrumbData.length &&
        breadcrumbData.map((item: any, index: number) => (
          <Breadcrumb.Item active={index === breadcrumbData.length} key={index}>
            {item.label}
          </Breadcrumb.Item>
        ))}
    </Breadcrumb>
  );
}
