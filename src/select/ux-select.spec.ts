import 'test/setup';
import { StageComponent } from 'aurelia-testing';
import { bootstrap } from 'aurelia-bootstrapper';
import { UxSelect } from './ux-select';

declare type Option = { text: string, value: any };

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


function arrange(options: any[], value: any, bind: boolean, attach: boolean): Promise<TComponentTester<UxSelect>> {
    let opt = options;
    let val = value;

    return Promise
        .resolve(StageComponent
            .withResources(resources)
            .inView(view)
            .boundTo({ options: opt, value: val })
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

describe('ux-select', () => {
    let options: Option[];

    beforeAll(() => {
        options = [
            { text: 'Option 1', value: 1 },
            { text: 'Option 2', value: 2 },
            { text: 'Option 3', value: 3 }
        ];
    });

    describe('when bound to three simple options with the first as it\'s value', () => {
        let component: TComponentTester<UxSelect>;

        beforeAll((done) => {
            arrange(options, options[0].value, true, true)
                .then((c) => {
                    component = c;
                    done();
                });
        });

        it('viewModel.value should be equal to first option\'s value', () => {
            expect(component.viewModel.value).toBe(options[0].value);
        });

        it('viewModel.options should be equal to passed in options', () => {
            expect(component.viewModel.options).toBe(options);
        });

        it('the innerHTML should contain the text of all options', () => {
            for (let opt of options) {
                expect(component.viewModel.select.innerHTML).toContain(opt.text);
            }
        });
    });
});

