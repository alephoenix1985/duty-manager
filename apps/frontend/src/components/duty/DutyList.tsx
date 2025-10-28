import React from "react";
import { Table, Pagination, Space, Popconfirm, Typography } from "antd";
import type { ColumnsType, SorterResult } from "antd/es/table/interface";
import { Button } from "../Button";
import { Link } from "../Link";
import { Duty, GetDutiesResponse } from "shared";

interface DutyListProps {
  data: GetDutiesResponse | null;
  loading: boolean;
  page: number;
  limit: number;
  sortBy: string | null;
  order: string | null;
  handlePageChange: (newPage: number) => void;
  showEditModal: (duty: Duty) => void;
  handleDelete: (id: string) => Promise<void>;
  showAddModal: () => void;
  handleTableChange: (
    _: any,
    __: any,
    newSorter: SorterResult<Duty> | SorterResult<Duty>[],
  ) => void;
}

export const DutyList: React.FC<DutyListProps> = ({
  data,
  loading,
  page,
  limit,
  sortBy,
  order,
  handlePageChange,
  showEditModal,
  handleDelete,
  showAddModal,
  handleTableChange,
}) => {
  const totalPages = Math.ceil((data?.totalCount || 0) / limit);

  const itemRender = (
    current: number,
    type: string,
    originalElement: React.ReactNode,
  ) => {
    if (type === "prev" && page > 1) {
      return <Link page={page - 1}>Previous</Link>;
    }
    if (type === "next" && page < totalPages) {
      return <Link page={page + 1}>Next</Link>;
    }
    if (type === "page") {
      return <Link page={current}>{current}</Link>;
    }
    return null;
  };

  const columns: ColumnsType<Duty> = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: true,
      sortOrder:
        sortBy === "name"
          ? order === "asc"
            ? "ascend"
            : "descend"
          : undefined,
    },
    {
      title: "Action",
      key: "action",
      align: "center",
      render: (_: unknown, record: Duty) => (
        <Space
          size="middle"
          style={{ width: "100%", justifyContent: "flex-end" }}
        >
          <Button onClick={() => showEditModal(record)}>Edit</Button>
          <Popconfirm
            title="Delete the duty"
            description="Are you sure you want to delete this duty?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger>Delete</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <Button buttonType="primary" onClick={showAddModal}>
          Add Duty
        </Button>
        <Typography.Text>Total: {data?.totalCount || 0}</Typography.Text>
      </div>
      <Table
        columns={columns}
        dataSource={data?.duties || []}
        rowKey="id"
        loading={loading}
        pagination={false}
        onChange={handleTableChange}
        locale={{ emptyText: "No duties found. Add a new one to get started!" }}
      />
      <div style={{ display: "flex", justifyContent: "center", marginTop: 16 }}>
        <Pagination
          current={page}
          pageSize={limit}
          total={data?.totalCount || 0}
          onChange={handlePageChange}
          itemRender={itemRender}
          showSizeChanger={false}
        />
      </div>
    </>
  );
};
