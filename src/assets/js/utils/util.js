import moment from 'moment';

export default {
  // 格式化日期
  formatDate(date = new Date(), pattern = 'YYYY-MM-DD HH:mm:ss') {
    return moment(date).format(pattern);
  },
  // 移除html标签
  removeHtmlTag(str) {
    if (!str) return str;
    str = str.replace(/&nbsp;/g, '');
    return str.replace(/<[^>]+>/g, '');
  },
};
