// src/queries/settings.test.ts
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { db } from "../db";
import { features } from "../schema";
import { getFeatureSettings } from "./settings";

vi.mock("../db", async () => {
  const { createTestDb } = await import("../test/test-db");
  return { db: await createTestDb() };
});

const settings = { dbScope: "s1", dataScope: "d1" };
const session = (activeOrganizationId?: unknown) => ({ activeOrganizationId });

beforeEach(async () => {
  await db.delete(features);
  vi.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("getFeatureSettings", () => {
  it("returns the settings for the session's organization", async () => {
    await db
      .insert(features)
      .values({ name: "kurslarer", organizationId: "org-1", settings });
    expect(await getFeatureSettings("kurslarer", session("org-1"))).toEqual(
      settings,
    );
  });

  it("returns null without a session", async () => {
    await db
      .insert(features)
      .values({ name: "kurslarer", organizationId: "org-1", settings });
    expect(await getFeatureSettings("kurslarer", null)).toBeNull();
  });

  it("returns null when the session has no active organization", async () => {
    await db
      .insert(features)
      .values({ name: "kurslarer", organizationId: "org-1", settings });
    expect(await getFeatureSettings("kurslarer", {})).toBeNull();
    expect(
      await getFeatureSettings("kurslarer", session(undefined)),
    ).toBeNull();
    expect(await getFeatureSettings("kurslarer", session(""))).toBeNull();
  });

  it("returns null for a non-string organization id", async () => {
    await db
      .insert(features)
      .values({ name: "kurslarer", organizationId: "1", settings });
    expect(await getFeatureSettings("kurslarer", session(1))).toBeNull();
  });

  it("returns null when the organization has no row for the feature", async () => {
    expect(await getFeatureSettings("kurslarer", session("org-1"))).toBeNull();
  });

  it("does not log when the feature simply isn't configured", async () => {
    expect(await getFeatureSettings("kurslarer", session("org-1"))).toBeNull();
    expect(console.error).not.toHaveBeenCalled();
  });

  it("does not return another organization's settings", async () => {
    await db
      .insert(features)
      .values({ name: "kurslarer", organizationId: "org-2", settings });
    expect(await getFeatureSettings("kurslarer", session("org-1"))).toBeNull();
  });

  it("does not return another feature's settings", async () => {
    await db
      .insert(features)
      .values({ name: "other-feature", organizationId: "org-1", settings });
    expect(await getFeatureSettings("kurslarer", session("org-1"))).toBeNull();
  });

  it("picks the right row when several organizations and features exist", async () => {
    await db.insert(features).values([
      { name: "kurslarer", organizationId: "org-1", settings },
      {
        name: "kurslarer",
        organizationId: "org-2",
        settings: { dbScope: "s2", dataScope: "d2" },
      },
      { name: "other-feature", organizationId: "org-1", settings: { x: 1 } },
    ]);
    expect(await getFeatureSettings("kurslarer", session("org-2"))).toEqual({
      dbScope: "s2",
      dataScope: "d2",
    });
  });

  it.each([
    ["empty object (the column default)", {}],
    ["only dbScope", { dbScope: "s1" }],
    ["only dataScope", { dataScope: "d1" }],
    ["empty strings", { dbScope: "", dataScope: "d1" }],
    ["non-string values", { dbScope: 1, dataScope: "d1" }],
    ["an array", []],
    ["a string", "oops"],
  ])(
    "returns null and logs for invalid settings: %s",
    async (_label, invalid) => {
      await db.insert(features).values({
        name: "kurslarer",
        organizationId: "org-1",
        settings: invalid,
      });
      expect(
        await getFeatureSettings("kurslarer", session("org-1")),
      ).toBeNull();
      expect(console.error).toHaveBeenCalledTimes(1);
    },
  );
});
