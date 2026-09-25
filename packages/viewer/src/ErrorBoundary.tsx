import { Component, type ReactNode } from "react";

/** 予期しない例外で画面が真っ白にならないよう、描画中の例外を受け止めて内容を表示する */
export class ErrorBoundary extends Component<{ children: ReactNode }, { error?: unknown }> {
  state: { error?: unknown } = {};

  static getDerivedStateFromError(error: unknown) {
    return { error };
  }

  render() {
    if (this.state.error === undefined) return this.props.children;
    return <p className="error">Unexpected error: {String(this.state.error)}</p>;
  }
}
