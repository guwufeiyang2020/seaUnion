import cryptoJs from 'crypto-js';

// DES加密
export const encryptDes = (password) => {
  const keyHex = cryptoJs.enc.Utf8.parse('0123456789abcd0123456789');
  const encrypted = cryptoJs.TripleDES.encrypt(password, keyHex, {
    iv: cryptoJs.enc.Utf8.parse('01234567'),
    mode: cryptoJs.mode.CBC,
    padding: cryptoJs.pad.Pkcs7,
  });
  return encrypted.ciphertext.toString();
};
