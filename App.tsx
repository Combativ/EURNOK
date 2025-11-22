import React, { useState, useEffect, useCallback } from "react";
import { fetchExchangeRate } from "./services/geminiService";
import { CurrencyInput } from "./components/CurrencyInput";
import { Toggle } from "./components/Toggle";
import { Currency, ExchangeRateData } from "./types";

const DEFAULT_RATE = 11.8;

const App: React.FC = () => {
  const [rateData, setRateData] = useState<ExchangeRateData>({
    rate: DEFAULT_RATE,
    lastUpdated: 0,
  });

  const [amountNOK, setAmountNOK] = useState<string>("");
  const [amountEUR, setAmountEUR] = useState<string>("");
  const [isOfflineMode, setIsOfflineMode] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [isInverted, setIsInverted] = useState<boolean>(false);

  useEffect(() => {
    const savedRate = localStorage.getItem("nordic_convert_rate");
    const savedOffline = localStorage.getItem("nordic_convert_offline");

    if (savedRate) {
      try {
        const parsed = JSON.parse(savedRate);
        setRateData(parsed);
      } catch (e) {
        console.error("Error parsing saved rate", e);
      }
    }

    if (savedOffline) {
      setIsOfflineMode(savedOffline === "true");
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("nordic_convert_offline", String(isOfflineMode));
  }, [isOfflineMode]);

  const updateRate = useCallback(async () => {
    if (isOfflineMode) return;

    setIsLoading(true);
    setError(null);
    const data = await fetchExchangeRate();

    if (data) {
      setRateData(data);
      localStorage.setItem("nordic_convert_rate", JSON.stringify(data));

      if (amountEUR) {
        const val = parseFloat(amountEUR.replace(",", "."));
        if (!isNaN(val)) {
          setAmountNOK((val * data.rate).toFixed(2));
        }
      }
    } else {
      setError("Aktualisierung fehlgeschlagen");
    }
    setIsLoading(false);
  }, [isOfflineMode, amountEUR]);

  useEffect(() => {
    if (!isOfflineMode) {
      const isStale = Date.now() - rateData.lastUpdated > 3600000;
      if (isStale || rateData.lastUpdated === 0) {
        updateRate();
      }
    }
  }, [isOfflineMode]);

  const handleEURChange = (value: string) => {
    setAmountEUR(value);
    if (value === "" || value === "." || value === ",") {
      setAmountNOK("");
      return;
    }
    const eur = parseFloat(value.replace(",", "."));
    if (!isNaN(eur)) {
      setAmountNOK((eur * rateData.rate).toFixed(2));
    }
  };

  const handleNOKChange = (value: string) => {
    setAmountNOK(value);
    if (value === "" || value === "." || value === ",") {
      setAmountEUR("");
      return;
    }
    const nok = parseFloat(value.replace(",", "."));
    if (!isNaN(nok)) {
      setAmountEUR((nok / rateData.rate).toFixed(2));
    }
  };

  const handleSwap = () => {
    const wasInverted = isInverted;
    setIsInverted(!wasInverted);
    if (wasInverted) {
      handleEURChange(amountNOK);
    } else {
      handleNOKChange(amountEUR);
    }
  };

  const eurInput = (
    <CurrencyInput
      label="Euro"
      currency={Currency.EUR}
      value={amountEUR}
      onChange={handleEURChange}
    />
  );

  const nokInput = (
    <CurrencyInput
      label="Kronen"
      currency={Currency.NOK}
      value={amountNOK}
      onChange={handleNOKChange}
    />
  );

  return (
    <div className="min-h-screen bg-[#f5f5f5] flex flex-col font-sans">
      {/* Status Bar Spacer for Android */}
      <div className="h-8 w-full bg-primary-600 fixed top-0 z-50"></div>

      {/* App Bar */}
      <header className="bg-primary-600 text-white shadow-material-1 h-14 flex items-center justify-between px-4 fixed w-full top-8 z-40">
        <h1 className="text-xl font-medium tracking-wide">NordicConvert</h1>

        {!isOfflineMode && (
          <button
            onClick={updateRate}
            disabled={isLoading}
            className="p-2 rounded-full hover:bg-white/10 active:bg-white/20 transition-colors disabled:opacity-50"
          >
            <svg
              className={`w-6 h-6 ${isLoading ? "animate-spin" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </button>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 pt-28 px-4 pb-6 flex flex-col items-center w-full max-w-md mx-auto">
        <div className="w-full mb-4 px-2">
          <p className="text-center text-gray-600 text-sm">Aktueller Kurs</p>
          <div className="flex justify-center items-baseline gap-2 mt-1 text-primary-700">
            <span className="font-medium text-lg">1 EUR =</span>
            <span className="font-bold text-3xl">
              {rateData.rate.toFixed(2)}
            </span>
            <span className="font-medium text-lg">NOK</span>
          </div>
        </div>

        <div className="bg-[#fafafa] w-full rounded shadow-material-1 p-4 space-y-4 border border-gray-200">
          {isInverted ? nokInput : eurInput}

          <div className="flex justify-center -my-3 relative z-10">
            <button
              onClick={handleSwap}
              className="bg-primary-600 text-white p-2 rounded-full shadow-material-2 active:shadow-material-1 active:bg-primary-700 transition-all transform active:scale-95"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                />
              </svg>
            </button>
          </div>

          {isInverted ? eurInput : nokInput}
        </div>

        <div className="w-full mt-6 bg-[#fafafa] rounded shadow-material-1 p-4 border border-gray-200">
          <Toggle
            label="Offline-Modus"
            checked={isOfflineMode}
            onChange={setIsOfflineMode}
          />
        </div>

        <div className="mt-6 text-center space-y-2 opacity-70 pb-8">
          <div className="text-xs text-gray-500">
            {isOfflineMode ? "Offline Cache" : "Zuletzt aktualisiert:"} <br />
            <span className="font-medium">
              {new Date(rateData.lastUpdated).toLocaleDateString("de-DE")}{" "}
              {new Date(rateData.lastUpdated).toLocaleTimeString("de-DE", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
