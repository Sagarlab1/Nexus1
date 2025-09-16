import React, { useState, useEffect } from 'react';

const TOTAL_LESSONS = 9;
const STORAGE_KEY = 'entrepreneurship_course_progress';

type CourseSection = 'intro' | 'week1' | 'week2' | 'week3' | 'resources';

const EntrepreneurshipCoursePage: React.FC = () => {
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
    <div className="p-2.5 rounded-lg bg-gray-800/50 mb-3">
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
  
  const renderSection = (id: CourseSection, title: string, lessons: JSX.Element[], prev?: CourseSection, next?: CourseSection, finalCTA?: JSX.Element) => (
    <section className={`course-card ${activeSection === id ? '' : 'hidden'}`}>
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
        .course-header { text-align: center; padding: 2rem 1rem; border-radius: 14px; margin-bottom: 24px; background: linear-gradient(135deg, #4CAF50, #2196F3); color: white; }
        .course-card { background: rgba(17, 24, 39, 0.5); border-radius:14px; padding:24px; border:1px solid rgba(255,255,255,0.1); margin-bottom:20px; }
        .course-title { color: #66bb6a; font-size:24px; font-weight: 800; margin:0 0 16px; }
        .course-btn { background:#2196F3; border:none; padding:10px 14px; border-radius:10px; color:white; font-weight:600; cursor:pointer; box-shadow:0 4px 15px rgba(33, 150, 243, 0.2); transition: all 0.2s; }
        .course-btn:hover:not(:disabled) { background: #1976D2; transform: translateY(-2px); }
        .course-btn.alt { background:transparent; border:1px solid rgba(255,255,255,0.1); color:#9ca3af; }
        .course-nav { display:flex; justify-content:space-between; margin-top:20px; }
        .course-checkbox { accent-color: #4CAF50; width: 1.25rem; height: 1.25rem; }
        .project-card { background: rgba(232, 245, 233, 0.05); padding: 1rem; border-left: 5px solid #4CAF50; margin-top: 1rem; border-radius: 0 8px 8px 0;}
        .hidden { display: none; }
      `}</style>
      <div className="course-container max-w-4xl mx-auto">
        <header className="course-header">
            <h1 className="text-3xl font-extrabold m-0">Curso de Emprendimiento Exponencial: Lanza tu Startup Disruptiva</h1>
            <p className="m-0 text-white/90">Un programa de 3 meses para escalar ideas a negocios globales con impacto x10</p>
        </header>
        <main>
            <section className={`course-card ${activeSection === 'intro' ? '' : 'hidden'}`}>
                <h2 className="course-title">Bienvenido</h2>
                <p className="text-gray-300">Este curso autodirigido de 3 meses integra principios de startups exponenciales, lean methodology y herramientas digitales para transformar tu idea en un negocio escalable. ¡Comparte tus avances en X con #EmprendimientoExponencial!</p>
                <button className="course-btn mt-4" onClick={() => setActiveSection('week1')}>Comenzar Curso</button>
                 <div className="mt-2 text-sm text-gray-400">Progreso: {completedLessons}/{TOTAL_LESSONS} lecciones</div>
            </section>

            {renderSection('week1', 'Módulo 1 — Fundamentos: Hackea tu Mentalidad Emprendedora', [
                renderLessonRow('e1l1', 'Qué es el Emprendimiento Exponencial', 'Ejercicio: Identifica 3 problemas globales y brainstormea soluciones exponenciales.'),
                renderLessonRow('e1l2', 'Mitos sobre Startups', 'Ejercicio: Lista 5 mitos personales y encuentra contraejemplos (e.g., Airbnb rechazos iniciales).'),
                renderLessonRow('e1l3', 'Mentalidad y Ambiente Emprendedor', 'Ejercicio: Diseña tu rutina diaria con "sprints emprendedores".'),
            ], 'intro', 'week2')}
            
            {renderSection('week2', 'Módulo 2 — Herramientas: Construye tu Máquina de Crecimiento', [
                renderLessonRow('e2l1', 'Ideación y Validación de Ideas', 'Ejercicio: Crea un Lean Canvas para tu idea y valida con 10 encuestas en redes.'),
                renderLessonRow('e2l2', 'Modelos de Negocio Exponenciales', 'Ejercicio: Analiza un modelo exitoso y adáptalo a tu nicho (e.g., "Uber para educación").'),
                renderLessonRow('e2l3', 'Herramientas Digitales', 'Ejercicio: Construye un landing page simple con Carrd o Webflow y mide tráfico inicial.'),
            ], 'week1', 'week3')}

            {renderSection('week3', 'Módulo 3 — Aplicaciones y Proyecto Final: Escala a Nivel Global', [
                renderLessonRow('e3l1', 'Escalabilidad y Crecimiento', 'Ejercicio: Diseña una estrategia de adquisición de usuarios para 1k en un mes.'),
                renderLessonRow('e3l2', 'Financiamiento y Equipo', 'Ejercicio: Crea un pitch deck simple y practica con un amigo.'),
                renderLessonRow('e3l3', 'Superar Obstáculos', 'Ejercicio: Identifica 3 riesgos en tu idea y planes de mitigación.'),
            ], 'week2', 'resources', (
                 <div className="project-card">
                    <strong className="text-white">Proyecto Final:</strong> Desarrolla un plan de negocio exponencial. Incluye: Lean Canvas, MVP sketch, estrategia de crecimiento, pitch. Presenta en un doc visual y compártelo en LinkedIn. ¡Gana un badge de "Emprendedor Exponencial"!
                </div>
            ))}
            
            <section className={`course-card ${activeSection === 'resources' ? '' : 'hidden'}`}>
                <h2 className="course-title">Recursos Sugeridos</h2>
                <ul className="list-disc list-inside text-gray-300">
                    <li>"Exponential Organizations" — Salim Ismail</li>
                    <li>"The Lean Startup" — Eric Ries</li>
                    <li>"Zero to One" — Peter Thiel</li>
                    <li>"Blitzscaling" — Reid Hoffman</li>
                    <li><strong>Apps/Herramientas:</strong> Notion (planning), Trello (tasks), Canva (designs), Google Analytics (metrics).</li>
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

export default EntrepreneurshipCoursePage;