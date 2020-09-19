/** CSS Module maps classes to their hased version */
type CSSModule = { [key: string]: string };
type Getter = (
  block: string,
  element?: string,
  modifiers?: string[],
  ...cns: string[]
) => string;

export class BEM {
  private _module: CSSModule;
  getter: Getter;

  constructor(_module: CSSModule) {
    this._module = _module;
    this.getter = this.get.bind(this);
  }

  get(block, element, modifiers, ...cns) {
    const base = block + (element ? `__${element}` : "");
    const modified = (modifiers || []).map((m) => `${base}--${m}`);
    const hashed = [base, ...modified].map((cls) => this._module[cls]);
    return [hashed, ...cns].filter(Boolean).join(" ");
  }
}
