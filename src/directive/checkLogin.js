import { MessageBox } from 'element-ui';
import store from '@/store/';

export const checklogin = {
  bind: (el, binding) => {
    el.onclick = (e) => {
      e.stopPropagation();
      const { userInfo } = store.state.user;
      if (!userInfo) {
        MessageBox.confirm('您尚未登录', '提示', {
          confirmButtonText: '去登陆',
          cancelButtonText: '取消',
          type: 'warning',
          callback: (action) => {
            // eslint-disable-next-line no-unused-expressions
            if (action === 'confirm') {
              if (typeof binding.value === 'function') {
                binding.value.call(this, binding.arg);
              }
              store.commit('changeLoginDialog', true);
            }
          },
        });
      } else if (typeof binding.value === 'function') {
        binding.value.call(this, binding.arg);
      }
    };
  },
};
