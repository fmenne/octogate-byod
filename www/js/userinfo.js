let UserInfo = {};

// %%userupper%% , %%userlower%%, %%octogate%%

(function (_api) {
  let infoElement = null;
  let countDownElement = null;
  let countDownTimeout = 0;
  let updateTimeout = 0;
  let endDate = null;

  let data = {};
  let _data = {
    "src": "192.168.32.135",
    "description": null,
    "type": "Voucher Login",
    "profile_name": 'Schüler',
    "ssl": null,
    "username": 'mmuster',
    "dead_date": "2018-10-31 14:58:18",
    "status": "active"
  };

  function updateCountDown (element) {
    let currentDate = Date.now();
    let diff = Math.floor((endDate - currentDate) / 1000);
    let negative = false;

    if (diff < 0) {
      negative = true;
      diff = Math.abs(diff);
    }

    let seconds = diff % 60;
    let minutes = Math.floor(diff / 60) % 60;
    let hours = Math.floor(diff / 60 / 60) % 24;

    seconds = "00".substr(0, 2 - seconds.toString().length) + seconds;
    minutes = "00".substr(0, 2 - minutes.toString().length) + minutes;

    element.innerText = `${negative ? '-' : ''}${hours}:${minutes}:${seconds}`;

    clearTimeout(countDownTimeout);
    countDownTimeout = setTimeout(() => updateCountDown(element), 1000);
  }

  async function getUserInfo () {
    // let info = await fetch('http://octo.octo:1983/index.pl?query=status');
    // data = await info.json();

    // alert (JSON.stringify(data));

    data = _data;
    return data;
  }

  async function render (parent) {
    let update = false;
    if (infoElement instanceof HTMLElement) {
      update = true;
    } else {
      update = false;
      infoElement = document.createElement('div');
      infoElement.classList.add('user-info');
      parent.appendChild(infoElement);
    }

    let userInfo = await (getUserInfo());

    if (update) {
        Array.from(infoElement.childNodes).forEach((child) => {
          infoElement.removeChild(child);
        });
    }

    let [date, time] = userInfo.dead_date.split(' ');
    let [hours, minutes, seconds] = time.split(':').map(d => parseInt(d));
    let [year, month, day] = date.split('-').map((d, i) => (i !== 1) ? parseInt(d) : parseInt(d) - 1);

    endDate = new Date(year, month, day, hours, minutes, seconds).getTime();

    let infoLine = document.createElement('p');
    infoLine.innerHTML = `Angemeldet als <b>${userInfo.username}</b> mit dem Profil <b>${userInfo.profile_name}</b>.`
    infoElement.appendChild(infoLine);

    infoLine = document.createElement('p');
    infoLine.innerHTML = `Ihr <b>${userInfo.type}</b> endet in `;
    infoElement.appendChild(infoLine);

    if (!(countDownElement instanceof HTMLElement)) {
      countDownElement = document.createElement('b');
    }

    clearTimeout(countDownTimeout);
    updateCountDown(countDownElement);

    infoLine.appendChild(countDownElement);

    updateTimeout = setTimeout(() => render(parent), 5000);

    return infoElement;
  }

  function getData () {
    return data;
  }

  function stopUpdate () {
    clearTimeout(updateTimeout);
    updateTimeout = 0;
  }

  Object.assign(_api, {
    getUserInfo,
    render,
    getData,
    stopUpdate,
    _debug: _data
  });
})(UserInfo)