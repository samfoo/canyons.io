module.exports = function(content) {
    return `<!doctype html>
<html>
    <head>
        <meta charset="utf-8">
        <link rel="stylesheet" href="site.css">
    </head>
    <body>
        <div id="render">${content}</div>
        <script type="application/javascript" src="app.js"></script>
    </body>
</html>`
};
