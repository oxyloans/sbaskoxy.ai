import React, { useState, useEffect } from "react";
import UserPanelLayout from "./UserPanelLayout";
import axios from "axios";
import BASE_URL from "../../Config";
import {
  Card,
  Typography,
  Select,
  Button,
  Spin,
  Empty,
  Divider,
  DatePicker,
  Tabs,
  Badge,
  notification,
  Tag,
  Avatar,
} from "antd";
import {
  CalendarOutlined,
  FilterOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  FileSearchOutlined,
  UserOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";

const { Title, Text } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;

interface UserQueryDocumentStatus {
  userDocumentId: string | null;
  userId: string | null;
  filePath: string | null;
  fileName: string | null;
  createdDate: string | null;
  adminDocumentId: string | null;
  adminUploadedFileName: string | null;
  adminUploadedFilePath: string | null;
  adminUploadCreatedDate: string | null;
  projectType: string | null;
}

interface PendingUserTaskResponse {
  // Define this interface based on your actual data structure
}

interface TaskData {
  userId: string;
  planOftheDay: string;
  planCreatedAt: string;
  planUpdatedAt: string;
  planStatus: string;
  updatedBy: string;
  taskStatus: string;
  taskAssignTo: string;
  adminDocumentId: string | null;
  userDocumentCreatedAt: string | null;
  userDocumentId: string | null;
  adminDocumentUpdatedAt: string | null;
  adminComments: string | null;
  adminCommentsUpdatedBy: string | null;
  adminCommentsUpdatedAt: string | null;
  id: string;
  userQueryDocumentStatus: UserQueryDocumentStatus;
  pendingUserTaskResponse: PendingUserTaskResponse[];
  endOftheDay: string;
}

const AllStatusPage: React.FC = () => {
  const [status, setStatus] = useState<string>("COMPLETED");
  const [tasks, setTasks] = useState<TaskData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [userId, setUserId] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs | null>(dayjs());
  const [activeTab, setActiveTab] = useState<string>("general");
  const taskId = localStorage.getItem("taskId");

  useEffect(() => {
    // Get userId from localStorage
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);

  const fetchAllTasks = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${BASE_URL}/user-service/write/getAllTaskUpdates`,
        {
          taskStatus: status,
          userId: userId,
          id: taskId,
        },
        {
          headers: {
            accept: "*/*",
            "Content-Type": "application/json",
          },
        }
      );

      setTasks(response.data);
      if (response.data.length === 0) {
        notification.info({
          message: "No Tasks Found",
          description: `No ${status.toLowerCase()} tasks found.`,
          placement: "topRight",
          icon: <FileSearchOutlined style={{ color: "#1890ff" }} />,
        });
      } else {
        notification.success({
          message: "Tasks Loaded",
          description: `Found ${
            response.data.length
          } ${status.toLowerCase()} tasks.`,
          placement: "topRight",
          duration: 3,
          icon: <CheckCircleOutlined style={{ color: "#52c41a" }} />,
        });
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
      notification.error({
        message: "Error Fetching Tasks",
        description: "Failed to fetch tasks. Please try again later.",
        placement: "topRight",
        duration: 4,
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchTasksByDate = async () => {
    if (!selectedDate) {
      notification.warning({
        message: "Missing Date",
        description: "Please select a date.",
        placement: "topRight",
        duration: 3,
      });
      return;
    }

    setLoading(true);
    try {
      const formattedDate = selectedDate.format("YYYY-MM-DD");

      const response = await axios.post(
        `${BASE_URL}/user-service/write/get-task-by-date`,
        {
          taskStatus: status,
          specificDate: formattedDate,
          userId: userId,
        },
        {
          headers: {
            accept: "*/*",
            "Content-Type": "application/json",
          },
        }
      );

      setTasks(response.data);
      if (response.data.length === 0) {
        notification.info({
          message: "No Tasks Found",
          description: `No ${status.toLowerCase()} tasks found for ${formattedDate}.`,
          placement: "topRight",
          duration: 3,
          icon: <FileSearchOutlined style={{ color: "#1890ff" }} />,
        });
      } else {
        notification.success({
          message: "Tasks Found",
          description: `Found ${response.data.length} tasks for ${formattedDate}.`,
          placement: "topRight",
          duration: 3,
          icon: <CheckCircleOutlined style={{ color: "#52c41a" }} />,
        });
      }
    } catch (error) {
      console.error("Error fetching tasks by date:", error);
      notification.error({
        message: "Fetch Failed",
        description: "Failed to fetch tasks. Please try again later.",
        placement: "topRight",
        duration: 4,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (value: string) => {
    setStatus(value);
  };

  const handleDateChange = (date: dayjs.Dayjs | null) => {
    setSelectedDate(date);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";

    try {
      const date = new Date(dateString);
      return date.toLocaleString();
    } catch (e) {
      return dateString;
    }
  };

  const handleTabChange = (key: string) => {
    setActiveTab(key);
    setTasks([]); // Clear previous results when switching tabs
  };

  const renderTaskCard = (task: TaskData) => (
    <Card
      key={task.id}
      className="mb-4 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
      headStyle={{
        backgroundColor:
          task.taskStatus === "COMPLETED" ? "#f6ffed" : "#fff7e6",
        borderBottom: `1px solid ${
          task.taskStatus === "COMPLETED" ? "#b7eb8f" : "#ffe58f"
        }`,
        borderRadius: "8px 8px 0 0",
        padding: "12px 20px",
      }}
      bodyStyle={{ padding: "16px 20px" }}
      title={
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Avatar
              icon={<UserOutlined />}
              style={{
                backgroundColor:
                  task.taskStatus === "COMPLETED" ? "#52c41a" : "#faad14",
                color: "white",
              }}
            />
            <div>
              <Text strong className="text-gray-800 text-lg">
                {task.taskAssignTo}
              </Text>
              <Text className="text-gray-500 text-sm ml-2">
                Updated by: {task.updatedBy}
              </Text>
            </div>
          </div>
          <Badge
            status={task.taskStatus === "COMPLETED" ? "success" : "warning"}
            text={
              <Tag
                color={task.taskStatus === "COMPLETED" ? "success" : "warning"}
                icon={
                  task.taskStatus === "COMPLETED" ? (
                    <CheckCircleOutlined />
                  ) : (
                    <ClockCircleOutlined />
                  )
                }
              >
                {task.taskStatus}
              </Tag>
            }
          />
        </div>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
          <Text className="text-gray-600 font-medium block mb-2">
            Plan of the Day:
          </Text>
          <div className="max-h-32 overflow-y-auto bg-white p-3 rounded-md border border-gray-100">
            <Text className="whitespace-pre-wrap text-gray-700">
              {task.planOftheDay || "No plan recorded"}
            </Text>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
          <Text className="text-gray-600 font-medium block mb-2">
            End of the Day:
          </Text>
          <div className="max-h-32 overflow-y-auto bg-white p-3 rounded-md border border-gray-100">
            <Text className="whitespace-pre-wrap text-gray-700">
              {task.endOftheDay || "No end-of-day report"}
            </Text>
          </div>
        </div>
      </div>

      <Divider className="my-3" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div className="flex items-center gap-2 text-gray-500">
          <CalendarOutlined />
          <Text>Created: {formatDate(task.planCreatedAt)}</Text>
        </div>

        <div className="flex items-center gap-2 text-gray-500">
          <CalendarOutlined />
          <Text>Updated: {formatDate(task.planUpdatedAt)}</Text>
        </div>
      </div>
    </Card>
  );

  return (
    <UserPanelLayout>
      <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
        <Card
          className="shadow-md rounded-lg overflow-hidden border-0"
          bodyStyle={{ padding: 0 }}
        >
          <div className="bg-gradient-to-r from-blue-500 to-blue-400 p-6 text-white">
            <Title level={2} className="text-white mb-1">
              Task Status
            </Title>
            <Text className="text-blue-100">View and manage task statuses</Text>
          </div>

          <div className="p-6">
            <Tabs
              activeKey={activeTab}
              onChange={handleTabChange}
              className="mb-6"
              type="card"
            >
              <TabPane
                tab={
                  <span>
                    <FileSearchOutlined className="mr-2" />
                    All Tasks
                  </span>
                }
                key="general"
              />
              <TabPane
                tab={
                  <span>
                    <CalendarOutlined className="mr-2" />
                    Tasks By Date
                  </span>
                }
                key="byDate"
              />
            </Tabs>

            <Card className="bg-gray-50 mb-6 border border-gray-200">
              <div className="flex flex-col md:flex-row md:items-end gap-4">
                <div className="flex-1 md:max-w-xs">
                  <Text className="text-gray-600 block mb-1 font-medium">
                    <FilterOutlined className="mr-1" /> Status Filter
                  </Text>
                  <Select
                    value={status}
                    onChange={handleStatusChange}
                    className="w-full"
                    size="large"
                  >
                    <Option value="PENDING">
                      <div className="flex items-center">
                        <ClockCircleOutlined className="text-orange-500 mr-2" />
                        <span>PENDING</span>
                      </div>
                    </Option>
                    <Option value="COMPLETED">
                      <div className="flex items-center">
                        <CheckCircleOutlined className="text-green-500 mr-2" />
                        <span>COMPLETED</span>
                      </div>
                    </Option>
                  </Select>
                </div>

                {activeTab === "byDate" && (
                  <div className="flex-1 md:max-w-xs">
                    <Text className="text-gray-600 block mb-1 font-medium">
                      <CalendarOutlined className="mr-1" /> Select Date
                    </Text>
                    <DatePicker
                      value={selectedDate}
                      onChange={handleDateChange}
                      className="w-full"
                      size="large"
                    />
                  </div>
                )}

                <div>
                  <Button
                    type="primary"
                    size="large"
                    icon={<SearchOutlined />}
                    onClick={
                      activeTab === "general" ? fetchAllTasks : fetchTasksByDate
                    }
                    className="bg-blue-600 hover:bg-blue-700 border-blue-600 hover:border-blue-700 shadow-sm w-full"
                  >
                    Search Tasks
                  </Button>
                </div>
              </div>
            </Card>

            {loading ? (
              <div className="flex flex-col items-center justify-center p-16">
                <Spin size="small" />
                <Text className="mt-4 text-gray-500">Loading tasks...</Text>
              </div>
            ) : tasks.length > 0 ? (
              <div>{tasks.map(renderTaskCard)}</div>
            ) : (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={
                  <div className="text-center">
                    <Text className="text-gray-500 block mb-2">
                      No tasks found
                    </Text>
                    <Text className="text-gray-400 text-sm">
                      Use the filters above to search for tasks
                    </Text>
                  </div>
                }
                className="py-16"
              />
            )}
          </div>
        </Card>
      </div>
    </UserPanelLayout>
  );
};

export default AllStatusPage;
