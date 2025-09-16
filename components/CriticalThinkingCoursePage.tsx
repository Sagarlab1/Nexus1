import React, { useState, useEffect } from 'react';

const TOTAL_LESSONS = 9;
const STORAGE_KEY = 'pc_course_progress';

type CourseSection = 'intro' | 'week1' | 'week2' | 'week3' | 'books';

const CriticalThinkingCoursePage: React.FC = () => {
  const [activeSection, setActiveSection] = useState<CourseSection>('intro');
  const [progress, setProgress] = useState<Record<string, boolean>>({});

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      setProgress(saved);
    } catch (e) {
      console.warn('No se pudo cargar el progreso', e);
      setProgress({});
    }
  }, []);

  const saveProgress = (newProgress: Record<string, boolean>) => {
    setProgress(newProgress);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newProgress));
  };

  const handleCheckboxChange = (lessonId: string) => {
    const newProgress = { ...progress, [lessonId]: !progress[lessonId] };
    saveProgress(newProgress);
  };

  const completedLessons = Object.values(progress).filter(Boolean).length;
  const progressPct = TOTAL_LESSONS > 0 ? Math.round((completedLessons / TOTAL_LESSONS) * 100) : 0;
  
  const renderLessonRow = (id: string, title: string, duration: string) => (
    <div className="flex items-center justify-between p-2.5 rounded-lg bg-gray-800/50 mb-2">
      <label htmlFor={id} className="flex items-center cursor-pointer">
        <input
          type="checkbox"
          id={id}
          className="pc-course-checkbox mr-4 w-5 h-5"
          checked={progress[id] || false}
          onChange={() => handleCheckboxChange(id)}
        />
        <strong className="font-semibold text-white">{title}</strong>
      </label>
      <div className="text-gray-400 text-sm">{duration}</div>
    </div>
  );
  
  const renderSection = (id: CourseSection, title: string, lessons: JSX.Element[], prev?: CourseSection, next?: CourseSection, finalCTA?: JSX.Element) => (
    <section className={`pc-course-card ${activeSection === id ? '' : 'hidden'}`}>
      <h2 className="pc-course-title">{title}</h2>
      {lessons}
      {finalCTA}
      <div className="pc-course-nav">
        <button className="pc-course-btn alt" onClick={() => setActiveSection(prev || 'intro')}>← Volver</button>
        {next ? (
          <button className="pc-course-btn" onClick={() => setActiveSection(next)}>Siguiente Módulo →</button>
        ) : (
          <button className="pc-course-btn" disabled>Descargar Certificado (Próximamente)</button>
        )}
      </div>
    </section>
  );

  return (
    <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-lg shadow-lg shadow-black/20 flex flex-col h-full p-6 overflow-y-auto text-gray-200">
      <style>{`
        .pc-course-header { display:flex; align-items:center; gap:18px; margin-bottom: 24px; }
        .pc-course-logo { width:64px; height:64px; border-radius:14px; display:flex; align-items:center; justify-content:center; background:linear-gradient(135deg, #38bdf8, #0ea5e9); box-shadow:0 6px 20px rgba(12,18,30,0.6); font-weight: 800; font-size: 24px; color: white; }
        .pc-course-card { background: rgba(17, 24, 39, 0.5); border-radius:14px; padding:24px; border:1px solid rgba(255,255,255,0.1); margin-bottom:20px; }
        .pc-course-title { font-size:28px; font-weight: 800; margin:0 0 16px; color: white; }
        .pc-course-btn { background:#0ea5e9; border:none; padding:10px 14px; border-radius:10px; color:white; font-weight:600; cursor:pointer; box-shadow:0 4px 15px rgba(14, 165, 233, 0.2); transition: all 0.2s; }
        .pc-course-btn:hover:not(:disabled) { background: #0284c7; transform: translateY(-2px); }
        .pc-course-btn:disabled { background: #374151; cursor: not-allowed; }
        .pc-course-btn.alt { background:transparent; border:1px solid rgba(255,255,255,0.1); color:#9ca3af; }
        .pc-course-btn.alt:hover { background: rgba(255,255,255,0.05); }
        .pc-course-nav { display:flex; justify-content:space-between; margin-top:20px; }
        .pc-course-progress-bar { height:12px; background:rgba(255,255,255,0.04); border-radius:999px; overflow:hidden; margin-top:12px; }
        .pc-course-progress-bar > i { display:block; height:100%; background:linear-gradient(90deg,#06b6d4,#38bdf8); transition:width 400ms ease; }
        .pc-course-checkbox { accent-color: #0ea5e9; width: 1.25rem; height: 1.25rem; }
        .hidden { display: none; }
      `}</style>
      <div className="pc-course-container">
        <header className="pc-course-header">
            <div className="pc-course-logo">PC</div>
            <div>
                <h1 className="text-2xl font-extrabold m-0">Curso de Pensamiento Crítico</h1>
                <p className="m-0 text-gray-400">Un programa de 3 meses, con lecturas sugeridas y guardado automático.</p>
            </div>
        </header>
        <main>
            <section className={`pc-course-card ${activeSection === 'intro' ? '' : 'hidden'}`}>
                <h2 className="pc-course-title">Bienvenido a tu entrenamiento en Pensamiento Crítico</h2>
                <p className="text-gray-300">Este curso está diseñado para 3 meses. Cada módulo desbloquea nuevas lecciones, con lecturas y ejercicios. Tu progreso se guarda automáticamente. Haz clic para comenzar.</p>
                <button className="pc-course-btn mt-4" onClick={() => setActiveSection('week1')}>Comenzar Curso</button>
                <div className="pc-course-progress-bar mt-4"><i style={{width: `${progressPct}%`}}></i></div>
                <div className="mt-2 text-sm text-gray-400">Progreso: {progressPct}% ({completedLessons}/{TOTAL_LESSONS} lecciones)</div>
            </section>

            {renderSection('week1', 'Módulo 1 — Fundamentos', [
                renderLessonRow('w1l1', 'Qué es el pensamiento crítico', '8 min'),
                renderLessonRow('w1l2', 'Sesgos cognitivos', '12 min'),
                renderLessonRow('w1l3', 'El arte de preguntar', '10 min'),
            ], 'intro', 'week2')}
            
            {renderSection('week2', 'Módulo 2 — Herramientas', [
                renderLessonRow('w2l1', 'Preguntas socráticas', '9 min'),
                renderLessonRow('w2l2', 'Método científico aplicado', '14 min'),
                renderLessonRow('w2l3', 'Pensamiento lateral', '11 min'),
            ], 'week1', 'week3')}

            {renderSection('week3', 'Módulo 3 — Aplicaciones y Avanzado', [
                renderLessonRow('w3l1', 'Evaluar fuentes', '13 min'),
                renderLessonRow('w3l2', 'Detectar falacias', '12 min'),
                renderLessonRow('w3l3', 'Pensamiento sistémico y ética', '18 min'),
            ], 'week2', undefined, (
                <div className="pc-course-card mt-4 !border-cyan-500/50">
                    <strong className="text-white">Proyecto Final:</strong>
                    <p className="text-gray-300">Elabora un mapa de decisiones sobre un tema global aplicando todas las técnicas aprendidas. Preséntalo a Stratego para recibir feedback.</p>
                </div>
            ))}
        </main>
      </div>
    </div>
  );
};

export default CriticalThinkingCoursePage;