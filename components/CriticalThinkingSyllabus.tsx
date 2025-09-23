import React, { useState } from 'react';
import XIcon from './icons/XIcon.tsx';

interface SyllabusProps {
  onClose: () => void;
}

const modules = [
  {
    id: 'module1',
    title: 'Módulo 1: Fundamentos del Pensamiento Crítico (4h)',
    objective: 'Establecer bases con el marco Paul-Elder.',
    lessons: [
      '<strong>Lección 1.1 (1h):</strong> Definición y beneficios. Ejemplo: Evalúa noticias 2025. Video: Clara en laberinto de fake news. Ejercicio: Reflexión (escala animada). Recurso: Infografía circular.',
      '<strong>Lección 1.2 (2h):</strong> 8 elementos (propósito, pregunta, etc.). Ejemplo: Cambio de carrera por IA. Video: Rompecabezas lógico. Ejercicio: Mind map. Recurso: Diagrama clickable.',
      '<strong>Lección 1.3 (1h):</strong> Autoevaluación. Ejemplo: Cuestiona noticias. Video: Gimnasio mental. Ejercicio: Quiz con árbol. Recurso: Checklist.',
    ],
    evaluation: 'Mind map; badge “Explorador Crítico”.',
  },
  {
    id: 'module2',
    title: 'Módulo 2: Sesgos Cognitivos y Errores Comunes (5h)',
    objective: 'Neutralizar sesgos y falacias.',
    lessons: [
      '<strong>Lección 2.1 (1.5h):</strong> Sesgos (confirmación, anclaje). Ejemplo: Riesgos climáticos 2025. Video: Pozos de sesgo. Ejercicio: Identifica sesgos; slider. Recurso: Infografía de sesgos.',
      '<strong>Lección 2.2 (2h):</strong> Falacias (ad hominem, straw man). Ejemplo: Debates en X. Video: Batalla de falacias. Ejercicio: Desarma argumento. Recurso: Tabla de falacias.',
      '<strong>Lección 2.3 (1.5h):</strong> Mitigación (premortem). Ejemplo: Mitiga sesgos. Video: Toolbox anti-sesgo. Ejercicio: Aplica estrategia. Recurso: Flujo de decisión.',
    ],
    evaluation: 'Quiz gamificado; badge “Cazador de Sesgos”.',
  },
   {
    id: 'module3',
    title: 'Módulo 3: Construyendo Argumentos Sólidos (6h)',
    objective: 'Dominar lógica para argumentos.',
    lessons: [
        '<strong>Lección 3.1 (2h):</strong> Lógica deductiva/inductiva. Ejemplo: Regulación de IA. Video: Puentes de Lego. Ejercicio: Silogismo. Recurso: Diagrama de Venn.',
        '<strong>Lección 3.2 (2h):</strong> Evaluar evidencia. Ejemplo: Informe de IA. Video: Detective lógico. Ejercicio: Clasifica evidencia. Recurso: Matriz de evaluación.',
        '<strong>Lección 3.3 (2h):</strong> Ensayos críticos. Ejemplo: Ensayo sobre IA. Video: Edificio de argumentos. Ejercicio: Mini-ensayo. Recurso: Plantilla flowchart.',
    ],
    evaluation: 'Ensayo corto; badge “Arquitecto Lógico”.',
  },
   {
    id: 'module4',
    title: 'Módulo 4: Toma de Decisiones Bajo Incertidumbre (5h)',
    objective: 'Usar modelos probabilísticos y riesgos.',
    lessons: [
        '<strong>Lección 4.1 (1.5h):</strong> Bayes, árboles de decisión. Ejemplo: Inversión en IA. Video: Casino cósmico. Ejercicio: Calcula probabilidades. Recurso: Árbol interactivo.',
        '<strong>Lección 4.2 (2h):</strong> Análisis de riesgos. Ejemplo: Riesgos de IA. Video: Nave esquivando asteroides. Ejercicio: Matriz de riesgos. Recurso: Matriz gamificada.',
        '<strong>Lección 4.3 (1.5h):</strong> Decisiones grupales. Ejemplo: Estrategia de IA. Video: Burbujas de groupthink. Ejercicio: Simulación de reunión. Recurso: Dashboard de consenso.',
    ],
    evaluation: 'Decisión simulada; badge “Estratega de Riesgos”.',
  },
   {
    id: 'module5',
    title: 'Módulo 5: Pensamiento Creativo y Colaborativo (4h)',
    objective: 'Integrar creatividad con crítica.',
    lessons: [
        '<strong>Lección 5.1 (1.5h):</strong> Six Thinking Hats. Ejemplo: IA ética. Video: Sombreros como planetas. Ejercicio: Aplica sombreros. Recurso: Rueda interactiva.',
        '<strong>Lección 5.2 (1.5h):</strong> SCAMPER, mapas mentales. Ejemplo: Deepfakes. Video: Tormenta de ideas. Ejercicio: Genera ideas. Recurso: Mapa mental.',
        '<strong>Lección 5.3 (1h):</strong> Creatividad-crítica. Ejemplo: Solución climática. Video: Ying-yang. Ejercicio: Refina idea. Recurso: Balanza interactiva.',
    ],
    evaluation: 'Sesión creativa; badge “Innovador Crítico”.',
  },
  {
    id: 'module6',
    title: 'Módulo 6: Ética, Sostenibilidad y Aplicaciones Reales (6h)',
    objective: 'Aplicar pensamiento ético a dilemas.',
    lessons: [
        '<strong>Lección 6.1 (2h):</strong> Ética digital (deepfakes). Ejemplo: IA en redes. Video: Tribunal VR. Ejercicio: Analiza dilema. Recurso: Timeline ético.',
        '<strong>Lección 6.2 (2h):</strong> Sostenibilidad (clima). Ejemplo: Impuestos al carbono. Video: Globo terrestre. Ejercicio: Evalúa política. Recurso: Infografía global.',
        '<strong>Lección 6.3 (2h):</strong> Aplicaciones laborales. Ejemplo: Negociación IA. Video: Oficina futurista. Ejercicio: Role-play. Recurso: Dashboard ético.',
    ],
    evaluation: 'Ensayo ético; badge “Guardián Ético”.',
  },
  {
    id: 'module7',
    title: 'Módulo 7: Herramientas Avanzadas y Hábitos Diarios (5h)',
    objective: 'Herramientas avanzadas y rutinas.',
    lessons: [
        '<strong>Lección 7.1 (1.5h):</strong> Causa raíz (5 Whys, Ishikawa). Ejemplo: Fallo IA. Video: Árbol con raíces. Ejercicio: Aplica 5 Whys. Recurso: Diagrama Ishikawa.',
        '<strong>Lección 7.2 (2h):</strong> Hábitos diarios (diario crítico). Ejemplo: Noticias en X. Video: Reloj mental. Ejercicio: Diario 7 días. Recurso: Checklist diario.',
        '<strong>Lección 7.3 (1.5h):</strong> Herramientas digitales (prompts IA). Ejemplo: Impacto IA. Video: Robot asistente. Ejercicio: Diseña prompt. Recurso: Guía de prompts.',
    ],
    evaluation: 'Diario revisión; badge “Maestro de Herramientas”.',
  },
  {
    id: 'module8',
    title: 'Módulo 8: Proyecto Final y Reflexión (5h)',
    objective: 'Sintetizar habilidades en un proyecto.',
    lessons: [
        '<strong>Lección 8.1 (1.5h):</strong> Guía proyecto. Ejemplo: Regulación IA. Video: Héroe en escenario final. Ejercicio: Planifica proyecto. Recurso: Plantilla integradora.',
        '<strong>Lección 8.2 (1.5h):</strong> Ejecución y presentación. Ejemplo: Foro virtual. Video: Audiencia animada. Ejercicio: Video 1-2 min. Recurso: Certificado animado.',
        '<strong>Lección 8.3 (1h):</strong> Reflexión. Ejemplo: Plan de mantenimiento. Video: Espejo mental. Ejercicio: Reflexión escrita. Recurso: Gráfico de progreso.',
    ],
    evaluation: 'Proyecto final; certificado “Maestro en Pensamiento Crítico”.',
  },
];


const CriticalThinkingSyllabus: React.FC<SyllabusProps> = ({ onClose }) => {
  const [openModule, setOpenModule] = useState<string | null>(null);

  const toggleModule = (moduleId: string) => {
    setOpenModule(prevModule => (prevModule === moduleId ? null : moduleId));
  };

  return (
     <div className="fixed inset-0 bg-black/80 z-[60] flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
      <div className="bg-gray-900 border border-blue-500/30 rounded-2xl shadow-2xl w-full max-w-4xl h-[90vh] flex flex-col">
        <header className="p-4 flex justify-between items-center border-b border-gray-700/50 flex-shrink-0">
          <h2 className="text-xl font-bold text-blue-400">Temario: Pensamiento Crítico</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white">
            <XIcon className="w-6 h-6" />
          </button>
        </header>

        <div className="p-6 overflow-y-auto">
          <header className="text-center py-4">
            <h1 className="text-3xl md:text-4xl font-bold text-blue-400">Curso Maestro en Pensamiento Crítico</h1>
            <p className="text-md md:text-lg mt-2 text-gray-300">Desarrolla una mente imbatible para los desafíos de 2025</p>
          </header>

          <section className="my-6 text-center">
            <p className="text-gray-300 mb-2"><strong className="text-white">Duración:</strong> 8 semanas, 35 horas.</p>
            <p className="text-gray-300"><strong className="text-white">Formato:</strong> Videos animados, ejercicios gamificados, dashboards interactivos, y proyecto final.</p>
          </section>
          
          <div className="space-y-4">
            {modules.map(module => (
              <div key={module.id} className="bg-gray-800/60 rounded-lg shadow-lg">
                <button 
                  className="w-full text-left p-4 text-xl font-semibold text-blue-400 hover:text-blue-300 transition-colors"
                  onClick={() => toggleModule(module.id)}
                  aria-expanded={openModule === module.id}
                  aria-controls={`content-${module.id}`}
                >
                  {module.title}
                </button>
                <div
                  id={`content-${module.id}`}
                  className={`transition-all duration-500 ease-in-out overflow-hidden ${openModule === module.id ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}
                >
                    <div className="p-4 pt-0 text-gray-300">
                        <p className="mb-3"><strong>Objetivo:</strong> {module.objective}</p>
                        <ul className="list-disc ml-6 space-y-2">
                            {module.lessons.map((lesson, index) => (
                                <li key={index} dangerouslySetInnerHTML={{ __html: lesson }} />
                            ))}
                        </ul>
                        <p className="mt-4 border-t border-gray-700/50 pt-3"><strong>Evaluación:</strong> {module.evaluation}</p>
                    </div>
                </div>
              </div>
            ))}
          </div>
            <footer className="text-center py-8">
                <p className="text-gray-400">Desarrollado para 2025. ¡Conviértete en un pensador crítico imbatible!</p>
            </footer>
        </div>
      </div>
    </div>
  );
};

export default CriticalThinkingSyllabus;
