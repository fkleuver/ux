import { customElement, bindable, ViewResources, View, processAttributes } from 'aurelia-templating';
import { bindingMode, observable, BindingEngine, Disposable } from 'aurelia-binding';
import { inject } from 'aurelia-dependency-injection';
import { DOM } from 'aurelia-pal';
import { StyleEngine } from '../styles/style-engine';
import { Themable } from '../styles/themable';
import { processDesignAttributes } from '../designs/design-attributes';
import { SelectProperty } from './select-property';
import * as Types from './types';

let nextId = 0;

@inject(DOM.Element, ViewResources, StyleEngine, BindingEngine)
@customElement('ux-select')
@processAttributes(processDesignAttributes)
export class UxSelect implements Themable {

    private defaultMatcher = (a: any, b: any) => {
        const convert = new SelectProperty();
        return (convert.toView(a, this.textProperty) === convert.toView(b, this.textProperty));
    }

    @bindable({ defaultBindingMode: bindingMode.oneTime, defaultValue: true })
    public nativeMode: boolean;

    @bindable({ defaultBindingMode: bindingMode.oneTime })
    public matcher: (a: any, b: any) => boolean = this.defaultMatcher;

    @bindable({ defaultBindingMode: bindingMode.oneTime, defaultValue: 'text' })
    public textProperty: string;

    @bindable({ defaultBindingMode: bindingMode.oneWay })
    public theme: any = null;

    @bindable({ defaultBindingMode: bindingMode.oneWay })
    public options: any[] = <any>null;

    @bindable({ defaultBindingMode: bindingMode.twoWay })
    public value: any = null;

    @bindable({ defaultBindingMode: bindingMode.oneWay })
    public disabled: boolean = false;

    @bindable({ defaultBindingMode: bindingMode.oneWay })
    public stopPropagation: boolean = false;

    public id: number = nextId++;
    public index: number = -1;
    public expanded: boolean = false;
    public view: View;
    public ulElement: HTMLUListElement;
    public selectElement: HTMLSelectElement;
    public itemTemplate: HTMLDivElement;
    private isAttached: boolean = false;
    private innerOptions: any[] = [];
    @observable private innerValue: any = null;
    private optionsCollectionSubscription: Disposable;

    public element: HTMLElement;
    constructor(
        element: Element,
        public resources: ViewResources,
        private styleEngine: StyleEngine,
        private bindingEngine: BindingEngine) {
        this.element = <HTMLElement>element;
    }

    public created(_: any, myView: View): void {
        this.view = myView;
    }

    public bind(): void {
        this.themeChanged(this.theme);
        this.optionsChanged(this.options);
        this.valueChanged(this.value);
    }

    public attached(): void {
        this.isAttached = true;
        if (!this.nativeMode) {
            this.element.setAttribute('tabindex', '0');
        }
    }

    public detached(): void {
        this.isAttached = false;
    }

    public unbind(): void {
        this.innerOptions = [];
        this.innerValue = null;

        if (!Types.isUndefinedOrNull(this.optionsCollectionSubscription)) {
            this.optionsCollectionSubscription.dispose();
            this.optionsCollectionSubscription = <any>null;
        }
    }

    public themeChanged(newValue: any): void {
        if (!Types.isUndefinedOrNull(newValue)) {
            this.styleEngine.applyTheme(this, newValue);
        }
    }

    public optionsChanged(newValue: any[]): void {
        if (!Types.isUndefinedOrNull(this.optionsCollectionSubscription)) {
            this.optionsCollectionSubscription.dispose();
            this.optionsCollectionSubscription = <any>null;
        }

        this.innerOptions = [];

        if (Types.isUndefinedOrNull(newValue)) {
            return;
        }

        if (!Types.isCollection(newValue)) {
            throw new Error('\'options\' must be a collection type');
        }

        this.optionsCollectionSubscription = this.bindingEngine
            .collectionObserver(this.options)
            .subscribe(this.optionsCollectionChanged);

        for (let option of newValue) {
            this.addOption(option);
        }
    }

    private optionsCollectionChanged = (changeRecords: ChangeRecords) => {
        for (let removedOption of changeRecords.removed) {
            this.removeOption(removedOption);
        }

        for (let i = 0; i < changeRecords.addedCount; i++) {
            let addedOption = this.options[changeRecords.index + i];
            this.addOption(addedOption);
        }
    }

    public valueChanged(newValue: any): void {
        if (this.innerValue !== newValue) {
            this.innerValue = newValue;
        }
    }

    protected innerValueChanged(newValue: any): void {
        if (this.isAttached && this.value !== newValue) {
            this.value = newValue;
        }
        let innerOption = this.innerOptions.find((x) => this.matcher(x, newValue));
        this.index = this.innerOptions.indexOf(innerOption);
    }

    private addOption(option: any): void {
        if (Types.isScalar(option)) {
            let wrappedOption: any = {};
            wrappedOption[this.textProperty] = option.toString();
            this.innerOptions.push(wrappedOption);
        } else {
            this.innerOptions.push(option);
        }
    }

    private removeOption(option: any): void {
        let innerOption = this.innerOptions.find((x) => this.matcher(x, option));
        let idx = this.innerOptions.indexOf(innerOption);
        this.innerOptions.splice(idx);
    }

    public select(option: any): void {
        this.innerValue = option;
        this.expanded = false;
    }

    protected inputClick() {
        this.expanded = !this.expanded;
        return !this.stopPropagation;
    }

    protected selectBlur() {
        this.expanded = false;
    }
}

interface ChangeRecords {
    addedCount: number;
    index: number;
    removed: any[];
}
