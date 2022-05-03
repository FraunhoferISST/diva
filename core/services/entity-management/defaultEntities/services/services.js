module.exports = [
  {
    title: "Entity Management Service",
    description: require("../../package.json").description,
    serviceName: "entity-management",
    id: require("../../package.json").serviceId,
    serviceType: "internal",
    entityType: "service",
  },
  {
    title: "Similarity Network Bot",
    description:
      "Runs as cron job. Calculates similarity between entities according to keyword similarity and content similarity (if available)",
    serviceName: "similarity-network-bot",
    id: "service:uuid:f144b46a-6dfe-4dac-8fbc-611622e57394",
    serviceType: "faas",
    entityType: "service",
  },
  {
    title: "Entity Delete Bot",
    description:
      "Runs as cron job. Deletes entities that have a entityToBeDeleted date that is expired.",
    serviceName: "entity-delete-bot",
    id: "service:uuid:8640d5de-91fe-486a-9378-b8350ede33a5",
    serviceType: "faas",
    entityType: "service",
  },
  {
    title: "Entity Archive Bot",
    description:
      "Runs as cron job. Archives entities that have a entityToBeArchived date that is expired.",
    serviceName: "entity-archive-bot",
    id: "service:uuid:cfca72e0-4db4-47ea-bba5-0881be5e670a",
    serviceType: "faas",
    entityType: "service",
  },
];
