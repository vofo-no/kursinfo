import Adapter from "./adapterBase";

export interface KasCourse {
  BATCH_ID: string;
  Kurs_id: string;
  Kursnavn: string;
  Kurssted: string;
  Kurs_Kommunenr: string;
  Org_Id: string;
  Org_navn: string;
  Produkt: string;
  Kursomraade_id: string;
  Kursomraade_navn: string;
  Semester: string;
  Status: string;
  SSB: string;
  SSB_Arrangor_navn: string;
  Arrangor_id: string;
  Arrangor_navn: string;
  Startdato: string;
  Sluttdato: string;
  Org_Kommune_nr: string;
  Tiltakstype: string;
  Tidspunkt: string;
  Tidspunkt_kode: string;
  Nivaa: string;
  Nivaa_kode: string;
  Emnekode: string;
  Emnenavn_SSB_: string;
  Studieplan_id: number;
  Studieplannavn: string;
  Timer_med_laerer: number;
  Timer_uten_laerer: number;
  Timer_online: number;
  Timer_totalt: number;
  Antall_tilskb_deltakere: number;
  Opplaeringstilskudd: number;
  Tilrettelegging_sum: number;
  Menn_sum: number;
  Kvinner_sum: number;
  Sum_antall_deltakere: number;
  Tilrettelegging__Ja_Nei_: string;
  Statstotte__Ja_Nei_: string;
  RC_STATUS: string;
  FINAL_STATUS: string;
  RC_SUM_COSTS: number;
  RC_SUM_INCOME: number;
}

export class KasAdapter extends Adapter {}
