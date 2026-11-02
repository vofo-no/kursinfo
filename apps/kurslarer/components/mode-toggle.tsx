"use client";

import { useSyncExternalStore, type MouseEvent } from "react";
import { Button, Tooltip } from "@digdir/designsystemet-react";
import { MoonIcon, SunIcon } from "@phosphor-icons/react/ssr";
import { useTheme } from "next-themes";

const subscribe = () => () => {};
// false on the server and during hydration, true afterwards
const useMounted = () =>
  useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );

export function ModeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useMounted();

  if (!mounted) {
    // same size as the real button, nothing that depends on the theme
    return (
      <Button aria-label="Bytt fargemodus" variant="tertiary" icon disabled>
        <MoonIcon aria-hidden style={{ visibility: "hidden" }} />
      </Button>
    );
  }

  const isDark = resolvedTheme === "dark";
  const label = isDark ? "Bytt til lys modus" : "Bytt til mørk modus";

  const handleThemeChange = (
    newTheme: "dark" | "light",
    event: MouseEvent<HTMLButtonElement>,
  ) => {
    if (
      !document.startViewTransition ||
      window.matchMedia("(prefers-reduced-motion)").matches
    ) {
      setTheme(newTheme);
      return;
    }

    const { left, bottom, width, height } =
      event.currentTarget.getBoundingClientRect();
    document.documentElement.style.setProperty(
      "--_theme-x",
      `${left + width / 2}px`,
    );
    document.documentElement.style.setProperty(
      "--_theme-y",
      `${bottom - height / 2}px`,
    );

    document.startViewTransition(() => {
      setTheme(newTheme);
    });
  };

  return (
    <Tooltip content={label} placement="bottom">
      <Button
        aria-label={label}
        variant="tertiary"
        icon
        onClick={(e) => handleThemeChange(isDark ? "light" : "dark", e)}
      >
        {isDark ? <SunIcon aria-hidden /> : <MoonIcon aria-hidden />}
      </Button>
    </Tooltip>
  );
}
