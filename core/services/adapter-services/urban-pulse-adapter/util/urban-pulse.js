const sensorToIds = (sensors) => sensors.map((sensor) => sensor.id);

const groupByDescription = (sensors) => {
  const descriptions = sensors.map((sensor) => sensor.description.reference);
  const counts = [];
  descriptions.forEach((descrip) => {
    const matching_index = counts.findIndex(
      (elem) => JSON.stringify(elem.content) === JSON.stringify(descrip)
    );
    if (matching_index > -1) {
      counts[matching_index].count += 1;
    } else {
      counts.push({
        content: descrip,
        count: 1,
      });
    }
  });
  counts.sort((a, b) => b.count - a.count);
  console.log(`The server contains ${sensors.length} different sensors.`);
  console.log(`There are ${counts.length} unique descriptions.`);
};

const getSensorOutputById = async (sensor_id) => {
  const res = await axi.get(
    `UrbanPulseData/historic/sensordata?sid=${sensor_id}`
  );
  return res.data;
};

const getCategoryById = async (category_id) => {
  const res = await axi.get(
    `UrbanPulseManagement/api/categories/${category_id}`
  );
  return res.data;
};

const getEventById = async (event_id) => {
  const res = await axi.get(`UrbanPulseManagement/api/eventtypes/${event_id}`);
  return res.data;
};

const getConnectorById = async (connector_id) => {
  const res = await axi.get(
    `UrbanPulseManagement/api/connectors/${connector_id}`
  );
  return res.data;
};

const generateURL = (sensor_id, since = null, until = null) => {
  let url = `https://dksr1.urbanpulse.de/UrbanPulseData/historic/sensordata?sid=${sensor_id}`;
  if (since != null && until != null) {
    url += `&since=${since}&until=${until}`;
  }
  return url;
};

const getSensorInformation = async (sensor) => {
  const blown_sensor = {
    description: sensor.description,
    location: sensor.location,
  };

  blown_sensor.categories = await Promise.all(
    sensor.categories.map((x) => getCategoryById(x))
  );

  blown_sensor.eventtype = await getEventById(sensor.eventtype);

  blown_sensor.senderid = await getConnectorById(sensor.senderid);

  blown_sensor.last_output = await getSensorOutputById(sensor.id);

  blown_sensor.sensor_id = sensor.id;

  console.log(blown_sensor);
};

const getEventTypes = async () => {
  const res = await axi.get("UrbanPulseManagement/api/eventtypes");
  const { eventtypes } = res.data;
  console.log(eventtypes.length);
};

const createResources = async (sensorsUrl, username, password, publisherId) => {
  const since = "2021-01-01T00:00:00.000Z";
  const until = "2021-12-01T00:00:00.000Z";

  const schemas = sensorsUrl.map((sensor) =>
    generateSchema(sensor, username, password, publisherId)
  );
  const rm_res = await sendResources(schemas);
  console.log("Everything went to plan.");
};
