import { useState, useRef, useEffect } from "react";
import { nanoid } from "nanoid";
import JsPDF from "jspdf";

const modes = {
  edit: "EDIT_TEXT",
  variable: "EDIT_VARIABLE"
};

const htmlString =
  "Hello <mark data-name='name' id='name'>User</mark>, <br/> Example test mark subject xyz 123<br/> Example test mark subject xyz 123<br/> Example test mark subject xyz 123";

export default function App() {
  const [mode, setMode] = useState(modes.variable);
  const [html, setHtml] = useState(htmlString);
  const [showVariablBtn, setShowVariableBtn] = useState(false);
  const [variables, setVariables] = useState(new Map());
  const modeRef = useRef();
  modeRef.current = mode;

  const editor = useRef(null);

  const createVariable = () => {
    let selection = window.getSelection();
    let range = selection.getRangeAt(0);
    let value = selection.toString();
    let dataName = prompt("Please enter variable name");
    const newNode = document.createElement("mark");
    const id = nanoid(4);
    newNode.id = id;
    newNode.dataset.name = dataName;
    range.surroundContents(newNode);
    setVariables(
      new Map(
        variables.set(id, {
          id,
          dataName,
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
    const textNode = document.createTextNode(tag.textContent);
    elem.insertBefore(textNode, tag);
    tag.remove();
    console.log(variables.get(id));
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
    let elem = editor.current;
    let variableData = new Map();
    const variableTags = elem.getElementsByTagName("mark");
    Array.from(variableTags).forEach((tag) => {
      variableData.set(tag.id, {
        id: tag.id,
        dataName: tag.dataset.name,
        value: tag.textContent
      });
    });
    setVariables(variableData);
  };

  const handleValueChange = (e, id) => {
    let elem = editor.current;
    elem.querySelector(`#${id}`).textContent = e.target.value;
    setVariables(
      new Map(
        variables.set(id, {
          id,
          dataName: e.target.dataset.name,
          value: e.target.value
        })
      )
    );
  };

  const handleNameChange = (e, id) => {
    let elem = editor.current;
    let tag = elem.querySelector(`#${id}`);
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
  };

  useEffect(() => {
    handleSelection();
  });

  useEffect(() => {
    document.onselectionchange = () => {
      handleSelection();
    };
    let selection = window.getSelection();
    selection.removeAllRanges();
  }, []);

  const handleSelection = () => {
    if (modeRef.current === modes.edit) {
      console.log("called");
      setShowVariableBtn(false);
      return;
    }
    let selection = window.getSelection();
    if (selection.toString().length === 0) {
      setShowVariableBtn(false);
      return;
    }

    let range = selection.getRangeAt(0);

    let startParent = range.startContainer.parentElement.id;
    let enndParent = range.endContainer.parentElement.id;
    if (startParent !== "editor" || enndParent !== "editor") {
      console.log("Select properly");
      setShowVariableBtn(false);
      return null;
    }
    setShowVariableBtn(true);
  };

  const generatePDF = () => {
    const report = new JsPDF("portrait", "pt", "a4");
    report.html(document.querySelector("#editor"), {
      callback: function (pdf) {
        pdf.save("a4.pdf");
      },
      margin: [40, 40]
    });
  };

  const saveTemplate = () => {
    const obj = {};
    let variableArray = [];
    obj["html"] = html;

    [...variables.keys()].map((k) => {
      variableArray.push(variables.get(k));
    });

    obj["variables"] = variableArray;

    console.log(obj);
    const jsonString = JSON.stringify(obj);

    const file = new File([jsonString], "template.json");

    const a = document.createElement("a");
    a.href = URL.createObjectURL(file);
    a.download = "template.json";
    a.click();
  };

  return (
    <div className="App">
      <div>
        <input
          type="radio"
          id={modes.edit}
          name="mode"
          value={modes.edit}
          onChange={(e) => setMode(e.target.value)}
          checked={mode === modes.edit}
        />
        <label htmlFor={modes.edit}>{modes.edit}</label>

        <input
          type="radio"
          id={modes.variable}
          name="mode"
          value={modes.variable}
          onChange={(e) => setMode(e.target.value)}
          checked={mode === modes.variable}
        />
        <label htmlFor={modes.variable}>{modes.variable}</label>
      </div>
      <p
        contentEditable={mode === modes.edit}
        // onMouseUp={handleSelection}
        // onSelect={handleSelection}
        dangerouslySetInnerHTML={{ __html: html }}
        onBlur={(e) => setHtml(e.target.innerHTML)}
        // onMouseLeave={handleSelection}
        ref={editor}
        id="editor"
      ></p>
      {showVariablBtn && (
        <button onClick={createVariable}>Create Variable</button>
      )}
      <br />
      <br />
      <div>
        <table>
          <thead>
            <tr>
              <th>Variable Name</th>
              <th>Value</th>
              <th>ID</th>
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
                      value={data.dataName}
                      onChange={(e) => handleNameChange(e, data.id)}
                    />
                  </td>
                  <td>
                    <input
                      value={data.value}
                      onChange={(e) => handleValueChange(e, data.id)}
                    />
                  </td>
                  <td>{data.id}</td>
                  <td>
                    <button onClick={() => deleteVariable(data.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <br />
      <button onClick={generatePDF}>PDF</button>
      <button onClick={saveTemplate}>Save Template</button>
    </div>
  );
}
