import {
  CompactValues,
  IDataFile,
  IReportBase,
  ReportMunicipality,
} from "@/types/reports";

const noValues: CompactValues = [0, 0, 0, 0];

export default function getMunicipalitiesFromData(
  municipalities: IDataFile["municipalities"],
  municipalityKeys: Array<string>,
  municipalityValues: IReportBase["municipalityValues"],
): Array<ReportMunicipality> {
  return municipalityKeys
    .map((key) => ({
      name: municipalities[key]?.name || key,
      values: municipalityValues[key] || noValues,
      key,
    }))
    .sort((a, b) => b.values[3] - a.values[3]);
}
