import { AxiosPromise } from 'axios';

import BaseApi from '../base.api';

export class MenuApi extends BaseApi {
  public getMenuList = (): AxiosPromise<any> => {
    return this.http.post(`${this.prefix}/adv?sort=sortOrder,asc`);
  };

  public getPermissions = (): AxiosPromise<any> => {
    return this.http.get(`${this.prefix}/getPermissions`);
  };
}

export default new MenuApi('/services/user/api/menu');
