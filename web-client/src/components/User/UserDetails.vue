<template>
  <section id="user-details">
    <v-container fluid class="fill-height">
      <v-row>
        <v-col cols="12" class="d-flex justify-center align-center">
          <card class="user-details-card">
            <reactive-data-fetcher
              slot="body"
              :fetch-method="fetchUser"
              :id="id"
            >
              <template>
                <v-container fluid class="pa-10" v-if="user">
                  <v-row>
                    <v-col cols="12">
                      <div class="user-details-content">
                        <div class="text-center mb-10 mb-md-0">
                          <user-avatar
                            :image-id="user.entityIcon"
                            :user-id="user.id"
                            :size="avatarSize"
                          />
                        </div>
                        <v-container fluid class="pa-0">
                          <v-row>
                            <v-col
                              cols="12"
                              sm="6"
                              v-for="attribute in generalInformation"
                              :key="attribute.name"
                            >
                              <info-block
                                :title="attribute.title"
                                :value="attribute.value"
                              />
                            </v-col>
                          </v-row>
                        </v-container>
                      </div>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col
                      cols="12"
                      class="d-flex justify-end"
                      v-if="user.id === currentUser.id"
                    >
                      <logout-button class="mr-3" />
                      <user-details-editor :user="user" />
                    </v-col>
                  </v-row>
                </v-container>
              </template>
            </reactive-data-fetcher>
          </card>
        </v-col>
      </v-row>
    </v-container>
  </section>
</template>

<script>
import UserAvatar from "@/components/User/UserAvatar";
import InfoBlock from "@/components/Base/InfoBlock/InfoBlock";
import UserDetailsEditor from "@/components/User/UserGeneral";
import Card from "@/components/Base/Card";
import LogoutButton from "@/components/Navigation/LogoutButton";
import ReactiveDataFetcher from "@/components/DataFetchers/ReactiveDataFetcher";
export default {
  name: "UserDetails",
  components: {
    ReactiveDataFetcher,
    LogoutButton,
    Card,
    UserDetailsEditor,
    InfoBlock,
    UserAvatar,
  },
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  data: () => ({
    user: {},
    loading: false,
  }),
  computed: {
    currentUser() {
      return this.$store.state.user;
    },
    avatarSize() {
      return this.$vuetify.breakpoint.xsOnly ? "100px" : "200px";
    },
    contactInformation() {
      return [
        {
          name: "phoneNumber",
          title: "Phone number",
        },
        {
          name: "mobileNumber",
          title: "Mobile number",
        },
        {
          name: "addressLocality",
          title: "Address locality",
        },
        {
          name: "addressRegion",
          title: "Address region",
        },
        {
          name: "postalCode",
          title: "Postal Code",
        },
        {
          name: "streetAddress",
          title: "Street address",
        },
        {
          name: "postOfficeBoxNumber",
          title: "Post office box number",
        },
      ].map((attr) => ({
        ...attr,
        value: this.user[attr.name],
      }));
    },
    generalInformation() {
      return [
        {
          name: "username",
          title: "Name",
        },
        {
          name: "email",
          title: "Email",
        },
        {
          name: "company",
          title: "Company",
        },
        {
          name: "jobTitle",
          title: "Job title",
        },
        ...this.contactInformation,
      ]
        .map((attr) => ({
          ...attr,
          value: this.user[attr.name],
        }))
        .filter(({ value }) => value);
    },
  },
  methods: {
    fetchUser() {
      return this.$api.users
        .getById(this.id)
        .then(({ data }) => (this.user = data));
    },
  },
};
</script>

<style scoped lang="scss">
.user-details-card {
  max-width: 1000px;
  border-radius: 20px !important;
}
.user-details-content {
  display: grid;
  grid-template-columns: 250px 1fr;
  column-gap: 30px;
}

@media only screen and (max-width: 959px) {
  .user-details-content {
    display: block;
  }
}
</style>
