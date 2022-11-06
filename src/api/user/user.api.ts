import { AxiosPromise } from 'axios';

import BaseApi from '../base.api';

export class UserApi extends BaseApi {
  public getAllAuthorities = (): AxiosPromise<any> => {
    return this.http.get(`${this.prefix}/getAllAuthorities`);
  };
}

export default new UserApi('/services/user/api/user');
