import 'test/setup';
import { StageComponent } from 'aurelia-testing';
import { bootstrap } from 'aurelia-bootstrapper';
import { PLATFORM, DOM } from 'aurelia-pal';
import { UxSelect } from './ux-select';
var resources = [
    'src/select/ux-select'
];
function arrange(bindingContext, bind, attach, view) {
    return Promise
        .resolve(StageComponent
        .withResources(resources)
        .inView(view)
        .boundTo(bindingContext)
        .manuallyHandleLifecycle())
        .then(function (c) {
        return c.create(bootstrap).then(function () { return Promise.resolve(c); });
    })
        .then(function (c) {
        if (bind === true) {
            return c.bind().then(function () { return Promise.resolve(c); });
        }
        else {
            return Promise.resolve(c);
        }
    })
        .then(function (c) {
        if (attach === true) {
            return c.attached().then(function () { return Promise.resolve(c); });
        }
        else {
            return Promise.resolve(c);
        }
    });
}
;
function assertViewModelCorrect(uxSelect, bindingContext) {
    var optionsAreWrapped = Object.prototype.toString.call(uxSelect.innerValue) !== Object.prototype.toString.call(uxSelect.value);
    expect(uxSelect.value).toBe(bindingContext.value);
    if (optionsAreWrapped) {
        expect(uxSelect.innerValue.text).toBe(bindingContext.value);
    }
    else {
        expect(uxSelect.innerValue).toBe(bindingContext.value);
    }
    expect(uxSelect.options).toBe(bindingContext.options);
    for (var _i = 0, _a = bindingContext.options; _i < _a.length; _i++) {
        var option = _a[_i];
        if (optionsAreWrapped) {
            expect(uxSelect.innerValue.text).toBe(bindingContext.value);
        }
        else {
            expect(uxSelect.innerOptions[bindingContext.options.indexOf(option)]).toBe(option);
        }
    }
}
;
function assertViewCorrectNative(uxSelect, bindingContext, optionsAreWrapped) {
    var selectElement = uxSelect.selectElement;
    if (optionsAreWrapped) {
        var selectedOption = bindingContext.options.find(function (x) { return uxSelect.defaultMatcher(x, bindingContext.value); });
        expect(selectElement.value).toBe(selectedOption);
    }
    else {
        var expectedValue = uxSelect.textProperty ? bindingContext.value[uxSelect.textProperty] : bindingContext.value;
        expect(selectElement.value).toBe(expectedValue);
    }
    for (var _i = 0, _a = bindingContext.options; _i < _a.length; _i++) {
        var option = _a[_i];
        var optionElement = selectElement.options[bindingContext.options.indexOf(option)];
        var expectedText = uxSelect.textProperty && option[uxSelect.textProperty] ? option[uxSelect.textProperty] : option;
        expect(optionElement.innerHTML).toContain(expectedText);
    }
}
;
function assertViewCorrectCustom(uxSelect, bindingContext, optionsAreWrapped) {
    var ulElement = uxSelect.ulElement;
    var labelElement = uxSelect.element.querySelector('label');
    if (optionsAreWrapped) {
        var selectedOption = bindingContext.options.find(function (x) { return uxSelect.defaultMatcher(x, bindingContext.value); });
        expect(labelElement.innerText).toContain(selectedOption);
    }
    else {
        var expectedValue = uxSelect.textProperty ? bindingContext.value[uxSelect.textProperty] : bindingContext.value;
        expect(labelElement.innerText).toContain(expectedValue);
    }
    console.log(ulElement.innerHTML);
    var listElements = Array.from(ulElement.querySelectorAll('ux-option'));
    for (var _i = 0, _a = bindingContext.options; _i < _a.length; _i++) {
        var option = _a[_i];
        var idx = bindingContext.options.indexOf(option);
        var optionElement = listElements[idx];
        var expectedText = uxSelect.textProperty && option[uxSelect.textProperty] ? option[uxSelect.textProperty] : option;
        expect(optionElement.innerHTML).toContain(expectedText);
    }
}
;
describe('ux-select', function () {
    describe('by default', function () {
        var sut;
        var dummyElement;
        var dummyResources;
        var dummyStyleEngine;
        var dummyBindingEngine;
        beforeEach(function () {
            dummyElement = {};
            dummyResources = {};
            dummyStyleEngine = {};
            dummyBindingEngine = {};
            sut = new UxSelect(dummyElement, dummyResources, dummyStyleEngine, dummyBindingEngine);
        });
        it('nativeMode is undefined', function () {
            expect(sut.nativeMode).toBe(undefined);
        });
        it('matcher is a function', function () {
            expect(Object.prototype.toString.call(sut.matcher)).toBe('[object Function]');
        });
        it('textProperty is undefined', function () {
            expect(sut.nativeMode).toBe(undefined);
        });
        it('theme is null', function () {
            expect(sut.theme).toBe(null);
        });
        it('options is null', function () {
            expect(sut.options).toBe(null);
        });
        it('value is null', function () {
            expect(sut.value).toBe(null);
        });
        it('disabled is false', function () {
            expect(sut.disabled).toBe(false);
        });
        it('stopPropagation is false', function () {
            expect(sut.stopPropagation).toBe(false);
        });
        it('id is a non-negative number', function () {
            expect(sut.id).toBeGreaterThan(-1);
        });
        it('index is -1', function () {
            expect(sut.index).toBe(-1);
        });
        it('expanded is false', function () {
            expect(sut.expanded).toBe(false);
        });
        it('view is undefined', function () {
            expect(sut.view).toBe(undefined);
        });
        it('ulElement is undefined', function () {
            expect(sut.ulElement).toBe(undefined);
        });
        it('selectElement is undefined', function () {
            expect(sut.selectElement).toBe(undefined);
        });
        it('itemTemplate is undefined', function () {
            expect(sut.itemTemplate).toBe(undefined);
        });
        it('isAttached is false', function () {
            expect(sut.isAttached).toBe(false);
        });
        it('innerOptions is an array', function () {
            expect(Object.prototype.toString.call(sut.innerOptions)).toBe('[object Array]');
        });
        it('innerOptions is empty', function () {
            expect(sut.innerOptions.length).toBe(0);
        });
        it('innerValue is null', function () {
            expect(sut.innerValue).toBe(null);
        });
        it('optionsCollectionSubscription is undefined', function () {
            expect(sut.optionsCollectionSubscription).toBe(undefined);
        });
        it('resources is dummyResources', function () {
            expect(sut.resources).toBe(dummyResources);
        });
        it('styleEngine is dummyStyleEngine', function () {
            expect(sut.styleEngine).toBe(dummyStyleEngine);
        });
        it('bindingEngine is dummyBindingEngine', function () {
            expect(sut.bindingEngine).toBe(dummyBindingEngine);
        });
        it('element is dummyElement', function () {
            expect(sut.element).toBe(dummyElement);
        });
    });
    describe('created()', function () {
        var sut;
        beforeEach(function () {
            sut = new UxSelect(null, null, null, null);
        });
        it('sets the view', function () {
            var dummyView = {};
            sut.created(null, dummyView);
            expect(sut.view).toBe(dummyView);
        });
    });
    describe('bind()', function () {
        var sut;
        beforeEach(function () {
            sut = new UxSelect(null, null, null, null);
        });
        it('calls themeChanged()', function () {
            var spy = spyOn(sut, 'themeChanged').and.callFake(PLATFORM.noop);
            sut.bind();
            expect(spy).toHaveBeenCalledWith(sut.theme);
        });
        it('calls optionsChanged()', function () {
            var spy = spyOn(sut, 'optionsChanged').and.callFake(PLATFORM.noop);
            sut.bind();
            expect(spy).toHaveBeenCalledWith(sut.options);
        });
        it('calls valueChanged()', function () {
            var spy = spyOn(sut, 'valueChanged').and.callFake(PLATFORM.noop);
            sut.bind();
            expect(spy).toHaveBeenCalledWith(sut.value);
        });
    });
    describe('attached()', function () {
        var sut;
        var dummyElement;
        beforeEach(function () {
            dummyElement = DOM.createElement('div');
            sut = new UxSelect(dummyElement, null, null, null);
        });
        it('sets isAttached to true', function () {
            sut.attached();
            expect(sut.isAttached).toBe(true);
        });
        describe('when nativeMode is true', function () {
            beforeEach(function () {
                sut.nativeMode = true;
            });
            it('does not set the tabindex of element', function () {
                sut.attached();
                expect(dummyElement.getAttribute('tabindex')).toBe(null);
            });
        });
        describe('when nativeMode is false', function () {
            beforeEach(function () {
                sut.nativeMode = false;
            });
            it('sets the tabindex of element to \'0\'', function () {
                sut.attached();
                expect(dummyElement.getAttribute('tabindex')).toBe('0');
            });
        });
    });
    describe('detached()', function () {
        var sut;
        beforeEach(function () {
            sut = new UxSelect(null, null, null, null);
        });
        it('sets isAttached to false', function () {
            sut.detached();
            expect(sut.isAttached).toBe(false);
        });
    });
    describe('unbind()', function () {
        var sut;
        var dummyOptions;
        var dummyValue;
        beforeEach(function () {
            dummyOptions = ['foo'];
            dummyValue = 'bar';
            sut = new UxSelect(null, null, null, null);
            sut.options = sut.innerOptions = dummyOptions;
            sut.value = sut.innerValue = dummyValue;
        });
        it('sets innerOptions to empty array', function () {
            sut.unbind();
            expect(sut.innerOptions.length).toBe(0);
        });
        it('sets innerValue to null', function () {
            sut.unbind();
            expect(sut.innerOptions.length).toBe(0);
        });
        it('does not touch options', function () {
            sut.unbind();
            expect(sut.options).toBe(dummyOptions);
        });
        it('does not touch value', function () {
            sut.unbind();
            expect(sut.value).toBe(dummyValue);
        });
        describe('when optionsCollectionSubscription is defined', function () {
            var mockOptionsCollectionSubscription;
            beforeEach(function () {
                mockOptionsCollectionSubscription = { dispose: PLATFORM.noop };
                sut.optionsCollectionSubscription = mockOptionsCollectionSubscription;
            });
            it('calls dispose on it', function () {
                var spy = spyOn(mockOptionsCollectionSubscription, 'dispose').and.callThrough();
                sut.unbind();
                expect(spy).toHaveBeenCalled();
            });
            it('sets it to null', function () {
                sut.unbind();
                expect(sut.optionsCollectionSubscription).toBe(null);
            });
        });
    });
    describe('themeChanged()', function () {
        var sut;
        var mockStyleEngine;
        beforeEach(function () {
            mockStyleEngine = { applyTheme: PLATFORM.noop };
            sut = new UxSelect(null, null, mockStyleEngine, null);
        });
        describe('when theme is defined', function () {
            it('calls styleEngine.applyTheme()', function () {
                var spy = spyOn(mockStyleEngine, 'applyTheme').and.callThrough();
                sut.themeChanged({});
                expect(spy).toHaveBeenCalled();
            });
        });
        describe('when theme is undefined', function () {
            it('does not call styleEngine.applyTheme()', function () {
                var spy = spyOn(mockStyleEngine, 'applyTheme').and.callThrough();
                sut.themeChanged(undefined);
                expect(spy).not.toHaveBeenCalled();
            });
        });
    });
    describe('optionsChanged()', function () {
        var sut;
        var mockOptionsCollectionSubscription;
        var fakeBindingEngine;
        beforeEach(function () {
            mockOptionsCollectionSubscription = { dispose: PLATFORM.noop };
            var dummyObserver = { subscribe: function () { return mockOptionsCollectionSubscription; } };
            fakeBindingEngine = { collectionObserver: function () { return dummyObserver; } };
            sut = new UxSelect(null, null, null, fakeBindingEngine);
        });
        describe('when optionsCollectionSubscription is defined', function () {
            beforeEach(function () {
                sut.optionsCollectionSubscription = mockOptionsCollectionSubscription;
            });
            it('calls dispose on it', function () {
                var spy = spyOn(mockOptionsCollectionSubscription, 'dispose').and.callThrough();
                sut.optionsChanged(null);
                expect(spy).toHaveBeenCalled();
            });
            it('sets it to null', function () {
                sut.optionsChanged(null);
                expect(sut.optionsCollectionSubscription).toBe(null);
            });
        });
        describe('when undefined is passed in', function () {
            it('does not throw', function () {
                var err;
                try {
                    sut.optionsChanged(null);
                }
                catch (e) {
                    err = e;
                }
                expect(err).toBeUndefined();
            });
            it('resets innerOptions to empty array', function () {
                sut.innerOptions = ['foo'];
                sut.optionsChanged(null);
                expect(sut.innerOptions.length).toBe(0);
            });
        });
        describe('when a non-collection value is passed in', function () {
            it('throws', function () {
                var err;
                try {
                    sut.optionsChanged(5);
                }
                catch (e) {
                    err = e;
                }
                expect(err.message).toBe('\'options\' must be a collection type');
            });
        });
        describe('when a valid collection is passed in', function () {
            it('subscribes to changes', function () {
                sut.optionsChanged([]);
                expect(sut.optionsCollectionSubscription).toBe(mockOptionsCollectionSubscription);
            });
            it('calls addOption for each item in the collection', function () {
                var options = [1, 2, 3];
                var spy = spyOn(sut, 'addOption').and.callFake(PLATFORM.noop);
                sut.optionsChanged(options);
                expect(spy).toHaveBeenCalledWith(options[0]);
                expect(spy).toHaveBeenCalledWith(options[1]);
                expect(spy).toHaveBeenCalledWith(options[2]);
            });
        });
    });
    describe('valueChanged()', function () {
        var sut;
        beforeEach(function () {
            sut = new UxSelect(null, null, null, null);
            sut.value = 'foo';
            sut.innerValue = 'bar';
        });
        describe('when the value passed in is the same as innerValue', function () {
            it('does not set innerValue', function () {
                sut.valueChanged('bar');
                expect(sut.innerValue).toBe('bar');
            });
        });
        describe('when the value passed in is different from innerValue', function () {
            it('sets innerValue', function () {
                sut.valueChanged('baz');
                expect(sut.innerValue).toBe('baz');
            });
        });
    });
    describe('native', function () {
        var view = '<ux-select options.bind="options" value.two-way="value"></ux-select>';
        describe('when bound to 3 objects with text+value properties', function () {
            var bindingContext;
            var component;
            beforeEach(function (done) {
                bindingContext = {};
                bindingContext.options = [
                    { text: 'Option 1', value: 1 },
                    { text: 'Option 2', value: 2 },
                    { text: 'Option 3', value: 3 }
                ];
                bindingContext.value = bindingContext.options[1];
                arrange(bindingContext, true, true, view)
                    .then(function (c) {
                    component = c;
                    done();
                });
            });
            it('binds correctly', function () {
                assertViewModelCorrect(component.viewModel, bindingContext);
            });
            it('renders correctly', function () {
                assertViewCorrectNative(component.viewModel, bindingContext, false);
            });
        });
        describe('when bound to 3 strings', function () {
            var bindingContext;
            var component;
            beforeEach(function (done) {
                bindingContext = {};
                bindingContext.options = [
                    'Option 1',
                    'Option 2',
                    'Option 3'
                ];
                bindingContext.value = bindingContext.options[1];
                arrange(bindingContext, true, true, view)
                    .then(function (c) {
                    component = c;
                    done();
                });
            });
            it('binds correctly', function () {
                assertViewModelCorrect(component.viewModel, bindingContext);
            });
            it('renders correctly', function () {
                assertViewCorrectNative(component.viewModel, bindingContext, true);
            });
        });
    });
    describe('when nativeMode == false', function () {
        var view = '<ux-select options.bind="options" value.two-way="value" native-mode.bind=false></ux-select>';
        describe('when bound to 3 objects with text+value properties', function () {
            var bindingContext;
            var component;
            beforeEach(function (done) {
                bindingContext = {};
                bindingContext.options = [
                    { text: 'Option 1', value: 1 },
                    { text: 'Option 2', value: 2 },
                    { text: 'Option 3', value: 3 }
                ];
                bindingContext.value = bindingContext.options[1];
                arrange(bindingContext, true, true, view)
                    .then(function (c) {
                    component = c;
                    done();
                });
            });
            it('binds correctly', function () {
                assertViewModelCorrect(component.viewModel, bindingContext);
            });
            it('renders correctly', function () {
                assertViewCorrectCustom(component.viewModel, bindingContext, false);
            });
        });
        describe('when bound to 3 strings', function () {
            var bindingContext;
            var component;
            beforeEach(function (done) {
                bindingContext = {};
                bindingContext.options = [
                    'Option 1',
                    'Option 2',
                    'Option 3'
                ];
                bindingContext.value = bindingContext.options[1];
                arrange(bindingContext, true, true, view)
                    .then(function (c) {
                    component = c;
                    done();
                });
            });
            it('binds correctly', function () {
                assertViewModelCorrect(component.viewModel, bindingContext);
            });
            it('renders correctly', function () {
                assertViewCorrectCustom(component.viewModel, bindingContext, true);
            });
        });
    });
});
