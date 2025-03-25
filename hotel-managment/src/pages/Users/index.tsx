// import ButtonComponent from "../../component/atoms/button";
// import { Link } from "react-router-dom";
// import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowsRotate, faTrash } from "@fortawesome/free-solid-svg-icons";
import {
  Card,
  Table,
  Spinner,
  Button,
  Modal,
  Form,
  Col,
  Row,
} from "react-bootstrap";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import moment from "moment";
import axios from "axios";
import PaginationComponent from "../../component/molecules/pagination";
import { Badge } from "antd";

export default function Users() {
  const callApiPerpage = useRef(10);

  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [listUsers, setListUsers] = useState<any>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [searchValue, setSearchValue] = useState<string>("");
  const [searchCCCD, setSearchCCCD] = useState<string>("");
  // const [sinceDate, setSinceDate] = useState<string>("");
  // const [toDate, setToDate] = useState<string>("");
  const [currentItem, setCurrentItem] = useState<any>(null);
  const [isShowModalDelete, setIsShowModalDelete] = useState<boolean>(false);

  useEffect(() => {
    getListUsers();
  }, [currentPage]);

  const truncate = (str: any, n: number) => {
    return str?.length > n ? str.substr(0, n - 1) + "..." : str;
  };

  const renderFilter = () => {
    const resultArray: any = [];

    if (searchValue) {
      resultArray.push({
        operator: "substring",
        value: searchValue,
        property: "userName",
      });
    }

    if (searchCCCD) {
      resultArray.push({
        operator: "substring",
        value: searchCCCD,
        property: "identityCustomer",
      });
    }

    // if (sinceDate && toDate) {
    //   resultArray.push({
    //     operator: "between",
    //     value: [sinceDate, toDate],
    //     property: "createdAt",
    //   });
    // }

    return JSON.stringify(resultArray);
  };

  const getListUsers = async () => {
    setIsFetching(true);

    const queryParams: any = {
      start: (currentPage - 1) * callApiPerpage.current,
      limit: callApiPerpage.current,
      filter: renderFilter(),
    };

    const getListUsersAPI =
      "http://localhost:8080/api/v1/list-users?" +
      new URLSearchParams(queryParams);

    try {
      const res = await axios.get(getListUsersAPI);
      setListUsers(res.data.data);
      setTotalPage(Math.ceil(res.data.count / callApiPerpage.current));
    } catch (error) {
      toast.error("Lỗi");
    } finally {
      setIsFetching(false);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete("http://localhost:8080/api/v1/delete-user", {
        data: { id: currentItem.id },
      });
      const updateListRoom = [...listUsers];
      updateListRoom.splice(currentItem?.index, 1);
      setListUsers(updateListRoom);
      setIsShowModalDelete(false);
      toast.success("Xoá người dùng thành công");
    } catch {
      toast.error("Lỗi");
    }
  };

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
          Bạn có chắc muốn người dùng có tên là <b>{currentItem?.userName}</b>{" "}
          không?
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleDelete} variant="danger">
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

      <div className="d-flex flex-wrap justify-content-between row-gap-2 py-3">
        <h5 className="text-uppercase">DANH SÁCH NGƯỜI DÙNG</h5>
      </div>

      <Card>
        <Card.Body>
          <div className="mt-2 mb-5">
            <div className="row row-gap-4">
              <div className="col-xxl-4 col-xl-8">
                <Row>
                  <Form.Group as={Col} xs={8}>
                    <Form.Label>Tên khách hàng</Form.Label>
                    <Form.Control
                      value={searchValue}
                      onChange={(e: any) => setSearchValue(e.target.value)}
                      type="text"
                    ></Form.Control>
                  </Form.Group>
                  <Form.Group as={Col} xs={4} className="d-flex flex-column">
                    <Form.Label className="text-white">Tìm kiếm</Form.Label>
                    <div>
                      <Button onClick={getListUsers} variant="success">
                        Tìm kiếm
                      </Button>
                    </div>
                  </Form.Group>
                </Row>

                <Row>
                  <Form.Group as={Col} xs={8}>
                    <Form.Label style={{ marginTop: "10px" }}>
                      CCCD/CMND
                    </Form.Label>
                    <Form.Control
                      value={searchCCCD}
                      onChange={(e: any) => setSearchCCCD(e.target.value)}
                      type="text"
                    ></Form.Control>
                  </Form.Group>
                  <Form.Group as={Col} xs={4} className="d-flex flex-column">
                    <Form.Label
                      style={{ marginTop: "10px" }}
                      className="text-white"
                    >
                      Tìm kiếm
                    </Form.Label>
                    <div>
                      <Button onClick={getListUsers} variant="success">
                        Tìm kiếm
                      </Button>
                    </div>
                  </Form.Group>
                </Row>
              </div>

              {/* <div className="col-xxl-8 col-xl-12">
                <Row>
                  <Form.Group as={Col} xs={3}>
                    <Form.Label>Từ ngày</Form.Label>
                    <Form.Control
                      value={sinceDate}
                      onChange={(e: any) => setSinceDate(e.target.value)}
                      type="date"
                    ></Form.Control>
                  </Form.Group>

                  <Form.Group as={Col} xs={3}>
                    <Form.Label>Đến ngày</Form.Label>
                    <Form.Control
                      value={toDate}
                      onChange={(e: any) => setToDate(e.target.value)}
                      type="date"
                    ></Form.Control>
                  </Form.Group>
                </Row>
              </div> */}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              paddingRight: "20px",
              paddingBottom: "20px",
            }}
          >
            <Button
              onClick={() => {
                getListUsers();
              }}
            >
              <FontAwesomeIcon icon={faArrowsRotate} /> Làm mới
            </Button>
          </div>

          <Table responsive>
            <thead>
              <tr className="text-uppercase">
                <th className="text-center">ID</th>
                <th className="text-center">Tên người dùng</th>
                <th className="text-center">Số điện thoại</th>
                <th className="text-center">Địa chỉ</th>
                <th className="text-center">CCCD</th>
                <th className="text-center">Quốc tịch</th>
                <th className="text-center">Thành phố</th>
                <th className="text-center">Ngày tạo</th>
                <th className="text-center">Trạng thái</th>
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
                  {listUsers.length ? (
                    listUsers.map((item: any, index: number) => (
                      <tr key={index}>
                        <td className="text-center">{item?.id}</td>
                        <td className="text-center">
                          {truncate(item?.userName, 10)}
                        </td>
                        <td className="text-center">{item?.phoneNumber}</td>
                        <td className="text-center">
                          {truncate(item?.addressCustomer, 15)}
                        </td>
                        <td className="text-center">
                          {truncate(item?.identityCustomer, 10)}
                        </td>
                        <td className="text-center">
                          {truncate(item?.cityOfCustomer, 10)}
                        </td>
                        <td className="text-center">
                          {item?.regionOfCustomer}
                        </td>
                        <td className="text-center">
                          {moment(item?.createdAt).format("hh:mm A DD/MM/YYYY")}
                        </td>
                        <td className="text-center">
                          <Badge
                            className="site-badge-count-109"
                            count={"Đang hoạt động"}
                            style={{ backgroundColor: "#52c41a" }}
                          />
                        </td>
                        <td className="text-center">
                          <Button
                            onClick={() => {
                              setIsShowModalDelete(true);
                              setCurrentItem({ index, ...item });
                            }}
                            variant="outline-danger"
                          >
                            <FontAwesomeIcon icon={faTrash} />
                          </Button>
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
