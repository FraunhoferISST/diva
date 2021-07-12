const { v4 } = require("uuid");

module.exports = () => ({
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
          "@value": "usage-logging",
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
      "ids:postDuty": [
        {
          "@type": "ids:Duty",
          "@id": `https://w3id.org/idsa/autogen/duty/${v4()}`,
          "ids:action": [
            {
              "@id": "idsc:LOG",
            },
          ],
        },
      ],
    },
  ],
});
