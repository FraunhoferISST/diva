module.exports = [
  // internal services
  {
    title: "Entity Management Service",
    description: require("../../package.json").description,
    serviceName: "entity-management",
    id: require("../../package.json").serviceId,
    serviceType: "internal",
    entityType: "service",
  },
  // FaaS
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
  {
    title: "Keywords Similarity Hash Generator",
    description:
      "Can be triggered through airflow to calculate a similarity hash for keywords.",
    serviceName: "keywords-similarity-hash-generator",
    id: "service:uuid:ff98d351-7fe5-433f-bf68-90545c70de6b",
    serviceType: "faas",
    entityType: "service",
  },
  {
    title: "Entity Management Sink",
    description:
      "Service that can patch an entities analytics results from a workflow.",
    serviceName: "entity-management-sink",
    id: "service:uuid:9ac1e8f9-cfe8-4ae4-81bc-07151c7c4978",
    serviceType: "faas",
    entityType: "service",
  },
  // Image Analytics FaaS
  {
    title: "Image Caption Generator",
    description:
      "A wrapper FaaS that triggers a caption generator IBM service.",
    serviceName: "image-caption-generator",
    id: "service:uuid:1eea5348-ed9c-49cb-81c3-20f2e9f852cf",
    serviceType: "faas",
    entityType: "service",
  },
  {
    title: "Image Metadata Extractor",
    description: "Service that extracts EXIF metadata from jpgs.",
    serviceName: "image-metadata-extractor",
    id: "service:uuid:8cb29cd9-2b12-4547-b440-08cb9028bf5a",
    serviceType: "faas",
    entityType: "service",
  },
  {
    title: "Image Object Detection",
    description: "A wrapper FaaS that triggers a object detection IBM service.",
    serviceName: "image-object-detection",
    id: "service:uuid:6e918b98-c83a-45f4-95eb-5d51385741e5",
    serviceType: "faas",
    entityType: "service",
  },
  {
    title: "Image Sample Extractor",
    description: "Service that creates a thumbnail from an jpg or png.",
    serviceName: "image-sample-extractor",
    id: "service:uuid:4865fa98-7b0d-4db3-a211-7ccf60afc038",
    serviceType: "faas",
    entityType: "service",
  },
  {
    title: "Image Text Extractor",
    description: "Service that uses OCR to extract text from an picture.",
    serviceName: "image-text-extractor",
    id: "service:uuid:5e65756f-5761-41ce-ab9a-1ee7b5c8f662",
    serviceType: "faas",
    entityType: "service",
  },
];
