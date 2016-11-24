import {
    customElement,
    bindable,
    ViewResources,
    View,
    ViewSlot,
    ViewFactory,
    ViewCompiler,
    inlineView
} from 'aurelia-templating';
import {
    createOverrideContext
} from 'aurelia-binding';
import { bindingMode } from 'aurelia-binding';
import { inject, Container } from 'aurelia-dependency-injection';
import { DOM } from 'aurelia-pal';

@customElement('ux-select-option')
@inlineView('<template><div></div></template>')
@inject(DOM.Element, Container, ViewCompiler)
export class UxSelectOption {
    @bindable({ defaultBindingMode: bindingMode.oneWay })
    public html: string;

    private needsApply: boolean = false;
    private isApplied: boolean = false;
    private isAttached: boolean = false;
    private bindingContext: any;
    private overrideContext: any;

    private runtimeView: View;
    private runtimeViewSlot: ViewSlot;
    private runtimeViewFactory: ViewFactory;
    private runtimeViewAnchor: HTMLDivElement;

    constructor(
        public element: HTMLElement,
        private container: Container,
        private viewCompiler: ViewCompiler) {
    }

    public bind(bindingContext: any, overrideContext: any): void {
        this.bindingContext = bindingContext;
        this.overrideContext = createOverrideContext(this.bindingContext, overrideContext);

        this.htmlChanged(this.html);
    }

    public unbind(): void {
        this.disposeView();

        this.bindingContext = null;
        this.overrideContext = null;
    }

    public attached(): void {
        this.runtimeViewAnchor = <HTMLDivElement>this.element.firstElementChild;

        this.isAttached = true;
        if (this.needsApply) {
            this.needsApply = false;
            this.apply();
        }
    }

    public detached(): void {
        this.isAttached = false;

        this.runtimeViewAnchor = <any>null;
    }

    private htmlChanged(newValue: string): void {
        if (newValue) {
            if (this.isAttached) {
                this.apply();
            } else {
                this.needsApply = true;
            }
        } else {
            if (this.isApplied) {
                this.disposeView();
            }
        }
    }

    private apply(): void {
        if (this.isApplied) {
            this.disposeView();
        }

        this.compileView();
    }

    private disposeView(): void {
        if (this.runtimeViewSlot) {
            this.runtimeViewSlot.unbind();
            this.runtimeViewSlot.detached();
            this.runtimeViewSlot.removeAll();
            this.runtimeViewSlot = <any>null;
        }

        if (this.runtimeViewFactory) {
            this.runtimeViewFactory = <any>null;
        }

        if (this.runtimeView) {
            this.runtimeView = <any>null;
        }

        this.isApplied = false;
    }

    private compileView(): void {
        this.runtimeViewFactory = createViewFactory(this.viewCompiler, this.container, this.html);

        this.runtimeView = createView(this.runtimeViewFactory, this.container);

        this.runtimeViewSlot = createViewSlot(this.runtimeViewAnchor);
        this.runtimeViewSlot.add(this.runtimeView);
        this.runtimeViewSlot.bind(this.bindingContext, this.overrideContext);
        this.runtimeViewSlot.attached();

        this.isApplied = true;
    }

}

function createViewFactory(viewCompiler: ViewCompiler, container: Container, html: string): ViewFactory {
    if (!html.startsWith('<template>')) {
        html = `<template>${html}</template>`;
    }
    let viewResources: ViewResources = container.get(ViewResources);
    let viewFactory = viewCompiler.compile(html, viewResources);
    return viewFactory;
}

function createView(viewFactory: ViewFactory, container: Container): View {
    let childContainer = container.createChild();
    let view = viewFactory.create(childContainer);
    return view;
}

function createViewSlot(containerElement: Element): ViewSlot {
    let viewSlot = new ViewSlot(containerElement, true);
    return viewSlot;
}