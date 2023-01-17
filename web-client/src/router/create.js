import Create from "@/views/Create/Create.vue";
import CreateSelect from "@/views/Create/CreateSelect.vue";
import CreateAsset from "@/views/Create/CreateAsset.vue";
import CreateResource from "@/views/Create/CreateResource.vue";
import CreateService from "@/views/Create/CreateService.vue";
import CreatePublisher from "@/views/Create/CreatePublisher.vue";
import CreateDestroyClaim from "@/views/Create/CreateDestroyClaim.vue";

export default {
  component: Create,
  path: "create",
  name: "create",
  redirect: {
    name: "create_select",
  },
  children: [
    {
      component: CreateSelect,
      path: "select",
      name: "create_select",
    },
    {
      component: CreateResource,
      path: "resource",
      name: "create_resource",
    },
    {
      component: CreateAsset,
      path: "asset",
      name: "create_asset",
    },
    {
      component: CreateService,
      path: "service",
      name: "create_service",
    },
    {
      component: CreatePublisher,
      path: "publisher",
      name: "create_publisher",
    },
    {
      component: CreateDestroyClaim,
      path: "destroyclaim",
      name: "create_destroy_claim",
    },
  ],
};
