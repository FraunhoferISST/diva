const { v4 } = require("uuid");

module.exports = () => ({
  "@type": "ids:Permission",
  "@id": `https://w3id.org/idsa/autogen/permission/${v4()}`,
  "ids:description": [
    {
      "@value": "provide-access",
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
      "@value": "DIVA Usage Policy",
      "@type": "http://www.w3.org/2001/XMLSchema#string",
    },
  ],
});
