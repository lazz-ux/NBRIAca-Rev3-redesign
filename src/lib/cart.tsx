import * as React from "react";
import { MAX_TICKETS_PER_LINE } from "./fixtures";
import { lineKey, type CartLine } from "./pricing";

const STORAGE_KEY = "nbri-cart-v1";

interface CartState {
  lines: CartLine[];
}

interface CartContextValue extends CartState {
  ready: boolean;
  count: number;
  add: (input: {
    slug: string;
    sessionId: string | null;
    variant: number[];
    qty: number;
  }) => void;
  setQty: (key: string, qty: number) => void;
  remove: (key: string) => void;
  toggle: (key: string, selected: boolean) => void;
  toggleAll: (selected: boolean) => void;
  clearSelected: () => void;
}

const CartContext = React.createContext<CartContextValue | null>(null);

/**
 * Cart lives in the browser for milestone 1. Milestone 3 syncs it to the
 * signed-in user's server-side cart (see PLAN.md).
 */
export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = React.useState<CartState>({ lines: [] });
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      // Older saved carts may also carry a coupon field; only lines are kept.
      if (raw) setState(JSON.parse(raw) as CartState);
    } catch {
      // ignore corrupt storage
    }
    setReady(true);
  }, []);

  React.useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // storage may be unavailable (private mode)
    }
  }, [state, ready]);

  const value = React.useMemo<CartContextValue>(() => {
    const clamp = (q: number) => Math.max(1, Math.min(MAX_TICKETS_PER_LINE, q));
    return {
      ...state,
      ready,
      count: state.lines.reduce((n, l) => n + l.qty, 0),
      add: ({ slug, sessionId, variant, qty }) =>
        setState((s) => {
          const key = lineKey(slug, sessionId, variant);
          const existing = s.lines.find((l) => l.key === key);
          const lines = existing
            ? s.lines.map((l) =>
                l.key === key
                  ? { ...l, qty: clamp(l.qty + qty), selected: true }
                  : l,
              )
            : [
                ...s.lines,
                {
                  key,
                  slug,
                  sessionId,
                  variant,
                  qty: clamp(qty),
                  selected: true,
                },
              ];
          return { ...s, lines };
        }),
      setQty: (key, qty) =>
        setState((s) => ({
          ...s,
          lines: s.lines.map((l) =>
            l.key === key ? { ...l, qty: clamp(qty) } : l,
          ),
        })),
      remove: (key) =>
        setState((s) => ({
          ...s,
          lines: s.lines.filter((l) => l.key !== key),
        })),
      toggle: (key, selected) =>
        setState((s) => ({
          ...s,
          lines: s.lines.map((l) => (l.key === key ? { ...l, selected } : l)),
        })),
      toggleAll: (selected) =>
        setState((s) => ({
          ...s,
          lines: s.lines.map((l) => ({ ...l, selected })),
        })),
      clearSelected: () =>
        setState((s) => ({ lines: s.lines.filter((l) => !l.selected) })),
    };
  }, [state, ready]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = React.useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
