new Vue({
    el: '#app',
    data: {
        message: '',
        messageSTT: '',
        recorder: null,
        audioStream: null,
        messages: [],
        mediaRecorder: null,
        recording: false,
        audioChunks: []
    },
    methods: {

        triggerUpload() {
            this.$refs.fileInput.click();
          },
        async uploadFile() {
            const file = this.$refs.fileInput.files[0];
            if (file ) {
              const formData = new FormData();
              formData.append('ok', file), 'ok.wav';
      
              try {
                const response = await fetch('https://taiwa-project.fr/upload', {
                  method: 'POST',
                  body: formData
                });
                const data = await response.json();
                console.log(data);
                this.messageSTT = data.transcription
              } catch (error) {
                console.error('Erreur lors de l’envoi du fichier:', error);
              }
            } else {
              alert('Veuillez sélectionner un fichier nommé ok.wav');
            }
        },

        async startRecording() {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: {
                sampleRate: 16000,
                channelCount: 1
              } });
            this.mediaRecorder = new MediaRecorder(stream);

            this.audioStream = stream;
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const source = audioContext.createMediaStreamSource(stream);
            this.recorder = new Recorder(source, { numChannels: 1 });
            

            setTimeout(() => {
                this.recorder.record();
                this.recording = true;
            }, 1000);

            setTimeout(() => {
              this.stopRecording();
            }, 6000);  // Arrêter l'enregistrement après 5 secondes
          },
          stopRecording() {
            console.log("stooop");
              this.recorder.stop();
              this.recording = false;

              this.audioStream.getTracks()[0].stop();
              this.sendAudio()
          },
          sendAudio() {
            this.recorder.exportWAV((blob) => {

            const formData = new FormData();
            const audioFile = new File([blob], "ok.wav", { type: "audio/wav" });
            console.log("laaa", blob);

            formData.append('ok', audioFile);

            const audioUrl = URL.createObjectURL(blob);
            const audio = new Audio(audioUrl);
            audio.play();


            axios.post("https://taiwa-project.fr/upload", formData, {
                headers: {
                  "Content-Type": "multipart/form-data"
                }
              })
              .then(response => {
                console.log("res", response.data);
                this.messageSTT = response.data.message
              })
              .catch(error => {
                console.error("Erreur d'envoi:", error);
              });

            })

            // fetch("https://taiwa-project.fr/transcribe", {
            //   method: "POST",
            // //   mode: "no-cors",
            //   body: formData
            // })
            // .then(response => response.json())
            // .then(data => {
            //   console.log(data);
            //   this.messageSTT = data
            // })
            // .catch(error => {
            //   console.error("Erreur lors de l'envoi de l'audio:", error);
            // });
        },


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