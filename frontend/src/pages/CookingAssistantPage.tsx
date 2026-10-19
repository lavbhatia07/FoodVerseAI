import React, { useState, useEffect, useRef } from 'react';
import {
  ChefHat,
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Clock,
  Layers,
  ArrowRight,
  HelpCircle,
  CheckCircle2
} from 'lucide-react';
import { api } from '../services/api';
import { CookingChatResponse, Recipe, SubstituteOption } from '../types';

export const CookingAssistantPage: React.FC = () => {
  const [messages, setMessages] = useState<Array<{ role: string; content: string; recipe?: Recipe }>>([
    {
      role: 'assistant',
      content: 'Welcome to **FoodVerse Smart Cooking Assistant**! Tell me what ingredients you have in your pantry, or request a custom recipe with your dietary preferences.'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeRecipe, setActiveRecipe] = useState<Recipe | null>(null);

  // Timer state for step-by-step cooking
  const [activeStepIndex, setActiveStepIndex] = useState<number | null>(null);
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const [timerRunning, setTimerRunning] = useState<boolean>(false);

  // Speech Recognition & Synthesis
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Substitution state
  const [substituteQuery, setSubstituteQuery] = useState('');
  const [substituteResult, setSubstituteResult] = useState<{ ingredient: string; substitutes: SubstituteOption[]; explanation: string } | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Timer tick
  useEffect(() => {
    let interval: any = null;
    if (timerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds(prev => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0 && timerRunning) {
      setTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [timerRunning, timerSeconds]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim() || loading) return;

    const userMsg = { role: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setLoading(true);

    try {
      const res: CookingChatResponse = await api.cookingChat(text);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: res.reply,
        recipe: res.recipe
      }]);
      if (res.recipe) {
        setActiveRecipe(res.recipe);
      }
    } catch (err: any) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `Sorry, I encountered an error: ${err.message}`
      }]);
    } finally {
      setLoading(false);
    }
  };

  // Web Speech API: Text-to-Speech
  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      if (isSpeaking) {
        setIsSpeaking(false);
        return;
      }
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      setIsSpeaking(true);
      window.speechSynthesis.speak(utterance);
    } else {
      alert("Speech synthesis is not supported on this browser.");
    }
  };

  // Web Speech API: Voice dictation
  const toggleListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported on this browser.");
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInputMessage(transcript);
      setIsListening(false);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    recognition.start();
  };

  const startStepTimer = (stepIdx: number, seconds: number) => {
    setActiveStepIndex(stepIdx);
    setTimerSeconds(seconds);
    setTimerRunning(true);
  };

  const handleLookupSubstitute = async () => {
    if (!substituteQuery.trim()) return;
    try {
      const res = await api.getSubstitute(substituteQuery.trim());
      setSubstituteResult({
        ingredient: res.ingredient,
        substitutes: res.substitutes,
        explanation: res.culinary_explanation
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div className="glass-panel" style={{ padding: '2rem 2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.5rem' }}>
          <div style={{ padding: '8px', borderRadius: '8px', background: 'rgba(163, 230, 53, 0.2)', color: 'var(--lime-400)' }}>
            <ChefHat size={22} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.85rem' }}>Smart Cooking Assistant & Recipe Builder</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Conversational culinary intelligence with pantry recipe synthesis, hands-free voice timers, and ingredient substitutions.
            </p>
          </div>
        </div>
      </div>

      <div className="grid-2">
        {/* Left Column: Interactive Chat Console */}
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', height: '640px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-subtle)', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>Culinary Dialogue</span>
            </h3>
            <span className="badge badge-emerald">Hands-Free Enabled</span>
          </div>

          {/* Messages Scroll Area */}
          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem', paddingRight: '0.5rem' }}>
            {messages.map((m, idx) => (
              <div
                key={idx}
                style={{
                  alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '85%',
                  background: m.role === 'user' ? 'rgba(16, 185, 129, 0.2)' : 'var(--surface-glass-card)',
                  border: `1px solid ${m.role === 'user' ? 'rgba(52, 211, 153, 0.4)' : 'var(--border-subtle)'}`,
                  borderRadius: 'var(--radius-md)',
                  padding: '0.85rem 1rem'
                }}
              >
                <div style={{ fontSize: '0.72rem', color: m.role === 'user' ? 'var(--emerald-400)' : 'var(--lime-400)', fontWeight: 600, marginBottom: '0.25rem', textTransform: 'uppercase' }}>
                  {m.role === 'user' ? 'You' : 'Chef Assistant'}
                </div>
                <div style={{ fontSize: '0.88rem', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                  {m.content}
                </div>

                {m.recipe && (
                  <button
                    onClick={() => setActiveRecipe(m.recipe!)}
                    className="btn-secondary"
                    style={{ marginTop: '0.75rem', padding: '0.4rem 0.8rem', fontSize: '0.78rem' }}
                  >
                    <ChefHat size={14} color="var(--lime-400)" />
                    <span>View Recipe: {m.recipe.title}</span>
                  </button>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input & Voice Controls */}
          <div style={{ paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <button
              onClick={toggleListening}
              style={{
                background: isListening ? 'rgba(251, 113, 133, 0.25)' : 'rgba(255, 255, 255, 0.08)',
                border: `1px solid ${isListening ? 'var(--rose-400)' : 'var(--border-subtle)'}`,
                color: isListening ? 'var(--rose-400)' : 'var(--text-muted)',
                borderRadius: 'var(--radius-md)',
                padding: '0.75rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              title={isListening ? "Listening... click to stop" : "Speak your message (Voice dictation)"}
            >
              {isListening ? <MicOff size={18} /> : <Mic size={18} />}
            </button>

            <input
              type="text"
              className="input-field"
              placeholder="Ask a recipe, list ingredients, or request substitutions..."
              value={inputMessage}
              onChange={e => setInputMessage(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
            />

            <button
              className="btn-primary"
              onClick={() => handleSendMessage()}
              disabled={loading || !inputMessage.trim()}
              style={{ padding: '0.75rem 1.25rem' }}
            >
              <Send size={16} />
            </button>
          </div>
        </div>

        {/* Right Column: Recipe Interactive Console & Timers */}
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', height: '640px', overflowY: 'auto' }}>
          {activeRecipe ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <div>
                  <span className="badge badge-emerald" style={{ marginBottom: '0.35rem' }}>
                    {activeRecipe.difficulty} • {activeRecipe.servings} Servings
                  </span>
                  <h2 style={{ fontSize: '1.45rem', color: '#fff' }}>{activeRecipe.title}</h2>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                    Prep: {activeRecipe.prep_time_min} mins | Cook: {activeRecipe.cook_time_min} mins | {activeRecipe.calories_per_serving || 450} kcal/serving
                  </div>
                </div>

                <button
                  onClick={() => speakText(`${activeRecipe.title}. Ingredients: ${activeRecipe.ingredients.map(i => i.name).join(', ')}`)}
                  className="btn-secondary"
                  style={{ padding: '0.4rem 0.8rem', fontSize: '0.78rem' }}
                  title="Read aloud via Text-to-Speech"
                >
                  {isSpeaking ? <VolumeX size={15} color="var(--rose-400)" /> : <Volume2 size={15} color="var(--lime-400)" />}
                  <span>{isSpeaking ? 'Stop Audio' : 'Audio Guide'}</span>
                </button>
              </div>

              {/* Active Step Timer Widget */}
              {activeStepIndex !== null && (
                <div className="glass-card" style={{ background: 'rgba(163, 230, 53, 0.08)', borderColor: 'var(--lime-400)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.85rem 1.25rem' }}>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--lime-400)', fontWeight: 600 }}>ACTIVE STEP {activeStepIndex + 1} TIMER</div>
                    <div style={{ fontSize: '1.6rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#fff' }}>
                      {Math.floor(timerSeconds / 60)}:{(timerSeconds % 60).toString().padStart(2, '0')}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      onClick={() => setTimerRunning(!timerRunning)}
                      className="btn-primary"
                      style={{ padding: '0.45rem 0.85rem', fontSize: '0.8rem' }}
                    >
                      {timerRunning ? <Pause size={14} /> : <Play size={14} />}
                      <span>{timerRunning ? 'Pause' : 'Resume'}</span>
                    </button>
                    <button
                      onClick={() => { setTimerRunning(false); setTimerSeconds(0); setActiveStepIndex(null); }}
                      className="btn-secondary"
                      style={{ padding: '0.45rem 0.85rem', fontSize: '0.8rem' }}
                    >
                      <RotateCcw size={14} />
                    </button>
                  </div>
                </div>
              )}

              {/* Ingredients List */}
              <div className="glass-card" style={{ padding: '1rem' }}>
                <div style={{ fontSize: '0.88rem', fontWeight: 600, marginBottom: '0.65rem', color: 'var(--text-secondary)' }}>
                  Required Ingredients ({activeRecipe.ingredients.length})
                </div>
                <div className="grid-2" style={{ gap: '0.4rem', fontSize: '0.82rem' }}>
                  {activeRecipe.ingredients.map((ing, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-primary)' }}>
                      <CheckCircle2 size={14} color="var(--emerald-400)" />
                      <strong>{ing.amount}</strong> {ing.name}
                      {ing.notes && <span style={{ color: 'var(--text-dim)', fontSize: '0.75rem' }}>({ing.notes})</span>}
                    </div>
                  ))}
                </div>
              </div>

              {/* Step-by-Step Cooking Guide */}
              <div className="glass-card" style={{ padding: '1rem' }}>
                <div style={{ fontSize: '0.88rem', fontWeight: 600, marginBottom: '0.65rem', color: 'var(--text-secondary)' }}>
                  Step-by-Step Cooking Workflow
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {activeRecipe.steps.map((st, i) => (
                    <div
                      key={i}
                      style={{
                        padding: '0.75rem',
                        borderRadius: 'var(--radius-sm)',
                        background: activeStepIndex === i ? 'rgba(163, 230, 53, 0.12)' : 'rgba(5, 19, 11, 0.75)',
                        border: `1px solid ${activeStepIndex === i ? 'var(--lime-400)' : 'var(--border-subtle)'}`
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                        <span style={{ fontWeight: 700, fontSize: '0.82rem', color: 'var(--lime-400)' }}>
                          Step {st.step_number}
                        </span>
                        {st.timer_sec > 0 && (
                          <button
                            onClick={() => startStepTimer(i, st.timer_sec)}
                            className="btn-secondary"
                            style={{ padding: '0.2rem 0.55rem', fontSize: '0.72rem' }}
                          >
                            <Clock size={12} />
                            <span>Start Timer ({Math.round(st.timer_sec / 60)}m)</span>
                          </button>
                        )}
                      </div>
                      <p style={{ fontSize: '0.82rem', color: 'var(--text-primary)', lineHeight: 1.5 }}>
                        {st.instruction}
                      </p>
                      {st.technique_tip && (
                        <div style={{ fontSize: '0.75rem', color: 'var(--amber-400)', marginTop: '0.35rem' }}>
                          💡 <strong>Chef Technique:</strong> {st.technique_tip}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Chef Tips */}
              <div style={{ padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', background: 'rgba(16, 185, 129, 0.08)', border: '1px solid var(--border-subtle)', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                <strong style={{ color: 'var(--emerald-400)' }}>Executive Chef Tip:</strong> {activeRecipe.chef_tips}
              </div>
            </div>
          ) : (
            /* Ingredient Substitution Finder Widget */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ textAlign: 'center', padding: '2rem 1rem 1rem' }}>
                <ChefHat size={44} color="var(--border-medium)" style={{ marginBottom: '0.75rem' }} />
                <h3 style={{ fontSize: '1.2rem', marginBottom: '0.35rem' }}>Interactive Culinary Station</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', maxWidth: '340px', margin: '0 auto' }}>
                  Ask any recipe question in the chat, or use the substitution calculator below to replace missing ingredients.
                </p>
              </div>

              <div className="glass-card" style={{ padding: '1.25rem' }}>
                <h4 style={{ fontSize: '0.95rem', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>
                  Smart Ingredient Substitution Engine
                </h4>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="e.g. Buttermilk, Egg, Sour cream..."
                    value={substituteQuery}
                    onChange={e => setSubstituteQuery(e.target.value)}
                  />
                  <button className="btn-primary" onClick={handleLookupSubstitute}>
                    Find
                  </button>
                </div>

                {substituteResult && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--emerald-400)', fontWeight: 600 }}>
                      Substitutes for {substituteResult.ingredient}:
                    </div>
                    {substituteResult.substitutes.map((opt, i) => (
                      <div key={i} style={{ padding: '0.65rem', background: 'rgba(5, 19, 11, 0.75)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', fontWeight: 600 }}>
                          <span>{opt.name}</span>
                          <span className="badge badge-emerald">{opt.ratio}</span>
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>{opt.notes}</div>
                      </div>
                    ))}
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontStyle: 'italic', marginTop: '0.35rem' }}>
                      {substituteResult.explanation}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
