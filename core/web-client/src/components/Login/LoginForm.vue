<template>
  <v-row
    class="py-4 px-12 fill-height dense"
    id="login-form-container"
    :class="{ active: is_active }"
  >
    <v-col class="d-flex align-center" cols="12">
      <v-row dense>
        <v-form
          ref="form"
          v-model="valid"
          @submit.prevent="submit"
          style="width: 100%; height: 100%"
        >
          <div class="text-center d-flex justify-center align-center">
            <div
              style="
                width: 100px;
                height: 150px;
                max-height: 150px;
                max-width: 100px;
              "
            >
              <animated-diva-logo :animated="loading" />
            </div>
          </div>
          <v-col class="pb-2" cols="12">
            <v-text-field
              light
              v-model="email"
              :label="local('email')"
              :loading="loading"
              required
              color="blue"
              background-color="transparent"
              outlined
              clearable
              hide-details
            ></v-text-field>
          </v-col>
          <v-col class="pb-2" cols="12">
            <v-text-field
              light
              v-model="password"
              name="input-10-1"
              :label="local('password')"
              :loading="loading"
              hint="At least 8 characters"
              counter
              color="blue"
              background-color="transparent"
              outlined
              clearable
              hide-details
              type="password"
            >
            </v-text-field>
          </v-col>
          <v-col cols="12" class="mt-3">
            <v-btn
              class="gsuccess"
              large
              color="success"
              block
              rounded
              :loading="loading"
              :disabled="loading || !password || !email"
              type="submit"
            >
              {{ local("login_btn") }}
            </v-btn>
          </v-col>
        </v-form>
        <v-snackbar
          v-model="snackbarVisible"
          :timeout="3000"
          color="error"
          absolute
        >
          {{ snackbarMsg }}
        </v-snackbar>
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
import AnimatedDivaLogo from "@/components/Base/AnimatedDivaLogo";

export default {
  name: "LoginForm",
  components: { AnimatedDivaLogo },
  data() {
    return {
      remember: false,
      snackbarVisible: false,
      snackbarMsg: "",
      valid: true,
      loading: false,
      password: "",
      email: this.$route.query.email || "",
      is_active: true,
    };
  },
  methods: {
    submit() {
      this.loading = true;
      this.is_active = false;
      setTimeout(() => (this.is_active = true), 2000);
      this.$store
        .dispatch("login", {
          email: this.email,
          password: this.password,
        })
        .then(() => {
          this.$router.push("/");
        })
        .catch((err) => {
          const message = err.response?.data?.message || err.message;
          this.snackbarVisible = true;
          this.snackbarMsg = message + ". " + this.local("error");
        })
        .finally(() => {
          this.loading = false;
          this.dialog = false;
        });
    },
    local(string) {
      return this.$t(`login.${string}`);
    },
    clear() {
      this.$refs.form.reset();
    },
  },
};
</script>

<style scoped lang="scss">
#login-form-container {
  position: relative;
  background-color: white;
  animation: show-login 1s ease-in-out;
  animation-delay: 0.3s;
}

@keyframes show-login {
  from {
    transform: translateX(50%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}
</style>
