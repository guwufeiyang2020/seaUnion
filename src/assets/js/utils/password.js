/*eslint-disable*/
export default {
  // 检查密码强弱
  checkStrength(sValue) {
    let modes = 0;
    // 正则表达式验证符合要求的
    if(sValue.length < 6) return modes;
    if(/\d/.test(sValue)) modes++; //数字
    if(/[A-Z|a-z]/.test(sValue)) modes++; //大小写
    // if(/[a-z]/.test(sValue)) modes++; //小写
    // if(/[A-Z]/.test(sValue)) modes++; //大写
    if(/\W/.test(sValue)) modes++; //特殊字符

    //逻辑处理
    switch(modes) {
      case 1:
        return 1;
        break;
      case 2:
        return 2;
        break;
      case 3:
      case 4:
        return sValue.length < 10 ? 3 : 4;
        break;
    }
    return modes;
  },
};
