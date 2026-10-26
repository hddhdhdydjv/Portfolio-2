// Resolves when the first-load pixel loader has cleared the screen, so intro
// animations play when they can be seen instead of behind the loader.
let resolveIntro: (() => void) | null = null
export const introReady: Promise<void> = import.meta.client
  ? new Promise((resolve) => { resolveIntro = resolve })
  : Promise.resolve()

export function finishIntro() {
  resolveIntro?.()
  resolveIntro = null
}
