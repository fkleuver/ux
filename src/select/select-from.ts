import { bindingBehavior, Binding, Scope } from 'aurelia-binding';

@bindingBehavior('selectFrom')
export class SelectFrom {
    public bind(binding: Binding, scope: Scope, instance: any, path: string): void {
        scope;
        if (binding.updateTarget) {
            (<any>binding)['intercepted-updateTarget'] = binding.updateTarget;
            let updateTarget = (<any>binding).updateTarget.bind(binding);
            binding.updateTarget = interceptUpdateTarget.bind(binding, instance, path, updateTarget);
        }

        if (binding.updateSource) {
            (<any>binding)['intercepted-updateSource'] = binding.updateSource;
            let updateSource = (<any>binding).updateSource.bind(binding);
            binding.updateSource = interceptUpdateSource.bind(binding, instance, path, updateSource);
        }
    }

    public unbind(binding: Binding): void {
        if (binding.updateSource) {
            binding.updateSource = (<any>binding)['intercepted-updateSource'];
            (<any>binding)['intercepted-updateSource'] = null;
        }

        if (binding.updateTarget) {
            binding.updateTarget = (<any>binding)['intercepted-updateTarget'];
            (<any>binding)['intercepted-updateTarget'] = null;
        }
    }
}

function interceptUpdateTarget(instance: any, path: string, update: (value: any) => void): void {
    let propertyValue = getByString(instance, path);
    update(propertyValue);
}

function interceptUpdateSource(instance: any, path: string, update: (value: any) => void, value: any): void {
    let updatedInstance = instance;
    setByString(updatedInstance, path, value);
    update(updatedInstance);
}

function getByString(obj: any, path: string) {
    if (!path) {
        return obj;
    }

    path = path.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
    path = path.replace(/^\./, '');           // strip a leading dot

    let result = obj;
    let parts = path.split('.');
    for (let i = 0, ii = parts.length; i < ii; ++i) {
        let part = parts[i];

        if (!result) {
            return result;
        }

        if (!result[part]) {
            return result;
        }

        result = result[part];
    }
    return result;
}

function setByString(obj: any, path: string, value: any) {
    if (!path) {
        obj = value;
        return;
    }

    let original = obj;
    let parts = path.split('.');
    let partCount = parts.length;

    for (let i = 0; i < partCount - 1; i++) {
        let part = parts[i];
        if (!original[part]) {
            throw new Error(`the property '${part}\' does not exist on object ${Object.prototype.toString.call(original)}`);
        }
        original = original[part];
    }

    original[parts[partCount - 1]] = value;
}