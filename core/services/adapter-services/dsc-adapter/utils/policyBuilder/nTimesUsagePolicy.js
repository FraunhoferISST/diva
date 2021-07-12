const { v4 } = require("uuid");

module.exports = (policy) => ({
  "@context": {
    ids: "https://w3id.org/idsa/core/",
  },
  "@type": "ids:NotMoreThanNOffer",
  "@id": `https://w3id.org/idsa/autogen/notMoreThanNOffer/${v4()}`,
  "ids:permission": [
    {
      "@type": "ids:Permission",
      "@id": `https://w3id.org/idsa/autogen/permission/${v4()}`,
      "ids:description": [
        {
          "@value": "n-times-usage",
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
            "@value": `${policy}`,
            "@type": "xsd:double",
          },
          "ids:operator": {
            "@id": "idsc:LTEQ",
          },
          "ids:leftOperand": {
            "@id": "idsc:COUNT",
          },
          "ids:pipEndpoint": {
            "@id": "https://localhost:8080/admin/api/resources/",
          },
        },
      ],
    },
  ],
});
