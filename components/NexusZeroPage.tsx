import React, { useState, useEffect } from 'react';
import CompassIcon from './icons/CompassIcon.tsx';
import AnalysisIcon from './icons/AnalysisIcon.tsx';
import BrainIcon from './icons/BrainIcon.tsx';
import RocketIcon from './icons/RocketIcon.tsx';
import CodeIcon from './icons/CodeIcon.tsx';
import BulbIcon from './icons/BulbIcon.tsx';
import MessageSquareIcon from './icons/MessageSquareIcon.tsx';
import NexusLogo from './icons/NexusLogo.tsx';
import GraduationCapIcon from './icons/GraduationCapIcon.tsx';

const STORAGE_KEY = 'nexus_zero_progress';
const TOTAL_DAYS = 7;

const days = [
  { id: 'd1', title: 'Deconstrucción', skill: 'Pensamiento Crítico', description: 'Desarma ideas complejas en sus componentes fundamentales.', mission: 'Elige una noticia actual y desglosa sus 3 argumentos principales y 3 posibles sesgos. Anota tus hallazgos.', icon: AnalysisIcon, inspiration: 'Método Socrático de Harvard' },
  { id: 'd2', title: 'Conexión', skill: 'Creatividad', description: 'Crea puentes entre conceptos dispares para generar ideas innovadoras.', mission: 'Toma dos objetos aleatorios a tu alrededor. Genera 5 ideas de productos o servicios que los combinen.', icon: BrainIcon, inspiration: 'Enfoque Interdisciplinario del MIT' },
  { id: 'd3', title: 'Prototipado', skill: 'Emprendimiento', description: 'Transforma una idea abstracta en algo tangible y aprende rápido.', mission: 'Dibuja en una servilleta o en una app de diseño el "home page" de una de tus ideas del Día 2. No más de 15 minutos.', icon: RocketIcon, inspiration: 'Filosofía "Mens et Manus" del MIT' },
  { id: 'd4', title: 'Interrogación', skill: 'IA Generativa', description: 'Domina el arte de la pregunta para refinar tu pensamiento con la IA.', mission: 'Pide a tu agente IA (Nexus) que actúe como un escéptico y critique tu prototipo del Día 3. Anota 3 mejoras clave.', icon: CodeIcon, inspiration: 'Sistema de Tutorías de Oxford' },
  { id: 'd5', title: 'Síntesis', skill: 'Pensamiento Crítico + Creatividad', description: 'Combina hallazgos y conexiones en una nueva idea original y coherente.', mission: 'Crea un "tweet" (280 caracteres) que resuma tu idea mejorada, combinando el feedback del agente IA.', icon: BulbIcon, inspiration: 'Elaboración de Tesis de Oxford' },
  { id: 'd6', title: 'Narrativa', skill: 'Emprendimiento', description: 'Construye una historia convincente alrededor de tu idea para inspirar a otros.', mission: 'Graba un audio de 60 segundos (un "elevator pitch") explicando tu proyecto como si se lo contaras a un inversor.', icon: RocketIcon, inspiration: 'Presentaciones de Caso de Harvard' },
  { id: 'd7', title: 'Expansión', skill: 'Integración Final', description: 'Convierte tu aprendizaje en un plan de acción concreto y audaz.', mission: 'Define los 3 próximos pasos, realistas y accionables, que darías en la próxima semana para avanzar en tu proyecto.', icon: NexusLogo, inspiration: 'Integración Holística de Nexus Sapiens' },
];

interface NexusZeroPageProps {
    onNavigateToPrograms: () => void;
}

const NexusZeroPage: React.FC<NexusZeroPageProps> = ({ onNavigateToPrograms }) => {
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

    const handleCheckboxChange = (dayId: string) => {
        const newProgress = { ...progress, [dayId]: !progress[dayId] };
        saveProgress(newProgress);
    };

    const completedDays = Object.values(progress).filter(Boolean).length;
    const progressPct = Math.round((completedDays / TOTAL_DAYS) * 100);

    return (
        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-lg shadow-lg shadow-black/20 flex flex-col h-full p-8 overflow-y-auto">
        <div className="max-w-5xl mx-auto">
            <div className="text-center mb-8">
                <div className="inline-block p-4 bg-cyan-500/10 rounded-full mb-4">
                    <CompassIcon className="w-12 h-12 text-cyan-400" />
                </div>
                <h1 className="text-4xl font-bold text-white mb-2">Programa Preliminar: Nexus Cero</h1>
                <p className="text-lg text-cyan-400 font-mono">TU ODISEA DE 7 DÍAS PARA DESPERTAR TU POTENCIAL</p>
            </div>
            
            {/* Progress Bar */}
            <div className="mb-10">
                <div className="flex justify-between items-center mb-1 text-sm">
                    <span className="font-bold text-cyan-300">Progreso de la Odisea</span>
                    <span className="font-mono text-gray-400">{completedDays} / {TOTAL_DAYS} Días Completados</span>
                </div>
                <div className="w-full bg-gray-700/50 rounded-full h-2.5">
                    <div className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2.5 rounded-full transition-all duration-500" style={{ width: `${progressPct}%` }}></div>
                </div>
            </div>

            <div className="space-y-8">
            {days.map((day) => (
                <div key={day.id} className="bg-gray-800/60 p-6 rounded-lg border-2 border-gray-700 transition-colors duration-300 shadow-lg">
                    <div className="flex items-start">
                        <div className="flex flex-col items-center mr-6">
                           <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 ${progress[day.id] ? 'bg-green-500/20 border-green-500' : 'bg-gray-700 border-gray-600'}`}>
                                <day.icon className={`w-6 h-6 ${progress[day.id] ? 'text-green-400' : 'text-cyan-400'}`} />
                            </div>
                        </div>
                        <div className="flex-1">
                            <h2 className="text-2xl font-bold text-white">{`Día ${day.id.substring(1)}: ${day.title}`}</h2>
                            <p className="text-sm font-mono text-cyan-400 mb-2">{day.skill}</p>
                            <p className="text-gray-300 mb-4">{day.description}</p>
                            
                            <div className="bg-gray-900/50 p-4 rounded-md border border-gray-700/80">
                               <p className="font-bold text-white mb-2">Misión del Día:</p>
                               <p className="text-gray-300 text-sm">{day.mission}</p>
                            </div>
                            
                            <div className="mt-4">
                                <label htmlFor={`progress-${day.id}`} className="inline-flex items-center cursor-pointer bg-gray-700/50 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
                                    <input
                                      type="checkbox"
                                      id={`progress-${day.id}`}
                                      className="w-5 h-5 accent-cyan-400 mr-3"
                                      checked={progress[day.id] || false}
                                      onChange={() => handleCheckboxChange(day.id)}
                                    />
                                    Marcar como completado
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
            </div>

            {completedDays === TOTAL_DAYS && (
                 <div className="mt-12 text-center bg-gradient-to-br from-cyan-900/50 to-gray-900/50 p-8 rounded-lg border-2 border-cyan-500/50 shadow-2xl shadow-cyan-500/10">
                    <GraduationCapIcon className="w-16 h-16 text-cyan-300 mx-auto mb-4" />
                    <h3 className="text-3xl font-bold text-white mb-2">¡Odisea Completada!</h3>
                    <p className="text-gray-300 mb-6">Has completado tu iniciación y despertado tu potencial. Estás listo para el siguiente nivel de tu evolución. Los Programas de Aceleración te esperan.</p>
                    <button 
                        onClick={onNavigateToPrograms}
                        className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-bold py-3 px-8 rounded-lg text-lg transition-transform transform hover:scale-105"
                    >
                        Explorar Programas Premium
                    </button>
                </div>
            )}
        </div>
        </div>
    );
};

export default NexusZeroPage;