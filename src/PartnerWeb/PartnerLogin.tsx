import React, { useState, useEffect } from "react";
import { Form, Input, Button, Card, message, Spin } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Logo from "../assets/img/logo.png";
import BASE_URL from "../Config";

interface LoginFormValues {
  email: string;
  password: string;
}

const LoginPage: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const handleSubmit = async (values: LoginFormValues) => {
    setLoading(true);

    try {
      const loginUrl = `${BASE_URL}/user-service/userEmailPassword`;
      console.log("Login URL:", loginUrl);

      const response = await axios({
        method: "post",
        url: loginUrl,
        data: {
          email: values.email,
          password: values.password,
        },
      });

      // console.log("Login response:", response.data);

      // if (response.data && response.data.accessToken) {
      if (response.data) {
        localStorage.setItem("Token", JSON.stringify(response.data));

        message.success("Login Successful! Welcome to AskOxy.AI Partner!");
        navigate("/home");
      } else {
        message.error(
          "Login Failed: Please check your credentials and try again."
        );
      }
    } catch (error: any) {
      // console.log("Login error details:", error);

      if (error.response) {
        // The server responded with a status code outside the 2xx range
        console.log("Error response data:", error.response.data);
        console.log("Error response status:", error.response.status);

        if (error.response.status === 500) {
          message.error(
            "Server Error: The server encountered an internal error. Please try again later."
          );
        } else {
          message.error(
            "Login Failed: " +
              (error.response.data?.message ||
                "Unable to log in. Please check your credentials. try again later")
          );
        }
      } else if (error.request) {
        // The request was made but no response was received
        message.error(
          "Connection Error: Unable to connect to the server. Please check your internet connection."
        );
      } else {
        // Something happened in setting up the request
        message.error("Error: An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const checkAutoLogin = async () => {
    try {
      const token = localStorage.getItem("Token");
      if (token) {
        navigate("/home");
      }
    } catch (error) {
      console.error("Auto-login error:", error);
    }
  };

  useEffect(() => {
    checkAutoLogin();
  }, []);

  const emailRules = [
    { required: true, message: "Please enter your email address" },
    { type: "email" as const, message: "Please enter a valid email address" },
  ];

  const passwordRules = [
    { required: true, message: "Please enter your password" },
    { min: 6, message: "Password must be at least 6 characters" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-purple-100 flex justify-center items-center p-4 sm:p-8">
      <Card className="w-full max-w-sm rounded-2xl shadow-xl border-0">
        <div className="flex flex-col items-center mb-1 mt-[-10px]">
          <img
            src={Logo}
            alt="AskOxy.AI Logo"
            className="w-44 sm:w-50 h-32 sm:h-40 object-contain"
          />
          <h1 className="text-purple-900 text-2xl sm:text-3xl font-bold text-center leading-tight">
           Partner
          </h1>
        </div>
        <div className="bg-purple-900 p-4 sm:p-6 rounded-xl shadow-inner">
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            className="space-y-2 max-w-xs mx-auto w-full"
          >
            <Form.Item name="email" rules={emailRules}>
              <Input
                prefix={<UserOutlined className="text-purple-300" />}
                placeholder="Email Address"
                className="rounded-lg p-2 sm:p-3"
                size="middle"
                disabled={loading}
              />
            </Form.Item>

            <Form.Item name="password" rules={passwordRules}>
              <Input.Password
                prefix={<LockOutlined className="text-purple-300" />}
                placeholder="Password"
                className="rounded-lg p-2 sm:p-3"
                size="middle"
                disabled={loading}
              />
            </Form.Item>

            <Form.Item className="mb-0">
              <Button
                type="primary"
                htmlType="submit"
                className="w-full rounded-lg h-10 sm:h-12 bg-purple-500 hover:bg-purple-600 border-0 font-medium text-base sm:text-lg"
                disabled={loading}
              >
                {loading ? <Spin size="small" /> : "Login"}
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Card>
    </div>
  );
};

export default LoginPage;
