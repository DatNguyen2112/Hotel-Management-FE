/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate, useParams } from "react-router";
import { toast } from "react-toastify";
import PageTitle from "../../../component/atoms/page-title";
import Select from "react-select";
import _ from "lodash";
import "./style.css";

import {
  Card,
  CardBody,
  Spinner,
  Form,
  Row,
  Col,
  Button,
} from "react-bootstrap";
import { selectStyles } from "../../../constants";
import CloudinaryUpload from "../../UploadFirebase";

function CreateOrEditRoom() {
  const { id } = useParams();

  const [roomType, setRoomType] = useState("");
  const [roomNumber, setRoomNumber] = useState("");
  const [price, setPrice] = useState("");
  const [detailRoom, setDetailRoom] = useState<any>({});
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [availability, setAvailability] = useState<boolean>(false);
  const [isStayed, setIsStayed] = useState<boolean>(false);
  const [isCheckOut, setIsCheckOut] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>("");
  const [isListServiceLoading, setIsServiceLoading] = useState<boolean>(false);
  const [listServices, setListServices] = useState<any>([]);
  const [serviceChoose, setServiceChoose] = useState<any>([]);
  const [imageRoom, setImageRoom] = useState<any>(null);
  const [optionGuestAndChildNumber, setOptionGuestAndChildNumber] =
    useState<string>("");
  const [roomEvaduate, setRoomEvaduate] = useState<string>("");
  const [roomName, setRoomName] = useState<string>("");

  // const callApiPerpage = useRef<any>(10);
  const initialServicesSuggestionList = useRef<any>([]);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (id) {
      handleGetDetail();
    }
  }, []);

  useEffect(() => {
    setRoomType(detailRoom?.roomType);
    setRoomNumber(detailRoom?.roomNumber);
    setPrice(detailRoom?.price);
    setAvailability(detailRoom?.availability);
    if (detailRoom?.services) {
      setServiceChoose(detailRoom?.services);
    }
    setImageRoom(detailRoom?.imageRoom);
    setOptionGuestAndChildNumber(detailRoom?.optionGuestAndChildNumber);
    setRoomEvaduate(detailRoom?.roomEveduate);
    setRoomName(detailRoom?.roomName);
    setIsStayed(detailRoom?.isStayed);
    setIsCheckOut(detailRoom?.isCheckOut);
  }, [detailRoom]);

  useEffect(() => {
    getInitialTagsList();
  }, [location.pathname]);

  const handleGetDetail = async () => {
    try {
      const res = await axios.get(`http://localhost:8080/detail-room/${id}`);
      setDetailRoom(res.data);
    } catch {
      toast.error("Lỗi");
    }
  };

  const handleCreateOrEditRoom = async (e: any) => {
    e.preventDefault();
    setIsFetching(true);
    try {
      if (id) {
        await axios.put(`http://localhost:8080/api/v1/update-room`, {
          id: id,
          roomType: roomType,
          roomNumber: roomNumber,
          price: price,
          availability: availability,
          services: serviceChoose,
          imageRoom: imageRoom,
          optionGuestAndChildNumber: optionGuestAndChildNumber,
          roomEveduate: roomEvaduate,
          roomName: roomName,
          isStayed: isStayed ? true : false,
          isCheckOut: isCheckOut ? true : false,
        });

        navigate("/rooms");
        toast.success("Chỉnh sửa phòng thành công");
      } else {
        await axios.post("http://localhost:8080/api/v1/create-room", {
          roomType: roomType,
          roomNumber: roomNumber,
          price: price,
          availability: false,
          services: serviceChoose,
          imageRoom: imageRoom,
          optionGuestAndChildNumber: optionGuestAndChildNumber,
          roomEveduate: roomEvaduate,
          roomName: roomName,
          isStayed: isStayed ? true : false,
          isCheckOut: isCheckOut ? true : false,
        });

        navigate("/rooms");
        toast.success("Tạo phòng thành công");
      }
    } catch (error) {
      toast.error("Tạo phòng thất bại");
    } finally {
      setIsFetching(false);
    }
  };

  console.log(isCheckOut);

  // ------------------------------------------------------

  const handleGetListServices = async (inputValue: string) => {
    setIsServiceLoading(true);
    const arrayFilter = [];
    if (inputValue) {
      arrayFilter.push({
        operator: "substring",
        value: inputValue,
        property: "name",
      });
    }

    const queryParams: any = {
      filter: JSON.stringify(arrayFilter),
    };

    const getListServicesApi =
      "http://localhost:8080/api/v1/list-services?" +
      new URLSearchParams(queryParams);

    try {
      const res = await axios.get(getListServicesApi);
      const arr = res.data.data.map((item: any) => ({
        value: item.id,
        label: item.name,
      }));
      setListServices(arr);
    } catch (error) {
      toast.error("Lỗi");
    }
  };

  const debounceSearchTags = useCallback(
    _.debounce(handleGetListServices, 700),
    []
  );

  const getInitialTagsList = async () => {
    initialServicesSuggestionList.current = await handleGetListServices("");
  };

  const handleSearchTagsList = (inputValue: string) => {
    setInputValue(inputValue);
    debounceSearchTags(inputValue);
    if (inputValue) {
      setIsServiceLoading(true);
      setListServices([]);
    } else {
      setIsServiceLoading(false);
      setListServices(initialServicesSuggestionList.current);
    }
  };

  return (
    <div>
      <PageTitle title={id ? "Chỉnh sửa phòng" : "Tạo phòng mới"} />
      <Card>
        <CardBody className="p-4">
          {isFetching ? (
            <div
              className="d-flex align-items-center justify-content-center"
              style={{ minHeight: "500px" }}
            >
              <Spinner variant="primary" />
            </div>
          ) : (
            <Form onSubmit={handleCreateOrEditRoom}>
              <Row className="mb-4">
                <Col xs={2}>
                  <Form.Label>
                    Loại phòng<span className="text-danger ms-1">*</span>
                  </Form.Label>
                </Col>

                <Col xs={8}>
                  <Form.Select
                    value={roomType}
                    onChange={(e: any) => setRoomType(e.target.value)}
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
                </Col>
              </Row>

              <Row className="mb-4">
                <Col xs={2}>
                  <Form.Label>
                    Số phòng<span className="text-danger ms-1">*</span>
                  </Form.Label>
                </Col>

                <Col xs={8}>
                  <Form.Control
                    value={roomNumber}
                    onChange={(e) => setRoomNumber(e.target.value)}
                    required
                  />
                </Col>
              </Row>

              <Row className="mb-4">
                <Col xs={2}>
                  <Form.Label>
                    Tên phòng<span className="text-danger ms-1">*</span>
                  </Form.Label>
                </Col>

                <Col xs={8}>
                  <Form.Control
                    value={roomName}
                    onChange={(e) => setRoomName(e.target.value)}
                    required
                  />
                </Col>
              </Row>

              <Row className="mb-4">
                <Col xs={2}>
                  <Form.Label>
                    Giá phòng<span className="text-danger ms-1">*</span>
                  </Form.Label>
                </Col>

                <Col xs={8}>
                  <Form.Control
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                  />
                </Col>
              </Row>

              <Row className="mb-4">
                <Col xs={2}>
                  <Form.Label>Trạng thái</Form.Label>
                </Col>
                <Col xs={8}>
                  <Form.Check
                    type="switch"
                    checked={availability}
                    onChange={() => setAvailability(!availability)}
                    label={availability ? "Đã đặt" : "Chưa đặt"}
                  />
                </Col>
              </Row>

              <Row className="mb-4">
                <Col xs={2}>
                  <Form.Label>Khách đang ở</Form.Label>
                </Col>
                <Col xs={8}>
                  <Form.Check
                    type="switch"
                    checked={isStayed}
                    onChange={() => setIsStayed(!isStayed)}
                    label={isStayed ? "Đang ở" : ""}
                  />
                </Col>
              </Row>

              <Row className="mb-4">
                <Col xs={2}>
                  <Form.Label>Khách đã checkout</Form.Label>
                </Col>
                <Col xs={8}>
                  <Form.Check
                    type="switch"
                    checked={isCheckOut}
                    onChange={() => setIsCheckOut(!isCheckOut)}
                    label={isCheckOut ? "Đã check out" : ""}
                  />
                </Col>
              </Row>

              <Row className="mb-4">
                <Col xs={2}>
                  <Form.Label>Thiết bị đi kèm</Form.Label>
                </Col>
                <Col xs={8}>
                  <Select
                    styles={selectStyles}
                    options={listServices}
                    value={serviceChoose}
                    onChange={(value: any) => setServiceChoose(value)}
                    isClearable={true}
                    placeholder="-- Chọn thiết bị đi kèm ---"
                    isMulti
                    isLoading={isListServiceLoading}
                    inputValue={inputValue}
                    onInputChange={(value: string) =>
                      handleSearchTagsList(value)
                    }
                    loadingMessage={() => <Spinner variant="primary" />}
                    noOptionsMessage={() => (
                      <span>Không có kết quả tìm kiếm nào</span>
                    )}
                    components={{
                      DropdownIndicator: () => null,
                      IndicatorSeparator: () => null,
                    }}
                  />
                </Col>
              </Row>

              <Row className="mb-4">
                <Col xs={2}>
                  <Form.Label>
                    Sô lượng khách<span className="text-danger ms-1">*</span>
                  </Form.Label>
                </Col>

                <Col xs={8}>
                  <Form.Select
                    value={optionGuestAndChildNumber}
                    onChange={(e: any) =>
                      setOptionGuestAndChildNumber(e.target.value)
                    }
                  >
                    <option value="">--- Chọn ---</option>
                    <option value="1 khách">1 khách</option>
                    <option value="2 khách">2 khách</option>
                    <option value="3 khách">3 khách</option>
                    <option value="Tối đa 2 người lớn, 2 trẻ em">
                      Tối đa 2 người lớn, 2 trẻ em
                    </option>
                    <option value="Tối đa 1 người lớn, 1 trẻ em">
                      Tối đa 1 người lớn, 1 trẻ em
                    </option>
                  </Form.Select>
                </Col>
              </Row>

              <Row className="mb-4">
                <Col xs={2}>
                  <Form.Label>
                    Dạng phòng<span className="text-danger ms-1">*</span>
                  </Form.Label>
                </Col>

                <Col xs={8}>
                  <Form.Select
                    value={roomEvaduate}
                    onChange={(e: any) => setRoomEvaduate(e.target.value)}
                  >
                    <option value="">--- Chọn ---</option>
                    <option value="twin">Phòng đơn</option>
                    <option value="single">Phòng đôi</option>
                  </Form.Select>
                </Col>
              </Row>

              <Row className="mb-4">
                <Col xs={2}>
                  <Form.Label>Ảnh phòng</Form.Label>
                </Col>

                <Col xs={8}>
                  <CloudinaryUpload file={imageRoom} setFile={setImageRoom} />
                </Col>
              </Row>

              <Row>
                <Col xs={2}></Col>
                <Col xs={10}>
                  <Button
                    variant="secondary"
                    className="me-2"
                    onClick={() => navigate(-1)}
                  >
                    Hủy
                  </Button>
                  <Button type="submit">{id ? "Lưu lại" : "Tạo mới"}</Button>
                </Col>
              </Row>
            </Form>
          )}
        </CardBody>
      </Card>
    </div>
  );
}

export default CreateOrEditRoom;
