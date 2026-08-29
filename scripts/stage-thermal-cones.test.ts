import { describe, expect, it } from "vitest";

import {
  ACCEPTED_MANIFEST_REVISION,
  ACCEPTED_MANIFEST_SHA256,
  assertManifestIdentity,
  resolvePortablePath,
} from "./stage-thermal-cones";

describe("Thermal Cone handoff verification", () => {
  it("accepts only the recorded manifest identity", () => {
    expect(() =>
      assertManifestIdentity(
        { revision: ACCEPTED_MANIFEST_REVISION },
        ACCEPTED_MANIFEST_SHA256,
      ),
    ).not.toThrow();

    expect(() =>
      assertManifestIdentity(
        { revision: ACCEPTED_MANIFEST_REVISION + 1 },
        ACCEPTED_MANIFEST_SHA256,
      ),
    ).toThrow(/revision mismatch/);

    expect(() =>
      assertManifestIdentity(
        { revision: ACCEPTED_MANIFEST_REVISION },
        "0".repeat(64),
      ),
    ).toThrow(/SHA-256 mismatch/);
  });

  it("rejects portable paths that escape the research authority root", () => {
    expect(resolvePortablePath("C:/research", "outputs/data.json")).toContain(
      "outputs",
    );
    expect(() =>
      resolvePortablePath("C:/research", "../product/asset.json"),
    ).toThrow(/escapes/);
  });
});
