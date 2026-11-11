import React, { useState } from 'react';
import { 
  X, 
  Plus, 
  Trash2, 
  Sparkles, 
  AlertCircle
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
    { title: 'Chẩn đoán sơ bộ', instructions: '', tip: '', warning: '' },
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
      author: author.trim() || 'Kỹ thuật viên cộng đồng',
      createdAt: new Date().toISOString().split('T')[0],
      helpfulCount: 1,
      isUserSubmitted: true,
    };

    onAddIssue(newIssue);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#10110F]/85 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      <div className="relative w-full max-w-3xl max-h-[92vh] sm:max-h-[88vh] bg-[#171916] rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-white/[0.12] z-10">
        {/* Mobile Drag Handle */}
        <div className="sm:hidden pt-3 pb-1 flex justify-center bg-[#171916]">
          <div className="w-12 h-1.5 rounded-full bg-white/20" />
        </div>

        {/* Modal Header */}
        <div className="px-6 sm:px-8 py-4.5 border-b border-white/[0.08] flex items-center justify-between gap-4 bg-[#171916] sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <span className="p-2.5 rounded-xl bg-[#1D211D] border border-white/[0.09] text-[#B8C7A1]">
              <Sparkles className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-base font-bold text-[#F2F1EB] font-['Manrope']">
                Đóng Góp Giải Pháp Kỹ Thuật
              </h2>
              <p className="text-xs text-[#A2A69D]">
                Mở rộng kho kiến thức chẩn đoán sự cố cho cộng đồng
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-[#1D211D] border border-white/[0.08] hover:bg-[#252b24] flex items-center justify-center text-[#A2A69D] hover:text-[#F2F1EB] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto px-6 sm:px-8 py-7 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#A2A69D] mb-2">
              Tiêu đề sự cố / Lỗi kỹ thuật <span className="text-[#E07A5F]">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ví dụ: Cách khắc phục iPhone sạc không vào pin báo phụ kiện không hỗ trợ"
              className={`w-full px-4 py-3 rounded-xl border text-sm bg-[#1D211D] text-[#F2F1EB] placeholder:text-[#A2A69D]/60 outline-none transition-all ${
                errors.title
                  ? 'border-[#E07A5F] ring-1 ring-[#E07A5F]/20'
                  : 'border-white/[0.09] focus:border-[#B8C7A1]'
              }`}
            />
            {errors.title && (
              <p className="text-xs text-[#E07A5F] mt-1.5 flex items-center gap-1 font-mono">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.title}
              </p>
            )}
          </div>

          {/* Platform & Category Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#A2A69D] mb-2">
                Nền tảng thiết bị
              </label>
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value as any)}
                className="w-full px-4 py-3 rounded-xl border border-white/[0.09] text-sm bg-[#1D211D] text-[#F2F1EB] outline-none focus:border-[#B8C7A1]"
              >
                <option value="iphone">iPhone / iOS</option>
                <option value="android">Android (Samsung, Xiaomi, OPPO...)</option>
                <option value="windows">Windows PC / Laptop</option>
                <option value="mac">MacBook / macOS</option>
                <option value="hardware">Phần cứng & Bo mạch</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#A2A69D] mb-2">
                Chuyên mục sự cố
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-4 py-3 rounded-xl border border-white/[0.09] text-sm bg-[#1D211D] text-[#F2F1EB] outline-none focus:border-[#B8C7A1]"
              >
                <option value="system">Hệ thống & Khởi động</option>
                <option value="screen">Màn hình & Cảm ứng</option>
                <option value="battery">Nguồn & Tế bào pin</option>
                <option value="network">Mạng viễn thông & Wi-Fi</option>
                <option value="security">Khóa bảo mật & Mật khẩu</option>
                <option value="hardware">Bo mạch & Chipset</option>
              </select>
            </div>
          </div>

          {/* Severity & Estimated Time */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#A2A69D] mb-2">
                Mức độ phức tạp
              </label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value as any)}
                className="w-full px-4 py-3 rounded-xl border border-white/[0.09] text-sm bg-[#1D211D] text-[#F2F1EB] outline-none focus:border-[#B8C7A1]"
              >
                <option value="easy">Dễ xử lý (Tự thao tác)</option>
                <option value="medium">Trung bình (Cần cẩn thận)</option>
                <option value="hard">Chuyên sâu (Kỹ thuật cao)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#A2A69D] mb-2">
                Thời gian dự kiến
              </label>
              <input
                type="text"
                value={estimatedTime}
                onChange={(e) => setEstimatedTime(e.target.value)}
                placeholder="Ví dụ: 5 phút, 15 phút"
                className="w-full px-4 py-3 rounded-xl border border-white/[0.09] text-sm bg-[#1D211D] text-[#F2F1EB] placeholder:text-[#A2A69D]/60 outline-none focus:border-[#B8C7A1]"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#A2A69D] mb-2">
                Tên kỹ thuật viên
              </label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Họ tên hoặc bí danh"
                className="w-full px-4 py-3 rounded-xl border border-white/[0.09] text-sm bg-[#1D211D] text-[#F2F1EB] placeholder:text-[#A2A69D]/60 outline-none focus:border-[#B8C7A1]"
              />
            </div>
          </div>

          {/* Summary */}
          <div>
            <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#A2A69D] mb-2">
              Tóm tắt sự cố <span className="text-[#E07A5F]">*</span>
            </label>
            <textarea
              rows={2}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Tóm tắt ngắn gọn triệu chứng và hướng khắc phục..."
              className={`w-full px-4 py-3 rounded-xl border text-sm bg-[#1D211D] text-[#F2F1EB] placeholder:text-[#A2A69D]/60 outline-none transition-all ${
                errors.summary
                  ? 'border-[#E07A5F] ring-1 ring-[#E07A5F]/20'
                  : 'border-white/[0.09] focus:border-[#B8C7A1]'
              }`}
            />
            {errors.summary && (
              <p className="text-xs text-[#E07A5F] mt-1.5 flex items-center gap-1 font-mono">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.summary}
              </p>
            )}
          </div>

          {/* Symptoms List */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-mono font-bold uppercase tracking-wider text-[#A2A69D]">
                Dấu hiệu nhận biết
              </label>
              <button
                type="button"
                onClick={handleAddSymptom}
                className="text-xs font-mono text-[#B8C7A1] hover:underline flex items-center gap-1"
              >
                <Plus className="w-3 h-3" />
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
                    placeholder={`Dấu hiệu ${idx + 1}`}
                    className="flex-1 px-4 py-2.5 rounded-xl border border-white/[0.09] text-xs sm:text-sm bg-[#1D211D] text-[#F2F1EB] placeholder:text-[#A2A69D]/60 outline-none focus:border-[#B8C7A1]"
                  />
                  {symptoms.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveSymptom(idx)}
                      className="p-2 text-[#A2A69D] hover:text-[#E07A5F]"
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
              <label className="text-xs font-mono font-bold uppercase tracking-wider text-[#A2A69D]">
                Nguyên nhân cốt lõi <span className="text-[#E07A5F]">*</span>
              </label>
              <button
                type="button"
                onClick={handleAddCause}
                className="text-xs font-mono text-[#B8C7A1] hover:underline flex items-center gap-1"
              >
                <Plus className="w-3 h-3" />
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
                    placeholder={`Nguyên nhân ${idx + 1}`}
                    className="flex-1 px-4 py-2.5 rounded-xl border border-white/[0.09] text-xs sm:text-sm bg-[#1D211D] text-[#F2F1EB] placeholder:text-[#A2A69D]/60 outline-none focus:border-[#B8C7A1]"
                  />
                  {causes.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveCause(idx)}
                      className="p-2 text-[#A2A69D] hover:text-[#E07A5F]"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
            {errors.causes && (
              <p className="text-xs text-[#E07A5F] mt-1.5 flex items-center gap-1 font-mono">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.causes}
              </p>
            )}
          </div>

          {/* Steps List */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-mono font-bold uppercase tracking-wider text-[#A2A69D]">
                Quy trình các bước chẩn đoán <span className="text-[#E07A5F]">*</span>
              </label>
              <button
                type="button"
                onClick={handleAddStep}
                className="text-xs font-mono text-[#B8C7A1] hover:underline flex items-center gap-1"
              >
                <Plus className="w-3 h-3" />
                Thêm bước tiếp theo
              </button>
            </div>

            <div className="space-y-4">
              {steps.map((st, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl border border-white/[0.08] bg-[#1D211D] space-y-3"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-mono font-bold text-[#B8C7A1]">
                      Bước {idx + 1}
                    </span>
                    {steps.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveStep(idx)}
                        className="text-xs text-[#A2A69D] hover:text-[#E07A5F] flex items-center gap-1 font-mono"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Xóa bước
                      </button>
                    )}
                  </div>

                  <input
                    type="text"
                    value={st.title}
                    onChange={(e) => handleStepChange(idx, 'title', e.target.value)}
                    placeholder="Tiêu đề bước (ví dụ: Reset tổ hợp phím cứng)"
                    className="w-full px-4 py-2.5 rounded-xl border border-white/[0.09] text-xs sm:text-sm bg-[#171916] text-[#F2F1EB] placeholder:text-[#A2A69D]/60 outline-none focus:border-[#B8C7A1] font-medium"
                  />

                  <textarea
                    rows={2}
                    value={st.instructions}
                    onChange={(e) => handleStepChange(idx, 'instructions', e.target.value)}
                    placeholder="Mô tả kỹ thuật chi tiết thao tác thực hiện..."
                    className="w-full px-4 py-2.5 rounded-xl border border-white/[0.09] text-xs sm:text-sm bg-[#171916] text-[#F2F1EB] placeholder:text-[#A2A69D]/60 outline-none focus:border-[#B8C7A1]"
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <input
                      type="text"
                      value={st.tip}
                      onChange={(e) => handleStepChange(idx, 'tip', e.target.value)}
                      placeholder="Mẹo nhỏ hữu ích (tùy chọn)"
                      className="px-3.5 py-2 rounded-lg border border-white/[0.08] text-xs bg-[#171916] text-[#F2F1EB] placeholder:text-[#A2A69D]/60 outline-none"
                    />
                    <input
                      type="text"
                      value={st.warning}
                      onChange={(e) => handleStepChange(idx, 'warning', e.target.value)}
                      placeholder="Lưu ý an toàn (tùy chọn)"
                      className="px-3.5 py-2 rounded-lg border border-white/[0.08] text-xs bg-[#171916] text-[#F2F1EB] placeholder:text-[#A2A69D]/60 outline-none"
                    />
                  </div>
                </div>
              ))}
            </div>
            {errors.steps && (
              <p className="text-xs text-[#E07A5F] mt-1.5 flex items-center gap-1 font-mono">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.steps}
              </p>
            )}
          </div>

          {/* Tools required */}
          <div>
            <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#A2A69D] mb-2">
              Dụng cụ thiết bị cần chuẩn bị (tùy chọn)
            </label>
            <input
              type="text"
              value={requiredTools}
              onChange={(e) => setRequiredTools(e.target.value)}
              placeholder="Ngăn cách bằng dấu phẩy: Cáp sạc chính hãng, Máy tính, Tua vít T5"
              className="w-full px-4 py-3 rounded-xl border border-white/[0.09] text-sm bg-[#1D211D] text-[#F2F1EB] placeholder:text-[#A2A69D]/60 outline-none focus:border-[#B8C7A1]"
            />
          </div>

          {/* Bottom Action */}
          <div className="pt-4 border-t border-white/[0.08] flex items-center justify-end gap-3 sticky bottom-0 bg-[#171916] py-3 z-20">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-white/[0.09] text-[#A2A69D] hover:text-[#F2F1EB] text-xs font-semibold hover:bg-[#1D211D] transition-colors"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#B8C7A1] hover:bg-[#c7d5b1] text-[#10110F] text-xs font-bold tracking-wide transition-all shadow-sm active:scale-[0.98]"
            >
              Lưu & Xuất bản giải pháp
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
