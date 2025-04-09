/* eslint-disable solid/reactivity */
import { batch, createEffect, createSignal, onCleanup } from 'solid-js';
import { computePosition, MiddlewareData } from '@floating-ui/dom';
import { getDPR, roundByDPR } from '../utils';
import {
	CSSProperties,
	Data,
	FloatingElement,
	createFloatingProps,
} from '../types';

export const createFloating = (props: createFloatingProps) => {
	const [_reference, setReference] = createSignal<FloatingElement>(null);
	const [_floating, setFloating] = createSignal<FloatingElement>(null);

	const strategyProps = () => typeof props.strategy === 'function' ? props.strategy() : props.strategy ?? 'absolute';
	const placementProps = () => typeof props.placement === 'function' ? props.placement() : props.placement ?? 'bottom';
	const transformProps = () => typeof props.transform === 'function' ? props.transform() : props.transform === undefined ? true : props.transform;
	const middlewareProps = () => typeof props.middleware === 'function' ? props.middleware() : props.middleware;

	const mainReference = () => props.elements?.reference() || _reference();
	const mainFloating = () => props.elements?.floating() || _floating();

	const [floatingStylesInternal, setFloatingStylesInternal] =
		createSignal<CSSProperties>({
			top: '0px',
			left: '0px',
			position: strategyProps(),
			transform: transformProps() ? 'translate(0px, 0px)' : 'none',
		});

	const [data, setData] = createSignal<Data>({
		x: 0,
		y: 0,
		strategy: strategyProps(),
		middlewareData: {},
		placement: placementProps(),
		isPositioned: false,
	});

	let cleanupFn: { current: undefined | (() => void) } = { current: undefined };

	function update() {
		const refrenceEl = mainReference();
		const floatingEl = mainFloating();

		if (refrenceEl && floatingEl) {
			computePosition(refrenceEl, floatingEl, {
				middleware:
					middlewareProps(),
				placement: placementProps(),
				strategy: strategyProps(),
			}).then(
		
				(computeData) => {
					const fullData = { ...computeData, isPositioned: true };
					const newStyles = transformProps()
						? {
								transform: `translate(${roundByDPR(floatingEl, fullData.x)}px, ${roundByDPR(floatingEl, fullData.y)}px)`,
								...(getDPR(floatingEl) >= 1.5 && { willChange: 'transform' }),
							}
						: {
								top: `${fullData.y}px`,
								left: `${fullData.x}px`,
							};

					batch(() => {
						setData({
							...fullData,
							middlewareData: fullData.middlewareData,
							isPositioned: true,
						});
						setFloatingStylesInternal((prev) => ({ ...prev, ...newStyles }));
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
		props?.whileElementsMounted;
		strategyProps();
		placementProps();
		transformProps();
		middlewareProps();

		if (refrenceEl && floatingEl) {
			if (typeof props.whileElementsMounted === 'function') {
				cleanupFn.current?.();
				cleanupFn = {
					current: props.whileElementsMounted(refrenceEl, floatingEl, update),
				};
				return;
			}

			update();
		}
	});

	createEffect(() => {
		const open = props?.isOpen();

		if (open === false && data().isPositioned) {
			setData({ ...data(), isPositioned: false });
		}

		onCleanup(() => {
			if (typeof cleanupFn.current === 'function') {
				cleanupFn.current?.();

				cleanupFn = { current: undefined };
			}
		});
	});

	return {
		x: () => data().x,
		y: () => data().y,
		placement: () => data().placement,
		strategy: () => data().strategy,
		isPositioned: () => data().isPositioned,
		floatingStyles: floatingStylesInternal,
		setFloatingStyles: (params: CSSProperties) =>
			setFloatingStylesInternal(params),
		middleware: () => data().middlewareData as MiddlewareData,
		elements: {
			reference: () => _reference(),
			floating: () => _floating(),
		},
		refs: {
			setReference: setReference,
			setFloating: setFloating,
		},
		update,
	};
};
