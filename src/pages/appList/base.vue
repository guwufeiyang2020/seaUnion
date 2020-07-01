<script>
import { AppView } from '@qycloud/lego';
import { intersection } from 'lodash';

export default {
  name: 'my-app-list',
  extends: AppView,

  data() {
    return {
      id: ''

      /* 	module: this.$route.params.module,
			appId: this.$route.params.appId,
			spaceId: this.$route.params.spaceId */
    };
  },
  methods: {
    onOpenForm(data) {
      console.log(data);

      this.vms = [];
      this.id = data.id;

      let form = data.instance_id ? data.instance_id : data.id;
      let node = data.node ? data.node : '';

      // console.log('form', form);
      // console.log('node', node);

      this.$router.push({
        path: `/detail/${this.$route.params.module}/${this.$route.params.appId}/${
          data.spaceId
        }/${form || ''}`
      });
    }
  },
  created() {
    this.vms = [];
    this.$root.$on('slave', (vm) => {
      this.vms.push(vm);
    });
  }
};
</script>
<style lang="scss">
.print-custom-btn {
	border: 1px solid #d8dde4;
	background: #fff;
	color: #596b89;
	min-width: 80px;
	height: 32px;
	padding: 0 15px;
	line-height: 32px;
	text-align: center;
	font-size: 14px;
	font-weight: bold;
	cursor: pointer;
	float: left;
	.iconfont.icon-dayin {
		font-size: 12px;
		font-weight: normal;
		margin-right: 5px;
	}
	&:hover {
		background: #4680ff;
		color: #fff;
	}
}
</style>
