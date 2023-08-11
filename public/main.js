new Vue({
    el: '#app',
    data: {
        message: '',
        messages: []
    },
    methods: {
        sendMessage: function() {
            const url = 'http://51.159.159.214:5000/instruct';
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