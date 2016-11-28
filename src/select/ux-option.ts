import {
    customElement,
    bindable,
    ViewResources,
    View,
    ViewSlot,
    ViewFactory,
    ViewCompiler,
    processAttributes
} from 'aurelia-templating';
import { bindingMode } from 'aurelia-binding';
import { TaskQueue } from 'aurelia-task-queue';
import { inject, Container } from 'aurelia-dependency-injection';

import { StyleEngine } from '../styles/style-engine';
import { Themable } from '../styles/themable';
import { processDesignAttributes } from '../designs/design-attributes';

@inject(TaskQueue, ViewResources, StyleEngine, Container, ViewCompiler, ViewSlot)
@customElement('ux-option')
@processAttributes(processDesignAttributes)
export class UxOption implements Themable {
    @bindable public theme: any = null;
    @bindable public option: string = <any>null;
    @bindable public html: string = <any>null;

    @bindable({ defaultBindingMode: bindingMode.oneTime, defaultValue: 'text' })
    public textProperty: string;
    @bindable public selected: boolean = false;

    public view: View;
    private bindingContext: any;
    private overrideContext: any;
    private isApplied: boolean = false;
    private isAttached: boolean = false;

    private innerView: View;
    private innerViewFactory: ViewFactory;

    constructor(
        private tq: TaskQueue,
        public resources: ViewResources,
        private styleEngine: StyleEngine,
        private container: Container,
        private viewCompiler: ViewCompiler,
        private viewSlot: ViewSlot) { }

    public created(_: any, myView: View): void {
        this.view = myView;
    }

    public bind(bindingContext: any, overrideContext: any): void {
        this.bindingContext = bindingContext;
        this.overrideContext = overrideContext;
    }

    public attached(): void {
        this.isAttached = true;
        this.tq.queueMicroTask(() => {
            this.apply();
            if (!this.html) {
                this.htmlChanged(this.html);
            }
        });
    }

    public detached(): void {
        this.isAttached = false;
    }

    public unbind(): void {
        this.disposeView();

        this.bindingContext = null;
        this.overrideContext = null;
    }

    public themeChanged(newValue: any): void {
        if (newValue) {
            this.styleEngine.applyTheme(this, newValue);
        }
    }

    protected htmlChanged(newValue: string): void {
        if (newValue) {
            if (this.isAttached) {
                this.apply();
            }
        } else {
            // TODO: get the binding from UxSelect.innerTemplateHTML to UxOption.html to work and remove this
            let itemTemplate = this.overrideContext
                .parentOverrideContext
                .bindingContext
                .itemTemplate;

            if (itemTemplate.innerHTML.trim() !== '<!--slot-->') {
                this.html = itemTemplate.innerHTML;
            } else if (this.isApplied) {
                this.disposeView();
                this.html = <any>null;
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
        if (this.viewSlot) {
            this.viewSlot.unbind();
            this.viewSlot.detached();
            this.viewSlot.removeAll();
        }

        if (this.innerViewFactory) {
            this.innerViewFactory = <any>null;
        }

        if (this.innerView) {
            this.innerView = <any>null;
        }

        this.isApplied = false;
    }

    private compileView(): void {
        this.innerViewFactory = createViewFactory(this.viewCompiler, this.container, this.html);

        this.innerView = createView(this.innerViewFactory, this.container);

        this.viewSlot.add(this.innerView);
        this.viewSlot.bind(this.bindingContext, this.overrideContext);
        this.viewSlot.attached();

        this.isApplied = true;
    }
}

function createViewFactory(viewCompiler: ViewCompiler, container: Container, html: string): ViewFactory {
    if (!html || !html.startsWith('<template>')) {
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