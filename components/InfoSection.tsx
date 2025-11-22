import React from 'react';
import { Info, TrendingUp, DollarSign, Clock } from 'lucide-react';

export const InfoSection: React.FC = () => {
  return (
    <div className="mt-12 space-y-8 text-slate-700">
      <div className="bg-white rounded-xl p-8 shadow-sm border border-slate-200">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-brand-100 p-2 rounded-full text-brand-700">
            <Info size={24} />
          </div>
          <h2 className="text-2xl font-bold text-slate-800">Simulador iJota - Rumo ao Milhão</h2>
        </div>
        
        <p className="mb-4 leading-relaxed">
          O Simulador iJota é a ferramenta definitiva para quem deseja alcançar a liberdade financeira. 
          Utilizando cálculos precisos de juros compostos, ajudamos você a visualizar o caminho exato para o seu primeiro milhão de reais.
          Seja ajustando seu orçamento mensal ou definindo prazos, a clareza nos números é o primeiro passo para o sucesso.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Guide Card */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center gap-2 mb-4 text-brand-700">
            <Clock size={20} />
            <h3 className="text-lg font-bold">Como Utilizar</h3>
          </div>
          <ol className="space-y-3 list-decimal list-inside text-sm text-slate-600">
            <li><strong className="text-slate-800">Selecione o Objetivo:</strong> Escolha se deseja descobrir quanto investir por mês ou quanto tempo vai demorar.</li>
            <li><strong className="text-slate-800">Patrimônio Atual:</strong> Insira quanto você já possui investido (Valor Inicial).</li>
            <li><strong className="text-slate-800">Variáveis:</strong> Preencha a taxa de juros esperada e o prazo/aporte conforme sua escolha no passo 1.</li>
            <li><strong className="text-slate-800">Resultado:</strong> Analise os gráficos de evolução e a tabela detalhada para planejar seus próximos passos.</li>
          </ol>
        </div>

        {/* Difference Card */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center gap-2 mb-4 text-brand-700">
            <TrendingUp size={20} />
            <h3 className="text-lg font-bold">Qual modalidade escolher?</h3>
          </div>
          <div className="space-y-4 text-sm">
            <div>
              <h4 className="font-semibold text-slate-800 mb-1 flex items-center gap-1">
                <DollarSign size={14} /> Calcular Aporte Necessário
              </h4>
              <p className="text-slate-600">
                Ideal quando você tem uma <strong>data fixa</strong> (ex: aposentadoria em 15 anos) e precisa saber quanto economizar mensalmente para atingir a meta.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-slate-800 mb-1 flex items-center gap-1">
                <Clock size={14} /> Calcular Prazo para a Meta
              </h4>
              <p className="text-slate-600">
                Ideal quando seu <strong>orçamento mensal é fixo</strong> (ex: posso investir R$ 500/mês) e você quer saber em quanto tempo se tornará milionário.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 rounded-xl p-6 border border-blue-100 text-sm text-blue-800">
        <h4 className="font-bold mb-2">Nota sobre a Metodologia</h4>
        <p>
          Os cálculos consideram juros compostos com reinvestimento total dos dividendos/rendimentos. 
          Para fins de simplificação, não descontamos inflação ou impostos (IR), pois estes variam conforme o tipo de investimento escolhido. 
          Recomendamos utilizar uma taxa de juros real (acima da inflação) para uma projeção mais conservadora de poder de compra.
        </p>
      </div>
    </div>
  );
};