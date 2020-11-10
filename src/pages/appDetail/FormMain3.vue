<template>
	<component :is="componentName" v-bind="formProps" />
</template>

<script>
import xingyezilvtqcjiancha from './xingyezilvtqcjiancha.vue';
import DefaultForm from './BaseFormPage2.vue';

export default {
  name: 'FormMain',
  components: {
    'xingyezilvtqcjiancha': xingyezilvtqcjiancha,
    DefaultForm
  },
  computed: {
    formProps() {
      return {
        module: this.$route.params.module,
        app: this.$route.params.appId,
        form: this.$route.params.form,
        edit: this.$route.params.edit,
        isCopy: this.$route.query.isCopy,
        // node: this.$route.params.node,
        spaceId: this.$route.params.spaceId
      };
    },
    componentName() {
      return this.$options.components[this.$route.params.appId]
        ? this.$route.params.appId
        : 'DefaultForm';
    }
  },
  created() {
    // console.log(this.$route.params, '=======');
  },
  mounted() {
    // console.log(this.$route.params);
  }
};
</script>
