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
  isEmptyObject(obj) {
    /* eslint-disable */
        for (const key in obj) {
            return false;
        }
        return true;
    },
    // 防抖
    debounce(fn) {
        let timer = null;
        return () => {
            clearTimeout(timer);
            timer = setTimeout(() => {
                fn.call(this, arguments);
            }, 1000);
        };
    },
    // 节流
    throttle(fn) {
        // 通过闭包保存一个标记
        let canRun = true;
        return () => {
            // 在函数开头判断标志是否为 true，不为 true 则中断函数
            if (!canRun) {
                return;
            }
            // 将canRun设置为false，防止执行之前再被执行
            canRun = false;
            setTimeout(() => {
                fn.call(this, arguments);
                canRun = true;
            }, 1000);
        };
    },
    myFormatDate(dd) {
        let now = new Date(dd);
        let year = now.getFullYear()
        let month = now.getMonth() + 1
        let date = now.getDate()
        return year + "-" + month + "-" + date
    },

};