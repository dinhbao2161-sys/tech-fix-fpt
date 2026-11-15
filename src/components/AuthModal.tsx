import React, { useEffect, useState } from 'react';
import {
  X,
  Mail,
  Lock,
  User as UserIcon,
  ShieldCheck,
  AlertCircle,
  Loader2,
  ExternalLink,
  Copy,
  Check,
} from 'lucide-react';
import { AuthConfigInfo, AuthUser } from '../types/auth';
import { apiFetch, setStoredSessionToken } from '../utils/apiClient';
import { isFirebaseGoogleConfigured, signInWithGooglePopup } from '../utils/firebaseAuth';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: AuthUser) => void;
  promptReason?: string | null;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onAuthSuccess,
  promptReason,
}) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [config, setConfig] = useState<AuthConfigInfo | null>(null);
  const [showGoogleGuide, setShowGoogleGuide] = useState(false);
  const [copiedCallback, setCopiedCallback] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setError(null);
    apiFetch('/api/auth/config')
      .then((res) => (res.ok ? res.json() : null))
      .then((data: AuthConfigInfo | null) => {
        if (data) setConfig(data);
      })
      .catch(() => {});
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleMessage = (event: MessageEvent) => {
      const origin = event.origin;
      if (
        !origin.endsWith('.run.app') &&
        !origin.includes('localhost') &&
        !origin.includes('127.0.0.1')
      ) {
        return;
      }

      const data = event.data as {
        type?: string;
        token?: string;
        user?: AuthUser;
        error?: string;
      };

      if (data?.type === 'OAUTH_AUTH_SUCCESS' && data.user) {
        setGoogleLoading(false);
        if (data.token) setStoredSessionToken(data.token);
        onAuthSuccess(data.user);
        onClose();
      } else if (data?.type === 'OAUTH_AUTH_ERROR') {
        setGoogleLoading(false);
        setError(data.error || 'Đăng nhập Google không thành công.');
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [isOpen, onAuthSuccess, onClose]);

  if (!isOpen) return null;

  const firebaseGoogleReady = isFirebaseGoogleConfigured();
  const isGoogleReady = firebaseGoogleReady || Boolean(config?.googleConfigured);

  const handleGoogleLogin = async () => {
    setError(null);
    setGoogleLoading(true);

    if (firebaseGoogleReady) {
      try {
        const { idToken } = await signInWithGooglePopup();
        const res = await apiFetch('/api/auth/google/firebase', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ idToken }),
        });
        const data = (await res.json()) as { token?: string; user?: AuthUser; error?: string };
        if (!res.ok || !data.user) {
          setError(data.error || 'Không thể xác thực tài khoản Google trên máy chủ.');
          setGoogleLoading(false);
          return;
        }
        if (data.token) setStoredSessionToken(data.token);
        setGoogleLoading(false);
        onAuthSuccess(data.user);
        onClose();
        return;
      } catch (err: unknown) {
        const code = (err as { code?: string })?.code || '';
        if (code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request') {
          setError('Bạn đã đóng cửa sổ đăng nhập Google trước khi hoàn tất.');
          setGoogleLoading(false);
          return;
        }
        if (code === 'auth/popup-blocked') {
          setError('Trình duyệt đang chặn cửa sổ bật lên. Vui lòng cho phép popup để đăng nhập Google.');
          setGoogleLoading(false);
          return;
        }
        if (code === 'auth/unauthorized-domain') {
          setError(`Tên miền hiện tại (${window.location.hostname}) chưa được cấp phép trong Firebase Auth.`);
          setGoogleLoading(false);
          return;
        }
        setError('Không thể hoàn tất đăng nhập Google. Vui lòng thử lại.');
        setGoogleLoading(false);
        return;
      }
    }

    try {
      const res = await apiFetch('/api/auth/google/url');
      const data = (await res.json()) as { url?: string; error?: string; callbackUrl?: string };
      if (!res.ok || !data.url) {
        setShowGoogleGuide(true);
        setError(data.error || 'Google OAuth chưa được cấu hình trên máy chủ.');
        setGoogleLoading(false);
        return;
      }

      const width = 520;
      const height = 660;
      const left = Math.max(0, Math.round(window.screenX + (window.outerWidth - width) / 2));
      const top = Math.max(0, Math.round(window.screenY + (window.outerHeight - height) / 2));
      const popup = window.open(
        data.url,
        'techcare_google_oauth',
        `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`
      );

      if (!popup) {
        setError('Trình duyệt đã chặn cửa sổ bật lên. Vui lòng cho phép popup để đăng nhập Google.');
        setGoogleLoading(false);
        return;
      }

      const pollTimer = window.setInterval(() => {
        if (popup.closed) {
          window.clearInterval(pollTimer);
          setGoogleLoading(false);
        }
      }, 500);
    } catch {
      setError('Không thể kết nối tới máy chủ xác thực Google.');
      setGoogleLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/register';
      const body = mode === 'login' ? { email, password } : { email, password, name };
      const res = await apiFetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = (await res.json()) as { token?: string; user?: AuthUser; error?: string };
      if (!res.ok || !data.user) {
        setError(data.error || 'Không thể hoàn tất đăng nhập.');
        setLoading(false);
        return;
      }

      if (data.token) setStoredSessionToken(data.token);
      onAuthSuccess(data.user);
      onClose();
    } catch {
      setError('Lỗi kết nối máy chủ. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const callbackUrl = config?.callbackUrl || `${window.location.origin}/auth/callback`;

  const handleCopyCallback = () => {
    navigator.clipboard.writeText(callbackUrl).then(() => {
      setCopiedCallback(true);
      setTimeout(() => setCopiedCallback(false), 2000);
    });
  };

  return (
    <div
      className="fixed inset-0 z-[60] overflow-y-auto bg-[#000000]/90 flex items-center justify-center p-4 animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
    >
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      <div className="relative w-full max-w-md bg-[#0A0A0A] rounded-3xl border border-white/[0.1] shadow-2xl overflow-hidden z-10">
        {/* Header */}
        <div className="px-6 py-5 border-b border-white/[0.08] flex items-center justify-between gap-3">
          <div>
            <h2 id="auth-modal-title" className="text-base font-bold text-[#FFFFFF] font-['Manrope']">
              Đăng nhập TechCare
            </h2>
            <p className="text-xs text-[#A0A0A0] mt-0.5">
              Đóng góp giải pháp & phân quyền quản trị viên
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-[#121212] border border-white/[0.08] hover:bg-[#1E1E1E] flex items-center justify-center text-[#A0A0A0] hover:text-[#FFFFFF] transition-colors cursor-pointer"
            aria-label="Đóng hộp thoại đăng nhập"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {promptReason && (
            <div className="p-3 rounded-xl bg-[#F97316]/10 border border-[#F97316]/30 text-xs text-[#FB923C]">
              {promptReason}
            </div>
          )}

          {/* Option 1: Google Sign-In */}
          <div className="space-y-2.5">
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={googleLoading}
              className="w-full h-11 px-4 rounded-xl bg-[#FFFFFF] hover:bg-[#F3F4F6] text-[#111827] text-sm font-semibold flex items-center justify-center gap-3 transition-all active:scale-[0.99] disabled:opacity-60 cursor-pointer"
            >
              {googleLoading ? (
                <Loader2 className="w-4 h-4 animate-spin text-[#111827]" />
              ) : (
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17Z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.14C3.26 21.3 7.31 24 12 24Z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.24c-.24-.72-.38-1.49-.38-2.24s.14-1.52.38-2.24V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.99-3.14Z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.99 3.14c.95-2.85 3.6-4.96 6.72-4.96Z"
                  />
                </svg>
              )}
              <span>Tiếp tục với Google</span>
            </button>

            <div className="flex items-center justify-between text-[11px] text-[#A0A0A0] px-1">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#F97316]" />
                Admin mặc định: <strong className="text-[#FFFFFF] font-mono">{config?.adminEmail || 'dinhbao2161@gmail.com'}</strong>
              </span>
              {!isGoogleReady && (
                <button
                  type="button"
                  onClick={() => setShowGoogleGuide((v) => !v)}
                  className="text-[#F97316] hover:underline cursor-pointer"
                >
                  {showGoogleGuide ? 'Ẩn cấu hình' : 'Hướng dẫn bật'}
                </button>
              )}
            </div>

            {showGoogleGuide && !isGoogleReady && (
              <div className="p-3.5 rounded-xl bg-[#121212] border border-[#F97316]/30 text-[11px] text-[#A0A0A0] space-y-2">
                <div className="font-semibold text-[#FFFFFF] flex items-center justify-between">
                  <span>Cấu hình Google OAuth2 (Secrets)</span>
                  <a
                    href="https://console.cloud.google.com/apis/credentials"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#F97316] hover:underline inline-flex items-center gap-1"
                  >
                    Cloud Console <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <p>
                  Thêm <code className="text-[#F97316]">GOOGLE_CLIENT_ID</code> và{' '}
                  <code className="text-[#F97316]">GOOGLE_CLIENT_SECRET</code> vào Settings &gt; Secrets, đồng thời thêm Redirect URI sau:
                </p>
                <div className="flex items-center gap-2 p-2 rounded-lg bg-[#000000] border border-white/[0.08]">
                  <code className="text-[10px] font-mono text-[#FFFFFF] truncate flex-1">
                    {callbackUrl}
                  </code>
                  <button
                    type="button"
                    onClick={handleCopyCallback}
                    className="text-[#F97316] hover:text-[#FB923C] shrink-0 cursor-pointer"
                    title="Sao chép Callback URL"
                  >
                    {copiedCallback ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="relative flex items-center py-1">
            <div className="flex-grow border-t border-white/[0.08]" />
            <span className="shrink mx-3 text-[11px] font-mono uppercase tracking-wider text-[#666666]">
              Hoặc tài khoản Email
            </span>
            <div className="flex-grow border-t border-white/[0.08]" />
          </div>

          {/* Option 2: Email + Password Switcher */}
          <div className="grid grid-cols-2 p-1 rounded-xl bg-[#121212] border border-white/[0.08] text-xs font-semibold">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setError(null);
              }}
              className={`py-2 rounded-lg transition-all cursor-pointer ${
                mode === 'login'
                  ? 'bg-[#F97316] text-[#000000]'
                  : 'text-[#A0A0A0] hover:text-[#FFFFFF]'
              }`}
            >
              Đăng nhập
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('register');
                setError(null);
              }}
              className={`py-2 rounded-lg transition-all cursor-pointer ${
                mode === 'register'
                  ? 'bg-[#F97316] text-[#000000]'
                  : 'text-[#A0A0A0] hover:text-[#FFFFFF]'
              }`}
            >
              Đăng ký mới
            </button>
          </div>

          <form onSubmit={handlePasswordSubmit} className="space-y-3.5">
            {mode === 'register' && (
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-[#A0A0A0] mb-1.5">
                  Họ tên / Bí danh
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-[#A0A0A0] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ví dụ: Minh Tuấn Tech"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#121212] border border-white/[0.08] focus:border-[#F97316] text-sm text-[#FFFFFF] placeholder:text-[#666666] outline-none"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-[#A0A0A0] mb-1.5">
                Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#A0A0A0] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#121212] border border-white/[0.08] focus:border-[#F97316] text-sm text-[#FFFFFF] placeholder:text-[#666666] outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-[#A0A0A0] mb-1.5">
                Mật khẩu
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#A0A0A0] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Tối thiểu 6 ký tự"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#121212] border border-white/[0.08] focus:border-[#F97316] text-sm text-[#FFFFFF] placeholder:text-[#666666] outline-none"
                />
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-[#EF4444]/10 border border-[#EF4444]/30 text-xs text-[#EF4444] flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 rounded-xl bg-[#F97316] hover:bg-[#FB923C] text-[#000000] text-sm font-bold transition-all shadow-[0_2px_14px_rgba(249,115,22,0.3)] disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>{mode === 'login' ? 'Đăng nhập bằng Email' : 'Tạo tài khoản cộng đồng'}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
