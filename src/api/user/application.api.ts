import { AxiosPromise } from 'axios';

import BaseApi from '../base.api';

export class AppApi extends BaseApi {
  public checkUpdate = (appId, version): AxiosPromise<any> => {
    return this.http.get(`${this.prefix}/check-update/${appId}/${version}`);
  };
}

export default new AppApi('/services/user/api/application');
