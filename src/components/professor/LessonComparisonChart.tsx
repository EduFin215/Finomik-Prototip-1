import React, { useState } from 'react';
import { ResponsiveBar } from '@nivo/bar';
import { LessonDecisionData } from '../../data/mockProfessorData';

interface LessonComparisonChartProps {
    data: LessonDecisionData[];
}

export const LessonComparisonChart: React.FC<LessonComparisonChartProps> = ({ data }) => {
    const [selectedLesson, setSelectedLesson] = useState<string>(data[0]?.lessonId || '');

    const currentLessonData = data.find(l => l.lessonId === selectedLesson);

    const chartData = currentLessonData ? currentLessonData.decisions.map(d => ({
        decision: d.optionName,
        alumnos: d.studentCount,
    })) : [];

    return (
        <div className="bg-white rounded-xl sm:rounded-2xl border border-[color:var(--finomik-blue-6)] shadow-sm p-4 sm:p-5 h-full flex flex-col gap-3 sm:gap-4 min-h-0">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 mb-2 sm:mb-4">
                <h3 className="font-bold text-finomik-primary text-base sm:text-lg">Distribución de Decisiones</h3>
                <select
                    value={selectedLesson}
                    onChange={(e) => setSelectedLesson(e.target.value)}
                    className="bg-white border border-[color:var(--finomik-blue-6)] text-finomik-primary text-xs sm:text-sm rounded-lg focus:ring-2 focus:ring-[color:var(--finomik-blue-6)] focus:border-[color:var(--finomik-blue-5)] block w-full sm:w-auto p-2 outline-none min-w-0"
                >
                    {data.map(lesson => (
                        <option key={lesson.lessonId} value={lesson.lessonId}>
                            {lesson.lessonName}
                        </option>
                    ))}
                </select>
            </div>

            <div className="flex-1 w-full min-h-[180px] sm:min-h-[200px] min-w-0">
                {chartData.length > 0 ? (
                    <ResponsiveBar
                        data={chartData}
                        keys={['alumnos']}
                        indexBy="decision"
                        layout="vertical"
                        margin={{ top: 8, right: 24, bottom: 48, left: 48 }}
                        padding={0.3}
                        valueScale={{ type: 'linear' }}
                        indexScale={{ type: 'band', round: true }}
                        colors={['#5574A7']}
                        borderRadius={10}
                        axisTop={null}
                        axisRight={null}
                        axisBottom={{ tickSize: 0, tickPadding: 8 }}
                        axisLeft={{ tickSize: 0, tickPadding: 8 }}
                        enableGridX={false}
                        enableGridY={false}
                        enableLabel={false}
                        isInteractive
                        role="application"
                        ariaLabel="Gráfico de decisiones de clase"
                        barAriaLabel={(e) => `${e.id}: ${e.formattedValue} en decisión: ${e.indexValue}`}
                        tooltip={({ indexValue, value }) => (
                            <span className="bg-white px-2 py-1 rounded shadow text-xs border border-[color:var(--finomik-blue-6)]">
                                {indexValue}: {value} alumnos
                            </span>
                        )}
                    />
                ) : (
                    <div className="flex items-center justify-center h-full text-[color:var(--finomik-blue-5)]">
                        No hay datos para esta lección
                    </div>
                )}
            </div>
        </div>
    );
};
