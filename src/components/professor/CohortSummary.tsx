import React from 'react';
import { Users, TrendingUp, BookOpen, HeartPulse } from 'lucide-react';
import { ClassMetrics } from '../../data/mockProfessorData';

interface CohortSummaryProps {
    metrics: ClassMetrics;
}

export const CohortSummary: React.FC<CohortSummaryProps> = ({ metrics }) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">

            {/* Average Health */}
            <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 border shadow-sm border-[color:var(--finomik-blue-6)] flex items-center justify-between gap-3 min-w-0">
                <div className="min-w-0">
                    <p className="text-xs sm:text-sm text-[color:var(--finomik-blue-5)] font-medium mb-1">Salud Financiera Media</p>
                    <div className="flex items-baseline gap-2">
                        <h3 className="text-2xl sm:text-3xl font-bold text-finomik-primary">{metrics.averageHealth}</h3>
                        <span className="text-xs sm:text-sm font-medium text-finomik-success">/100</span>
                    </div>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-finomik-success/10 flex items-center justify-center shrink-0">
                    <HeartPulse className="text-finomik-success" size={20} />
                </div>
            </div>

            {/* Health Distribution */}
            <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 border shadow-sm border-[color:var(--finomik-blue-6)] min-w-0">
                <p className="text-xs sm:text-sm text-[color:var(--finomik-blue-5)] font-medium mb-2">Distribución de Salud</p>
                <div className="flex bg-[color:var(--finomik-blue-6)] rounded-full h-2.5 sm:h-3 overflow-hidden mb-2">
                    <div style={{ width: `${(metrics.healthDistribution.good / 30) * 100}%` }} className="bg-finomik-success" title="Buena" />
                    <div style={{ width: `${(metrics.healthDistribution.average / 30) * 100}%` }} className="bg-finomik-warning" title="Regular" />
                    <div style={{ width: `${(metrics.healthDistribution.poor / 30) * 100}%` }} className="bg-finomik-error" title="Crítica" />
                </div>
                <div className="flex flex-wrap justify-between gap-x-2 gap-y-1 text-[10px] sm:text-xs font-medium">
                    <span className="text-finomik-success">{metrics.healthDistribution.good} Buena</span>
                    <span className="text-finomik-warning">{metrics.healthDistribution.average} Regular</span>
                    <span className="text-finomik-error">{metrics.healthDistribution.poor} Crítica</span>
                </div>
            </div>

            {/* Progress */}
            <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 border shadow-sm border-[color:var(--finomik-blue-6)] flex items-center justify-between gap-3 min-w-0">
                <div className="min-w-0">
                    <p className="text-xs sm:text-sm text-[color:var(--finomik-blue-5)] font-medium mb-1">Al día con programa</p>
                    <div className="flex items-baseline gap-2">
                        <h3 className="text-2xl sm:text-3xl font-bold text-finomik-primary">{metrics.percentOnTrack}%</h3>
                    </div>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-finomik-blue-soft flex items-center justify-center shrink-0">
                    <TrendingUp className="text-[color:var(--finomik-blue-5)]" size={20} />
                </div>
            </div>

            {/* Current Session */}
            <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 border shadow-sm border-[color:var(--finomik-blue-6)] flex items-center justify-between gap-3 min-w-0">
                <div className="min-w-0">
                    <p className="text-xs sm:text-sm text-[color:var(--finomik-blue-5)] font-medium mb-1">Sesión Actual</p>
                    <h3 className="text-base sm:text-lg font-bold text-finomik-primary leading-tight mt-1 truncate">{metrics.currentSession}</h3>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-finomik-blue-soft flex items-center justify-center shrink-0">
                    <BookOpen className="text-[color:var(--finomik-blue-4)]" size={20} />
                </div>
            </div>

        </div>
    );
};
