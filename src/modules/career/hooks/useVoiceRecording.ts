import { useState, useRef, useCallback } from 'react';
import { supabase } from '@/modules/career/integrations/supabase/client';
import { useAuth } from '@/modules/career/contexts/AuthContext';
import { toast } from 'sonner';
import { handleError } from '@/modules/career/lib/handleError';

interface UseVoiceRecordingOptions {
  onTranscription?: (text: string) => void;
}

export function useVoiceRecording({ onTranscription }: UseVoiceRecordingOptions = {}) {
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const { user } = useAuth();

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
        stream.getTracks().forEach(track => track.stop());
        
        // Convert to base64 and send to transcription
        setIsTranscribing(true);
        try {
          const reader = new FileReader();
          reader.readAsDataURL(audioBlob);
          reader.onloadend = async () => {
            const base64Audio = (reader.result as string).split(',')[1];
            
            const { data, error } = await supabase.functions.invoke('transcribe-voice', {
              body: { audio: base64Audio, mimeType: 'audio/webm', userId: user?.id }
            });
            
            if (error) {
              handleError(error, { context: 'Transcription', userMessage: 'Failed to transcribe audio' });
              return;
            }
            
            // Handle quota exceeded
            if (data?.error && data?.remaining !== undefined) {
              toast.error(`Voice quota exceeded. ${data.remaining} of ${data.limit} remaining.`);
              return;
            }
            
            if (data?.text) {
              onTranscription?.(data.text);
              toast.success('Voice transcribed successfully');
            } else if (data?.error) {
              toast.error(data.error);
            }
          };
        } catch (err) {
          handleError(err, { context: 'Transcription', userMessage: 'Failed to transcribe audio' });
        } finally {
          setIsTranscribing(false);
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      handleError(err, { context: 'Recording', userMessage: 'Could not access microphone. Please check permissions.' });
    }
  }, [onTranscription, user?.id]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  }, [isRecording]);

  const toggleRecording = useCallback(() => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  }, [isRecording, startRecording, stopRecording]);

  return {
    isRecording,
    isTranscribing,
    startRecording,
    stopRecording,
    toggleRecording
  };
}
