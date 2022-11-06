// import { defHttp } from '/@/utils/http/axios';
import { request } from '@/utils/request';

export class Http {
  get<T = any>(url: string): Promise<T> {
    return request.get({ url });
  }

  post<T = any>(url: string, params?: any): Promise<T> {
    return request.post({ url, params });
  }

  put<T = any>(url: string, params?: any): Promise<T> {
    return request.put({ url, params });
  }

  delete<T = any>(url: string, params?: any): Promise<T> {
    return request.delete({ url, params });
  }
}

export default new Http();
