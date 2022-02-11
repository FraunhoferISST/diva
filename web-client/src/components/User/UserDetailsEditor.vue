<template>
  <div class="user-data-editor relative d-inline-block">
    <v-dialog class="user-data-editor-dialog" v-model="dialog" max-width="900">
      <template v-slot:activator="{ on }">
        <v-btn text rounded v-on="on" color="primary"> Edit profile </v-btn>
      </template>
      <v-card>
        <v-card-text class="pa-8">
          <v-container fluid>
            <v-row>
              <v-col cols="12">
                <custom-header text="General Information" />
              </v-col>
              <v-col cols="12">
                <div class="user-data">
                  <div class="d-flex justify-center pb-4 pb-sm-4 pb-md-0">
                    <div
                      class="user-data-image text-center"
                      v-if="user.entityIcon && !image"
                    >
                      <user-avatar
                        :image-id="user.entityIcon"
                        :user-id="user.id"
                        :size="avatarSize"
                      />
                    </div>
                    <user-avatar-editor
                      :image.sync="image"
                      :size="parseInt(avatarSize.replace('px', ''))"
                    />
                  </div>
                  <v-container fluid class="pa-0">
                    <v-row>
                      <v-col cols="12">
                        <v-row>
                          <v-col cols="12" md="6">
                            <info-block title="Email" :value="user.email">
                            </info-block>
                          </v-col>
                          <v-col cols="12" md="6"
                            ><info-block title="Password" value="********">
                            </info-block>
                          </v-col>
                          <v-col cols="12">
                            <v-alert text dense color="info">
                              You can edit your log in credentials on
                              <a :href="keycloakAccountURL"> Keycloak </a>
                              - our trusted and secure service for
                              authentication
                            </v-alert>
                          </v-col>
                        </v-row>
                      </v-col>
                      <v-col
                        cols="12"
                        :md="attribute.fullWith ? '12' : '6'"
                        v-for="attribute in generalInformation"
                        :key="attribute.name"
                      >
                        <v-text-field
                          rounded
                          v-model="attribute.value"
                          :label="attribute.title"
                          :type="attribute.type"
                          outlined
                          :hide-details="attribute.name !== 'email'"
                          :readonly="attribute.name === 'email'"
                          light
                          persistent-hint
                          dense
                          :required="attribute.required"
                          :clearable="attribute.name !== 'email'"
                          :hint="attribute.name === 'email' ? 'hint' : ''"
                        >
                          <template #message>
                            <p>
                              You can edit your login credentials on your
                              <a :href="keycloakAccountURL">
                                Keycloak profile
                              </a>
                              page
                            </p>
                          </template>
                        </v-text-field>
                      </v-col>
                    </v-row>
                  </v-container>
                </div>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <custom-header
                  text="Contact information (visible to everyone)"
                />
              </v-col>
              <v-col
                cols="12"
                :sm="attribute.fullWith ? '12' : '6'"
                md="4"
                v-for="attribute in contactInformation"
                :key="attribute.name"
              >
                <v-text-field
                  rounded
                  v-model="attribute.value"
                  :label="attribute.title"
                  :type="attribute.type"
                  outlined
                  hide-details
                  light
                  dense
                  clearable
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <v-alert text color="error" class="my-4">
                  You can delete your DIVA account. Please note that the data
                  cannot be restored. Your data in Keycloak will not be affected
                  by deleting your DIVA account.
                  <div class="d-flex justify-end">
                    <v-btn
                      text
                      rounded
                      color="error"
                      @click="showConfirmationDialog"
                    >
                      Delete account
                    </v-btn>
                  </div>
                </v-alert>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" class="d-flex justify-end">
                <v-btn
                  class="mr-3"
                  rounded
                  text
                  color="primary"
                  :loading="isLoading"
                  @click="dialog = false"
                >
                  Cancel
                </v-btn>
                <v-btn rounded depressed color="success" @click="saveChanges">
                  Save changes
                </v-btn>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-snackbar
          rounded
          text
          v-model="snackbar"
          :timeout="6000"
          absolute
          :color="snackbarColor"
        >
          <span>
            <b>{{ snackbarMsg }}</b>
          </span>
        </v-snackbar>
        <confirmation-dialog :show.sync="confirmationDialog">
          You are sure you want to delete your account?
          <template #confirm>
            <div class="d-flex justify-end">
              <v-btn
                text
                rounded
                color="error"
                :loading="isLoading"
                @click="deleteAccount"
              >
                Delete account
              </v-btn>
            </div>
          </template>
        </confirmation-dialog>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import CustomHeader from "@/components/Base/CustomHeader";
import UserAvatarEditor from "@/components/User/UserAvatarEditor";
import UserAvatar from "@/components/User/UserAvatar";
import keycloak from "@/api/keycloak";
import InfoBlock from "../Base/InfoBlock/InfoBlock";
import ConfirmationDialog from "../Base/ConfirmationDialog";

export default {
  name: "UserDetailsEditor",
  components: {
    ConfirmationDialog,
    InfoBlock,
    UserAvatar,
    UserAvatarEditor,
    CustomHeader,
  },
  props: {
    user: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      dialog: false,
      confirmationDialog: false,
      userData: this.user,
      window: 0,
      snackbar: false,
      snackbarMsg: "",
      snackbarColor: "",
      image: "",
      isLoading: false,
    };
  },
  watch: {
    user() {
      this.userData = this.user;
    },
  },
  computed: {
    keycloakAccountURL() {
      return keycloak.kc.createAccountUrl();
    },
    avatarSize() {
      return this.$vuetify.breakpoint.smAndDown ? "200px" : "200px";
    },
    contactInformation() {
      return [
        {
          name: "phoneNumber",
          type: "text",
          title: "Phone number",
          fullWith: false,
        },
        {
          name: "mobileNumber",
          type: "text",
          title: "Mobile number",
          fullWith: false,
        },
        {
          name: "addressLocality",
          type: "text",
          title: "Address locality",
          fullWith: false,
        },
        {
          name: "addressRegion",
          type: "text",
          title: "Address region",
          fullWith: false,
        },
        {
          name: "postalCode",
          type: "number",
          title: "Postal Code",
          fullWith: false,
        },
        {
          name: "streetAddress",
          type: "text",
          title: "Street address",
          fullWith: false,
        },
        {
          name: "postOfficeBoxNumber",
          type: "number",
          title: "Post office box number",
          fullWith: false,
        },
        {
          name: "company",
          type: "text",
          title: "Company",
          fullWith: false,
        },
        {
          name: "jobTitle",
          type: "text",
          title: "Job title",
          fullWith: false,
        },
      ].map((attr) => ({
        ...attr,
        value: this.userData[attr.name],
      }));
    },
    generalInformation() {
      return [
        {
          name: "username",
          type: "text",
          title: "User name",
          fullWith: true,
          required: true,
        },
      ].map((attr) => ({
        ...attr,
        value: this.userData[attr.name],
      }));
    },
  },
  methods: {
    async createUserIcon() {
      let newIconImageId = "";
      try {
        const { data } = await this.$api.users.uploadImage(
          this.userData.id,
          this.image
        );
        newIconImageId = data;
        if (this.userData.entityIcon) {
          await this.$api.users.deleteImageIfExists(
            this.userData.id,
            this.userData.entityIcon
          );
        }
        return newIconImageId;
      } catch (e) {
        this.showSnackbar(e, "error");
        if (newIconImageId) {
          this.$api.users.deleteImage(this.userData.id, newIconImageId);
        }
        throw e;
      }
    },
    async saveChanges() {
      this.isLoading = true;
      try {
        let newUserIconId;
        if (this.image) {
          newUserIconId = await this.createUserIcon();
        }
        const updatedUser = {};
        for (const attr of [
          ...this.generalInformation,
          ...this.contactInformation,
        ]) {
          updatedUser[attr.name] = attr.value ?? "";
        }
        await this.$api.users.patch(this.userData.id, {
          ...updatedUser,
          entityIcon: newUserIconId || this.userData.entityIcon,
        });
        this.showSnackbar("Changes saved");
        this.isLoading = false;
        setTimeout(() => {
          this.dialog = false;
          this.image = null;
        }, 500);
      } catch (e) {
        this.isLoading = false;
        this.showSnackbar(e?.response?.data?.message || e.message, "error");
      }
    },
    deleteAccount() {
      this.isLoading = true;
      this.$api.users
        .delete(this.userData.id)
        .then(() => {
          this.logout();
          this.confirmationDialog = false;
        })
        .catch((e) => {
          this.showSnackbar(e?.response?.data?.message || e.message, "error");
        })
        .finally(() => (this.isLoading = false));
    },
    logout() {
      return this.$store.dispatch("logout").then(() => {
        keycloak.logout({
          redirectUri: `${window.location.origin}`,
        });
      });
    },
    showConfirmationDialog() {
      this.confirmationDialog = true;
    },
    showSnackbar(msg, color = "success") {
      this.snackbar = true;
      this.snackbarMsg = msg;
      this.snackbarColor = color;
    },
  },
};
</script>

<style lang="scss">
.v-dialog.v-dialog--active {
  overflow: auto !important;
}
.user-data {
  display: grid;
  grid-template-columns: 250px 1fr;
  column-gap: 26px;
}
.user-data-image {
  position: absolute;
  opacity: 0.7;
}

@media only screen and (max-width: 699px) {
  .user-data {
    display: block;
  }
}
</style>
