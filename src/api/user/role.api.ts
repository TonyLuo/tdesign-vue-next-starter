import { AxiosPromise } from 'axios';

import BaseApi from '../base.api';

export class RoleApi extends BaseApi {
  public getRoleDetail = (roleId): AxiosPromise<any> => {
    return this.http.get(`${this.prefix}/${roleId}/detail`);
  };

  public findAllByTenantId = (): AxiosPromise<any> => {
    return this.http.get(`${this.prefix}/findByTenantId`);
  };
}

export default new RoleApi('/services/user/api/role');
