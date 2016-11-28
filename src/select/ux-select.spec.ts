import 'test/setup';
import { StageComponent } from 'aurelia-testing';
import { bootstrap } from 'aurelia-bootstrapper';
import { PLATFORM, DOM } from 'aurelia-pal';
import { UxSelect } from './ux-select';

type BindingContext = { options: any[], value: any, textProperty: string, valueProperty: string, theme: any };

interface TComponentTester<T> {
    bind(): Promise<void>;
    attached(): Promise<void>;
    detached(): Promise<void>;
    unbind(): Promise<void>;

    host: HTMLElement;
    element: HTMLElement;
    viewModel: T;
}

const resources = [
    'src/select/ux-select'
];

function arrange(bindingContext: BindingContext, bind: boolean, attach: boolean, view: string): Promise<TComponentTester<UxSelect>> {
    return Promise
        .resolve(StageComponent
            .withResources(resources)
            .inView(view)
            .boundTo(bindingContext)
            .manuallyHandleLifecycle())
        .then((c) => {
            return c.create(bootstrap).then(() => Promise.resolve(c));
        })
        .then((c) => {
            if (bind === true) {
                return c.bind().then(() => Promise.resolve(c));
            } else {
                return Promise.resolve(c);
            }
        })
        .then((c) => {
            if (attach === true) {
                return c.attached().then(() => Promise.resolve(c));
            } else {
                return Promise.resolve(c);
            }
        });
};

function assertViewModelCorrect(uxSelect: UxSelect, bindingContext: BindingContext): void {
    const optionsAreWrapped = Object.prototype.toString.call((<any>uxSelect).innerValue) !== Object.prototype.toString.call(uxSelect.value);
    expect(uxSelect.value).toBe(bindingContext.value);
    if (optionsAreWrapped) {
        expect((<any>uxSelect).innerValue.text).toBe(bindingContext.value);
    } else {
        expect((<any>uxSelect).innerValue).toBe(bindingContext.value);
    }
    expect(uxSelect.options).toBe(bindingContext.options);
    for (let option of bindingContext.options) {
        if (optionsAreWrapped) {
            expect((<any>uxSelect).innerValue.text).toBe(bindingContext.value);
        } else {
            expect((<any>uxSelect).innerOptions[bindingContext.options.indexOf(option)]).toBe(option);
        }
    }
};

function assertViewCorrectNative(uxSelect: UxSelect, bindingContext: BindingContext, optionsAreWrapped: boolean): void {
    let selectElement = <HTMLSelectElement>(<any>uxSelect).selectElement;
    if (optionsAreWrapped) {
        let selectedOption = bindingContext.options.find((x) => (<any>uxSelect).defaultMatcher(x, bindingContext.value));
        expect(selectElement.value).toBe(selectedOption);
    } else {
        let expectedValue = uxSelect.textProperty ? bindingContext.value[uxSelect.textProperty] : bindingContext.value;
        expect(selectElement.value).toBe(expectedValue);
    }

    for (let option of bindingContext.options) {
        let optionElement = selectElement.options[bindingContext.options.indexOf(option)];
        let expectedText = uxSelect.textProperty && option[uxSelect.textProperty] ? option[uxSelect.textProperty] : option;
        expect(optionElement.innerHTML).toContain(expectedText);

    }
};

function assertViewCorrectCustom(uxSelect: UxSelect, bindingContext: BindingContext, optionsAreWrapped: boolean): void {
    let ulElement = <HTMLUListElement>(<any>uxSelect).ulElement;
    let labelElement = <HTMLLabelElement>(<any>uxSelect).element.querySelector('label');
    if (optionsAreWrapped) {
        let selectedOption = bindingContext.options.find((x) => (<any>uxSelect).defaultMatcher(x, bindingContext.value));
        expect(labelElement.innerText).toContain(selectedOption);
    } else {
        let expectedValue = uxSelect.textProperty ? bindingContext.value[uxSelect.textProperty] : bindingContext.value;
        expect(labelElement.innerText).toContain(expectedValue);
    }

    console.log(ulElement.innerHTML);
    let listElements = Array.from(ulElement.querySelectorAll('ux-option'));
    for (let option of bindingContext.options) {
        let idx = bindingContext.options.indexOf(option);
        let optionElement = listElements[idx];
        let expectedText = uxSelect.textProperty && option[uxSelect.textProperty] ? option[uxSelect.textProperty] : option;
        expect(optionElement.innerHTML).toContain(expectedText);

    }
};

describe('ux-select', () => {
    describe('by default', () => {
        let sut: UxSelect;
        let dummyElement: any;
        let dummyResources: any;
        let dummyStyleEngine: any;
        let dummyBindingEngine: any;

        beforeEach(() => {
            dummyElement = {};
            dummyResources = {};
            dummyStyleEngine = {};
            dummyBindingEngine = {};
            sut = new UxSelect(dummyElement, dummyResources, dummyStyleEngine, dummyBindingEngine);
        });

        it('nativeMode is undefined', () => {
            expect(sut.nativeMode).toBe(undefined);
        });

        it('matcher is a function', () => {
            expect(Object.prototype.toString.call(sut.matcher)).toBe('[object Function]');
        });

        it('textProperty is undefined', () => {
            expect(sut.nativeMode).toBe(undefined);
        });

        it('theme is null', () => {
            expect(sut.theme).toBe(null);
        });

        it('options is null', () => {
            expect(sut.options).toBe(null);
        });

        it('value is null', () => {
            expect(sut.value).toBe(null);
        });

        it('disabled is false', () => {
            expect(sut.disabled).toBe(false);
        });

        it('stopPropagation is false', () => {
            expect(sut.stopPropagation).toBe(false);
        });

        it('id is a non-negative number', () => {
            expect(sut.id).toBeGreaterThan(-1);
        });

        it('index is -1', () => {
            expect(sut.index).toBe(-1);
        });

        it('expanded is false', () => {
            expect(sut.expanded).toBe(false);
        });

        it('view is undefined', () => {
            expect(sut.view).toBe(undefined);
        });

        it('ulElement is undefined', () => {
            expect(sut.ulElement).toBe(undefined);
        });

        it('selectElement is undefined', () => {
            expect(sut.selectElement).toBe(undefined);
        });

        it('itemTemplate is undefined', () => {
            expect(sut.itemTemplate).toBe(undefined);
        });

        it('isAttached is false', () => {
            expect((<any>sut).isAttached).toBe(false);
        });

        it('innerOptions is an array', () => {
            expect(Object.prototype.toString.call((<any>sut).innerOptions)).toBe('[object Array]');
        });

        it('innerOptions is empty', () => {
            expect((<any>sut).innerOptions.length).toBe(0);
        });

        it('innerValue is null', () => {
            expect((<any>sut).innerValue).toBe(null);
        });

        it('optionsCollectionSubscription is undefined', () => {
            expect((<any>sut).optionsCollectionSubscription).toBe(undefined);
        });

        it('resources is dummyResources', () => {
            expect(sut.resources).toBe(dummyResources);
        });

        it('styleEngine is dummyStyleEngine', () => {
            expect((<any>sut).styleEngine).toBe(dummyStyleEngine);
        });

        it('bindingEngine is dummyBindingEngine', () => {
            expect((<any>sut).bindingEngine).toBe(dummyBindingEngine);
        });

        it('element is dummyElement', () => {
            expect(sut.element).toBe(dummyElement);
        });
    });

    describe('created()', () => {
        let sut: UxSelect;

        beforeEach(() => {
            sut = new UxSelect(<any>null, <any>null, <any>null, <any>null);
        });

        it('sets the view', () => {
            let dummyView: any = {};
            sut.created(null, dummyView);
            expect(sut.view).toBe(dummyView);
        });
    });

    describe('bind()', () => {
        let sut: UxSelect;

        beforeEach(() => {
            sut = new UxSelect(<any>null, <any>null, <any>null, <any>null);
        });

        it('calls themeChanged()', () => {
            let spy = spyOn(sut, 'themeChanged').and.callFake(PLATFORM.noop);
            sut.bind();
            expect(spy).toHaveBeenCalledWith(sut.theme);
        });

        it('calls optionsChanged()', () => {
            let spy = spyOn(sut, 'optionsChanged').and.callFake(PLATFORM.noop);
            sut.bind();
            expect(spy).toHaveBeenCalledWith(sut.options);
        });

        it('calls valueChanged()', () => {
            let spy = spyOn(sut, 'valueChanged').and.callFake(PLATFORM.noop);
            sut.bind();
            expect(spy).toHaveBeenCalledWith(sut.value);
        });
    });

    describe('attached()', () => {
        let sut: UxSelect;
        let dummyElement: Element;

        beforeEach(() => {
            dummyElement = DOM.createElement('div');
            sut = new UxSelect(dummyElement, <any>null, <any>null, <any>null);
        });

        it('sets isAttached to true', () => {
            sut.attached();
            expect((<any>sut).isAttached).toBe(true);
        });

        describe('when nativeMode is true', () => {
            beforeEach(() => {
                sut.nativeMode = true;
            });

            it('does not set the tabindex of element', () => {
                sut.attached();
                expect(dummyElement.getAttribute('tabindex')).toBe(null);
            });
        });

        describe('when nativeMode is false', () => {
            beforeEach(() => {
                sut.nativeMode = false;
            });

            it('sets the tabindex of element to \'0\'', () => {
                sut.attached();
                expect(dummyElement.getAttribute('tabindex')).toBe('0');
            });
        });
    });

    describe('detached()', () => {
        let sut: UxSelect;

        beforeEach(() => {
            sut = new UxSelect(<any>null, <any>null, <any>null, <any>null);
        });

        it('sets isAttached to false', () => {
            sut.detached();
            expect((<any>sut).isAttached).toBe(false);
        });
    });

    describe('unbind()', () => {
        let sut: UxSelect;
        let dummyOptions: any[];
        let dummyValue: any;

        beforeEach(() => {
            dummyOptions = ['foo'];
            dummyValue = 'bar';
            sut = new UxSelect(<any>null, <any>null, <any>null, <any>null);
            sut.options = (<any>sut).innerOptions = dummyOptions;
            sut.value = (<any>sut).innerValue = dummyValue;
        });

        it('sets innerOptions to empty array', () => {
            sut.unbind();
            expect((<any>sut).innerOptions.length).toBe(0);
        });

        it('sets innerValue to null', () => {
            sut.unbind();
            expect((<any>sut).innerOptions.length).toBe(0);
        });

        it('does not touch options', () => {
            sut.unbind();
            expect(sut.options).toBe(dummyOptions);
        });

        it('does not touch value', () => {
            sut.unbind();
            expect(sut.value).toBe(dummyValue);
        });

        describe('when optionsCollectionSubscription is defined', () => {
            let mockOptionsCollectionSubscription: { dispose: Function };

            beforeEach(() => {
                mockOptionsCollectionSubscription = { dispose: PLATFORM.noop };
                (<any>sut).optionsCollectionSubscription = mockOptionsCollectionSubscription;
            });

            it('calls dispose on it', () => {
                let spy = spyOn(mockOptionsCollectionSubscription, 'dispose').and.callThrough();
                sut.unbind();
                expect(spy).toHaveBeenCalled();
            });

            it('sets it to null', () => {
                sut.unbind();
                expect((<any>sut).optionsCollectionSubscription).toBe(null);
            });
        });
    });

    describe('themeChanged()', () => {
        let sut: UxSelect;
        let mockStyleEngine: any;

        beforeEach(() => {
            mockStyleEngine = { applyTheme: PLATFORM.noop };
            sut = new UxSelect(<any>null, <any>null, mockStyleEngine, <any>null);
        });

        describe('when theme is defined', () => {
            it('calls styleEngine.applyTheme()', () => {
                let spy = spyOn(mockStyleEngine, 'applyTheme').and.callThrough();
                sut.themeChanged({});
                expect(spy).toHaveBeenCalled();
            });
        });

        describe('when theme is undefined', () => {
            it('does not call styleEngine.applyTheme()', () => {
                let spy = spyOn(mockStyleEngine, 'applyTheme').and.callThrough();
                sut.themeChanged(undefined);
                expect(spy).not.toHaveBeenCalled();
            });
        });
    });

    describe('optionsChanged()', () => {
        let sut: UxSelect;
        let mockOptionsCollectionSubscription: { dispose: Function };
        let fakeBindingEngine: any;

        beforeEach(() => {
            mockOptionsCollectionSubscription = { dispose: PLATFORM.noop };
            let dummyObserver = { subscribe: () => mockOptionsCollectionSubscription };
            fakeBindingEngine = { collectionObserver: () => dummyObserver };
            sut = new UxSelect(<any>null, <any>null, <any>null, fakeBindingEngine);
        });

        describe('when optionsCollectionSubscription is defined', () => {

            beforeEach(() => {
                (<any>sut).optionsCollectionSubscription = mockOptionsCollectionSubscription;
            });

            it('calls dispose on it', () => {
                let spy = spyOn(mockOptionsCollectionSubscription, 'dispose').and.callThrough();
                sut.optionsChanged(<any>null);
                expect(spy).toHaveBeenCalled();
            });

            it('sets it to null', () => {
                sut.optionsChanged(<any>null);
                expect((<any>sut).optionsCollectionSubscription).toBe(null);
            });
        });

        describe('when undefined is passed in', () => {
            it('does not throw', () => {
                let err: any;
                try {
                    sut.optionsChanged(<any>null);
                }
                catch (e) {
                    err = e;
                }
                expect(err).toBeUndefined();
            });

            it('resets innerOptions to empty array', () => {
                (<any>sut).innerOptions = ['foo'];
                sut.optionsChanged(<any>null);
                expect((<any>sut).innerOptions.length).toBe(0);
            });
        });

        describe('when a non-collection value is passed in', () => {
            it('throws', () => {
                let err: any;
                try {
                    sut.optionsChanged(<any>5);
                }
                catch (e) {
                    err = e;
                }
                expect(err.message).toBe('\'options\' must be a collection type');
            });
        });

        describe('when a valid collection is passed in', () => {
            it('subscribes to changes', () => {
                sut.optionsChanged([]);
                expect((<any>sut).optionsCollectionSubscription).toBe(mockOptionsCollectionSubscription);
            });

            it('calls addOption for each item in the collection', () => {
                let options = [1, 2, 3];
                let spy = spyOn(sut, 'addOption').and.callFake(PLATFORM.noop);
                sut.optionsChanged(options);
                expect(spy).toHaveBeenCalledWith(options[0]);
                expect(spy).toHaveBeenCalledWith(options[1]);
                expect(spy).toHaveBeenCalledWith(options[2]);
            });
        });
    });

    describe('valueChanged()', () => {
        let sut: UxSelect;

        beforeEach(() => {
            sut = new UxSelect(<any>null, <any>null, <any>null, <any>null);
            sut.value = 'foo';
            (<any>sut).innerValue = 'bar';
        });

        describe('when the value passed in is the same as innerValue', () => {
            it('does not set innerValue', () => {
                sut.valueChanged('bar');
                expect((<any>sut).innerValue).toBe('bar');
            });
        });

        describe('when the value passed in is different from innerValue', () => {
            it('sets innerValue', () => {
                sut.valueChanged('baz');
                expect((<any>sut).innerValue).toBe('baz');
            });
        });
    });

    describe('native', () => {
        const view = '<ux-select options.bind="options" value.two-way="value"></ux-select>';

        describe('when bound to 3 objects with text+value properties', () => {
            let bindingContext: BindingContext;
            let component: TComponentTester<UxSelect>;

            beforeEach((done) => {
                bindingContext = <any>{};
                bindingContext.options = [
                    { text: 'Option 1', value: 1 },
                    { text: 'Option 2', value: 2 },
                    { text: 'Option 3', value: 3 }
                ];
                bindingContext.value = bindingContext.options[1];

                arrange(bindingContext, true, true, view)
                    .then((c) => {
                        component = c;
                        done();
                    });
            });

            it('binds correctly', () => {
                assertViewModelCorrect(component.viewModel, bindingContext);
            });

            it('renders correctly', () => {
                assertViewCorrectNative(component.viewModel, bindingContext, false);
            });
        });

        describe('when bound to 3 strings', () => {
            let bindingContext: BindingContext;
            let component: TComponentTester<UxSelect>;

            beforeEach((done) => {
                bindingContext = <any>{};
                bindingContext.options = [
                    'Option 1',
                    'Option 2',
                    'Option 3'
                ];
                bindingContext.value = bindingContext.options[1];

                arrange(bindingContext, true, true, view)
                    .then((c) => {
                        component = c;
                        done();
                    });
            });

            it('binds correctly', () => {
                assertViewModelCorrect(component.viewModel, bindingContext);
            });

            it('renders correctly', () => {
                assertViewCorrectNative(component.viewModel, bindingContext, true);
            });
        });
    });

    describe('when nativeMode == false', () => {
        const view = '<ux-select options.bind="options" value.two-way="value" native-mode.bind=false></ux-select>';

        describe('when bound to 3 objects with text+value properties', () => {
            let bindingContext: BindingContext;
            let component: TComponentTester<UxSelect>;

            beforeEach((done) => {
                bindingContext = <any>{};
                bindingContext.options = [
                    { text: 'Option 1', value: 1 },
                    { text: 'Option 2', value: 2 },
                    { text: 'Option 3', value: 3 }
                ];
                bindingContext.value = bindingContext.options[1];

                arrange(bindingContext, true, true, view)
                    .then((c) => {
                        component = c;
                        done();
                    });
            });

            it('binds correctly', () => {
                assertViewModelCorrect(component.viewModel, bindingContext);
            });

            it('renders correctly', () => {
                assertViewCorrectCustom(component.viewModel, bindingContext, false);
            });
        });

        describe('when bound to 3 strings', () => {
            let bindingContext: BindingContext;
            let component: TComponentTester<UxSelect>;

            beforeEach((done) => {
                bindingContext = <any>{};
                bindingContext.options = [
                    'Option 1',
                    'Option 2',
                    'Option 3'
                ];
                bindingContext.value = bindingContext.options[1];

                arrange(bindingContext, true, true, view)
                    .then((c) => {
                        component = c;
                        done();
                    });
            });

            it('binds correctly', () => {
                assertViewModelCorrect(component.viewModel, bindingContext);
            });

            it('renders correctly', () => {
                assertViewCorrectCustom(component.viewModel, bindingContext, true);
            });
        });
    });
});
