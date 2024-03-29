const { Agora } = require("./agora");
const { MemCache }  = require("./memCache");
require("dotenv").config();

class SocketEvents {
    agora = new Agora();

    nsp;
    socket;

    init(nsp, socket) {
        this.nsp = nsp;
        this.socket = socket;
        this.listenEvents();
    }

    listenEvents() {
        this.connectCall();
        this.acceptCall();
        this.rejectCall();
    }

    /**
     * @param id // other user id
     * use to connect call
     */
    connectCall() {
        this.socket.on("connectCall", async (data) => {
            const me = this.socket.user.id;
            data.channel = me + 'channel';
            data.token = await this.agora.generateToken(data.channel, me);
            data.appId = process.env.APP_ID;
            const recSocket = MemCache.hget(process.env.CHAT_SOCKET, `${data.id}`);
            const reqSocket = MemCache.hget(process.env.CHAT_SOCKET, `${me}`);
            if(reqSocket) {
                let otherId = data.id;
                data.id = me;
                this.nsp.to(reqSocket).emit("onCallTransfer", {...data,message:"INCOMING CALL",otherId});
            }
            if (recSocket) {
                data.id = me;

                this.nsp.to(recSocket).emit("onCallRequest", data);
            }
        })
    }

    /**
     * @param id // other user id
     * @param channel
     * @param token
     * use to accept call
     */

     acceptCall() {
        this.socket.on("acceptCall", async (data) => {
            const me = this.socket.user.id;
            data.otherUserId = me;
            const recSocket = MemCache.hget(process.env.CHAT_SOCKET, `${data.id}`);
            if (recSocket) {
                this.nsp.to(recSocket).emit("onAcceptCall", data);
            }
        })
    }

    /**
     * @param id // other user id
     * use to reject call
    */
    rejectCall() {
        this.socket.on("rejectCall", async (data) => {
            const me = this.socket.user.id;
            const recSocket = MemCache.hget(process.env.CHAT_SOCKET, `${data.id}`);
            const reqSocket = MemCache.hget(process.env.CHAT_SOCKET, `${me}`);
            if(reqSocket) {
                let otherId = data.id;
                data.id = me;
                this.nsp.to(reqSocket).emit("onCallTransfer", {...data,  name: data.name,message:"MISSED CALL",otherId});
            }
            if (recSocket) {
                const res = { id: me , name: data.name};
                this.nsp.to(recSocket).emit("onRejectCall", res);
            }
        })
    }
}

module.exports = {SocketEvents}