/*eslint-disable*/
const http = require('http');
const { convertToCase } = require('./convertToCase');

function createServer() {
  return http.createServer((req, res) => {
    const errors = [];
    const normalizedURL = new URL(req.url, 'http://localhost:5700/');

    const textToConvert = normalizedURL.pathname.slice(1);
    const caseToConvert = normalizedURL.searchParams.get('toCase');

    console.log('text to Convert', textToConvert);
    console.log('case name', caseToConvert);

    if (textToConvert === 'favicon.ico') {
      res.statusCode = 204;
      res.end();

      return;
    }

    if (!textToConvert) {
      errors.push({
        message:
          // eslint-disable-next-line max-len
          'Text to convert is required. Correct request is: "/<TEXT_TO_CONVERT>?toCase=<CASE_NAME>".',
      });
    }

    if (!caseToConvert) {
      errors.push({
        message:
          // eslint-disable-next-line max-len
          '"toCase" query param is required. Correct request is: "/<TEXT_TO_CONVERT>?toCase=<CASE_NAME>"',
      });
    }

    const availableCases = ['SNAKE', 'KEBAB', 'CAMEL', 'PASCAL', 'UPPER'];

    if (caseToConvert && !availableCases.includes(caseToConvert)) {
      errors.push({
        message:
          // eslint-disable-next-line max-len
          'This case is not supported. Available cases: SNAKE, KEBAB, CAMEL, PASCAL, UPPER.',
      });
    }

    if (errors.length > 0) {
      res.statusCode = 400;
      res.setHeader('Content-Type', 'application/json');

      res.end(
        JSON.stringify({ errors })
          .replace(/\\u003C/g, '<')
          .replace(/\\u003E/g, '>'),
      );
    }

    const { originalCase, convertedText } = convertToCase(
      textToConvert,
      caseToConvert,
    );

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.statusMessage = 'OK';

    const body = {
      originalCase: originalCase,
      targetCase: caseToConvert,
      originalText: textToConvert,
      convertedText: convertedText,
    };

    res.end(JSON.stringify({ body }));
  });
}

module.exports = { createServer };
