import React, { useState } from 'react';
import { 
  X, 
  Plus, 
  Trash2, 
  Wrench, 
  Sparkles, 
  AlertCircle,
  Smartphone,
  Monitor,
  Laptop,
  Cpu
} from 'lucide-react';
import { Issue, StepGuide } from '../types/issue';
import { validateIssueForm } from '../utils/filterIssues';

interface AddIssueModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddIssue: (newIssue: Issue) => void;
}

export const AddIssueModal: React.FC<AddIssueModalProps> = ({
  isOpen,
  onClose,
  onAddIssue,
}) => {
  const [title, setTitle] = useState('');
  const [platform, setPlatform] = useState<'iphone' | 'android' | 'windows' | 'mac' | 'hardware'>('iphone');
  const [category, setCategory] = useState<'system' | 'screen' | 'battery' | 'network' | 'hardware' | 'security'>('system');
  const [severity, setSeverity] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [estimatedTime, setEstimatedTime] = useState('5 - 10 phút');
  const [summary, setSummary] = useState('');
  const [author, setAuthor] = useState('');
  const [requiredTools, setRequiredTools] = useState('');

  // Dynamic arrays
  const [symptoms, setSymptoms] = useState<string[]>(['']);
  const [causes, setCauses] = useState<string[]>(['']);
  const [steps, setSteps] = useState<{ title: string; instructions: string; tip: string; warning: string }[]>([
    { title: 'Kiểm tra sơ bộ', instructions: '', tip: '', warning: '' },
    { title: 'Thao tác khắc phục', instructions: '', tip: '', warning: '' }
  ]);

  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const handleAddSymptom = () => setSymptoms([...symptoms, '']);
  const handleRemoveSymptom = (index: number) => setSymptoms(symptoms.filter((_, i) => i !== index));
  const handleSymptomChange = (index: number, val: string) => {
    const next = [...symptoms];
    next[index] = val;
    setSymptoms(next);
  };

  const handleAddCause = () => setCauses([...causes, '']);
  const handleRemoveCause = (index: number) => setCauses(causes.filter((_, i) => i !== index));
  const handleCauseChange = (index: number, val: string) => {
    const next = [...causes];
    next[index] = val;
    setCauses(next);
  };

  const handleAddStep = () => {
    setSteps([
      ...steps,
      { title: `Bước ${steps.length + 1}`, instructions: '', tip: '', warning: '' }
    ]);
  };

  const handleRemoveStep = (index: number) => {
    if (steps.length <= 1) return;
    setSteps(steps.filter((_, i) => i !== index));
  };

  const handleStepChange = (index: number, field: string, val: string) => {
    const next = [...steps];
    next[index] = { ...next[index], [field]: val };
    setSteps(next);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const validation = validateIssueForm({
      title,
      summary,
      causes,
      steps,
    });

    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setErrors({});

    const formattedSteps: StepGuide[] = steps
      .filter((s) => s.instructions.trim())
      .map((s, idx) => ({
        stepNumber: idx + 1,
        title: s.title.trim() || `Bước ${idx + 1}`,
        instructions: s.instructions.trim(),
        tip: s.tip.trim() || undefined,
        warning: s.warning.trim() || undefined,
      }));

    const newIssue: Issue = {
      id: `custom-${Date.now()}`,
      title: title.trim(),
      platform,
      category,
      severity,
      estimatedTime: estimatedTime.trim() || '10 phút',
      summary: summary.trim(),
      symptoms: symptoms.filter((s) => s.trim().length > 0),
      causes: causes.filter((c) => c.trim().length > 0),
      steps: formattedSteps,
      requiredTools: requiredTools
        ? requiredTools.split(',').map((t) => t.trim()).filter(Boolean)
        : undefined,
      tags: [platform, category, title.toLowerCase().slice(0, 15)],
      author: author.trim() || 'Thành viên cộng đồng',
      createdAt: new Date().toISOString().split('T')[0],
      helpfulCount: 1,
      isUserSubmitted: true,
    };

    onAddIssue(newIssue);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      <div className="relative w-full max-w-3xl max-h-[92vh] sm:max-h-[85vh] bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-slate-200/80 dark:border-slate-800 z-10 animate-in fade-in slide-in-from-bottom duration-200">
        {/* iOS Drag Handle */}
        <div className="sm:hidden pt-3 pb-1 flex justify-center">
          <div className="w-12 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700" />
        </div>

        {/* Modal Header */}
        <div className="px-5 sm:px-7 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-20">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <Sparkles className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Đóng góp Lỗi & Cách Khắc Phục
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Chia sẻ mẹo xử lý sự cố thiết bị hữu ích đến cộng đồng
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto px-5 sm:px-7 py-6 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Tiêu đề sự cố <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ví dụ: Cách khắc phục iPhone sạc không vào pin báo phụ kiện không hỗ trợ"
              className={`w-full px-4 py-2.5 rounded-xl border text-sm bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white outline-none transition-all ${
                errors.title
                  ? 'border-rose-500 ring-2 ring-rose-500/10'
                  : 'border-slate-200 dark:border-slate-700 focus:border-blue-500'
              }`}
            />
            {errors.title && (
              <p className="text-xs text-rose-500 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.title}
              </p>
            )}
          </div>

          {/* Platform & Category Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Thiết bị / Nền tảng
              </label>
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value as any)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white outline-none focus:border-blue-500"
              >
                <option value="iphone">iPhone / iOS</option>
                <option value="android">Android (Samsung, Xiaomi, OPPO...)</option>
                <option value="windows">Windows PC / Laptop</option>
                <option value="mac">MacBook / macOS</option>
                <option value="hardware">Linh kiện & Phần cứng chung</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Chuyên mục lỗi
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white outline-none focus:border-blue-500"
              >
                <option value="system">Hệ thống & Khởi động</option>
                <option value="screen">Màn hình & Cảm ứng</option>
                <option value="battery">Pin & Sạc nguồn</option>
                <option value="network">Mạng, Wi-Fi & SIM</option>
                <option value="security">Mật khẩu & Bảo mật</option>
                <option value="hardware">Linh kiện & Phần cứng</option>
              </select>
            </div>
          </div>

          {/* Severity & Estimated Time */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Độ phức tạp
              </label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value as any)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white outline-none focus:border-blue-500"
              >
                <option value="easy">Dễ xử lý (Người dùng tự làm)</option>
                <option value="medium">Vừa phải (Cần chú ý)</option>
                <option value="hard">Nâng cao (Cần cẩn thận)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Thời gian xử lý
              </label>
              <input
                type="text"
                value={estimatedTime}
                onChange={(e) => setEstimatedTime(e.target.value)}
                placeholder="Ví dụ: 5 phút, 15 phút"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Tên người chia sẻ
              </label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Tên của bạn hoặc Biệt danh"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Summary */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Mô tả tóm tắt sự cố <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={2}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Tóm tắt ngắn 1-2 câu về biểu hiện và cách khắc phục chính..."
              className={`w-full px-4 py-2.5 rounded-xl border text-sm bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white outline-none transition-all ${
                errors.summary
                  ? 'border-rose-500 ring-2 ring-rose-500/10'
                  : 'border-slate-200 dark:border-slate-700 focus:border-blue-500'
              }`}
            />
            {errors.summary && (
              <p className="text-xs text-rose-500 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.summary}
              </p>
            )}
          </div>

          {/* Symptoms List */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Dấu hiệu nhận biết
              </label>
              <button
                type="button"
                onClick={handleAddSymptom}
                className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                Thêm dấu hiệu
              </button>
            </div>
            <div className="space-y-2">
              {symptoms.map((sym, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={sym}
                    onChange={(e) => handleSymptomChange(idx, e.target.value)}
                    placeholder={`Dấu hiệu ${idx + 1} (ví dụ: máy nóng lên, loa rè...)`}
                    className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white outline-none focus:border-blue-500"
                  />
                  {symptoms.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveSymptom(idx)}
                      className="p-2 text-slate-400 hover:text-rose-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Causes List */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Nguyên nhân gây ra <span className="text-rose-500">*</span>
              </label>
              <button
                type="button"
                onClick={handleAddCause}
                className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                Thêm nguyên nhân
              </button>
            </div>
            <div className="space-y-2">
              {causes.map((cause, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={cause}
                    onChange={(e) => handleCauseChange(idx, e.target.value)}
                    placeholder={`Nguyên nhân ${idx + 1} (ví dụ: củ sạc kém chất lượng, driver xung đột...)`}
                    className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white outline-none focus:border-blue-500"
                  />
                  {causes.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveCause(idx)}
                      className="p-2 text-slate-400 hover:text-rose-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
            {errors.causes && (
              <p className="text-xs text-rose-500 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.causes}
              </p>
            )}
          </div>

          {/* Steps List */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Các bước khắc phục cụ thể <span className="text-rose-500">*</span>
              </label>
              <button
                type="button"
                onClick={handleAddStep}
                className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                Thêm bước tiếp theo
              </button>
            </div>

            <div className="space-y-4">
              {steps.map((st, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 space-y-3"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                      Bước {idx + 1}
                    </span>
                    {steps.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveStep(idx)}
                        className="text-xs text-slate-400 hover:text-rose-500 flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Xóa bước này
                      </button>
                    )}
                  </div>

                  <input
                    type="text"
                    value={st.title}
                    onChange={(e) => handleStepChange(idx, 'title', e.target.value)}
                    placeholder="Tiêu đề bước (ví dụ: Khởi động lại cưỡng bức máy)"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs sm:text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:border-blue-500 font-medium"
                  />

                  <textarea
                    rows={2}
                    value={st.instructions}
                    onChange={(e) => handleStepChange(idx, 'instructions', e.target.value)}
                    placeholder="Hướng dẫn chi tiết từng thao tác bấm phím hoặc cài đặt..."
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs sm:text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:border-blue-500"
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={st.tip}
                      onChange={(e) => handleStepChange(idx, 'tip', e.target.value)}
                      placeholder="Mẹo nhỏ hữu ích (tùy chọn)"
                      className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 outline-none"
                    />
                    <input
                      type="text"
                      value={st.warning}
                      onChange={(e) => handleStepChange(idx, 'warning', e.target.value)}
                      placeholder="Lưu ý an toàn (tùy chọn)"
                      className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 outline-none"
                    />
                  </div>
                </div>
              ))}
            </div>
            {errors.steps && (
              <p className="text-xs text-rose-500 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.steps}
              </p>
            )}
          </div>

          {/* Tools required */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Dụng cụ chuẩn bị (nếu có)
            </label>
            <input
              type="text"
              value={requiredTools}
              onChange={(e) => setRequiredTools(e.target.value)}
              placeholder="Cách nhau bằng dấu phẩy, ví dụ: Cáp sạc chính hãng, Máy tính, Gôm tẩy"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white outline-none focus:border-blue-500"
            />
          </div>

          {/* Bottom Action */}
          <div className="pt-3 pb-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3 sticky bottom-0 bg-white dark:bg-slate-900 z-20 shadow-lg">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold shadow-md shadow-blue-500/20 active:scale-[0.98] transition-all"
            >
              Lưu & Đăng tải mẹo
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
