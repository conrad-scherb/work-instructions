const fs = require('fs')

const json = JSON.parse(fs.readFileSync('EXPORT.json'));

for (var position in json) {
    for (var header in json[position]) {
        var count = 1
        for (var subheading in json[position][header]) {
            var newHeading = count + "@ " + subheading
            json[position][header][newHeading] = json[position][header][subheading]
            delete json[position][header][subheading]
            count++
        }
    }
}

fs.writeFile("FIXED.json", JSON.stringify(json, null, 2), function(err) {
    if (err) {
        console.log(err);
    }
})