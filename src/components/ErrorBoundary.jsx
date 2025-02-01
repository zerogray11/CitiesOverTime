import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state to indicate error
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error and error info (can also send to a logging service)
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <h1>Something went wrong.</h1>
          <p>{this.state.error && this.state.error.toString()}</p>
          <details>
            {this.state.errorInfo && <pre>{this.state.errorInfo.componentStack}</pre>}
          </details>
        </div>
      );
    }

    return this.props.children; // Render children if no error
  }
}

export default ErrorBoundary;
