import React, { useState, useEffect } from "react";
import BASE_URL from "../../Config";
import {
  Button,
  notification,
  Spin,
  Typography,
  Select,
  Form,
  Input,
  Card,
  List,
  Upload,
  Tag,
  message,
  Progress,
} from "antd";
import {
  UploadOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  FileOutlined,
} from "@ant-design/icons";
import UserPanelLayout from "./UserPanelLayout";
import axios from "axios";
import dayjs from "dayjs";

const { TextArea } = Input;
const { Text, Title, Paragraph } = Typography;
const { Option } = Select;



interface UserDocumentStatus {
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
  // Add properties if needed
}

interface Task {
  id: string;
  userId: string;
  planOftheDay: string;
  planCreatedAt: string;
  planUpdatedAt: string | null;
  planStatus: string;
  updatedBy: string;
  taskStatus: "COMPLETED" | "PENDING";
  taskAssignTo: string;
  adminDocumentId: string | null;
  userDocumentCreatedAt: string | null;
  userDocumentId: string | null;
  adminDocumentUpdatedAt: string | null;
  adminComments: string | null;
  adminCommentsUpdatedBy: string | null;
  adminCommentsUpdatedAt: string | null;
  userQueryDocumentStatus: UserDocumentStatus;
  pendingUserTaskResponse: PendingUserTaskResponse[];
  endOftheDay: string | null;
}

interface TaskFormValues {
  id: string;
  userId: string;
  taskStatus: "COMPLETED" | "PENDING";
  endOftheDay: string;
  userDocumentId?: string | null;
}

interface ApiResponse {
  success: boolean;
  message?: string;
  id?: string;
}

const TaskUpdate: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [fetchingTasks, setFetchingTasks] = useState<boolean>(true);
  const [userId, setUserId] = useState<string>("");
  const [currentDate] = useState<dayjs.Dayjs>(dayjs());
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [documentId, setDocumentId] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [uploadStatus, setUploadStatus] = useState<
    "idle" | "uploading" | "uploaded" | "failed"
  >("idle");
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [form] = Form.useForm<TaskFormValues>();

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      setUserId(storedUserId);
      fetchTasksByDate(storedUserId);
    }
  }, []);

  const fetchTasksByDate = async (userIdValue: string) => {
    setFetchingTasks(true);
    try {
      const formattedDate = currentDate.format("YYYY-MM-DD");
      const response = await axios.post(
        `${BASE_URL}/user-service/write/get-task-by-date`,
        {
          taskStatus: "PENDING",
          specificDate: formattedDate,
          userId: userIdValue,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setTasks(response.data);

      // If tasks are available, select the first one by default
      if (response.data && response.data.length > 0) {
        selectTask(response.data[0]);
      } else {
        setSelectedTask(null);
        form.resetFields();
        form.setFieldsValue({ userId: userIdValue });
      }
    } catch (error: any) {
      notification.error({
        message: "Error",
        description: error.response?.data?.message || "Failed to fetch tasks",
      });
      console.error("Error fetching tasks:", error);
    } finally {
      setFetchingTasks(false);
    }
  };

  const selectTask = (task: Task) => {
    setSelectedTask(task);
    form.setFieldsValue({
      id: task.id,
      userId: task.userId,
      taskStatus: task.taskStatus,
      endOftheDay: task.endOftheDay || "",
      userDocumentId: task.userDocumentId,
    });
  };

  const updateTask = async (values: TaskFormValues): Promise<void> => {
    setLoading(true);
    try {
      const payload: TaskFormValues = {
        endOftheDay: values.endOftheDay,
        id: values.id,
        taskStatus: values.taskStatus,
        userId: values.userId,
        userDocumentId: documentId || values.userDocumentId,
      };

      const response = await axios.patch<ApiResponse>(
        `${BASE_URL}/user-service/write/userTaskUpdate`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        notification.success({
          message: "Success",
          description: response.data.message || "Task updated successfully",
        });

        // Refresh tasks
        fetchTasksByDate(userId);
      } else {
        notification.warning({
          message: "Warning",
          description:
            response.data.message || "Task update completed with warnings",
        });
      }
    } catch (error: any) {
      notification.error({
        message: "Error",
        description: error.response?.data?.message || "Failed to update task",
      });
      console.error("Error updating task:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      message.warning("Please select a file to upload.");
      return;
    }

    const file = e.target.files[0];

    setFileName(file.name);
    setUploadStatus("uploading");
    setUploadProgress(0);

    // Prepare form data
    const formData = new FormData();
    formData.append("file", file);
    formData.append("fileType", "kyc");

    try {
      const response = await axios.post(
        `${BASE_URL}/user-service/write/uploadTaskScreenShot?userId=${userId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent: any) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(percentCompleted);
          },
        }
      );

      // Set document ID in state and save to local storage
      const docId = response.data.id;
      setDocumentId(docId);

      // Store in local storage with a timestamp
      localStorage.setItem("taskDocumentId", docId);
      localStorage.setItem("taskDocumentTimestamp", new Date().toISOString());
      localStorage.setItem("taskDocumentName", file.name);

      message.success("Document uploaded successfully!");
      setUploadStatus("uploaded");
    } catch (error: any) {
      console.error("Upload Error:", error);
      message.error(
        error.response?.data?.error || "An error occurred during upload"
      );

      setUploadStatus("failed");
    }
  };

  const renderUploadStatus = () => {
    switch (uploadStatus) {
      case "uploading":
        return (
          <div className="w-full">
            <div className="flex items-center">
              <Spin size="small" className="mr-2" />
              <Text>Uploading: {fileName}</Text>
            </div>
            <Progress percent={uploadProgress} size="small" status="active" />
          </div>
        );
      case "uploaded":
        return (
          <div className="flex items-center">
            <FileOutlined className="mr-2 text-green-500" />
            <Text className="mr-2">{fileName}</Text>
            <Tag color="green">Uploaded</Tag>
          </div>
        );
      case "failed":
        return (
          <div className="flex items-center">
            <FileOutlined className="mr-2 text-red-500" />
            <Text className="mr-2">{fileName}</Text>
            <Tag color="red">Failed</Tag>
          </div>
        );
      default:
        return <Text type="secondary">No file selected</Text>;
    }
  };

  return (
    <UserPanelLayout>
      <div className="max-w-6xl mx-auto">
        <Card
          title={
            <div className="flex justify-between items-center">
              <span>Today Update - {currentDate.format("YYYY-MM-DD")}</span>
              {fetchingTasks ? <Spin size="small" /> : null}
            </div>
          }
          className="mb-6 shadow-md"
        >
          {fetchingTasks ? (
            <div className="flex justify-center items-center py-12">
              <Spin size="small" tip="Loading your tasks..." />
            </div>
          ) : tasks.length > 0 ? (
            <List
              itemLayout="vertical"
              dataSource={tasks}
              renderItem={(task) => (
                <List.Item
                  className={`border rounded-md p-4 mb-4 hover:bg-gray-50 transition-colors 
                    ${
                      task.id === selectedTask?.id
                        ? "bg-blue-50 border-blue-300"
                        : ""
                    }`}
                  onClick={() => selectTask(task)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <Title
                          level={5}
                          className="mb-2 px-2 py-1 rounded font-bold"
                        >
                          Plan of the day
                        </Title>
                        {task.taskStatus === "COMPLETED" ? (
                          <Tag
                            icon={<CheckCircleOutlined />}
                            color="success"
                            className="ml-auto"
                          >
                            COMPLETED
                          </Tag>
                        ) : (
                          <Tag
                            icon={<ClockCircleOutlined />}
                            color="warning"
                            className="ml-auto"
                          >
                            PENDING
                          </Tag>
                        )}
                      </div>
                      <Paragraph className="pl-4">
                        {task.planOftheDay}
                      </Paragraph>
                    </div>
                  </div>
                </List.Item>
              )}
            />
          ) : (
            <div className="text-center py-12">
              <Title level={4} type="secondary">
                No tasks found for today
              </Title>
              <Paragraph type="secondary">
                There are no pending tasks assigned to you for today.
              </Paragraph>
            </div>
          )}
        </Card>

        {selectedTask && (
          <Card title="Update Task Status" className="shadow-md">
            <Form<TaskFormValues>
              form={form}
              layout="vertical"
              onFinish={updateTask}
              initialValues={{
                id: selectedTask.id,
                userId: selectedTask.userId,
                taskStatus: selectedTask.taskStatus,
                endOftheDay: selectedTask.endOftheDay || "",
              }}
            >
              <Form.Item name="id" hidden>
                <Input />
              </Form.Item>

              <Form.Item name="userId" hidden>
                <Input />
              </Form.Item>

              <Form.Item name="userDocumentId" hidden>
                <Input />
              </Form.Item>

              <Form.Item
                label="Task Status"
                name="taskStatus"
                rules={[
                  { required: true, message: "Please select the task status" },
                ]}
              >
                <Select
                  onChange={(value) =>
                    value === "COMPLETED" &&
                    form.setFieldsValue({
                      endOftheDay:
                        form.getFieldValue("endOftheDay") ||
                        "Task completed successfully",
                    })
                  }
                >
                  <Option value="COMPLETED">COMPLETED</Option>
                  <Option value="PENDING">PENDING</Option>
                </Select>
              </Form.Item>

              <Form.Item
                label="End of Day Note"
                name="endOftheDay"
                rules={[
                  {
                    required: true,
                    message: "Please enter an end of day note",
                  },
                ]}
              >
                <TextArea
                  placeholder="Summarize what you accomplished today..."
                  rows={4}
                />
              </Form.Item>

              <Form.Item label="Upload Screenshot (Optional)">
                <Card
                  className="mb-4 bg-gray-50"
                  size="small"
                  title={
                    <div className="flex items-center">
                      <UploadOutlined className="mr-2" />
                      <span>Attachment</span>
                    </div>
                  }
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <label className="cursor-pointer">
                      <input
                        type="file"
                        onChange={handleFileChange}
                        className="hidden"
                        disabled={uploadStatus === "uploading"}
                        accept="image/*,.pdf,.doc,.docx"
                      />
                      <Button
                        icon={<UploadOutlined />}
                        loading={uploadStatus === "uploading"}
                      >
                        Select File
                      </Button>
                    </label>

                    <div className="flex-grow">{renderUploadStatus()}</div>
                  </div>
                </Card>
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  size="large"
                  block
                >
                  Update Task
                </Button>
              </Form.Item>
            </Form>
          </Card>
        )}
      </div>
    </UserPanelLayout>
  );
};

export default TaskUpdate;
