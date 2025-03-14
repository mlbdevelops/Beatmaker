import React, { useState, useEffect, useCallback } from 'react';
import * as Tone from 'tone';
import { Play, Square, Settings } from 'lucide-react';

interface BeatMakerProps {
  audioUrl: string;
}

export const BeatMaker: React.FC<BeatMakerProps> = ({ audioUrl }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [bpm, setBpm] = useState(120);
  const [steps, setSteps] = useState(Array(8).fill(false));
  const [player, setPlayer] = useState<Tone.Player | null>(null);

  useEffect(() => {
    const newPlayer = new Tone.Player(audioUrl).toDestination();
    setPlayer(newPlayer);

    return () => {
      newPlayer.dispose();
    };
  }, [audioUrl]);

  const toggleStep = (index: number) => {
    setSteps(prev => prev.map((step, i) => i === index ? !step : step));
  };

  const startSequence = useCallback(async () => {
    if (!player) return;

    await Tone.start();
    Tone.Transport.bpm.value = bpm;

    const seq = new Tone.Sequence(
      (time, index) => {
        if (steps[index]) {
          player.start(time);
        }
      },
      [...Array(8).keys()],
      '8n'
    );

    seq.start(0);
    Tone.Transport.start();
    setIsPlaying(true);

    return () => {
      seq.dispose();
      Tone.Transport.stop();
      setIsPlaying(false);
    };
  }, [player, steps, bpm]);

  const stopSequence = () => {
    Tone.Transport.stop();
    setIsPlaying(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 bg-white/5 p-4 rounded-lg">
        <Settings className="text-indigo-400" />
        <div className="flex items-center gap-2">
          <label className="text-white text-sm">BPM:</label>
          <input
            type="number"
            value={bpm}
            onChange={(e) => setBpm(Number(e.target.value))}
            className="w-20 bg-white/10 text-white border border-indigo-500/30 rounded px-2 py-1"
            min="60"
            max="200"
          />
        </div>
        <button
          onClick={isPlaying ? stopSequence : startSequence}
          className="ml-auto bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          {isPlaying ? <Square size={18} /> : <Play size={18} />}
          {isPlaying ? 'Stop' : 'Play'}
        </button>
      </div>

      <div className="grid grid-cols-8 gap-2">
        {steps.map((active, i) => (
          <button
            key={i}
            onClick={() => toggleStep(i)}
            className={`h-16 rounded-lg transition-all ${
              active 
                ? 'bg-indigo-500 shadow-lg scale-105' 
                : 'bg-white/10 hover:bg-white/20'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default BeatMaker;