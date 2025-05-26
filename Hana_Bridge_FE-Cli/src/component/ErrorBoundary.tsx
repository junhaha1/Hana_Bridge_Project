// src/components/ErrorBoundary.tsx
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

//React 컴포넌트를 감싸기 위해 사용
interface Props {
  children: ReactNode;
}

//에러 발생했는지 확인
interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error): State {
    // 렌더링 오류 발생 시 상태 업데이트
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // 오류 로깅 (옵션)
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // 렌더링 오류 발생 시 리디렉션
      return <Navigate to="/renderError" replace />;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
