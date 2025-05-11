import {
	ComputePositionReturn,
	Middleware,
	MiddlewareData,
	Placement,
	Strategy,
	VirtualElement,
} from '@floating-ui/dom';
import { Accessor } from 'solid-js';

import { JSX } from 'solid-js/jsx-runtime';

export type MiddlewareType = Array<Middleware | null | undefined | false>;

export interface createFloatingProps<RT extends ReferenceType = ReferenceType> {
	placement?: Placement | Accessor<Placement>;
	strategy?: Strategy | Accessor<Strategy>;
	isOpen?: Accessor<boolean>;
	middleware?: Accessor<MiddlewareType> | MiddlewareType;
	whileElementsMounted?: (
		refrence: RT,
		floating: HTMLElement,
		update: () => void,
	) => () => void;
	elements?: {
		reference?: Accessor<RT | null>;
		floating?: Accessor<HTMLElement | null> | null;
	}
	transform?: boolean | Accessor<boolean>;
}

export interface createFloatingReturn<RT extends ReferenceType = ReferenceType> {
	floatingStyles: Accessor<CSSProperties>;
	refs: {
		setReference: (reference: RT | null) => void;
		setFloating: (floating: HTMLElement | null) => void;
		reference: Accessor<RT | null>;
		floating: Accessor<HTMLElement | null>;
	}
	elements: {
		reference: Accessor<RT | null>;
		floating: Accessor<HTMLElement | null>;
	};
	x: Accessor<number>;
	y: Accessor<number>;
	update: () => void;
	placement: Accessor<Placement>;
	strategy: Accessor<Strategy>;
	isPositioned: Accessor<boolean>;
	arrowStyles: Accessor<{ x?: number, y?: number, centerOffset: number; alignmentOffset?: number; } | null | undefined>;
	middleware: Accessor<MiddlewareData>;

}


export type Data = ComputePositionReturn & { isPositioned: boolean, arrow?: { x?: number, y?: number, centerOffset: number; alignmentOffset?: number; } | null };

export type FloatingElement = HTMLElement | null | undefined;

export type CSSProperties = JSX.CSSProperties;

export type ReferenceType = Element | VirtualElement;

export type { Placement, Strategy }