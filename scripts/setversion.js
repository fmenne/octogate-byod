module.exports = function(ctx) {

  let fs = ctx.requireCordovaModule('fs');
  let xmldom = ctx.requireCordovaModule('xmldom');
  let path = ctx.requireCordovaModule('path');

  let root = ctx.opts.projectRoot;

  let json = ctx.requireCordovaModule(`${root}/package.json`);

  let version = json.version;

  let xmlString = fs.readFileSync(`${root}/config.xml`).toString();
  let parser = new xmldom.DOMParser()
  let xmlDoc = parser.parseFromString(xmlString);

  let widget = xmlDoc.getElementsByTagName('widget')[0];
  widget.setAttribute('version', version);
  
  let serializer = new xmldom.XMLSerializer()
  let newXML = serializer.serializeToString(xmlDoc);

  let date = new Date();
  let dateStr = [date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds()]
    .map((item) => "00".substr(0, 2 - item.toString().length) + item.toString())
    .map((item, idx, arr) => !(idx % 3) ? arr.slice(idx, idx + 3).join(idx < 3 ? '-' : ':') : false)
    .filter((item) => !!item)
    .join(' ');

  let info = {
    'build_date': dateStr,
    'cordova_version': ctx.opts.cordova.version,
    'app_version': version
  }

  fs.writeFileSync(path.join(root, 'config.xml'), newXML);
  fs.writeFileSync(path.join(root, 'www', 'js', 'build.json'), JSON.stringify(info));

  return Promise.reject();
}