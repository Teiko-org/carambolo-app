import { Component } from "react";
import PropTypes from "prop-types";

/** Impede que uma falha no tracking de gestos derrube a tela inteira. */
class GestureErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    if (__DEV__) {
      console.warn("[Gestos] Falha capturada no tracking:", error?.message || error);
    }
    this.props.onError?.(error);
  }

  render() {
    if (this.state.hasError) {
      return null;
    }
    return this.props.children;
  }
}

GestureErrorBoundary.propTypes = {
  children: PropTypes.node,
  onError: PropTypes.func,
};

GestureErrorBoundary.defaultProps = {
  children: null,
  onError: undefined,
};

export default GestureErrorBoundary;
