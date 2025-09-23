import React, { useState, useEffect } from 'react';

const TOTAL_LESSONS = 9;
const STORAGE_KEY = 'creativity_course_progress';

type CourseSection = 'intro' | 'week1' | 'week2' | 'week3' | 'resources';

interface CreativityCoursePageProps {
    onBack: () => void;
}

const CreativityCoursePage: React.FC<CreativityCoursePageProps> = ({ onBack }) => {
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
  
  const renderLessonRow = (id: string, title: string, content: string) => (
    <div className="p-3 rounded-lg bg-gray-800/50 mb-3">
      <label htmlFor={id} className="flex items-start cursor-pointer">
        <input
          type="checkbox"
          id={id}
          className="course-checkbox mr-4 mt-1 flex-shrink-0"
          checked={progress[id] || false}
          onChange={() => handleCheckboxChange(id)}
        />
        <div>
            <strong className="font-semibold text-white">{title}</strong>
            <p className="text-sm text-gray-400">{content}</p>
        </div>
      </label>
    </div>
  );
  
  const renderSection = (id: CourseSection, title: string, lessons: React.ReactElement[], prev?: CourseSection, next?: CourseSection, finalCTA?: React.ReactElement) => (
    <section className={`course-card ${activeSection === id ? '' : 'hidden'} animate-fade-in`}>
      <h2 className="course-title">{title}</h2>
      {lessons}
      {finalCTA}
      <div className="course-nav">
        {prev ? <button className="course-btn alt" onClick={() => setActiveSection(prev)}>← Anterior</button> : <span></span>}
        {next ? <button className="course-btn" onClick={() => setActiveSection(next)}>Siguiente Módulo →</button> : <span></span>}
      </div>
    </section>
  );

  return (
    <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-lg shadow-lg shadow-black/20 flex flex-col h-full p-6 overflow-y-auto text-gray-200">
      <style>{`
        .course-header { display:flex; align-items:center; gap:18px; margin-bottom: 24px; }
        .course-logo { width:64px; height:64px; border-radius:14px; display:flex; align-items:center; justify-content:center; background:linear-gradient(135deg, #c084fc, #a855f7); box-shadow:0 6px 20px rgba(12,18,30,0.6); font-weight: 800; font-size: 24px; color: white; }
        .course-card { background: rgba(17, 24, 39, 0.5); border-radius:14px; padding:24px; border:1px solid rgba(255,255,255,0.1); margin-bottom:20px; }
        .course-title { color: #c084fc; font-size:24px; font-weight: 800; margin:0 0 16px; }
        .course-btn { background:#a855f7; border:none; padding:10px 14px; border-radius:10px; color:white; font-weight:600; cursor:pointer; box-shadow:0 4px 15px rgba(168, 85, 247, 0.2); transition: all 0.2s; }
        .course-btn:hover:not(:disabled) { background: #9333ea; transform: translateY(-2px); }
        .course-btn.alt { background:transparent; border:1px solid rgba(255,255,255,0.1); color:#9ca3af; }
        .course-nav { display:flex; justify-content:space-between; margin-top:20px; }
        .course-checkbox { accent-color: #a855f7; width: 1.25rem; height: 1.25rem; }
        .project-card { background: rgba(168, 85, 247, 0.05); padding: 1rem; border-left: 5px solid #a855f7; margin-top: 1rem; border-radius: 0 8px 8px 0;}
        .hidden { display: none; }
      `}</style>
      <div className="course-container max-w-4xl mx-auto">
        <header className="course-header">
            <div className="course-logo">C</div>
            <div>
              <h1 className="text-2xl font-extrabold m-0 text-white">Curso de Creatividad Disruptiva</h1>
              <p className="m-0 text-gray-300">Un programa de 3 meses para multiplicar tu potencial creativo x10.</p>
            </div>
        </header>
        <main>
            <section className={`course-card ${activeSection === 'intro' ? '' : 'hidden'} animate-fade-in`}>
                <h2 className="course-title">Bienvenido</h2>
                <p className="text-gray-300">Este curso autodirigido de 3 meses combina neurociencia, IA y gamificación para transformar tu creatividad en un superpoder exponencial. ¡Comparte tus avances en X con #CreatividadExponencial!</p>
                <div className="mt-4">
                    <button className="course-btn" onClick={() => setActiveSection('week1')}>Comenzar Curso</button>
                    <button className="course-btn alt ml-2" onClick={onBack}>« Volver a Programas</button>
                </div>
            </section>

            {renderSection('week1', 'Módulo 1 — Fundamentos: Hackea tu Cerebro', [
                renderLessonRow('c1l1', 'Qué es la Creatividad', 'Ejercicio: Conecta 3 objetos random (e.g., taza + dron) y genera 10 ideas con IA.'),
                renderLessonRow('c1l2', 'Mitos sobre la Creatividad', 'Ejercicio: Lista 5 mitos personales y rómpelos con contraejemplos virales.'),
                renderLessonRow('c1l3', 'Ambiente y Mentalidad', 'Ejercicio: Diseña tu rincón creativo y prueba "pomodoros creativos".'),
            ], 'intro', 'week2')}
            
            {renderSection('week2', 'Módulo 2 — Herramientas y Técnicas: Armas de Ideas', [
                renderLessonRow('c2l1', 'Brainstorming Cuántico', 'Ejercicio: Genera 100 ideas en 10 min. Brainstormea 50 soluciones locas para un problema y haz un video viral.'),
                renderLessonRow('c2l2', 'Pensamiento Lateral', 'Ejercicio: Resuelve un riddle lateral y crea el tuyo propio.'),
                renderLessonRow('c2l3', 'Analogías y Mapas Mentales', 'Ejercicio: Mapa mental de tu vida com analogías gamificadas.'),
            ], 'week1', 'week3')}

            {renderSection('week3', 'Módulo 3 — Aplicaciones y Proyecto Final: Lanza tu Revolución', [
                renderLessonRow('c3l1', 'Creatividad en la Vida Diaria', 'Ejercicio: Hackea rutinas. Cambia 3 hábitos con twists creativos.'),
                renderLessonRow('c3l2', 'Innovación en Negocios y Arte', 'Ejercicio: Crea modelos exponenciales. Resucita un negocio fallido com innovación.'),
                renderLessonRow('c3l3', 'Superar Bloqueos', 'Ejercicio: Usa técnicas como "Inversión" o IA-Coach. Aplica 3 técnicas a tu bloqueo principal.'),
            ], 'week2', 'resources', (
                 <div className="project-card">
                    <strong className="text-white">Proyecto Final:</strong> Desarrolla una idea innovadora combinando dos campos (e.g., tecnología + cocina). Presenta un esquema visual con Canva o draw.io. Pitchéalo en X y mide tu "índice de viralidad". ¡Gana un badge de "Disruptor Creativo"!
                </div>
            ))}
            
            <section className={`course-card ${activeSection === 'resources' ? '' : 'hidden'} animate-fade-in`}>
                <h2 className="course-title">Recursos Sugeridos</h2>
                <ul className="list-disc list-inside text-gray-300">
                    <li>"Creativity, Inc." — Ed Catmull</li>
                    <li>"El Camino del Artista" — Julia Cameron</li>
                    <li>"Roba como un Artista" — Austin Kleon</li>
                    <li>"The Creative Act" — Rick Rubin</li>
                    <li><strong>Apps:</strong> Midjourney (visuals), Notion (tracking), Brain.fm (foco).</li>
                </ul>
                <div className="course-nav">
                    <button className="course-btn alt" onClick={() => setActiveSection('week3')}>← Anterior</button>
                </div>
            </section>
        </main>
      </div>
    </div>
  );
};

export default CreativityCoursePage;