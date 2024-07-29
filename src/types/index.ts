import {
	ComputePositionReturn,
	Middleware,
	Placement,
	Strategy,
} from '@floating-ui/dom';

import { JSX } from 'solid-js/jsx-runtime';

export type MiddlewareType = Array<Middleware | null | undefined | false>;

export interface useFloatingProps {
	placement?: Placement;
	strategy?: Strategy;
	isOpen: () => boolean;
	middleware?: (() => MiddlewareType) | undefined;
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
