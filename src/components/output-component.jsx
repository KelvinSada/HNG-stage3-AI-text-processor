import React,{useState} from "react";

function OutputComponent(prop){
  const array = prop.array;
  const specialTrans = array[prop.id].trans
  
  if (specialTrans){
    console.log("hello")
  } else{
    console.log("Goodbye")
  }
  
  const getInitialState = () => {
    const value = "Select Language";
    return value;
  };

  const [value, setValue] = useState(getInitialState);

  const handleChange = (e) => {
    const language = e.target.value;
    // console.log(language)
    setValue(language);
  };
  
  console.log(prop.language.length)
  return(
    <div className="selected-output">
      <div className="sender-output">
        <div className="output-individual-text"><p>{prop.text}</p></div>
          {prop.language.length>0?<p className="language-used"><span className="icon">🟢</span> {prop.language}</p>:<p className="error-lang">🔴 No Language Detected</p>}
          {prop.language.length>0?<div className="output-settings">
          <select aria-label="select-language" value={value} onChange={handleChange} id="language" className="language" name="language">
            <option value="">Select Language</option>
            <option value="en">English(en)</option>
            <option value="pt">Portuguese(pt)</option>
            <option value="es">Spanish(es)</option>
            <option value="ru">Russian(ru)</option>
            <option value="tr">Turkish(tr)</option>
            <option value="fr">French(fr)</option>
          </select>
          <button aria-label="translate" className="translate" onClick={()=>prop.action(value,prop.text,prop.language,prop.id)}>Translate</button>
          {/* {prop.language == "English" ?<button className="summary" onClick={()=>prop.summaryAction(prop.text,prop.id)}>Summarise</button>:null} */}
        </div>:null}
      </div>
      {specialTrans&&<div className="receiver-output">
        {array[prop.id].error === false?<p>{prop.trans}</p>:<p className="error">Sorry, It seams theres an error somewhere</p>}
      </div>}
      </div>
  )
}

export default OutputComponent;