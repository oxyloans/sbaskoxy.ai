import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Tabs,
  Spin,
  Empty,
  Badge,
  Card,
  Tag,
  List,
  Typography,
  Button,
  notification,
  Avatar,
  Row,
  Col,
  Divider,
  message,
} from "antd";
import {
  LoadingOutlined,
  CheckCircleOutlined,
  CarOutlined,
  ShoppingCartOutlined,
  EyeOutlined,
  UserOutlined,
  EnvironmentOutlined,
  ShoppingOutlined,
  CalendarOutlined,
  DollarOutlined,
} from "@ant-design/icons";
import type { TabsProps } from "antd";
import { useNavigate } from "react-router-dom";
import BASE_URL from "../Config";

const { Title, Text } = Typography;

// Interface for assigned and delivered orders
interface OrderAddress {
  flatNo: string;
  landMark: string;
  address: string;
  pincode: number;
}

interface OrderItem {
  itemId: string;
  itemName: string | null;
  itemBarCode: string | null;
  price: number | null;
}

interface AssignedOrder {
  orderId: string;
  uniqueId: string;
  orderStatus: string;
  grandTotal: number | null;
  subTotal: number | null;
  orderDate: string;
  deliveryBoyName: string | null;
  orderItems: OrderItem[];
  orderAddress?: OrderAddress;
}

// Interface for picked up orders (different structure)
interface PickedUpOrder {
  orderId: string;
  orderDate: string;
  orderStatus: string;
  totalAmount: number;
  deliveryBoyId: string;
  orderItems: OrderItem[];
  // No orderAddress in this response
}

// Union type to handle both response types
type Order = AssignedOrder | PickedUpOrder;

const DeliveryBoyOrders: React.FC = () => {
  const navigate = useNavigate();
  const [assignedOrders, setAssignedOrders] = useState<AssignedOrder[]>([]);
  const [pickedUpOrders, setPickedUpOrders] = useState<PickedUpOrder[]>([]);
  const [deliveredOrders, setDeliveredOrders] = useState<AssignedOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("assigned");
  const [deliveryBoyName, setDeliveryBoyName] = useState<string>("Loading...");
  const [deliveryBoyId, setdeliveryBoyId] = useState<string>("");

  // const deliveryBoyId = localStorage.getItem("dbId") || "";

  const fetchOrders = async (deliveryBoyId: string) => {
    setdeliveryBoyId(deliveryBoyId);
    try {
      setLoading(true);

      // Fetch Assigned Orders
      const assignedResponse = await axios.post(
        `${BASE_URL}/order-service/getAssignedOrdersToDeliveryBoy`,
        { deliveryBoyId, orderStatus: 3 }
      );

      // Fetch Delivered Orders
      const deliveredResponse = await axios.post(
        `${BASE_URL}/order-service/getAssignedOrdersToDeliveryBoy`,
        { deliveryBoyId, orderStatus: 4 }
      );

      // Fetch Picked-Up Orders
      const pickedUpResponse = await axios.get(
        `${BASE_URL}/order-service/getPickupDataBasedOnId`,
        { params: { deliveryBoyId } }
      );

      const assignedData = assignedResponse.data || [];
      const deliveredData = deliveredResponse.data || [];
      const pickedUpData = pickedUpResponse.data || [];

      setAssignedOrders(assignedData);
      setDeliveredOrders(deliveredData);
      setPickedUpOrders(pickedUpData);

      // Extract delivery boy name from the first order if available
      if (assignedData.length > 0 && assignedData[0].deliveryBoyName) {
        setDeliveryBoyName(assignedData[0].deliveryBoyName || "");
      } else if (deliveredData.length > 0 && deliveredData[0].deliveryBoyName) {
        setDeliveryBoyName(deliveredData[0].deliveryBoyName);
      } else {
        setDeliveryBoyName("Delivery Partner");
      }
    } catch (err: any) {
      if (err.response && err.response.status === 404) {
        message.error("No orders found for this user.");
        const name = localStorage.getItem("dbName");
        setDeliveryBoyName(name || "Delivery Partner");
      } else {
        message.error("Failed to fetch orders. Please try again later.");
        const name = localStorage.getItem("dbName");
        setDeliveryBoyName(name || "");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOrderDetails = (order: Order) => {
    // notification.info({
    //   message: "Order Details",
    //   description: `Viewing details for order ${
    //     "uniqueId" in order ? order.uniqueId : order.orderId.slice(-4)
    //   }`,
    // });

    localStorage.setItem("orderId", order.orderId);
    navigate(`/home/orderDetails`);
  };

  useEffect(() => {
    const deliveryBoyId = localStorage.getItem("dbId");

    if (deliveryBoyId) {
      fetchOrders(deliveryBoyId);
    }
  }, []);

  // Function to determine if order is from PickedUp response
  const isPickedUpOrder = (order: Order): order is PickedUpOrder => {
    return "totalAmount" in order && order.orderStatus === "PickedUp";
  };

  const renderOrderCards = (orders: Order[], type: string) => {
    if (orders.length === 0) {
      return <Empty description="No orders found" />;
    }

    return (
      <Row gutter={[16, 16]}>
        {orders.map((order) => (
          <Col key={order.orderId} xs={24} sm={12} lg={12} xl={12}>
            <Card
              className="w-full border-2 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2"
              bordered={false}
            >
              <div className="flex flex-col space-y-4">
                {/* Order ID Section */}
                <div className="flex justify-between items-center">
                  <Typography.Text strong>
                    OrderId : #
                    <span className="text-purple-900 text-xl">
                      {"uniqueId" in order
                        ? order.uniqueId
                        : order.orderId.slice(-4)}
                    </span>
                  </Typography.Text>
                  <Tag
                    color={
                      type === "assigned"
                        ? "blue"
                        : type === "picked"
                        ? "orange"
                        : "green"
                    }
                  >
                    {type === "assigned"
                      ? "Assigned"
                      : type === "picked"
                      ? "Picked Up"
                      : "Delivered"}
                  </Tag>
                </div>

                {/* Date Section */}
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <CalendarOutlined className="mr-2 text-gray-500" />
                    <Typography.Text type="secondary">Date</Typography.Text>
                  </div>
                  <Typography.Text>
                    {new Date(order.orderDate).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </Typography.Text>
                </div>

                {/* Amount Section */}
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <DollarOutlined className="mr-2 text-green-600" />
                    <Typography.Text strong>Amount</Typography.Text>
                  </div>
                  <Typography.Text strong type="success">
                    {new Intl.NumberFormat("en-IN", {
                      style: "currency",
                      currency: "INR",
                    }).format(
                      isPickedUpOrder(order)
                        ? order.totalAmount || 0
                        : order.subTotal || order.grandTotal || 0
                    )}
                  </Typography.Text>
                </div>

                {/* Delivery Address - Only for assigned/delivered orders */}
                {!isPickedUpOrder(order) && order.orderAddress && (
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center">
                      <EnvironmentOutlined className="mr-2 text-red-500" />
                      <Typography.Text strong>Delivery Address</Typography.Text>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-md h-[90px] overflow-y-auto break-words">
                      <Typography.Text className="block leading-tight">
                        {order.orderAddress.flatNo
                          ? `${order.orderAddress.flatNo}, `
                          : ""}
                        {order.orderAddress.address || ""}
                        {order.orderAddress.landMark
                          ? `, ${order.orderAddress.landMark}`
                          : ""}
                        {order.orderAddress.pincode
                          ? ` - ${order.orderAddress.pincode}`
                          : ""}
                      </Typography.Text>
                    </div>
                  </div>
                )}

                {/* Items Section - First 2 items only */}
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center">
                    <ShoppingOutlined className="mr-2 text-blue-500" />
                    <Typography.Text strong>Items</Typography.Text>
                    <Typography.Text type="secondary" className="ml-2">
                      ({order.orderItems?.length || 0})
                    </Typography.Text>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-md max-h-[80px] overflow-y-auto">
                    {order.orderItems && order.orderItems.length > 0 ? (
                      <div className="space-y-2">
                        {order.orderItems.slice(0, 2).map((item, index) => (
                          <div key={index} className="flex justify-between">
                            <Typography.Text ellipsis className="max-w-[70%]">
                              {item.itemName ||
                                item.itemBarCode ||
                                "Unnamed Item"}
                            </Typography.Text>
                            {item.price && (
                              <Typography.Text type="secondary">
                                ₹{item.price}
                              </Typography.Text>
                            )}
                          </div>
                        ))}
                        {order.orderItems.length > 2 && (
                          <Typography.Text type="secondary">
                            +{order.orderItems.length - 2} more items
                          </Typography.Text>
                        )}
                      </div>
                    ) : (
                      <Typography.Text type="secondary">
                        No items
                      </Typography.Text>
                    )}
                  </div>
                </div>

                {/* View Details Button */}
                <div className="mt-auto">
                  <Button
                    type="primary"
                    icon={<EyeOutlined />}
                    className="w-full"
                    onClick={() => handleOrderDetails(order)}
                  >
                    View Details
                  </Button>
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    );
  };

  const items: TabsProps["items"] = [
    {
      key: "assigned",
      label: (
        <div className="flex items-center">
          <ShoppingCartOutlined className="mr-2" />
          Assigned {assignedOrders.length > 0 && `(${assignedOrders.length})`}
        </div>
      ),
      children: renderOrderCards(assignedOrders, "assigned"),
    },
    {
      key: "picked",
      label: (
        <div className="flex items-center">
          <CarOutlined className="mr-2" />
          Picked Up {pickedUpOrders.length > 0 && `(${pickedUpOrders.length})`}
        </div>
      ),
      children: renderOrderCards(pickedUpOrders, "picked"),
    },
    {
      key: "delivered",
      label: (
        <div className="flex items-center">
          <CheckCircleOutlined className="mr-2" />
          Delivered{" "}
          {deliveredOrders.length > 0 && `(${deliveredOrders.length})`}
        </div>
      ),
      children: renderOrderCards(deliveredOrders, "delivered"),
    },
  ];

  return (
    <div className="bg-gradient-to-b from-blue-50 to-gray-100 min-h-screen p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Delivery Boy Profile Section */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6 border-l-4 border-blue-500">
          <div className="flex items-center">
            <Avatar size={64} icon={<UserOutlined />} className="bg-blue-500" />
            <div className="ml-4">
              <Typography.Text type="secondary">PILOT NAME</Typography.Text>
              <Title level={3} className="m-0">
                {deliveryBoyName}
              </Title>
              <div className="mt-1">
                {/* <Tag color="green">Online</Tag> */}
                <Tag color="blue" className="text-s">
                  ID: {deliveryBoyId.slice(-4)}
                </Tag>
              </div>
            </div>
          </div>
        </div>

        <Title level={2} className="text-center mb-6">
          Orders Details
        </Title>

        {loading ? (
          <div className="flex flex-col justify-center items-center h-64 bg-white rounded-lg shadow-md">
            <Spin size="large" />
            <Typography.Text className="mt-4 text-gray-500">
              Loading orders...
            </Typography.Text>
          </div>
        ) : (
          <Tabs
            items={items}
            activeKey={activeTab}
            onChange={setActiveTab}
            className="bg-white p-4 rounded-lg shadow-md"
          />
        )}
      </div>
    </div>
  );
};

export default DeliveryBoyOrders;
