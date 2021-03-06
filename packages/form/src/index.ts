import { FrameworkConfiguration, PLATFORM } from 'aurelia-framework';

export { UxFormTheme } from './ux-form-theme';

export function configure(config: FrameworkConfiguration) {
  config.globalResources([
    PLATFORM.moduleName('@aurelia-ux/form/ux-field'),
    PLATFORM.moduleName('@aurelia-ux/form/ux-form'),
    PLATFORM.moduleName('@aurelia-ux/form/ux-submit-attribute')
  ]);
}
