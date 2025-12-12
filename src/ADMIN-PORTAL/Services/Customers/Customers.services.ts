// src/services/CustomerService.ts

import { API_ENDPOINTS } from "../../../CONSTANTS/API_ENDPOINTS";
import HttpService from "../../../Services/HttpService";
import type { CustomResponse } from "../../../Types/ApiTypes";
import type { Customer } from "../../Types/Customers/Customers.types";


const CustomerService = {
  async getAllCustomers(): Promise<Customer[]> {
    const response = await HttpService.callApi<CustomResponse<Customer[]>>(
      API_ENDPOINTS.CUSTOMER.GET_ALL,
      "GET"
    );
    return response.value;
  },

 async getCustomerById(id: number): Promise<CustomResponse<Customer>> {
  const response = await HttpService.callApi<CustomResponse<Customer>>(
    API_ENDPOINTS.CUSTOMER.GET_BY_ID(id),
    "GET"
  );
  return response; // Return full response, not just value
},

  async createCustomer(
    data: Omit<Customer, "customerId" | "auditLogs">
  ): Promise<Customer> {
    const response = await HttpService.callApi<CustomResponse<Customer>>(
      API_ENDPOINTS.CUSTOMER.CREATE,
      "POST",
      data
    );
    return response.value;
  },

  async updateCustomer(
    id: number,
    data: Partial<Omit<Customer, "customerId" | "auditLogs">>
  ): Promise<Customer> {
    const response = await HttpService.callApi<CustomResponse<Customer>>(
      API_ENDPOINTS.CUSTOMER.UPDATE(id),
      "PUT",
      data
    );
    return response.value;
  },

  async deleteCustomer(id: number): Promise<void> {
    await HttpService.callApi<CustomResponse<void>>(
      API_ENDPOINTS.CUSTOMER.DELETE(id),
      "DELETE"
    );
  },
};

export default CustomerService;
