import { createEffect, createMemo, createSignal, onCleanup } from 'solid-js';
import { computePosition, VirtualElement } from '@floating-ui/dom';
import { getDPR, roundByDPR } from '../utils';
import {
	CSSProperties,
	Data,
	MiddlewareType,
	createFloatingProps,
	createFloatingReturn,
} from '../types';

export const createFloating = (
	props: createFloatingProps = {},
): createFloatingReturn => {
	const [_reference, setReference] = createSignal<
		Element | VirtualElement | null
	>(null);
	const [_floating, setFloating] = createSignal<HTMLElement | null>(null);

	const strategyProps = () =>
		typeof props.strategy === 'function'
			? props.strategy()
			: (props.strategy ?? 'absolute');

	const placementProps = () =>
		typeof props.placement === 'function'
			? props.placement()
			: (props.placement ?? 'bottom');

	const transformProps =
		typeof props.transform === 'function'
			? props.transform
			: () => (props.transform === undefined ? true : props.transform);

	const middlewareProps =
		typeof props.middleware === 'function'
			? props.middleware
			: () => props.middleware ?? [];

	const isOpen =
		typeof props.isOpen === 'function'
			? props.isOpen
			: () => props.isOpen ?? true;

	const mainReference = () => props.elements?.reference?.() || _reference();

	const mainFloating = () => props.elements?.floating?.() || _floating();

	const [data, setData] = createSignal<Data>({
		x: 0,
		y: 0,
		strategy: strategyProps(),
		middlewareData: {},
		placement: placementProps(),
		isPositioned: false,
		arrow: null,
	});

	function update() {
		const refrenceEl = mainReference();
		const floatingEl = mainFloating();

		if (refrenceEl && floatingEl) {
			computePosition(refrenceEl, floatingEl, {
				middleware: middlewareProps() as MiddlewareType,
				placement: placementProps(),
				strategy: strategyProps(),
			}).then(
				(computeData) => {
					const fullData = { ...computeData, isPositioned: true };

					setData({
						...fullData,
						middlewareData: fullData.middlewareData,
						isPositioned: true,
						arrow: computeData.middlewareData.arrow,
					});
				},
				(err) => {
					console.error(err);
				},
			);
		}
	}

	createEffect(() => {
		const refrenceEl = mainReference();
		const floatingEl = mainFloating();

		strategyProps();
		placementProps();
		transformProps();
		middlewareProps();

		if (!isOpen()) return;

		const cleanupFn: { current: (() => void) | undefined } = {
			current: undefined,
		};

		onCleanup(() => {
			cleanupFn.current?.();
			cleanupFn.current = undefined;
		});

		if (refrenceEl && floatingEl) {
			if (typeof props.whileElementsMounted === 'function') {
				cleanupFn.current = props.whileElementsMounted(
					refrenceEl,
					floatingEl,
					update,
				);
				return;
			}

			update();
		}
	});

	createEffect(() => {
		if (isOpen() === false && data().isPositioned) {
			setData({ ...data(), isPositioned: false });
		}
	});

	const floatingStyles = createMemo(() => {
		data().x;
		data().y;
		transformProps();
		strategyProps();
		mainFloating();

		const initialStyles = {
			top: '0px',
			left: '0px',
			position: strategyProps(),
		};
		if (!mainFloating?.()) {
			return initialStyles;
		}

		const x = roundByDPR(mainFloating?.() as Element, data().x);
		const y = roundByDPR(mainFloating?.() as Element, data().y);

		return transformProps()
			? {
					...initialStyles,
					transform: `translate(${x}px, ${y}px)`,
					...(getDPR(mainFloating?.() as Element) >= 1.5 && {
						willChange: 'transform',
					}),
				}
			: { position: strategyProps(), left: `${x}px`, top: `${y}px` };
	});

	return {
		x: () => data().x,
		y: () => data().y,
		placement: () => data().placement,
		strategy: () => data().strategy,
		isPositioned: () => data().isPositioned,
		floatingStyles: floatingStyles,
		middleware: () => data().middlewareData,
		elements: {
			reference: () => _reference(),
			floating: () => _floating(),
		},
		arrowStyles: () => data().arrow,
		refs: {
			setReference: setReference,
			setFloating: setFloating,
			reference: () => _reference(),
			floating: () => _floating(),
		},
		update,
	};
};
