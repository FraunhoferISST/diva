<template>
  <v-row class="py-4 px-12 fill-height" dense id="signup-form-container">
    <v-col class="d-flex align-center" cols="12">
      <v-row dense>
        <v-form
          ref="form"
          v-model="valid"
          @submit.prevent="submit"
          style="width: 100%; height: 100%"
        >
          <!--<v-col class="pa-4 text-center" cols="12">
            <avatar-editor @imageReady="onAvatarImageReady" />
          </v-col>-->
          <v-col class="pb-2" cols="12">
            <v-text-field
              light
              v-model="name"
              :label="local('name')"
              :loading="loading"
              required
              outlined
              color="blue"
              clearable
              hide-details
            ></v-text-field>
          </v-col>
          <v-col class="pb-2" cols="12">
            <v-text-field
              light
              v-model="email"
              :label="local('email')"
              :loading="loading"
              required
              outlined
              color="blue"
              clearable
              hide-details
            ></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-text-field
              light
              v-model="password"
              name="input-10-1"
              :label="local('password')"
              :loading="loading"
              hint="At least 8 characters"
              counter
              color="blue"
              clearable
              outlined
              hide-details
              type="password"
            >
            </v-text-field>
          </v-col>
          <v-col cols="12" class="mt-3">
            <v-btn
              class="gprimary"
              large
              color="info"
              block
              rounded
              :loading="loading"
              :disabled="loading"
              @click.native="submit"
            >
              {{ local("create_account_btn") }}
            </v-btn>
          </v-col>
        </v-form>
      </v-row>
      <v-snackbar
        v-model="snackbarVisible"
        :timeout="3000"
        color="error"
        absolute
      >
        {{ snackbarMsg }}
      </v-snackbar>
    </v-col>
  </v-row>
</template>

<script>
// import AvatarEditor from "@/components/Login/AvatarEditor";

export default {
  name: "SignupForm",
  components: {},
  data: () => ({
    image: null,
    remember: false,
    snackbarVisible: false,
    snackbarMsg: "",
    valid: true,
    loading: false,
    password: "",
    email: "",
    name: "",
  }),
  methods: {
    submit() {
      this.loading = true;
      this.$api.users
        .register({
          email: this.email,
          username: this.name,
          password: this.password,
        })
        .then(() =>
          this.$store.dispatch("login", {
            email: this.email,
            password: this.password,
          })
        )
        .then(() => {
          this.loading = false;
          this.dialog = false;
          this.$router.push("/");
        })
        .catch((err) => {
          this.loading = false;
          this.snackbarVisible = true;
          this.snackbarMsg = err.response?.data?.message || this.local("error");
        });
    },
    local(string) {
      return this.$t(`login.${string}`);
    },
    clear() {
      this.$refs.form.reset();
    },
    async onAvatarImageReady({ imgBlob }) {
      this.image = new File([imgBlob], "avatarFile.png", { type: "image/png" });
    },
  },
  mounted() {},
};
</script>

<style scoped lang="scss">
#signup-form-container {
  background-color: white;
  animation: show-signup 1s ease-in-out;
}

label {
  @include font-style(1rem, $font_body, normal, black);
}

span {
  @include font-style(1rem, $font_body, normal, black);
}

@keyframes show-signup {
  from {
    transform: translateX(-50%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}
</style>
