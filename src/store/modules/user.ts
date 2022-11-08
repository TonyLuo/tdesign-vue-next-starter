import { defineStore } from 'pinia';
import { TOKEN_NAME } from '@/config/global';
import { store, usePermissionStore } from '@/store';
import authApi from '@/api/user/auth.api';
import userApi from '@/api/user/user.api';

const InitUserInfo = {
  roles: [],
};

export const useUserStore = defineStore('user', {
  state: () => ({
    // token: localStorage.getItem(TOKEN_NAME) || 'main_token', // 默认token不走权限
    token: localStorage.getItem(TOKEN_NAME), // 默认token不走权限
    tokenValidityInSeconds: localStorage.getItem('tokenValidityInSeconds'),
    userInfo: InitUserInfo,
  }),
  getters: {
    roles: (state) => {
      return state.userInfo?.roles;
    },
  },
  actions: {
    async login(userInfo: Record<string, unknown>) {
      const { account, password } = userInfo;
      const data = await authApi.login({ username: account, password });
      console.log(data);
      const { token, tokenValidityInSeconds } = data;
      this.token = token;
      this.tokenValidityInSeconds = tokenValidityInSeconds;
    },
    async getUserInfo() {
      const mockRemoteUserInfo = async (token: string) => {
        if (token === 'main_token') {
          return {
            name: 'td_main',
            roles: ['all'],
          };
        }
        return {
          name: 'td_dev',
          roles: ['UserIndex', 'DashboardBase', 'login', 'UserListIndex'],
        };
      };

      const res = await mockRemoteUserInfo(this.token);

      this.userInfo = res;
    },

    async getAuthorities() {
      const data = await userApi.getAllAuthorities();
      console.log('getAuthorities', data);
      return data;
    },
    async logout() {
      localStorage.removeItem(TOKEN_NAME);
      this.token = null;
      this.userInfo = null;
    },
    async removeToken() {
      this.token = '';
    },
  },
  persist: {
    afterRestore: (ctx) => {
      if (ctx.store.roles && ctx.store.roles.length > 0) {
        const permissionStore = usePermissionStore();
        permissionStore.initRoutes(ctx.store.roles);
      }
    },
  },
});

export function getUserStore() {
  return useUserStore(store);
}
