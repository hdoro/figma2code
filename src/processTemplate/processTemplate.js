module.exports = function(files, metalsmith, done) {
  // console.log(files['README.md'].contents)
  // const test = Buffer.from('aaaa Test working 😁')
  const content = files["README.md"].contents
    .toString("utf-8")
    .replace(
      "%SITE_NAME%",
      metalsmith._metadata.siteTitle || "%SITE_NAME%"
    );
  files["README.md"].contents = Buffer.from(content);

  done();
};
