import type { ComputedRef, WritableComputedRef, InjectionKey, Ref, Reactive } from 'vue';

export type FormInjectionContext = {
    // rules: Reactive<object>;
    checkError: Ref<object>;
	// selectRef: Ref<HTMLElement | undefined>;
	// currentSelect: WritableComputedRef<string | number | object | number[]>;
	// currentSelectLabel: WritableComputedRef<string>;
	// mode: ComputedRef<string>;
	// dynamicCss: ComputedRef<string | object>;
	// dropDownVisible: WritableComputedRef<string | boolean>;
	// placeholder: WritableComputedRef<string>;
	// cacheOptionList: object;
	// clearable: ComputedRef<boolean | string>;
	// selectedFn: (val: boolean) => void;
	// deleteOptionItem: (val: boolean) => void;
};

export const FORM_INJECTION_KEY: InjectionKey<FormInjectionContext> = Symbol('form');
