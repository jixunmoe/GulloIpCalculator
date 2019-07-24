(function () {
    'use strict';

    function invalidIpPart(part) {
        return part <= 0 || part > 255;
    }

    var locations = ['Germany', 'Canada', 'Bulgaria', 'Pennsylvania', 'Finland'];
    var database = {
        10: '88.198.50.201',
        12: '148.251.3.246',
        20: '192.99.148.130',
        30: '82.118.234.154',
        40: '199.187.125.84',
        42: '76.72.171.42',
        50: '95.216.20.157',
    };

    function calculateIp(internal) {
        var ipParts = internal.match(/^10\.10\.(\d{1,3})\.(\d{1,3})$/);
        if (!ipParts) {
            return;
        }

        var serverIdInfo = parseInt(ipParts[1], 10);
        var serverAddr = parseInt(ipParts[2], 10);

        if (invalidIpPart(serverIdInfo) || invalidIpPart(serverAddr)) {
            return;
        }

        var serverId = serverIdInfo & ~1;
        var highPort = (serverIdInfo & 1);

        var ip = database[serverId];
        if (!ip) { return; }

        var serverNameIndex = ((serverIdInfo / 10)|0) - 1;

        var portStart = highPort * 30 + serverAddr * 100;
        var portEnd = portStart + 19;
        var sshPort = portEnd + 1;
        
        return {
            ip: ip,
            name: locations[serverNameIndex],
            portStart: portStart,
            portEnd: portEnd,
            sshPort: sshPort,
        };
    }

    var $ip = document.getElementById('ip');
    var $f = document.getElementById('ip-form');
    var $result = document.getElementById('result');
    $ip.onblur = $ip.onchange = $ip.onkeyup = updateIp;
    $f.onsubmit = function (e) {
        e.preventDefault();
        updateIp();
    };

    var state = {};
    function updateIp() {
        if ($ip.value === state.ip) { return; }

        var ip = state.ip = $ip.value;
        var information = calculateIp(ip);

        if (!information) {
            $result.textContent = '\n\nInvalid IP or unknown IP.';
            return;
        }

        var extIp = information.ip;
        var name = information.name;
        var portStart = information.portStart;
        var portEnd = information.portEnd;
        var sshPort = information.sshPort;

        $result.textContent = formatText([
            ['Internal IP', ip],
            ['External IP', extIp],
            ['Location', name],
            ['Port (start)', portStart.toString()],
            ['Port (end)', portEnd.toString()],
            ['Port (ssh)', sshPort.toString()] ]);
    }

    function formatText(items) {
        var ref = items.reduce(function (ref, ref$1) {
            var aLen = ref[0];
            var bLen = ref[1];
            var a = ref$1[0];
            var b = ref$1[1];

            return [Math.max(a.length, aLen), Math.max(b.length, bLen)];
        }, [0, 0]);
        var aMax = ref[0];
        var bMax = ref[1];
        return items.map(function (ref) {
            var a = ref[0];
            var b = ref[1];

            return padString(a, ' ', '', aMax) + '   ' + padString(b, '', ' ', bMax);
        }).join('\n');
    }

    function padString(str, left, right, len) {
        while(str.length < len) {
            str = left + str + right;
        }

        return str;
    }

    [].forEach.call(document.getElementsByTagName('input'), function (i) { return i.disabled = false; });

    var hashIp = location.hash.slice(1);
    if (hashIp) {
        $ip.value = hashIp;
    }

    setTimeout(updateIp);

}());
//# sourceMappingURL=bundle.js.map
