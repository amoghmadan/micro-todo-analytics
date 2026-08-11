import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { ApiError, fetchScreen } from "./api";
import { useAuth } from "./auth";
import { ScreenRenderer } from "./sdui";
import type { SduiScreen } from "./sdui-types";

interface ScreenPageState {
  screen: SduiScreen | null;
  loading: boolean;
  error: string;
}

export function ScreenPage({ screen }: { screen: string }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { refresh } = useAuth();
  const [state, setState] = useState<ScreenPageState>({
    screen: null,
    loading: true,
    error: "",
  });

  const load = useCallback(
    async (signal?: AbortSignal) => {
      setState({ screen: null, loading: true, error: "" });
      try {
        const data = await fetchScreen(screen, location.search, signal);
        setState({ screen: data, loading: false, error: "" });
      } catch (error) {
        if (signal?.aborted) return;
        if (error instanceof ApiError && error.status === 401) {
          await refresh();
          navigate("/login", { replace: true });
          return;
        }
        setState({
          screen: null,
          loading: false,
          error: error instanceof Error ? error.message : "Failed to load screen",
        });
      }
    },
    [screen, location.search, refresh, navigate]
  );

  useEffect(() => {
    const controller = new AbortController();
    load(controller.signal);
    return () => controller.abort();
  }, [load]);

  if (state.loading) {
    return (
      <div className="flex justify-center py-16">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  if (state.error) {
    return (
      <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-900/30 dark:text-red-200">
        {state.error}
      </div>
    );
  }

  if (!state.screen) return null;

  return (
    <ScreenRenderer screen={state.screen} onRefetch={load} refreshSession={refresh} />
  );
}
