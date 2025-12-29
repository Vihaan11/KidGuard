
import React from 'react';
import { AnalysisSettings } from '../types';

interface SettingsPanelProps {
  settings: AnalysisSettings;
  onUpdate: (settings: AnalysisSettings) => void;
  onClose: () => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ settings, onUpdate, onClose }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    onUpdate({ ...settings, [name]: value });
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 p-6 rounded-2xl w-full max-auto max-w-md shadow-2xl border border-slate-700">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">Analysis Settings</h2>
          <button 
            onClick={onClose}
            id="btn_close_settings"
            className="text-slate-400 hover:text-white"
            aria-label="Close Settings"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Primary Target</label>
            <input
              type="text"
              name="primaryTarget"
              value={settings.primaryTarget}
              onChange={handleChange}
              id="input_target"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Age Range</label>
            <input
              type="text"
              name="ageRange"
              value={settings.ageRange}
              onChange={handleChange}
              id="input_age"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Special Activity Focus</label>
            <textarea
              name="activityFocus"
              rows={3}
              value={settings.activityFocus}
              onChange={handleChange}
              id="input_focus"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
            />
          </div>

          <div className="pt-4">
            <button
              onClick={onClose}
              id="btn_save_settings"
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition-colors shadow-lg shadow-blue-900/20"
            >
              Apply Configuration
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;
