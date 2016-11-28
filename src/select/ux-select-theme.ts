import { styles } from '../styles/decorators';

@styles()
export class UxSelectTheme {
    public background: string;
    public foreground: string;
    public focus: string;

    public inDuration = 300;
    public outDuration = 225;
    public constrain_width = true;
    public hover = false;
    public gutter = 0;
    public beloworigin = false;
    public alignment = 'left';
    public stopPropagation = false;
}
