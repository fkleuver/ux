import { valueConverter } from 'aurelia-binding';
import * as Types from './types';

@valueConverter('selectProperty')
export class SelectProperty {
    public toView(obj: any, prop: string, placeholder: string = ' - '): any {
        const fallback: string | null = Types.isUndefinedOrNull(placeholder) ? null : placeholder.toString();
        let retVal: string;
        if (Types.isObject(obj) && Types.isType(prop, 'String')) {
            retVal = obj[prop];
        } else {
            retVal = obj;
        }
        if (Types.isUndefinedOrNull(retVal)) {
            return fallback;
        }
        return retVal.toString();
    }
}