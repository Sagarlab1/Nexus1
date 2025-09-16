import React from 'react';

const cognitiveGymHtml = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Nexus Sapiens 2.0 - Tu Gimnasio Cognitivo</title>
  <meta name="description" content="Bienvenido a Nexus Sapiens, el primer gimnasio cognitivo del mundo. Entrena tu mente con mentores de IA, simulaciones realistas y una comunidad global.">
  <meta name="keywords" content="gimnasio cognitivo, mentor de IA, aprendizaje adaptativo, simulaciones, pensamiento crítico, creatividad, emprendimiento, IA generativa, Nexus Sapiens">

  <meta property="og:type" content="website">
  <meta property="og:url" content="https://nexus-sapiens.app/">
  <meta property="og:title" content="Nexus Sapiens - El Gimnasio Cognitivo con IA">
  <meta property="og:description" content="Domina las habilidades del futuro entrenando tu mente, no solo consumiendo información.">
  <meta property="og:image" content="https://nexus-sapiens.app/og-image-v2.png">

  <meta property="twitter:card" content="summary_large_image">
  <meta property="twitter:url" content="https://nexus-sapiens.app/">
  <meta property="twitter:title" content="Nexus Sapiens - El Gimnasio Cognitivo con IA">
  <meta property="twitter:description" content="Domina las habilidades del futuro entrenando tu mente, no solo consumiendo información.">
  <meta property="twitter:image" content="https://nexus-sapiens.app/og-image-v2.png">

  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css">

  <style>
    body {
      font-family: 'Inter', sans-serif;
      background-color: #0c0a09; /* Near black for deeper contrast */
      color: #e5e7eb;
      overflow-x: hidden;
    }
    .hero-gradient-text {
      background: linear-gradient(135deg, #a78bfa, #f472b6, #fb923c);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .card-bg {
      background: rgba(31, 41, 55, 0.3);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.1);
    }
    .skill-tree-node {
        transition: all 0.3s ease;
    }
    .skill-tree-node.active {
        background-color: #6366f1;
        box-shadow: 0 0 15px #6366f1;
    }
    .skill-tree-node.locked {
        background-color: #4b5563;
        cursor: not-allowed;
    }
    .skill-tree-line {
        width: 100%;
        height: 2px;
        background-color: #374151;
        position: absolute;
        top: 50%;
        left: 0;
        z-index: -1;
    }
    /* Custom scrollbar for a more futuristic look */
    ::-webkit-scrollbar {
      width: 8px;
    }
    ::-webkit-scrollbar-track {
      background: #0c0a09; 
    }
    ::-webkit-scrollbar-thumb {
      background: #374151; 
      border-radius: 4px;
    }
    ::-webkit-scrollbar-thumb:hover {
      background: #4b5563;
    }
  </style>
</head>
<body class="antialiased">

  <header class="fixed top-0 left-0 right-0 z-50 bg-black/30 backdrop-blur-lg border-b border-white/10">
    <div class="container mx-auto px-6 py-4 flex justify-between items-center">
      <h1 class="text-2xl font-bold tracking-tight hero-gradient-text">Nexus Sapiens</h1>
      <nav class="hidden md:flex items-center space-x-6">
        <a href="#features" class="text-gray-300 hover:text-white transition">La Experiencia</a>
        <a href="#simulations" class="text-gray-300 hover:text-white transition">Simulaciones</a>
        <a href="#community" class="text-gray-300 hover:text-white transition">Comunidad</a>
      </nav>
      <a href="#pricing" class="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2 px-5 rounded-lg transition-transform hover:scale-105">
        Comenzar Evolución
      </a>
    </div>
  </header>

  <main class="pt-24">

    <section class="text-center py-20 lg:py-32 relative overflow-hidden">
        <div class="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>
        <div class="container mx-auto px-6 relative">
            <h2 class="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tighter mb-4">
                Deja de aprender. <br> <span class="hero-gradient-text">Empieza a entrenar tu mente.</span>
            </h2>
            <p class="max-w-2xl mx-auto text-lg md:text-xl text-gray-400 mb-8">
                Nexus Sapiens es el primer gimnasio cognitivo del mundo. Usamos IA para crear un entorno de entrenamiento que te transforma, no solo te informa.
            </p>
            <div class="flex justify-center">
                <a href="#pricing" class="bg-indigo-600 hover:bg-indigo-500 text-white text-lg font-bold py-4 px-8 rounded-lg transition-transform hover:scale-105 shadow-lg shadow-indigo-600/30">
                    Inicia tu Diagnóstico Cognitivo
                </a>
            </div>
        </div>
    </section>

    <section id="features" class="py-20">
      <div class="container mx-auto px-6">
        <div class="text-center mb-12">
          <h3 class="text-4xl font-bold mb-2">Tu Evolución Comienza Aquí</h3>
          <p class="text-lg text-gray-400">No seguimos un currículo. Lo creamos para ti.</p>
        </div>
        
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div class="card-bg p-8 rounded-2xl border-l-4 border-indigo-500">
                <i class="fas fa-brain text-3xl text-indigo-400 mb-4"></i>
                <h4 class="text-2xl font-bold mb-2">1. Diagnóstico Cognitivo</h4>
                <p class="text-gray-400">En una conversación de 5 minutos, tu mentor IA evalúa tus modelos mentales, identifica tus sesgos y entiende tus metas. No es un test, es el inicio de tu viaje.</p>
            </div>
            <div class="card-bg p-8 rounded-2xl border-l-4 border-pink-500">
                <i class="fas fa-sitemap text-3xl text-pink-400 mb-4"></i>
                <h4 class="text-2xl font-bold mb-2">2. Tu Árbol de Competencias</h4>
                <p class="text-gray-400">Visualiza tu progreso en un mapa mental interactivo. Desbloquea nuevas habilidades y elige tu propio camino hacia la maestría, con la guía constante de tu mentor.</p>
            </div>
            <div class="card-bg p-8 rounded-2xl border-l-4 border-amber-500">
                <i class="fas fa-briefcase text-3xl text-amber-400 mb-4"></i>
                <h4 class="text-2xl font-bold mb-2">3. Portfolio Inteligente</h4>
                <p class="text-gray-400">Cada simulación completada y proyecto resuelto se añade automáticamente a un portfolio profesional que demuestra tus capacidades, no solo tus certificados.</p>
            </div>
        </div>

        <div class="mt-16 text-center">
            <h4 class="text-2xl font-bold mb-8">Ejemplo de tu Árbol de "Pensamiento Crítico"</h4>
            <div class="flex items-center justify-center space-x-4 relative">
                <div class="skill-tree-line"></div>
                <div class="z-10 text-center">
                    <div class="skill-tree-node active w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-2"><i class="fas fa-check text-2xl"></i></div>
                    <p class="font-semibold">Fundamentos</p>
                </div>
                <div class="z-10 text-center">
                    <div class="skill-tree-node active w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-2"><i class="fas fa-check text-2xl"></i></div>
                    <p class="font-semibold">Detección de Sesgos</p>
                </div>
                <div class="z-10 text-center">
                    <div class="skill-tree-node w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-2 bg-indigo-600 ring-4 ring-indigo-400 animate-pulse"><i class="fas fa-spinner fa-spin text-2xl"></i></div>
                    <p class="font-semibold text-indigo-300">Argumentación</p>
                </div>
                <div class="z-10 text-center">
                    <div class="skill-tree-node locked w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-2"><i class="fas fa-lock text-2xl"></i></div>
                    <p class="font-semibold text-gray-500">Modelos Mentales</p>
                </div>
            </div>
        </div>
      </div>
    </section>

    <section id="simulations" class="py-20 bg-gray-900/50">
        <div class="container mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
            <div class="order-2 lg:order-1">
                <h3 class="text-4xl font-bold mb-4 hero-gradient-text">Conversa con tu Mentor</h3>
                <p class="text-lg text-gray-400 mb-8">Recibe feedback instantáneo y desafiante. Nuestra IA no te da las respuestas, te enseña a encontrarlas.</p>
                
                <div class="card-bg rounded-xl p-4 shadow-2xl">
                    <div class="flex items-center mb-4">
                        <img src="https://via.placeholder.com/40" class="rounded-full mr-3 border-2 border-indigo-500" alt="Avatar IA">
                        <h5 class="font-bold text-lg">Mentor Socrático</h5>
                    </div>
                    <div class="space-y-4 text-sm">
                        <div class="flex">
                            <div class="bg-gray-700 p-3 rounded-lg max-w-xs">
                                <p>Basado en tu meta de lanzar una startup, te propongo esta simulación: "Crisis de Producto". ¿Estás listo?</p>
                            </div>
                        </div>
                        <div class="flex justify-end">
                            <div class="bg-indigo-600 text-white p-3 rounded-lg max-w-xs">
                                <p>Sí, empecemos.</p>
                            </div>
                        </div>
                        <div class="flex">
                            <div class="bg-gray-700 p-3 rounded-lg max-w-xs">
                                <p>Excelente. Tu principal cliente reporta un fallo crítico. Tus ingenieros dicen que la solución tomará 2 semanas. El cliente amenaza con irse. ¿Qué decisión tomas primero y por qué?</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="order-1 lg:order-2 space-y-6">
                 <h3 class="text-4xl font-bold mb-4 text-right">Entrena en los Nexus Labs</h3>
                 <div class="card-bg p-6 rounded-xl flex items-center space-x-6 hover:border-pink-500 hover:scale-105 transition-all cursor-pointer">
                    <i class="fas fa-rocket text-4xl text-pink-400"></i>
                    <div>
                        <h4 class="text-xl font-bold">Startup Simulator</h4>
                        <p class="text-gray-400">Gestiona recursos, haz un pitch a inversores (IA) y navega crisis de mercado.</p>
                    </div>
                 </div>
                 <div class="card-bg p-6 rounded-xl flex items-center space-x-6 hover:border-amber-500 hover:scale-105 transition-all cursor-pointer">
                    <i class="fas fa-lightbulb text-4xl text-amber-400"></i>
                    <div>
                        <h4 class="text-xl font-bold">Generador de Ideas Disruptivas</h4>
                        <p class="text-gray-400">Recibe retos creativos y aprende a conectar conceptos aparentemente inconexos.</p>
                    </div>
                 </div>
                 <div class="card-bg p-6 rounded-xl flex items-center space-x-6 hover:border-indigo-500 hover:scale-105 transition-all cursor-pointer">
                    <i class="fas fa-gavel text-4xl text-indigo-400"></i>
                    <div>
                        <h4 class="text-xl font-bold">Caso de Decisión Estratégica</h4>
                        <p class="text-gray-400">Analiza datos complejos bajo presión y defiende tus decisiones frente a la IA.</p>
                    </div>
                 </div>
            </div>
        </div>
    </section>

    <section id="community" class="py-20">
        <div class="container mx-auto px-6 text-center">
            <h3 class="text-4xl font-bold mb-2">No Estás Solo en tu Evolución</h3>
            <p class="text-lg text-gray-400 mb-12 max-w-2xl mx-auto">La IA te conecta con una red global de mentes curiosas para colaborar, competir y crecer juntos.</p>
            <div class="grid md:grid-cols-2 gap-8 text-left">
                <div class="card-bg p-8 rounded-2xl">
                    <i class="fas fa-users text-3xl text-indigo-400 mb-4"></i>
                    <h4 class="text-2xl font-bold mb-2">Masterminds IA-Facilitados</h4>
                    <p class="text-gray-400">Nuestro algoritmo te agrupa con 3-5 miembros con metas compatibles. La IA actúa como moderador, proponiendo retos y asegurando que cada sesión sea productiva.</p>
                </div>
                <div class="card-bg p-8 rounded-2xl">
                    <i class="fas fa-comments text-3xl text-pink-400 mb-4"></i>
                    <h4 class="text-2xl font-bold mb-2">Peer Review Asistido</h4>
                    <p class="text-gray-400">Evalúa los proyectos de otros con una guía de la IA que te ayuda a dar feedback valioso y constructivo, mejorando tus propias habilidades de análisis en el proceso.</p>
                </div>
            </div>
        </div>
    </section>

    <section id="pricing" class="py-20">
      <div class="container mx-auto px-6 text-center">
        <h3 class="text-4xl font-bold mb-12">Elige tu Plan de Entrenamiento</h3>
        <div class="grid lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          
          <div class="card-bg p-8 rounded-2xl border-t-4 border-indigo-500 transform hover:scale-105 transition-transform duration-300">
            <h4 class="text-2xl font-bold mb-2">Nexus Pro</h4>
            <p class="text-5xl font-bold mb-4">$49<span class="text-xl text-gray-400">/mes</span></p>
            <ul class="space-y-3 text-gray-300 mb-8">
              <li><i class="fas fa-check text-green-500 mr-2"></i>Acceso a todos los Labs</li>
              <li><i class="fas fa-check text-green-500 mr-2"></i>Mentor IA Ilimitado</li>
              <li><i class="fas fa-check text-green-500 mr-2"></i>Portfolio Inteligente</li>
              <li><i class="fas fa-check text-green-500 mr-2"></i>Acceso a la Comunidad</li>
            </ul>
            <button class="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-6 rounded-lg">Empezar Entrenamiento</button>
          </div>
          
          <div class="card-bg p-8 rounded-2xl border-t-4 border-pink-500 transform scale-105 shadow-2xl shadow-pink-500/20">
            <p class="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2 bg-pink-500 text-white text-sm font-bold px-4 py-1 rounded-full">MÁS POPULAR</p>
            <h4 class="text-2xl font-bold mb-2">Nexus Teams</h4>
            <p class="text-5xl font-bold mb-4">$39<span class="text-xl text-gray-400">/usuario/mes</span></p>
            <ul class="space-y-3 text-gray-300 mb-8">
              <li><i class="fas fa-check text-green-500 mr-2"></i>Todo en Pro</li>
              <li><i class="fas fa-check text-green-500 mr-2"></i>Dashboard de Equipo</li>
              <li><i class="fas fa-check text-green-500 mr-2"></i>Masterminds Privados</li>
              <li><i class="fas fa-check text-green-500 mr-2"></i>Soporte Prioritario</li>
            </ul>
            <button class="w-full bg-pink-500 hover:bg-pink-400 text-white font-bold py-3 px-6 rounded-lg">Contactar a Ventas</button>
          </div>
          
          <div class="card-bg p-8 rounded-2xl border-t-4 border-amber-500 transform hover:scale-105 transition-transform duration-300">
            <h4 class="text-2xl font-bold mb-2">Nexus Ventures</h4>
            <p class="text-5xl font-bold mb-4">Aplicar</p>
            <ul class="space-y-3 text-gray-300 mb-8">
                <li><i class="fas fa-check text-green-500 mr-2"></i>Todo en Teams</li>
                <li><i class="fas fa-star text-amber-400 mr-2"></i>Conexiones con Inversores</li>
                <li><i class="fas fa-star text-amber-400 mr-2"></i>Mentoría Humana de Élite</li>
                <li><i class="fas fa-star text-amber-400 mr-2"></i>Acceso a Incubadora</li>
            </ul>
            <button class="w-full bg-amber-600 hover:bg-amber-500 text-white font-bold py-3 px-6 rounded-lg">Enviar Aplicación</button>
          </div>

        </div>
      </div>
    </section>

  </main>

  <footer class="border-t border-white/10 mt-20">
      <div class="container mx-auto px-6 py-8 text-center text-gray-400">
          <p>&copy; 2024 Nexus Sapiens. Todos los derechos reservados.</p>
          <div class="mt-4 flex justify-center space-x-6">
              <a href="#" class="hover:text-white">Twitter</a>
              <a href="#" class="hover:text-white">LinkedIn</a>
              <a href="#" class="hover:text-white">Política de Privacidad</a>
          </div>
      </div>
  </footer>

</body>
</html>
`;

const CognitiveGymPage: React.FC = () => {
  return (
    <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-lg shadow-lg shadow-black/20 h-full overflow-hidden">
      <iframe
        srcDoc={cognitiveGymHtml}
        title="Gimnasio Cognitivo Experimental"
        className="w-full h-full border-0"
      />
    </div>
  );
};

export default CognitiveGymPage;
