import { IDataFile, IReportBase, ReportMunicipality } from "types/reports";

export default function getMunicipalitiesFromData(
  municipalities: IDataFile["municipalities"],
  municipalityKeys: Array<string>,
  municipalityValues: IReportBase["municipalityValues"]
): Array<ReportMunicipality> {
  return municipalityKeys
    .map((key) => ({
      name: municipalities[key].name,
      values: municipalityValues[key],
    }))
    .sort((a, b) => b.values[3] - a.values[3]);
}
