import { readable, writable } from "svelte/store";

export const visible = writable<boolean>();

export function playAnimation() {
  visible.set(true);
  setTimeout(() => {
    visible.set(false);
  }, 1000);
}