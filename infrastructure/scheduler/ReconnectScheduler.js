class ReconnectScheduler {
    constructor(maxRetries, retryInterval) {
        this.maxRetries = maxRetries;
        this.retryInterval = retryInterval;
        this.currentAttempt = 0;
    }

 
    async schedule(reconnectFn) {
        if (this.currentAttempt >= this.maxRetries) {
            console.error(`Falha ao reconectar após ${this.maxRetries} tentativas. Abortando.`);
            return;
        }

        console.log(`Tentativa de reconexão (${this.currentAttempt + 1}/${this.maxRetries})...`);
        this.currentAttempt++;

        setTimeout(async () => {
            try {
                await reconnectFn();
                console.log('Reconexão bem-sucedida.');
                this.currentAttempt = 0;
            } catch (err) {
                console.error('Erro na tentativa de reconexão:', err.message);
                await this.schedule(reconnectFn);
            }
        }, this.retryInterval);
    }
}

module.exports = ReconnectScheduler;
