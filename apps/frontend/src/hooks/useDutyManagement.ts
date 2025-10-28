import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { App as AntApp, Form } from "antd";
import type { SorterResult } from "antd/es/table/interface";
import { Duty, GetDutiesResponse } from "shared";
import * as dutyService from "../services/duty.service";
import { useApi } from "./useApi";

interface UseDutyManagementReturn {
  searchParams: URLSearchParams;
  setSearchParams: (
    params: URLSearchParams | ((prev: URLSearchParams) => URLSearchParams),
  ) => void;
  page: number;
  limit: number;
  sortBy: string | null;
  order: string | null;
  data: GetDutiesResponse | null;
  loading: boolean;
  fetchDuties: (
    params: dutyService.GetDutiesParams,
  ) => Promise<void | GetDutiesResponse>;
  isModalVisible: boolean;
  editingDuty: Duty | null;
  isFormValid: boolean;
  actionLoading: boolean;
  form: any;
  notification: any;
  handlePageChange: (newPage: number) => void;
  handleOk: () => void;
  handleCancel: () => void;
  onFinish: (values: { name: string }) => void;
  showAddModal: () => void;
  showEditModal: (duty: Duty) => void;
  handleDelete: (id: string) => Promise<void>;
  handleFormChange: () => void;
  handleTableChange: (
    _: any,
    __: any,
    newSorter: SorterResult<Duty> | SorterResult<Duty>[],
  ) => void;
}

export const useDutyManagement = (): UseDutyManagementReturn => {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get("page") || "1", 10);
  const sortBy = searchParams.get("sortBy");
  const order = searchParams.get("order");
  const limit = 10;

  const {
    data,
    loading,
    request: fetchDuties,
  } = useApi<GetDutiesResponse>(dutyService.getDuties, {
    errorNotification: "Could not load the list of duties.",
  });

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingDuty, setEditingDuty] = useState<Duty | null>(null);
  const [isFormValid, setIsFormValid] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [form] = Form.useForm();
  const { notification } = AntApp.useApp();

  const memoizedFetchDuties = useCallback(() => {
    const fetchParams: {
      page: number;
      limit: number;
      sortBy?: string;
      order?: string;
    } = { page, limit };
    if (sortBy && order) {
      fetchParams.sortBy = sortBy;
      fetchParams.order = order;
    }
    fetchDuties(fetchParams);
  }, [fetchDuties, page, limit, sortBy, order]);

  useEffect(() => {
    memoizedFetchDuties();
  }, [memoizedFetchDuties]);

  const handlePageChange = useCallback(
    (newPage: number) => {
      setSearchParams((prev) => {
        const newSearchParams = new URLSearchParams(prev);
        newSearchParams.set("page", newPage.toString());
        return newSearchParams;
      });
    },
    [setSearchParams],
  );

  const handleOk = useCallback(() => {
    form.submit();
  }, [form]);

  const handleCancel = useCallback(() => {
    setIsModalVisible(false);
    setEditingDuty(null);
    form.resetFields();
  }, [form]);

  const onFinish = useCallback(
    async (values: { name: string }) => {
      setActionLoading(true);
      const action = editingDuty
        ? dutyService.updateDuty(editingDuty.id, values.name)
        : dutyService.createDuty(values.name);

      try {
        await action;
        notification.success({
          message: "Success",
          description: `Duty successfully ${editingDuty ? "updated" : "created"}.`,
        });
        memoizedFetchDuties();
        handleCancel();
      } catch (err) {
        console.log(err);
      } finally {
        setActionLoading(false);
      }
    },
    [editingDuty, memoizedFetchDuties, handleCancel, notification],
  );

  const showAddModal = useCallback(() => {
    setEditingDuty(null);
    form.resetFields();
    setIsFormValid(false);
    setIsModalVisible(true);
  }, [form]);

  const showEditModal = useCallback(
    (duty: Duty) => {
      setEditingDuty(duty);
      form.setFieldsValue(duty);
      setIsModalVisible(true);
    },
    [form],
  );

  const handleDelete = useCallback(
    async (id: string) => {
      setActionLoading(true);
      try {
        await dutyService.deleteDuty(id);
        notification.success({
          message: "Success",
          description: "Duty successfully deleted.",
        });
        if (data && data.duties && data.duties.length === 1 && page > 1) {
          handlePageChange(page - 1);
        } else {
          memoizedFetchDuties();
        }
      } catch (err) {
        console.error(err);
      } finally {
        setActionLoading(false);
      }
    },
    [data, memoizedFetchDuties, handlePageChange, notification, page],
  );

  const handleFormChange = useCallback(() => {
    const hasErrors = form
      .getFieldsError()
      .some(({ errors }) => errors.length > 0);
    const nameValue = form.getFieldValue("name");
    setIsFormValid(!hasErrors && !!nameValue);
  }, [form]);

  const handleTableChange = useCallback(
    (_: any, __: any, newSorter: SorterResult<Duty> | SorterResult<Duty>[]) => {
      const currentSorter = Array.isArray(newSorter) ? newSorter[0] : newSorter;
      const newParams: { page: string; sortBy?: string; order?: string } = {
        page: "1",
      };

      if (currentSorter.order && currentSorter.field) {
        newParams.sortBy = String(currentSorter.field);
        newParams.order = currentSorter.order === "ascend" ? "asc" : "desc";
      }

      const filteredParams = Object.fromEntries(
        Object.entries(newParams).filter(([_, v]) => v != null),
      );

      setSearchParams(filteredParams as Record<string, string>);
    },
    [setSearchParams],
  );

  return {
    searchParams,
    setSearchParams,
    page,
    limit,
    sortBy,
    order,
    data,
    loading,
    fetchDuties,
    isModalVisible,
    editingDuty,
    isFormValid,
    actionLoading,
    form,
    notification,
    handlePageChange,
    handleOk,
    handleCancel,
    onFinish,
    showAddModal,
    showEditModal,
    handleDelete,
    handleFormChange,
    handleTableChange,
  };
};
