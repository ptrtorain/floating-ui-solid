import {
	Middleware,
	MiddlewareData,
	Placement,
	Strategy,
} from '@floating-ui/dom';
import { JSX } from 'solid-js/jsx-runtime';

export interface useFloatingProps {
	placement?: Placement;
	strategy?: Strategy;
	isOpen: () => boolean;
	middleware?: Array<Middleware | null | undefined | false>;
	whileElementsMounted?: (
		refrence: HTMLElement,
		floating: HTMLElement,
		update: () => void,
	) => () => void;
	transform?: boolean;
}
export type Data = {
	x: number;
	y: number;
	strategy: Strategy;
	placement: Placement;
	isPositioned: boolean;
	middlewareData: MiddlewareData;
};

export type FloatingElement = HTMLElement | null | undefined;

export type CSSProperties = JSX.CSSProperties;
