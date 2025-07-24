import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRightLeft, Globe, Twitter, Copy, Check } from "lucide-react";

const languages = [
  { code: "en", name: "English" },
  { code: "es", name: "Spanish" },
  { code: "fr", name: "French" },
  { code: "de", name: "German" },
  { code: "it", name: "Italian" },
  { code: "pt", name: "Portuguese" },
  { code: "ru", name: "Russian" },
  { code: "ja", name: "Japanese" },
  { code: "ko", name: "Korean" },
  { code: "zh", name: "Chinese" },
  { code: "ar", name: "Arabic" },
  { code: "hi", name: "Hindi" }
];

export default function Index() {
  const [sourceText, setSourceText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [fromLang, setFromLang] = useState("auto");
  const [toLang, setToLang] = useState("en");
  const [isTranslating, setIsTranslating] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleTranslate = async () => {
    if (!sourceText.trim()) return;
    
    setIsTranslating(true);
    // Simulate translation API call
    setTimeout(() => {
      setTranslatedText(`Translated: ${sourceText}`);
      setIsTranslating(false);
    }, 1000);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(translatedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const charCount = sourceText.length;
  const isOverLimit = charCount > 280;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm dark:bg-slate-900/80 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  TweetTranslate
                </h1>
                <p className="text-sm text-muted-foreground">Live Twitter Translation</p>
              </div>
            </div>
            <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
              <Twitter className="w-3 h-3 mr-1" />
              Twitter Ready
            </Badge>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Translate Your Tweets
              <span className="text-blue-600"> Instantly</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Break language barriers on Twitter. Translate your tweets or understand content from around the world in real-time.
            </p>
          </div>

          {/* Translation Interface */}
          <div className="grid lg:grid-cols-2 gap-6 mb-8">
            {/* Input Side */}
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm dark:bg-slate-800/80">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Original Text</h3>
                  <Select value={fromLang} onValueChange={setFromLang}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="auto">Auto Detect</SelectItem>
                      {languages.map((lang) => (
                        <SelectItem key={lang.code} value={lang.code}>
                          {lang.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <Textarea
                  placeholder="Paste your tweet or type something to translate..."
                  className="min-h-[200px] resize-none border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={sourceText}
                  onChange={(e) => setSourceText(e.target.value)}
                />
                
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center space-x-2">
                    <span className={`text-sm ${isOverLimit ? 'text-red-500' : 'text-gray-500'}`}>
                      {charCount}/280
                    </span>
                    {isOverLimit && (
                      <Badge variant="destructive" className="text-xs">
                        Too long for Twitter
                      </Badge>
                    )}
                  </div>
                  <Button 
                    onClick={handleTranslate}
                    disabled={!sourceText.trim() || isTranslating}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                  >
                    {isTranslating ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Translating...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <ArrowRightLeft className="w-4 h-4" />
                        <span>Translate</span>
                      </div>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Output Side */}
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm dark:bg-slate-800/80">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Translation</h3>
                  <Select value={toLang} onValueChange={setToLang}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {languages.map((lang) => (
                        <SelectItem key={lang.code} value={lang.code}>
                          {lang.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="min-h-[200px] p-4 bg-gray-50 dark:bg-slate-700 rounded-lg border border-gray-200 dark:border-gray-600">
                  {translatedText ? (
                    <p className="text-gray-900 dark:text-white whitespace-pre-wrap">
                      {translatedText}
                    </p>
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400 italic">
                      Translation will appear here...
                    </p>
                  )}
                </div>
                
                {translatedText && (
                  <div className="flex items-center justify-between mt-4">
                    <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                      Translation Ready
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCopy}
                      className="flex items-center space-x-2"
                    >
                      {copied ? (
                        <>
                          <Check className="w-4 h-4" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          <span>Copy</span>
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="text-center p-6 border-0 bg-white/60 backdrop-blur-sm dark:bg-slate-800/60">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Twitter className="w-6 h-6 text-blue-600 dark:text-blue-300" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Twitter Optimized</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Designed specifically for Twitter's 280 character limit with real-time counting.
              </p>
            </Card>

            <Card className="text-center p-6 border-0 bg-white/60 backdrop-blur-sm dark:bg-slate-800/60">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                <ArrowRightLeft className="w-6 h-6 text-green-600 dark:text-green-300" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Real-time Translation</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Instant translation powered by advanced AI technology.
              </p>
            </Card>

            <Card className="text-center p-6 border-0 bg-white/60 backdrop-blur-sm dark:bg-slate-800/60">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Globe className="w-6 h-6 text-purple-600 dark:text-purple-300" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">50+ Languages</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Support for major world languages with auto-detection capabilities.
              </p>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
