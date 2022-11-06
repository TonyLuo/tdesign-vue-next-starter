import http from '@/utils/http';

class AuthApi {
  private prefix: string;

  constructor(prefix: string) {
    this.prefix = prefix;
  }

  getAccount() {
    return http.get(`${this.prefix}/account`);
  }

  getPermission() {
    return ['ROLE_ADMIN', 'ROLE_USER'];
  }

  login(data: any) {
    console.log('login');
    return http.post(`${this.prefix}/authenticate`, data);
  }

  refreshToken() {
    return http.get(`${this.prefix}/refresh-token`);
  }

  changePassword(data) {
    return http.post(`${this.prefix}/account/change-password`, data);
  }
}

export default new AuthApi('/services/user/api');
// export default new AuthApi('/api');
