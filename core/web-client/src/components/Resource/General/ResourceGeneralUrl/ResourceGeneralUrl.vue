<template>
  <div>
    <sub-header text="HTTP API URL" class="mb-2" />
    <edit-view-content
      v-if="url"
      class="mb-3"
      :initialData="url"
      :close-edit-on-update="true"
    >
      <general-url slot="visualization" slot-scope="{ state }" :url="state" />
      <general-url-edit
        slot="edit"
        slot-scope="{ state, updateByEvent }"
        :url="state"
        @update-data="updateByEvent"
        :id="id"
      />
    </edit-view-content>
  </div>
</template>

<script>
import EditViewContent from "@/components/Containers/EditViewContent";
import GeneralUrlEdit from "@/components/Resource/General/ResourceGeneralUrl/GeneralUrlEdit";
import GeneralUrl from "@/components/Resource/General/ResourceGeneralUrl/GeneralUrl";
import SubHeader from "@/components/Base/SubHeader";

export default {
  name: "ResourceGeneralUrl",
  components: {
    SubHeader,
    GeneralUrl,
    GeneralUrlEdit,
    EditViewContent,
  },
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      url: "",
    };
  },
};
</script>

<style scoped></style>
