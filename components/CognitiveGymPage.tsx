import React from 'react';

const CognitiveGymPage: React.FC = () => {
  return (
    <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-lg shadow-lg shadow-black/20 h-full overflow-y-auto text-gray-200">
        <div className="antialiased" style={{backgroundColor: '#0c0a09'}}>
            <main>
                <section className="text-center py-20 lg:py-32 relative overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>
                    <div className="container mx-auto px-6 relative">
                        <h2 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tighter mb-4">
                            Deja de aprender. <br /> <span className="hero-gradient-text">Empieza a entrenar tu mente.</span>
                        </h2>
                        <p className="max-w-2xl mx-auto text-lg md:text-xl text-gray-400 mb-8">
                            Nexus Sapiens es el primer gimnasio cognitivo del mundo. Usamos IA para crear un entorno de entrenamiento que te transforma, no solo te informa.
                        </p>
                        <div className="flex justify-center">
                            <a href="#pricing" className="bg-indigo-600 hover:bg-indigo-500 text-white text-lg font-bold py-4 px-8 rounded-lg transition-transform hover:scale-105 shadow-lg shadow-indigo-600/30">
                                Inicia tu Diagnóstico Cognitivo
                            </a>
                        </div>
                    </div>
                </section>

                <section id="features" className="py-20">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-12">
                    <h3 className="text-4xl font-bold mb-2">Tu Evolución Comienza Aquí</h3>
                    <p className="text-lg text-gray-400">No seguimos un currículo. Lo creamos para ti.</p>
                    </div>
                    
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <div className="card-bg p-8 rounded-2xl border-l-4 border-indigo-500">
                            <i className="fas fa-brain text-3xl text-indigo-400 mb-4"></i>
                            <h4 className="text-2xl font-bold mb-2">1. Diagnóstico Cognitivo</h4>
                            <p className="text-gray-400">En una conversación de 5 minutos, tu mentor IA evalúa tus modelos mentales, identifica tus sesgos y entiende tus metas. No es un test, es el inicio de tu viaje.</p>
                        </div>
                        <div className="card-bg p-8 rounded-2xl border-l-4 border-pink-500">
                            <i className="fas fa-sitemap text-3xl text-pink-400 mb-4"></i>
                            <h4 className="text-2xl font-bold mb-2">2. Tu Árbol de Competencias</h4>
                            <p className="text-gray-400">Visualiza tu progreso en un mapa mental interactivo. Desbloquea nuevas habilidades y elige tu propio camino hacia la maestría, con la guía constante de tu mentor.</p>
                        </div>
                        <div className="card-bg p-8 rounded-2xl border-l-4 border-amber-500">
                            <i className="fas fa-briefcase text-3xl text-amber-400 mb-4"></i>
                            <h4 className="text-2xl font-bold mb-2">3. Portfolio Inteligente</h4>
                            <p className="text-gray-400">Cada simulación completada y proyecto resuelto se añade automáticamente a un portfolio profesional que demuestra tus capacidades, no solo tus certificados.</p>
                        </div>
                    </div>

                    <div className="mt-16 text-center">
                        <h4 className="text-2xl font-bold mb-8">Ejemplo de tu Árbol de "Pensamiento Crítico"</h4>
                        <div className="flex items-center justify-center space-x-4 relative">
                            <div className="skill-tree-line"></div>
                            <div className="z-10 text-center">
                                <div className="skill-tree-node active w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-2"><i className="fas fa-check text-2xl"></i></div>
                                <p className="font-semibold">Fundamentos</p>
                            </div>
                            <div className="z-10 text-center">
                                <div className="skill-tree-node active w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-2"><i className="fas fa-check text-2xl"></i></div>
                                <p className="font-semibold">Detección de Sesgos</p>
                            </div>
                            <div className="z-10 text-center">
                                <div className="skill-tree-node w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-2 bg-indigo-600 ring-4 ring-indigo-400 animate-pulse"><i className="fas fa-spinner fa-spin text-2xl"></i></div>
                                <p className="font-semibold text-indigo-300">Argumentación</p>
                            </div>
                            <div className="z-10 text-center">
                                <div className="skill-tree-node locked w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-2"><i className="fas fa-lock text-2xl"></i></div>
                                <p className="font-semibold text-gray-500">Modelos Mentales</p>
                            </div>
                        </div>
                    </div>
                </div>
                </section>

                <section id="simulations" className="py-20 bg-gray-900/50">
                    <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
                        <div className="order-2 lg:order-1">
                            <h3 className="text-4xl font-bold mb-4 hero-gradient-text">Conversa con tu Mentor</h3>
                            <p className="text-lg text-gray-400 mb-8">Recibe feedback instantáneo y desafiante. Nuestra IA no te da las respuestas, te enseña a encontrarlas.</p>
                            
                            <div className="card-bg rounded-xl p-4 shadow-2xl">
                                <div className="flex items-center mb-4">
                                    <img src="https://via.placeholder.com/40" className="rounded-full mr-3 border-2 border-indigo-500" alt="Avatar IA" />
                                    <h5 className="font-bold text-lg">Mentor Socrático</h5>
                                </div>
                                <div className="space-y-4 text-sm">
                                    <div className="flex">
                                        <div className="bg-gray-700 p-3 rounded-lg max-w-xs">
                                            <p>Basado en tu meta de lanzar una startup, te propongo esta simulación: "Crisis de Producto". ¿Estás listo?</p>
                                        </div>
                                    </div>
                                    <div className="flex justify-end">
                                        <div className="bg-indigo-600 text-white p-3 rounded-lg max-w-xs">
                                            <p>Sí, empecemos.</p>
                                        </div>
                                    </div>
                                    <div className="flex">
                                        <div className="bg-gray-700 p-3 rounded-lg max-w-xs">
                                            <p>Excelente. Tu principal cliente reporta un fallo crítico. Tus ingenieros dicen que la solución tomará 2 semanas. El cliente amenaza con irse. ¿Qué decisión tomas primero y por qué?</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="order-1 lg:order-2 space-y-6">
                            <h3 className="text-4xl font-bold mb-4 text-right">Entrena en los Nexus Labs</h3>
                            <div className="card-bg p-6 rounded-xl flex items-center space-x-6 hover:border-pink-500 hover:scale-105 transition-all cursor-pointer">
                                <i className="fas fa-rocket text-4xl text-pink-400"></i>
                                <div>
                                    <h4 className="text-xl font-bold">Startup Simulator</h4>
                                    <p className="text-gray-400">Gestiona recursos, haz un pitch a inversores (IA) y navega crisis de mercado.</p>
                                </div>
                            </div>
                            <div className="card-bg p-6 rounded-xl flex items-center space-x-6 hover:border-amber-500 hover:scale-105 transition-all cursor-pointer">
                                <i className="fas fa-lightbulb text-4xl text-amber-400"></i>
                                <div>
                                    <h4 className="text-xl font-bold">Generador de Ideas Disruptivas</h4>
                                    <p className="text-gray-400">Recibe retos creativos y aprende a conectar conceptos aparentemente inconexos.</p>
                                </div>
                            </div>
                            <div className="card-bg p-6 rounded-xl flex items-center space-x-6 hover:border-indigo-500 hover:scale-105 transition-all cursor-pointer">
                                <i className="fas fa-gavel text-4xl text-indigo-400"></i>
                                <div>
                                    <h4 className="text-xl font-bold">Caso de Decisión Estratégica</h4>
                                    <p className="text-gray-400">Analiza datos complejos bajo presión y defiende tus decisiones frente a la IA.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section id="community" className="py-20">
                    <div className="container mx-auto px-6 text-center">
                        <h3 className="text-4xl font-bold mb-2">No Estás Solo en tu Evolución</h3>
                        <p className="text-lg text-gray-400 mb-12 max-w-2xl mx-auto">La IA te conecta con una red global de mentes curiosas para colaborar, competir y crecer juntos.</p>
                        <div className="grid md:grid-cols-2 gap-8 text-left">
                            <div className="card-bg p-8 rounded-2xl">
                                <i className="fas fa-users text-3xl text-indigo-400 mb-4"></i>
                                <h4 className="text-2xl font-bold mb-2">Masterminds IA-Facilitados</h4>
                                <p className="text-gray-400">Nuestro algoritmo te agrupa con 3-5 miembros con metas compatibles. La IA actúa como moderador, proponiendo retos y asegurando que cada sesión sea productiva.</p>
                            </div>
                            <div className="card-bg p-8 rounded-2xl">
                                <i className="fas fa-comments text-3xl text-pink-400 mb-4"></i>
                                <h4 className="text-2xl font-bold mb-2">Peer Review Asistido</h4>
                                <p className="text-gray-400">Evalúa los proyectos de otros con una guía de la IA que te ayuda a dar feedback valioso y constructivo, mejorando tus propias habilidades de análisis en el proceso.</p>
                            </div>
                        </div>
                    </div>
                </section>

                <section id="pricing" className="py-20">
                <div className="container mx-auto px-6 text-center">
                    <h3 className="text-4xl font-bold mb-12">Elige tu Plan de Entrenamiento</h3>
                    <div className="grid lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    
                    <div className="card-bg p-8 rounded-2xl border-t-4 border-indigo-500 transform hover:scale-105 transition-transform duration-300">
                        <h4 className="text-2xl font-bold mb-2">Nexus Pro</h4>
                        <p className="text-5xl font-bold mb-4">$49<span className="text-xl text-gray-400">/mes</span></p>
                        <ul className="space-y-3 text-gray-300 mb-8 text-left">
                        <li><i className="fas fa-check text-green-500 mr-2"></i>Acceso a todos los Labs</li>
                        <li><i className="fas fa-check text-green-500 mr-2"></i>Mentor IA Ilimitado</li>
                        <li><i className="fas fa-check text-green-500 mr-2"></i>Portfolio Inteligente</li>
                        <li><i className="fas fa-check text-green-500 mr-2"></i>Acceso a la Comunidad</li>
                        </ul>
                        <button className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-6 rounded-lg">Empezar Entrenamiento</button>
                    </div>
                    
                    <div className="card-bg p-8 rounded-2xl border-t-4 border-pink-500 transform scale-105 shadow-2xl shadow-pink-500/20 relative">
                        <p className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2 bg-pink-500 text-white text-sm font-bold px-4 py-1 rounded-full">MÁS POPULAR</p>
                        <h4 className="text-2xl font-bold mb-2">Nexus Teams</h4>
                        <p className="text-5xl font-bold mb-4">$39<span className="text-xl text-gray-400">/usuario/mes</span></p>
                        <ul className="space-y-3 text-gray-300 mb-8 text-left">
                        <li><i className="fas fa-check text-green-500 mr-2"></i>Todo en Pro</li>
                        <li><i className="fas fa-check text-green-500 mr-2"></i>Dashboard de Equipo</li>
                        <li><i className="fas fa-check text-green-500 mr-2"></i>Masterminds Privados</li>
                        <li><i className="fas fa-check text-green-500 mr-2"></i>Soporte Prioritario</li>
                        </ul>
                        <button className="w-full bg-pink-500 hover:bg-pink-400 text-white font-bold py-3 px-6 rounded-lg">Contactar a Ventas</button>
                    </div>
                    
                    <div className="card-bg p-8 rounded-2xl border-t-4 border-amber-500 transform hover:scale-105 transition-transform duration-300">
                        <h4 className="text-2xl font-bold mb-2">Nexus Ventures</h4>
                        <p className="text-5xl font-bold mb-4">Aplicar</p>
                        <ul className="space-y-3 text-gray-300 mb-8 text-left">
                            <li><i className="fas fa-check text-green-500 mr-2"></i>Todo en Teams</li>
                            <li><i className="fas fa-star text-amber-400 mr-2"></i>Conexiones con Inversores</li>
                            <li><i className="fas fa-star text-amber-400 mr-2"></i>Mentoría Humana de Élite</li>
                            <li><i className="fas fa-star text-amber-400 mr-2"></i>Acceso a Incubadora</li>
                        </ul>
                        <button className="w-full bg-amber-600 hover:bg-amber-500 text-white font-bold py-3 px-6 rounded-lg">Enviar Aplicación</button>
                    </div>

                    </div>
                </div>
                </section>
            </main>
        </div>
    </div>
  );
};

export default CognitiveGymPage;
