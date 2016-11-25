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
import {
    bindingMode,
    //createOverrideContext
} from 'aurelia-binding';
import {
    TaskQueue
} from 'aurelia-task-queue';
import {
    inject,
    Container
} from 'aurelia-dependency-injection';

import { StyleEngine } from '../styles/style-engine';
import { Themable } from '../styles/themable';
import { processDesignAttributes } from '../designs/design-attributes';

@inject(TaskQueue, ViewResources, StyleEngine, Container, ViewCompiler, ViewSlot)
@customElement('ux-option')
@processAttributes(processDesignAttributes)
export class UxOption implements Themable {
    @bindable({ defaultBindingMode: bindingMode.oneTime, defaultValue: true })
    public nativeMode: boolean;
    @bindable public theme: any = null;
    @bindable public text: string = <any>null;
    @bindable public html: string = <any>null;

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
        //this.overrideContext = createOverrideContext(this.bindingContext, overrideContext);
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

    public select(option: any): void {
        this.overrideContext
            .parentOverrideContext
            .bindingContext
            .innerValue = option;
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
            let itemTemplate = this.overrideContext
                .parentOverrideContext
                .bindingContext
                .itemTemplate;

            if (itemTemplate.innerHTML) {
                this.html = itemTemplate.innerHTML;
            } else if (this.isApplied) {
                this.disposeView();
            }
        }
    }

    protected textChanged(newValue: string): void {
        if (newValue && this.nativeMode) {
            this.html = newValue;
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