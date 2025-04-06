/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect } from "react";
import {
  Card,
  Form,
  Row as RowBT,
  Col as ColBT,
  Button,
} from "react-bootstrap";
import { Card as CardANTD, Col, Row, Statistic, Table, Radio } from "antd";
import Chart from "react-apexcharts";
import axios from "axios";
import { toast } from "react-toastify";

export default function RestaurantOrdersList() {
  const [peopleHasMoreOrders, setPeopleHasMoreOrders] = useState<any>([]);
  const [roomByMonth, setRoomByMonth] = useState<any>([]);
  const [roomsByUsers, setRoomByUsers] = useState<any>([]);
  const [filterUser, setFilterUser] = useState<any>("");
  const [listUser, setListUsers] = useState<any>([]);
  const [listRoomOrders, setListRoomOrders] = useState<any>([]);
  const [currency, setCurrency] = useState<string>("");
  const [roomCount, setRoomCount] = useState<string>("");
  const [analyticsType, setAnalyticsType] = useState(1);
  const [filterRoomType, setFilterRoomType] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  useEffect(() => {
    setFilterUser([]);
  }, []);

  console.log(roomsByUsers);

  useEffect(() => {
    handleGetOrderRooms();
    getListRooms();
    getListUsers();
  }, [filterRoomType, filterStatus, filterUser]);

  const statesOfMonth = {
    options: {
      chart: {
        id: "basic-bar",
      },
      xaxis: {
        categories: [
          "Tháng 1",
          "Tháng 2",
          "Tháng 3",
          "Tháng 4",
          "Tháng 5",
          "Tháng 6",
          "Tháng 7",
          "Tháng 8",
          "Tháng 9",
          "Tháng 10",
          "Tháng 11",
          "Tháng 12",
        ],
      },
    },
    series: [
      {
        name: "series-1",
        data: [
          "Tháng 1",
          "Tháng 2",
          "Tháng 3",
          "Tháng 4",
          "Tháng 5",
          "Tháng 6",
          "Tháng 7",
          "Tháng 8",
          "Tháng 9",
          "Tháng 10",
          "Tháng 11",
          "Tháng 12",
        ]?.map((item: any) => {
          return roomByMonth?.filter((itemMonth: any) => {
            return itemMonth.monthCheckIn === item;
          })?.length;
        }),
      },
    ],
  };

  const statesOfUsersMonth = {
    options: {
      chart: {
        id: "basic-bar",
      },
      xaxis: {
        categories: [
          "Tháng 1",
          "Tháng 2",
          "Tháng 3",
          "Tháng 4",
          "Tháng 5",
          "Tháng 6",
          "Tháng 7",
          "Tháng 8",
          "Tháng 9",
          "Tháng 10",
          "Tháng 11",
          "Tháng 12",
        ],
      },
    },
    series: [
      {
        name: "series-1",
        data: [
          "-01-",
          "-02-",
          "-03-",
          "-04-",
          "-05-",
          "-06-",
          "-07-",
          "-08-",
          "-09-",
          "-10-",
          "-11-",
          "-12-",
        ]?.map((item: any) => {
          return listUser?.filter((itemMonth: any) => {
            return itemMonth.createdAt.includes(item);
          })?.length;
        }),
      },
    ],
  };

  const states = {
    options: {
      chart: {
        id: "basic-bar",
      },
      xaxis: {
        categories: peopleHasMoreOrders?.map((item: any) => item.customerName),
      },
    },
    series: [
      {
        name: "series-1",
        data: peopleHasMoreOrders?.map((item: any) => item.orderCount),
      },
    ],
  };

  // const statesRoomsOfUsers = {
  //   options: {
  //     chart: {
  //       id: "basic-bar",
  //     },
  //     xaxis: {
  //       categories: [
  //         "Tháng 1",
  //         "Tháng 2",
  //         "Tháng 3",
  //         "Tháng 4",
  //         "Tháng 5",
  //         "Tháng 6",
  //         "Tháng 7",
  //         "Tháng 8",
  //         "Tháng 9",
  //         "Tháng 10",
  //         "Tháng 11",
  //         "Tháng 12",
  //       ],
  //     },
  //   },
  //   series: [
  //     {
  //       name: "series-1",
  //       data: [
  //         "Tháng 1",
  //         "Tháng 2",
  //         "Tháng 3",
  //         "Tháng 4",
  //         "Tháng 5",
  //         "Tháng 6",
  //         "Tháng 7",
  //         "Tháng 8",
  //         "Tháng 9",
  //         "Tháng 10",
  //         "Tháng 11",
  //         "Tháng 12",
  //       ]?.map((item: any) => {
  //         return roomsByUsers?.infoBooking?.filter((itemMonth: any) => {
  //           return itemMonth.monthCheckIn === item;
  //         })?.length;
  //       }),
  //     },
  //   ],
  // };

  // console.log(
  //   [
  //     "Tháng 1",
  //     "Tháng 2",
  //     "Tháng 3",
  //     "Tháng 4",
  //     "Tháng 5",
  //     "Tháng 6",
  //     "Tháng 7",
  //     "Tháng 8",
  //     "Tháng 9",
  //     "Tháng 10",
  //     "Tháng 11",
  //     "Tháng 12",
  //   ]?.map((item: any) => {
  //     return roomsByUsers?.infoBooking?.filter((itemMonth: any) => {
  //       return itemMonth.monthCheckIn === item;
  //     })?.length;
  //   })
  // );

  // console.log(roomsByUsers);

  const columns = [
    {
      title: "STT",
      dataIndex: "key",
      key: "key",
    },
    {
      title: "Tên khách hàng",
      dataIndex: "customerName",
      key: "customerName",
    },
    {
      title: "Số phòng đã order",
      dataIndex: "orderCount",
      key: "orderCount",
    },
  ];

  const handleGetOrderRooms = async () => {
    const queryParams: any = {
      start: 0,
      limit: "",
      filter: JSON.stringify([
        {
          operator: "eq",
          value: filterUser,
          property: "customerName",
        },
      ]),
    };

    const getListOrderRoomsAPI =
      "http://localhost:8080/api/v1/list-orders?" +
      new URLSearchParams(queryParams);

    try {
      const res = await axios.get(getListOrderRoomsAPI);
      setRoomByUsers(
        res.data.data?.find((item: any) => item?.customerName === filterUser)
      );
      // Lấy ra doanh thu
      const mapPaymentOrder = res.data.data?.filter(
        (item: any) => item.isPayment === 1
      );

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const mapCurrency = mapPaymentOrder.map((item: any) =>
        Number(item.realPrice)
      );

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const totalCurrecy = mapCurrency.reduce((acc: any, curr: any) => {
        return acc + curr;
      });

      setCurrency(totalCurrecy);

      // ------------------------------------------------------

      // Lấy ra người đặt phòng nhiều nhất
      const filterPeopleHasMoreOrder = res?.data?.data.map((item: any) => ({
        customerName: item.customerName,
        orderCount: item.infoBooking.length,
      }));

      const countMap = new Map();

      // Tính tổng count cho từng name
      filterPeopleHasMoreOrder.forEach((obj: any) => {
        const { customerName, orderCount } = obj;
        if (countMap.has(customerName)) {
          countMap.set(customerName, countMap.get(customerName) + orderCount);
        } else {
          countMap.set(customerName, orderCount);
        }
      });

      // Tạo mảng mới với các đối tượng duy nhất đã cộng tổng count
      const uniqueArray = Array.from(countMap.entries()).map(
        ([customerName, orderCount]) => ({
          customerName,
          orderCount: orderCount,
        })
      );

      uniqueArray.sort((a, b) => b.orderCount - a.orderCount);

      setPeopleHasMoreOrders(uniqueArray);

      // Lấy ra số đơn đã huỷ
      setListRoomOrders(
        res?.data.data?.filter((item: any) => item.isPayment == 0)
      );
    } catch (error) {
      toast.error("Lỗi");
    }
  };

  const queryParams: any = {
    start: 0,
    limit: "",
    filter: JSON.stringify([
      {
        operator: "eq",
        value: filterRoomType,
        property: "roomType",
      },
      {
        operator: "eq",
        value: filterStatus,
        property: "availability",
      },
      {
        operator: "eq",
        value: filterUser,
        property: "customerName",
      },
    ]),
    sort: JSON.stringify([{ property: "createdAt", direction: "DESC" }]),
  };

  const getListRoomsAPI =
    "http://localhost:8080/api/v1/list-room?" +
    new URLSearchParams(queryParams);

  const getListRooms = async () => {
    try {
      const response: any = await axios.get(getListRoomsAPI);
      setRoomByMonth(response.data.data);
      setRoomCount(response.data.count);
    } catch (error) {
      toast.error("Lỗi");
    }
  };

  const getListUsers = async () => {
    const queryParams: any = {
      start: 0,
      limit: "",
      filter: [],
    };

    const getListUsersAPI =
      "http://localhost:8080/api/v1/list-users?" +
      new URLSearchParams(queryParams);

    try {
      const res = await axios.get(getListUsersAPI);
      setListUsers(res.data.data);
    } catch (error) {
      toast.error("Lỗi");
    }
  };

  const data = peopleHasMoreOrders.map((item: any, index: number) => ({
    key: (index + 1).toString(),
    customerName: item.customerName,
    orderCount: `${item.orderCount} phòng`,
  }));

  const handleClear = () => {
    setFilterRoomType(""), setFilterStatus(""), getListRooms();
  };

  return (
    <div>
      <div className="d-flex flex-wrap justify-content-between row-gap-2 py-3">
        <h5 className="text-uppercase">THỐNG KÊ</h5>
      </div>

      <Row gutter={16}>
        <Col span={4}>
          <CardANTD bordered={false}>
            <Statistic
              title="Số người dùng"
              value={listUser?.length}
              valueStyle={{ color: "#3f8600" }}
            />
          </CardANTD>
        </Col>
        <Col span={4}>
          <CardANTD bordered={false}>
            <Statistic
              title="Doanh thu"
              value={currency}
              valueStyle={{ color: "#cf1322" }}
            />
          </CardANTD>
        </Col>
        <Col span={4}>
          <CardANTD bordered={false}>
            <Statistic
              title="Tổng số phòng"
              value={roomCount}
              valueStyle={{ color: "#cf1322" }}
            />
          </CardANTD>
        </Col>
        <Col span={4}>
          <CardANTD bordered={false}>
            <Statistic
              title="Số phòng đã đặt"
              value={
                roomByMonth?.filter((item: any) => item.availability === 1)
                  ?.length
              }
              valueStyle={{ color: "#cf1322" }}
            />
          </CardANTD>
        </Col>
        <Col span={4}>
          <CardANTD bordered={false}>
            <Statistic
              title="Số phòng trống"
              value={
                roomByMonth?.filter((item: any) => item.availability === 0)
                  ?.length
              }
              valueStyle={{ color: "#cf1322" }}
            />
          </CardANTD>
        </Col>
        <Col span={4}>
          <CardANTD bordered={false}>
            <Statistic
              title="Đơn đã huỷ"
              value={listRoomOrders?.length}
              valueStyle={{ color: "#cf1322" }}
            />
          </CardANTD>
        </Col>
      </Row>

      <Card style={{ marginTop: "15px" }}>
        <Card.Body>
          <div style={{ marginBottom: "25px" }}>
            <Radio.Group
              onChange={(e) => setAnalyticsType(e.target.value)}
              value={analyticsType}
            >
              <Radio value={1}>
                Thống kê danh sách người dùng tham gia đặt phòng
              </Radio>
              <Radio value={2}>Thống kê số lượng phòng theo tháng</Radio>
              <Radio value={3}>Thống kê số lượng user đăng ký hệ thống</Radio>
              {/* <Radio value={4}>
                Thống kê số lượng phòng của user theo tháng
              </Radio> */}
            </Radio.Group>
          </div>

          {analyticsType == 1 && (
            <div
              style={{
                display: "flex",
                justifyContent: "space-around",
              }}
            >
              <Chart
                options={states.options}
                series={states.series}
                type="area"
                width="600"
                height="500"
              />

              <div>
                <div style={{ marginBottom: "15px" }}>
                  Danh sách những người tham gia đặt phòng
                </div>
                <Table
                  style={{ textAlign: "center" }}
                  columns={columns}
                  dataSource={data}
                />
              </div>
            </div>
          )}

          {analyticsType == 2 && (
            <>
              <RowBT style={{ marginBottom: "15px" }}>
                <ColBT xs={3}>
                  <Form.Group>
                    <Form.Label>Trạng thái</Form.Label>
                    <Form.Select
                      value={filterStatus}
                      onChange={(e: any) => setFilterStatus(e.target.value)}
                    >
                      <option value="">--- Chọn ---</option>
                      <option value="1">Đã đặt</option>
                      <option value="0">Đã huỷ</option>
                    </Form.Select>
                  </Form.Group>
                </ColBT>

                <ColBT xs={3}>
                  <Form.Group>
                    <Form.Label>Loại phòng</Form.Label>
                    <Form.Select
                      value={filterRoomType}
                      onChange={(e: any) => setFilterRoomType(e.target.value)}
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
                </ColBT>

                <ColBT>
                  <Form.Group>
                    <Form.Label className="text-white">lọc</Form.Label>
                    <div className="d-flex gap-2">
                      <Button
                        style={{ minWidth: 80 }}
                        onClick={handleClear}
                        variant="secondary"
                      >
                        Bỏ lọc
                      </Button>
                    </div>
                  </Form.Group>
                </ColBT>
              </RowBT>

              <div style={{ display: "flex", justifyContent: "center" }}>
                <Chart
                  options={statesOfMonth.options}
                  series={statesOfMonth.series}
                  type="area"
                  width="900"
                  height="400"
                />
              </div>
            </>
          )}

          {analyticsType == 3 && (
            <div style={{ display: "flex", justifyContent: "center" }}>
              <Chart
                options={statesOfUsersMonth.options}
                series={statesOfUsersMonth.series}
                type="area"
                width="900"
                height="400"
              />
            </div>
          )}

          {/* {analyticsType == 4 && (
            <>
              <RowBT style={{ marginBottom: "15px" }}>
                <ColBT xs={3}>
                  <Form.Group>
                    <Form.Label>Tên người dùng</Form.Label>
                    <Form.Select
                      value={filterUser}
                      onChange={(e: any) => setFilterUser(e.target.value)}
                    >
                      <option value="">--- Chọn ---</option>
                      {listUser?.map((item: any) => (
                        <option value={item.userName}>{item.userName}</option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </ColBT>

                <ColBT xs={3}>
                  <Form.Group>
                    <Form.Label>Loại phòng</Form.Label>
                    <Form.Select
                      value={filterRoomType}
                      onChange={(e: any) => setFilterRoomType(e.target.value)}
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
                </ColBT>

                <ColBT>
                  <Form.Group>
                    <Form.Label className="text-white">lọc</Form.Label>
                    <div className="d-flex gap-2">
                      <Button
                        style={{ minWidth: 80 }}
                        onClick={handleClear}
                        variant="secondary"
                      >
                        Bỏ lọc
                      </Button>
                    </div>
                  </Form.Group>
                </ColBT>
              </RowBT>

              <div style={{ display: "flex", justifyContent: "center" }}>
                <Chart
                  options={statesRoomsOfUsers.options}
                  series={statesRoomsOfUsers.series}
                  type="area"
                  width="900"
                  height="400"
                />
              </div>
            </>
          )} */}
        </Card.Body>
      </Card>
    </div>
  );
}
