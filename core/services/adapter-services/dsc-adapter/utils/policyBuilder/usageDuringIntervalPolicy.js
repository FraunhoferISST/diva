const { v4 } = require("uuid");

module.exports = ({ from, to }) => ({
  "@context": {
    ids: "https://w3id.org/idsa/core/",
  },
  "@type": "ids:ContractOffer",
  "@id": `https://w3id.org/idsa/autogen/contractOffer/${v4()}`,
  "ids:permission": [
    {
      "@type": "ids:Permission",
      "@id": `https://w3id.org/idsa/autogen/permission/${v4()}`,
      "ids:description": [
        {
          "@value": "usage-during-interval",
          "@type": "http://www.w3.org/2001/XMLSchema#string",
        },
      ],
      "ids:action": [
        {
          "@id": "idsc:USE",
        },
      ],
      "ids:title": [
        {
          "@value": "Example Usage Policy",
          "@type": "http://www.w3.org/2001/XMLSchema#string",
        },
      ],
      "ids:constraint": [
        {
          "@type": "ids:Constraint",
          "@id": `https://w3id.org/idsa/autogen/constraint/${v4()}`,
          "ids:rightOperand": {
            "@value": from,
            "@type": "xsd:dateTimeStamp",
          },
          "ids:operator": {
            "@id": "idsc:AFTER",
          },
          "ids:leftOperand": {
            "@id": "idsc:POLICY_EVALUATION_TIME",
          },
        },
        {
          "@type": "ids:Constraint",
          "@id": `https://w3id.org/idsa/autogen/constraint/${v4()}`,
          "ids:rightOperand": {
            "@value": to,
            "@type": "xsd:dateTimeStamp",
          },
          "ids:operator": {
            "@id": "idsc:BEFORE",
          },
          "ids:leftOperand": {
            "@id": "idsc:POLICY_EVALUATION_TIME",
          },
        },
      ],
    },
  ],
});
