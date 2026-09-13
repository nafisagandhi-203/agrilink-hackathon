import React, { useState, useEffect, useRef } from 'react';
import { Mic, X, Volume2, Sparkles, ArrowRight, Bot, Check, AlertCircle, RefreshCw } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import type { Language } from '../types';

interface VoiceAssistantProps {
  setActiveTab: (tab: string) => void;
  isOpen?: boolean;
  setIsOpen?: (open: boolean) => void;
}

export const VoiceAssistant: React.FC<VoiceAssistantProps> = ({
  setActiveTab,
  isOpen: externalIsOpen,
  setIsOpen: setExternalIsOpen
}) => {
  const { language: currentGlobalLang, t } = useLanguage();
  const [internalIsOpen, setInternalIsOpen] = useState(false);

  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;

  const toggleOpen = (openVal: boolean) => {
    setInternalIsOpen(openVal);
    if (setExternalIsOpen) {
      setExternalIsOpen(openVal);
    }
  };

  const [, setIsListening] = useState(false);
  const [statusState, setStatusState] = useState<'ready' | 'listening' | 'processing' | 'response_ready' | 'permission_denied' | 'unavailable'>('ready');
  const [transcript, setTranscript] = useState('');
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [selectedLang, setSelectedLang] = useState<Language>(currentGlobalLang || 'en');
  const [navTarget, setNavTarget] = useState<string | null>(null);
  const [confirmationNeeded, setConfirmationNeeded] = useState<{
    message: string;
    targetTab: string;
    actionLabel: string;
  } | null>(null);

  const recognitionRef = useRef<any>(null);

  // Sync selected lang when global language changes
  useEffect(() => {
    if (currentGlobalLang) {
      setSelectedLang(currentGlobalLang);
    }
  }, [currentGlobalLang]);

  // Sample voice command examples for the 3 supported languages
  const sampleCommands = [
    { text: 'મારા ટામેટાના આજના ભાવ બતાવો', lang: 'gu', label: 'Gujarati: Market Price' },
    { text: 'મારા ટામેટા માટે ખરીદદારો બતાવો', lang: 'gu', label: 'Gujarati: Buyers' },
    { text: 'आज टमाटर का भाव बताओ', lang: 'hi', label: 'Hindi: Market Price' },
    { text: 'मेरे टमाटर के लिए खरीदार दिखाओ', lang: 'hi', label: 'Hindi: Buyers' },
    { text: "Show today's tomato price", lang: 'en', label: 'English: Today Price' },
    { text: 'I have 500 kg tomatoes to sell', lang: 'en', label: 'English: Create Listing' },
    { text: 'Arrange transportation for my crops', lang: 'en', label: 'English: Transport' }
  ];

  // Helper to Speak Text aloud using Web SpeechSynthesis
  const speakAudioResponse = (textToSpeak: string, lang: Language) => {
    if (!('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel(); // cancel any active speech

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    if (lang === 'gu') utterance.lang = 'gu-IN';
    else if (lang === 'hi') utterance.lang = 'hi-IN';
    else utterance.lang = 'en-IN';

    utterance.rate = 0.95;
    window.speechSynthesis.speak(utterance);
  };

  // Start real browser Web Speech Recognition
  const startListening = () => {
    setAiResponse(null);
    setNavTarget(null);
    setConfirmationNeeded(null);
    setTranscript('');

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setStatusState('unavailable');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      recognition.continuous = false;
      recognition.interimResults = true;

      if (selectedLang === 'gu') recognition.lang = 'gu-IN';
      else if (selectedLang === 'hi') recognition.lang = 'hi-IN';
      else recognition.lang = 'en-IN';

      recognition.onstart = () => {
        setIsListening(true);
        setStatusState('listening');
      };

      recognition.onresult = (event: any) => {
        const current = event.resultIndex;
        const resultText = event.results[current][0].transcript;
        setTranscript(resultText);
      };

      recognition.onerror = (err: any) => {
        console.warn('Speech recognition error:', err);
        setIsListening(false);
        if (err.error === 'not-allowed' || err.error === 'permission-denied') {
          setStatusState('permission_denied');
        } else {
          setStatusState('ready');
        }
      };

      recognition.onend = () => {
        setIsListening(false);
        if (transcript) {
          setStatusState('processing');
          setTimeout(() => {
            processVoiceQuery(transcript, selectedLang);
          }, 400);
        } else {
          setStatusState('ready');
        }
      };

      recognition.start();
    } catch (e) {
      console.error('Error starting recognition:', e);
      setIsListening(false);
      setStatusState('ready');
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }
    setIsListening(false);
    if (transcript) {
      setStatusState('processing');
      setTimeout(() => {
        processVoiceQuery(transcript, selectedLang);
      }, 300);
    } else {
      setStatusState('ready');
    }
  };

  // Trigger processing when user selects sample command
  const handleSampleClick = (cmdText: string, cmdLang: Language) => {
    setSelectedLang(cmdLang);
    setTranscript(cmdText);
    setStatusState('processing');
    setAiResponse(null);
    setNavTarget(null);

    setTimeout(() => {
      processVoiceQuery(cmdText, cmdLang);
    }, 600);
  };

  // Process voice query & determine AI text + spoken audio + confirmation dialogs
  const processVoiceQuery = (query: string, lang: Language) => {
    const lower = query.toLowerCase();
    let responseText = '';
    let target: string | null = null;

    if (
      lower.includes('ભાવ') ||
      lower.includes('ભાવો') ||
      lower.includes('भाव') ||
      lower.includes('price') ||
      lower.includes('rate')
    ) {
      if (lang === 'gu') {
        responseText =
          'રાજકોટ એપીએમસીમાં આજે ટામેટાંનો ભાવ ₹૨,૪૫૦ પ્રતિ ક્વિન્ટલ છે. એઆઈ અંદાજ મુજબ આગામી ૭ દિવસમાં ભાવ ₹૨,૬૮૦ સુધી વધી શકે છે.';
      } else if (lang === 'hi') {
        responseText =
          'आज राजकोट मंडी में टमाटर का भाव ₹2,450 प्रति क्विंटल है। AI पूर्वानुमान के अनुसार अगले 7 दिनों में भाव ₹2,680 तक बढ़ सकता है।';
      } else {
        responseText =
          "Today's APMC market price for Tomato in Rajkot is ₹2,450 per quintal. AI predicts prices may rise to ₹2,680 in 7 days.";
      }
      target = 'farmer-ai-price';
    } else if (
      lower.includes('ખરીદદાર') ||
      lower.includes('खरीदार') ||
      lower.includes('buyer') ||
      lower.includes('offers')
    ) {
      if (lang === 'gu') {
        responseText =
          'તમારા ટામેટાં માટે ૩ ખરાઈ કરેલા ખરીદદારો મળ્યા છે. શ્રી ફ્રેશ ફૂડ્સ સૌથી શ્રેષ્ઠ મેચ છે જે ₹૨,૫૮૦ ઓફર કરે છે.';
      } else if (lang === 'hi') {
        responseText =
          'आपके टमाटर के लिए 3 सत्यापित खरीदार मिले हैं। श्री फ्रेश फूड्स बेस्ट मैच है जो ₹2,580 का ऑफर दे रहा है।';
      } else {
        responseText =
          'Found 3 verified buyers for your tomatoes. Top match: Shree Fresh Foods offering ₹2,580 per quintal.';
      }
      target = 'farmer-buyers';
    } else if (
      lower.includes('500') ||
      lower.includes('બનાવો') ||
      lower.includes('बनाओ') ||
      lower.includes('sell') ||
      lower.includes('listing') ||
      lower.includes('create')
    ) {
      if (lang === 'gu') {
        responseText = 'તમે ૫૦૦ કિલો ટામેટાં ઉમેરવા માંગો છો. શું તમે લિસ્ટિંગ બનાવવા માંગો છો?';
      } else if (lang === 'hi') {
        responseText = 'आप 500 किलो टमाटर जोड़ना चाहते हैं। क्या आप यह फसल लिस्ट करना चाहते हैं?';
      } else {
        responseText = 'You requested to list 500 kg of tomatoes. Would you like to create this crop listing now?';
      }

      setConfirmationNeeded({
        message:
          lang === 'gu'
            ? 'શું તમે ૫૦૦ કિલો ટામેટાંનું લિસ્ટિંગ કન્ફર્મ કરવા માંગો છો?'
            : lang === 'hi'
            ? 'क्या आप 500 किलो टमाटर की नई लिस्टिंग कन्फर्म करना चाहते हैं?'
            : 'Did you mean 500 kg of Grade A tomatoes?',
        targetTab: 'farmer-add-crop',
        actionLabel: lang === 'gu' ? 'હા, લિસ્ટિંગ બનાવો' : lang === 'hi' ? 'हां, फसल जोड़ें' : 'Yes, Create Listing'
      });
    } else if (
      lower.includes('વાહન') ||
      lower.includes('ટ્રાન્સપોર્ટ') ||
      lower.includes('गाड़ी') ||
      lower.includes('transport') ||
      lower.includes('truck')
    ) {
      if (lang === 'gu') {
        responseText = 'પરિવહન વિભાગ ખોલી રહ્યા છીએ. નજીકના ૪ ટ્રાન્સપોર્ટર ઉપલબ્ધ છે.';
      } else if (lang === 'hi') {
        responseText = 'परिवहन सेवा खोली जा रही है। 4 निकटतम ट्रांसपोर्टर उपलब्ध हैं।';
      } else {
        responseText = 'Opening transportation desk. 4 verified transporters are available near Rajkot.';
      }
      target = 'farmer-transport';
    } else {
      if (lang === 'gu') {
        responseText = 'એગ્રીપલ્સ એઆઈ વૉઇસ એન્જિન તૈયાર છે. બજાર ભાવ અને ખરીદદારો માટે પૂછો.';
      } else if (lang === 'hi') {
        responseText = 'एग्रीपल्स AI वॉइस आपकी सहायता के लिए तैयार है। मंडी भाव या खरीदारों के बारे में पूछें।';
      } else {
        responseText = 'AgriPulse AI Voice Engine is ready. Ask about market prices, buyers, or transport.';
      }
      target = 'farmer-dashboard';
    }

    setAiResponse(responseText);
    setNavTarget(target);
    setStatusState('response_ready');
    speakAudioResponse(responseText, lang);
  };

  return (
    <>
      {/* Floating Microphone Trigger Button */}
      <button
        onClick={() => toggleOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 px-4 py-3 rounded-full bg-[#143601] hover:bg-[#1a4301] text-white font-extrabold shadow-2xl shadow-[#143601]/40 hover:scale-105 active:scale-95 transition-all border border-[#538d22]"
        aria-label="Ask AgriPulse Voice Assistant"
      >
        <div className="w-8 h-8 rounded-full bg-[#538d22] flex items-center justify-center">
          <Mic className="w-5 h-5 text-white animate-pulse" />
        </div>
        <span className="text-xs tracking-wide hidden sm:inline">{t('askAgriPulse')}</span>
        <span className="flex h-2.5 w-2.5 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#aad576] opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#aad576]" />
        </span>
      </button>

      {/* Voice Assistant Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#143601]/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-[#e2ebd9] overflow-hidden flex flex-col">
            
            {/* Modal Header */}
            <div className="p-5 bg-[#143601] text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#245501] flex items-center justify-center border border-[#538d22]">
                  <Bot className="w-6 h-6 text-[#aad576]" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base flex items-center gap-2">
                    {t('voiceModalTitle')}
                    <Sparkles className="w-4 h-4 text-[#aad576]" />
                  </h3>
                  <p className="text-xs text-[#aad576] font-medium">
                    {t('speakPrompt')}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  window.speechSynthesis?.cancel();
                  toggleOpen(false);
                }}
                className="p-1.5 rounded-full hover:bg-[#245501] transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            <div className="p-5 space-y-5">
              
              {/* Language Selector Bar */}
              <div className="flex items-center justify-center gap-2 p-1 bg-[#f4f8f0] rounded-xl border border-[#e2ebd9]">
                <button
                  onClick={() => setSelectedLang('gu')}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                    selectedLang === 'gu' ? 'bg-[#143601] text-white shadow-xs' : 'text-[#245501]'
                  }`}
                >
                  🇮🇳 ગુજરાતી
                </button>
                <button
                  onClick={() => setSelectedLang('hi')}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                    selectedLang === 'hi' ? 'bg-[#143601] text-white shadow-xs' : 'text-[#245501]'
                  }`}
                >
                  🇮🇳 हिन्दी
                </button>
                <button
                  onClick={() => setSelectedLang('en')}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                    selectedLang === 'en' ? 'bg-[#143601] text-white shadow-xs' : 'text-[#245501]'
                  }`}
                >
                  🇬🇧 English
                </button>
              </div>

              {/* Status State Banner */}
              <div className="text-center py-2 space-y-3">
                {statusState === 'listening' ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-center gap-1.5 h-12">
                      <div className="w-1.5 bg-[#538d22] rounded-full wave-bar h-8" />
                      <div className="w-1.5 bg-[#538d22] rounded-full wave-bar h-12 delay-75" />
                      <div className="w-1.5 bg-[#538d22] rounded-full wave-bar h-6 delay-150" />
                      <div className="w-1.5 bg-[#538d22] rounded-full wave-bar h-10 delay-100" />
                      <div className="w-1.5 bg-[#538d22] rounded-full wave-bar h-7 delay-200" />
                    </div>
                    <p className="text-xs font-extrabold text-[#143601] animate-pulse">
                      🎤 {t('listening')}
                    </p>
                    <button
                      onClick={stopListening}
                      className="px-4 py-1.5 rounded-full bg-rose-100 text-rose-700 text-xs font-bold hover:bg-rose-200"
                    >
                      {t('stopListening')}
                    </button>
                  </div>
                ) : statusState === 'processing' ? (
                  <div className="space-y-2 py-3">
                    <RefreshCw className="w-8 h-8 text-[#538d22] animate-spin mx-auto" />
                    <p className="text-xs font-bold text-[#143601]">{t('processing')}</p>
                  </div>
                ) : statusState === 'permission_denied' ? (
                  <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold space-y-1">
                    <AlertCircle className="w-5 h-5 text-rose-600 mx-auto" />
                    <p>{t('micDenied')}</p>
                  </div>
                ) : statusState === 'unavailable' ? (
                  <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold space-y-1">
                    <AlertCircle className="w-5 h-5 text-amber-600 mx-auto" />
                    <p>{t('voiceUnavailable')}</p>
                    <p className="text-[11px] text-amber-700 font-normal">You can still click the sample query buttons below to test the AI voice system.</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <button
                      onClick={startListening}
                      className="w-16 h-16 rounded-full bg-[#143601] hover:bg-[#1a4301] text-white flex items-center justify-center mx-auto shadow-lg shadow-[#143601]/30 hover:scale-105 transition-transform"
                    >
                      <Mic className="w-8 h-8 text-[#aad576]" />
                    </button>
                    <p className="text-xs font-bold text-[#245501]">
                      Tap mic to speak or select a sample query below
                    </p>
                  </div>
                )}
              </div>

              {/* Recognized Speech Transcript */}
              {transcript && (
                <div className="p-3 rounded-2xl bg-[#f4f8f0] border border-[#e2ebd9]">
                  <span className="text-[10px] uppercase font-bold text-[#538d22] block mb-0.5">
                    Recognized Speech Transcript:
                  </span>
                  <p className="text-xs font-bold text-[#143601]">"{transcript}"</p>
                </div>
              )}

              {/* AI Response Card */}
              {aiResponse && (
                <div className="p-4 rounded-2xl bg-[#f4f8f0] border border-[#73a942]/50 space-y-3 animate-plant-grow">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#143601] flex items-center gap-1.5">
                      <Volume2 className="w-4 h-4 text-[#538d22]" />
                      AgriPulse Voice Response:
                    </span>
                    <button
                      onClick={() => speakAudioResponse(aiResponse, selectedLang)}
                      className="text-xs font-bold text-[#245501] hover:underline flex items-center gap-1"
                      title={t('replayAudio')}
                    >
                      <span>🔊 {t('replayAudio')}</span>
                    </button>
                  </div>
                  <p className="text-xs text-[#143601] leading-relaxed font-semibold">
                    {aiResponse}
                  </p>

                  {navTarget && (
                    <button
                      onClick={() => {
                        window.speechSynthesis?.cancel();
                        setActiveTab(navTarget);
                        toggleOpen(false);
                      }}
                      className="w-full py-2.5 px-3 rounded-xl bg-[#143601] hover:bg-[#1a4301] text-white text-xs font-extrabold flex items-center justify-center gap-2 shadow transition-colors"
                    >
                      <span>{t('goToRelevantPage')}</span>
                      <ArrowRight className="w-4 h-4 text-[#aad576]" />
                    </button>
                  )}
                </div>
              )}

              {/* Action Confirmation Modal Section */}
              {confirmationNeeded && (
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-900">
                    <AlertCircle className="w-4 h-4 text-amber-600" />
                    <span>Action Confirmation Required</span>
                  </div>
                  <p className="text-xs text-slate-800 font-semibold">{confirmationNeeded.message}</p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        window.speechSynthesis?.cancel();
                        setActiveTab(confirmationNeeded.targetTab);
                        toggleOpen(false);
                      }}
                      className="flex-1 py-2 rounded-xl bg-[#143601] text-white text-xs font-bold flex items-center justify-center gap-1 shadow"
                    >
                      <Check className="w-4 h-4 text-[#aad576]" />
                      {confirmationNeeded.actionLabel}
                    </button>
                    <button
                      onClick={() => setConfirmationNeeded(null)}
                      className="py-2 px-4 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Clickable Sample Voice Commands */}
              <div>
                <p className="text-[11px] font-extrabold text-[#538d22] uppercase tracking-wider mb-2">
                  Sample Voice Commands
                </p>
                <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                  {sampleCommands.map((cmd, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSampleClick(cmd.text, cmd.lang as Language)}
                      className="w-full text-left p-2 rounded-xl text-xs bg-[#f4f8f0] hover:bg-[#e2ebd9] text-[#143601] transition-colors border border-[#e2ebd9] flex items-center justify-between group"
                    >
                      <span className="font-semibold">"{cmd.text}"</span>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-white text-[#245501] border border-[#e2ebd9]">
                        {cmd.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </>
  );
};
