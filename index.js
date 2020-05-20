/* eslint-disable no-useless-concat */
const path = require('path');
const fs = require('fs');

function checkPathToBeIncluded(id, pathOrder) {
  const pathToInclude = pathOrder.find(path => {
    const str = `.*revealSlide${id}[^0-9].*`;
    const regex = new RegExp(str);
    return regex.test(path);
  });
  return pathToInclude;
}

module.exports = function RevealSliderLoader(source) {
  let newSource = source;
  const callback = this.async();
  const fromPath = this.query.from;
  if (!fromPath) throw Error('You need to specify slides root folder! Eg.: ./src/slides/');


  let slidesOrderTag = newSource.match(/<!--inject:order=.*,?-->\n/);
  let slidesCustomOrder = [];
  let slidesDefaultOrder = [];
  if (slidesOrderTag) {
    slidesOrderTag = slidesOrderTag[0];
    slidesCustomOrder = slidesOrderTag.match(/(\d+,)+\d+|\d+/)[0].split(',');
    slidesCustomOrder = [...new Set(slidesCustomOrder)].map(num => +num);
  }



  const pathOrder = [];

  fs.readdir(fromPath, (err, files) => {
    const regex = /(import.*from.*;)(?!.*\1)/g;
    const imports = source.match(regex);
    const lastImport = (imports && imports[imports.length - 1]) || null;
    let extendedImport = (lastImport && `${lastImport}\n`) || '';
    let stringTemplatesImports = '';
    files.forEach((file, i) => {
      if (/slide.*\.pug$/.test(file)) {
        const id = file.replace(/slide[^0-9]+(\d+)\.pug$/, "$1");
        if(id){
          if (!slidesCustomOrder.length) slidesDefaultOrder.push(+id);
          pathOrder.push(`import revealSlide${id} from '${path.resolve(fromPath, file).replace(/\\/g, '/')}';\n`)
        }

      }
    });

    // Sort all imports
    if(slidesCustomOrder.length  && !slidesDefaultOrder.length) {
      slidesCustomOrder.forEach(id => {
        const pathToInclude = checkPathToBeIncluded(id, pathOrder);
        if (pathToInclude) {
          extendedImport+=pathToInclude;
          stringTemplatesImports+= '${' + `revealSlide${id}` + '}\n';
        }
      });
    } else if (slidesDefaultOrder.length && !slidesCustomOrder.length) {
      slidesDefaultOrder.sort((a,b) => a - b);
      slidesDefaultOrder = [...new Set(slidesDefaultOrder)];
      slidesDefaultOrder.forEach(id => {
        const pathToInclude = checkPathToBeIncluded(id, pathOrder);
        if (pathToInclude) {
          extendedImport+=pathToInclude;
          stringTemplatesImports+= '${' + `revealSlide${id}` + '}\n';
        }
      });
    }

    if (lastImport) {
      newSource = newSource.replace(lastImport, extendedImport);
    } else {
      newSource = extendedImport + newSource;
    }
    newSource = newSource.replace('<!--inject:slides-->', stringTemplatesImports);
    if (slidesCustomOrder.length) {
      newSource = newSource.replace(slidesOrderTag, '');
    }
    callback(null, newSource);
  });
};