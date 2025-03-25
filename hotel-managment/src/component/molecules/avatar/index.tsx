import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import useOpenModal from "../../../help/useOpenModal";
import { toast } from "react-toastify";
import LogoAvatar from "../../../assets/defaultAvatar.jpeg";
import {
  faCaretDown,
  faRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { setFullName } from "../../../redux/signin";
import { useEffect } from "react";
import "./style.css";

export default function AvatarHeader() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { element, isOpen, setIsOpen, elementFather } = useOpenModal(false);
  const { userFullName } = useSelector((state: any) => state.FullName);

  useEffect(() => {
    // Check if user information exists in sessionStorage
    const storedUser = sessionStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      // Dispatch an action to update user information in Redux store if needed
      dispatch(setFullName(user.userName));
    }
  }, [dispatch]);

  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    sessionStorage.removeItem("user");
    navigate("/signin");
    toast.success("Đăng xuất thành công");
  };

  return (
    <div ref={elementFather} className="position-relative">
      <div
        className="d-flex gap-2 align-items-center"
        style={{ cursor: "pointer" }}
        onClick={handleClick}
      >
        <img
          style={{ width: "37px", aspectRatio: 1 }}
          src={LogoAvatar}
          alt="avatar"
        />

        <div className="d-none d-md-block" style={{ color: "#435ebe" }}>
          {userFullName}
          &nbsp;
          <FontAwesomeIcon icon={faCaretDown} />
        </div>
      </div>

      <div
        ref={element}
        className={`custom-dropdown-container rounded shadow end-0 mt-2 p-2 d-flex flex-column ${
          isOpen ? "show" : ""
        }`}
      >
        <span
          className="header-avatar-modal-item rounded"
          onClick={handleLogout}
        >
          <FontAwesomeIcon icon={faRightFromBracket} />
          Đăng xuất
        </span>
      </div>
    </div>
  );
}
