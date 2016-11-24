import 'test/setup';
import { StageComponent } from 'aurelia-testing';
import { bootstrap } from 'aurelia-bootstrapper';
import { UxSelect } from './ux-select';

type Option = { text: string, value: any };
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

const view = '<ux-select options.bind="options" value.two-way="value"></ux-select>';
const resources = [
    'src/select/ux-select'
];

function arrange(bindingContext: BindingContext, bind: boolean, attach: boolean): Promise<TComponentTester<UxSelect>> {
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
    expect(uxSelect.value).toBe(bindingContext.value);
    expect(uxSelect['innerValue']).toBe(bindingContext.value);
    expect(uxSelect.options).toBe(bindingContext.options);
    for (let option of bindingContext.options) {
        expect(uxSelect['innerOptions'][bindingContext.options.indexOf(option)]).toBe(option);
    }
};

function assertViewCorrect(uxSelect: UxSelect, bindingContext: BindingContext, optionsAreWrapped: boolean): void {
    let selectElement = <HTMLSelectElement>uxSelect['selectElement'];
    if (optionsAreWrapped) {
        let options = bindingContext.options;
        let selectedOption = bindingContext.options.find((x) => uxSelect['defaultMatcher'](x, bindingContext.value));
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

describe('ux-select', () => {

    describe('bind()', () => {
        describe('when options is null', () => {
            let bindingContext: BindingContext;

            it('does not throw', (done) => {
                bindingContext = <any>{};
                bindingContext.options = <any>null
                bindingContext.value = 'Foo';

                arrange(bindingContext, false, false)
                    .then((c) => {
                        let err: any;
                        try {
                            c.bind();
                        }
                        catch (e) {
                            err = e;
                        }
                        expect(err).toBeUndefined();
                        done();
                    });

            });
        });

        describe('when options is not null and not an array', () => {
            let sut: UxSelect;

            it('throws', () => {
                sut = new UxSelect(<any>null, <any>null, <any>null);
                let err: any;
                try {
                    sut.optionsChanged(<any>5);
                }
                catch (e) {
                    err = e;
                }
                expect(err.message).toBe('\'options\' must be an array');
            });
        });
    });

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

            arrange(bindingContext, true, true)
                .then((c) => {
                    component = c;
                    done();
                });
        });

        it('binds correctly', () => {
            assertViewModelCorrect(component.viewModel, bindingContext);
        });

        it('renders correctly', () => {
            assertViewCorrect(component.viewModel, bindingContext, false);
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

            arrange(bindingContext, true, true)
                .then((c) => {
                    component = c;
                    done();
                });
        });

        it('binds correctly', () => {
            assertViewModelCorrect(component.viewModel, bindingContext);
        });

        it('renders correctly', () => {
            assertViewCorrect(component.viewModel, bindingContext, true);
        });
    });

    describe('style', () => {
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

            arrange(bindingContext, true, true)
                .then((c) => {
                    component = c;
                    done();
                });
        });

        it('is injected into the document head', () => {
            let styles = Array
                .from(document.head.querySelectorAll('style'))
                .filter((x) => x.innerHTML.indexOf('select_au_ux') > -1);

            expect(styles.length).toBe(1);
            expect(styles[0].innerHTML).toContain('select_wrapper_au_ux_1');
            expect(styles[0].innerHTML).toContain('select_au_ux_2');
        });

        it('is added to the select element\'s classList', () => {
            let selectElement = <HTMLSelectElement>component.viewModel['selectElement'];

            expect(selectElement.classList).toContain('select_au_ux_2');
        });
    });
});