import React from "react";
import { useDutyManagement } from "./hooks/useDutyManagement";
import { AppLayout } from "./components/layouts/AppLayout";
import { DutyFormModal } from "./components/duty/DutyFormModal";
import { DutyList } from "./components/duty/DutyList";

const App = () => {
  const {
    page,
    limit,
    data,
    loading,
    isModalVisible,
    editingDuty,
    isFormValid,
    actionLoading,
    form,
    handlePageChange,
    handleOk,
    handleCancel,
    onFinish,
    showAddModal,
    showEditModal,
    handleDelete,
    handleFormChange,
    sortBy,
    order,
    handleTableChange,
  } = useDutyManagement();

  return (
    <AppLayout>
      <DutyList
        data={data}
        loading={loading}
        page={page}
        limit={limit}
        sortBy={sortBy}
        order={order}
        handlePageChange={handlePageChange}
        showEditModal={showEditModal}
        handleDelete={handleDelete}
        showAddModal={showAddModal}
        handleTableChange={handleTableChange}
      />
      <DutyFormModal
        isModalVisible={isModalVisible}
        editingDuty={editingDuty}
        form={form}
        isFormValid={isFormValid}
        actionLoading={actionLoading}
        handleOk={handleOk}
        handleCancel={handleCancel}
        onFinish={onFinish}
        handleFormChange={handleFormChange}
      />
    </AppLayout>
  );
};

export default App;
