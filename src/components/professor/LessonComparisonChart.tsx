import React from 'react';
import { ResponsiveBar } from '@nivo/bar';
import { ModuleCompletionData } from '../../data/mockProfessorData';

interface ModuleCompletionChartProps {
    data: ModuleCompletionData[];
}

const COLORS: Record<string, string> = {
    'Completado': '#0B3064',
    'En curso': '#5574A7',
    'Sin empezar': '#C8D0DD',
};

export const ModuleCompletionChart: React.FC<ModuleCompletionChartProps> = ({ data }) => {
    const totalStudents = data[0] ? data[0].completed + data[0].inProgress + data[0].notStarted : 0;

    const chartData = data.map(d => ({
        module: d.moduleName,
        Completado: d.completed,
        'En curso': d.inProgress,
        'Sin empezar': d.notStarted,
    }));

    return (
        <div className="bg-white rounded-xl sm:rounded-2xl border border-[color:var(--finomik-blue-6)] shadow-sm p-4 sm:p-6 flex flex-col gap-3 sm:gap-4">
            <div>
                <h3 className="font-bold text-finomik-primary text-base sm:text-lg">Compleción de Módulos</h3>
                <p className="text-xs sm:text-sm text-[color:var(--finomik-blue-5)] mt-1">
                    Progreso de los {totalStudents} alumnos en cada módulo del programa
                </p>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-x-5 gap-y-1.5">
                {Object.entries(COLORS).map(([label, color]) => (
                    <div key={label} className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: color }} />
                        <span className="text-xs font-medium" style={{ color: '#0B3064' }}>{label}</span>
                    </div>
                ))}
            </div>

            {/* Chart */}
            <div className="w-full min-w-0" style={{ height: Math.max(260, data.length * 48) }}>
                {chartData.length > 0 ? (
                    <ResponsiveBar
                        data={chartData}
                        keys={['Completado', 'En curso', 'Sin empezar']}
                        indexBy="module"
                        layout="horizontal"
                        groupMode="stacked"
                        margin={{ top: 0, right: 32, bottom: 4, left: 160 }}
                        padding={0.3}
                        valueScale={{ type: 'linear', max: totalStudents }}
                        indexScale={{ type: 'band', round: true }}
                        colors={(bar) => COLORS[bar.id as string] || '#C8D0DD'}
                        borderRadius={3}
                        axisTop={null}
                        axisRight={null}
                        axisBottom={null}
                        axisLeft={{
                            tickSize: 0,
                            tickPadding: 12,
                        }}
                        enableGridX={false}
                        enableGridY={false}
                        enableLabel
                        label={(d) => d.value && d.value > 0 ? `${d.value}` : ''}
                        labelSkipWidth={18}
                        labelTextColor={(d) => {
                            if (d.id === 'Sin empezar') return '#0B3064';
                            return '#FFFFFF';
                        }}
                        isInteractive
                        role="application"
                        ariaLabel="Gráfico de compleción de módulos"
                        barAriaLabel={(e) => `${e.id}: ${e.formattedValue} alumnos en ${e.indexValue}`}
                        tooltip={({ id, value, indexValue, color }) => (
                            <div className="bg-white px-3 py-2 rounded-lg shadow-md text-xs border border-[color:var(--finomik-blue-6)] flex items-center gap-2">
                                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: color }} />
                                <span>
                                    <strong style={{ color: '#0B3064' }}>{indexValue}</strong>
                                    <br />
                                    {id}: {value} de {totalStudents} alumnos
                                </span>
                            </div>
                        )}
                        theme={{
                            labels: { text: { fontSize: 11, fontWeight: 700 } },
                            axis: {
                                ticks: {
                                    text: { fontSize: 12, fill: '#0B3064', fontWeight: 500 },
                                },
                            },
                        }}
                    />
                ) : (
                    <div className="flex items-center justify-center h-full text-[color:var(--finomik-blue-5)]">
                        No hay datos de módulos
                    </div>
                )}
            </div>
        </div>
    );
};
