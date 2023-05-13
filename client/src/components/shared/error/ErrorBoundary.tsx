import { Component, ErrorInfo, ReactNode } from "react";
import ErrorMessage from "./ErrorMessage";
import React from "react";

interface Props {
  children: ReactNode;
}

interface State {
  error: Error | null;
  errorInfo: ErrorInfo | null;
  hasError: boolean;
  urlLocation: string | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  private promiseRejectionHandler = (event: PromiseRejectionEvent) => {
    this.setState({
      error: event.reason,
      hasError: true,
      urlLocation: window.location.href,
    });
  };

  private onClickListener = () => {
    const errorLocation = this.state?.urlLocation;
    requestAnimationFrame(() => {
      if (errorLocation && errorLocation !== window.location.href) {
        this.setState({
          hasError: false,
          error: null,
          errorInfo: null,
          urlLocation: null,
        });
      }
    });
  };

  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      urlLocation: null,
    };
  }

  public static getDerivedStateFromError(error: Error) {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo,
      urlLocation: window.location.href,
    });
  }

  componentDidMount() {
    window.addEventListener("unhandledrejection", this.promiseRejectionHandler);
    document.body.addEventListener("click", this.onClickListener, true);
  }

  componentWillUnmount() {
    window.removeEventListener(
      "unhandledrejection",
      this.promiseRejectionHandler,
    );
    document.body.removeEventListener("click", this.onClickListener);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <ErrorMessage
          message={
            "Try to reload the page.\n" + (this.state.error?.message || "")
          }
        />
      );
    }
    return this.props.children;
  }
}
