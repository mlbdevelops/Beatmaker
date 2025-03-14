import React, { useState } from 'react';
import { Music2 } from 'lucide-react';
import { AudioRecorder } from './components/AudioRecorder';
import { WaveformDisplay } from './components/WaveformDisplay';
import { BeatMaker } from './components/BeatMaker';

function App() {
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string>('');

  const handleAudioRecorded = (blob: Blob) => {
    setAudioBlob(blob);
    const url = URL.createObjectURL(blob);
    setAudioUrl(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-indigo-900 py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Music2 className="w-10 h-10 text-indigo-400" />
            <h1 className="text-4xl font-bold text-white">Beat Maker Studio</h1>
          </div>
          <p className="text-indigo-200">Transform your sounds into beats</p>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-xl shadow-lg p-6 space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-4 text-white">Record or Upload Sound</h2>
            <AudioRecorder onAudioRecorded={handleAudioRecorded} />
          </div>

          {audioBlob && (
            <>
              <div>
                <h2 className="text-xl font-semibold mb-4 text-white">Waveform</h2>
                <WaveformDisplay audioBlob={audioBlob} />
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-4 text-white">Beat Maker</h2>
                <BeatMaker audioUrl={audioUrl} />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;