import { arrow as arrowInternal } from '@floating-ui/dom';

export {
	autoPlacement,
	autoUpdate,
	detectOverflow,
	flip,
	hide,
	inline,
	limitShift,
	offset,
	platform,
	shift,
	size,
} from '@floating-ui/dom';
 export function arrow({element, padding}: {element: HTMLElement, padding: number}) {
	return arrowInternal({ element: element as Element, padding: padding });
}
export * from './types';
export { useFloating } from './hooks/useFloating';
