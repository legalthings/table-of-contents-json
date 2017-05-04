module.exports = () => {
  it('should generate a html toc structure', require('./generate-html'));
  it('should generate a html toc structure and put it in a base html', require('./generate-html-with-base'));
  it('should throw exception for generate html if invalid json is given', require('./generate-html-invalid-json-exception'));
};
