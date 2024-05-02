const axios = require("axios");
const WebSocket = require("ws");
const EventEmitter = require("events");

class DiscordBot extends EventEmitter {
    constructor() {
        super();
        this.token = null;
        this.intents = 32767;
        this.ws = null;
    }

    async login(token) {
        this.token = token;
        try {
            this.ws = new WebSocket("wss://gateway.discord.gg/?v=9&encoding=json");

            this.ws.on('open', () => {
                const identifyPayload = {
                    op: 2,
                    d: {
                        token: this.token,
                        intents: this.intents,
                        properties: {
                            $os: 'linux',
                            $browser: 'my_library',
                            $device: 'my_library'
                        }
                    }
                };

                this.ws.send(JSON.stringify(identifyPayload));
            })
            this.ws.on('message', (data) => {
                const payload = JSON.parse(data);

                if (payload.t === "MESSAGE_CREATE") {
                    this.emit("messageCreate", payload.d);
                }
            });

            this.emit("ready", "Bot sunucuya başarıyla giriş yaptı.");
        }
        catch (err) {
            console.error('Hata:', error.response.data);
            if (this.ws) {
                this.ws.close();
            }
        }
    }

    async getBotIdFromToken() {
        try {
            const response = await axios.get('https://discord.com/api/v9/users/@me', {
                headers: {
                    Authorization: `Bot ${this.token}`
                }
            });

            return response.data.id;
        } catch (error) {
            console.error('Hata:', error.response.data);
            return null;
        }
    }

    async getChannelName(channelId) {
        try {
            const response = await axios.get(`https://discord.com/api/v9/channels/${channelId}`, {
                headers: {
                    'Authorization': `Bot ${this.token}`
                }
            });

            const channelName = response.data.name;
            return channelName;
        } catch (error) {
            console.error('Kanal bilgilerini alma hatası:', error);
        }
    }

    async deleteMessages(channelId, limit) {
        try {
            const id = channelId;

            const response = await axios({
                method: 'get',
                url: `https://discord.com/api/v9/channels/${id}/messages`,
                headers: {
                    'Authorization': `Bot ${this.token}`
                },
                params: {
                    limit: limit
                }
            });

            const messageIds = response.data.map(message => message.id);

            const deleteResponse = await axios({
                method: 'post',
                url: `https://discord.com/api/v9/channels/${id}/messages/bulk-delete`,
                headers: {
                    'Authorization': `Bot ${this.token}`,
                    'Content-Type': 'application/json'
                },
                data: {
                    messages: messageIds
                }
            });
            return deleteResponse;
        } catch (error) {
            console.error('Mesajları silme hatası:', error.response.data);
        }
    }
    async sendMessage(channelId, msg) {
        try {
            const response = await axios({
                method: 'post',
                url: `https://discord.com/api/v9/channels/${channelId}/messages`,
                headers: {
                    'Authorization': `Bot ${this.token}`,
                    'Content-Type': 'application/json'
                },
                data: {
                    content: msg
                }
            });

            return response.data;
        } catch (error) {
            console.error('Mesaj gönderme hatası:', error.response.data);
        }
    }
    async deleteMessage(channelId, messageId) {
        try {
            const response = await axios({
                method: 'delete',
                url: `https://discord.com/api/v9/channels/${channelId}/messages/${messageId}`,
                headers: {
                    'Authorization': `Bot ${this.token}`,
                }
            });

            return response.data;
            } catch (error) {
            console.error('Mesaj silme hatası:', error.response.data);
        }
    }
}

module.exports = DiscordBot;