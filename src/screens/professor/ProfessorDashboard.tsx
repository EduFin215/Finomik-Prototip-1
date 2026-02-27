import React from 'react';
import { motion } from 'motion/react';
import { Users, AlertCircle, BookOpen, TrendingUp, ChevronRight } from 'lucide-react';
import { mockClassMetrics, mockAlerts, mockStudents } from '../../data/mockProfessorData';

interface DashboardProps {
    onNavigate: (view: 'cohort' | 'alerts') => void;
}

export const ProfessorDashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 sm:space-y-6 lg:space-y-8">
            {/* Header Section */}
            <div className="bg-finomik-gradient-strong rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 text-white relative overflow-hidden shadow-lg">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16" aria-hidden />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-finomik-blue-4/20 rounded-full blur-2xl -ml-12 -mb-12" aria-hidden />

                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 sm:gap-6">
                    <div className="min-w-0">
                        <h2 className="heading-1 text-xl sm:text-2xl md:text-3xl font-black mb-2">¡Hola, Profesor!</h2>
                        <p className="text-white/90 text-sm sm:text-base md:text-lg max-w-xl">
                            Aquí tienes un resumen rápido del estado de tus clases y alumnos.
                        </p>
                    </div>
                </div>
            </div>

            {/* Quick Stats overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <div
                    onClick={() => onNavigate('cohort')}
                    className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 border border-[color:var(--finomik-blue-6)] shadow-sm hover:shadow-md hover:border-finomik-blue-4 transition-all cursor-pointer group"
                >
                    <div className="flex justify-between items-start mb-3 sm:mb-4">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-finomik-blue-soft rounded-xl flex items-center justify-center text-finomik-primary group-hover:scale-110 transition-transform shrink-0">
                            <Users size={20} className="sm:w-6 sm:h-6" />
                        </div>
                        <ChevronRight className="text-gray-300 group-hover:text-finomik-primary transition-colors shrink-0" size={20} />
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-bold text-finomik-primary mb-1">30</h3>
                    <p className="text-xs sm:text-sm font-medium text-finomik-blue-5">Alumnos Totales</p>
                </div>

                <div
                    onClick={() => onNavigate('cohort')}
                    className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 border border-[color:var(--finomik-blue-6)] shadow-sm hover:shadow-md hover:border-finomik-success transition-all cursor-pointer group"
                >
                    <div className="flex justify-between items-start mb-3 sm:mb-4">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-finomik-success/10 rounded-xl flex items-center justify-center text-finomik-success group-hover:scale-110 transition-transform shrink-0">
                            <TrendingUp size={20} className="sm:w-6 sm:h-6" />
                        </div>
                        <ChevronRight className="text-gray-300 group-hover:text-finomik-success transition-colors shrink-0" size={20} />
                    </div>
                    <div className="flex items-baseline gap-2 mb-1">
                        <h3 className="text-2xl sm:text-3xl font-bold text-finomik-primary">
                            {mockClassMetrics.healthDistribution.poor}
                        </h3>
                    </div>
                    <p className="text-xs sm:text-sm font-medium text-finomik-blue-5">Alumnos en riesgo</p>
                </div>

                <div
                    onClick={() => onNavigate('alerts')}
                    className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 border border-[color:var(--finomik-blue-6)] shadow-sm hover:shadow-md hover:border-finomik-error transition-all cursor-pointer group"
                >
                    <div className="flex justify-between items-start mb-3 sm:mb-4">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-finomik-error/10 rounded-xl flex items-center justify-center text-finomik-error group-hover:scale-110 transition-transform shrink-0">
                            <AlertCircle size={20} className="sm:w-6 sm:h-6" />
                        </div>
                        <ChevronRight className="text-gray-300 group-hover:text-finomik-error transition-colors shrink-0" size={20} />
                    </div>
                    <div className="flex items-baseline gap-2 mb-1 flex-wrap">
                        <h3 className="text-2xl sm:text-3xl font-bold text-finomik-primary">
                            {mockAlerts.length}
                        </h3>
                        <span className="text-xs bg-finomik-error text-white px-2 py-0.5 rounded-full font-bold">
                            Activas
                        </span>
                    </div>
                    <p className="text-xs sm:text-sm font-medium text-finomik-blue-5">Alertas de alumnos</p>
                </div>

                <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 border border-[color:var(--finomik-blue-6)] shadow-sm pointer-events-none opacity-80">
                    <div className="flex justify-between items-start mb-3 sm:mb-4">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-finomik-blue-soft rounded-xl flex items-center justify-center text-[color:var(--finomik-blue-4)] shrink-0">
                            <BookOpen size={20} className="sm:w-6 sm:h-6" />
                        </div>
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-finomik-primary mb-1 truncate">
                        {Math.round(
                            mockStudents.reduce((acc, s) => acc + s.reputation, 0) / mockStudents.length
                        )}
                    </h3>
                    <p className="text-xs sm:text-sm font-medium text-finomik-blue-5">Reputación media de la clase</p>
                </div>
            </div>

            {/* Quick Actions & Recent Info */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                <div className="bg-white p-4 sm:p-5 md:p-6 rounded-xl sm:rounded-2xl border border-[color:var(--finomik-blue-6)] shadow-sm">
                    <h3 className="heading-2 text-lg sm:text-xl text-finomik-primary mb-3 sm:mb-4">Accesos Directos</h3>
                    <div className="space-y-2 sm:space-y-3">
                        <button onClick={() => onNavigate('cohort')} className="w-full flex items-center justify-between gap-3 p-3 sm:p-4 bg-finomik-blue-soft/30 rounded-xl hover:bg-finomik-blue-soft/50 transition-colors border border-[color:var(--finomik-blue-6)] text-left">
                            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                                <Users className="text-finomik-primary shrink-0" size={20} />
                                <span className="font-semibold text-finomik-primary text-sm sm:text-base truncate">Ver Estado de Clase</span>
                            </div>
                            <ChevronRight size={18} className="text-[color:var(--finomik-blue-5)] shrink-0" />
                        </button>
                        <button onClick={() => onNavigate('alerts')} className="w-full flex items-center justify-between gap-3 p-3 sm:p-4 bg-finomik-blue-soft/30 rounded-xl hover:bg-finomik-blue-soft/50 transition-colors border border-[color:var(--finomik-blue-6)] text-left">
                            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                                <AlertCircle className="text-finomik-error shrink-0" size={20} />
                                <span className="font-semibold text-finomik-primary text-sm sm:text-base truncate">Revisar Alertas Críticas</span>
                            </div>
                            <ChevronRight size={18} className="text-[color:var(--finomik-blue-5)] shrink-0" />
                        </button>
                    </div>
                </div>

                <div className="bg-white p-4 sm:p-5 md:p-6 rounded-xl sm:rounded-2xl border border-[color:var(--finomik-blue-6)] shadow-sm">
                    <h3 className="heading-2 text-lg sm:text-xl text-finomik-primary mb-3 sm:mb-4">Información de Finomik</h3>
                    <div className="bg-finomik-blue-soft/30 p-3 sm:p-4 rounded-xl border border-[color:var(--finomik-blue-6)] flex items-start gap-3 sm:gap-4">
                        <div className="mt-1 text-finomik-blue-1 shrink-0">
                            <BookOpen size={22} className="sm:w-6 sm:h-6" />
                        </div>
                        <div className="min-w-0">
                            <h4 className="font-bold text-finomik-primary mb-1 text-sm sm:text-base">Guía del Profesor</h4>
                            <p className="text-xs sm:text-sm text-[color:var(--finomik-blue-5)] mb-2 sm:mb-3">Aprende a interpretar las métricas y la salud financiera para ayudar mejor a tus alumnos.</p>
                            <button className="text-xs sm:text-sm font-bold text-finomik-blue-1 hover:text-finomik-primary transition-colors">
                                Leer Guía Completa →
                            </button>
                        </div>
                    </div>
                </div>
            </div>

        </motion.div>
    );
};
