import React, { useEffect, useRef, useState } from "react";
import "./App.css";
import OutputComponent from "./output-component";
import { FiSend } from "react-icons/fi";

function App() {
  const [input,setInput] = useState({
    text:"",
    language:"",
    trans:"",
    characterNumber:0,
    error:false
  })
  const [saveOutput,setSaveOutput] = useState([])
  const [translationText,setTranslationText] = useState("");
  const [,setNoOfCharacters] = useState(0)
  const [loading,setLoading] = useState(false)
  const bottomOfPanelRef =useRef(null)


  //Language Detector Model
  async function languageDetector(info){
    // console.log(info)
    const languageDetectorCapabilities = await window.self.ai.languageDetector.capabilities();
    const canDetect = languageDetectorCapabilities.capabilities;
    let detector;
    if (canDetect === 'no') {
        // The language detector isn't usable.
        return;
      }
    if (canDetect === 'readily') {
          // The language detector can immediately be used.
          detector = await window.self.ai.languageDetector.create();
      } 
    else {
      // The language detector can be used after model download.
      detector = await window.self.ai.languageDetector.create({
            monitor(m) {
                m.addEventListener('downloadprogress', (e) => {
                    // console.log(`Downloaded ${e.loaded} of ${e.total} bytes.`);
                  });
                },
              });
              await detector.ready;
        }
        const result = await detector.detect(info)
        const getLanguage = await result[0]
        // setFindLanguage(getLanguage);

          if (getLanguage){
            let value = ""
            // console.log(findLanguage.detectedLanguage)
            switch (getLanguage.detectedLanguage) {
              case "en":
                value = "English";
                break;
                case "pt":
                  value = "Portuguese";
                  break;
                case "es":
                  value = "Spanish"; 
                  break;
                case "ru":
                  value = "Russian";
                  break;
                case "tr":
                  value = "Turkish";
                  break;
                case "fr":
                  value = "French";
                  break;
                      default:
                      break;
                      }
          setInput(prev=>{
              return{
                ...prev,
                language:value,
              }
            })
          } else{
            // console.log("nothing")
          }
        }
            
            
      //Translator Model
      async function languageTranslation(prop){
        // console.log(prop.initialLanguage)
        // console.log(prop.value)
        // console.log(prop.text)


        const translatorCapabilities = await window.self.ai.translator.capabilities();
        translatorCapabilities.languagePairAvailable('es', 'fr');
            
            
          try{

            const translator = await window.self.ai.translator.create({
              sourceLanguage: prop.initialLanguage,
              targetLanguage: prop.value,
              monitor(m) {
                m.addEventListener('downloadprogress', (e) => {
                  console.log(`Downloaded ${e.loaded} of ${e.total} bytes.`);
                });
              },
            });
            const translatedText = await translator.translate(prop.text);
            // console.log(translatedText)
            setTranslationText(translatedText)
                  
            saveOutput[prop.id].trans =translatedText;
          }
          catch(e){
            alert("Theres a problem with the translation")
          }
        }
                    
                    
        //Summarizer Model
        const options = {
            sharedContext: 'This is a scientific article',
            type: 'headline',
            format: 'plain-text',
            length: 'short',
          };
                      
          async function Summarizer(val,index){
            console.log(val)
            console.log(index)

           
            const available = (await window.self.ai.summarizer.capabilities()).available;
            let summarizer;
            if (available === 'no') {
                console.log("summarizer api is not working")
                            // The Summarizer API isn't usable.
                return;
              }
              if (available === 'readily') {
              console.log("summarizer api is working")
              // The Summarizer API can be used immediately .
              summarizer = await window.self.ai.summarizer.create(options);
            } else {
                console.log("summarizer api will work, just has to download some sturfs")
                            
                // The Summarizer API can be used after the model is downloaded.
                summarizer = await window.self.ai.summarizer.create(options);
                summarizer.addEventListener('downloadprogress', (e) => {
            console.log(e.loaded, e.total);
          });
          await summarizer.ready;
        }

        const longText = val

        setLoading(true)
        saveOutput[index].trans = "Loading Summary.."

        const summary = await summarizer.summarize(longText)
        console.log(summary)


        saveOutput[index].trans = summary
        setLoading(false)
        // setLoading(false)
        // saveOutput[prop.id].trans =translatedText
      // const [saveOutput,setSaveOutput] = useState([])

      }
      


      function getText(event){
        const info = event.target.value;
        setNoOfCharacters(info.length)
        setInput(prev=>{
          return{
            ...prev,
            text:info,
            characterNumber:info.length
          }
        })

        languageDetector(info)
      }


      function summary(val,index){
      Summarizer(val,index)
      }


      function handleSubmit(){
        if (input.text.length > 0){
          setSaveOutput(prev=>{
            return[...prev,input]
          })
        } else{
          alert("please insert a text")
        }
      
      setInput({
        text:"",
        language:"",
        trans:"",
        characterNumber:0,
        error:false,
      })
      }

      function translation(value,text,language,id){
       
        let initialLanguage = ""
        switch (language) {
          case "English":
            initialLanguage = "en";
            break;
            case "Portuguese":
              initialLanguage = "pt";
              break;
            case "Spanish":
              initialLanguage = "es"; 
              break;
            case "Russian":
              initialLanguage = "ru";
              break;
            case "Turkish":
              initialLanguage = "tr";
              break;
            case "French":
             initialLanguage = "fr";
              break;
              default:
                break;
              }
              // console.log(initialLanguage)
        languageTranslation({value,text,initialLanguage,id})
      }

      // const bottomOfPanelRef = useRef<HTMLDivElement>(null)
        
      
      useEffect(()=>{
        if (bottomOfPanelRef.current){
          bottomOfPanelRef.current.scrollIntoView(
            {behavior:"smooth",inline:"nearest"}
          )
        }
      },[saveOutput,translationText,loading])
      console.log(saveOutput)
      
  return (
    <div className="App">
      <header className="header"><h1 className="header-text">NKS AI</h1></header>
      <div className="ai-powered-text-processor">
      <section className="output-section">
      {/* {loading?<h1 className="loading">Loading...</h1>:null} */}
      {saveOutput.length === 0?<div class="initial-text">
      <h2 className="hello">Hello there <span className="hand"> 👋</span></h2>
      <p className="follow-texts">Identifies written language, translates text into multiple languages, summarize long texts.</p>
      </div>:saveOutput.map((outputItem,index)=>(
              <OutputComponent array={saveOutput} summaryAction={summary} character={input.characterNumber} action={translation} trans={outputItem.trans} key={index} id={index} text={outputItem.text} language={outputItem.language}/>
            ))}
        <div ref={bottomOfPanelRef}></div>
       </section>
       <section className="input-section">
         <textarea aria-label="write-texts" value={input.text} placeholder="Write here..." onChange={getText} className="input-text"/>
         <button aria-label="send" className="send" onClick={handleSubmit}><FiSend className="sendIcon"/></button>
       </section>
     </div>
    </div>
  );
}

export default App;
