/** CSS Module maps classes to their hased version */
type CSSModule = { [key: string]: string };

export class BEM {
  private _module: CSSModule;

  constructor(_module: CSSModule) {
    this._module = _module;
  }

  get(
    block: string,
    element?: string | null,
    modifiers?: Array<string> | null
  ): string {
    const base = block + (element ? `__${element}` : "");
    const modified = (modifiers || []).map((m) => `${base}--${m}`);
    const hashed = [base, ...modified].map((cls) => this._module[cls]);
    return hashed.filter(Boolean).join(" ");
  }
}
