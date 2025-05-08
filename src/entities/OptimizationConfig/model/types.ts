export interface FormFieldOption {
    value: string;
    content: string;
}

export interface BaseFieldConfig {
    id: string;
    label: string;
    type: 'text' | 'number' | 'switch' | 'select';
}

export interface TextFieldConfig extends BaseFieldConfig {
    type: 'text';
    placeholder?: string;
}

export interface NumberFieldConfig extends BaseFieldConfig {
    type: 'number';
    step?: number;
    placeholder?: string;
}

export interface SwitchFieldConfig extends BaseFieldConfig {
    type: 'switch';
}

export interface SelectFieldConfig extends BaseFieldConfig {
    type: 'select';
    placeholder?: string;
    options: FormFieldOption[];
}

export type FormFieldConfig =
    | TextFieldConfig
    | NumberFieldConfig
    | SwitchFieldConfig
    | SelectFieldConfig;

export interface FormGroupConfig {
    id: string;
    title: string;
    fields: FormFieldConfig[];
}
