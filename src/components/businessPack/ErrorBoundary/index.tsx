'use client';

import React from 'react';
import { ErrorInfo, ReactNode } from 'react';

interface ErrorBoundaryState {
    hasError: boolean;
    error?: Error;
    errorInfo?: ErrorInfo;
}

interface ErrorBoundaryProps {
    children: ReactNode;
    fallback?: (error: Error, errorInfo: ErrorInfo) => ReactNode;
    onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        // 更新 state 使下一次渲染能够显示降级后的 UI
        return {
            hasError: true,
            error,
        };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        // 记录错误信息
        console.error('ErrorBoundary caught an error:', error, errorInfo);

        // 更新状态包含错误信息
        this.setState({
            error,
            errorInfo,
        });

        // 调用外部错误处理函数
        if (this.props.onError) {
            this.props.onError(error, errorInfo);
        }

        // 可以在这里集成错误监控服务（如 Sentry）
        // Sentry.captureException(error, { contexts: { react: errorInfo } });
    }

    handleRetry = () => {
        this.setState({ hasError: false, error: undefined, errorInfo: undefined });
    };

    render() {
        if (this.state.hasError) {
            // 自定义降级 UI
            if (this.props.fallback && this.state.error && this.state.errorInfo) {
                return this.props.fallback(this.state.error, this.state.errorInfo);
            }

            // 默认错误 UI
            return (
                <div className="min-h-screen flex items-center justify-center bg-gray-50">
                    <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6 m-4">
                        <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
                            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.08 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                        </div>

                        <div className="text-center">
                            <h1 className="text-xl font-semibold text-gray-900 mb-2">
                                页面出现错误
                            </h1>
                            <p className="text-gray-600 mb-4">
                                抱歉，页面遇到了一些问题。请稍后重试或联系技术支持。
                            </p>

                            {process.env.NODE_ENV === 'development' && this.state.error && (
                                <details className="mt-4 mb-4 text-left">
                                    <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
                                        查看错误详情
                                    </summary>
                                    <div className="mt-2 p-3 bg-gray-100 rounded text-xs overflow-auto max-h-40">
                                        <div className="font-semibold text-red-600 mb-2">错误信息:</div>
                                        <div className="whitespace-pre-wrap mb-2">{this.state.error.message}</div>
                                        <div className="font-semibold text-red-600 mb-2">错误堆栈:</div>
                                        <div className="whitespace-pre-wrap text-gray-700">{this.state.error.stack}</div>
                                        {this.state.errorInfo && (
                                            <>
                                                <div className="font-semibold text-red-600 mb-2 mt-2">组件堆栈:</div>
                                                <div className="whitespace-pre-wrap text-gray-700">{this.state.errorInfo.componentStack}</div>
                                            </>
                                        )}
                                    </div>
                                </details>
                            )}

                            <div className="flex space-x-3 justify-center">
                                <button
                                    onClick={this.handleRetry}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                                >
                                    重新加载
                                </button>
                                <button
                                    onClick={() => window.location.href = '/'}
                                    className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                                >
                                    返回首页
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;

// 高阶组件包装器
export function withErrorBoundary<P extends object>(
    Component: React.ComponentType<P>,
    errorBoundaryProps?: Omit<ErrorBoundaryProps, 'children'>
) {
    const WrappedComponent = (props: P) => (
        <ErrorBoundary {...errorBoundaryProps}>
            <Component {...props} />
        </ErrorBoundary>
    );

    WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;

    return WrappedComponent;
}

// Hook 用于在函数组件中处理错误
export function useErrorHandler() {
    return (error: Error, errorInfo?: any) => {
        console.error('Handled error:', error, errorInfo);
        // 这里可以集成错误监控服务
        // Sentry.captureException(error, { extra: errorInfo });
    };
}