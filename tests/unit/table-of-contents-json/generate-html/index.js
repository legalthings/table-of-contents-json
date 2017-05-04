module.exports = () => {
  it('should generate a html toc structure', require('./generate-html'));
  it('should generate a html toc structure and put it in a base html', require('./generate-html-base'));
  it('should generate a html toc structure and add a header for the toc', require('./generate-html-toc-header'));
  it('should throw exception for generate html if invalid json is given', require('./generate-html-invalid-json-exception'));
};
