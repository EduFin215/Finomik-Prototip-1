import React from 'react';
import { motion } from 'motion/react';
import { AlertsPanel } from '../../components/professor/AlertsPanel';
import { mockAlerts } from '../../data/mockProfessorData';

export const AlertsView: React.FC = () => {
    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 sm:space-y-6">
            <div className="bg-white p-3 sm:p-4 rounded-xl border border-[color:var(--finomik-blue-6)] shadow-sm">
                <div className="min-w-0">
                    <h2 className="heading-2 text-lg sm:text-xl text-finomik-primary">Centro de Alertas</h2>
                    <p className="text-xs sm:text-sm text-[color:var(--finomik-blue-5)]">Gestión de alertas críticas, advertencias y avisos de la clase.</p>
                </div>
            </div>

            {/* Single card: AlertsPanel provides the card styling to avoid double frame */}
            <AlertsPanel alerts={mockAlerts} />
        </motion.div>
    );
};
