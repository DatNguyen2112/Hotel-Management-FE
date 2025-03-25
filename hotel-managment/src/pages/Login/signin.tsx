/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { setFullName } from "../../redux/signin";
import { toast } from "react-toastify";
import { Button, Col, Form, Row } from "react-bootstrap";
import "./style.css";
import "react-toastify/dist/ReactToastify.css";
import LoadingIndiciator from "../../component/loading-indiciator";

function Signin() {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRequired, setIsRequired] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (userName.length > 0 && password.length > 0) {
        setIsRequired(false);

        const response: any = await axios.post(
          "http://localhost:8080/api/v1/login",
          {
            userName: userName,
            password: password,
          }
        );

        // Kiểm tra kết quả đăng nhập thành công
        if (response?.data?.success) {
          // Cập nhật userFullName trong Redux store
          dispatch(setFullName(response?.data?.user?.userName));
          localStorage.setItem(
            "accessToken",
            response?.data?.user?.accessToken
          );
          sessionStorage.setItem("user", JSON.stringify(response?.data?.user));
          // Đăng nhập thành công, chuyển hướng đến màn hình Home
          toast.success("Đăng nhập thành công");
          navigate("/users");
        }
      } else {
        setIsRequired(true);
      }
    } catch (error) {
      // Xử lý lỗi ở đây
      toast.error("Đăng nhập thất bại");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (f: Function) => (e: any) => {
    const value = e.target.value;
    f(value);
  };
  return (
    <div className="container p-0">
      {isLoading && <LoadingIndiciator />}
      <div className="login-container">
        <div className="container__fluid">
          <Row>
            <Col xs={12}>
              <div className="head-title text-center col-sm-12">ĐĂNG NHẬP</div>
            </Col>
          </Row>

          <Form onSubmit={handleLogin} noValidate>
            <Form.Group className="mb-4">
              <Form.Label className="form-label gray-lbl fw-bolder">
                Tên đăng nhập *
              </Form.Label>
              <Form.Control
                onChange={handleChange(setUserName)}
                value={userName}
                type="text"
                required
                isInvalid={isRequired && userName === ""}
              />
              <Form.Control.Feedback
                type="invalid"
                style={{ fontSize: "12px" }}
              >
                Vui lòng nhập tên đăng nhập
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="form-label gray-lbl fw-bolder">
                Mật khẩu *
              </Form.Label>
              <Form.Control
                value={password}
                onChange={handleChange(setPassword)}
                type="password"
                className="form-control"
                required
                isInvalid={isRequired && password === ""}
              />
              <Form.Control.Feedback
                type="invalid"
                style={{ fontSize: "12px" }}
              >
                Vui lòng nhập mập khẩu
              </Form.Control.Feedback>
            </Form.Group>

            <Button type="submit" className="btn btn-primary mt-4 w-100">
              Đăng nhập
            </Button>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default Signin;
