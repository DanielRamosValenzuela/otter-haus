export type ActionState<T = void> =
  | { status: "idle" }
  | { status: "success"; message: string; data?: T }
  | { status: "error"; message: string; fieldErrors?: Record<string, string[] | undefined> };

export const IDLE_ACTION_STATE: ActionState = { status: "idle" };
