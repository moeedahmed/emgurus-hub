import { useState, useCallback } from 'react';
import html2canvas from 'html2canvas';

interface UseScreenshotReturn {
    captureScreen: (delayMs?: number) => Promise<string | null>;
    isCapturing: boolean;
    error: string | null;
}

export const useScreenshot = (): UseScreenshotReturn => {
    const [isCapturing, setIsCapturing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const captureScreen = useCallback(async (delayMs = 100) => {
        try {
            setIsCapturing(true);
            setError(null);

            // Wait for UI to settle (e.g. modals to close)
            await new Promise(resolve => setTimeout(resolve, delayMs));

            const canvas = await html2canvas(document.body, {
                useCORS: true,
                allowTaint: true,
                logging: false,
                backgroundColor: null,
                ignoreElements: (element) => {
                    return element.hasAttribute('data-screenshot-ignore');
                }
            });

            const dataUrl = canvas.toDataURL('image/png', 0.8);
            setIsCapturing(false);
            return dataUrl;
        } catch (err: unknown) {
            console.error('Screenshot capture failed:', err);
            setError(err instanceof Error ? err.message : 'Failed to capture screenshot');
            setIsCapturing(false);
            return null;
        }
    }, []);

    return { captureScreen, isCapturing, error };
};
