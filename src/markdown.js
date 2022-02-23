
/**
 * simple markdown to html converter
 * @param {*} content 
 * @returns html text
 */

function markdown2html(content)
{
    function parseSentence(sentence) {
        // code
        var r = /(.*)`(.*)`(.*)/g.exec(sentence);
        if (r) return parseSentence(r[1]) + "<code>" + r[2] + "</code>" + parseSentence(r[3]);
        // image
        r = /(.*)!\[(.*)\]\((.*)\)(.*)/g.exec(sentence);
        if (r) return parseSentence(r[1]) + "<img src='" + r[3] + "' alt='" + r[2] + "'>" + parseSentence(r[4]);
        // link
        r = /(.*)\[(.*)\]\((.*)\)(.*)/g.exec(sentence);
        if (r) return parseSentence(r[1]) + "<a href='" + r[3] + "'>" + r[2] + "</a>" + parseSentence(r[4]);
        // italic bold
        r = /(.*)[\_\*]{3,}(.*)[\_\*]{3,}(.*)/g.exec(sentence);
        if (r) return parseSentence(r[1]) + "<b><i>" + r[2] + "</i></b>" + parseSentence(r[3]);
        // bold
        r = /(.*)[\_\*]{2}(.*)[\_\*]{2}(.*)/g.exec(sentence);
        if (r) return parseSentence(r[1]) + "<b>" + r[2] + "</b>" + parseSentence(r[3]);
        // italic
        r = /(^|^\S+\s+)[\_\*]{1}(.*)[\_\*]{1}($|\s+\S*$)/g.exec(sentence);
        if (r) return parseSentence(r[1]) + "<i>" + r[2] + "</i>" + parseSentence(r[3]);
        // delete
        r = /(.*)[~]{2,}(.*)[~]{2,}(.*)/g.exec(sentence);
        if (r) return parseSentence(r[1]) + "<del>" + r[2] + "</del>" + parseSentence(r[3]);
        // mark
        r = /(.*)\[\^(.*)\](.*)/g.exec(sentence);
        if (r) return parseSentence(r[1]) + "<sup>" + r[2] + "</sup>" + parseSentence(r[3]);
        // not supported
        return sentence;
    }
    function parseLine(line) {
        // title
        var r = /^(#+)(.+)/g.exec(line);
        if (r) return "<h" + String(r[1].length) + ">" + parseSentence(r[2].trim()) + "</h" + String(r[1].length) + ">";
        // block
        var r = /^>(.*)/g.exec(line);
        if (r) return "<div>" + parseSentence(r[1]) + "</div>";
        // newline
        var r = /^([\*\-\_]{3,})(\s*)/g.exec(line);
        if (r) return "<hr>" + parseSentence(r[2]);
        // paragraph
        if (line.length > 0) return "<p>" + parseSentence(line) + "</p>";
    }
    var lines = content.trim().split(/\r?\n\r?/);
    var cursor = 0;
    var results = [];
    while (cursor < lines.length) {
        var line = lines[cursor].trim();
        if (line.startsWith("```")) {
            // code
            results.push("<xmp>");
            cursor = cursor + 1;
            while (!lines[cursor].trim().startsWith("```")) {
                results.push(lines[cursor]);
                cursor++;
            }
            results.push("</xmp>");
        } else if (line.match(/^[\*\-\+] (.*)/g)) {
            // list
            results.push("<ul>");
            var r = /^[\*\-\+](.*)/g.exec(lines[cursor]);
            while (r) {
                results.push("<li>" + parseSentence(r[1]) + "</li>");
                cursor++;
                r = /^[\*\-\+](.*)/g.exec(lines[cursor]);
            }
            results.push("</ul>");
        } else if (line.startsWith("|")) {
            // table
            var row = 0;
            results.push("<table>");
            var r = /^[\|](.*)/g.exec(lines[cursor]);
            while (r) {
                row++;
                results.push("<tr>");
                var arr = r[0].split("|");
                for (var i = 1; i < arr.length - 1; i++) {
                    results.push(row == 1 ? "<th>" + parseSentence(arr[i].trim()) + "</th>" : "<td>" + parseSentence(arr[i].trim()) + "</td>");
                }
                results.push("<tr>");
                cursor++;
                r = /^[\|](.*)/g.exec(lines[cursor]);
            }
            results.push("</table>");
        } else if (line.length == 0) {
            // wrapline
            while (lines[cursor + 1].length == 0) {
                cursor++;
                results.push("<br>");
            }
        } else {
            // inline
            var result = parseLine(line);
            if (result) results.push(result);
        }
        cursor = cursor + 1;
    }
    return results.join("\n");
}
