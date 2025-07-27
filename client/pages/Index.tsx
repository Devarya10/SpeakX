import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Copy,
  Check,
  Minimize2,
  Move,
  ArrowRightLeft,
  ChevronDown,
  ChevronUp,
  X,
} from "lucide-react";

const languages = [
  { code: "en", name: "English", flag: "" },
  { code: "es", name: "Spanish", flag: "🇪🇸" },
  { code: "fr", name: "French", flag: "🇫🇷" },
  { code: "de", name: "German", flag: "🇩🇪" },
  { code: "it", name: "Italian", flag: "🇮🇹" },
  { code: "pt", name: "Portuguese", flag: "🇵🇹" },
  { code: "ru", name: "Russian", flag: "🇷🇺" },
  { code: "ja", name: "Japanese", flag: "🇯🇵" },
  { code: "ko", name: "Korean", flag: "🇰🇷" },
  { code: "zh", name: "Chinese (Simplified)", flag: "🇨🇳" },
  { code: "ar", name: "Arabic", flag: "🇸🇦" },
  { code: "hi", name: "Hindi", flag: "🇮🇳" },
  { code: "nl", name: "Dutch", flag: "🇳🇱" },
  { code: "tr", name: "Turkish", flag: "🇹🇷" },
  { code: "pl", name: "Polish", flag: "🇵🇱" },
];

export default function Index() {
  const [sourceText, setSourceText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [fromLang, setFromLang] = useState("auto");
  const [toLang, setToLang] = useState("en");
  const [isTranslating, setIsTranslating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [position, setPosition] = useState({ x: 20, y: 20 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isWidgetVisible, setIsWidgetVisible] = useState(true);
  const widgetRef = useRef<HTMLDivElement>(null);

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      // Reset position for mobile
      if (window.innerWidth < 768) {
        setPosition({ x: 10, y: window.innerHeight - 400 });
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleTranslate = async () => {
    if (!sourceText.trim()) return;

    setIsTranslating(true);

    try {
      // Use LibreTranslate API for free translation
      const response = await fetch("https://libretranslate.com/translate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          q: sourceText,
          source: fromLang === "auto" ? "auto" : fromLang,
          target: toLang,
          format: "text",
        }),
      });

      if (!response.ok) {
        throw new Error("Translation failed");
      }

      const data = await response.json();
      setTranslatedText(
        data.translatedText || data.translation || "Translation failed",
      );
    } catch (error) {
      console.error("Translation error:", error);
      // Fallback to Google Translate Web API
      try {
        const fallbackResponse = await fetch(
          `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${fromLang === "auto" ? "auto" : fromLang}&tl=${toLang}&dt=t&q=${encodeURIComponent(sourceText)}`,
        );

        const fallbackData = await fallbackResponse.json();
        const translated =
          fallbackData[0]?.map((item: any) => item[0]).join("") ||
          "Translation failed";
        setTranslatedText(translated);
      } catch (fallbackError) {
        console.error("Fallback translation error:", fallbackError);
        setTranslatedText(
          "Translation service temporarily unavailable. Please try again.",
        );
      }
    } finally {
      setIsTranslating(false);
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(translatedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCancel = () => {
    setIsWidgetVisible(false);
    // Reset widget state
    setSourceText("");
    setTranslatedText("");
    setIsMinimized(false);
    setIsExpanded(true);
  };

  const handleHeaderMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (widgetRef.current) {
      const rect = widgetRef.current.getBoundingClientRect();
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

      setDragOffset({
        x: clientX - rect.left,
        y: clientY - rect.top,
      });
      setIsDragging(true);
    }
  };

  const handleMouseMove = (e: MouseEvent | TouchEvent) => {
    if (isDragging) {
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

      // Constrain to viewport bounds
      const maxX =
        window.innerWidth - (isMobile ? window.innerWidth - 20 : 320);
      const maxY = window.innerHeight - 200;

      setPosition({
        x: Math.max(10, Math.min(maxX, clientX - dragOffset.x)),
        y: Math.max(10, Math.min(maxY, clientY - dragOffset.y)),
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Add event listeners for dragging
  useEffect(() => {
    if (isDragging) {
      const handleMove = (e: Event) =>
        handleMouseMove(e as MouseEvent | TouchEvent);
      const handleEnd = () => handleMouseUp();

      document.addEventListener("mousemove", handleMove);
      document.addEventListener("mouseup", handleEnd);
      document.addEventListener("touchmove", handleMove);
      document.addEventListener("touchend", handleEnd);

      return () => {
        document.removeEventListener("mousemove", handleMove);
        document.removeEventListener("mouseup", handleEnd);
        document.removeEventListener("touchmove", handleMove);
        document.removeEventListener("touchend", handleEnd);
      };
    }
  }, [isDragging, dragOffset]);

  const charCount = sourceText.length;
  const isOverLimit = charCount > 280;

  if (isMinimized) {
    return (
      <div
        ref={widgetRef}
        className="fixed z-[9999] cursor-move touch-manipulation"
        style={{
          left: isMobile ? "auto" : position.x,
          right: isMobile ? 10 : "auto",
          top: isMobile ? "auto" : position.y,
          bottom: isMobile ? 10 : "auto",
        }}
        onMouseDown={handleHeaderMouseDown}
        onTouchStart={handleHeaderMouseDown}
      >
        <Card className="w-16 h-16 bg-slate-900/95 backdrop-blur-xl border-slate-700/50 hover:bg-slate-800/95 transition-all duration-300 shadow-2xl shadow-black/20">
          <CardContent className="p-0 h-full flex items-center justify-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMinimized(false)}
              className="w-full h-full rounded-lg bg-gradient-to-br from-violet-500 via-purple-600 to-indigo-700 hover:from-violet-600 hover:via-purple-700 hover:to-indigo-800 relative overflow-hidden border-0"
            >
              <div className="w-2 h-2 bg-white/30 rounded-full absolute top-1.5 left-1.5"></div>
              <div className="w-1.5 h-1.5 bg-white rounded-sm rotate-45"></div>
              <div className="w-1 h-1 bg-white/70 rounded-full absolute bottom-1.5 right-1.5"></div>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-gray-900 flex flex-col justify-start items-end pl-4 pr-0 py-4">
      {/* Demo Twitter-like Background */}
      <div className="max-w-2xl mx-auto bg-slate-800/80 backdrop-blur-sm border border-slate-700/50 rounded-2xl shadow-xl p-6 mb-4">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-full ring-2 ring-blue-400/20"></div>
          <div>
            <div className="font-semibold text-white">Twitter User</div>
            <div className="text-slate-400 text-sm">@twitteruser</div>
          </div>
        </div>
        <p className="text-slate-200 mb-4 leading-relaxed">
          This is a sample tweet that you might want to translate. The
          translation widget floats on top and can be moved around the screen.
        </p>
        <div className="flex space-x-6 text-slate-400 text-sm">
          <span className="hover:text-slate-300 cursor-pointer transition-colors">
            Reply
          </span>
          <span className="hover:text-slate-300 cursor-pointer transition-colors">
            Retweet
          </span>
          <span className="hover:text-slate-300 cursor-pointer transition-colors">
            Like
          </span>
        </div>
      </div>

      {/* Floating Translation Widget */}
      <div
        ref={widgetRef}
        className="fixed z-[9999] shadow-2xl touch-manipulation"
        style={{
          left: isMobile ? 10 : position.x,
          top: isMobile ? "auto" : position.y,
          bottom: isMobile ? 10 : "auto",
          right: isMobile ? 10 : "auto",
          width: isMobile ? "calc(100vw - 20px)" : "340px",
        }}
      >
        <Card
          className={`${isMobile ? "w-full" : "w-85"} bg-slate-900/95 backdrop-blur-xl border border-slate-700/50 shadow-2xl shadow-black/25 transition-all duration-300`}
        >
          {/* Header */}
          <CardHeader
            className="pb-3 border-b border-slate-700/50 touch-manipulation"
            onMouseDown={!isMobile ? handleHeaderMouseDown : undefined}
            onTouchStart={!isMobile ? handleHeaderMouseDown : undefined}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-violet-500 via-purple-600 to-indigo-700 rounded-2xl flex items-center justify-center relative overflow-hidden ring-2 ring-purple-400/20">
                  <div className="w-3 h-3 bg-white/20 rounded-full absolute top-1 left-1"></div>
                  <div className="w-2 h-2 bg-white rounded-sm rotate-45"></div>
                  <div className="w-1.5 h-1.5 bg-white/60 rounded-full absolute bottom-1 right-1"></div>
                </div>
                <div>
                  <span className="font-bold text-lg text-white tracking-tight">
                    LiveTranslate
                  </span>
                  {isMobile && (
                    <Badge
                      variant="secondary"
                      className="ml-2 text-xs bg-violet-500/20 text-violet-300 border-violet-400/30"
                    >
                      Mobile
                    </Badge>
                  )}
                  {!isMobile && (
                    <div className="text-xs text-slate-400 mt-0.5">
                      Drag from here to move
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-8 h-8 p-0 text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-lg transition-all"
                  onClick={() => setIsExpanded(!isExpanded)}
                >
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-8 h-8 p-0 text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-lg transition-all"
                  onClick={() => setIsMinimized(true)}
                >
                  <Minimize2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>

          {isExpanded && (
            <CardContent className="pt-4 space-y-4">
              {/* Language Selection */}
              <div
                className={`flex ${isMobile ? "flex-col space-y-3" : "space-x-3"}`}
              >
                <div className="flex-1">
                  <label className="text-xs font-medium text-slate-400 mb-1 block">
                    From
                  </label>
                  <Select value={fromLang} onValueChange={setFromLang}>
                    <SelectTrigger className="h-9 bg-slate-800/50 border-slate-600/50 text-white hover:bg-slate-700/50 focus:ring-violet-500/30 focus:border-violet-400 transition-all">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-600">
                      <SelectItem
                        value="auto"
                        className="text-slate-200 focus:bg-slate-700 focus:text-white"
                      >
                        🌐 Auto Detect
                      </SelectItem>
                      {languages.map((lang) => (
                        <SelectItem
                          key={lang.code}
                          value={lang.code}
                          className="text-slate-200 focus:bg-slate-700 focus:text-white"
                        >
                          {lang.flag} {lang.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {!isMobile && (
                  <div className="flex items-end pb-2">
                    <ArrowRightLeft className="w-5 h-5 text-violet-400" />
                  </div>
                )}
                {isMobile && (
                  <div className="flex justify-center">
                    <ArrowRightLeft className="w-5 h-5 text-violet-400 rotate-90" />
                  </div>
                )}

                <div className="flex-1">
                  <label className="text-xs font-medium text-slate-400 mb-1 block">
                    To
                  </label>
                  <Select value={toLang} onValueChange={setToLang}>
                    <SelectTrigger className="h-9 bg-slate-800/50 border-slate-600/50 text-white hover:bg-slate-700/50 focus:ring-violet-500/30 focus:border-violet-400 transition-all">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-600">
                      {languages.map((lang) => (
                        <SelectItem
                          key={lang.code}
                          value={lang.code}
                          className="text-slate-200 focus:bg-slate-700 focus:text-white"
                        >
                          {lang.flag} {lang.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Input Area */}
              <div className="space-y-3">
                <label className="text-xs font-medium text-slate-400">
                  Original Text
                </label>
                <Textarea
                  placeholder="Paste tweet or type something to translate..."
                  className={`${isMobile ? "min-h-[70px]" : "min-h-[90px]"} bg-slate-800/50 border-slate-600/50 text-white placeholder-slate-500 resize-none focus:ring-violet-500/30 focus:border-violet-400 transition-all`}
                  value={sourceText}
                  onChange={(e) => setSourceText(e.target.value)}
                />

                <div className="flex items-center justify-between">
                  <span
                    className={`text-xs font-medium ${isOverLimit ? "text-red-400" : "text-slate-500"}`}
                  >
                    {charCount}/280
                  </span>
                  {isOverLimit && (
                    <Badge
                      variant="destructive"
                      className="text-xs h-6 bg-red-500/20 text-red-400 border-red-400/30"
                    >
                      Too long for Twitter
                    </Badge>
                  )}
                </div>
              </div>

              {/* Translate Button */}
              <Button
                onClick={handleTranslate}
                disabled={!sourceText.trim() || isTranslating}
                className="w-full h-10 bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 hover:from-violet-700 hover:via-purple-700 hover:to-indigo-700 text-white font-medium shadow-lg shadow-violet-500/25 transition-all duration-200 border-0"
              >
                {isTranslating ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Translating...</span>
                  </div>
                ) : (
                  "Translate Now"
                )}
              </Button>

              {/* Output Area */}
              {translatedText && (
                <div className="space-y-3">
                  <label className="text-xs font-medium text-slate-400">
                    Translation
                  </label>
                  <div className="p-4 bg-gradient-to-br from-violet-500/10 to-indigo-500/10 rounded-xl border border-violet-400/20">
                    <p className="text-white whitespace-pre-wrap leading-relaxed">
                      {translatedText}
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <Badge
                      variant="secondary"
                      className="bg-emerald-500/20 text-emerald-300 border-emerald-400/30 text-xs h-6"
                    >
                      ✓ Ready to copy
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCopy}
                      className="h-8 text-xs px-3 bg-slate-800/50 border-slate-600/50 text-slate-300 hover:text-white hover:bg-slate-700/50 transition-all"
                    >
                      {copied ? (
                        <>
                          <Check className="w-3 h-3 mr-1" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3 mr-1" />
                          Copy
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          )}
        </Card>
      </div>

      {/* Instructions */}
      <div className="max-w-2xl mx-auto bg-gradient-to-br from-violet-500/10 to-indigo-500/10 backdrop-blur-sm border border-violet-400/20 rounded-2xl p-6 mt-4">
        <h3 className="font-bold text-xl text-white mb-3">
          How to use LiveTranslate:
        </h3>
        <ul className="text-slate-300 space-y-2">
          <li className="flex items-start space-x-2">
            <span className="text-violet-400 font-bold">•</span>
            <span>
              {isMobile
                ? "Widget automatically positions at bottom on mobile"
                : "Drag the floating widget anywhere on screen using the move icon"}
            </span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-violet-400 font-bold">•</span>
            <span>Collapse/expand the widget using the chevron button</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-violet-400 font-bold">•</span>
            <span>Minimize to a small icon when not in use</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-violet-400 font-bold">•</span>
            <span>
              Copy tweets from Twitter and paste them for instant translation
            </span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-violet-400 font-bold">•</span>
            <span>Perfect for browsing Twitter in foreign languages!</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
