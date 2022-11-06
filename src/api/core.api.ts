import { AxiosPromise } from 'axios';
import BaseApi, { buildSearchStr } from '@/api/base.api';
// import { getCurrentOrg } from '@/utils';

const getCurrentOrg = () => {
  return { id: '', parentId: '' };
};
export default class CoreApi extends BaseApi {
  public create = (data: any): AxiosPromise<any> => {
    this.setOrgId(data);
    return this.http.post(`${this.prefix}/`, data);
  };

  public fetch = (pageable: any): AxiosPromise<any> => {
    const currentOrg = getCurrentOrg();
    if (!currentOrg || !currentOrg.id) {
      return Promise.reject(new Error('current organization is null'));
    }

    let searchStr = buildSearchStr(pageable);
    if (searchStr !== '') {
      searchStr += ' and ';
    }
    searchStr += ` orgId = ${currentOrg.id}`;
    if (searchStr && searchStr.trim() !== '') {
      return this.advancedSearch(searchStr, pageable);
    }
    return Promise.resolve(null);
  };

  public setOrgId(data) {
    const currentOrg = getCurrentOrg();
    if (!currentOrg || !currentOrg.id) {
      return Promise.reject(new Error('current organization is null'));
    }
    data.orgId = currentOrg.id;
    data.parentOrgId = currentOrg.parentId;
    return Promise.resolve(null);
  }
}
