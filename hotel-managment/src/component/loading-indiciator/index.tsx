import "./style.css";

function LoadingIndiciator() {
  return (
    <div className="vw-100 vh-100 fixed-top d-flex align-items-center bg-light bg-opacity-50">
      <div className="loading-indicator"></div>
    </div>
  );
}

export default LoadingIndiciator;
