import { isValidURL } from "@/utils/utils";

export const getInitialPolicy = (policy) => {
  if (!policy) {
    return {};
  }
  const index = policies.findIndex((p) => p.propTitle in policy);
  return policies[index] ?? {};
};

export const policies = [
  {
    title: "Provide Access",
    propTitle: "provideAccess",
    value: true,
    description: "Flag indicating if the resource is available via a connector",
    type: "boolean",
    selected: false,
  },
  {
    title: "Usage Logging",
    propTitle: "usageLogging",
    description:
      "Flag indicating if the usage logging of the resource is active on connector",
    value: true,
    type: "boolean",
    selected: false,
  },
  {
    title: "Usage Notification URI",
    propTitle: "usageNotification",
    selected: false,
    value: "",
    type: "url",
    validation: (v) => v !== "" && isValidURL(v),
  },
  {
    title: "Connector Restricted Usage URI",
    propTitle: "connectorRestrictedUsage",
    description: "The Connector that is allowed to use the resource",
    selected: false,
    value: "",
    type: "url",
    validation: (v) => v !== "" && isValidURL(v),
  },
  {
    title: "N-Times Usage",
    propTitle: "nTimesUsage",
    selected: false,
    value: "",
    type: "number",
    validation: (v) => v !== "",
  },
  {
    title: "XSD Duration Usage",
    propTitle: "durationUsage",
    selected: false,
    value: "",
    type: "text",
    validation: (v) => v !== "",
  },
  {
    title: "Usage During Interval",
    propTitle: "usageDuringInterval",
    selected: false,
    type: "interval",
    value: {
      from: "",
      to: "",
    },
  },
  {
    title: "Usage until Deletion",
    propTitle: "usageUntilDeletion",
    type: "interval",
    selected: false,
    value: {
      from: "",
      to: "",
      delete: "",
    },
  },
];
