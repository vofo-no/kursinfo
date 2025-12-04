import { expect, test } from "vitest";

import { getTeacherKey } from "./teacher-key";

test("teacher key generation", () => {
  const key1 = getTeacherKey("Mats", "Grimsgaard", "m", "123");
  expect(key1).toMatchSnapshot();

  const key2 = getTeacherKey("Mads", "Grimsgård", "m", "123");
  expect(key1).toEqual(key2);

  const key3 = getTeacherKey("Mats", "Grimsgaard", "m", "223");
  expect(key3).toMatchSnapshot();
  expect(key1).not.toEqual(key3);
});
