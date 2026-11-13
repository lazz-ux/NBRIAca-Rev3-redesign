/**
 * Account system seam. NBRI Academy has no authentication yet (PLAN.md
 * milestone 3 plans Netlify Identity). UI talks only to this interface, so
 * wiring a real provider is one adapter, not a UI rewrite.
 *
 * The default adapter is deliberately NOT a fake login: every call rejects with
 * AuthNotConfiguredError, so nothing can look "signed in" in production.
 */
import type { LevelId } from "./learning";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  /** Participant level; set by placement assessment or the Project Officer. */
  level?: LevelId;
}

export interface AuthAdapter {
  current(): Promise<AuthUser | null>;
  signIn(email: string, password: string): Promise<AuthUser>;
  signUp(name: string, email: string, password: string): Promise<AuthUser>;
  signOut(): Promise<void>;
}

export class AuthNotConfiguredError extends Error {
  constructor() {
    super("Accounts are not connected yet.");
    this.name = "AuthNotConfiguredError";
  }
}

const reject = () => Promise.reject(new AuthNotConfiguredError());

export const auth: AuthAdapter = {
  current: () => Promise.resolve(null),
  signIn: reject,
  signUp: reject,
  signOut: () => Promise.resolve(),
};
