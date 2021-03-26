const fetch = require("node-fetch");
const Adapter = require("./");

const EapplyAdapter = new Adapter();

function checkStatus(res) {
  if (res.ok) {
    // res.status >= 200 && res.status < 300
    return res;
  } else {
    throw new Error(res.statusText);
  }
}

EapplyAdapter.get = async function (tenantId, year) {
  const credentials = [process.env.EAPPLY_USER, process.env.EAPPLY_TOKEN];
  const headers = {
    Authorization: `Basic ${Buffer.from(credentials.join(":")).toString(
      "base64"
    )}`,
    "Content-Type": "application/json",
  };
  const options = {
    method: "GET",
    headers,
  };

  const url = `${process.env.EAPPLY_URL}/api/v1/courses?limit=99999&tenantId=${tenantId}&endDateFrom=01.01.${year}&endDateTo=31.12.${year}`;

  return fetch(url, options)
    .then(checkStatus)
    .then((response) => response.json())
    .then((data) => data);
};

module.exports = EapplyAdapter;
