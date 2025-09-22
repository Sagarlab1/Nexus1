import React, { useState, useEffect } from 'react';

const TOTAL_LESSONS = 9;
const STORAGE_KEY = 'gen_ai_course_progress';

type CourseSection = 'intro' | 'week1' | 'week2' | 'week3' | 'resources';

const GenerativeAiCoursePage: React.FC = () => {
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
  
  // FIX: Replaced JSX.Element with React.ReactElement to fix 'Cannot find namespace JSX' error.
  const renderSection = (id: CourseSection, title: string, lessons: React.ReactElement[], prev?: CourseSection, next?: CourseSection, finalCTA?: React.ReactElement) => (
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
        .course-header { text-align: center; padding: 2rem 1rem; border-radius: 14px; margin-bottom: 24px; background: linear-gradient(135deg, #9C27B0, #673AB7); color: white; }
        .course-card { background: rgba(17, 24, 39, 0.5); border-radius:14px; padding:24px; border:1px solid rgba(255,255,255,0.1); margin-bottom:20px; }
        .course-title { color: #ba68c8; font-size:24px; font-weight: 800; margin:0 0 16px; }
        .course-btn { background:#673AB7; border:none; padding:10px 14px; border-radius:10px; color:white; font-weight:600; cursor:pointer; box-shadow:0 4px 15px rgba(103, 58, 183, 0.2); transition: all 0.2s; }
        .course-btn:hover:not(:disabled) { background: #5E35B1; transform: translateY(-2px); }
        .course-btn.alt { background:transparent; border:1px solid rgba(255,255,255,0.1); color:#9ca3af; }
        .course-nav { display:flex; justify-content:space-between; margin-top:20px; }
        .course-checkbox { accent-color: #9C27B0; width: 1.25rem; height: 1.25rem; }
        .project-card { background: rgba(243, 229, 245, 0.05); padding: 1rem; border-left: 5px solid #9C27B0; margin-top: 1rem; border-radius: 0 8px 8px 0;}
        .hidden { display: none; }
      `}</style>
      <div className="course-container max-w-4xl mx-auto">
        <header className="course-header">
            <h1 className="text-3xl font-extrabold m-0">Curso de IA Generativa Exponencial: Domina la Revolución Multimodal 2025</h1>
            <p className="m-0 text-white/90">Un programa de 3 meses para escalar tu expertise en GenAI</p>
        </header>
        <main>
            <section className={`course-card ${activeSection === 'intro' ? '' : 'hidden'}`}>
                <h2 className="course-title">Bienvenido</h2>
                <p className="text-gray-300">Este curso cubre lo más importante en IA Generativa en 2025: multimodalidad, agentes IA, adopción empresarial y ética. ¡Comparte tus avances en X con #IAGenerativaExponencial!</p>
                <button className="course-btn mt-4" onClick={() => setActiveSection('week1')}>Comenzar Curso</button>
                 <div className="mt-2 text-sm text-gray-400">Progreso: {completedLessons}/{TOTAL_LESSONS} lecciones</div>
            </section>

            {renderSection('week1', 'Módulo 1 — Fundamentos de IA Generativa: Entiende el Núcleo Exponencial', [
                renderLessonRow('g1l1', 'Qué es la IA Generativa en 2025', 'Ejercicio: Experimenta con Grok o ChatGPT: Genera un prompt multimodal y analiza el output.'),
                renderLessonRow('g1l2', 'Mitos y Realidades Actuales', 'Ejercicio: Lista 5 mitos y busca contraejemplos en noticias 2025.'),
                renderLessonRow('g1l3', 'Mentalidad y Ambiente para GenAI', 'Ejercicio: Configura tu entorno y realiza un "sprint IA" diario (20 min prompting).'),
            ], 'intro', 'week2')}
            
            {renderSection('week2', 'Módulo 2 — Herramientas y Técnicas: Construye com Agentes y Multimodalidad', [
                renderLessonRow('g2l1', 'Prompting Avanzado y LLMs', 'Ejercicio: Crea prompts para tareas complejas usando Claude o GPT-4o.'),
                renderLessonRow('g2l2', 'Multimodal AI y Agentes', 'Ejercicio: Usa LangChain para un agente que resuma noticias y genere visuals.'),
                renderLessonRow('g2l3', 'Manejo de Datos Escalables', 'Ejercicio: Explora datasets en Kaggle y fine-tunea un modelo simple en Colab.'),
            ], 'week1', 'week3')}

            {renderSection('week3', 'Módulo 3 — Aplicaciones, Ética y Proyecto Final: Escala Impacto Global', [
                renderLessonRow('g3l1', 'Aplicaciones Empresariales y Sector Público', 'Ejercicio: Diseña una app GenAI para tu industria.'),
                renderLessonRow('g3l2', 'Ética y Sostenibilidad en 2025', 'Ejercicio: Audita un output GenAI por sesgos y propone mitigaciones.'),
                renderLessonRow('g3l3', 'Escalabilidad y Adopción', 'Ejercicio: Integra una herramienta GenAI en tu rutina diaria y mide productividad x2.'),
            ], 'week2', 'resources', (
                 <div className="project-card">
                    <strong className="text-white">Proyecto Final:</strong> Desarrolla un agente IA multimodal que resuelva un problema real. Incluye: Prompt engineering, código simple (Python/LangChain), ética check, demo visual. ¡Gana un badge de "Maestro en GenAI Exponencial"!
                </div>
            ))}
            
            <section className={`course-card ${activeSection === 'resources' ? '' : 'hidden'}`}>
                <h2 className="course-title">Recursos Sugeridos (Actuales 2025)</h2>
                <ul className="list-disc list-inside text-gray-300">
                    <li>"The Coming Wave" — Mustafa Suleyman</li>
                    <li>"Generative AI on AWS" — guía oficial</li>
                    <li>"AI Index 2025" — Stanford HAI</li>
                    <li><strong>Herramientas:</strong> Grok (xAI), Hugging Face (modelos), LangChain (agentes), Google Colab (ejecución), Midjourney (multimodal).</li>
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

export default GenerativeAiCoursePage;