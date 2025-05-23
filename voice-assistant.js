// Voice Assistant for Delightful Bean
class CoffeeVoiceAssistant {
    constructor() {
        this.recognition = null;
        this.synthesis = window.speechSynthesis;
        this.isListening = false;
        this.voiceButton = null;
        this.voiceIndicator = null;
        
        // Check for browser support
        this.hasSupport = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
        
        if (this.hasSupport) {
            this.initializeSpeechRecognition();
            this.createVoiceInterface();
        }
    }
    
    initializeSpeechRecognition() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        this.recognition = new SpeechRecognition();
        
        // Configure recognition
        this.recognition.continuous = false;
        this.recognition.interimResults = false;
        this.recognition.lang = 'en-US';
        
        // Set up event handlers
        this.recognition.onstart = () => {
            this.isListening = true;
            this.updateUI();
        };
        
        this.recognition.onend = () => {
            this.isListening = false;
            this.updateUI();
        };
        
        this.recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            this.isListening = false;
            this.updateUI();
            
            if (event.error === 'no-speech') {
                this.speak("I didn't hear anything. Please try again.");
            }
        };
        
        this.recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript.toLowerCase();            console.log('User said:', transcript);
            this.handleVoiceCommand(transcript);
        };
    }
    
    createVoiceInterface() {
        // Create voice button container
        const voiceContainer = document.createElement('div');
        voiceContainer.className = 'voice-assistant-container';
        voiceContainer.innerHTML = `
            <button class="voice-assistant-button" aria-label="Voice assistant">
                <i class="fas fa-microphone"></i>
            </button>
            <div class="voice-indicator hidden">
                <div class="voice-wave"></div>
                <span class="voice-text">Listening...</span>
            </div>
        `;
        
        // Add styles
        const styles = document.createElement('style');
        styles.textContent = `
            .voice-assistant-container {
                position: fixed;
                bottom: 20px;
                right: 20px;
                z-index: 1000;
            }
            
            .voice-assistant-button {
                width: 60px;
                height: 60px;
                border-radius: 50%;
                background-color: var(--secondary);
                color: white;
                border: none;
                cursor: pointer;
                box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
                transition: all 0.3s ease;
                font-size: 24px;
            }
            
            .voice-assistant-button:hover {
                background-color: #d65f41;
                transform: scale(1.1);
            }
            
            .voice-assistant-button.listening {
                background-color: #c0392b;
                animation: pulse 1.5s infinite;
            }            
            @keyframes pulse {
                0% { box-shadow: 0 0 0 0 rgba(192, 57, 43, 0.7); }
                70% { box-shadow: 0 0 0 10px rgba(192, 57, 43, 0); }
                100% { box-shadow: 0 0 0 0 rgba(192, 57, 43, 0); }
            }
            
            .voice-indicator {
                position: absolute;
                bottom: 70px;
                right: 0;
                background: white;
                padding: 10px 20px;
                border-radius: 20px;
                box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
                white-space: nowrap;
            }
            
            .voice-indicator.hidden {
                display: none;
            }
            
            .voice-wave {
                display: inline-block;
                width: 20px;
                height: 20px;
                margin-right: 10px;
                background: var(--secondary);
                border-radius: 50%;
                animation: wave 1s infinite;
            }
            
            @keyframes wave {
                0%, 100% { transform: scale(0.8); }
                50% { transform: scale(1.2); }
            }
            
            .voice-text {
                color: var(--dark);
                font-weight: 500;
            }
        `;
        
        document.head.appendChild(styles);
        document.body.appendChild(voiceContainer);