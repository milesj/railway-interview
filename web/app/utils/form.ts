import type { FieldState } from "@tanstack/react-form";

export function getValueFieldProps<T>(state: FieldState<T>) {
	return {
		value: state.value,
		error: state.meta.errors.length > 0 ? state.meta.errors[0] : undefined,
	};
}

export function getCheckedFieldProps(state: FieldState<boolean>) {
	return {
		checked: state.value,
		error: state.meta.errors.length > 0 ? state.meta.errors[0] : undefined,
	};
}
