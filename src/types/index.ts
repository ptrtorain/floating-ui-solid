import { ComputePositionReturn, Middleware } from '@floating-ui/dom';
import { JSX } from 'solid-js/jsx-runtime';

export type Placement =
	| 'top'
	| 'right'
	| 'bottom'
	| 'left'
	| 'top-start'
	| 'top-end'
	| 'right-start'
	| 'right-end'
	| 'bottom-start'
	| 'bottom-end'
	| 'left-start'
	| 'left-end';

export type MiddlewareType = Array<Middleware | null | undefined | false>;
export type Strategy = 'absolute' | 'fixed';
export interface useFloatingProps {
	placement?: Placement;
	strategy?: Strategy;
	isOpen: () => boolean;
	middleware?: MiddlewareType;
	whileElementsMounted?: (
		refrence: HTMLElement,
		floating: HTMLElement,
		update: () => void,
	) => () => void;
	transform?: boolean;
}
export type Data = ComputePositionReturn & { isPositioned: boolean };

export type FloatingElement = HTMLElement | null | undefined;

export type CSSProperties = JSX.CSSProperties;
