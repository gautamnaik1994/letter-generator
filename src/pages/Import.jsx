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
    }

    return (
        <div className="container">
            <h3>Import Template</h3>
            <div className="mb-3">
                <label htmlFor="formFile" className="form-label">
                    Upload Template
                </label>
                <input className="form-control" type="file" onChange={fileHandler} accept=".json" />
            </div>
        </div>
    );
};

export default Import;
