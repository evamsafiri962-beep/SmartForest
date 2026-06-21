import React, { useState } from 'react';
import axios from 'axios';
import { FileText, Download, Calendar, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';

const AdminReports = () => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generateReport = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get('http://localhost:3000/api/admin/reports');
      setReport(res.data);
    } catch (err) {
      setError('Failed to generate report. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
        <FileText className="w-6 h-6 text-emerald-400" />
        Organization Reports
      </h1>

      <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 mb-6">
        <button
          onClick={generateReport}
          disabled={loading}
          className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white px-6 py-2 rounded-lg transition-colors flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          {loading ? 'Generating...' : 'Generate 30‑Day Report'}
        </button>
        <p className="text-xs text-gray-500 mt-2">Report covers all forests managed by the organization.</p>
      </div>

      {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-sm mb-4">{error}</div>}

      {report && (
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-gray-400" />
            {report.period}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-800/30 rounded-lg p-4">
              <div className="flex items-center gap-2"><AlertTriangle className="w-5 h-5 text-red-400" /><span className="text-gray-400">Total Incidents</span></div>
              <p className="text-2xl font-bold text-white">{report.totalIncidents}</p>
            </div>
            <div className="bg-gray-800/30 rounded-lg p-4">
              <div className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-green-400" /><span className="text-gray-400">Resolved</span></div>
              <p className="text-2xl font-bold text-white">{report.resolved}</p>
            </div>
            <div className="bg-gray-800/30 rounded-lg p-4">
              <div className="flex items-center gap-2"><TrendingUp className="w-5 h-5 text-blue-400" /><span className="text-gray-400">Resolution Rate</span></div>
              <p className="text-2xl font-bold text-white">{report.totalIncidents > 0 ? ((report.resolved / report.totalIncidents) * 100).toFixed(1) : 0}%</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-semibold text-gray-300 mb-2">By Severity</h4>
              <ul className="space-y-1 text-sm">
                <li className="flex justify-between text-gray-400"><span>Critical</span><span>{report.bySeverity.critical}</span></li>
                <li className="flex justify-between text-gray-400"><span>High</span><span>{report.bySeverity.high}</span></li>
                <li className="flex justify-between text-gray-400"><span>Medium</span><span>{report.bySeverity.medium}</span></li>
                <li className="flex justify-between text-gray-400"><span>Low</span><span>{report.bySeverity.low}</span></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-300 mb-2">By Forest</h4>
              <ul className="space-y-1 text-sm">
                {Object.entries(report.byForest).map(([name, count]) => (
                  <li key={name} className="flex justify-between text-gray-400"><span>{name}</span><span>{count}</span></li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminReports;
