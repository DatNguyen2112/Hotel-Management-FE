import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";

export default function PageTitle({ title }: { title: string }) {
  const navigate = useNavigate();

  return (
    <div className="d-flex gap-1 align-items-center my-2">
      <div
        style={{ cursor: "pointer" }}
        className="p-2"
        onClick={() => navigate(-1)}
      >
        <FontAwesomeIcon icon={faArrowLeft} />
      </div>
      <h5 className="text-uppercase">{title}</h5>
    </div>
  );
}
