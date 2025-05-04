import {
	ComputePositionReturn,
	Middleware,
	Placement,
	Strategy,
} from '@floating-ui/dom';
import { Accessor } from 'solid-js';

import { JSX } from 'solid-js/jsx-runtime';

export type MiddlewareType = Array<Middleware | null | undefined | false>;

export interface createFloatingProps {
	placement?: Placement | Accessor<Placement>;
	strategy?: Strategy | Accessor<Strategy>;
	isOpen?: Accessor<boolean>;
	middleware?: Accessor<MiddlewareType> | MiddlewareType | undefined;
	whileElementsMounted?: (
		refrence: HTMLElement,
		floating: HTMLElement,
		update: () => void,
	) => () => void;
	elements?: {
		reference: Accessor<FloatingElement>;
		floating: Accessor<FloatingElement>;
	}
	transform?: boolean | Accessor<boolean>;
}
export type Data = ComputePositionReturn & { isPositioned: boolean, arrow?: { x?: number, y?: number, centerOffset: number; alignmentOffset?: number; } | null };

export type FloatingElement = HTMLElement | null | undefined;

export type CSSProperties = JSX.CSSProperties;

export type {Placement, Strategy}