import { faPlus, faTrash, faPencil } from "@fortawesome/free-solid-svg-icons";
import ButtonComponent from "../../component/atoms/button";
import {
  Card,
  Table,
  Spinner,
  Button,
  Modal,
  Row,
  Col,
  Form,
} from "react-bootstrap";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import moment from "moment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toast } from "react-toastify";
import PaginationComponent from "../../component/molecules/pagination";
import ModalCreateOrEditService from "./modal-create-or-edit-service";

export default function ListService() {
  const callApiPerpage = useRef(10);

  const [isFetching, setIsFetching] = useState(true);
  const [listServices, setListServices] = useState<any>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [currentItem, setCurrentItem] = useState<any>(null);
  const [isShowModalDelete, setIsShowModalDelete] = useState<boolean>(false);
  const [searchValue, setSearchValue] = useState<any>("");
  const [isShowModalCreateOrEditService, setIsShowModalCreateOrEditService] =
    useState<boolean>(false);

  useEffect(() => {
    getListServices();
  }, [currentPage]);

  const renderFilter = () => {
    const resultArray: any = [];

    if (searchValue) {
      resultArray.push({
        operator: "substring",
        value: searchValue,
        property: "name",
      });
    }

    return JSON.stringify(resultArray);
  };

  const queryParams: any = {
    start: (currentPage - 1) * callApiPerpage.current,
    limit: callApiPerpage.current,
    filter: renderFilter(),
  };

  const getListServicesAPI =
    "http://localhost:8080/api/v1/list-services?" +
    new URLSearchParams(queryParams);

  const getListServices = async () => {
    setIsFetching(true);
    try {
      const response: any = await axios.get(getListServicesAPI);
      setListServices(response.data.data);
      setTotalPage(Math.ceil(response.data.count / callApiPerpage.current));
    } catch (error) {
      toast.error("Lỗi");
    } finally {
      setIsFetching(false);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete("http://localhost:8080/api/v1/delete-service", {
        data: { id: currentItem.id },
      });
      const updateListServices = [...listServices];
      console.log(updateListServices);
      updateListServices.splice(currentItem?.index, 1);
      setListServices(updateListServices);
      setIsShowModalDelete(false);
      toast.success("Xoá dịch vụ thành công");
    } catch {
      toast.error("Lỗi");
    }
  };

  //   const handleAfterCreateOrEdit = (item: any) => {
  //     if (!currentItem) {
  //       listServices.unshift(item);
  //     } else {
  //       const newArr = [...listServices];
  //       newArr.splice(currentItem.index, 1, item);
  //       setListServices(newArr);
  //     }

  //     setIsShowModalCreateOrEditService(false);
  //   };

  //   console.log(listServices);

  return (
    <div>
      <Modal
        show={isShowModalDelete}
        onHide={() => setIsShowModalDelete(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Xác nhận</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Bạn có chắc muốn xóa dịch vụ <b>{currentItem?.name}</b> không?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleDelete}>
            Xác nhận
          </Button>
          <Button
            variant="secondary"
            onClick={() => setIsShowModalDelete(false)}
          >
            Đóng
          </Button>
        </Modal.Footer>
      </Modal>

      {isShowModalCreateOrEditService && (
        <ModalCreateOrEditService
          isEdit={currentItem ? true : false}
          show={isShowModalCreateOrEditService}
          setShow={setIsShowModalCreateOrEditService}
          packageData={currentItem}
          listServices={listServices}
          setListServices={setListServices}
        />
      )}

      <div className="d-flex flex-wrap justify-content-between row-gap-2 py-3">
        <h5 className="text-uppercase">DANH SÁCH DỊCH VỤ</h5>

        <ButtonComponent
          icon={faPlus}
          label="thêm dịch vụ"
          onClick={() => {
            setIsShowModalCreateOrEditService(true);
            setCurrentItem(null);
          }}
        />
      </div>

      <Card>
        <Card.Body>
          <div className="mt-2 mb-5">
            <div className="row row-gap-4">
              <div className="col-xxl-4 col-xl-8">
                <Row>
                  <Form.Group as={Col} xs={8}>
                    <Form.Label>Tên dịch vụ</Form.Label>
                    <Form.Control
                      value={searchValue}
                      onChange={(e: any) => setSearchValue(e.target.value)}
                      type="text"
                    ></Form.Control>
                  </Form.Group>
                  <Form.Group as={Col} xs={4} className="d-flex flex-column">
                    <Form.Label className="text-white">Tìm kiếm</Form.Label>
                    <div>
                      <Button onClick={getListServices} variant="success">
                        Tìm kiếm
                      </Button>
                    </div>
                  </Form.Group>
                </Row>
              </div>
            </div>
          </div>

          <Table responsive>
            <thead>
              <tr>
                <th className="text-center">ID</th>
                <th className="text-center">Tên dịch vụ</th>
                <th className="text-center">Ngày tạo</th>
                <th className="text-center">Hoạt động</th>
              </tr>
            </thead>

            <tbody>
              {isFetching ? (
                <tr>
                  <td colSpan={12} className="text-center py-5">
                    <Spinner variant="primary" />
                  </td>
                </tr>
              ) : (
                <>
                  {listServices.length ? (
                    listServices.map((item: any, index: number) => (
                      <tr key={index}>
                        <td className="text-center">{item?.id}</td>
                        <td className="text-center">{item?.name}</td>

                        <td className="text-center">
                          {moment(item?.createdAt).format("hh:mm A DD/MM/YYYY")}
                        </td>

                        <td className="text-center">
                          <div className="d-flex gap-2">
                            <Button
                              onClick={() => {
                                setIsShowModalDelete(true);
                                setCurrentItem({ index, ...item });
                              }}
                              variant="outline-danger"
                            >
                              <FontAwesomeIcon icon={faTrash} />
                            </Button>

                            <Button
                              onClick={() => {
                                setCurrentItem({
                                  index,
                                  ...item,
                                });
                                setIsShowModalCreateOrEditService(true);
                              }}
                              variant="outline-primary"
                            >
                              <FontAwesomeIcon icon={faPencil} />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <td colSpan={8} className="text-center py-5">
                      Không có dữ liệu
                    </td>
                  )}
                </>
              )}
            </tbody>
          </Table>

          <PaginationComponent
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPage={totalPage}
          />
        </Card.Body>
      </Card>
    </div>
  );
}
