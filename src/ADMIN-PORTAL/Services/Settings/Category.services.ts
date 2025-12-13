// src/services/Settings/Category.services.ts

import { API_ENDPOINTS } from "../../../CONSTANTS/API_ENDPOINTS";
import HttpService from "../../../Services/HttpService";
import type { CustomResponse } from "../../../Types/ApiTypes";
import type { Category } from "../../Types/Settings/Category.types";

const CategoryService = {
  async getAllCategories(): Promise<Category[]> {
    const response = await HttpService.callApi<CustomResponse<Category[]>>(
      API_ENDPOINTS.CATEGORY.GET_ALL,
      'GET'
    );
    return response.value;
  },

  async getCategoryById(id: number): Promise<CustomResponse<Category>> {
    const response = await HttpService.callApi<CustomResponse<Category>>(
      API_ENDPOINTS.CATEGORY.GET_BY_ID(id),
      'GET'
    );
    return response;
  },

  async createCategory(data: Omit<Category, 'categoryId' | 'auditLogs'>): Promise<Category> {
    const response = await HttpService.callApi<CustomResponse<Category>>(
      API_ENDPOINTS.CATEGORY.CREATE,
      'POST',
      data
    );
    return response.value;
  },

  async updateCategory(id: number, data: Partial<Omit<Category, 'categoryId' | 'auditLogs'>>): Promise<Category> {
    const response = await HttpService.callApi<CustomResponse<Category>>(
      API_ENDPOINTS.CATEGORY.UPDATE(id),
      'PUT',
      data
    );
    return response.value;
  },

  async deleteCategory(id: number): Promise<void> {
    await HttpService.callApi<CustomResponse<void>>(
      API_ENDPOINTS.CATEGORY.DELETE(id),
      'DELETE'
    );
  },
};

export default CategoryService;