import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { Spinner } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage } from "@fortawesome/free-solid-svg-icons";
import "./style.css";

const CloudinaryUpload = ({
  file,
  setFile,
}: {
  file: any;
  setFile: Function;
}) => {
  const [loading, setLoading] = useState(false);

  const onDrop = async (acceptedFiles: any) => {
    setLoading(true);

    const file = acceptedFiles[0];
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "my_upload_image");

    // Gọi API tải lên của Cloudinary
    const response = await fetch(
      "https://api.cloudinary.com/v1_1/myuploadpic/image/upload",
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await response.json();
    setFile(data.secure_url);
    setLoading(false);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div>
      <div {...getRootProps()} style={dropzoneStyle}>
        <input {...getInputProps()} />
        {isDragActive || file ? (
          loading ? (
            <div
              className="d-flex align-items-center justify-content-center"
              style={{ minHeight: "500px" }}
            >
              <Spinner variant="primary" />
            </div>
          ) : file ? (
            <img
              src={file}
              alt="Uploaded"
              style={{ width: "200px", height: "200px", objectFit: "cover" }}
            />
          ) : (
            <p>No image uploaded</p>
          )
        ) : (
          <div className="upload-file__upload-frame">
            <FontAwesomeIcon icon={faImage} />
            <div
              style={{ fontSize: 15, color: "red", padding: 10 }}
              className="mt-2 text-alert"
            >
              Dung lượng tối đa 3MB
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const dropzoneStyle = {
  width: "200px",
  height: "200px",
  border: "2px dashed #ccc",
  borderRadius: "4px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
};

export default CloudinaryUpload;
