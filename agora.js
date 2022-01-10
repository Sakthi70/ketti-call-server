const { RtcTokenBuilder, RtcRole } = require("agora-access-token");
require("dotenv").config();

// Rtc Examples
const appID = process.env.APP_ID;
const appCertificate = process.env.APP_CERTIFICATE;
const role = RtcRole.PUBLISHER;

class Agora {

    resourceId;

    async generateToken(channelName,uId) {
        // Build token with uid
        const tokenA = RtcTokenBuilder.buildTokenWithUid(appID, appCertificate, channelName, 0, role);
        return tokenA;
    }
}

module.exports = {Agora}