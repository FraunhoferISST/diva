const provideAccessPolicyBuilder = require("./provideAccesPolicy");
const nTimesUsagePolicyBuilder = require("./nTimesUsagePolicy");
const durationUsagePolicyBuilder = require("./durationUsagePolicy");
const usageDuringIntervalPolicyBuilder = require("./usageDuringIntervalPolicy");
const usageUntilDeletionPolicyBuilder = require("./usageUntilDeletionPolicy");
const usageLoggingPolicyBuilder = require("./usageLoggingPolicy");
const usageNotificationBuilder = require("./usageNotificationPolicy");
const connectorRestrictedUsageBuilder = require("./connectorRestrictedUsage");

const policyBuilders = {
  provideAccess: provideAccessPolicyBuilder,
  nTimesUsage: nTimesUsagePolicyBuilder,
  durationUsage: durationUsagePolicyBuilder,
  usageDuringInterval: usageDuringIntervalPolicyBuilder,
  usageUntilDeletion: usageUntilDeletionPolicyBuilder,
  usageLogging: usageLoggingPolicyBuilder,
  usageNotification: usageNotificationBuilder,
  connectorRestrictedUsage: connectorRestrictedUsageBuilder,
};

const getActivePolicy = (policy) => {
  for (const p of Object.keys(policy)) {
    return {
      title: p,
      value: policy[p],
    };
  }
};

module.exports = (policy) => {
  const { title, value } = getActivePolicy(policy);
  return { value: JSON.stringify(policyBuilders[title](value)) };
};
