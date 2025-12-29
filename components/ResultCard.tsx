
import React from 'react';
import { AnalysisResult } from '../types';

interface ResultCardProps {
  result: AnalysisResult;
}

const ResultCard: React.FC<ResultCardProps> = ({ result }) => {
  return (
    <div className="w-full bg-slate-800/50 rounded-2xl border border-slate-700 overflow-hidden shadow-xl" id="analysis_result_container">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-slate-400 text-sm font-semibold uppercase tracking-wider">Camera Location</h3>
            <p className="text-2xl font-bold text-white" id="result_location">{result.location}</p>
          </div>
          <div className="bg-slate-700 px-3 py-1 rounded-full flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${result.targetDetected ? 'bg-green-500' : 'bg-red-500'}`}></span>
            <span className="text-xs font-medium text-slate-300">
              {result.targetDetected ? 'Target Detected' : 'No Target Found'}
            </span>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700/50">
            <h4 className="text-sm font-medium text-blue-400 mb-1">Activity Log</h4>
            <p className="text-slate-200" id="result_activity">{result.activityDescription}</p>
          </div>

          {result.isWatchingScreen && (
            <div className="flex items-center gap-3 bg-amber-500/10 p-4 rounded-xl border border-amber-500/30">
              <div className="bg-amber-500 p-2 rounded-lg">
                <svg className="w-5 h-5 text-amber-900" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="text-amber-200 font-bold text-sm">Screen Alert</p>
                <p className="text-amber-200/80 text-xs">Target is actively using a {result.screenDevice || 'device'}.</p>
              </div>
            </div>
          )}

          {result.additionalNotes && (
            <div className="text-xs text-slate-500 italic">
              Note: {result.additionalNotes}
            </div>
          )}
        </div>
      </div>
      
      <div className="bg-slate-700/30 px-6 py-3 border-t border-slate-700 flex justify-between items-center">
        <span className="text-xs text-slate-400">Analysis Confidence</span>
        <div className="w-24 h-1.5 bg-slate-700 rounded-full overflow-hidden">
          <div 
            className="h-full bg-blue-500 transition-all duration-1000" 
            style={{ width: `${result.confidence * 100}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default ResultCard;
