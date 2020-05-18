/* eslint-disable no-useless-concat */
const path = require('path');
const fs = require('fs');

module.exports = function RevealSliderLoader(source) {
  let newSource = source;
  const callback = this.async();
  const fromPath = this.query.from;
  if (!fromPath) throw Error('You need to specify slides root folder! Eg.: ./src/slides/');

  fs.readdir(fromPath, (err, files) => {
    const regex = /(import.*from.*;)(?!.*\1)/g;
    const imports = source.match(regex);
    const lastImport = (imports && imports[imports.length - 1]) || null;
    let extendedImport = (lastImport && `${lastImport}\n`) || '';
    let stringTemplatesImports = '';
    files.forEach((file, i) => {
      if (/slide.*\.pug$/.test(file)) {
        extendedImport += `import revealSlide${i} from '${path.resolve(fromPath, file)}';\n`;
        stringTemplatesImports += '${' + `revealSlide${i}` + '}\n';
      }
    });
    if (lastImport) {
      newSource = newSource.replace(lastImport, extendedImport);
    } else {
      newSource = extendedImport + newSource;
    }
    newSource = newSource.replace('<!--inject:slides-->', stringTemplatesImports);
    callback(null, newSource);
  });
};
