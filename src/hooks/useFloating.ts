import { createEffect, createSignal } from 'solid-js';
import { computePosition } from '@floating-ui/dom';
import { getDPR, roundByDPR } from '../utils';
import {
	CSSProperties,
	Data,
	FloatingElement,
	MiddlewareType,
	useFloatingProps,
} from '../types';

export const useFloating = ({
	placement = 'bottom',
	strategy = 'absolute',
	isOpen,
	middleware = [],
	whileElementsMounted,
	transform = false,
}: useFloatingProps) => {
	const [reference, setReference] = createSignal<FloatingElement>(null);
	const [floating, setFloating] = createSignal<FloatingElement>(null);
	const [isPositioned, setIsPositioned] = createSignal(false);

	const middlewareProps: () => MiddlewareType = () => middleware;
	const strategyProps = () => strategy;
	const placementProps = () => placement;

	const [floatingStyles, setFloatingStyles] = createSignal<CSSProperties>({
		top: `${0}px`,
		left: `${0}px`,
		position: strategyProps(),
	});

	let whileElementsMountedCleanup: (() => void) | undefined;

	const [data, setData] = createSignal<Data>({
		x: 0,
		y: 0,
		strategy: strategyProps(),
		middlewareData: {},
		placement: placementProps(),
		isPositioned: false,
	});

	function update() {
		const refrenceEl = reference();
		const floatingEl = floating();
		data().middlewareData;
		data().placement;
		data().strategy;

		if (refrenceEl && floatingEl) {
			computePosition(refrenceEl, floatingEl, {
				middleware: middlewareProps(),
				placement: placementProps(),
				strategy: strategyProps(),
			}).then(
				(computeData) => {
					const fullData = { ...computeData, isPositioned: true };

					const newStyles = transform
						? {
								transform: `translate(${roundByDPR(floatingEl, fullData.x)}px, ${roundByDPR(floatingEl, fullData.y)}px)`,
								...(getDPR(floatingEl) >= 1.5 && { willChange: 'transform' }),
							}
						: {
								top: `${fullData.y}px`,
								left: `${fullData.x}px`,
							};

					setData(fullData);
					setFloatingStyles((prev) => ({ ...prev, ...newStyles }));
					setIsPositioned(true);
				},
				(err) => {
					console.error(err);
				},
			);
		}
	}

	createEffect(() => {
		const refrenceEl = reference();
		const floatingEl = floating();

		if (refrenceEl && floatingEl) {
			if (whileElementsMounted === undefined) {
				update();
				return;
			}

			if (typeof whileElementsMounted === 'function') {
				whileElementsMountedCleanup = whileElementsMounted(
					refrenceEl,
					floatingEl,
					update,
				);
			}
		}
	});

	createEffect(() => {
		const open = isOpen();

		if (open === false && data().isPositioned) {
			setData({ ...data(), isPositioned: false });
		}

		if (open === false && typeof whileElementsMountedCleanup === 'function') {
			whileElementsMountedCleanup();
			whileElementsMountedCleanup = undefined;
		}
	});

	return {
		x: () => data().x,
		y: () => data().y,
		placement: () => data().placement,
		strategy: () => data().strategy,
		isPositioned,
		floatingStyles,
		setStyles: (params: CSSProperties) => setFloatingStyles(params),
		middleware: () => data().middlewareData,
		elements: {
			reference: () => reference(),
			floating: () => floating(),
		},
		refs: {
			setReference,
			setFloating,
		},
		update,
	};
};
