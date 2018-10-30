CheckList.addTask('check_wifi_ap', CheckList.E_TASK_TYPE.REQUIRED, "Prüfe Netzwerk", (done) => {
  const allowed_macs = [
    '40:a5:ef',
    '52:a5:ef'
  ];

  alert (window.resolveLocalFileSystemURL('/www/crt/OctoGateCA.crt'))

  wifi = WifiInfo; //.getNetworkInfo
  wifi.getConnectedSSID((result) => {
    var bssid = result.bssid.substr(0, 8).toLowerCase();
    var match = allowed_macs.find((mac) => bssid.localeCompare(mac) === 0);

    if (match) {
      done(true, 'network_valid');
    } else {
      var dialog = dialogFix(document.getElementById('invalid_device'));
      dialog.showModal();

      done(false, 'network_invalid');
    }
  })
});

CheckList.addTask('check_storage', CheckList.E_TASK_TYPE.OPTIONAL_HIDDEN, "Prüfe Einstellungen", (done) => {
  result = storageAvailable('localStorage');
  done(result, result ? 'storage_available' : 'storage_notavailable');
})

CheckList.addTask('check_owner', CheckList.E_TASK_TYPE.OPTIONAL, "Prüfe Besitzer", (done) => {
  var owner = localStorage.getItem('device_owner');

  if (!owner) {
    var dialog = dialogFix(document.getElementById('owner_check'));

    dialog.onclose = function (event) {
      var resultValue = event.target.returnValue;
      localStorage.setItem('device_owner', resultValue);
      done(true, resultValue);
    }
    setTimeout(() => {
      dialog.showModal();
      alert (dialog.innerHTML);
    }, 500);
  } else {
    setTimeout(() => done(true, owner), 500);
  }
});

CheckList.addTask('check_cert', CheckList.E_TASK_TYPE.OPTIONAL, "Prüfe Stammzertifikat", (done) => {
  checkCertificate(true).then((result) => {
    if (!result) {
      var dialog = dialogFix(document.getElementById('import_error'));

      dialog.onclose = function (e) {
        if (e.target.returnValue === "retry") {
          setTimeout(() => {
            checkCertificate(true)
              .then((result) => done(result, result ? 'cert_valid' : 'cert_invalid'));
          });
        } else {
          setTimeout(() => done(false, 'cert_invalid'), 500);
        }
      };
      dialog.showModal();
    } else {
      setTimeout(() => done(result, result ? 'cert_valid' : 'cert_invalid'), 500);
    }
  });
});

CheckList.addTask('check_userdata', CheckList.E_TASK_TYPE.OPTIONAL, "Prüfe Benutzerdaten", (done, previousChecks) => {
  let userName = localStorage.getItem('user_name');
  let userPassword = localStorage.getItem('user_password');

  if (userName && userPassword) {
    UserInfo.getUserInfo().then((result) => {
      let status = result.status || 'noentry';

      if (status === 'active') {
        done(true, 'user_valid');
      } else {
        UserLogin.doLogin(userName, userPassword)
          .then((status) => {
            if (!status) {
              UserLogin.render(previousChecks)
                .then(() => done(true, 'user_valid'));
            } else {
              done(true, 'user_valid');
            }
          })
      }
    });
  } else {
    UserLogin.render(previousChecks)
      .then(() => done(true, 'user_valid'));
  }
});