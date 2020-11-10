import { openFormDialog } from '@qycloud/lego';

export default {
  methods: {
    /*
                action: 按钮类型
                next: 下一步操作
                radioProps: 选择一条数据时候的参数
                multipleProps: 选择多条数据的时候的参数 */
    onViewAction(actionParams) {
      const {
        ctx,
        action,
        next,
        radioProps,
        multipleProps,
        config,
        masterTableId,
      } = actionParams;
      if (action === 'COPY') {
        console.log('进入onViewAction，复制');
        console.log('multipleProps', multipleProps);
        // console.log('multipleProps', multipleProps);
        let url;
        let module = this.$route.params.module;
        let appId = this.$route.params.appId;
        let spaceId = this.$route.params.spaceId;
        let formId = multipleProps[0].recordId;

        url = `/detail/${module}/${appId}/${spaceId}/1/${formId}`;

        /*  let node;
                    if (multipleProps && multipleProps.length > 0 && multipleProps[0].nodeId) {
                        node = multipleProps[0].nodeId;
                        url = `/detail/${module}/${appId}/${spaceId}/1/${formId}/${node}`
                    } else {
                        url = `/detail/${module}/${appId}/${spaceId}/1/${formId}`
                    } */
        const routes = this.$router.resolve({
          path: url,
          query: {
            isCopy: true
          }
        });
        return window.open(routes.href);
      }
      next();
    }

  }
};
