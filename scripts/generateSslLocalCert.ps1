# generate an ssl cert a .cnf cert definition found in the
openssl req `
    -newkey rsa:2048 `
    -x509 `
    -nodes `
    -keyout ../cert/server.key `
    -new `
    -out ../cert/server.crt `
    -config ../cert/certdef.cnf `
    -sha256 `
    -days 365
