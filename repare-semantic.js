var replace = require("replace");

// use:

replace({
    regex: ";;",
    replacement: ";",
    paths: ['./node_modules/semantic-ui-css/semantic.css'],
    recursive: true,
    silent: true,
});

replace({
    regex: ";;",
    replacement: ";",
    paths: ['./node_modules/semantic-ui-css/semantic.min.css'],
    recursive: true,
    silent: true,
});

console.log("Se han limpiado los carácteres del css erroneos.")

console.log("Ya puedes iniciar el proyecto")