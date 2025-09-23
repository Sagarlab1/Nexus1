import React, { useState, useEffect } from 'react';

const TOTAL_LESSONS = 9;
const STORAGE_KEY = 'gen_ai_course_progress';

type CourseSection = 'intro' | 'week1' | 'week2' | 'week3' | 'resources';

interface GenerativeAiCoursePageProps {
    onBack: () => void;
}

const GenerativeAiCoursePage: React.FC<GenerativeAiCoursePageProps> = ({ onBack }) => {
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
        .course-logo { width:64px; height:64px; border-radius:14px; display:flex; align-items:center; justify-content:center; background:linear-gradient(135deg, #f9a8d4, #ec4899); box-shadow:0 6px 20px rgba(12,18,30,0.6); font-weight: 800; font-size: 24px; color: white; }
        .course-card { background: rgba(17, 24, 39, 0.5); border-radius:14px; padding:24px; border:1px solid rgba(255,255,255,0.1); margin-bottom:20px; }
        .course-title { color: #f9a8d4; font-size:24px; font-weight: 800; margin:0 0 16px; }
        .course-btn { background:#ec4899; border:none; padding:10px 14px; border-radius:10px; color:white; font-weight:600; cursor:pointer; box-shadow:0 4px 15px rgba(236, 72, 153, 0.2); transition: all 0.2s; }
        .course-btn:hover:not(:disabled) { background: #db2777; transform: translateY(-2px); }
        .course-btn.alt { background:transparent; border:1px solid rgba(255,255,255,0.1); color:#9ca3af; }
        .course-nav { display:flex; justify-content:space-between; margin-top:20px; }
        .course-checkbox { accent-color: #ec4899; width: 1.25rem; height: 1.25rem; }
        .project-card { background: rgba(236, 72, 153, 0.05); padding: 1rem; border-left: 5px solid #ec4899; margin-top: 1rem; border-radius: 0 8px 8px 0;}
        .hidden { display: none; }
      `}</style>
      <div className="course-container max-w-4xl mx-auto">
        <header className="course-header">
            <div className="course-logo">IA</div>
            <div>
              <h1 className="text-2xl font-extrabold m-0 text-white">Curso de IA Generativa Exponencial</h1>
              <p className="m-0 text-gray-300">Un programa de 3 meses para escalar tu expertise en GenAI.</p>
            </div>
        </header>
        <main>
            <section className={`course-card ${activeSection === 'intro' ? '' : 'hidden'} animate-fade-in`}>
                <h2 className="course-title">Bienvenido</h2>
                <p className="text-gray-300">Este curso cubre lo más importante en IA Generativa en 2025: multimodalidad, agentes IA, adopción empresarial y ética. ¡Comparte tus avances en X con #IAGenerativaExponencial!</p>
                <div className="mt-4">
                    <button className="course-btn" onClick={() => setActiveSection('week1')}>Comenzar Curso</button>
                    <button className="course-btn alt ml-2" onClick={onBack}>« Volver a Programas</button>
                </div>
            </section>

            {renderSection('week1', 'Módulo 1 — Fundamentos de IA Generativa', [
                renderLessonRow('g1l1', 'Qué es la IA Generativa en 2025', 'Ejercicio: Experimenta con Grok o ChatGPT: Genera un prompt multimodal y analiza el output.'),
                renderLessonRow('g1l2', 'Mitos y Realidades Actuales', 'Ejercicio: Lista 5 mitos y busca contraejemplos en noticias 2025.'),
                renderLessonRow('g1l3', 'Mentalidad y Ambiente para GenAI', 'Ejercicio: Configura tu entorno y realiza un "sprint IA" diario (20 min prompting).'),
            ], 'intro', 'week2')}
            
            {renderSection('week2', 'Módulo 2 — Herramientas y Técnicas', [
                renderLessonRow('g2l1', 'Prompting Avanzado y LLMs', 'Ejercicio: Crea prompts para tareas complejas usando Claude o GPT-4o.'),
                renderLessonRow('g2l2', 'Multimodal AI y Agentes', 'Ejercicio: Usa LangChain para un agente que resuma noticias y genere visuals.'),
                renderLessonRow('g2l3', 'Manejo de Datos Escalables', 'Ejercicio: Explora datasets en Kaggle y fine-tunea un modelo simple en Colab.'),
            ], 'week1', 'week3')}

            {renderSection('week3', 'Módulo 3 — Aplicaciones, Ética y Proyecto Final', [
                renderLessonRow('g3l1', 'Aplicaciones Empresariales y Sector Público', 'Ejercicio: Diseña una app GenAI para tu industria.'),
                renderLessonRow('g3l2', 'Ética y Sostenibilidad en 2025', 'Ejercicio: Audita un output GenAI por sesgos y propone mitigaciones.'),
                renderLessonRow('g3l3', 'Escalabilidad y Adopción', 'Ejercicio: Integra una herramienta GenAI en tu rutina diaria y mide productividad x2.'),
            ], 'week2', 'resources', (
                 <div className="project-card">
                    <strong className="text-white">Proyecto Final:</strong> Desarrolla un agente IA multimodal que resuelva un problema real. Incluye: Prompt engineering, código simple (Python/LangChain), ética check, demo visual. ¡Gana un badge de "Maestro en GenAI Exponencial"!
                </div>
            ))}
            
            <section className={`course-card ${activeSection === 'resources' ? '' : 'hidden'} animate-fade-in`}>
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