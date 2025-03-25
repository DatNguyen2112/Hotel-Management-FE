import axios from "axios";
import { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { toast } from "react-toastify";

export default function ModalCreateOrEditService({
  isEdit,
  show,
  setShow,
  packageData,
  listServices,
  setListServices,
}: {
  isEdit: boolean;
  show: boolean;
  setShow: Function;
  packageData: any;
  listServices: any;
  setListServices: Function;
}) {
  const [nameService, setNameService] = useState<string>("");

  useEffect(() => {
    setNameService(packageData?.name);
  }, [packageData]);

  const onSave = async () => {
    try {
      let res;
      if (isEdit) {
        res = await axios.put("http://localhost:8080/api/v1/create-service", {
          id: packageData.id,
          name: nameService,
        });
      } else {
        res = await axios.post("http://localhost:8080/api/v1/create-service", {
          name: nameService,
        });
      }

      setListServices([...listServices, res.data]);
      toast.success("Thành công");
      setShow(false);
    } catch (error) {
      toast.error("Lỗi");
    }
  };

  return (
    <div>
      <Modal show={show} onHide={() => setShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {isEdit ? "Chỉnh sửa dịch vụ" : "Thêm dịch vụ mới"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Tên dịch vụ</Form.Label>
            <Form.Control
              value={nameService}
              onChange={(e: any) => setNameService(e.target.value)}
              type="text"
            ></Form.Control>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={onSave}>
            Xác nhận
          </Button>
          <Button variant="secondary" onClick={() => setShow(false)}>
            Đóng
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
