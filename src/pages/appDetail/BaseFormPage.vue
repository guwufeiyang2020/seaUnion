<template>
	<div class="base-page">
		<base-form
			:module="module"
			:app="app"
			:form="form"
			:node="node"
			:spaceId="spaceId"
			:after-form-finished="afterFormFinished"
			@form-action="onFormAction"
			@on-init="onInitCallBack"
			@field-value-changed="onFieldValueChange"
			@field-property-changed="onFieldPropertyChange"
			@slave-table-property-changed="onSlaveTablePropertyChange"
			@crumb-item-click="onCrumbItemClick"
			@slave-form-action="onSlaveFormAction"
			@form-operation="onFormOperation"
			@after-form-action="afterFormAction"
		/>
	</div>
</template>

<script>
import Vue from 'vue';
import { ComponentxPlugin } from '@qycloud/lego';
import BaseForm from './BaseForm.vue';

Vue.use(ComponentxPlugin);

export default {
  name: 'BaseFormPage',
  data() {
    return {};
  },
  xComponents: {},
  props: ['module', 'app', 'spaceId', 'form', 'node'],
  components: {
    BaseForm
  },
  methods: {
    onFormAction(ctx, { action, formData, validate, next }) {
      if (['CANCEL', 'DATAFLOW_CANCEL', 'WORKFLOW_CANCEL', 'SAVE_WORKFLOW'].indexOf(action) > -1) {
        next();
        return;
      }
      validate().then((result) => {
        if (result) {
          next();
        }
      });
    },
    afterFormFinished() {
      this.$router.push({
        path: `/appList/${this.module}/${this.app}/${this.spaceId}`
      });
    },
    onInitCallBack() {},
    onFormOperation(ctx, { action, next }) {
      next();
    },
    onFieldValueChange() {},
    onFieldPropertyChange() {},
    onSlaveTablePropertyChange() {},
    onCrumbItemClick(options, ctx) {
      console.log(options, ctx);
    },
    onSlaveFormAction(ctx, { formData, validate, next }) {
      validate().then((result) => {
        if (result) {
          next();
        } else {
          console.log('平台验证不通过');
        }
      });
    },
    afterFormAction(ctx, { buttonType, action, dialogData, next }) {
      next();
    }
  }
};
</script>

<style lang="scss">
.base-page {
	height: 100%;
}
</style>
