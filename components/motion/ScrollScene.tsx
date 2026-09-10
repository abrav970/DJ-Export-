"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { ScrollTrigger, useGSAP } from "@/lib/gsap";
import { scene as sceneTokens, triggers } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * A pinned scene: one panel held in place while the reader travels past it.
 *
 * This is the pattern `Journey`, `Process` and the old product stage each
 * separately, with three slightly different implementations of the same idea.
 * It is one component now, and it keeps the decision those three had already
 * converged on: the pin is `position: sticky` inside a tall spacer, not
 * ScrollTrigger's `pin: true`.
 *
 * That is worth defending, because reaching for `pin: true` here is the obvious
 * move and the wrong one. ScrollTrigger pins by transforming the element and
 * inserting a spacer of its own, which means it owns layout — it re-measures on
 * resize, it fights `position: sticky` if both are present, and if the JS never
 * runs the section collapses. Native sticky costs nothing, cannot desynchronise
 * from the scrollbar, survives a resize without a refresh, and degrades to
 * ordinary scrolling with no script at all. ScrollTrigger is used here purely
 * to *read* the reader's position, never to control it.
 *
 * Nothing is hijacked: the spacer is `steps × stage` tall, so the scrollbar
 * keeps its true length and a flick travels the distance it should.
 *
 * ---
 *
 * Reduced motion deliberately does NOT suppress this trigger.
 *
 * A scene advancing through its steps is not an animation — it is the reader's
 * own position expressed as an index. Gating it behind
 * `prefers-reduced-motion: no-preference` would strand a reduced-motion visitor
 * on step one of a five-step story with no way to reach the rest, which is a
 * content failure dressed up as an accessibility feature. The *transforms*
 * inside the panel are gated (see `ScrubLayer`); the position readout is not.
 *
 * Callers are still responsible for not rendering a pinned scene below `lg` —
 * holding a viewport-height panel on a phone traps the reader. The existing
 * sections pair `hidden lg:block` with an authored stacked list, and that
 * remains the pattern.
 */

type Subscriber = (progress: number, step: number) => void;

type SceneValue = {
  /** Returns an unsubscribe function. */
  subscribe: (fn: Subscriber) => () => void;
  steps: number;
};

const SceneContext = createContext<SceneValue | null>(null);

type ScrollSceneProps = {
  /** How many authored steps the scene advances through. */
  steps: number;
  children: ReactNode;
  /** Applied to the spacer. */
  className?: string;
  /** Applied to the sticky panel. */
  panelClassName?: string;
  /** Scroll distance per step, in svh. Defaults to the measured token. */
  stage?: number;
};

export const ScrollScene = ({
  steps,
  children,
  className,
  panelClassName,
  stage = sceneTokens.stage,
}: ScrollSceneProps) => {
  const spacerRef = useRef<HTMLDivElement>(null);
  const subscribers = useRef(new Set<Subscriber>());

  const subscribe = useCallback((fn: Subscriber) => {
    subscribers.current.add(fn);
    return () => {
      subscribers.current.delete(fn);
    };
  }, []);

  useGSAP(
    () => {
      const emit = (self: ScrollTrigger) => {
        // Floor into buckets, clamped: at progress exactly 1 the raw index is
        // `steps`, which is one past the last authored step.
        const step = Math.min(steps - 1, Math.max(0, Math.floor(self.progress * steps)));
        subscribers.current.forEach((fn) => fn(self.progress, step));
      };

      const trigger = ScrollTrigger.create({
        trigger: spacerRef.current,
        start: triggers.pinned.start,
        end: triggers.pinned.end,
        onUpdate: emit,
        // Also on refresh, so a scene entered mid-way — a reload at depth, a
        // back-navigation to a restored position — starts on the right step
        // rather than on step one until the reader moves.
        onRefresh: emit,
      });

      return () => trigger.kill();
    },
    { scope: spacerRef, dependencies: [steps] },
  );

  const value = useMemo<SceneValue>(() => ({ subscribe, steps }), [subscribe, steps]);

  return (
    <SceneContext.Provider value={value}>
      <div
        ref={spacerRef}
        className={cn("relative", className)}
        style={{ height: `${steps * stage}svh` }}
      >
        <div
          className={cn(
            "sticky top-0 flex h-svh items-center overflow-hidden",
            panelClassName,
          )}
        >
          {children}
        </div>
      </div>
    </SceneContext.Provider>
  );
};

const useScene = (): SceneValue => {
  const value = useContext(SceneContext);
  if (!value) {
    throw new Error("Scene hooks must be used inside a <ScrollScene>.");
  }
  return value;
};

/**
 * The scene's active step, as React state.
 *
 * Re-renders only when the bucket changes, not on every scroll frame — the
 * subscriber compares before setting. Use this for anything that is genuinely a
 * different *thing* per step: a photograph, a block of copy, an `aria-current`.
 */
export const useSceneStep = (): { step: number; steps: number } => {
  const { subscribe, steps } = useScene();
  const [step, setStep] = useState(0);

  useEffect(
    () => subscribe((_progress, next) => setStep((current) => (current === next ? current : next))),
    [subscribe],
  );

  return { step, steps };
};

/**
 * The scene's continuous 0→1 progress, written to a ref rather than to state.
 *
 * For anything that should move *with* the scroll rather than change at a
 * boundary. Deliberately not state: this fires on every scroll frame, and
 * putting it through React would re-render the scene sixty times a second to
 * move one element a few pixels. Read `ref.current` inside a GSAP tick or a
 * `quickTo`, never during render.
 */
export const useSceneProgress = (): React.RefObject<number> => {
  const { subscribe } = useScene();
  const progress = useRef(0);

  useEffect(
    () =>
      subscribe((value) => {
        progress.current = value;
      }),
    [subscribe],
  );

  return progress;
};
