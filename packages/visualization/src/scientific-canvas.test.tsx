import React from "react";
import { create } from "@react-three/test-renderer";
import { describe, expect, it } from "vitest";

import { NeutralTestObject } from "./scientific-canvas";

describe("NeutralTestObject", () => {
  it("creates one React Three Fiber mesh", async () => {
    const renderer = await create(<NeutralTestObject />);

    expect(renderer.scene.findAllByType("Mesh")).toHaveLength(1);

    await renderer.unmount();
  });
});
