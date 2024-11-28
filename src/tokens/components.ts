import type { InjectionKey, Ref, } from 'vue';

export type FormInjectionContext = {
	checkError: Ref<object>;

};

export const FORM_INJECTION_KEY: InjectionKey<FormInjectionContext> = Symbol('form');
