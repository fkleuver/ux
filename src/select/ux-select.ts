import { customElement, bindable, ViewResources, View, processAttributes } from 'aurelia-templating';
import { bindingMode, observable, BindingEngine, Disposable } from 'aurelia-binding';
import { inject } from 'aurelia-dependency-injection';
import { StyleEngine } from '../styles/style-engine';
import { Themable } from '../styles/themable';
import { processDesignAttributes } from '../designs/design-attributes';

@inject(ViewResources, StyleEngine, BindingEngine)
@customElement('ux-select')
@processAttributes(processDesignAttributes)
export class UxSelect implements Themable {

    private defaultMatcher = (a: any, b: any) => {
        if (this.textProperty) {
            return a[this.textProperty] === b[this.textProperty];
        } else {
            return a === b;
        }
    }

    @bindable({ defaultBindingMode: bindingMode.oneTime })
    public matcher: (a: any, b: any) => boolean = this.defaultMatcher;

    @bindable({ defaultBindingMode: bindingMode.oneTime, defaultValue: 'text' })
    public textProperty: string;

    @bindable({ defaultBindingMode: bindingMode.oneTime, defaultValue: null })
    public valueProperty: string;

    @bindable({ defaultBindingMode: bindingMode.oneWay })
    public theme: any = null;

    @bindable({ defaultBindingMode: bindingMode.oneWay })
    public options: any[] = <any>null;

    @bindable({ defaultBindingMode: bindingMode.twoWay })
    public value: any = null;

    public view: View;
    private selectElement: HTMLSelectElement;
    private isAttached: boolean = false;
    private innerOptions: any[] = [];
    @observable private innerValue: any = null;
    private optionsCollectionSubscription: Disposable;

    constructor(
        public resources: ViewResources,
        private styleEngine: StyleEngine,
        private bindingEngine: BindingEngine) {

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
    }

    public detached(): void {
        this.isAttached = false;
    }

    public unbind(): void {
        this.innerOptions = [];
        this.innerValue = null;

        if (this.optionsCollectionSubscription) {
            this.optionsCollectionSubscription.dispose();
            this.optionsCollectionSubscription = <any>null;
        }
    }

    public themeChanged(newValue: any): void {
        if (newValue) {
            this.styleEngine.applyTheme(this, newValue);
        }
    }

    public optionsChanged(newValue: any[]): void {
        if (this.optionsCollectionSubscription) {
            this.optionsCollectionSubscription.dispose();
            this.optionsCollectionSubscription = <any>null;
        }

        this.innerOptions = [];

        if (!newValue) {
            return;
        }

        if (!isArray(newValue)) {
            throw new Error('\'options\' must be an array');
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
        if ((this.valueProperty ? this.value[this.valueProperty] : this.value) !== newValue) {
            this.value = newValue;
        }
    }

    private addOption(option: any): void {
        if (isSimpleType(option) && this.valueProperty) {
            let wrappedOption: any = {};
            wrappedOption[this.valueProperty] = option;
            wrappedOption[this.textProperty] = option.toString();
            this.innerOptions.push(wrappedOption);
        } else {
            this.innerOptions.push(option);
        }
    }

    private removeOption(option: any): void {
        let idx: number;
        if (isSimpleType(option)) {
            let wrappedOption = this.innerOptions.find((x) => x[this.valueProperty] === option);
            idx = this.innerOptions.indexOf(wrappedOption);
        } else {
            idx = this.innerOptions.indexOf(option);
        }
        this.innerOptions.splice(idx);
    }
}

interface ChangeRecords {
    addedCount: number;
    index: number;
    removed: any[];
}

function isSimpleType(value: any): boolean {
    const type = Object.prototype.toString.call(value);
    return type === '[object String]' ||
        type === '[object Number]' ||
        type === '[object Boolean]' ||
        type === '[object Date]' ||
        type === '[object RegExp]';
}

function isArray(value: any): boolean {
    const type = Object.prototype.toString.call(value);
    return type === '[object Array]';
}