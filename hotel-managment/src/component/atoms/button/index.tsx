import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./style.css";

export default function ButtonComponent({
  label,
  icon,
  className = "",
  style = {},
  onClick = () => {},
  type = "button",
}: {
  label: string;
  icon: any;
  className?: string;
  style?: object;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  type?: any;
}) {
  return (
    <button
      type={type}
      style={style}
      className={`button ${className}`}
      onClick={onClick}
    >
      <div className="button__content">
        <FontAwesomeIcon icon={icon} color="orange" />
        <span className="button__label">{label}</span>
      </div>
    </button>
  );
}
