FROM bitnami/keycloak:16.1.0-debian-10-r0

COPY default-realm.json /tmp/default-realm.json
COPY themes/register.ftl /opt/jboss/keycloak/themes/base/login/register.ftl
COPY themes/login.ftl /opt/jboss/keycloak/themes/base/login/login.ftl
COPY themes/account.ftl /opt/jboss/keycloak/themes/base/account/account.ftl
