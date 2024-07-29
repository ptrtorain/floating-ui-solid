import { createEffect, createSignal, onCleanup } from 'solid-js';
import { computePosition, MiddlewareData } from '@floating-ui/dom';
import { getDPR, roundByDPR } from '../utils';
import {
	CSSProperties,
	Data,
	FloatingElement,
	useFloatingProps,
} from '../types';

export const useFloating = (props: useFloatingProps) => {
    const [reference, setReference] = createSignal<FloatingElement>(null);
    const [floating, setFloating] = createSignal<FloatingElement>(null);
    const [isPositioned, setIsPositioned] = createSignal(false);

    const middlewareProps = () => props.middleware?.() ?? [];

    const strategyProps = () => props.strategy ?? 'absolute';
    const placementProps = () => props.placement ?? 'bottom';
    const transformProps = () => props.transform ?? true;

    const [floatingStylesInternal, setFloatingStylesInternal] = createSignal<CSSProperties>({
        top: `${0}px`,
        left: `${0}px`,
        position: strategyProps(),
    });

    const [data, setData] = createSignal<Data>({
        x: 0,
        y: 0,
        strategy: strategyProps(),
        middlewareData: {},
        placement: placementProps(),
        isPositioned: false,
    });
    const [cleanFn, setCleanFn] = createSignal<{ current: undefined | (() => void) }>({ current: undefined })

    function update() {
        const refrenceEl = reference();
        const floatingEl = floating();


        if (refrenceEl && floatingEl) {
            computePosition(refrenceEl, floatingEl, {
                middleware: middlewareProps(),
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

                    setData({ ...fullData, middlewareData: fullData.middlewareData });
                    setFloatingStylesInternal((prev) => ({ ...prev, ...newStyles }));
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
        props?.whileElementsMounted;
        strategyProps();
        placementProps();
        middlewareProps
        if (refrenceEl && floatingEl) {

            if (props?.whileElementsMounted === undefined) {
                update();
                return;
            }

            if (typeof props.whileElementsMounted === 'function') {
                setCleanFn({ current: props.whileElementsMounted(refrenceEl, floatingEl, update) });
            }
        }

    });

    createEffect(() => {
        const open = props?.isOpen();

        if (open === false && data().isPositioned) {
            setData({ ...data(), isPositioned: false });
        }

        onCleanup(() => {
            if (typeof cleanFn().current === 'function') {
                cleanFn().current?.();
                setCleanFn({ current: undefined });
            }
        });
    });


    return {
        x: () => data().x,
        y: () => data().y,
        placement: () => data().placement,
        strategy: () => data().strategy,
        isPositioned,
        floatingStyles: floatingStylesInternal,
        setFloatingStyles: (params: CSSProperties) => setFloatingStylesInternal(params),
        middleware: () => data().middlewareData as MiddlewareData,
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
