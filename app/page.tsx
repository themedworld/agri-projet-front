import Header from './component/header';
import Image from 'next/image';
import Link from 'next/link'; // Correction : Import Next.js standard
import { ArrowRight, Play, Sprout, AlertTriangle, ScanLine, Leaf } from 'lucide-react';

export default function Home() {
  return (
    // Changement du fond de base vers un vert très sombre (Green-950) pour l'ambiance Agritech
    <div className="relative min-h-screen lg:h-screen bg-green-50 text-white overflow-hidden font-sans selection:bg-emerald-50/30">
      
      {/* --- ARRIÈRE-PLAN --- */}
      <div className="absolute inset-0 z-0">
        <Image 
          // Image de champ de blé vue de haut (Agriculture de précision)
          src="https://images.unsplash.com/photo-1625246333195-00305256a836?q=80&w=2070&auto=format&fit=crop"
          alt="Agriculture Drone View"
          fill
          className="object-cover opacity-30 scale-105"
          priority
        />
        {/* Dégradé pour assombrir et faire ressortir le texte, avec une teinte verte */}
        <div className="absolute inset-0 bg-gradient-to-r from-green-950 via-green-900/80 to-green-950/50"></div>
      </div>

      {/* HEADER */}
      <Header /> 

      {/* --- CONTENU PRINCIPAL --- */}
      <main className="relative z-10 h-full flex flex-col justify-center px-6 md:px-12 lg:px-24 pt-20 lg:pt-0">
        
        <div className="grid lg:grid-cols-12 gap-12 items-center w-full max-w-7xl mx-auto">
          
          {/* COLONNE GAUCHE : Pitch Agritech */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Badge version */}


            <h1 className="text-5xl lg:text-7xl font-bold tracking-tight leading-[1.1]">
              Sauvez vos récoltes, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-lime-400 to-emerald-500">
                ciblez l'invisible.
              </span>
            </h1>

            <p className="text-lg text-slate-300 max-w-lg leading-relaxed">
              AgroScan détecte les maladies fongiques et le stress hydrique sur vos grandes cultures avant l'œil humain. 
              Analysez vos parcelles de blé par satellite et drone pour un rendement optimal.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <Link href="/demo">
                <button className="group flex items-center gap-2 px-6 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-semibold transition-all shadow-[0_0_20px_-5px_rgba(16,185,129,0.4)]">
                  Analyser ma parcelle
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
              
              <button className="flex items-center gap-2 px-6 py-3.5 rounded-lg border border-white/10 hover:bg-white/5 transition-colors font-medium text-emerald-100">
                <Play className="w-4 h-4 fill-current" />
                Voir la démo
              </button>
            </div>
            
            {/* Social Proof / Footer */}
            <div className="pt-8 border-t border-white/5 mt-8">
               <p className="text-xs text-emerald-200/60 mb-2">ILS NOUS FONT CONFIANCE</p>
               <div className="flex gap-6 text-sm text-slate-400 font-semibold opacity-70">
                  <span>AGRO-EST</span>
                  <span>CÉRÉALES FRANCE</span>
                  <span>VIVESCIA</span>
               </div>
            </div>
          </div>

          {/* COLONNE DROITE : Dashboard Flottant Agritech */}
          <div className="lg:col-span-5 relative hidden lg:block">
            
            {/* Carte principale Glassmorphism */}
            <div className="relative bg-green-950/40 backdrop-blur-xl border border-emerald-500/20 rounded-2xl p-6 shadow-2xl transform rotate-1 hover:rotate-0 transition-all duration-500">
                
                {/* En-tête fausse fenêtre */}
                <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-4">
                    <div className="flex items-center gap-3">
                        <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse"></div>
                        <div className="text-xs text-emerald-100/70 font-mono">SCAN EN COURS : PARCELLE BLÉ SUD-4</div>
                    </div>
                </div>

                {/* KPI AGRICOLES */}
                <div className="space-y-4">

                  {/* KPI 1 : Santé Végétale */}
                  <div className="flex items-center justify-between p-4 bg-green-900/40 rounded-lg border border-emerald-500/10 hover:border-emerald-500/30 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-emerald-500/20 rounded-md text-emerald-400">
                        <Leaf size={18} />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-emerald-50">
                          Indice NDVI (Biomasse)
                        </div>
                        <div className="text-xs text-emerald-400/60">
                          Vigueur végétative
                        </div>
                      </div>
                    </div>
                    <span className="text-lg font-bold text-emerald-400">
                      0.85
                    </span>
                  </div>

                  {/* KPI 2 : Alerte Maladie */}
                  <div className="flex items-center justify-between p-4 bg-green-900/40 rounded-lg border border-amber-500/20 hover:border-amber-500/40 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-amber-500/10 rounded-md text-amber-400">
                        <AlertTriangle size={18} />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-emerald-50">
                          Risque Rouille Jaune
                        </div>
                        <div className="text-xs text-amber-400/80">
                          Zone Nord-Est détectée
                        </div>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-amber-400 border border-amber-500/30 px-2 py-1 rounded">
                      MODÉRÉ
                    </span>
                  </div>

                  {/* KPI 3 : Surface Scannée */}
                  <div className="flex items-center justify-between p-4 bg-green-900/40 rounded-lg border border-emerald-500/10">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-500/10 rounded-md text-blue-400">
                        <ScanLine size={18} />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-emerald-50">
                          Surface Analysée
                        </div>
                        <div className="text-xs text-emerald-400/60">
                          Dernières 24h
                        </div>
                      </div>
                    </div>
                    <span className="text-lg font-semibold text-white">
                      450 <span className="text-xs font-normal text-slate-400">ha</span>
                    </span>
                  </div>

                </div>

                {/* Élément décoratif arrière (Glow vert) */}
                <div className="absolute -inset-4 bg-gradient-to-tr from-emerald-600 to-lime-600 rounded-2xl blur-3xl opacity-20 -z-10"></div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}