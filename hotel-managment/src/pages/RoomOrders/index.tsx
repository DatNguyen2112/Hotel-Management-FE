/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { useState, useEffect, useRef } from "react";
import { Card, Table, Spinner, Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateRangePicker } from "@mui/x-date-pickers-pro/DateRangePicker";
import { Col, Form, Row, Button } from "react-bootstrap";
import moment from "moment";
import ButtonComponent from "../../component/atoms/button";
import { handleExportExcel } from "../../constants";
import {
  faArrowsRotate,
  faPlus,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { Badge } from "antd";
import PaginationComponent from "../../component/molecules/pagination";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function RoomOrdersList() {
  const callApiPerpage = useRef(10);

  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [orderRoomsList, setOrderRoomsList] = useState<any>([]);
  const [filterDateRange, setFilterDateRange] = useState<any>([null, null]);
  const [searchValue, setSearchValue] = useState<any>("");
  const [filterPhoneNumber, setFilterPhoneNumber] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  // const [filterByMonth, setFilterByMonth] = useState<string>("");
  const [isShowModalDelete, setIsShowModalDelete] = useState<boolean>(false);
  const [currentItem, setCurrentItem] = useState<any>(null);

  useEffect(() => {
    handleGetOrderRooms();
  }, [currentPage, filterDateRange[0], filterDateRange[1]]);

  const renderFilterArr = () => {
    const resultArr: any = [];

    if (filterDateRange[0]) {
      resultArr.push({
        operator: "eq",
        value: filterDateRange[0],
        property: "checkIn",
      });
    }

    if (filterDateRange[1]) {
      resultArr.push({
        operator: "eq",
        value: filterDateRange[1],
        property: "checkOut",
      });
    }

    if (searchValue) {
      resultArr.push({
        operator: "substring",
        value: searchValue,
        property: "customerName",
      });
    }

    if (filterPhoneNumber) {
      resultArr.push({
        operator: "eq",
        value: filterPhoneNumber,
        property: "phoneNumber",
      });
    }

    return JSON.stringify(resultArr);
  };

  const handleGetOrderRooms = async () => {
    setIsFetching(true);

    const queryParams: any = {
      start: (currentPage - 1) * callApiPerpage.current,
      limit: callApiPerpage.current,
      filter: renderFilterArr(),
    };

    const getListOrderRoomsAPI =
      "http://localhost:8080/api/v1/list-orders?" +
      new URLSearchParams(queryParams);

    try {
      const res = await axios.get(getListOrderRoomsAPI);
      setOrderRoomsList(res.data.data);
      setTotalPage(Math.ceil(res.data.count / callApiPerpage.current));
    } catch (error) {
      toast.error("Lỗi");
    } finally {
      setIsFetching(false);
    }
  };

  const handleClear = () => {
    setSearchValue("");
    handleGetOrderRooms();
    setFilterDateRange([null, null]);
    setFilterPhoneNumber("");
  };

  const handleExport = () => {
    const fileName = "OrderRooms";
    handleExportExcel(
      fileName,
      renderFilterArr(),
      "http://localhost:8080/api/v1/export-rooms-orders-excel"
    );
  };

  const handleDelete = async () => {
    try {
      await axios.delete("http://localhost:8080/api/v1/delete-order", {
        data: { id: currentItem.id },
      });
      const updateListRoom = [...orderRoomsList];
      console.log(updateListRoom);
      updateListRoom.splice(currentItem?.index, 1);
      setOrderRoomsList(updateListRoom);
      setIsShowModalDelete(false);
      toast.success("Xoá đơn đặt phòng thành công");
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
          Bạn có chắc muốn xóa đơn đặt phòng số <b>{currentItem?.id}</b> không?
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

      <div className="d-flex flex-wrap justify-content-between row-gap-2 py-3">
        <h5 className="text-uppercase">DANH SÁCH ĐƠN ĐẶT PHÒNG</h5>

        <div style={{ display: "flex", gap: "10px" }}>
          <ButtonComponent
            onClick={handleExport}
            icon={faPlus}
            label="export excel"
          />
        </div>
      </div>

      <Card>
        <Card.Body>
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
                  <Button onClick={handleGetOrderRooms} variant="success">
                    Tìm kiếm
                  </Button>
                </div>
              </Form.Group>

              <Form.Group as={Col} xs={8}>
                <Form.Label style={{ marginTop: "10px" }}>
                  Số điện thoại
                </Form.Label>
                <Form.Control
                  value={filterPhoneNumber}
                  onChange={(e: any) => setFilterPhoneNumber(e.target.value)}
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
                  <Button onClick={handleGetOrderRooms} variant="success">
                    Tìm kiếm
                  </Button>
                </div>
              </Form.Group>

              <div style={{ marginTop: "10px" }}>
                <span>Lọc theo ngày đặt</span>
                <div style={{ marginTop: "10px" }}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateRangePicker
                      localeText={{ start: "Check-in", end: "Check-out" }}
                      value={filterDateRange}
                      onChange={(newValue: any) => setFilterDateRange(newValue)}
                    />
                  </LocalizationProvider>
                </div>
              </div>

              <Col>
                <Form.Group>
                  <Form.Label className="text-white">lọc</Form.Label>
                  <div className="d-flex gap-2">
                    <Button
                      style={{ minWidth: 80 }}
                      onClick={handleGetOrderRooms}
                    >
                      Lọc
                    </Button>
                    <Button
                      style={{ minWidth: 80 }}
                      onClick={handleClear}
                      variant="secondary"
                    >
                      Bỏ lọc
                    </Button>
                  </div>
                </Form.Group>
              </Col>
            </Row>
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
                handleGetOrderRooms();
              }}
            >
              <FontAwesomeIcon icon={faArrowsRotate} /> Làm mới
            </Button>
          </div>

          <Table responsive>
            <thead>
              <tr>
                <th className="text-center">ID</th>
                <th className="text-center">Tên khách hàng</th>
                <th className="text-center">Số điện thoại</th>
                <th className="text-center">Số lượng phòng</th>
                <th className="text-center">Check in</th>
                <th className="text-center">Check out</th>
                <th className="text-center">Tổng giá phòng</th>
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
                  {orderRoomsList?.length > 0 ? (
                    orderRoomsList?.map((item: any, index: number) => (
                      <tr key={index}>
                        <td className="text-center">{item?.id}</td>
                        <td className="text-center">{item?.customerName}</td>
                        <td className="text-center">{item?.phoneNumber}</td>
                        <td className="text-center">
                          {item?.infoBooking?.length}
                        </td>
                        <td className="text-center">
                          {moment(item?.checkIn).format("hh:mm A DD/MM/YYYY")}
                        </td>
                        <td className="text-center">
                          {moment(item?.checkOut).format("hh:mm A DD/MM/YYYY")}
                        </td>

                        <td className="text-center">
                          {Intl.NumberFormat("en-US").format(
                            Number(item?.realPrice)
                          )}
                        </td>

                        <td className="text-center">
                          <Badge
                            className="site-badge-count-109"
                            count={
                              item.isPayment === 1
                                ? "Đã thanh toán"
                                : "Đã huỷ thanh toán"
                            }
                            style={
                              item.isPayment === 1
                                ? { backgroundColor: "#52c41a" }
                                : { background: "#f5222d" }
                            }
                          />
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
