import {customElement, bindable} from 'aurelia-templating';

@customElement('ux-select')
export class UxSelect {
  @bindable public options = [];
  @bindable public value = null;

  public select: HTMLSelectElement;
}
