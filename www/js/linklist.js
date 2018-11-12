var LinkList = {};

(function (_api) {
  var listElement = null;

  async function getLinks () {
    // const result = await fetch('http://octo.octo:1983/index.pl?query=menu');
    // return result.json();
    return new Promise((resolve) => {
      resolve([
        { "url": "http://www.schulfirewall.de", "icon_url": "https://api.statvoo.com/favicon/?url=www.schulfirewall.de", "title": "Schulfirewall.de" },
        { "url": "http://www.wikipedia.org", "icon_url": "https://api.statvoo.com/favicon/?url=www.wikipedia.org", "title": "Wikipedia" },
        { "url": "http://www.octogate.de", "icon_url": "https://api.statvoo.com/favicon/?url=www.octogate.de", "title": "OctoGate: Hardware Firewall und Virenschutz – OctoGate: Einfach. Sicher. Geschützt.: Übersicht" },
        { "url": "http://www.google.de", "icon_url": "https://api.statvoo.com/favicon/?url=www.google.de", "title": "Google" },
        { "url": "http://www.heise.de", "icon_url": "https://api.statvoo.com/favicon/?url=www.heise.de", "title": "heise online - IT-News, Nachrichten und Hintergründe heise online" },
        { "url": "http://www.golem.de", "icon_url": "https://api.statvoo.com/favicon/?url=www.golem.de", "title": "Golem.de" }
      ]);
    });
  }

  async function renderList (parent) {
    if (listElement instanceof HTMLElement) {
      listElement.parentNode.removeChild(listElement);
      listElement = null;
    }

    listElement = document.createElement('ul');
    listElement.classList.add('link-list');

    var links = await getLinks();

    if (Array.isArray(links)) {
      links.forEach((link) => {
        var entry = document.createElement('li');
        entry.classList.add('link-list_entry');

        console.log(link);

        var linkA = document.createElement('a');
        linkA.href = '#';
        linkA.addEventListener('click', (event) => {
          event.preventDefault();

          let url = link.url || '';

          var newURL = url.replace(/%%([a-z]+)%%/g, (finding, part) => {
            var data = UserInfo.getData();

            var placeHolder = {
              'userupper': data.username.toUpperCase(),
              'userlower': data.username.toLowerCase(),
              'octogate': 'oxoxoxox'
            }

            var val =  placeHolder[part.toLowerCase()] || finding;
            return val;
          });

          window.open(newURL, '_system');
        });

        var titleSpan = document.createElement('span');
        var title = document.createTextNode(link.title);

        var icon = document.createElement('img');
        icon.src = link.icon_url;
        icon.onerror = function(e) {
          alert(e.message);
        }

        titleSpan.appendChild(title);
        linkA.appendChild(icon);
        linkA.appendChild(titleSpan);
        entry.appendChild(linkA);
        listElement.appendChild(entry);
      });

      if (parent instanceof HTMLElement) {
        parent.appendChild(listElement);
      }

      return listElement;
    }
  }

  Object.assign(_api, {
    getLinks,
    renderList
  });
})(LinkList);