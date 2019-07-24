function invalidIpPart(part) {
    return part <= 0 || part > 255;
}

const locations = ['Germany', 'Canada', 'Bulgaria', 'Pennsylvania', 'Finland'];
const database = {
    10: '88.198.50.201',
    12: '148.251.3.246',
    20: '192.99.148.130',
    30: '82.118.234.154',
    40: '199.187.125.84',
    42: '76.72.171.42',
    50: '95.216.20.157',
};

export default function calculateIp(internal) {
    const ipParts = internal.match(/^10\.10\.(\d{1,3})\.(\d{1,3})$/);
    if (!ipParts) {
        return;
    }

    const serverIdInfo = parseInt(ipParts[1], 10);
    const serverAddr = parseInt(ipParts[2], 10);

    if (invalidIpPart(serverIdInfo) || invalidIpPart(serverAddr)) {
        return;
    }

    const serverId = serverIdInfo & ~1;
    const highPort = (serverIdInfo & 1);

    const ip = database[serverId];
    if (!ip) return;

    const serverNameIndex = ((serverIdInfo / 10)|0) - 1;

    const portStart = highPort * 30 + serverAddr * 100;
    const portEnd = portStart + 19;
    const sshPort = portEnd + 1;
    
    return {
        ip,
        name: locations[serverNameIndex],
        portStart,
        portEnd,
        sshPort,
    };
}
