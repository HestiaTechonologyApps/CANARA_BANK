export class HttpService {
  static async callApi<T>(
    endpoint: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' = 'GET',
    data?: any,
    isPublic: boolean = false,
    isFormData: boolean = false
  ): Promise<T> {
    const token = localStorage.getItem('jwt_token');
    const headers: Record<string, string> = {};

    if (!isFormData) {
      headers['Content-Type'] = 'application/json';
    }

    if (!isPublic && token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(endpoint, {
      method,
      headers,
      body: method !== 'GET' ? (isFormData ? data : JSON.stringify(data)) : undefined,
    });

    if (response.status === 401) {
      throw new Error('Unauthorized access. Please log in again.');
    }

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(`Error: ${response.status} - ${errorMessage}`);
    }

    return response.json();
  }

  static async downloadFile(url: string, fileName: string): Promise<void> {
    const token = localStorage.getItem('jwt_token');
    const headers: Record<string, string> = {};

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, { headers });
    
    if (!response.ok) throw new Error(`Download error: ${response.status}`);

    const blob = await response.blob();
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(link.href);
  }
}

export default HttpService;