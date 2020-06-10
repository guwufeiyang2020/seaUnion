import CryptoJS from 'crypto-js';

const key = CryptoJS.enc.Utf8.parse('SnetcVOjuNaIRb80Tms1kVhC');
const iv = CryptoJS.enc.Utf8.parse('Tms1kVhC');
export default {
  // 加密
  encrypt(word) {
    const srcs = CryptoJS.enc.Utf8.parse(word);

    const encrypted = CryptoJS.AES.encrypt(srcs, key, {
      iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });
    return encrypted.toString();
  },
  // 解密
  decrypt(word) {
    const decrypt = CryptoJS.AES.decrypt(word, key, {
      iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });
    return decrypt.toString(CryptoJS.enc.Utf8);
  },
};
