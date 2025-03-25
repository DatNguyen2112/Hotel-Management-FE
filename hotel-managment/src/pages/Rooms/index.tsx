/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Button,
  Card,
  Spinner,
  Table,
  Modal,
  Row,
  Form,
  Col,
} from "react-bootstrap";
import { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import ButtonComponent from "../../component/atoms/button";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrash,
  faPencil,
  faArrowsRotate,
} from "@fortawesome/free-solid-svg-icons";
import "./style.css";
import PaginationComponent from "../../component/molecules/pagination";
import { handleExportExcel } from "../../constants";
// import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
// import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// import { DateRangePicker } from "@mui/x-date-pickers-pro/DateRangePicker";
import moment from "moment";
// import dayjs from "dayjs";
// import utc from "dayjs/plugin/utc";
import { Badge } from "antd";

function ListRooms() {
  const callApiPerpage = useRef(10);

  const [isFetching, setIsFetching] = useState(true);
  const [listRooms, setListRooms] = useState<any>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [currentItem, setCurrentItem] = useState<any>(null);
  const [isShowModalDelete, setIsShowModalDelete] = useState<boolean>(false);
  const [searchValue, setSearchValue] = useState<any>("");
  const [filterRoom, setFilterRoom] = useState<any>("");
  const [filterDateRange, setFilterDateRange] = useState<any>([null, null]);
  const [status, setStatus] = useState<string>("");
  const [isStayed, setIsStayed] = useState<string>("");
  const [isCheckOut, setIsCheckOut] = useState<string>("");
  const [filterByMonth, setFilterByMonth] = useState<string>("");

  const navigate = useNavigate();

  useEffect(() => {
    getListRooms();
  }, [currentPage, filterRoom, status, isStayed, isCheckOut, filterByMonth]);

  useEffect(() => {
    if (filterDateRange[0] && filterDateRange[1]) {
      handleGetRoomsOrder();
    }
  }, [filterDateRange[0], filterDateRange[1]]);

  const renderFilter = () => {
    const resultArray = [];

    if (searchValue) {
      resultArray.push({
        operator: "substring",
        value: searchValue,
        property: "roomName",
      });
    }

    // if (filterStatus) {
    //   resultArray.push({
    //     operator: "eq",
    //     value: filterStatus,
    //     property: "availability",
    //   });
    // }

    if (filterRoom) {
      resultArray.push({
        operator: "eq",
        value: filterRoom,
        property: "roomType",
      });
    }

    // if (toDate && sinceDate) {
    //   resultArray.push({
    //     operator: "between",
    //     value: [sinceDate, toDate],
    //     property: "createdAt",
    //   });
    // }

    if (status) {
      resultArray.push({
        operator: "eq",
        value: status,
        property: "availability",
      });
    }

    if (isStayed) {
      resultArray.push({
        operator: "eq",
        value: isStayed,
        property: "isStayed",
      });
    }

    if (isCheckOut) {
      resultArray.push({
        operator: "eq",
        value: isCheckOut,
        property: "isCheckOut",
      });
    }

    if (filterByMonth) {
      resultArray.push({
        operator: "eq",
        value: filterByMonth,
        property: "monthCheckIn",
      });
    }

    return JSON.stringify(resultArray);
  };

  const queryParams: any = {
    start: (currentPage - 1) * callApiPerpage.current,
    limit: callApiPerpage.current,
    filter: renderFilter(),
    sort: JSON.stringify([{ property: "createdAt", direction: "DESC" }]),
  };

  const getListRoomsAPI =
    "http://localhost:8080/api/v1/list-room?" +
    new URLSearchParams(queryParams);

  const getListRooms = async () => {
    setIsFetching(true);
    try {
      const response: any = await axios.get(getListRoomsAPI);
      setListRooms(response.data.data);
      setTotalPage(Math.ceil(response.data.count / callApiPerpage.current));
    } catch (error) {
      toast.error("Lỗi");
    } finally {
      setIsFetching(false);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete("http://localhost:8080/api/v1/delete-room", {
        data: { id: currentItem.id },
      });
      const updateListRoom = [...listRooms];
      console.log(updateListRoom);
      updateListRoom.splice(currentItem?.index, 1);
      setListRooms(updateListRoom);
      setIsShowModalDelete(false);
      toast.success("Xoá phòng thành công");
    } catch {
      toast.error("Lỗi");
    }
  };

  const handleClear = () => {
    setSearchValue("");
    setFilterRoom("");
    setStatus("");
    setIsStayed("");
    setFilterDateRange([null, null]);
    getListRooms();
    setIsCheckOut("");
    setFilterByMonth("");
  };

  const handleGetRoomsOrder = async () => {
    try {
      const res = await axios.post(
        "http://localhost:8080/api/v1/get-rooms-order",
        {
          checkIn: filterDateRange[0],
          checkOut: filterDateRange[1],
        }
      );
      setListRooms(res?.data?.data);
    } catch (error) {
      toast.error("Lỗi");
    }
  };

  const truncate = (str: any, n: number) => {
    return str?.length > n ? str.substr(0, n - 1) + "..." : str;
  };

  const handleExport = () => {
    if (filterDateRange[0] && filterDateRange[1]) {
      // const fileName = "RoomsByDate";
      // handleExportExcelByDate(
      //   fileName,
      //   convertDateFormat(filterDateRange[0]),
      //   convertDateFormat(filterDateRange[1]),
      //   "http://localhost:8080/api/v1/export-rooms-by-date"
      // );
    } else {
      const fileName = filterByMonth
        ? `Danh sách phòng ${filterByMonth}`
        : "Rooms";
      handleExportExcel(
        fileName,
        renderFilter(),
        "http://localhost:8080/api/v1/export-excel"
      );
    }
  };

  // dayjs.extend(utc);

  // function convertDateFormat(dateString: any) {
  //   // Chuyển đổi chuỗi ngày sang đối tượng Day.js
  //   const date = dayjs(dateString, "ddd, DD MMM YYYY HH:mm:ss [GMT]");

  //   // Chuyển đổi sang định dạng ISO 8601 (UTC)
  //   const isoDateString = date.utc().format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");

  //   return isoDateString;
  // }

  // console.log(
  //   convertDateFormat(filterDateRange[0]),
  //   convertDateFormat(filterDateRange[1])
  // );

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
          Bạn có chắc muốn xóa phòng <b>{currentItem?.roomNumber}</b> không?
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
        <h5 className="text-uppercase">DANH SÁCH PHÒNG</h5>

        <div style={{ display: "flex", gap: "10px" }}>
          <Link to="/rooms/create-room">
            <ButtonComponent icon={faPlus} label="thêm phòng" />
          </Link>

          <ButtonComponent
            onClick={handleExport}
            icon={faPlus}
            label="export excel"
          />
        </div>
      </div>

      <Card>
        <Card.Body>
          <div className="mt-2 mb-5">
            <div className="row row-gap-4">
              <div className="col-xxl-4 col-xl-8">
                <Row>
                  <Form.Group as={Col} xs={8}>
                    <Form.Label>Tên phòng</Form.Label>
                    <Form.Control
                      value={searchValue}
                      onChange={(e: any) => setSearchValue(e.target.value)}
                      type="text"
                    ></Form.Control>
                  </Form.Group>
                  <Form.Group as={Col} xs={4} className="d-flex flex-column">
                    <Form.Label className="text-white">Tìm kiếm</Form.Label>
                    <div>
                      <Button onClick={getListRooms} variant="success">
                        Tìm kiếm
                      </Button>
                    </div>
                  </Form.Group>
                </Row>
              </div>

              <div className="col-xxl-8 col-xl-12">
                <Row>
                  {/* <Col xs={3}>
                    <Form.Group>
                      <Form.Label>Trạng thái</Form.Label>
                      <Form.Select
                        value={filterStatus}
                        onChange={(e: any) => setFilterStatus(e.target.value)}
                      >
                        <option value="">--- Chọn ---</option>
                        <option value="1">Đã đặt</option>
                        <option value="0">Chưa đặt</option>
                      </Form.Select>
                    </Form.Group>
                  </Col> */}
                  <Col xs={3}>
                    <Form.Group>
                      <Form.Label>Loại phòng</Form.Label>
                      <Form.Select
                        value={filterRoom}
                        onChange={(e: any) => setFilterRoom(e.target.value)}
                      >
                        <option value="">--- Chọn ---</option>
                        <option value="Deluxe">Phòng Deluxe</option>
                        <option value="Grand Deluxe">Phòng Grand Deluxe</option>
                        <option value="Executive">Phòng Executive</option>
                        <option value="Park View Executive">
                          Phòng Park View Executive
                        </option>
                        <option value="Executive Suite">
                          Phòng Executive Suite
                        </option>
                        <option value="Presidential Suite">
                          Phòng Presidential Suite
                        </option>
                      </Form.Select>
                    </Form.Group>
                  </Col>

                  <Col xs={3}>
                    <Form.Group>
                      <Form.Label>Trạng thái phòng</Form.Label>
                      <Form.Select
                        value={status}
                        onChange={(e: any) => setStatus(e.target.value)}
                      >
                        <option value="">--- Chọn ---</option>
                        <option value="1">Đã đặt</option>
                        <option value="0">Chưa đặt</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>

                  <Col xs={3}>
                    <Form.Group>
                      <Form.Label>Trạng thái checkout</Form.Label>
                      <Form.Select
                        value={isCheckOut}
                        onChange={(e: any) => setIsCheckOut(e.target.value)}
                      >
                        <option value="">--- Chọn ---</option>
                        <option value="1">Đã check out</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>

                  <Col xs={3}>
                    <Form.Group>
                      <Form.Label>Tình trạng phòng ở</Form.Label>
                      <Form.Select
                        value={isStayed}
                        onChange={(e: any) => setIsStayed(e.target.value)}
                      >
                        <option value="">--- Chọn ---</option>
                        <option value="1">Đang ở</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>

                  <Col xs={3}>
                    <Form.Group>
                      <Form.Label style={{ marginTop: "10px" }}>
                        Thống kê phòng theo tháng
                      </Form.Label>
                      <Form.Select
                        value={filterByMonth}
                        onChange={(e: any) => setFilterByMonth(e.target.value)}
                      >
                        <option value="">--- Chọn ---</option>
                        <option value="Tháng 1">Tháng 1</option>
                        <option value="Tháng 2">Tháng 2</option>
                        <option value="Tháng 3">Tháng 3</option>
                        <option value="Tháng 4">Tháng 4</option>
                        <option value="Tháng 5">Tháng 5</option>
                        <option value="Tháng 6">Tháng 6</option>
                        <option value="Tháng 7">Tháng 7</option>
                        <option value="Tháng 8">Tháng 8</option>
                        <option value="Tháng 9">Tháng 9</option>
                        <option value="Tháng 10">Tháng 10</option>
                        <option value="Tháng 11">Tháng 11</option>
                        <option value="Tháng 12">Tháng 12</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>

                  <Col>
                    <Form.Group>
                      <Form.Label className="text-white">lọc</Form.Label>
                      <div
                        style={{ marginTop: "10px" }}
                        className="d-flex gap-2"
                      >
                        <Button style={{ minWidth: 80 }} onClick={getListRooms}>
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
                  {/* <Col xs={12}>
                    <div
                      style={{ marginTop: "15px" }}
                      className="col-xxl-4 col-xl-8"
                    >
                      <span>Lọc trạng thái phòng đã đặt theo ngày</span>
                      <div style={{ marginTop: "15px" }}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DateRangePicker
                            localeText={{ start: "Check-in", end: "Check-out" }}
                            value={filterDateRange}
                            onChange={(newValue: any) =>
                              setFilterDateRange(newValue)
                            }
                          />
                        </LocalizationProvider>
                      </div>
                    </div>
                  </Col> */}
                </Row>
              </div>
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
                getListRooms();
              }}
            >
              <FontAwesomeIcon icon={faArrowsRotate} /> Làm mới
            </Button>
          </div>

          <Table responsive>
            <thead>
              <tr className="text-uppercase">
                <th className="text-center">ID</th>
                <th className="text-center">Tên phòng</th>
                <th className="text-center">Loại phòng</th>
                <th className="text-center">Số phòng</th>
                <th className="text-center">Giá phòng</th>
                {filterByMonth !== "" && (
                  <th className="text-center">Ngày check in</th>
                )}
                <th className="text-center">Đang ở</th>
                <th className="text-center">Đã check out</th>
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
                  {listRooms.length ? (
                    listRooms?.map((item: any, index: number) => (
                      <tr key={index}>
                        <td className="text-center">{item?.id}</td>
                        <td className="text-center">
                          {truncate(item?.roomName, 20)}
                        </td>
                        <td className="text-center">{item?.roomType}</td>
                        <td className="text-center">{item?.roomNumber}</td>
                        <td className="text-center">
                          {Intl.NumberFormat("en-US").format(
                            Number(item?.price)
                          )}
                        </td>

                        {filterByMonth !== "" && (
                          <td className="text-center">
                            {moment(item?.checkIn).format("DD/MM/YYYY")}
                          </td>
                        )}

                        <td className="text-center">
                          <Badge
                            className="site-badge-count-109"
                            count={item.isStayed === 1 ? "Đang ở" : "Chưa ở"}
                            style={
                              item.isStayed === 1
                                ? { backgroundColor: "#52c41a" }
                                : { background: "#f5222d" }
                            }
                          />
                        </td>

                        <td className="text-center">
                          <Badge
                            className="site-badge-count-109"
                            count={
                              item.isStayed === 1
                                ? item.isCheckOut === 1
                                  ? "Đã check out"
                                  : "Chưa check out"
                                : item.isCheckOut === 1
                                ? "Đã check out"
                                : "NVKS chưa cập nhật"
                            }
                            style={
                              item.isCheckOut === 1
                                ? { backgroundColor: "#52c41a" }
                                : { background: "#f5222d" }
                            }
                          />
                        </td>

                        <td className="text-center">
                          {moment(item?.createdAt).format("hh:mm A DD/MM/YYYY")}
                        </td>

                        {filterDateRange[0] && filterDateRange[1] ? (
                          <td className="text-center">
                            <Badge
                              className="site-badge-count-109"
                              count={"Đã đặt"}
                              style={{ backgroundColor: "#52c41a" }}
                            />
                          </td>
                        ) : (
                          <td className="text-center">
                            <Badge
                              className="site-badge-count-109"
                              count={
                                item.availability === 1 ? "Đã đặt" : "Chưa đặt"
                              }
                              style={
                                item.availability === 1
                                  ? { backgroundColor: "#52c41a" }
                                  : { background: "#f5222d" }
                              }
                            />
                          </td>
                        )}

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
                              onClick={() =>
                                navigate(`/rooms/edit-room/${item.id}`)
                              }
                              variant="outline-primary"
                            >
                              <FontAwesomeIcon icon={faPencil} />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : filterDateRange[0] && filterDateRange[1] ? (
                    <td colSpan={8} className="text-center py-5">
                      Không có phòng nào được khoảng thời gian này
                    </td>
                  ) : (
                    <td colSpan={8} className="text-center py-5">
                      Không có dữ liệu
                    </td>
                  )}
                </>
              )}
            </tbody>
          </Table>

          {filterDateRange[0] && filterDateRange[1] ? (
            <div></div>
          ) : (
            <PaginationComponent
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              totalPage={totalPage}
            />
          )}
        </Card.Body>
      </Card>
    </div>
  );
}

export default ListRooms;
