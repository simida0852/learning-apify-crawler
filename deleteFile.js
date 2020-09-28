const fs = require('fs')
const path = require('path')


function deleteDirectory(dir) {
    if (fs.existsSync(dir) == true) {
        var files = fs.readdirSync(dir);
        files.forEach(function (item) {
            var item_path = path.join(dir, item);
            // console.log(item_path);
            if (fs.statSync(item_path).isDirectory()) {
                DeleteDirectory(item_path);
            }
            else {
                fs.unlinkSync(item_path);
            }
        });
        fs.rmdirSync(dir);
    }
}

module.exports = {
    deleteDirectory
}