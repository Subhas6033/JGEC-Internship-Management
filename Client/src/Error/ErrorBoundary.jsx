import React from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "../Components/index";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      hasError: false,
    };
  }

  static getDerivedStateFromError() {
    return {
      hasError: true,
    };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Client Error:", error);
    console.error("Component Stack:", errorInfo.componentStack);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return <ErrorFallback onReload={this.handleReload} />;
    }

    return this.props.children;
  }
}

export const ErrorFallback = ({ onReload }) => {
  return (
    <main className="min-h-screen flex items-center justify-center bg-cream px-4 text-ink">
      <div className="w-full max-w-md text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
          <AlertTriangle className="h-8 w-8 text-red-600" aria-hidden="true" />
        </div>

        <h1 className="text-2xl font-semibold">Something went wrong</h1>

        <p className="mt-3 text-sm text-gray-600">
          Something unexpected happened while loading this page. Please try
          again.
        </p>

        <Button
          type="button"
          variant="danger"
          className={"m-2"}
          onClick={onReload}
        >
          <RefreshCw className="h-4 w-4" />
          Try again
        </Button>
      </div>
    </main>
  );
};

export default ErrorBoundary;
