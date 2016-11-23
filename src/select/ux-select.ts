import {customElement, bindable, ViewResources, View, processAttributes} from 'aurelia-templating';
import {inject} from 'aurelia-dependency-injection';
import {StyleEngine} from '../styles/style-engine';
import {Themable} from '../styles/themable';
import {processDesignAttributes} from '../designs/design-attributes';

@inject(ViewResources, StyleEngine)
@customElement('ux-select')
@processAttributes(processDesignAttributes)
export class UxSelect implements Themable  {
  @bindable public theme = null;
  @bindable public options = [];
  @bindable public value = null;

  public view: View;
  private select: HTMLSelectElement;

  constructor(public resources: ViewResources, private styleEngine: StyleEngine) {}
  
  public created(_: any, myView: View) {
    this.view = myView;
  }

  public bind() {
    if (this.theme) {
      this.styleEngine.applyTheme(this, this.theme);
    }
  }

  public themeChanged(newValue: any) {
    this.styleEngine.applyTheme(this, newValue);
  }
}
