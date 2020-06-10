import Mock from 'mockjs';

export default {
  getHomeData: () => ({
    code: 20000,
    data: {
      shipList: [{
        id: '001',
        name: '泰坦尼克10001号',
        time: '05-20 12:00',
        status: 1,
        score: 40,
        company: '江苏南通如皋货运有限公司'
      },
      {
        id: '002',
        name: '泰坦尼克10001号',
        time: '05-20 12:00',
        status: 2,
        score: 50,
        company: '江苏南通如皋货运有限公司'
      },
      {
        id: '003',
        name: '泰坦尼克10001号',
        time: '05-20 12:00',
        status: 3,
        score: 80,
        company: '江苏南通如皋货运有限公司'
      }, {
        id: '004',
        name: '泰坦尼克10001号',
        time: '05-20 12:00',
        status: 4,
        score: 90,
        company: '江苏南通如皋货运有限公司'
      }, {
        id: '005',
        name: '泰坦尼克10001号',
        time: '05-20 12:00',
        status: 5,
        score: 100,
        company: '江苏南通如皋货运有限公司'
      }

      ]
    }
  }),
  getEchartData: () => ({
    code: 20000,
    data: {
      // 折线图
      shipData: {
        date: ['2019.07', '2019.08', '2019.09', '2019.10', '2019.11', '2019.12', '2020.01', '2020.02', '2020.03', '2020.04', '2020.05', '2020.06'],
        data: [10, 20, 30, 22, 25, 30, 24, 32, 25, 30, 24, 32]
      },
    }

  })
};
