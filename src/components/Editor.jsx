import { useState, useRef, useEffect } from 'react';
import { nanoid } from 'nanoid';
import JsPDF from 'jspdf';

export default function Editor({ htmlString }) {
  //   const [variableMode, setVariableMode] = useState(true);
  const [showVariableNames, setShowVariableNames] = useState(false);
  const [btnCoords, setBtnCoords] = useState({ left: 0, top: 0 });
  const [html, setHtml] = useState(htmlString);
  const [showVariablBtn, setShowVariableBtn] = useState(false);
  const [variables, setVariables] = useState(new Map());
  //   const variableModeRef = useRef();
  //   variableModeRef.current = variableMode;

  const editor = useRef(null);

  const createVariable = () => {
    let selection = window.getSelection();
    let range = selection.getRangeAt(0);
    let value = selection.toString();
    // let dataName = prompt('Please enter variable name');
    const newNode = document.createElement('mark');
    const id = `lg_${nanoid(4)}`;
    newNode.id = id;
    newNode.dataset.name = value;
    range.surroundContents(newNode);
    setVariables(
      new Map(
        variables.set(id, {
          id,
          dataName: value,
          value
        })
      )
    );
    setHtml(editor.current.innerHTML);
    selection.removeAllRanges();
    setShowVariableBtn(false);
  };

  const deleteVariable = (id) => {
    let elem = editor.current;
    let tag = elem.querySelector(`#${id}`);
    let { parentNode } = tag;
    const textNode = document.createTextNode(tag.textContent);
    parentNode.insertBefore(textNode, tag);
    tag.remove();
    setVariables((prev) => {
      const newState = new Map(prev);
      newState.delete(id);
      return newState;
    });
  };

  useEffect(() => {
    generateVariables();
  }, []);

  const generateVariables = () => {
    let variableData = new Map();
    const variableTags = editor.current.getElementsByTagName('mark');

    Array.from(variableTags).forEach((tag) => {
      variableData.set(tag.id, {
        id: tag.id,
        dataName: tag.dataset.name,
        value: tag.textContent
      });
    });
    setVariables(variableData);
    setHtml(editor.current.innerHTML);
  };

  const handleValueChange = (e, id) => {
    editor.current.querySelector(`#${id}`).textContent = e.target.value;
    setVariables(
      new Map(
        variables.set(id, {
          id,
          dataName: e.target.dataset.name,
          value: e.target.value
        })
      )
    );
    setHtml(editor.current.innerHTML);
  };

  const handleNameChange = (e, id) => {
    console.log(editor.current.innerHTML);
    let tag = editor.current.querySelector(`#${id}`);

    tag.dataset.name = e.target.value;

    setVariables(
      new Map(
        variables.set(id, {
          id,
          dataName: e.target.value,
          value: tag.value
        })
      )
    );
    setHtml(editor.current.innerHTML);
  };

  useEffect(() => {
    // handleSelection();
  });

  useEffect(() => {
    document.onselectionchange = () => {
      handleSelection();
    };
  }, []);

  const handleSelection = () => {
    // if (!variableModeRef.current) {
    //   setShowVariableBtn(false);
    //   return;
    // }
    let selection = window.getSelection();
    if (selection.toString().length === 0) {
      setShowVariableBtn(false);
      return;
    }

    let range = selection.getRangeAt(0);
    // console.log(selection, range);
    let startParent = range.startContainer.parentElement;
    let enndParent = range.endContainer.parentElement;
    if (startParent.nodeName == 'MARK' || enndParent.nodeName == 'MARK') {
      console.log('Select properly', startParent, enndParent, range);
      setShowVariableBtn(false);
      return null;
    }
    if (!editor.current.contains(startParent) || !editor.current.contains(enndParent)) {
      setShowVariableBtn(false);
      return null;
    }
    let coords = range.getBoundingClientRect();
    setBtnCoords({ left: coords.left, top: coords.top });
    setShowVariableBtn(true);
  };

  const generatePDF = () => {
    const report = new JsPDF('portrait', 'pt', 'a4');
    editor.current.classList.remove('styled-editor');
    report.html(editor.current, {
      callback: function (pdf) {
        pdf
          .save('myfile.pdf', { returnPromise: true })
          .then(editor.current.classList.add('styled-editor'));
      }
    });
  };

  const saveTemplate = () => {
    const obj = {};
    let variableArray = [];
    obj['html'] = html;
    [...variables.keys()].map((k) => {
      variableArray.push(variables.get(k));
    });
    obj['variables'] = variableArray;
    console.log(obj);
    const jsonString = JSON.stringify(obj);
    const file = new File([jsonString], 'template.json');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(file);
    a.download = 'template.json';
    a.click();
  };

  return (
    <>
      <div className="container">
        <div className="d-flex gap-3">
          <div className="left-sec">
            {/* <div>
              <div className="form-check form-switch">
                <input
                  className="form-check-input"
                  type="checkbox"
                  role="switch"
                  id="flexSwitchCheckDefault"
                  checked={variableMode}
                  onChange={(e) => setVariableMode(e.target.checked)}
                />
                <label className="form-check-label" htmlFor="flexSwitchCheckDefault">
                  Variable Mode
                </label>
              </div>
            </div> */}

            <div>
              <div className="form-check form-switch">
                <input
                  className="form-check-input"
                  type="checkbox"
                  role="switch"
                  id="flexSwitchCheckDefault"
                  checked={showVariableNames}
                  onChange={(e) => setShowVariableNames(e.target.checked)}
                />
                <label className="form-check-label" htmlFor="flexSwitchCheckDefault">
                  Show Variable Names
                </label>
              </div>
            </div>
            <p
              contentEditable={true}
              // onMouseUp={handleSelection}
              className={`editor form-control styled-editor ${
                showVariableNames ? 'show-variable-name' : ''
              }`}
              dangerouslySetInnerHTML={{ __html: html }}
              onBlur={(e) => {
                setHtml(e.target.innerHTML);
                generateVariables();
              }}
              ref={editor}
              id="editor"
            />
            {showVariablBtn && (
              <button
                type="button"
                style={{ '--top': `${btnCoords.top}px`, '--left': `${btnCoords.left}px` }}
                className="btn btn-primary btn-sm create-variable-btn"
                onClick={createVariable}>
                Create Variable
              </button>
            )}
            <div className="d-flex gap-3 justify-content-end">
              <button type="button" className="btn btn-outline-primary" onClick={saveTemplate}>
                Save Template as JSON
              </button>
              <button type="button " className="btn btn-primary mr-2" onClick={generatePDF}>
                Export to PDF
              </button>
            </div>
          </div>
          <div className="right-sec flex-fill">
            <table className="table">
              <thead>
                <tr>
                  <th>Variable Name</th>
                  <th>Value</th>
                  {/* <th>ID</th> */}
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {[...variables.keys()].map((k) => {
                  let data = variables.get(k);
                  return (
                    <tr key={k}>
                      <td>
                        <input
                          className="form-control form-control-sm"
                          value={data.dataName}
                          onChange={(e) => handleNameChange(e, data.id)}
                        />
                      </td>
                      <td>
                        <input
                          className="form-control form-control-sm"
                          value={data.value}
                          onChange={(e) => handleValueChange(e, data.id)}
                        />
                      </td>
                      {/* <td>{data.id}</td> */}
                      <td>
                        <button
                          type="button"
                          className="btn btn-danger btn-sm"
                          onClick={() => deleteVariable(data.id)}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
