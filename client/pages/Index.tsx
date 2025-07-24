import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Globe, 
  Copy, 
  Check, 
  Minimize2, 
  Maximize2, 
  Move, 
  X,
  ArrowRightLeft,
  Settings,
  ChevronDown,
  ChevronUp
} from "lucide-react";

const languages = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "es", name: "Spanish", flag: "🇪🇸" },
  { code: "fr", name: "French", flag: "🇫🇷" },
  { code: "de", name: "German", flag: "🇩🇪" },
  { code: "it", name: "Italian", flag: "🇮🇹" },
  { code: "pt", name: "Portuguese", flag: "🇵🇹" },
  { code: "ru", name: "Russian", flag: "🇷🇺" },
  { code: "ja", name: "Japanese", flag: "🇯🇵" },
  { code: "ko", name: "Korean", flag: "🇰🇷" },
  { code: "zh", name: "Chinese", flag: "🇨🇳" },
  { code: "ar", name: "Arabic", flag: "🇸🇦" },
  { code: "hi", name: "Hindi", flag: "🇮🇳" }
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
  const [position, setPosition] = useState({ x: 20, y: 20 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const widgetRef = useRef<HTMLDivElement>(null);

  const handleTranslate = async () => {
    if (!sourceText.trim()) return;
    
    setIsTranslating(true);
    // Simulate translation API call
    setTimeout(() => {
      setTranslatedText(`Translated: ${sourceText}`);
      setIsTranslating(false);
    }, 800);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(translatedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (widgetRef.current) {
      const rect = widgetRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
      setIsDragging(true);
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Add event listeners for dragging
  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset]);

  const charCount = sourceText.length;
  const isOverLimit = charCount > 280;

  if (isMinimized) {
    return (
      <div 
        ref={widgetRef}
        className="fixed z-[9999] cursor-move"
        style={{ left: position.x, top: position.y }}
        onMouseDown={handleMouseDown}
      >
        <Card className="w-16 h-16 bg-white/95 backdrop-blur-md shadow-2xl border border-blue-200 hover:shadow-3xl transition-all duration-200">
          <CardContent className="p-0 h-full flex items-center justify-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMinimized(false)}
              className="w-full h-full rounded-lg"
            >
              <Globe className="w-6 h-6 text-blue-600" />
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100/50 p-4">
      {/* Demo Twitter-like Background */}
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-sm p-6 mb-4">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-blue-500 rounded-full"></div>
          <div>
            <div className="font-semibold">Twitter User</div>
            <div className="text-gray-500 text-sm">@twitteruser</div>
          </div>
        </div>
        <p className="text-gray-800 mb-4">
          This is a sample tweet that you might want to translate. The translation widget floats on top and can be moved around the screen.
        </p>
        <div className="flex space-x-4 text-gray-500 text-sm">
          <span>Reply</span>
          <span>Retweet</span>
          <span>Like</span>
        </div>
      </div>

      {/* Floating Translation Widget */}
      <div 
        ref={widgetRef}
        className="fixed z-[9999] shadow-2xl"
        style={{ left: position.x, top: position.y }}
      >
        <Card className="w-80 bg-white/95 backdrop-blur-md border border-blue-200 shadow-2xl">
          {/* Header */}
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                  <Globe className="w-4 h-4 text-white" />
                </div>
                <span className="font-semibold text-sm text-gray-900">TweetTranslate</span>
              </div>
              <div className="flex items-center space-x-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-6 h-6 p-0 cursor-move"
                  onMouseDown={handleMouseDown}
                >
                  <Move className="w-3 h-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-6 h-6 p-0"
                  onClick={() => setIsExpanded(!isExpanded)}
                >
                  {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-6 h-6 p-0"
                  onClick={() => setIsMinimized(true)}
                >
                  <Minimize2 className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </CardHeader>

          {isExpanded && (
            <CardContent className="pt-0 space-y-3">
              {/* Language Selection */}
              <div className="flex space-x-2">
                <Select value={fromLang} onValueChange={setFromLang}>
                  <SelectTrigger className="flex-1 h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="auto">🌐 Auto</SelectItem>
                    {languages.map((lang) => (
                      <SelectItem key={lang.code} value={lang.code}>
                        {lang.flag} {lang.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <ArrowRightLeft className="w-4 h-4 text-gray-400 self-center" />
                
                <Select value={toLang} onValueChange={setToLang}>
                  <SelectTrigger className="flex-1 h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map((lang) => (
                      <SelectItem key={lang.code} value={lang.code}>
                        {lang.flag} {lang.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Input Area */}
              <div className="space-y-2">
                <Textarea
                  placeholder="Paste tweet or type to translate..."
                  className="min-h-[80px] text-sm resize-none border-gray-200 focus:ring-1 focus:ring-blue-500"
                  value={sourceText}
                  onChange={(e) => setSourceText(e.target.value)}
                />
                
                <div className="flex items-center justify-between">
                  <span className={`text-xs ${isOverLimit ? 'text-red-500' : 'text-gray-500'}`}>
                    {charCount}/280
                  </span>
                  {isOverLimit && (
                    <Badge variant="destructive" className="text-xs h-5">
                      Too long
                    </Badge>
                  )}
                </div>
              </div>

              {/* Translate Button */}
              <Button 
                onClick={handleTranslate}
                disabled={!sourceText.trim() || isTranslating}
                className="w-full h-8 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-xs"
              >
                {isTranslating ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" />
                    <span>Translating...</span>
                  </div>
                ) : (
                  "Translate"
                )}
              </Button>

              {/* Output Area */}
              {translatedText && (
                <div className="space-y-2">
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm text-gray-900 whitespace-pre-wrap">
                      {translatedText}
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs h-5">
                      Ready
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCopy}
                      className="h-6 text-xs px-2"
                    >
                      {copied ? (
                        <>
                          <Check className="w-3 h-3 mr-1" />
                          Copied
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
      <div className="max-w-2xl mx-auto bg-blue-50 rounded-lg p-4 mt-4">
        <h3 className="font-semibold text-blue-900 mb-2">How to use TweetTranslate:</h3>
        <ul className="text-blue-800 text-sm space-y-1">
          <li>• Drag the floating widget anywhere on screen using the move icon</li>
          <li>• Collapse/expand the widget using the chevron button</li>
          <li>• Minimize to a small icon when not in use</li>
          <li>• Copy tweets from Twitter and paste them for instant translation</li>
          <li>• Perfect for browsing Twitter in foreign languages!</li>
        </ul>
      </div>
    </div>
  );
}
