import { describe, expect, it } from "vitest";

import { getTeacherKey } from "./teacher-key";

const SECRET = "test-secret";
const key = (name = "Kari Nordmann", year = "1985", gender = "f") =>
  getTeacherKey(SECRET, name, year, gender);

// a, b, ..., z, ba, bb, ...: letters only (so normalization keeps them) and unique per n
const letters = (n: number) => {
  let s = "";
  do {
    s = String.fromCharCode(97 + (n % 26)) + s;
    n = Math.floor(n / 26);
  } while (n > 0);
  return s;
};

describe("getTeacherKey: format", () => {
  it("is 12 lowercase alphanumeric characters (URL-safe)", () => {
    expect(key()).toMatch(/^[0-9a-z]{12}$/);
  });

  it.each([
    "A",
    "Åse Øvrebø",
    "Marie-Louise O'Brien",
    "  Kari  Nordmann  ",
    "Анна Иванова",
  ])("keeps the format for the name %j", (name) => {
    expect(key(name)).toMatch(/^[0-9a-z]{12}$/);
  });

  it("keeps the format across many keys, including ones that need left padding", () => {
    for (let n = 0; n < 500; n++) {
      expect(key(letters(n))).toMatch(/^[0-9a-z]{12}$/);
    }
  });

  it("is pinned to a known value, so changing the scheme is a deliberate act", () => {
    // Changing the normalization, the hash input, the length or the secret
    // changes every teacher id and invalidates all redactions and aliases.
    // Run once locally to fill in the snapshot, review it, and commit it.
    expect(
      getTeacherKey("pinned-secret", "Kari Nordmann", "1985", "f"),
    ).toMatchInlineSnapshot(`"348kozyzh5vu"`);
  });
});

describe("getTeacherKey: determinism", () => {
  it("returns the same key for the same inputs and secret", () => {
    expect(key()).toBe(key());
  });

  it("returns a different key for a different secret", () => {
    expect(
      getTeacherKey("another-secret", "Kari Nordmann", "1985", "f"),
    ).not.toBe(key());
  });

  it("ignores case and surrounding whitespace in the parts", () => {
    expect(key("Kari Nordmann", " 1985 ", "F")).toBe(key());
  });
});

describe("getTeacherKey: what makes teachers distinct", () => {
  it("differs by name, year and gender", () => {
    const base = key();
    expect(key("Ola Hansen")).not.toBe(base);
    expect(key("Kari Nordmann", "1986")).not.toBe(base);
    expect(key("Kari Nordmann", "1985", "m")).not.toBe(base);
  });

  it("depends on the order of the parts", () => {
    expect(getTeacherKey(SECRET, "Kari", "1985", "f")).not.toBe(
      getTeacherKey(SECRET, "Kari", "f", "1985"),
    );
  });

  it("treats the whole name as one value, in the order given", () => {
    expect(key("Kari Nordmann")).not.toBe(key("Nordmann Kari"));
  });

  it("does not ignore middle names (they make a separate teacher; merge fixes it)", () => {
    expect(key("Kari Anne Nordmann")).not.toBe(key("Kari Nordmann"));
  });

  it("does not confuse extra name arguments with a single name", () => {
    // guards against a call site that still passes first and last name separately
    expect(getTeacherKey(SECRET, "Kari", "Nordmann", "1985")).not.toBe(
      getTeacherKey(SECRET, "Kari Nordmann", "1985"),
    );
  });

  it("produces no collisions across a few thousand distinct teachers", () => {
    const keys = new Set<string>();
    let inputs = 0;
    for (let year = 1950; year < 2005; year++) {
      for (const gender of ["f", "m"]) {
        for (let n = 0; n < 30; n++) {
          keys.add(
            key(`${letters(n)} ${letters(n * 7 + 3)}`, String(year), gender),
          );
          inputs++;
        }
      }
    }
    expect(inputs).toBe(55 * 2 * 30);
    expect(keys.size).toBe(inputs);
  });
});

describe("getTeacherKey: normalization", () => {
  it.each([
    ["Kari Nordmann", "  kari   NORDMANN "],
    ["Marie-Louise Berg", "Marie Louise Berg"],
    ["Kari Hansen-Berg", "Kari Hansen Berg"],
    ["Kari O'Brien", "Kari O’Brien"], // straight vs curly apostrophe
    ["Kari Nordmann", "Kari. Nordmann"],
    ["José Álvarez", "Jose Alvarez"],
    ["José Nordmann", "Jose\u0301 Nordmann"], // precomposed vs combining accent
  ])("treats %j and %j as the same teacher", (a, b) => {
    expect(key(a)).toBe(key(b));
  });

  it("keeps æ, ø and å as distinct letters", () => {
    expect(key("Åse Berg")).not.toBe(key("Ase Berg"));
    expect(key("Bjørn Hansen")).not.toBe(key("Bjorn Hansen"));
    expect(key("Kari Næss")).not.toBe(key("Kari Nass"));
  });

  it("treats composed and decomposed å as the same letter", () => {
    expect(key("Åse Berg")).toBe(key("A\u030ase Berg"));
  });

  it("folds other accents, including ö and ä (documents current behavior)", () => {
    expect(key("Björk Müller")).toBe(key("Bjork Muller"));
    expect(key("Märta Berg")).toBe(key("Marta Berg"));
  });

  it("ignores digits and punctuation in names (documents current behavior)", () => {
    expect(key("Kari2 Nordmann")).toBe(key("Kari Nordmann"));
  });
});

describe("getTeacherKey: names without letters", () => {
  it.each(["", "   ", "-", "1234", "'", "...", " \t "])(
    "throws for the name %j",
    (name) => {
      expect(() => key(name)).toThrow("without a name");
    },
  );
});
