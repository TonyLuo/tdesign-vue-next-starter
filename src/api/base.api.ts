import { AxiosPromise } from 'axios';

import httpUtil from '@/utils/http';
/**
 *
 * @param pageable
pageable example:
 {
    page: this.page ,
    size: this.itemsPerPage,
    sort: ['id,asc','name,desc','age,asc'],
  }

  {
    page: this.page ,
    size: this.itemsPerPage,
    sort: 'id,asc',
  }

  {
    page: this.page ,
    size: this.itemsPerPage,
    sort: this.sort(),
  }
  public sort(): any {
    const result = [this.propOrder + ',' + (this.reverse ? 'asc' : 'desc')];
    if (this.propOrder !== 'id') {
      result.push('id');
    }
    return result;
  }

  userApi.list({page:0,size:10,sort:['id,asc','name,desc']})
  userApi.list({page:0,size:10,sort:'id,asc'})
 */
const buildSearchCriteria = (schema, searchValue) => {
  console.log('buildSearchCriteria', schema, searchValue);
  if (
    searchValue == null ||
    typeof searchValue === 'undefined' ||
    (typeof searchValue === 'string' && searchValue.trim() === '') ||
    !schema
  ) {
    return undefined;
  }
  const parseValue = (component, searchValue, mode) => {
    console.log('parseValue mode', mode);
    if (['InputNumber', 'Input'].includes(component)) {
      return searchValue;
    }
    if (['DatePicker'].includes(component)) {
      return `'${searchValue.format('yyyy-MM-DD HH:mm:ss')}'`;
    }
    return `'${searchValue.toString().trim()}'`;
  };

  const buildSearchCriteria = (field, operator, component, mode) => {
    let searchCriteria = `${field} `;

    switch (operator.toLowerCase()) {
      // refer to
      // https://docs.spring.io/spring-data/jpa/docs/current/reference/html/#jpa.query-methods.query-creation

      case 'is':
      case 'equals':
      case '=':
        searchCriteria += `= ${parseValue(component, searchValue, mode)}`;
        break;
      case 'between':
        // eslint-disable-next-line no-case-declarations
        const secondValue = searchValue[1];
        // if (valueType && valueType.toLowerCase() === 'moment' && secondValue) {
        //     // secondValue = searchValue[1].hours(23).minutes(59).seconds(59)
        //     secondValue = secondValue.endOf('day');
        //     console.log(secondValue)

        // }
        // console.log('secondValue====' + (secondValue.endOf('day')).format("yyyy-MM-DD HH:mm:ss"))
        searchCriteria += `between ${parseValue(component, searchValue[0], mode)} and ${parseValue(
          schema,
          secondValue,
          mode,
        )}`;
        break;

      case 'lessthan':
      case 'lt':
      case 'before':
      case '<':
        searchCriteria += `< ${parseValue(component, searchValue, mode)}`;
        break;

      case 'lessthanequal':
      case 'lte':
      case '<=':
        searchCriteria += `<= ${parseValue(component, searchValue, mode)}`;
        break;

      case 'greaterthan':
      case 'gt':
      case 'after':
      case '>':
        searchCriteria += `> ${parseValue(component, searchValue, mode)}`;
        break;

      case 'greaterthanequal':
      case 'gte':
      case '>=':
        searchCriteria += `>= ${parseValue(component, searchValue, mode)}`;
        break;

      case 'like':
      case 'containing':
        searchCriteria += `like '*${searchValue}*'`;
        break;
      case 'notlike':
        searchCriteria += ` not like '${searchValue}'`;
        break;
      case 'startingwith':
        searchCriteria += `like '${searchValue}*'`;
        break;
      case 'endingwith':
        searchCriteria += `like '*${searchValue}'`;
        break;

      case 'not':
        searchCriteria += `<> ${parseValue(component, searchValue, mode)}`;
        break;
      case 'in':
        searchCriteria += `in ${searchValue}`;
        break;
      case 'notin':
        searchCriteria += `not in ${searchValue}`;
        break;
      // case 'ignorecase':
      //   searchCriteria += ` like '*${searchValue}*'`;
      //   break;

      default:
        searchCriteria += ` = '${searchValue}'`;
        break;
    }

    return searchCriteria;
  };
  // eslint-disable-next-line prefer-const
  let { field, operator, component, mode } = schema;
  const fieldList = field.split(',');
  operator = operator || '';

  if (Array.isArray(fieldList) && fieldList.length > 1) {
    let searchCriteria = '( ';

    fieldList.forEach((item) => {
      searchCriteria += `${buildSearchCriteria(item, operator, component, mode)} or `;
    });
    if (searchCriteria.substring(searchCriteria.length - 4, searchCriteria.length - 1).indexOf('or') > -1) {
      searchCriteria = searchCriteria.substring(0, searchCriteria.length - 4);
    }
    searchCriteria += ' )';
    return searchCriteria;
  }
  return buildSearchCriteria(field, operator, component, mode);
};
export const buildSearchStr = (pageable) => {
  let searchStr = '';

  const { schemas, _extSearchStr } = pageable;
  if (schemas && schemas.length) {
    schemas.forEach((schema) => {
      const { field } = schema;
      // console.log(schema, pageable[field]);
      const searchCriteria = buildSearchCriteria(schema, pageable[field]);
      if (searchCriteria) {
        searchStr += `${searchCriteria} and `;
      }
    });
  }

  const filterStr = buildFilterCriteria(pageable);
  searchStr += filterStr;

  if (searchStr.substring(searchStr.length - 5, searchStr.length - 1).indexOf('and') > -1) {
    searchStr = searchStr.substring(0, searchStr.length - 5);
  }
  console.log(`searchStr =${searchStr}`);
  if (_extSearchStr && _extSearchStr.trim() !== '') {
    let extSearchStr = _extSearchStr;
    if (searchStr.trim() !== '') {
      extSearchStr = ` and ${_extSearchStr}`;
    }
    searchStr += ` ${extSearchStr}`;
  }

  return searchStr;
};
export const buildFilterCriteria = (pageable: any) => {
  const { filters, schemas } = pageable;

  console.log('buildFilterCriteria', filters, schemas);
  if (!filters) {
    return '';
  }

  let filterStr = '';
  for (const fieldName of Object.keys(filters)) {
    const values = filters[fieldName];
    if (!(values && values.length > 0)) {
      continue;
    }
    const filterSchemas = schemas?.filter((schema) => {
      const { field } = schema;
      return field === fieldName;
    });

    if (filterSchemas && filterSchemas.length) {
      // eslint-disable-next-line no-loop-func
      schemas.forEach((schema) => {
        const { field } = schema;
        if (field === fieldName) {
          const searchCriteria = buildSearchCriteria(schema, values.toString());
          if (searchCriteria) {
            filterStr += `${searchCriteria} and `;
          }
        }
      });
    } else {
      filterStr += `${fieldName} in (${values}) and `;
    }
  }

  return filterStr;
};
export const buildPaginationQueryOpts = (pageable: any) => {
  console.log(pageable);
  if (pageable) {
    const { page, size, field, order } = pageable;

    let sorts = '';
    if (pageable.sort) {
      if (Array.isArray(pageable.sort)) {
        for (const idx of Object.keys(pageable.sort)) {
          if (sorts.length > 0) {
            sorts += '&';
          }
          sorts += `sort=${pageable.sort[idx]}`;
        }
      } else {
        // 兼容排序传字符串：sort: 'id,asc'
        sorts += `sort=${pageable.sort}`;
      }
    } else if (field && order) {
      // 兼容Vben Admin
      sorts += `sort=${field},${order === 'ascend' ? 'asc' : 'desc'}`;
    }

    return `${sorts}&page=${page - 1}&size=${size}`;
  }
  return '';
};

export default class BaseApi {
  protected prefix: string;

  protected http = httpUtil;

  constructor(prefix: string) {
    this.prefix = prefix;
  }

  public list = (pageable: any): AxiosPromise<any> => {
    return httpUtil.get(`${this.prefix}/list?${buildPaginationQueryOpts(pageable)}`);
  };

  public findById = (id: string): AxiosPromise<any> => {
    return httpUtil.get(`${this.prefix}/${id}`);
  };

  public create = (data: any): AxiosPromise<any> => {
    delete data.id;
    return httpUtil.post(`${this.prefix}/`, data);
  };

  public update = (data: any): AxiosPromise<any> => {
    return httpUtil.put(`${this.prefix}/`, data);
  };

  public modify = (data: any): AxiosPromise<any> => {
    return httpUtil.put(`${this.prefix}/modify`, data);
  };

  public deleteById = (id: string): AxiosPromise<any> => {
    return httpUtil.delete(`${this.prefix}/${id}`);
  };

  /**
   *
   * @param query  {"query":"id =2 and (createdBy=admin or createdBy like 'mdi*')"}.
   */
  public advancedSearch = (query: any, pageable: any): AxiosPromise<any> => {
    const data = { q: query };
    return httpUtil.post(`${this.prefix}/adv?${buildPaginationQueryOpts(pageable)}`, data);
  };

  public fetch = (pageable: any): AxiosPromise<any> => {
    const searchStr = buildSearchStr(pageable);
    return this.advancedSearch(searchStr, pageable);
    // if (searchStr && searchStr.trim() !== '') {
    //   return this.advancedSearch(searchStr, pageable);
    // } else {
    //   return this.list(pageable);
    // }
  };

  public save = (data: any): AxiosPromise<any> => {
    const { id } = data;
    if (!id) {
      return this.create(data);
    }
    return this.update(data);
  };
}
