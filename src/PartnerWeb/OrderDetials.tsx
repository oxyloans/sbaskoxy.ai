import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Card,
  Descriptions,
  Tag,
  Timeline,
  Typography,
  Spin,
  Alert,
  Button,
  Modal,
  message,
  Tooltip,
  Divider,
  Form,
  Input,
  Radio,
  Space,
  Empty,
} from "antd";
import {
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ReloadOutlined,
  UserOutlined,
  ShoppingCartOutlined,
  ExclamationCircleOutlined,
  CarOutlined,
} from "@ant-design/icons";
import BASE_URL from "../Config";
import {
  Calendar,
  FileText,
  Info,
  MapPin,
  Phone,
  Smartphone,
  Truck,
  User,
} from "lucide-react";

// Type Definitions
interface OrderAddress {
  customerId: string | null;
  orderId: string | null;
  customerName: string | null;
  customerMobile: string | null;
  customerEmail: string | null;
  flatNo: string;
  landMark: string;
  pincode: number;
  address: string;
  addressType: string | null;
  message: string | null;
  dob: string | null;
  latitude: string | null;
  longitude: string | null;
  addressId: string | null;
}

interface OrderHistoryResponse {
  createdDate: string | null;
  orderId: string;
  pickUpDate: string | null;
  placedDate: string | null;
  acceptedDate: string | null;
  assignedDate: string | null;
  deliveredDate: string | null;
  canceledDate: string | null;
  rejectedDate: string | null;
}

interface OrderItem {
  itemId: string;
  itemName: string;
  categoriesId: string | null;
  itemBarCode: string;
  quantity: number;
  itemLogo: string | null;
  itemDeleteId: string | null;
  itemQty: number;
  itemUnit: string | null;
  itemDescription: string | null;
  tags: string | null;
  createdAt: string | null;
  itemprice: number;
  singleItemPrice: string | null;
  itemMrpPrice: string | null;
  price: number;
  itemUrl: string | null;
  weight: number;
  status: string | null;
  errorMessage: string | null;
}

interface Order {
  orderId: string;
  orderStatus: string;
  uniqueId: string;
  newOrderId: string | null;
  mobileNumber: string;
  customerMobile: string;
  testUser: boolean;
  customerId: string;
  subTotal: number;
  grandTotal: number;
  deliveryFee: number;
  paymentStatus: string | null;
  paymentType: number;
  orderDate: string;
  alternativeMobileNumber: string;
  subscriptionAmount: number | null;
  walletAmount: number | null;
  createdAt: string | null;
  customerName: string;
  orders: string | null;
  orderHistory: string | null;
  orderAddress: OrderAddress;
  orderHistoryResponse: OrderHistoryResponse[];
  gstAmount: number;
  discountAmount: number | null;
  sellerId: string | null;
  deliveryBoyId: string;
  deliveryBoyMobile: string | null;
  deliveryBoyName: string | null;
  deliveryBoyAddress: string | null;
  orderAssignedDate: string | null;
  orderItems: OrderItem[];
  orderCanceledDate: string | null;
  message: string | null;
  reason: string | null;
  invoiceUrl: string | null;
  timeSlot: string;
  dayOfWeek: string;
  expectedDeliveryDate: string;
}
type DeliveryBoy = {
  userId: string;
  firstName: string;
  lastName: string;
  whatsappNumber: string;
  isActive: string;
  testUser: boolean;
};

type DbDetails = {
  deliveryBoyId: string;
  deliveryBoyMobile: string;
  deliveryBoyName: string;
  deliveryBoyAddress: string;
  // orderAssignedDate: string;
};

const { TextArea } = Input;

const OrderDetailsPage: React.FC = () => {
  const [orderDetails, setOrderDetails] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const accessToken = JSON.parse(localStorage.getItem("Token") || "{}");
  // const { orderId, orderStatus } = useParams<{
  //   orderId: string;
  //   orderStatus: string;
  // }>();
  const orderId = localStorage.getItem("orderId");
  const [orderStatus, setOrderStatus] = useState<string>();
  const [rejectForm] = Form.useForm();
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [dbLoading, setdbLoading] = useState<boolean>(false);
  const [dbLoading1, setdbLoading1] = useState<boolean>(false);
  const [deliveryBoys, setDeliveryBoys] = useState<DeliveryBoy[]>([]);
  const [dbModalVisible, setdbModalVisible] = useState(false);
  const [dbDetails, setDbDetials] = useState<DbDetails>();
  const [selectedDeliveryBoy, setSelectedDeliveryBoy] =
    useState<DeliveryBoy | null>();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const navigate = useNavigate();

  const getStatusText = (status: string) => {
    switch (status) {
      case "1":
        return "Placed";
      case "2":
        return "Accepted";
      case "3":
        return "Assigned";
      case "4":
        return "Delivered";
      case "5":
        return "Rejected";
      case "6":
        return "Cancelled";
      case "picked up":
        return "Picked Up";
      default:
        return "Unknown";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "1":
        return "bg-yellow-100 text-yellow-800";
      case "2":
        return "bg-blue-100 text-blue-800";
      case "3":
        return "bg-green-100 text-green-800";
      case "4":
        return "bg-green-100 text-green-800";
      case "5":
        return "bg-red-100 text-red-800";
      case "6":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPaymentType = (type: number) => {
    switch (type) {
      case 1:
        return "Cash on Delivery";
      case 2:
        return "Online Payment";
      default:
        return "Online Payment";
    }
  };

  const orderService = {
    async getOrderDetails(
      orderId: string,
      orderStatus: string
    ): Promise<Order[]> {
      try {
        const response = await axios.post<Order[]>(
          `${BASE_URL}/order-service/assignedOrders`,
          { orderId, orderStatus },
          {
            headers: {
              accept: "*/*",
              "Content-Type": "application/json",
            },
          }
        );
        return response.data;
      } catch (error) {
        console.error("Error fetching order details:", error);
        throw error;
      }
    },
  };

  const getDeliveryDetials = async () => {
    if (orderStatus === "3") {
      try {
        const response = await axios.post(
          `${BASE_URL}/order-service/deliveryBoyAssigneData`,
          {
            orderId: orderId,
            orderStatus: "3",
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken.accessToken}`,
            },
          }
        );
        if (response.status === 200) {
          const deliveryData = response.data[0];
          setDbDetials({
            deliveryBoyId: deliveryData?.deliveryBoyId || "",
            deliveryBoyMobile: deliveryData?.deliveryBoyMobile || "N/A",
            deliveryBoyName: deliveryData?.deliveryBoyName || "N/A",
            deliveryBoyAddress: deliveryData?.deliveryBoyAddress || "N/A",
            // orderAssignedDate:
            //   deliveryData?.orderHistoryResponse?.find((h) => h.assignedDate)
            //     ?.assignedDate || "N/A",
          });
        }
      } catch {
        message.error("unable to find deliveryboy");
      }
    }
  };

  const findOrderDetails = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${BASE_URL}/order-service/getOrdersByOrderId/${orderId}`,
        {
          method: "GET",
          headers: {
            Accept: "*/*",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      if (data.length > 0) {
        let status = data[0].orderStatus;
        setOrderStatus(status);
        getDeliveryDetials();
        fetchOrderDetails(status);
      } else {
        console.log("No order details found.");
      }
    } catch (error) {
      console.error("Error fetching order details:", error);
    }
  };

  const fetchOrderDetails = async (status: string) => {
    try {
      if (orderId && status) {
        const details = await orderService.getOrderDetails(orderId, status);
        setOrderDetails(details[0]);
      }
    } catch (err) {
      setError("Failed to fetch order details");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    findOrderDetails();
  }, []);

  const getMobileNumber = () => {
    if (orderDetails) {
      return (
        orderDetails.alternativeMobileNumber || orderDetails.customerMobile
      );
    }
    return "N/A";
  };

  const getOrderTrackingDates = () => {
    if (orderDetails && orderDetails.orderHistoryResponse?.length > 0) {
      const history = orderDetails.orderHistoryResponse;
      return {
        orderDate: history[0]?.placedDate
          ? new Date(history[0].placedDate).toLocaleString()
          : "Not Available",
        acceptedDate: history[1]?.acceptedDate
          ? new Date(history[1].acceptedDate).toLocaleString()
          : "Not Processed",
        assignedDate: history[2]?.assignedDate
          ? new Date(history[2].assignedDate).toLocaleString()
          : "Not Assigned",
        pickUpDate: history[3]?.pickUpDate
          ? new Date(history[3].pickUpDate).toLocaleString()
          : "Not pickedUp",
        deliveredDate: history[4]?.deliveredDate
          ? new Date(history[4].deliveredDate).toLocaleString()
          : "Not delivered",
      };
    }
    return {
      orderDate: "Not Available",
      acceptedDate: "Not Processed",
      assignedDate: "Not Assigned",
      pickUpDate: "Not pickedUp",
      deliveredDate: "Not delivered",
    };
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <Spin size="large" />
      </div>
    );
  }

  if (error || !orderDetails) {
    return (
      <div className="p-6">
        <Alert
          message="Error"
          description={error || "No order details found"}
          type="error"
        />
      </div>
    );
  }
  const RejectionReasonModal = ({ visible }: { visible: boolean }) => (
    <Modal
      title="Provide Rejection Reason"
      open={visible}
      onOk={() => handleFinalReject()}
      onCancel={() => setIsModalVisible(false)}
      confirmLoading={confirmLoading}
    >
      <Form form={rejectForm} layout="vertical">
        <Form.Item
          name="rejectReason"
          label="Rejection Reason"
          rules={[
            {
              required: true,
              message: "Please provide a reason for rejection",
            },
            {
              min: 6,
              message: "Reason must be at least 6 characters long",
            },
          ]}
        >
          <TextArea
            rows={4}
            placeholder="Please provide a detailed reason for rejecting this order"
          />
        </Form.Item>
      </Form>
    </Modal>
  );

  const fetchDeliveryBoys = async () => {
    setdbLoading1(true);
    try {
      const url = `${BASE_URL}/user-service/deliveryBoyList`;
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken.token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        message.error(
          "Failed to get DilveryBoy list please try after sometime."
        );
      }
      const data = await response.json();
      setDeliveryBoys(data);
      setdbModalVisible(true);
    } catch (error) {
      message.warning(
        "Failed to get DilveryBoy list please try after sometime."
      );
    } finally {
      setdbLoading1(false);
    }
  };

  const showRejectConfirmation = () => {
    Modal.confirm({
      title: "Are you sure you want to reject this order?",
      icon: <ExclamationCircleOutlined />,
      okText: "Yes, Reject",
      okButtonProps: { danger: true },
      cancelText: "No, Cancel",
      onOk() {
        setIsModalVisible(true);
      },
    });
  };

  // Handle final rejection submission
  const handleFinalReject = async () => {
    try {
      await rejectForm.validateFields();
      const rejectReason = rejectForm.getFieldValue("rejectReason");
      setConfirmLoading(true);
      const response = await axios.post(
        `${BASE_URL}/order-service/reject_orders`,
        {
          orderId: orderId,
          cancelReason: rejectReason,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken.token}`,
          },
        }
      );

      if (response.data.status) {
        message.success("Order rejected successfully");
        setIsModalVisible(false);
        findOrderDetails();
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      // Handle API or validation errors
      console.error("Rejection error:", error);
      message.error("Failed to reject order. Please try again.");
    } finally {
      setConfirmLoading(false);
      setIsModalVisible(false);
      rejectForm.resetFields();
    }
  };

  const handleAssign = async (orderId: string, orderStatus: string) => {
    if (!selectedDeliveryBoy) {
      message.warning("Please select a delivery boy.");
      return;
    }
    setdbLoading(true);
    let data =
      orderStatus === "2" || orderStatus === "1"
        ? { orderId: orderId, deliveryBoyId: selectedDeliveryBoy.userId }
        : { orderId: orderId, deliverBoyId: selectedDeliveryBoy.userId };

    let apiUrl =
      orderStatus === "2" || orderStatus === "1"
        ? `${BASE_URL}/order-service/orderIdAndDbId`
        : `${BASE_URL}/order-service/reassignOrderToDb`;

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        message.error("Failed to assign to delveryboy");
      } else {
        message.success("Order assigned successfully!");
        setdbModalVisible(false);
        findOrderDetails();
      }
    } catch (error) {
      // console.error("Error assigning order:", error);
      message.error("Failed to assign order.");
    } finally {
      setdbLoading(false);
      setdbModalVisible(false);
      setSelectedDeliveryBoy(null);
    }
  };
  const handleCancelCLick = () => {
    setdbModalVisible(false);
    setSelectedDeliveryBoy(null);
  };

  return (
    <div>
      {orderDetails ? (
        <div className="max-w-full mx-auto bg-white shadow-sm rounded-xl border border-gray-200">
          <div className="px-6 py-4 rounded-t-xl flex flex-col">
            <div className="flex flex-col sm:flex-row justify-between items-center">
              <div className="flex items-center space-x-3 mb-2 sm:mb-0">
                <ShoppingCartOutlined className="text-3xl font-semibold text-blue-700 w-fit h-auto" />
                <h1 className="text-xl font-semibold text-gray-700 w-fit h-auto">
                  Order Details
                  <span className="text-xl text-purple-700 ml-2">
                    (#{orderDetails.uniqueId || "N/A"})
                  </span>
                </h1>
              </div>
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
                <div
                  className={`px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wider text-center
          ${getStatusColor(orderDetails.orderStatus)}`}
                >
                  {getStatusText(orderDetails.orderStatus)}
                </div>
                <div className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium uppercase tracking-wider text-center">
                  {getPaymentType(orderDetails.paymentType)}
                </div>
              </div>
            </div>
          </div>

          {(orderStatus === "1" ||
            orderStatus === "2" ||
            orderStatus === "3") && (
            <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-3 border-b">
              {(orderStatus === "1" || orderStatus === "2") && (
                <>
                  <button
                    onClick={fetchDeliveryBoys}
                    className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition flex items-center text-sm font-medium"
                  >
                    <CheckCircleOutlined className="mr-2" />
                    Assign
                  </button>
                </>
              )}
              {orderStatus === "3" && (
                <button
                  onClick={fetchDeliveryBoys}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition flex items-center text-sm font-medium"
                >
                  <ReloadOutlined className="mr-2" />
                  Re-Assign
                </button>
              )}
              {(orderStatus === "1" ||
                orderStatus === "2" ||
                orderStatus === "3") && (
                <>
                  <button
                    onClick={() => showRejectConfirmation()}
                    className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition flex items-center text-sm font-medium"
                  >
                    <CloseCircleOutlined className="mr-2" />
                    Reject
                  </button>
                </>
              )}
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-6 p-6">
            {/* Customer Details Card */}
            <div className="bg-white rounded-xl shadow-md border border-blue-50 overflow-hidden">
              <div className="bg-blue-50 px-5 py-4 border-b border-blue-100 flex items-center">
                <UserOutlined className="mr-3 text-blue-600 text-xl" />
                <h2 className="text-lg font-semibold text-blue-800">
                  Customer Details
                </h2>
              </div>
              {/* <div className="bg-white shadow-lg rounded-lg overflow-hidden"> */}
              <div className="p-4 sm:p-6">
                <div className="space-y-4">
                  {/* Customer Name Section */}
                  <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                    <div className="flex items-center space-x-3">
                      <div className="bg-blue-50 p-2 rounded-full">
                        <User className="h-5 w-5 text-blue-500" />
                      </div>
                      <span className="text-sm font-medium text-gray-600">
                        Name
                      </span>
                    </div>
                    <span className="text-sm font-semibold text-gray-800">
                      {orderDetails.customerName || "N/A"}
                    </span>
                  </div>

                  {/* Primary Mobile Number Section */}
                  <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                    <div className="flex items-center space-x-3">
                      <div className="bg-green-50 p-2 rounded-full">
                        <Phone className="h-5 w-5 text-green-500" />
                      </div>
                      <span className="text-sm font-medium text-gray-600">
                        Mobile
                      </span>
                    </div>
                    <span className="text-sm font-semibold text-gray-800">
                      {orderDetails.mobileNumber || "N/A"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                    <div className="flex items-center space-x-3">
                      <div className="bg-purple-50 p-2 rounded-full">
                        <Smartphone className="h-5 w-5 text-purple-500" />
                      </div>
                      <span className="text-sm font-medium text-gray-600">
                        Alt. Mobile
                      </span>
                    </div>
                    <span className="text-sm font-semibold text-gray-800">
                      {getMobileNumber()}
                    </span>
                  </div>

                  {/* Order Date Section */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="bg-orange-50 p-2 rounded-full">
                        <Calendar className="h-5 w-5 text-orange-500" />
                      </div>
                      <span className="text-sm font-medium text-gray-600">
                        Order Date
                      </span>
                    </div>
                    <span className="text-sm font-semibold text-gray-800">
                      {orderDetails.orderDate || "N/A"}
                    </span>
                  </div>
                </div>
              </div>
              {/* </div> */}
            </div>

            {/* Delivery Address Card */}
            <div className="bg-white rounded-xl shadow-md border border-green-50 overflow-hidden">
              <div className="bg-green-50 px-5 py-4 border-b border-green-100 flex items-center">
                <MapPin className="mr-3 text-green-600 text-xl" />
                <h2 className="text-lg font-semibold text-green-800">
                  Delivery Address
                </h2>
              </div>
              <div className="p-5">
                <div className="space-y-4 text-gray-700">
                  <div className="flex justify-between items-center border-b pb-2">
                    <div className="font-medium text-gray-600 flex items-center">
                      <span className="mr-2 text-blue-500">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <rect
                            x="3"
                            y="3"
                            width="18"
                            height="18"
                            rx="2"
                            ry="2"
                          ></rect>
                          <line x1="3" y1="9" x2="21" y2="9"></line>
                          <line x1="9" y1="21" x2="9" y2="9"></line>
                        </svg>
                      </span>
                      Flat No
                    </div>
                    <span className="text-gray-800 font-semibold">
                      {orderDetails.orderAddress?.flatNo || "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center border-b pb-2">
                    <div className="font-medium text-gray-600 flex items-center">
                      <span className="mr-2 text-green-500">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M20.69 12.22 14 8.11a2 2 0 0 0-2 0l-6.69 4.11a2 2 0 0 0-.87 1.64v5a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5a2 2 0 0 0-.94-1.64z"></path>
                          <polyline points="22 12 14 7 6 12"></polyline>
                        </svg>
                      </span>
                      Address
                    </div>
                    <span className="text-gray-800 font-semibold max-w-[200px] text-right">
                      {orderDetails.orderAddress?.address || "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center border-b pb-2">
                    <div className="font-medium text-gray-600 flex items-center">
                      <span className="mr-2 text-purple-500">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                          <circle cx="12" cy="10" r="3"></circle>
                        </svg>
                      </span>
                      Landmark
                    </div>
                    <span className="text-gray-800 font-semibold">
                      {orderDetails.orderAddress?.landMark || "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="font-medium text-gray-600 flex items-center">
                      <span className="mr-2 text-red-500">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                          <circle cx="12" cy="10" r="3"></circle>
                        </svg>
                      </span>
                      Pincode
                    </div>
                    <span className="text-gray-800 font-semibold">
                      {orderDetails.orderAddress?.pincode || "N/A"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 bg-gray-50 border-t">
            <h2 className="text-lg font-semibold text-purple-800 mb-4 flex items-center">
              <ShoppingCartOutlined className="mr-3 text-blue-600" />
              Order Items
            </h2>
            <div className="space-y-3">
              {(orderDetails.orderItems || []).map((item) => (
                <div
                  key={item.itemId}
                  className="bg-white rounded-lg shadow-sm p-4 flex justify-between items-center border"
                >
                  <div className="flex-grow">
                    <h3 className="text-base font-semibold text-gray-800 mb-1">
                      {item.itemName || "N/A"}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Quantity: {item.quantity || 0} | Price: ₹
                      {(item.itemprice || 0).toFixed(2)}
                    </p>
                  </div>
                  <div className="bg-blue-50 text-blue-800 px-3 py-1 rounded-full text-xs font-medium ml-4">
                    {item.itemBarCode || "N/A"}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="p-6 bg-gray-50 border-t">
            <h2 className="text-lg font-semibold text-purple-800 mb-4 flex items-center">
              <Info className="mr-3 text-blue-600" />
              Delivery Information
            </h2>

            <div className="bg-white rounded-lg p-5 border space-y-3">
              <div className="flex justify-between text-sm text-gray-700">
                <span>Expected Delivery Date</span>
                <span className="font-medium">
                  {orderDetails.expectedDeliveryDate || "N/A"}
                </span>
              </div>
              <div className="flex justify-between text-sm text-gray-700">
                <span>Time Slot</span>
                <span className="font-medium">
                  {orderDetails.timeSlot || "N/A"}
                </span>
              </div>
            </div>
          </div>

          <div className="p-6 bg-gray-50 border-t">
            <h2 className="text-lg font-semibold text-purple-800 mb-4 flex items-center space-x-2">
              <Truck className="mr-3 text-blue-600" />
              Order Tracking
            </h2>

            <div className="bg-white rounded-lg p-5 border space-y-3">
              {(() => {
                const trackingDates = getOrderTrackingDates();
                return (
                  <>
                    <div className="flex justify-between text-sm text-gray-700">
                      <span className="font-medium">Order Date</span>
                      <span>{trackingDates.orderDate || "N/A"}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-700">
                      <span className="font-medium">Accepted Date</span>
                      <span>{trackingDates.acceptedDate || "N/A"}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-700">
                      <span className="font-medium">Assigned Date</span>
                      <span>{trackingDates.assignedDate || "N/A"}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-700">
                      <span className="font-medium">PickUp Date</span>
                      <span>{trackingDates.pickUpDate || "N/A"}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-700">
                      <span className="font-medium">delivered Date</span>
                      <span>{trackingDates.deliveredDate || "N/A"}</span>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>

          {orderStatus === "3" && (
            <>
              <div className="p-6 bg-gray-50 border-t">
                <h2 className="text-lg font-semibold text-purple-800 mb-4 flex items-center space-x-2">
                  <CarOutlined className="mr-3 text-blue-600" />
                  Order Assigned To
                </h2>

                <div className="bg-white rounded-lg p-5 border space-y-3">
                  <div className="flex justify-between text-sm text-gray-700">
                    <span>DeliveryBoy name</span>
                    <span className="font-medium">
                      {dbDetails?.deliveryBoyName || "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-700">
                    <span>DeliveryBoy Mobile</span>
                    <span className="font-medium">
                      {dbDetails?.deliveryBoyMobile || "N/A"}
                    </span>
                  </div>
                </div>
              </div>
            </>
          )}

          <div className="p-6">
            <h2 className="text-lg font-semibold text-purple-800 mb-4 flex items-center space-x-2">
              <FileText className="mr-3 text-blue-600" />
              Order Summary
            </h2>

            <div className="bg-gray-50 rounded-lg p-5 border space-y-3">
              <div className="flex justify-between text-sm text-gray-700">
                <span>SubTotal</span>
                <span className="font-medium">
                  ₹{(orderDetails.subTotal || 0).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-sm text-gray-700">
                <span>Delivery Fee</span>
                <span className="font-medium">
                  ₹{(orderDetails.deliveryFee || 0).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-sm text-gray-700">
                <span>GST</span>
                <span className="font-medium">
                  ₹{(orderDetails.gstAmount || 0).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-sm text-gray-700">
                <span>Discount</span>
                <span className="font-medium">
                  ₹{(orderDetails.discountAmount || 0).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-base font-bold text-blue-600 pt-3 border-t">
                <span>Total Amount</span>
                <span>₹{(orderDetails.subTotal || 0).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-center">
            <div className="animate-pulse bg-gray-300 w-16 h-16 rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600">Loading order details...</p>
          </div>
        </div>
      )}
      {isModalVisible && <RejectionReasonModal visible={isModalVisible} />}
      <Modal
        title="Select Delivery Boy"
        open={dbModalVisible}
        onCancel={() => setdbModalVisible(false)}
        footer={[
          <Button
            key="cancel"
            onClick={() => {
              handleCancelCLick();
            }}
          >
            Cancel
          </Button>,
          <Button
            key="assign"
            type="primary"
            loading={dbLoading}
            onClick={() => handleAssign(orderId ?? "", orderStatus ?? "")}
          >
            Assign
          </Button>,
        ]}
      >
        {dbLoading1 ? (
          <div className="flex justify-center items-center h-32">
            <Spin size="large" />
          </div>
        ) : deliveryBoys.length > 0 ? (
          <Radio.Group
            onChange={(e) => {
              const selectedBoy = deliveryBoys.find(
                (boy) => boy.userId === e.target.value
              );
              setSelectedDeliveryBoy(selectedBoy);
            }}
            value={selectedDeliveryBoy?.userId}
          >
            <Space direction="vertical">
              {deliveryBoys
                .filter((boy: DeliveryBoy) => boy.isActive === "true")
                .map((boy: DeliveryBoy) => (
                  <Radio
                    key={boy.userId}
                    value={boy.userId}
                    className="block mb-2"
                  >
                    {`${boy.firstName} ${boy.lastName} (${boy.whatsappNumber})`}
                  </Radio>
                ))}
            </Space>
          </Radio.Group>
        ) : (
          <Empty description="No delivery boys available" />
        )}
      </Modal>
    </div>
  );
};

export default OrderDetailsPage;
