import React from 'react';
import { useNavigate } from 'react-router-dom';

const Import = () => {
  const navigate = useNavigate();
  const fileHandler = async (e) => {
    if (e.target.files[0]) {
      const file = e.target.files.item(0);
      let text = await file.text();
      let parsedText = JSON.parse(text);

      if (!Object.hasOwn(parsedText, 'html')) {
        alert('Invalid JSON file');
      }
      navigate('/?from_import', {
        state: parsedText
      });
    }
  };

  return (
    <div className="container">
      {/* <h3>Import Template</h3> */}
      <div className="mb-3 w-50">
        <label htmlFor="formFile" className="form-label">
          Upload JSON Template
        </label>
        <input className="form-control" type="file" onChange={fileHandler} accept=".json" />

        <div className="form-text text-muted mt-3 mb-2">
          <span className="badge text-bg-primary">Info</span> Upload a JSON file with the following
          structure:
        </div>
        <pre className=" border rounded text-muted p-2">
          {JSON.stringify(
            {
              html: '<h1>Hello World</h1>'
            },
            null,
            2
          )}
        </pre>
      </div>
    </div>
  );
};

export default Import;
