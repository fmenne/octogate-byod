var checkCertificate = (function () {
  const CHECK_TIME = 10000;
  var timeout = 0;
  var installCert = false;

  return async function checkCertificate (install) {
    if (install) {
      installCert = true;
    }

    if (cordova.platformId === 'ios') {
      var found = await fetch('https://enricodegiorgi.com/', {
        mode: 'no-cors'
      }).then((r) => {
        return true;
      }).catch((e) => {
        return false;
      });
    } else {
      var found = await CertList.getList().then((list) => {
        return list.find(e => e.indexOf('OctoGate') > -1) !== undefined;
      });
    }

    if (found) {
      return true;
    } else if (installCert) {
      installCert = false;
      if (cordova.platformId === 'ios') {
        window.open('http://octogate.de/fileadmin/ssl-test/OctoGateCA.der', '_system');
        var result = true;
      } else {
        var result = await CertList.installCert().then(() => true);
      }
      if (result) {
        result = await new Promise((resolve) => {
          document.addEventListener('resume', function (e) {
            document.removeEventListener(e.type, arguments.callee);
            checkCertificate().then((res) => resolve(res));
          })
        });

        return result;
      }

      return result;
    } else {
      return false;
    }
  }
})();