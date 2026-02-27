import {StrictMode, Component, type ReactNode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

function showBootError(msg: string) {
  const root = document.getElementById('root');
  if (root) {
    root.innerHTML = `<div style="padding:2rem;font-family:system-ui;color:#0B3064;max-width:600px;"><p style="font-weight:bold;">Error al cargar:</p><pre style="background:#f1f5f9;padding:1rem;overflow:auto;font-size:12px;">${msg.replace(/</g, '&lt;')}</pre></div>`;
  }
}

class ErrorBoundary extends Component<{children: ReactNode}, {error: Error | null}> {
  state = { error: null as Error | null };
  static getDerivedStateFromError(error: Error) { return { error }; }
  componentDidCatch(error: Error) { this.setState({ error }); }
  render() {
    if (this.state.error) {
      const e = this.state.error;
      return (
        <div style={{ padding: '2rem', fontFamily: 'system-ui', color: '#0B3064', maxWidth: 600 }}>
          <p style={{ fontWeight: 'bold' }}>Error en la app:</p>
          <pre style={{ background: '#f1f5f9', padding: '1rem', overflow: 'auto', fontSize: 12 }}>{e.message}\n{e.stack}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}

// #region agent log
fetch('http://127.0.0.1:7246/ingest/8dae4054-223c-427f-859a-09466d36a166',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'main.tsx:entry',message:'main.tsx running',data:{hasRoot:!!document.getElementById('root')},timestamp:Date.now(),hypothesisId:'H1'})}).catch(()=>{});
// #endregion
try {
  const rootEl = document.getElementById('root');
  if (!rootEl) throw new Error('No #root element');
  createRoot(rootEl).render(
    <StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </StrictMode>,
  );
  // #region agent log
  fetch('http://127.0.0.1:7246/ingest/8dae4054-223c-427f-859a-09466d36a166',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'main.tsx:afterRender',message:'createRoot.render completed',data:{},timestamp:Date.now(),hypothesisId:'H2'})}).catch(()=>{});
  // #endregion
} catch (e) {
  const errMsg = e instanceof Error ? `${e.name}: ${e.message}\n${e.stack ?? ''}` : String(e);
  showBootError(errMsg);
  // #region agent log
  fetch('http://127.0.0.1:7246/ingest/8dae4054-223c-427f-859a-09466d36a166',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'main.tsx:catch',message:'main.tsx error',data:{err:String(e)},timestamp:Date.now(),hypothesisId:'H1'})}).catch(()=>{});
  // #endregion
}
