class EmbedMsg {
    constructor() {
        this.embed = {};
    }

    setTitle(title) {
        this.embed.title = title;
        return this;
    }

    setDescription(description) {
        this.embed.description = description;
        return this;
    }

    setURL(url) {
        this.embed.url = url;
        return this;
    }

    setTimestamp(timestamp) {
        this.embed.timestamp = timestamp;
        return this;
    }

    setColor(color) {
        if (typeof color === 'string') {
            color = parseInt(color.replace(/^#/, ''), 16);
        }
        this.embed.color = color;
        return this;
    }

    setFooter(text, icon_url) {
        this.embed.footer = { text, icon_url };
        return this;
    }

    setImage(url) {
        this.embed.image = { url };
        return this;
    }

    setThumbnail(url) {
        this.embed.thumbnail = { url };
        return this;
    }

    setVideo(url) {
        this.embed.video = { url };
        return this;
    }

    setProvider(name, url) {
        this.embed.provider = { name, url };
        return this;
    }

    setAuthor(name, url, icon_url) {
        this.embed.author = { name, url, icon_url };
        return this;
    }

    addField(name, value, inline = false) {
        if (!this.embed.fields) {
            this.embed.fields = [];
        }
        this.embed.fields.push({ name, value, inline });
        return this;
    }

    build() {
        return this.embed;
    }
}

module.exports = EmbedMsg;
