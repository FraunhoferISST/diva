<template>
  <div class="user-data-editor relative d-inline-block">
    <v-dialog v-model="dialog" max-width="900">
      <template v-slot:activator="{ on }">
        <v-btn text rounded v-on="on" color="primary"> Edit profile </v-btn>
      </template>
      <v-card>
        <v-card-text class="pa-8">
          <v-window v-model="window">
            <v-window-item>
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
                          v-if="user.imageId && !image"
                        >
                          <user-avatar
                            :image-id="user.imageId"
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
                              :clearable="attribute.name !== 'email'"
                              :hint="attribute.name === 'email'"
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
                  <v-col cols="12" class="d-flex justify-end">
                    <v-btn
                      class="mr-3"
                      rounded
                      text
                      color="primary"
                      @click="dialog = false"
                    >
                      Cancel
                    </v-btn>
                    <v-btn
                      rounded
                      depressed
                      color="success"
                      @click="saveChanges"
                    >
                      Save changes
                    </v-btn>
                  </v-col>
                </v-row>
              </v-container>
            </v-window-item>
            <v-window-item>
              <div>test</div>
            </v-window-item>
          </v-window>
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
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import CustomHeader from "@/components/Base/CustomHeader";
import UserAvatarEditor from "@/components/User/UserAvatarEditor";
import UserAvatar from "@/components/User/UserAvatar";
import keycloak from "@/api/keycloak";

export default {
  name: "UserDetailsEditor",
  components: { UserAvatar, UserAvatarEditor, CustomHeader },
  props: {
    user: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      dialog: false,
      userData: this.user,
      window: 0,
      snackbar: false,
      snackbarMsg: "",
      snackbarColor: "",
      image: "",
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
          title: "Name",
          fullWith: true,
        },
        {
          name: "email",
          type: "email",
          title: "Email",
          fullWith: true,
        },
      ].map((attr) => ({
        ...attr,
        value: this.userData[attr.name],
      }));
    },
  },
  methods: {
    async updateImage() {
      if (this.image) {
        if (this.userData.imageId) {
          return this.$api.users.updateImage(this.userData.imageId, this.image);
        } else {
          return this.$api.users.uploadImage(this.image);
        }
      }
    },
    async saveChanges() {
      try {
        const response = await this.updateImage();
        const updatedUser = {};
        for (const attr of [
          ...this.generalInformation,
          ...this.contactInformation,
        ]) {
          updatedUser[attr.name] = attr.value ?? "";
        }
        await this.$api.users.patch(this.userData.id, {
          ...updatedUser,
          imageId: response?.data || this.userData.imageId,
        });
        this.showSnackbar("Changes saved");
        const oldEmail = this.userData.email;
        setTimeout(() => {
          this.dialog = false;
          this.image = null;
          this.redirectToLoginIfEmailChanged(oldEmail);
        }, 500);
      } catch (e) {
        this.showSnackbar(e?.response?.data?.message || e.message, "error");
      }
    },
    redirectToLoginIfEmailChanged(oldEmail) {
      const { value: email } = this.generalInformation.filter(
        ({ name }) => name === "email"
      )[0];
      if (email !== oldEmail) {
        this.$store.dispatch("logout").then(() => {
          this.$router.push({ name: "login", query: { email } });
        });
      }
    },
    showSnackbar(msg, color = "success") {
      this.snackbar = true;
      this.snackbarMsg = msg;
      this.snackbarColor = color;
    },
  },
};
</script>

<style scoped lang="scss">
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
