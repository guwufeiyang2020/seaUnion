import { $http } from '@commonbox/utils';

export default function checkSession() {
  return new Promise((resolve, reject) => {
    $http.get('/sdkseaunion/loginApi/checkSessionStatus').then((res) => {
      console.log(res);
      if (res.data.status === 200) {

      }
    });
  });
}
