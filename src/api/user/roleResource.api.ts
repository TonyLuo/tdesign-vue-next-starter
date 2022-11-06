import { AxiosPromise } from 'axios';

import BaseApi from '../base.api';

export class RoleResourceApi extends BaseApi {
  public updateInBatch = (roleResourceList: any): AxiosPromise<any> => {
    return this.http.put(`${this.prefix}/updateInBatch`, roleResourceList);
  };

  public findAllByRoleId = (roleId): AxiosPromise<any> => {
    return this.http.get(`${this.prefix}/findAll/${roleId}`);
  };

  public findAllByRoleIdAndResourceId = (roleId, resourceId): AxiosPromise<any> => {
    return this.http.get(`${this.prefix}/findAll/${roleId}/${resourceId}`);
  };
}

export default new RoleResourceApi('/services/user/api/roleResource');
