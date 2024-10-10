import { Adapter } from "../types";
import { EapplyAdapter } from "./eapply";

export const adapters: Record<string, Adapter | undefined> = {
  eapply: new EapplyAdapter(),
};
