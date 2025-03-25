import LogoHotel from "../../../assets/logo.svg";
import BreadCrumComponent from "../../atoms/breadcrumb";
import AvatarHeader from "../../molecules/avatar";

export default function Header() {
  return (
    <div
      id="header"
      className="d-flex position-relative py-2 px-5 justify-content-between border-bottom shadow"
      style={{ zIndex: 112 }}
    >
      <div className="d-flex align-items-center">
        <img style={{ width: "50px", aspectRatio: 1 }} src={LogoHotel} />
        <b
          className="ms-2 me-5 d-none d-sm-block"
          style={{ fontSize: "1.5rem", color: "#2e6ae6" }}
        ></b>

        <BreadCrumComponent />
      </div>

      <div className="d-flex gap-2 align-items-center">
        <AvatarHeader />
      </div>
    </div>
  );
}
