import React, { useState } from 'react';
import { Search, ChevronDown, ChevronUp, AlertCircle } from 'lucide-react';
import { StudentStats } from '../../data/mockProfessorData';

interface StudentListProps {
    students: StudentStats[];
    onSelectStudent?: (student: StudentStats) => void;
}

type SortField = 'name' | 'healthScore' | 'reputation' | 'progress';

export const StudentList: React.FC<StudentListProps> = ({ students, onSelectStudent }) => {
    const [sortField, setSortField] = useState<SortField>('name');
    const [sortAsc, setSortAsc] = useState(true);
    const [filter, setFilter] = useState('');

    const handleSort = (field: SortField) => {
        if (sortField === field) {
            setSortAsc(!sortAsc);
        } else {
            setSortField(field);
            setSortAsc(true);
        }
    };

    const getHealthColorClass = (range: string) => {
        switch (range) {
            case 'good': return 'text-finomik-success bg-finomik-success/10 border-finomik-success/20';
            case 'average': return 'text-finomik-warning bg-finomik-warning/10 border-finomik-warning/20';
            case 'poor': return 'text-finomik-error bg-finomik-error/10 border-finomik-error/20';
            default: return 'text-[color:var(--finomik-blue-5)] bg-finomik-blue-soft border-[color:var(--finomik-blue-6)]';
        }
    };

    const sortedStudents = [...students].sort((a, b) => {
        let valA: string | number = '';
        let valB: string | number = '';

        switch (sortField) {
            case 'name':
                valA = a.name.toLowerCase();
                valB = b.name.toLowerCase();
                break;
            case 'healthScore':
                valA = a.healthScore;
                valB = b.healthScore;
                break;
            case 'reputation':
                valA = a.reputation;
                valB = b.reputation;
                break;
            case 'progress':
                valA = a.progress.currentLesson;
                valB = b.progress.currentLesson;
                break;
        }

        if (valA < valB) return sortAsc ? -1 : 1;
        if (valA > valB) return sortAsc ? 1 : -1;
        return 0;
    });

    const filteredStudents = sortedStudents.filter(s =>
        s.name.toLowerCase().includes(filter.toLowerCase())
    );

    const SortIcon = ({ field }: { field: SortField }) => {
        if (sortField !== field) return <ChevronDown size={14} className="opacity-0 group-hover:opacity-50" />;
        return sortAsc ? <ChevronUp size={14} className="text-finomik-primary" /> : <ChevronDown size={14} className="text-finomik-primary" />;
    };

    return (
        <div className="bg-white rounded-xl sm:rounded-2xl border border-[color:var(--finomik-blue-6)] shadow-sm flex flex-col min-h-[320px] sm:min-h-[400px] overflow-hidden">
            <div className="p-3 sm:p-4 border-b border-[color:var(--finomik-blue-6)] flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                <h3 className="font-bold text-finomik-primary text-base sm:text-lg shrink-0">Alumnos ({students.length})</h3>
                <div className="relative w-full sm:max-w-xs sm:flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[color:var(--finomik-blue-5)] shrink-0" size={16} />
                    <input
                        type="text"
                        placeholder="Buscar alumno..."
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 bg-white border border-[color:var(--finomik-blue-6)] rounded-lg text-sm text-finomik-primary focus:outline-none focus:ring-2 focus:ring-[color:var(--finomik-blue-6)]"
                    />
                </div>
            </div>

            <div className="overflow-x-auto overflow-y-auto flex-1 min-h-0">
                <table className="w-full text-left text-xs sm:text-sm whitespace-nowrap min-w-[500px]">
                    <thead className="bg-finomik-blue-soft/30 text-[color:var(--finomik-blue-5)] font-medium border-b border-[color:var(--finomik-blue-6)] sticky top-0 z-10">
                        <tr>
                            <th className="px-3 sm:px-6 py-2 sm:py-3 cursor-pointer group" onClick={() => handleSort('name')}>
                                <div className="flex items-center gap-1">Nombre <SortIcon field="name" /></div>
                            </th>
                            <th className="px-3 sm:px-6 py-2 sm:py-3 cursor-pointer group" onClick={() => handleSort('progress')}>
                                <div className="flex items-center gap-1">Progreso <SortIcon field="progress" /></div>
                            </th>
                            <th className="px-3 sm:px-6 py-2 sm:py-3 cursor-pointer group hidden md:table-cell" onClick={() => handleSort('healthScore')}>
                                <div className="flex items-center gap-1">Salud <SortIcon field="healthScore" /></div>
                            </th>
                            <th className="px-3 sm:px-6 py-2 sm:py-3 cursor-pointer group hidden md:table-cell" onClick={() => handleSort('reputation')}>
                                <div className="flex items-center gap-1">Rep. <SortIcon field="reputation" /></div>
                            </th>
                            <th className="px-3 sm:px-6 py-2 sm:py-3 text-center">Alertas</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[color:var(--finomik-blue-6)]">
                        {filteredStudents.length > 0 ? (
                            filteredStudents.map(student => (
                                <tr
                                    key={student.id}
                                    className="hover:bg-finomik-blue-soft/30 transition-colors cursor-pointer"
                                    onClick={() => onSelectStudent?.(student)}
                                >
                                    <td className="px-3 sm:px-6 py-3 sm:py-4 font-medium text-finomik-primary max-w-[120px] sm:max-w-none truncate">{student.name}</td>
                                    <td className="px-3 sm:px-6 py-3 sm:py-4">
                                        <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
                                            <span className="font-semibold">{student.progress.currentLesson}</span>
                                            <span className="text-[color:var(--finomik-blue-5)]">/ {student.progress.totalLessons}</span>
                                            {!student.progress.onTrack && (
                                                <span className="text-[10px] sm:text-xs bg-finomik-error-soft text-finomik-error px-1.5 sm:px-2 py-0.5 rounded-full font-medium border border-finomik-error/20">Retraso</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-3 sm:px-6 py-3 sm:py-4 hidden md:table-cell">
                                        <span className={`inline-flex items-center justify-center px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold border ${getHealthColorClass(student.healthRange)}`}>
                                            {student.healthScore}
                                        </span>
                                    </td>
                                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-[color:var(--finomik-blue-5)] hidden md:table-cell">{student.reputation} ⭐</td>
                                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-center">
                                        {student.activeAlertsCount > 0 ? (
                                            <span className="inline-flex items-center justify-center gap-0.5 sm:gap-1 bg-finomik-error-soft text-finomik-error px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold border border-finomik-error/20">
                                                <AlertCircle size={12} /> {student.activeAlertsCount}
                                            </span>
                                        ) : (
                                            <span className="text-[color:var(--finomik-blue-6)]">-</span>
                                        )}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="px-4 sm:px-6 py-6 sm:py-8 text-center text-[color:var(--finomik-blue-5)] text-sm">
                                    No se encontraron alumnos
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
