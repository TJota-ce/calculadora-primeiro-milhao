import React, { useState, useRef } from 'react';
import { 
  Calculator, 
  Calendar, 
  Percent, 
  DollarSign, 
  Trash2, 
  TrendingUp,
  PieChart as PieChartIcon,
  ChevronDown,
  ArrowRight
} from 'lucide-react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip as RechartsTooltip, 
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend
} from 'recharts';

import { CalculationType, PeriodType, RateType, CalculationResult } from './types';
import { calculateMillion, formatCurrency } from './utils/finance';
import { InfoSection } from './components/InfoSection';
import { Logo } from './components/Logo';

const App: React.FC = () => {
  // --- State ---
  const [calcType, setCalcType] = useState<CalculationType>(CalculationType.CONTRIBUTION);
  const [initialValue, setInitialValue] = useState<string>('15.000,00');
  const [interestRate, setInterestRate] = useState<string>('8');
  const [rateType, setRateType] = useState<RateType>(RateType.ANNUAL);
  
  const [variableInput, setVariableInput] = useState<string>('10');
  const [periodType, setPeriodType] = useState<PeriodType>(PeriodType.YEARS);

  const [result, setResult] = useState<CalculationResult | null>(null);

  const resultRef = useRef<HTMLDivElement>(null);

  // --- Handlers ---

  const handleCurrencyBlur = (val: string, setter: (v: string) => void) => {
    if (!val) return;
    const clean = val.replace(/\./g, '').replace(',', '.');
    const num = parseFloat(clean);
    
    if (!isNaN(num)) {
      const formatted = new Intl.NumberFormat('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(num);
      setter(formatted);
    }
  };

  const handleCalculate = () => {
    const initVal = parseFloat(initialValue.replace(/\./g, '').replace(',', '.')) || 0;
    const rate = parseFloat(interestRate.replace(',', '.')) || 0;
    const variable = parseFloat(variableInput.replace(/\./g, '').replace(',', '.')) || 0;

    const res = calculateMillion(
      calcType,
      initVal,
      rate,
      rateType,
      variable,
      periodType
    );

    setResult(res);
    
    setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleClear = () => {
    setInitialValue('');
    setInterestRate('');
    setVariableInput('');
    setResult(null);
  };

  const formatTime = (totalMonths: number) => {
    const roundedMonths = Math.ceil(totalMonths);
    const years = Math.floor(roundedMonths / 12);
    const months = roundedMonths % 12;
    
    if (years === 0) return `${months} meses`;
    if (months === 0) return `${years} anos`;
    return `${years} anos e ${months} meses`;
  };

  // --- Render Helpers ---

  const renderCharts = (data: CalculationResult) => {
    const pieData = [
      { name: 'Valor Investido', value: data.totalInvested },
      { name: 'Total em Juros', value: data.totalInterest },
    ];
    const COLORS = ['#64748b', '#0e7490']; 

    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col items-center">
          <h3 className="text-brand-800 font-bold mb-4 text-lg text-center">Composição do Primeiro Milhão:</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip 
                  formatter={(value: number) => formatCurrency(value)}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="w-full mt-4 space-y-3">
            <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-slate-100">
               <div className="flex items-center gap-2">
                 <div className="w-3 h-3 rounded-full bg-slate-500"></div>
                 <span className="text-sm text-slate-600">Valor Investido</span>
               </div>
               <div className="text-right">
                 <div className="font-bold text-slate-800">{formatCurrency(data.totalInvested)}</div>
                 <div className="text-xs text-slate-500">{((data.totalInvested / data.totalAmount) * 100).toFixed(1)}% do total</div>
               </div>
            </div>
            <div className="flex justify-between items-center p-3 bg-brand-50 rounded-lg border border-brand-100">
               <div className="flex items-center gap-2">
                 <div className="w-3 h-3 rounded-full bg-brand-800"></div>
                 <span className="text-sm text-brand-900">Total em Juros</span>
               </div>
               <div className="text-right">
                 <div className="font-bold text-brand-800">{formatCurrency(data.totalInterest)}</div>
                 <div className="text-xs text-brand-600">{((data.totalInterest / data.totalAmount) * 100).toFixed(1)}% do total</div>
               </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-brand-800 font-bold mb-4 text-lg text-center">Evolução no Tempo:</h3>
          <div className="h-80 w-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={data.yearlyBreakdown}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="year" tickLine={false} axisLine={false} tick={{ fill: '#64748b' }} />
                <YAxis 
                  tickFormatter={(value) => `R$ ${(value / 1000)}k`} 
                  tickLine={false} 
                  axisLine={false}
                  tick={{ fill: '#64748b' }}
                />
                <RechartsTooltip 
                  formatter={(value: number) => formatCurrency(value)}
                  labelFormatter={(label) => `Ano ${label}`}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Legend iconType="square" iconSize={10}/>
                <Line type="monotone" dataKey="totalAccumulated" name="Total Acumulado" stroke="#0e7490" strokeWidth={2} dot={{ r: 3, strokeWidth: 1, fill: '#fff', stroke: '#0e7490' }} />
                <Line type="monotone" dataKey="totalInvested" name="Valor Investido" stroke="#000000" strokeWidth={2} dot={{ r: 3, strokeWidth: 1, fill: '#fff', stroke: '#000000' }} />
                <Line type="monotone" dataKey="totalInterest" name="Total em Juros" stroke="#eab308" strokeWidth={2} dot={{ r: 3, strokeWidth: 1, fill: '#fff', stroke: '#eab308' }} />
                <Line type="monotone" dataKey="meta" name="Meta R$ 1 Milhão" stroke="#94a3b8" strokeWidth={2} dot={{ r: 3, strokeWidth: 1, fill: '#fff', stroke: '#94a3b8' }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    );
  };

  const renderCalcTypeSelect = () => (
    <div className="mb-8">
      <label className="block text-sm font-semibold text-slate-700 mb-2">Tipo de Cálculo</label>
      <div className="relative">
        <select 
          value={calcType}
          onChange={(e) => {
            setCalcType(e.target.value as CalculationType);
            if (e.target.value === CalculationType.CONTRIBUTION) {
                setVariableInput('10');
            } else {
                setVariableInput('2.000,00');
            }
          }}
          className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all appearance-none cursor-pointer hover:bg-white"
        >
          <option value={CalculationType.CONTRIBUTION}>Calcular aporte mensal necessário</option>
          <option value={CalculationType.TIME}>Calcular prazo para atingir R$ 1 milhão</option>
        </select>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
          <ChevronDown size={20} />
        </div>
      </div>
    </div>
  );

  const renderInputFields = () => {
    const interestRateInput = (
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">Taxa de juros</label>
        <div className="flex rounded-lg shadow-sm">
          <div className="relative flex-grow focus-within:z-10">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Percent className="h-4 w-4 text-slate-400" />
            </div>
            <input
              type="number"
              value={interestRate}
              onChange={(e) => setInterestRate(e.target.value)}
              className="block w-full pl-10 rounded-l-lg border-slate-200 border p-3 bg-slate-50 text-slate-900 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 focus:bg-white transition-colors outline-none"
              placeholder="0.00"
            />
          </div>
          <select
            value={rateType}
            onChange={(e) => setRateType(e.target.value as RateType)}
            className="rounded-r-lg border border-l-0 border-slate-200 bg-white px-4 py-3 text-slate-600 text-sm hover:bg-slate-50 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-colors cursor-pointer"
          >
            <option value={RateType.ANNUAL}>anual</option>
            <option value={RateType.MONTHLY}>mensal</option>
          </select>
        </div>
      </div>
    );

    const initialValueInput = (
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">Valor inicial</label>
        <div className="relative rounded-lg shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-slate-500 sm:text-sm">R$</span>
          </div>
          <input
            type="text"
            inputMode="decimal"
            value={initialValue}
            onChange={(e) => setInitialValue(e.target.value)}
            onBlur={() => handleCurrencyBlur(initialValue, setInitialValue)}
            className="block w-full pl-10 p-3 rounded-lg border-slate-200 border bg-slate-50 text-slate-900 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 focus:bg-white transition-colors outline-none"
            placeholder="0,00"
          />
        </div>
      </div>
    );

    const monthlyContributionInput = (
       <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Valor mensal
          </label>
          <div className="relative rounded-lg shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-slate-500 sm:text-sm">R$</span>
            </div>
            <input
              type="text"
              inputMode="decimal"
              value={variableInput}
              onChange={(e) => setVariableInput(e.target.value)}
              onBlur={() => handleCurrencyBlur(variableInput, setVariableInput)}
              className="block w-full pl-10 p-3 rounded-lg border-slate-200 border bg-blue-50 text-slate-900 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 focus:bg-white transition-colors outline-none"
              placeholder="2.000,00"
            />
          </div>
       </div>
    );

    const periodInput = (
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">Período</label>
        <div className="flex rounded-lg shadow-sm">
          <div className="relative flex-grow focus-within:z-10">
             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Calendar className="h-4 w-4 text-slate-400" />
             </div>
            <input
              type="number"
              value={variableInput}
              onChange={(e) => setVariableInput(e.target.value)}
              className="block w-full pl-10 rounded-l-lg border-slate-200 border p-3 bg-slate-50 text-slate-900 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 focus:bg-white transition-colors outline-none"
              placeholder="10"
            />
          </div>
          <select
            value={periodType}
            onChange={(e) => setPeriodType(e.target.value as PeriodType)}
            className="rounded-r-lg border border-l-0 border-slate-200 bg-white px-4 py-3 text-slate-600 text-sm hover:bg-slate-50 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-colors cursor-pointer"
          >
            <option value={PeriodType.YEARS}>ano(s)</option>
            <option value={PeriodType.MONTHS}>mês(es)</option>
          </select>
        </div>
      </div>
    );

    return (
      <div className="space-y-8">
        {renderCalcTypeSelect()}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {calcType === CalculationType.CONTRIBUTION ? (
            <>
              <div className="space-y-6">
                {interestRateInput}
                {initialValueInput}
              </div>
              <div className="space-y-6">
                {periodInput}
              </div>
            </>
          ) : (
            <>
              <div className="space-y-6">
                {monthlyContributionInput}
                {initialValueInput}
              </div>
              <div className="space-y-6">
                 {interestRateInput}
              </div>
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-5xl mx-auto">
        <div className="mb-10 flex flex-col items-center justify-center">
          <div className="flex items-center gap-3 mb-2">
            <Logo className="w-12 h-12 text-brand-700" />
            <h1 className="text-4xl font-extrabold text-brand-900 tracking-tight">
              iJota
            </h1>
          </div>
          <p className="text-slate-500 font-medium">Planejamento Financeiro Inteligente</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
          <div className="bg-brand-900 px-8 py-6">
            <h2 className="text-white text-xl font-bold flex items-center gap-2">
              <Calculator className="w-6 h-6 text-brand-200" />
              Calculadora do Primeiro Milhão
            </h2>
          </div>
          
          <div className="p-8">
            {renderInputFields()}

            <div className="mt-8 flex items-center justify-between pt-6 border-t border-slate-100">
               <button 
                onClick={handleCalculate}
                className="bg-brand-800 hover:bg-brand-900 text-white font-bold py-3 px-8 rounded-lg shadow-lg transform transition-all active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-700"
              >
                Calcular
              </button>
              <button 
                onClick={handleClear}
                className="text-slate-500 hover:text-brand-700 text-sm font-medium flex items-center gap-1 transition-colors"
              >
                <Trash2 size={16} />
                Limpar
              </button>
            </div>
          </div>
        </div>

        {result && (
          <div ref={resultRef} className="mt-12 animate-fade-in-up">
            <h2 className="text-2xl font-bold text-brand-900 mb-6 border-l-4 border-brand-700 pl-4">
              Resultado
            </h2>

            <div className="bg-blue-50 border border-blue-100 rounded-xl p-8 mb-8 text-center shadow-sm">
               {calcType === CalculationType.CONTRIBUTION ? (
                 <>
                    <h3 className="text-brand-800 font-bold text-xl mb-2">Aporte necessário calculado!</h3>
                    <p className="text-slate-600 text-lg">
                      Para atingir R$ 1 milhão em <strong className="text-brand-800">{variableInput} {periodType}</strong>
                    </p>
                    <div className="mt-4 text-3xl md:text-4xl font-extrabold text-brand-700">
                      você precisa investir <span className="text-brand-800">{formatCurrency(result.requiredMonthlyContribution || 0)}</span> por mês
                    </div>
                 </>
               ) : (
                 <>
                    <h3 className="text-brand-800 font-bold text-xl mb-2">
                      Você atingirá R$ 1 milhão em {formatTime(result.requiredMonths || 0)}!
                    </h3>
                    <div className="mt-4 text-xl md:text-2xl font-bold text-slate-800">
                      Tempo necessário: <span className="text-brand-800">{formatTime(result.requiredMonths || 0)}</span>
                    </div>
                 </>
               )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="bg-brand-900 text-white rounded-xl p-6 shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <DollarSign size={64} />
                </div>
                <p className="text-brand-200 font-medium text-sm mb-1">Valor total final</p>
                <p className="text-3xl font-bold">{formatCurrency(result.totalAmount)}</p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                <p className="text-slate-500 font-medium text-sm mb-1">Valor total investido</p>
                <p className="text-2xl font-bold text-slate-700">{formatCurrency(result.totalInvested)}</p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                <p className="text-slate-500 font-medium text-sm mb-1">Total em juros</p>
                <p className="text-2xl font-bold text-slate-900">{formatCurrency(result.totalInterest)}</p>
              </div>
            </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                 <div className="bg-green-50 rounded-xl p-6 border border-green-100 text-center flex flex-col justify-center items-center">
                    <p className="text-green-800 font-bold text-sm uppercase tracking-wide mb-2">Poder dos Juros Compostos</p>
                    <p className="text-4xl font-extrabold text-green-600">
                        {((result.totalInterest / result.totalInvested) * 100).toFixed(0)}%
                    </p>
                    <p className="text-green-700 text-sm mt-1">mais em rendimentos do que investido</p>
                 </div>

                 {calcType === CalculationType.CONTRIBUTION ? (
                    <div className="bg-blue-50 rounded-xl p-6 border border-blue-100 text-center flex flex-col justify-center items-center">
                       <p className="text-blue-800 font-bold text-sm uppercase tracking-wide mb-2">Aporte Mensal Necessário</p>
                       <p className="text-3xl font-bold text-blue-700">{formatCurrency(result.requiredMonthlyContribution || 0)}</p>
                    </div>
                 ) : (
                    <div className="bg-blue-50 rounded-xl p-6 border border-blue-100 text-center flex flex-col justify-center items-center">
                        <p className="text-blue-800 font-bold text-sm uppercase tracking-wide mb-2">Tempo para a Meta</p>
                        <p className="text-3xl font-bold text-blue-600">{formatTime(result.requiredMonths || 0)}</p>
                    </div>
                 )}
             </div>

            {renderCharts(result)}

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
               <div className="p-6 border-b border-slate-100 bg-slate-50 text-center">
                 <p className="text-sm text-slate-500 mb-1">Visualização anual • {Math.ceil((result.requiredMonths || 0) / 12)} anos analisados</p>
                 {calcType === CalculationType.TIME && (
                    <p className="text-sm text-slate-600 font-medium">Meta atingida em {formatTime(result.requiredMonths || 0)}</p>
                 )}
                 <p className="text-xs text-slate-400 mt-2">Meta de R$ 1 milhão • Passe o mouse sobre o gráfico para detalhes</p>

                 <h3 className="text-lg font-bold text-brand-900 mt-6">Detalhamento Anual:</h3>
               </div>
               <div className="overflow-x-auto max-h-[500px]">
                 <table className="w-full text-sm text-left">
                   <thead className="bg-slate-100 text-slate-600 sticky top-0 z-10 font-semibold">
                     <tr>
                       <th className="px-6 py-4">Ano</th>
                       <th className="px-6 py-4 text-right">Investimento Anual</th>
                       <th className="px-6 py-4 text-right">Juros do Ano</th>
                       <th className="px-6 py-4 text-right">Total Investido</th>
                       <th className="px-6 py-4 text-right">Total Juros</th>
                       <th className="px-6 py-4 text-right text-brand-900">Total Acumulado</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-100">
                     {result.yearlyBreakdown.map((yearData, index) => (
                       <tr key={yearData.year} className="hover:bg-slate-50 transition-colors">
                         <td className="px-6 py-4 font-medium text-slate-900">{yearData.year}</td>
                         <td className="px-6 py-4 text-right text-slate-600">{formatCurrency(yearData.investedAmount)}</td>
                         <td className="px-6 py-4 text-right text-slate-600">{formatCurrency(yearData.interestAmount - (index > 0 ? result.yearlyBreakdown[index-1].interestAmount : 0))}</td>
                         <td className="px-6 py-4 text-right text-slate-600">{formatCurrency(yearData.totalInvested)}</td>
                         <td className="px-6 py-4 text-right text-brand-700 font-medium">{formatCurrency(yearData.totalInterest)}</td>
                         <td className="px-6 py-4 text-right font-bold text-slate-900">{formatCurrency(yearData.totalAccumulated)}</td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
               </div>
            </div>
          </div>
        )}

        <InfoSection />

        <footer className="mt-16 mb-8 text-center text-slate-400 text-sm">
          <p>© {new Date().getFullYear()} iJota Finanças. Todos os direitos reservados.</p>
        </footer>
      </div>
    </div>
  );
};

export default App;