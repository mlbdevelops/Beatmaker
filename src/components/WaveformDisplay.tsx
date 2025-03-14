import React, { useEffect, useRef } from 'react';
import WaveSurfer from 'wavesurfer.js';

interface WaveformDisplayProps {
  audioBlob: Blob | null;
}

export const WaveformDisplay: React.FC<WaveformDisplayProps> = ({ audioBlob }) => {
  const waveformRef = useRef<HTMLDivElement>(null);
  const wavesurfer = useRef<WaveSurfer | null>(null);

  useEffect(() => {
    if (waveformRef.current && audioBlob) {
      if (wavesurfer.current) {
        wavesurfer.current.destroy();
      }

      wavesurfer.current = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: '#4F46E5',
        progressColor: '#818CF8',
        cursorColor: '#312E81',
        height: 100,
        normalize: true,
      });

      const audioUrl = URL.createObjectURL(audioBlob);
      wavesurfer.current.load(audioUrl);

      return () => {
        URL.revokeObjectURL(audioUrl);
      };
    }
  }, [audioBlob]);

  return (
    <div className="w-full bg-white p-4 rounded-lg shadow-md">
      <div ref={waveformRef} />
    </div>
  );
};