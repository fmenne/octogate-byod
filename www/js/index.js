/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

// document.getElementById('content').appendChild(CheckList.getTaskList());

var taskList = document.querySelector('#content .checklist');
var loginForm = document.querySelector('#content .login-form');

let cWrapper = document.querySelector('.content-wrapper');
let menuPanel = document.getElementById('side-menu');
let menuButton = document.getElementById('menu-btn');
let appWrapper = document.querySelector('.app-wrapper');

let infoButton = document.getElementById('info-menu');

let splashWrapper = document.getElementById('content');
let infoWrapper = document.getElementById('info-dialog');

let darken = document.querySelector('.dark');
window.addEventListener('resize', updateHeight);

CheckList.getTaskList(taskList);

let style = document.createElement('style');
style.appendChild(document.createTextNode(''));
document.body.append(style);

Array.from(document.querySelectorAll('[target="_system"]')).forEach(link => {
  link.addEventListener('click', (event) => {
    event.preventDefault();

    window.open(link.href, '_system');
  })
})

style.sheet.insertRule(`.checklist {height:${taskList.clientHeight}px}`);
style.sheet.insertRule(`.login-form {height:172px}`);
style.sheet.insertRule(`.login-form.has-errors {height: 217px;}`);

taskList.addEventListener('transitionend', (e) => {
  taskList.removeAttribute('style');
});

loginForm.addEventListener('transitionend', (e) => {
  loginForm.removeAttribute('style');
});

appWrapper.addEventListener('transitionend', (e) => {
  loginForm.removeAttribute('style');
});

darken.addEventListener('transitionend', (e) => {
  let style = getComputedStyle(e.target);
  let o = style.opacity;

  if (o <= 0) {
    e.target.removeAttribute('style');
  }
});

menuPanel.addEventListener('transitionend', function (e) {
  cWrapper.classList.remove('menu--transition');
});

menuButton.addEventListener('click', (e) => toggleMenu());

function taskListHide () {
  taskList.style.display = "block";
  setTimeout(() => taskList.classList.add('checklist--hidden'), 0);
}

function taskListShow () {
  taskList.style.display = "block";
  setTimeout(() => taskList.classList.remove('checklist--hidden'), 0);
}

function loginFormHide () {
  loginForm.style.display = "grid";
  setTimeout(() => loginForm.classList.add('login-form--hidden'), 0);
}

function loginFormShow () {
  loginForm.style.display = "grid";
  setTimeout(() => loginForm.classList.remove('login-form--hidden'), 0);
}

function appShow () {
  appWrapper.style.display = "flex";
  setTimeout(() => {
    appWrapper.classList.remove('app--init');

  }, 0);
}

function updateHeight () {
  var height = 0;
  Array.from(document.getElementById('app-content').childNodes).forEach((e) => {
    var elemHeight = e.clientHeight || 0;
    height += (elemHeight - 0) + 32
  });

  height = Math.max(height, window.innerHeight);

  darken.style.height = (`${height}px`);
}

function splashHide () {
  splashWrapper.addEventListener('transitionend', (e) => {
    e.target.parentNode.removeChild(e.target);
  });

  splashWrapper.style.opacity = 0;
}

function infoHide () {
  infoWrapper.addEventListener('transitionend', function end (e) {
    e.target.classList.add('dialog-hidden');
    e.target.removeEventListener('transitionend', end);
    e.target.style.removeProperty('opacity');
    e.target.style.removeProperty('display');
  });

  infoWrapper.style.opacity = 0;
}

function infoShow () {
  infoWrapper.style.setProperty('display', 'block');
  setTimeout(() => infoWrapper.classList.remove('dialog-hidden'), 0);
}

function showMenu () {
  cWrapper.classList.add('menu--transition');
  setTimeout(() => cWrapper.classList.add('menu--expanded'), 10);
}

function hideMenu () {
  cWrapper.classList.add('menu--transition');
  cWrapper.classList.remove('menu--expanded');
}

function toggleMenu () {
  updateHeight();
  if (cWrapper.classList.contains('menu--expanded')) {
    hideMenu();
  } else {
    showMenu();
  }
}

function fetchLocal (url) {
  alert (url);

  return new Promise(function (resolve, reject) {
    var xhr = new XMLHttpRequest
    xhr.onload = function () {
      resolve(new Response(xhr.responseText, { status: xhr.status }))
    }
    xhr.onerror = function () {
      reject(new TypeError('Local request failed'))
    }
    xhr.open('GET', url)
    xhr.send(null)
  })
}

async function loadInfo () {
  let info = await fetchLocal('./js/build.json').then(r => r.json());


  let build_date = info.build_date.split(' ')[0].split('-');
  info.build_date = [build_date[2], build_date[1], build_date[0]].join('.');

  info['platform_name'] = `${device.platform} Version`;
  info['platform_version'] = device.version;

  let dialog = document.getElementById('info-dialog');
  let elements = Array.from(dialog.querySelectorAll('[data-display]'));

  elements.forEach((element) => {
    let display = element.getAttribute('data-display');
    element.innerText = info[display];
  });

  let closeButton = document.getElementById('close_info');
  closeButton.addEventListener('click', function(event) {
    event.preventDefault();
    infoHide();
  });
}

infoButton.addEventListener('click', function (event) {
  event.preventDefault();

  let display = infoWrapper.style.getPropertyValue('display') === 'block';

  if (display) {
    infoHide();
  } else {
    infoShow();
  }
});

/**/
var app = {
  // Application Constructor
  initialize: function () {
    document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
  },

  // deviceready Event Handler
  //
  // Bind any cordova events here. Common events are:
  // 'pause', 'resume', etc.
  onDeviceReady: function () {
    CheckList.run().then(result => {
      var uiTasks = [
        UserInfo.render(document.getElementById('app-content')),
        LinkList.renderList(document.getElementById('app-content')),
        loadInfo()
      ];

      Promise.all(uiTasks)
        .then(() => {
          appShow();
          splashHide();
        });
    });
  },
};

app.initialize();