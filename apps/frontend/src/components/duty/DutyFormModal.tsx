import React from "react";
import { Modal, Form } from "antd";
import { Input } from "../Input"; // Custom Input
import { Duty } from "shared";

interface DutyFormModalProps {
  isModalVisible: boolean;
  editingDuty: Duty | null;
  form: any; // Ant Design FormInstance
  isFormValid: boolean;
  actionLoading: boolean;
  handleOk: () => void;
  handleCancel: () => void;
  onFinish: (values: { name: string }) => void;
  handleFormChange: () => void;
}

export const DutyFormModal: React.FC<DutyFormModalProps> = ({
  isModalVisible,
  editingDuty,
  form,
  isFormValid,
  actionLoading,
  handleOk,
  handleCancel,
  onFinish,
  handleFormChange,
}) => {
  return (
    <Modal
      title={editingDuty ? "Edit Duty" : "Add Duty"}
      open={isModalVisible}
      onOk={handleOk}
      onCancel={handleCancel}
      confirmLoading={actionLoading}
      okButtonProps={{ disabled: !isFormValid }}
    >
      <Form
        form={form}
        onFinish={onFinish}
        onValuesChange={handleFormChange}
        layout="vertical"
      >
        <Form.Item
          name="name"
          label="Duty Name"
          rules={[
            { required: true, message: "Please input the name of the duty!" },
          ]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};
