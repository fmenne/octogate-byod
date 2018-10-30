let UserLogin = {};
(function (_api) {
  let doofOfConcept = 0;

  async function doLogin (username, password) {
    let formData = new FormData();
    formData.append('user', username);
    formData.append('pass', password);
    formData.append('toa', 'toa');

    let data = await fetch('http://octo.octo:1983/index.pls?auto=1', {
      body: formData,
      method: 'POST'
    });

    let result = await UserInfo.getUserInfo();

    let status = result.status || 'noentry';

    return status === 'active';

    // console.log(doofOfConcept);

    // let delayResolver = null;
    // setTimeout(() => delayResolver(true), 2000);
    // await (new Promise((resolve) => delayResolver = resolve));

    // return doofOfConcept++ === 2;
  }

  async function render (previousChecks) {
    let resolver = null;

    let userNameField = loginForm.querySelector('#username');
    let userPasswordField = loginForm.querySelector('#password');

    let onLoginClick = function (event) {
      taskListShow();
      loginFormHide();

      let userName = userNameField.value;
      let userPassword = userPasswordField.value;      

      userNameField.value = '';
      userPasswordField.value = '';

      if (previousChecks.check_owner.resultValue === 'user') {
        localStorage.setItem('user_name', userName);
        localStorage.setItem('user_password', userPassword);
      }

      doLogin(userName, userPassword).then((state) => {
        if (state) {
          resolver(true);
        } else {
          resolver(false);
        }
      });
    }

    var loginButton = loginForm.querySelector('#login');
    loginButton.addEventListener('click', onLoginClick);

    let state = false;

    do {
      taskListHide();
      loginFormShow();

      userNameField.focus();

      state = await (new Promise((resolve) => { resolver = resolve }));

      if (!state) {
        loginForm.classList.add('has-errors');
      } else {
        loginForm.classList.remove('has-errors');
      }
    } while (!state);

    loginButton.removeEventListener('click', onLoginClick);

    return state;
  }

  Object.assign(_api, {
    render,
    doLogin
  });
})(UserLogin);