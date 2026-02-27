import React from 'react';
import { AlertCircle, FileWarning, Info } from 'lucide-react';
import { Alert } from '../../data/mockProfessorData';

interface AlertsPanelProps {
    alerts: Alert[];
}

export const AlertsPanel: React.FC<AlertsPanelProps> = ({ alerts }) => {
    const getIcon = (severity: string) => {
        switch (severity) {
            case 'critical': return <AlertCircle size={20} className="text-finomik-error" />;
            case 'attention': return <FileWarning size={20} className="text-finomik-warning" />;
            default: return <Info size={20} className="text-finomik-blue-5" />;
        }
    };

    const getBgClass = (severity: string) => {
        switch (severity) {
            case 'critical': return 'bg-finomik-error-soft border border-finomik-error/20';
            case 'attention': return 'bg-finomik-warning-soft border border-finomik-warning/20';
            default: return 'bg-finomik-blue-soft/30 border border-[color:var(--finomik-blue-6)]';
        }
    };

    return (
        <div className="bg-white rounded-xl sm:rounded-2xl border border-[color:var(--finomik-blue-6)] shadow-sm flex flex-col h-full min-h-0 overflow-hidden">
            <div className="px-3 sm:px-5 py-3 sm:py-4 border-b border-[color:var(--finomik-blue-6)] bg-finomik-blue-soft/30 flex items-center justify-between sticky top-0 z-10 shrink-0">
                <h3 className="font-bold text-finomik-primary text-sm sm:text-base flex items-center gap-2 min-w-0">
                    <AlertCircle size={16} className="shrink-0 sm:w-[18px] sm:h-[18px]" />
                    <span className="truncate">Alertas ({alerts.length})</span>
                </h3>
            </div>
            <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2 sm:space-y-3 min-h-0 max-h-[360px] sm:max-h-[400px]">
                {alerts.length === 0 ? (
                    <div className="text-center text-[color:var(--finomik-blue-5)] py-6 sm:py-8 text-sm">No hay alertas activas</div>
                ) : (
                    alerts.map(alert => (
                        <div key={alert.id} className={`p-3 sm:p-4 rounded-lg sm:rounded-xl border flex items-start gap-2 sm:gap-3 min-w-0 ${getBgClass(alert.severity)}`}>
                            <div className="mt-0.5 shrink-0">{getIcon(alert.severity)}</div>
                            <div className="flex-1 min-w-0">
                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-0.5 mb-1">
                                    <span className="font-semibold text-xs sm:text-sm text-finomik-primary truncate">{alert.studentName}</span>
                                    <span className="text-[10px] sm:text-xs text-[color:var(--finomik-blue-5)] shrink-0">{alert.date}</span>
                                </div>
                                <p className="text-xs sm:text-sm text-[color:var(--finomik-blue-2)] break-words">{alert.description}</p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};
