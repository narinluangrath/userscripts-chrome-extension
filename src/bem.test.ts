import { BEM } from "./bem";

const cssModule = {
  block: "block",
  block__element: "block__element",
  "block__element--modifier": "block__element--modifier",
  "block__element--modifier2": "block__element--modifier2",
  "block--modifier": "block--modifier",
  "block--modifier2": "block--modifier2",
};

describe("BEM", () => {
  it("parses block", () => {
    const bem = new BEM(cssModule);
    expect(bem.get("block")).toEqual("block");
    expect(bem.get("block", null, ["modifier"])).toEqual(
      "block block--modifier"
    );
    expect(bem.get("block", null, ["modifier", "modifier2"])).toEqual(
      "block block--modifier block--modifier2"
    );
  });

  it("parses element", () => {
    const bem = new BEM(cssModule);
    expect(bem.get("block", "element")).toEqual("block__element");
    expect(bem.get("block", "element", ["modifier"])).toEqual(
      "block__element block__element--modifier"
    );
    expect(bem.get("block", "element", ["modifier", "modifier2"])).toEqual(
      "block__element block__element--modifier block__element--modifier2"
    );
  });
});
