import type {ErrorInfo} from 'react';
import React from 'react';

interface Props {
    children?: React.ReactNode;
    fallback?: React.ReactNode;
}

interface State {
    hasError: boolean;
}

export class ErrorBoundary extends React.Component<Props, State> {
    state = {hasError: false};

    // eslint-disable-next-line @typescript-eslint/member-ordering
    static getDerivedStateFromError() {
        return {hasError: true};
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Caught error by ErrorBoundary:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return this.props.fallback;
        }

        return this.props.children;
    }
}
