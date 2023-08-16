new Vue({
    el: '#app',
    data: {
        message: '',
        messages: []
    },
    methods: {
        start(){
            if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
                const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
                const recognition = new SpeechRecognition();

                recognition.onstart = function() {
                    console.log('Reconnaissance vocale activée');
                };

                recognition.onresult = (event) => {
                    const transcript = event.results[0][0].transcript;
                    this.message = transcript; // Mettre à jour le message avec la transcription
                    this.sendMessage(); // Envoyer le message
                };

                recognition.onerror = function(event) {
                    console.error('Erreur de reconnaissance vocale:', event.error);
                };

                recognition.start();
            } else {
                console.error('La reconnaissance vocale n\'est pas prise en charge dans ce navigateur');
            }
        },
        
        sendMessage() {
            const url = 'https://taiwa-project.fr/api';
            const messageToSend = this.message.trim();
            // this.message = '';
            this.messages = ""

            fetch(url, {
                method: 'POST',
                body: JSON.stringify({ instruction: messageToSend }),
                headers: { 'Content-Type': 'application/json' }
            })
            .then(response => response.body)
            .then(body => {
                const reader = body.getReader();
                
                // Traitement de la réponse en streaming
                reader.read().then(function processStream({ done, value }) {
                    if (done) return;

                    // Convertir l'Uint8Array en chaîne de caractères et ajouter à la liste des messages
                    const text = new TextDecoder('utf-8').decode(value);
                    this.messages = text.replace("data:", "");

                    return reader.read().then(processStream.bind(this));
                }.bind(this));
            })
            .catch(error => {
                console.error('Une erreur est survenue:', error);
            });
        }
    }
});