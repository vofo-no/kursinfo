import { and, eq } from "drizzle-orm";

import { db } from "../db";
import { features } from "../schema";

export interface FeatureSettings {
  kurslarer: { dbScope: string; dataScope: string };
}

const nonEmptyString = (v: unknown): v is string =>
  typeof v === "string" && v.length > 0;

// One validator per feature, so each name maps to a checked settings shape
const validators: {
  [K in keyof FeatureSettings]: (v: unknown) => v is FeatureSettings[K];
} = {
  kurslarer: (v): v is FeatureSettings["kurslarer"] => {
    if (typeof v !== "object" || v === null) return false;
    const { dbScope, dataScope } = v as Record<string, unknown>;
    return nonEmptyString(dbScope) && nonEmptyString(dataScope);
  },
};

export async function getFeatureSettings<K extends keyof FeatureSettings>(
  featureName: K,
  session: Record<string, unknown> | null,
): Promise<FeatureSettings[K] | null> {
  const organizationId = session?.["activeOrganizationId"];
  if (!nonEmptyString(organizationId)) return null;

  const [row] = await db
    .select()
    .from(features)
    .where(
      and(
        eq(features.name, featureName),
        eq(features.organizationId, organizationId),
      ),
    );
  if (!row) return null;

  if (!validators[featureName](row.settings)) {
    console.error(
      `Invalid settings for feature "${featureName}" (organization ${organizationId})`,
    );
    return null;
  }

  return row.settings as FeatureSettings[K];
}
