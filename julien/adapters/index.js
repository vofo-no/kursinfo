const EapplyAdapter = require("./eapply").EapplyAdapter;
const KasAdapter = require("./kas").KasAdapter;

/** @typedef {"eapply" | "kas"} adapterName */

function getAdapters() {
  /**
   * @constant
   * @type {Record<adapterName, import("../../types/courses").Adapter>}
   */
  const adapters = { eapply: new EapplyAdapter(), kas: new KasAdapter() };

  return adapters;
}

exports.getAdapters = getAdapters;
