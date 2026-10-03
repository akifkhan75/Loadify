import { useState, useEffect } from 'react';
// import Voice, { SpeechResultsEvent, SpeechErrorEvent } from 'react-native-voice';

const useVoiceRecognition = () => {
    const [isListening, setIsListening] = useState(false);
    const [recognizedText, setRecognizedText] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        // const onSpeechResults = (e: SpeechResultsEvent) => {
        //     if (e.value && e.value.length > 0) {
        //         setRecognizedText(e.value[0]);
        //     }
        //     setIsListening(false);
        // };
        // const onSpeechError = (e: SpeechErrorEvent) => {
        //     setError(e.error?.message || 'An unknown voice error occurred');
        //     setIsListening(false);
        // };
        //  const onSpeechEnd = () => {
        //     setIsListening(false);
        // };

        // Voice.onSpeechError = onSpeechError;
        // Voice.onSpeechResults = onSpeechResults;
        // Voice.onSpeechEnd = onSpeechEnd;

        // return () => {
        //     Voice.destroy().then(Voice.removeAllListeners);
        // };
    }, []);

    const startRecognition = async () => {
        try {
            // await Voice.start('en-US');
            setIsListening(true);
            setRecognizedText('');
            setError('');
        } catch (e) {
            setError('Failed to start voice recognition');
            console.error(e);
        }
    };

    const stopRecognition = async () => {
        try {
            // await Voice.stop();
            setIsListening(false);
        } catch (e) {
            setError('Failed to stop voice recognition');
            console.error(e);
        }
    };

    return {
        isListening,
        recognizedText,
        error,
        startRecognition,
        stopRecognition,
    };
};

export default useVoiceRecognition;
