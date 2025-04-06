/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { useState, FormEvent, ChangeEvent } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { setFullName } from "../../redux/signin";
import { toast } from "react-toastify";
import { Button, Col, Form, Row } from "react-bootstrap";
import "./style.css";
import "react-toastify/dist/ReactToastify.css";
import LoadingIndiciator from "../../component/loading-indiciator";

interface LoginResponse {
  success: boolean;
  user: {
    userName: string;
    accessToken: string;
  };
}

interface FormErrors {
  userName: string;
  password: string;
}

function Signin() {
  const [formData, setFormData] = useState({
    userName: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({
    userName: "",
    password: "",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {
      userName: "",
      password: "",
    };
    let isValid = true;

    if (!formData.userName.trim()) {
      newErrors.userName = "Vui lòng nhập tên đăng nhập";
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = "Vui lòng nhập mật khẩu";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post<LoginResponse>(
        "http://localhost:8080/api/v1/login",
        formData
      );

      if (response.data.success) {
        dispatch(setFullName(response.data.user.userName));
        localStorage.setItem("accessToken", response.data.user.accessToken);
        sessionStorage.setItem("user", JSON.stringify(response.data.user));
        toast.success("Đăng nhập thành công");
        navigate("/users");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = "Đăng nhập thất bại";
        toast.error(errorMessage);
      } else {
        toast.error("Đã có lỗi xảy ra, vui lòng thử lại sau");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange =
    (field: keyof typeof formData) => (e: ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));
      // Clear error when user starts typing
      if (errors[field]) {
        setErrors((prev) => ({
          ...prev,
          [field]: "",
        }));
      }
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
                onChange={handleChange("userName")}
                value={formData.userName}
                type="text"
                required
                isInvalid={!!errors.userName}
              />
              <Form.Control.Feedback
                type="invalid"
                style={{ fontSize: "12px" }}
              >
                {errors.userName}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="form-label gray-lbl fw-bolder">
                Mật khẩu *
              </Form.Label>
              <Form.Control
                value={formData.password}
                onChange={handleChange("password")}
                type="password"
                className="form-control"
                required
                isInvalid={!!errors.password}
              />
              <Form.Control.Feedback
                type="invalid"
                style={{ fontSize: "12px" }}
              >
                {errors.password}
              </Form.Control.Feedback>
            </Form.Group>

            <Button
              type="submit"
              className="btn btn-primary mt-4 w-100"
              disabled={isLoading}
            >
              {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
            </Button>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default Signin;
