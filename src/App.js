import { useRef, useState } from 'react';
import './App.css';
import Break from './Break';
import Session from './Session';
import Timer from './Timer';
import sessiontimermp3 from './sessiontimer.mp3';
import breaktimermp3 from './breaktimer.mp3';
import playicon from './playpause.svg';
import reseticon from './reset.svg';
let stimermp3,btimermp3;
    stimermp3 = document.createElement("audio");
    btimermp3 = document.createElement("audio");
    stimermp3.id="beep";
    stimermp3.src=sessiontimermp3;
    btimermp3.id="beep2";
    btimermp3.src=breaktimermp3;

function App() {
  const [breaktimer,setBreaktimer]=useState(5);
  const [sessiontimer,setSessiontimer]=useState(25);
  const [timer,setTimer]=useState("25:00");
  const [label,setLabel]=useState("Session");
  const intervalRef=useRef(0);
  const isPaused=useRef(true);
  const tle = document.getElementById("label");
    if (timer==="00:10"&&label==="Session"){
        stimermp3.play();
        tle.setAttribute("class","beat");
    }
      // when session timer expire start break
    if (timer==="-1:-1"&&label==="Session"){
      setTimer("00:00");
      tle.setAttribute("class","")
      setLabel("Break");
      clearInterval(intervalRef.current);
      const intervalID2 = stopGo(breaktimer);
      intervalRef.current=intervalID2;
    }
    if (timer==="00:10"&&label==="Break"){
      tle.setAttribute("class","beat");
      btimermp3.play();
    }
     //when break timer expire start session
    if (timer==="-1:-1"&&label==="Break"){
      setTimer("00:00");
     tle.setAttribute("class","")
     setLabel("Session");
     clearInterval(intervalRef.current);
     const intervalID2 = stopGo(sessiontimer);
     intervalRef.current=intervalID2;
    }
    // main timer controller 
  function stopGo(time){
     let timerArr;
     let endDate;
     //resume from where the timer is pused if it was paused 
     if(isPaused.current){
      timerArr = timer.split(":");
      endDate = new Date(new Date().getTime()+(parseInt(timerArr[0])*60000)+(parseInt(timerArr[1])*1000));
      //start timer based on time argument
     }else{
     endDate = new Date(new Date().getTime()+time*60000);
     }
       const intervalID = setInterval(()=>{
       let diff =new Date(endDate.getTime()-new Date()).getTime()+50;
       let seconds = Math.floor((diff/1000)%60);
       let minuts = Math.floor((diff/60000)%60);
       if (seconds.toString().length<2){
         seconds="0"+seconds;
       }
       if (minuts.toString().length<2){
         minuts="0"+minuts;
       }
       document.title=minuts+":"+seconds;
       setTimer(minuts+":"+seconds);
     },1000);
     return intervalID;
  }

  const handleStart=()=>{
    if (!stimermp3.paused){
      stimermp3.pause();
      stimermp3.currentTime=0;
    }
    if (!btimermp3.paused){
      btimermp3.pause();
      btimermp3.currentTime=0;
    }
    // pause if there is an interval set
    if(intervalRef.current){
         clearInterval(intervalRef.current);
         intervalRef.current=0;
         isPaused.current=true;
         return;
   }
   //start the timer for the first time
    if((label==="Session"&&!intervalRef.current&&isPaused.current)){
    const intervalID = stopGo(sessiontimer);
    intervalRef.current=intervalID;
    isPaused.current=false;
    }
    //resume the timer on break
     if (label==="Break"&&!intervalRef.current&&isPaused.current){
      const intervalID = stopGo(breaktimer);
      intervalRef.current=intervalID;
      isPaused.current=false;
     }
   }

   const handleReset=()=>{
    setBreaktimer(5);
    clearInterval(intervalRef.current);
    setSessiontimer(25);
    intervalRef.current=0;
    setTimer("25:00");
    isPaused.current=true;
    setLabel("Session");
  }
   const handleSincrement=()=>{
     // dont increment if timer running or exceeded the limit
    if (sessiontimer>=60||!isPaused.current){
      return;
    }
    setSessiontimer((prev)=>{
      // if increasing the session while the session timer is in display then update the timer in view 
      if(label==="Session"){
        setTimer((prev+1).toString().length<2?"0"+(prev+1)+":00":(prev+1)+":00");
      }
      //anyway increase session timer
      return prev+1;
    });
   }
   const handleSdecrement=()=>{
     // dont decrease if timer running or less than the limit
    if (sessiontimer<=1||!isPaused.current){
      return;
    }
    setSessiontimer((prev)=>{
      if(label==="Session"){
        setTimer((prev-1).toString().length<2?"0"+(prev-1)+":00":(prev-1)+":00");
      }
      return prev-1;
    });
   }
   const handleBincrement=()=>{
     // dont increment if timer running or exceeded the limit
    if (breaktimer>=60||!isPaused.current){
      return;
    }
    setBreaktimer((prev)=>{
       // if increasing the break while the break timer is in display then update the timer in view 
      if(label==="Break"){
      setTimer((prev+1).toString().length<2?"0"+(prev+1)+":00":(prev+1)+":00");
      }
      //anyway increase session timer
      return prev+1;
    });
   }
   const handleBdecrement=()=>{
     // dont decrease if timer running or less than the limit
    if (breaktimer<=1||!isPaused.current){
      return;
    }
    setBreaktimer((prev)=>{
      // if decreasing the break while the break timer is in display then update the timer in view
      if(label==="Break"){
        setTimer((prev-1).toString().length<2?"0"+(prev-1)+":00":(prev-1)+":00");
      }
      // anyway decrease the break timer
      return prev-1;
    });
  }
  return (
    <div className="App">
      <header className="App-header">
      <div>25+5 Clock</div>
      <div style={{display:"flex",flexDirection:"row"}}>
      <Session stimer={sessiontimer} handleup={handleSincrement} handledown={handleSdecrement} />
      <Break btimer={breaktimer} handledown={handleBdecrement} handleup={handleBincrement}/>
      </div>
      <Timer countdown={timer} label={label}/>
      <div style={{display:"inline",marginTop:"20px"}}>
      <button  id="start_stop" onClick={handleStart}><img width="20px" src={playicon} alt="play and pause icon"></img></button>
      <button  id="reset" onClick={handleReset}><img width="20px" src={reseticon} alt="reset icon"></img></button>
      </div>
      </header>
    </div>
  );
}

export default App;
