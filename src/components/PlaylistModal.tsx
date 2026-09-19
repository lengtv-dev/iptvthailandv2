import React, { useState } from 'react';
import { 
  X, Upload, Link, FileText, Plus, 
  RotateCcw, Download, Check, AlertCircle 
} from 'lucide-react';
import { ChannelItem } from '../types';
import { parseAnyPlaylist } from '../utils/playlistParser';
import { getInitialChannels } from '../data/channels';

interface PlaylistModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportChannels: (newChannels: ChannelItem[], append: boolean) => void;
  currentChannels: ChannelItem[];
  onResetToDefault: () => void;
}

export const PlaylistModal: React.FC<PlaylistModalProps> = ({
  isOpen,
  onClose,
  onImportChannels,
  currentChannels,
  onResetToDefault
}) => {
  const [activeTab, setActiveTab] = useState<'url' | 'text' | 'file' | 'manual'>('url');
  const [playlistUrl, setPlaylistUrl] = useState<string>('');
  const [playlistText, setPlaylistText] = useState<string>('');
  const [appendMode, setAppendMode] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Manual single channel fields
  const [manualTitle, setManualTitle] = useState<string>('');
  const [manualUrl, setManualUrl] = useState<string>('');
  const [manualNumber, setManualNumber] = useState<string>('');
  const [manualLogo, setManualLogo] = useState<string>('');
  const [manualCategory, setManualCategory] = useState<string>('livedigital');

  if (!isOpen) return null;

  const handleImportUrl = async () => {
    if (!playlistUrl.trim()) return;
    setLoading(true);
    setStatusMsg(null);
    try {
      // Use proxy if needed to fetch playlist to avoid CORS
      const targetUrl = playlistUrl.trim();
      const res = await fetch(`/api/proxy?url=${encodeURIComponent(targetUrl)}`);
      if (!res.ok) {
        throw new Error(`โหลดไม่สำเร็จ (Status ${res.status})`);
      }
      const text = await res.text();
      const parsed = parseAnyPlaylist(text);
      if (parsed.length === 0) {
        throw new Error('ไม่พบช่องที่สามารถเล่นได้ในไฟล์เพลย์ลิสต์นี้');
      }
      onImportChannels(parsed, appendMode);
      setStatusMsg({ type: 'success', text: `นำเข้าสำเร็จทั้งหมด ${parsed.length} ช่อง!` });
      setTimeout(onClose, 1200);
    } catch (err: any) {
      setStatusMsg({ type: 'error', text: err.message || 'เกิดข้อผิดพลาดในการโหลด URL' });
    } finally {
      setLoading(false);
    }
  };

  const handleImportText = () => {
    if (!playlistText.trim()) return;
    try {
      const parsed = parseAnyPlaylist(playlistText.trim());
      if (parsed.length === 0) {
        throw new Error('ไม่สามารถอ่านข้อมูลช่องจากข้อความที่ระบุ');
      }
      onImportChannels(parsed, appendMode);
      setStatusMsg({ type: 'success', text: `นำเข้าสำเร็จทั้งหมด ${parsed.length} ช่อง!` });
      setTimeout(onClose, 1200);
    } catch (err: any) {
      setStatusMsg({ type: 'error', text: err.message });
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const parsed = parseAnyPlaylist(content, file.name);
        if (parsed.length === 0) {
          setStatusMsg({ type: 'error', text: 'ไม่พบช่องรายการในไฟล์ที่อัปโหลด' });
        } else {
          onImportChannels(parsed, appendMode);
          setStatusMsg({ type: 'success', text: `นำเข้าสำเร็จ ${parsed.length} ช่องจาก ${file.name}` });
          setTimeout(onClose, 1200);
        }
      }
    };
    reader.onerror = () => {
      setStatusMsg({ type: 'error', text: 'เกิดข้อผิดพลาดในการอ่านไฟล์' });
    };
    reader.readAsText(file);
  };

  const handleAddManualChannel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualTitle || !manualUrl) {
      setStatusMsg({ type: 'error', text: 'กรุณากรอกชื่อช่องและ URL สตรีม' });
      return;
    }

    const id = `custom-${Date.now()}`;
    const newChannel: ChannelItem = {
      id,
      cid: id,
      tid: id,
      title: manualTitle.trim(),
      remotetv: manualNumber.trim() || String(currentChannels.length + 1),
      logo: manualLogo.trim() || '',
      favorite: false,
      category: manualCategory,
      streamUrl: manualUrl.trim(),
      custom: true
    };

    onImportChannels([newChannel], true);
    setStatusMsg({ type: 'success', text: `เพิ่มช่อง "${manualTitle}" สำเร็จ!` });
    setManualTitle('');
    setManualUrl('');
    setManualNumber('');
    setManualLogo('');
    setTimeout(onClose, 1000);
  };

  const handleExportM3U = () => {
    let content = '#EXTM3U\n';
    currentChannels.forEach((ch) => {
      const tvgLogo = ch.logo ? ` tvg-logo="${ch.logo}"` : '';
      const tvgChno = ch.remotetv ? ` tvg-chno="${ch.remotetv}"` : '';
      const group = ch.category ? ` group-title="${ch.category}"` : '';
      content += `#EXTINF:-1${tvgChno}${tvgLogo}${group},${ch.title}\n`;
      content += `${ch.streamUrl || `https://s.okwin321.ai/ngz168/${ch.cid}/playlist.m3u8`}\n`;
    });

    const blob = new Blob([content], { type: 'audio/x-mpegurl;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'playlist_channels.m3u';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-neutral-900 border border-neutral-800 w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-fadeIn">
        {/* Header */}
        <div className="p-4 border-b border-neutral-800 flex items-center justify-between bg-neutral-950">
          <div>
            <h3 className="font-bold text-white text-base">จัดการเพลย์ลิสต์ (M3U / W3U / TXT / JSON)</h3>
            <p className="text-xs text-neutral-400 mt-0.5">เพิ่มช่องของคุณเอง รองรับ M3U8, TS, MP4, MPD และ HLS</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-neutral-800 bg-neutral-950/50 p-2 gap-1 text-xs">
          <button
            onClick={() => setActiveTab('url')}
            className={`flex-1 py-2 rounded-lg font-medium transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'url' ? 'bg-red-600 text-white shadow' : 'text-neutral-400 hover:text-white hover:bg-neutral-850'
            }`}
          >
            <Link className="w-3.5 h-3.5" /> ลิงก์ URL
          </button>
          <button
            onClick={() => setActiveTab('file')}
            className={`flex-1 py-2 rounded-lg font-medium transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'file' ? 'bg-red-600 text-white shadow' : 'text-neutral-400 hover:text-white hover:bg-neutral-850'
            }`}
          >
            <Upload className="w-3.5 h-3.5" /> อัปโหลดไฟล์
          </button>
          <button
            onClick={() => setActiveTab('text')}
            className={`flex-1 py-2 rounded-lg font-medium transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'text' ? 'bg-red-600 text-white shadow' : 'text-neutral-400 hover:text-white hover:bg-neutral-850'
            }`}
          >
            <FileText className="w-3.5 h-3.5" /> วางโค้ด / ข้อความ
          </button>
          <button
            onClick={() => setActiveTab('manual')}
            className={`flex-1 py-2 rounded-lg font-medium transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'manual' ? 'bg-red-600 text-white shadow' : 'text-neutral-400 hover:text-white hover:bg-neutral-850'
            }`}
          >
            <Plus className="w-3.5 h-3.5" /> เพิ่มช่องเดี่ยว
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-5 flex-1 overflow-y-auto space-y-4">
          {/* Status Alert */}
          {statusMsg && (
            <div className={`p-3 rounded-xl text-xs flex items-center gap-2 border ${
              statusMsg.type === 'success' 
                ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300' 
                : 'bg-red-950/60 border-red-500/50 text-red-300'
            }`}>
              {statusMsg.type === 'success' ? <Check className="w-4 h-4 text-emerald-400" /> : <AlertCircle className="w-4 h-4 text-red-400" />}
              <span>{statusMsg.text}</span>
            </div>
          )}

          {/* TAB: URL Import */}
          {activeTab === 'url' && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  กรอก URL เพลย์ลิสต์ (.m3u, .m3u8, .json, .txt, .w3u):
                </label>
                <input
                  type="url"
                  placeholder="https://example.com/playlist.m3u"
                  value={playlistUrl}
                  onChange={(e) => setPlaylistUrl(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-hidden focus:border-red-500"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="append-url"
                  checked={appendMode}
                  onChange={(e) => setAppendMode(e.target.checked)}
                  className="rounded accent-red-600 cursor-pointer"
                />
                <label htmlFor="append-url" className="text-xs text-neutral-400 cursor-pointer">
                  เพิ่มต่อท้ายรายการเดิม (ไม่ต้องลบช่องเดิม)
                </label>
              </div>

              <button
                onClick={handleImportUrl}
                disabled={loading || !playlistUrl.trim()}
                className="w-full py-2.5 bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white rounded-xl text-sm font-semibold transition-colors cursor-pointer"
              >
                {loading ? 'กำลังดาวน์โหลดและแยกช่อง...' : 'นำเข้าเพลย์ลิสต์'}
              </button>
            </div>
          )}

          {/* TAB: File Upload */}
          {activeTab === 'file' && (
            <div className="space-y-3">
              <label className="border-2 border-dashed border-neutral-700 hover:border-red-500 rounded-2xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer bg-neutral-950/40 hover:bg-neutral-950 transition-all">
                <Upload className="w-8 h-8 text-neutral-400" />
                <span className="text-sm font-semibold text-neutral-200">เลือกไฟล์เพลย์ลิสต์จากเครื่อง</span>
                <span className="text-xs text-neutral-500">รองรับ .m3u, .m3u8, .w3u, .json, .txt</span>
                <input
                  type="file"
                  accept=".m3u,.m3u8,.json,.txt,.w3u"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="append-file"
                  checked={appendMode}
                  onChange={(e) => setAppendMode(e.target.checked)}
                  className="rounded accent-red-600 cursor-pointer"
                />
                <label htmlFor="append-file" className="text-xs text-neutral-400 cursor-pointer">
                  เพิ่มต่อท้ายรายการเดิม (ไม่ต้องลบช่องเดิม)
                </label>
              </div>
            </div>
          )}

          {/* TAB: Raw Text Paste */}
          {activeTab === 'text' && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  วางเนื้อหาเพลย์ลิสต์ (M3U, Wiseplay W3U JSON, หรือ TXT เช่น ชื่อช่อง,URL):
                </label>
                <textarea
                  rows={6}
                  placeholder={`#EXTM3U\n#EXTINF:-1,ช่อง 3 HD\nhttps://s.okwin321.ai/ngz168/7348/playlist.m3u8`}
                  value={playlistText}
                  onChange={(e) => setPlaylistText(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl p-3 text-xs font-mono text-white focus:outline-hidden focus:border-red-500 resize-none"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="append-text"
                  checked={appendMode}
                  onChange={(e) => setAppendMode(e.target.checked)}
                  className="rounded accent-red-600 cursor-pointer"
                />
                <label htmlFor="append-text" className="text-xs text-neutral-400 cursor-pointer">
                  เพิ่มต่อท้ายรายการเดิม (ไม่ต้องลบช่องเดิม)
                </label>
              </div>

              <button
                onClick={handleImportText}
                disabled={!playlistText.trim()}
                className="w-full py-2.5 bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white rounded-xl text-sm font-semibold transition-colors cursor-pointer"
              >
                บันทึกและนำเข้า
              </button>
            </div>
          )}

          {/* TAB: Manual Single Channel Add */}
          {activeTab === 'manual' && (
            <form onSubmit={handleAddManualChannel} className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs text-neutral-400 mb-1">ชื่อช่อง *</label>
                  <input
                    type="text"
                    required
                    placeholder="เช่น ช่อง 3 HD"
                    value={manualTitle}
                    onChange={(e) => setManualTitle(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-hidden focus:border-red-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-neutral-400 mb-1">เลขรีโมท (ถ้ามี)</label>
                  <input
                    type="text"
                    placeholder="เช่น 33"
                    value={manualNumber}
                    onChange={(e) => setManualNumber(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-hidden focus:border-red-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-neutral-400 mb-1">Stream URL (HLS / M3U8 / TS / MP4) *</label>
                <input
                  type="url"
                  required
                  placeholder="https://s.okwin321.ai/ngz168/7348/playlist.m3u8"
                  value={manualUrl}
                  onChange={(e) => setManualUrl(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-hidden focus:border-red-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs text-neutral-400 mb-1">หมวดหมู่</label>
                  <select
                    value={manualCategory}
                    onChange={(e) => setManualCategory(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-hidden focus:border-red-500"
                  >
                    <option value="livedigital">ดิจิตอลทีวี</option>
                    <option value="livesport">กีฬา</option>
                    <option value="liveentertain">บันเทิง</option>
                    <option value="livenews">ข่าว</option>
                    <option value="livecartoon">การ์ตูน</option>
                    <option value="livesara">สาระความรู้</option>
                    <option value="livethai">ไทย</option>
                    <option value="liveinter">ต่างประเทศ</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-neutral-400 mb-1">URL โลโก้ช่อง (ถ้ามี)</label>
                  <input
                    type="url"
                    placeholder="https://.../logo.png"
                    value={manualLogo}
                    onChange={(e) => setManualLogo(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-hidden focus:border-red-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-xl text-sm font-semibold transition-colors cursor-pointer"
              >
                เพิ่มช่องนี้
              </button>
            </form>
          )}

          {/* Preset & Export Options */}
          <div className="pt-3 border-t border-neutral-800 flex items-center justify-between text-xs">
            <button
              onClick={() => {
                if (confirm('คุณต้องการรีเซ็ตช่องกลับเป็นค่าเริ่มต้น (ช่องไทยและกีฬา 85+ ช่อง) หรือไม่?')) {
                  onResetToDefault();
                  setStatusMsg({ type: 'success', text: 'รีเซ็ตกลับเป็นช่องเริ่มต้นเรียบร้อยแล้ว' });
                }
              }}
              className="text-neutral-400 hover:text-red-400 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" /> คืนค่าช่องเริ่มต้น (85+ ช่อง)
            </button>

            <button
              onClick={handleExportM3U}
              className="text-neutral-400 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" /> ดาวน์โหลด M3U
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
